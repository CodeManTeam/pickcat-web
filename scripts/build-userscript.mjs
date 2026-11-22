#!/usr/bin/env node
/**
 * 把 web/ 里的旧 UI（Pickcat-Reborn）打包成可独立安装的油猴脚本。
 *
 *   node scripts/build-userscript.mjs
 *
 * 产物：dist/pickcat-mobile.user.js
 *
 * 设计要点
 *  - 图片全部内联成 data URI，脚本不依赖本仓库的服务器（测试站关掉也能用）；
 *  - 运行时只做同源 /api/v1 请求，自动复用 pickcat.dao3.fun 上已有的登录 Cookie；
 *  - 没有 server.mjs 的 /proxy/media、/moss 反代，所以构建时把这两处换成直连；
 *  - 官方站 CSP 只限制 script-src，所以 UI 直接注入宿主 DOM（不套 iframe），
 *    脚本本体跑在油猴沙箱里，不受 CSP 影响。
 */
import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import { join, dirname, extname, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');
const WEB = join(ROOT, 'web');
const DIST = join(ROOT, 'dist');

const VERSION = process.env.PICKCAT_UA_VERSION || '1.0.0';
const UPDATE_BASE =
  'https://raw.githubusercontent.com/CodeManTeam/pickcat-web/master/dist/pickcat-mobile.user.js';

const MIME = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

const HOST_CSS = `
/* 旧版 UI 挂载后隐藏官方 Nuxt 界面 */
#__nuxt, #teleports { display: none !important; }
html, body {
  height: auto !important;
  overflow-y: auto !important;
  overflow-x: hidden !important;
  background: #dde6f3 !important;
  overscroll-behavior-y: contain;
}
html.pc-ua-on body { margin: 0 !important; }
`;

/* ------------------------------------------------------------------ */
/* 读取源码                                                            */
/* ------------------------------------------------------------------ */

// 仓库在 Windows 上可能是 CRLF / 带 BOM，统一成干净的 LF 再打补丁
const normalize = (text) => text.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n');

const sources = {
  index: normalize(await readFile(join(WEB, 'index.html'), 'utf8')),
  css: normalize(await readFile(join(WEB, 'styles.css'), 'utf8')),
  auth: normalize(await readFile(join(WEB, 'auth.js'), 'utf8')),
  login: normalize(await readFile(join(WEB, 'login.js'), 'utf8')),
  api: normalize(await readFile(join(WEB, 'api-official.js'), 'utf8')),
  app: normalize(await readFile(join(WEB, 'app.js'), 'utf8')),
  glue: normalize(await readFile(join(ROOT, 'userscript', 'glue.js'), 'utf8')),
};

/* ------------------------------------------------------------------ */
/* 1. 把 web/public/assets 全部转成 data URI                            */
/* ------------------------------------------------------------------ */

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}

const ASSET_DIR = join(WEB, 'public', 'assets');
const assetFiles = await walk(ASSET_DIR);
const assets = new Map();
for (const file of assetFiles) {
  const relPath = 'public/assets/' + relative(ASSET_DIR, file).split(sep).join('/');
  const mime = MIME[extname(file).toLowerCase()] || 'application/octet-stream';
  const data = await readFile(file);
  assets.set(relPath, `data:${mime};base64,${data.toString('base64')}`);
}

let assetBytes = 0;
for (const uri of assets.values()) assetBytes += uri.length;

function inlineAssets(text) {
  let out = text;
  for (const [path, uri] of assets) {
    if (!out.includes(path)) continue;
    out = out.split(path).join(uri);
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* 2. 取出 index.html 的 body 内容，去掉 <script>                       */
/* ------------------------------------------------------------------ */

const bodyMatch = sources.index.match(/<body[^>]*>([\s\S]*)<\/body>/i);
if (!bodyMatch) throw new Error('web/index.html 里找不到 <body>');

let markup = bodyMatch[1]
  .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
  .trim();

markup = inlineAssets(markup);

/* ------------------------------------------------------------------ */
/* 3. 针对「没有服务端反代」做的最小改动                                 */
/* ------------------------------------------------------------------ */

function patch(text, from, to, label) {
  if (!text.includes(from)) throw new Error(`补丁未命中：${label}`);
  return text.split(from).join(to);
}

let css = inlineAssets(sources.css);

let app = inlineAssets(sources.app);

// 3.1 封面/头像直连 CDN（宿主站没有 /proxy/media）
app = patch(
  app,
  `    if (!shouldProxy) return target.toString();
    return \`\${location.origin}/proxy/media?url=\${encodeURIComponent(target.toString())}\`;`,
  `    return target.toString();`,
  'proxyMediaUrl 直连'
);

// 3.2 MOSS 没有 /moss 反代：直接用官方签名地址，在同源官方站里 iframe 播放
app = patch(
  app,
  `/** MOSS 会话：调用 /moss/sso 用 PICKCAT 会话换 MOSS Cookie（同站反代后 iframe 才拿得到） */
async function ensureMossSession() {
  if (state.mossSso === "ok") return true;
  try {
    const res = await fetch("/moss/sso", { headers: { Accept: "application/json" } });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data.ok) {
      state.mossSso = "ok";
      return true;
    }
    state.mossSso = "fail";
    state.mossSsoMessage = data.message || "MOSS 单点登录未完成，请先登录 PICKCAT";
    return false;
  } catch (err) {
    state.mossSso = "fail";
    state.mossSsoMessage = err.message;
    return false;
  }
}`,
  `/** 油猴版：没有 /moss 反代，直接用官方下发（带签名）的播放地址 */
async function ensureMossSession() {
  state.mossSso = "ok";
  return true;
}`,
  'ensureMossSession 直连'
);

// 3.3 宿主站是 Nuxt SPA，返回键不要再触发 history.back（会退到官方页面）
app = patch(
  app,
  `    if (location.search && history.length > 1) {
      history.back();
    } else {
      navigateLocal(state.previousView || "home", {}, { direction: "back" });
    }`,
  `    navigateLocal(state.previousView || "home", {}, { direction: "back" });`,
  '返回键走站内路由'
);

let api = inlineAssets(sources.api);

// 3.4 MOSS 播放地址不再改写成本站 /moss 路径
api = patch(
  api,
  `  function toMossProxy(url) {
    if (!url) return '';
    if (url.startsWith(MOSS_ORIGIN)) return MOSS_PROXY + url.slice(MOSS_ORIGIN.length);
    return url;
  }`,
  `  function toMossProxy(url) {
    // 油猴版：直接用官方地址（本页就是 pickcat.dao3.fun，Origin 天然合法）
    return url || '';
  }`,
  'toMossProxy 直连'
);

let auth = inlineAssets(sources.auth);

// 3.5 不复写官方 Cookie（可能是 HttpOnly），登录态完全交给官方站
auth = patch(
  auth,
  `  function restore() {
    if (readCookie(COOKIE_NAME)) return true;
    const backup = readBackup();
    if (!backup) return false;
    writeCookie(COOKIE_NAME, backup);
    return true;
  }`,
  `  function restore() {
    // 油猴版：直接复用官方站登录态，不写 Cookie，避免覆盖官方会话
    return true;
  }`,
  'restore 不写 Cookie'
);

auth = patch(
  auth,
  `    status: async () => {
      restore();
      if (!readCookie(COOKIE_NAME) && !readBackup()) return { connected: false };
      return fetchSession();
    },`,
  `    status: async () => {
      // 油猴版：Cookie 可能是 HttpOnly，读不到也直接问接口
      return fetchSession();
    },`,
  'status 直接查会话'
);

const appBody = [auth, sources.login, api, app].join('\n\n');

/* ------------------------------------------------------------------ */
/* 4. 组装                                                             */
/* ------------------------------------------------------------------ */

const icon = assets.get('public/assets/pickcat/ic_home_logo.png') || '';

const header = `// ==UserScript==
// @name         PICKCAT 移动版旧 UI
// @name:en      PICKCAT Mobile Legacy UI
// @namespace    https://github.com/CodeManTeam/pickcat-web
// @version      ${VERSION}
// @description  在 pickcat.dao3.fun 上直接用 Pickcat-Reborn 的手机版旧界面：同源调用官方 /api/v1，自动复用官方登录态，支持首页/喵圈/搜索/帖子/作品/用户/消息/发布。
// @author       CodeManTeam
// @match        https://pickcat.dao3.fun/*
// @match        https://www.pickcat.dao3.fun/*
// @run-at       document-start
// @noframes
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @icon         ${icon}
// @homepageURL  https://github.com/CodeManTeam/pickcat-web
// @supportURL   https://github.com/CodeManTeam/pickcat-web/issues
// @downloadURL  ${UPDATE_BASE}
// @updateURL    ${UPDATE_BASE}
// @license      MIT
// ==/UserScript==
`;

function jsonString(value) {
  return JSON.stringify(value);
}

let glue = sources.glue
  .replace('__MARKUP__', () => jsonString(markup))
  .replace('__APP_CSS__', () => jsonString(css))
  .replace('__HOST_CSS__', () => jsonString(HOST_CSS))
  .replace('__VERSION__', () => VERSION.replace(/'/g, "\\'"))
  .replace('__APP_BODY__', () => appBody);

const output = `${header}
(function () {
${glue}
})();
`;

await mkdir(DIST, { recursive: true });
const target = join(DIST, 'pickcat-mobile.user.js');
await writeFile(target, output, 'utf8');

const kb = (n) => (n / 1024).toFixed(0) + ' KB';
console.log('构建完成：' + relative(ROOT, target));
console.log(`  版本      ${VERSION}`);
console.log(`  体积      ${kb(Buffer.byteLength(output))}`);
console.log(`  内联资源  ${assets.size} 个（${kb(assetBytes)}）`);
console.log(`  标记      ${kb(Buffer.byteLength(markup))}`);
console.log(`  样式      ${kb(Buffer.byteLength(css))}`);
console.log(`  应用代码  ${kb(Buffer.byteLength(appBody))}`);
