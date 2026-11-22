/**
 * PICKCAT 正式网页版 —— 本地服务
 *
 * 职责：
 *  1. 静态站点托管（web/）
 *  2. `/api/v1/*` 同源反代到 https://pickcat.dao3.fun（解决 CORS + 把会话 Cookie 收在服务端）
 *  3. 会话桥 `/__session`：把浏览器/用户手里的 pickcat_session 写入、校验、清理
 *  4. 兼容层 `/legacy/*`：把 Pickcat-Reborn 旧接口逐条映射到官方接口
 *  5. `/__routes` `/legacy/openapi.json`：官方 119 条路由清单（迁移核对用）
 *
 * 零第三方依赖，Node >= 20。
 */
import http from 'node:http';
import https from 'node:https';
import { readFile, writeFile, mkdir, appendFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { extname, join, normalize, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ROUTES, ROUTE_GROUPS } from './lib/api-endpoints.js';

const HERE = dirname(fileURLToPath(import.meta.url));
const WEB_DIR = join(HERE, 'web');

const PORT = Number(process.env.PORT || 4173);
const HOST = process.env.HOST || '127.0.0.1';
const UPSTREAM = (process.env.PICKCAT_BASE_URL || 'https://pickcat.dao3.fun').replace(/\/$/, '');
const httpsRequest = https.request;
const COOKIE_NAME = 'pickcat_session';
const UA =
  process.env.PICKCAT_USER_AGENT ||
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/159.0.0.0 Safari/537.36';

// ---------------------------------------------------------------------------
// 会话存储
// ---------------------------------------------------------------------------

/**
 * 登录态由浏览器 Cookie 保管（见 web/auth.js）。
 * 服务端只在启动时读一次 PICKCAT_SESSION 作为兜底（方便 curl / CI），不落盘、不写文件。
 */
let sessionState = { cookie: process.env.PICKCAT_SESSION || null, user: null, updatedAt: null };

async function clearSession() {
  sessionState = { cookie: null, user: null, updatedAt: null };
}

function maskCookie(cookie) {
  if (!cookie) return null;
  if (cookie.length <= 12) return cookie.slice(0, 2) + '***';
  return cookie.slice(0, 6) + '…' + cookie.slice(-4);
}

// ---------------------------------------------------------------------------
// 上游请求
// ---------------------------------------------------------------------------

/**
 * @returns {Promise<{status:number, headers:Record<string,string>, body:Buffer}>}
 */
function upstreamRaw(path, { method = 'GET', headers = {}, body = null, timeout = 30000, cookie, origin } = {}) {
  return new Promise((resolvePromise, reject) => {
    const url = new URL(path, (origin || UPSTREAM) + '/');
    const finalHeaders = {
      'User-Agent': UA,
      'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
      Origin: UPSTREAM,
      Referer: UPSTREAM + '/',
      ...headers,
      ...(origin ? { Origin: origin, Referer: origin + '/' } : {}),
    };
    // 登录态优先级：调用方显式传入 > 浏览器 Cookie > 服务端兜底（环境变量）
    if (!finalHeaders.Cookie) {
      const sessionCookie = cookie || sessionState.cookie;
      if (sessionCookie) finalHeaders.Cookie = `${COOKIE_NAME}=${sessionCookie}`;
    }
    const req = https.request(
      url,
      { method, headers: finalHeaders, timeout },
      (res) => {
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => {
          resolvePromise({ status: res.statusCode || 502, headers: res.headers, body: Buffer.concat(chunks) });
        });
      },
    );
    req.on('timeout', () => req.destroy(new Error('upstream timeout')));
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

/** JSON 便捷版：解析上游响应，并把上游轮换的 cookie 存下来 */
async function upstreamJson(path, opts = {}) {
  const res = await upstreamRaw(path, opts);
  adoptSetCookie(res.headers['set-cookie']);
  let data = null;
  const text = res.body.toString('utf8');
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }
  }
  return { status: res.status, data, headers: res.headers };
}

/** 上游轮换的 Cookie 由浏览器保管，这里不再保存 */
function adoptSetCookie() {}

// ---------------------------------------------------------------------------
// HTTP 工具
// ---------------------------------------------------------------------------

function sendJson(res, status, data) {
  const body = Buffer.from(JSON.stringify(data), 'utf8');
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': body.length,
    'Cache-Control': 'no-store',
  });
  res.end(body);
}

function readBody(req, limit = 8 * 1024 * 1024) {
  return new Promise((resolvePromise, reject) => {
    const chunks = [];
    let size = 0;
    req.on('data', (c) => {
      size += c.length;
      if (size > limit) {
        reject(new Error('body too large'));
        req.destroy();
        return;
      }
      chunks.push(c);
    });
    req.on('end', () => resolvePromise(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

async function readJson(req) {
  const raw = await readBody(req);
  if (!raw.length) return {};
  try {
    return JSON.parse(raw.toString('utf8'));
  } catch {
    throw new Error('请求体不是合法 JSON');
  }
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.md': 'text/markdown; charset=utf-8',
  '.woff2': 'font/woff2',
};

// ---------------------------------------------------------------------------
// 兼容层：Pickcat-Reborn 旧接口 → 官方接口
// ---------------------------------------------------------------------------

const REBORN_BOARDS = [
  { id: 'interest-plaza', slug: 'interest-plaza', title: '兴趣广场', name: '兴趣广场' },
  { id: 'creation', slug: 'creation', title: '创作交流', name: '创作交流' },
  { id: 'tutorial', slug: 'tutorial', title: '教程攻略', name: '教程攻略' },
  { id: 'chat', slug: 'chat', title: '闲聊灌水', name: '闲聊灌水' },
];

function shapeTopicSummary(t) {
  return {
    id: t.id,
    title: t.title,
    kind: t.kind,
    excerpt: t.excerpt || '',
    author: t.author,
    tags: t.tags || [],
    replyCount: t.replyCount ?? 0,
    viewCount: t.viewCount ?? 0,
    likeCount: t.likeCount ?? 0,
    bookmarkCount: t.bookmarkCount ?? 0,
    pinned: !!t.pinned,
    closedAt: t.closedAt ?? null,
    createdAt: t.createdAt,
    lastActivityAt: t.lastActivityAt,
  };
}

/** 游标式 topics 分页：把 Reborn 的 offset/limit 语义映射过去 */
async function topicsPage({ tag, sort = 'latest', cursor, limit = 20, kind }) {
  const query = {};
  if (tag) query.tag = tag;
  if (sort) query.sort = sort;
  if (cursor) query.cursor = cursor;
  if (kind) query.kind = kind;
  query.limit = limit;
  const { status, data } = await upstreamJson('/api/v1/topics?' + new URLSearchParams(query).toString());
  if (status !== 200) throw Object.assign(new Error(data?.message || '获取话题失败'), { status, data });
  return data;
}

async function collectTopics({ tag, sort = 'latest', offset = 0, limit = 8, kind }) {
  const want = offset + limit;
  const collected = [];
  let cursor = null;
  for (let guard = 0; guard < 8 && collected.length < want; guard++) {
    const page = await topicsPage({ tag, sort, cursor, limit: Math.min(50, Math.max(limit, 20)), kind });
    const items = (page.items || []).map(shapeTopicSummary);
    collected.push(...items);
    const next = page.pageInfo?.nextCursor;
    if (!next || !page.pageInfo?.hasNextPage) break;
    cursor = next;
  }
  return {
    items: collected.slice(offset, offset + limit),
    total: collected.length,
    hasMore: collected.length > offset + limit,
    offset,
    limit,
  };
}

async function handleLegacy(req, res, url) {
  const p = url.pathname.replace(/^\/legacy/, '');
  const method = req.method || 'GET';

  // Reborn: GET /web/forums/boards/simples/all
  if (p === '/forums/boards/simples/all' && method === 'GET') {
    const boards = new Map(REBORN_BOARDS.map((b) => [b.slug, { ...b }]));
    try {
      const page = await topicsPage({ limit: 50 });
      for (const t of page.items || []) {
        for (const tag of t.tags || []) {
          if (!tag?.slug) continue;
          if (!boards.has(tag.slug)) {
            boards.set(tag.slug, { id: tag.slug, slug: tag.slug, title: tag.name, name: tag.name, tagId: tag.id });
          }
        }
      }
    } catch {
      /* 官方接口异常时退回内置板块表 */
    }
    return sendJson(res, 200, { items: [...boards.values()], source: 'official:/topics.tags' });
  }

  // Reborn: GET /web/forums/boards/<boardId>/posts?offset=0&limit=8
  const boardMatch = p.match(/^\/forums\/boards\/([^/]+)\/posts$/);
  if (boardMatch && method === 'GET') {
    const boardId = decodeURIComponent(boardMatch[1]);
    const offset = Number(url.searchParams.get('offset') || 0);
    const limit = Number(url.searchParams.get('limit') || 8);
    const sort = normalizeSort(url.searchParams.get('sort'));
    const data = await collectTopics({ tag: boardId, sort, offset, limit });
    return sendJson(res, 200, { boardId, ...data });
  }

  // Reborn: GET /web/forums/posts/search?title=<kw>&page=1&limit=20
  if (p === '/forums/posts/search' && method === 'GET') {
    const title = (url.searchParams.get('title') || url.searchParams.get('q') || '').trim();
    const page = Math.max(1, Number(url.searchParams.get('page') || 1));
    const limit = Math.max(1, Number(url.searchParams.get('limit') || 20));
    // 官方没有「话题搜索」接口，仅有 /search/works 与 /search/users。
    // 降级策略：拉取最新话题流做本地标题匹配（见 docs/api-migration.md「缺失接口降级表」）。
    const pool = await collectTopics({ sort: 'latest', offset: 0, limit: 100 });
    const items = title
      ? pool.items.filter((t) => (t.title || '').toLowerCase().includes(title.toLowerCase()))
      : pool.items;
    const start = (page - 1) * limit;
    return sendJson(res, 200, {
      items: items.slice(start, start + limit),
      page,
      limit,
      total: items.length,
      degraded: true,
      source: 'official:/topics?sort=latest + 本地标题过滤',
    });
  }

  // Reborn: GET /web/forums/posts/<postId>/details
  const detailMatch = p.match(/^\/forums\/posts\/([^/]+)\/details$/);
  if (detailMatch && method === 'GET') {
    const topicId = decodeURIComponent(detailMatch[1]);
    const [topicRes, postsRes] = await Promise.all([
      upstreamJson(`/api/v1/topics/${encodeURIComponent(topicId)}`),
      upstreamJson(`/api/v1/topics/${encodeURIComponent(topicId)}/posts?limit=50`),
    ]);
    if (topicRes.status !== 200) return sendJson(res, topicRes.status, topicRes.data);
    return sendJson(res, 200, {
      details: topicRes.data,
      posts: postsRes.status === 200 ? postsRes.data.items || [] : [],
      pageInfo: postsRes.status === 200 ? postsRes.data.pageInfo : null,
      source: ['official:/topics/{topicId}', 'official:/topics/{topicId}/posts'],
    });
  }

  // Reborn: POST /tiger/v3/web/accounts/login
  if (p === '/login' || p === '/tiger/v3/web/accounts/login') {
    if (method !== 'POST') return sendJson(res, 405, { message: '仅支持 POST' });
    const body = await readJson(req);
    const { account, password, captchaVerifyParam } = body || {};
    if (!captchaVerifyParam) {
      // 官方 POST /api/v1/session 强制要求阿里云验证码 2.0 的 captchaVerifyParam，
      // 纯 HTTP 无法稳定伪造 → 引导走两条可行路径。
      return sendJson(res, 400, {
        ok: false,
        code: 'CAPTCHA_REQUIRED',
        message: '官方登录接口要求阿里云验证码 captchaVerifyParam',
        options: [
          {
            id: 'browser-login',
            title: '浏览器登录后导入会话（推荐）',
            steps: [
              '在 https://pickcat.dao3.fun/login 完成滑块登录',
              'DevTools → Application → Cookies → 复制 pickcat_session 的值',
              '本机执行：curl -X PUT http://127.0.0.1:' + PORT + '/__session -H "Content-Type: application/json" -d "{\\"cookie\\":\\"<值>\\"}"',
              '或在网页「设置 → 连接账号」里粘贴',
            ],
          },
          {
            id: 'captcha-param',
            title: '携带 captchaVerifyParam 转发',
            body: { account: 'TARGET_ACCOUNT', password: 'TARGET_PASSWORD', captchaVerifyParam: 'ALIYUN_TOKEN' },
          },
        ],
      });
    }
    const upstream = await upstreamJson('/api/v1/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: Buffer.from(JSON.stringify({ account, password, captchaVerifyParam }), 'utf8'),
    });
    if (upstream.status === 201 || upstream.status === 202) {
      const setCookies = rewriteSetCookie(upstream.headers['set-cookie']);
      const out = { ok: true, user: upstream.data?.user ?? null, upstreamStatus: upstream.status };
      const body = Buffer.from(JSON.stringify(out), 'utf8');
      const headers = { 'Content-Type': 'application/json; charset=utf-8', 'Content-Length': body.length };
      // 把官方下发的会话 Cookie 交给浏览器保管（客户端登录态）
      if (setCookies.length) headers['Set-Cookie'] = setCookies;
      res.writeHead(200, headers);
      return res.end(body);
    }
    return sendJson(res, upstream.status, { ok: false, upstream: upstream.data });
  }

  // Reborn: creation-tools/v1/user/center/work-list
  if (p === '/works/mine' || p === '/creation-tools/v1/user/center/work-list') {
    if (method !== 'GET') return sendJson(res, 405, { message: '仅支持 GET' });
    const me = await upstreamJson('/api/v1/session');
    if (me.status !== 200 || !me.data?.user?.id) {
      return sendJson(res, 401, { message: '需要登录会话', howto: 'PUT /__session {cookie}' });
    }
    const limit = Number(url.searchParams.get('limit') || 20);
    const cursor = url.searchParams.get('cursor') || undefined;
    const q = new URLSearchParams({ limit: String(limit) });
    if (cursor) q.set('cursor', cursor);
    const list = await upstreamJson(`/api/v1/users/${me.data.user.id}/works?${q}`);
    return sendJson(res, list.status, { ...list.data, source: 'official:/users/{userId}/works' });
  }

  // Reborn: /proxy/codemao/* 等透传代理
  if (p.startsWith('/proxy/')) {
    const rest = (p.slice('/proxy/'.length) + (url.search || '')).replace(/^\/+/, '');
    // `api/v1/xxx` 直接用；其它按官方 API 根拼接，兼容 Reborn 里不带前缀的写法
    const target = rest.startsWith('api/')
      ? '/' + rest
      : rest.startsWith('v1/')
        ? '/api/' + rest
        : '/api/v1/' + rest;
    const upstream = await upstreamRaw(target, {
      method,
      body: method === 'GET' || method === 'HEAD' ? null : await readBody(req),
      headers: { 'Content-Type': req.headers['content-type'] || 'application/json' },
    });
    res.writeHead(upstream.status, {
      'Content-Type': upstream.headers['content-type'] || 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    });
    return res.end(upstream.body);
  }

  return sendJson(res, 404, {
    message: '未知的兼容接口',
    known: [
      'GET  /legacy/forums/boards/simples/all',
      'GET  /legacy/forums/boards/:boardId/posts?offset&limit&sort',
      'GET  /legacy/forums/posts/search?title&page&limit',
      'GET  /legacy/forums/posts/:postId/details',
      'POST /legacy/login',
      'GET  /legacy/works/mine',
      'ANY  /legacy/proxy/*',
    ],
  });
}

function normalizeSort(sort) {
  const allowed = new Set(['relevance', 'latest', 'hot']);
  return allowed.has(sort) ? sort : 'latest';
}

// ---------------------------------------------------------------------------
// 路由分发
// ---------------------------------------------------------------------------

/** 把上游 Set-Cookie 改写成「本机同源」的 Cookie，交给浏览器保管 */
function rewriteSetCookie(setCookie) {
  const list = Array.isArray(setCookie) ? setCookie : setCookie ? [setCookie] : [];
  return list.map((line) =>
    line
      .replace(/;\s*Domain=[^;]*/gi, '')
      .replace(/;\s*Secure/gi, '')
      .replace(/;\s*SameSite=[^;]*/gi, '; SameSite=Lax'),
  );
}

async function handleApiProxy(req, res, url) {
  const method = req.method || 'GET';
  const hasBody = !['GET', 'HEAD', 'OPTIONS'].includes(method);
  const body = hasBody ? await readBody(req) : null;
  const headers = { Accept: req.headers['accept'] || 'application/json' };
  if (req.headers['content-type']) headers['Content-Type'] = req.headers['content-type'];
  if (req.headers['idempotency-key']) headers['Idempotency-Key'] = req.headers['idempotency-key'];

  // 客户端登录态：浏览器带来的 Cookie（或显式 X-Pickcat-Session）原样转发给官方
  const explicit = req.headers['x-pickcat-session'];
  const browserCookie = explicit ? String(explicit) : forwardCookie(req.headers.cookie);

  const upstream = await upstreamRaw(url.pathname + (url.search || ''), {
    method,
    headers,
    body,
    cookie: browserCookie,
  });

  const outHeaders = {
    'Content-Type': upstream.headers['content-type'] || 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  };
  if (upstream.headers['content-length'] && !upstream.headers['content-encoding']) {
    outHeaders['Content-Length'] = upstream.body.length;
  }
  // 上游轮换的会话 Cookie 直接回写给浏览器（客户端自己保管）
  const setCookies = rewriteSetCookie(upstream.headers['set-cookie']);
  if (setCookies.length) outHeaders['Set-Cookie'] = setCookies;

  res.writeHead(upstream.status, outHeaders);
  res.end(upstream.body);
}

/** 从浏览器 Cookie 头里取出 pickcat_session */
function pickCookie(header) {
  if (!header) return '';
  for (const part of String(header).split(';')) {
    const [k, ...rest] = part.trim().split('=');
    if (k === COOKIE_NAME) return rest.join('=');
  }
  return '';
}

/**
 * 转发给官方站的 Cookie 白名单
 *
 * 除了会话，官方还会下发 `pickcat_recommendation_subject`（匿名推荐主体，决定游标绑定与
 * 已看过去重）以及 MOSS 的几个 Cookie。只取自己站点的 cookie 名，避免把无关 Cookie 带上去。
 */
function forwardCookie(header) {
  if (!header) return '';
  const keep = [];
  for (const part of String(header).split(';')) {
    const pair = part.trim();
    if (!pair) continue;
    const name = pair.split('=')[0];
    if (!name) continue;
    if (
      name === COOKIE_NAME ||
      name.startsWith('pickcat_') ||
      name.startsWith('__Host-') ||
      name.startsWith('__Secure-') ||
      /moss/i.test(name)
    ) {
      keep.push(pair);
    }
  }
  return keep.join('; ');
}

/**
 * 会话桥（客户端优先）
 *
 * 登录态默认由浏览器 Cookie 保管，这里只负责：
 *  - GET  校验当前 Cookie → 返回 user / expired
 *  - PUT  接收一段 Cookie 文本，校验后返回 user（是否落盘由客户端决定）
 *  - DELETE 清掉服务端兜底会话
 */
async function handleSession(req, res) {
  const explicit = req.headers['x-pickcat-session'];
  const browserCookie = pickCookie(req.headers.cookie);
  const cookie = explicit ? String(explicit) : browserCookie || sessionState.cookie;

  if (req.method === 'GET') {
    if (!cookie) return sendJson(res, 200, { connected: false, clientSide: true });
    const { status, data } = await upstreamJson('/api/v1/session', { cookie });
    if (status === 200 && data && data.user) {
      return sendJson(res, 200, { connected: true, user: data.user, raw: data });
    }
    if (status === 401) return sendJson(res, 200, { connected: false, expired: true });
    return sendJson(res, 200, { connected: false, status });
  }

  if (req.method === 'PUT' || req.method === 'POST') {
    const body = await readJson(req);
    let value = typeof body.cookie === 'string' ? body.cookie.trim() : '';
    if (value.toLowerCase().startsWith(COOKIE_NAME + '=')) value = value.slice(COOKIE_NAME.length + 1);
    if (value.includes(';')) {
      const hit = value.split(';').map((s) => s.trim()).find((s) => s.startsWith(COOKIE_NAME + '='));
      value = hit ? hit.slice(COOKIE_NAME.length + 1) : value.split(';')[0];
    }
    value = value.split(';')[0].trim();
    if (!value) return sendJson(res, 400, { message: '缺少 cookie 字段' });
    const { status, data } = await upstreamJson('/api/v1/session', { cookie: value });
    if (status === 200 && data && data.user) {
      return sendJson(res, 200, { connected: true, user: data.user, raw: data });
    }
    return sendJson(res, 401, { connected: false, status, message: '会话无效或已过期', upstream: data });
  }

  if (req.method === 'DELETE') {
    await clearSession();
    return sendJson(res, 200, { connected: false });
  }

  return sendJson(res, 405, { message: 'Method Not Allowed' });
}
/** /lib/* 由项目根目录的 lib/ 提供（前后端共用同一份接口定义） */
function resolveStatic(pathname) {
  if (pathname.startsWith('/lib/')) {
    return resolve(join(HERE, normalize(pathname).replace(/^(\.\.[/\\])+/, '')));
  }
  return resolve(join(WEB_DIR, normalize(pathname).replace(/^(\.\.[/\\])+/, '')));
}

async function serveStatic(req, res, url) {
  let rel = decodeURIComponent(url.pathname);
  if (rel === '/' || rel === '') rel = '/index.html';
  let file = resolveStatic(rel);
  const allowed = rel.startsWith('/lib/') ? resolve(join(HERE, 'lib')) : resolve(WEB_DIR);
  if (!file.startsWith(allowed)) {
    res.writeHead(403).end('Forbidden');
    return;
  }
  if (!existsSync(file)) {
    // SPA 回退
    file = join(WEB_DIR, 'index.html');
    if (!existsSync(file)) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('web/ 未构建');
      return;
    }
  }
  try {
    const buf = await readFile(file);
    res.writeHead(200, {
      'Content-Type': MIME[extname(file).toLowerCase()] || 'application/octet-stream',
      'Content-Length': buf.length,
      'Cache-Control': extname(file) === '.html' ? 'no-cache' : 'public, max-age=60',
    });
    res.end(buf);
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' }).end('读取失败: ' + err.message);
  }
}

/** Reborn 的 proxyMediaUrl() 会把 *.bcmcdn.com / *.codemao.cn 媒体改写到这里 */
const MEDIA_HOSTS = [
  'codemao.cn',
  'bcmcdn.com',
  'pickcat.dao3.fun',
  'moss.pickcat.dao3.fun',
  // 作品封面/头像会 302 到 OSS（codemao-pickcat.oss-cn-hangzhou.aliyuncs.com）
  'aliyuncs.com',
];

async function handleMediaProxy(req, res, url) {
  const target = url.searchParams.get('url');
  if (!target) return sendJson(res, 400, { message: '缺少 url 参数' });
  let parsed;
  try {
    parsed = new URL(target);
  } catch {
    return sendJson(res, 400, { message: 'url 不是合法地址' });
  }
  const host = parsed.hostname.toLowerCase();
  const allowed = MEDIA_HOSTS.some((h) => host === h || host.endsWith('.' + h));
  if (parsed.protocol !== 'https:' || !allowed) {
    return sendJson(res, 403, { message: '该域名不在媒体代理白名单内', host });
  }
  try {
    const fetchFollowing = (target, hop = 0) =>
      new Promise((resolvePromise, reject) => {
        const r = httpsRequest(
          target,
          { method: 'GET', headers: { 'User-Agent': UA, Referer: UPSTREAM + '/', Accept: 'image/*,*/*' } },
          (response) => {
            const status = response.statusCode || 502;
            if (status >= 300 && status < 400 && response.headers.location && hop < 3) {
              response.resume();
              const next = new URL(response.headers.location, target);
              const host2 = next.hostname.toLowerCase();
              if (!MEDIA_HOSTS.some((h) => host2 === h || host2.endsWith('.' + h))) {
                reject(new Error('重定向目标不在白名单内'));
                return;
              }
              fetchFollowing(next, hop + 1).then(resolvePromise, reject);
              return;
            }
            const chunks = [];
            response.on('data', (c) => chunks.push(c));
            response.on('end', () => resolvePromise({ status, headers: response.headers, body: Buffer.concat(chunks) }));
          },
        );
        r.on('error', reject);
        r.setTimeout(20000, () => r.destroy(new Error('media timeout')));
        r.end();
      });
    const upstream = await fetchFollowing(parsed);
    res.writeHead(upstream.status, {
      'Content-Type': upstream.headers['content-type'] || 'application/octet-stream',
      'Cache-Control': 'public, max-age=3600',
      'Content-Length': upstream.body.length,
    });
    res.end(upstream.body);
  } catch (err) {
    sendJson(res, 502, { message: '媒体代理失败: ' + err.message });
  }
}

/**
 * MOSS 播放器反向代理
 *
 * 官方 MOSS 播放器（moss.pickcat.dao3.fun）会校验 Origin，并且依赖会话 Cookie。
 * 这里把 `/moss/*` 映射到 `https://moss.pickcat.dao3.fun/*`：
 *  - Origin / Referer 固定成 MOSS 自己的源，规避 ORIGIN_NOT_ALLOWED
 *  - 转发生成时的浏览器 pickcat_session（MOSS 与 PICKCAT 同属 pickcat.dao3.fun）
 *  - HTML 里注入 <base href="/moss/"> 并把根相对链接改写到 /moss/，让子资源继续走代理
 */
async function handleMossProxy(req, res, url) {
  const method = req.method || 'GET';
  const hasBody = !['GET', 'HEAD', 'OPTIONS'].includes(method);
  const body = hasBody ? await readBody(req) : null;
  const targetPath = url.pathname.replace(/^\/moss/, '') || '/';
  const headers = {
    Accept: req.headers['accept'] || '*/*',
    Origin: 'https://moss.pickcat.dao3.fun',
    Referer: 'https://moss.pickcat.dao3.fun/',
    'Sec-Fetch-Site': 'same-origin',
  };
  if (req.headers['content-type']) headers['Content-Type'] = req.headers['content-type'];
  // 整段浏览器 Cookie 透传（MOSS 自己的会话也要能带过去，才能在 iframe 里登录 MOSS）
  if (req.headers.cookie) headers.Cookie = String(req.headers.cookie);

  const upstream = await upstreamRaw(targetPath + (url.search || ''), {
    method,
    headers,
    body,
    cookie: pickCookie(req.headers.cookie),
    timeout: 45000,
    origin: 'https://moss.pickcat.dao3.fun',
  });

  const contentType = String(upstream.headers['content-type'] || '');
  let payload = upstream.body;

  if (/text\/html/i.test(contentType)) {
    let html = payload.toString('utf8');
    // 根相对资源改写到 /moss 前缀，并补一个 base，避免子资源打到本站
    html = html.replace(/(href|src|action)="\/(?!\/|moss\/)/g, '$1="/moss/');
    // 播放器里的「前往登录」交给本站的 SSO 端点，避免跳去 pickcat 域被 X-Frame-Options 拦掉
    html = html.replace(/href="\/moss\/api\/v1\/auth\/login[^"]*"/g, 'href="/moss/sso"');
    if (/<head[^>]*>/i.test(html)) {
      html = html.replace(/<head([^>]*)>/i, '<head$1><base href="/moss/">');
    } else {
      html = `<base href="/moss/">` + html;
    }
    payload = Buffer.from(html, 'utf8');
  }

  const outHeaders = {
    'Content-Type': contentType || 'application/octet-stream',
    'Content-Length': payload.length,
    'Cache-Control': 'no-store',
  };
  if (/text\/html/i.test(contentType)) delete outHeaders['Content-Length'];
  // MOSS 登录/会话轮换的 Cookie 回写浏览器（去 Domain/Secure，保证本机可写）
  const mossCookies = rewriteSetCookie(upstream.headers['set-cookie']);
  if (mossCookies.length) outHeaders['Set-Cookie'] = mossCookies;

  res.writeHead(upstream.status, outHeaders);
  res.end(payload);
}

// ---------------------------------------------------------------------------
// MOSS SSO：用 PICKCAT 会话走一遍 OIDC，换回 MOSS 自己的会话 Cookie
//   moss /auth/login → pickcat /oidc/auth → moss /auth/callback → moss 会话
// ---------------------------------------------------------------------------

/** 单个 HTTPS 请求（不自动跟随重定向） */
function httpsFetchRaw(url, headers) {
  return new Promise((resolvePromise, reject) => {
    const req = https.request(url, { method: 'GET', headers, timeout: 20000 }, (response) => {
      const chunks = [];
      response.on('data', (c) => chunks.push(c));
      response.on('end', () =>
        resolvePromise({ status: response.statusCode || 502, headers: response.headers, body: Buffer.concat(chunks) }),
      );
    });
    req.on('error', reject);
    req.on('timeout', () => req.destroy(new Error('sso timeout')));
    req.end();
  });
}

async function runMossOidc(pickcatSession) {
  const jar = new Map();
  const addCookies = (host, setCookie) => {
    const list = Array.isArray(setCookie) ? setCookie : setCookie ? [setCookie] : [];
    const current = new Map((jar.get(host) || []).map((c) => [c.split('=')[0], c]));
    for (const line of list) {
      const pair = line.split(';')[0];
      const name = pair.split('=')[0];
      if (name) current.set(name, pair);
    }
    jar.set(host, [...current.values()]);
  };

  let url = new URL('https://moss.pickcat.dao3.fun/api/v1/auth/login?returnTo=%2Fapi%2Fv1%2Fauth%2Fplayer-complete');
  const trail = [];
  for (let hop = 0; hop < 8; hop += 1) {
    const host = url.hostname;
    const cookies = [...(jar.get(host) || [])];
    if (host === 'pickcat.dao3.fun' && pickcatSession) cookies.push(`${COOKIE_NAME}=${pickcatSession}`);
    const headers = {
      'User-Agent': UA,
      Accept: 'text/html,application/json;q=0.9,*/*;q=0.8',
      Origin: `https://${host}`,
      Referer: `https://${host}/`,
    };
    if (cookies.length) headers.Cookie = cookies.join('; ');

    const res = await httpsFetchRaw(url, headers);
    addCookies(host, res.headers['set-cookie']);
    trail.push({ host, path: url.pathname, status: res.status });

    if (res.status >= 300 && res.status < 400 && res.headers.location) {
      url = new URL(res.headers.location, url);
      continue;
    }
    return { ok: host === 'moss.pickcat.dao3.fun' && res.status === 200, status: res.status, finalHost: host, finalPath: url.pathname, jar, trail };
  }
  return { ok: false, status: 0, jar, trail, reason: 'too many redirects' };
}

async function handleMossSso(req, res) {
  const explicit = req.headers['x-pickcat-session'];
  const pickcatSession = explicit ? String(explicit) : pickCookie(req.headers.cookie) || sessionState.cookie;
  if (!pickcatSession) {
    return sendJson(res, 401, { ok: false, code: 'PICKCAT_LOGIN_REQUIRED', message: '请先登录 PICKCAT 账号' });
  }
  try {
    const result = await runMossOidc(pickcatSession);
    if (!result.ok) {
      const wantsHtml = String(req.headers.accept || '').includes('text/html');
      if (wantsHtml) {
        const html = `<!doctype html><meta charset="utf-8"><title>MOSS 登录失败</title>` +
          `<body style="font-family:system-ui;display:grid;place-items:center;height:100vh;margin:0;background:#0b0d12;color:#e8ecf4;text-align:center">` +
          `<div><p>MOSS 单点登录未完成</p><p style="color:#8e98ac;font-size:13px">请先在下方重新登录 PICKCAT，再回到播放器</p></div>`;
        res.writeHead(502, { 'Content-Type': 'text/html; charset=utf-8' });
        return res.end(html);
      }
      return sendJson(res, 502, {
        ok: false,
        code: 'MOSS_SSO_FAILED',
        message: 'MOSS 单点登录未完成（PICKCAT 会话可能已过期）',
        trail: result.trail,
      });
    }
    // 把 MOSS 域下的 Cookie 回写成本机 Cookie（__Host- 前缀的必须保留 Secure）
    const mossCookies = (result.jar.get('moss.pickcat.dao3.fun') || []).map((pair) => {
      const secure = /^__Host-/i.test(pair) ? '; Secure' : '';
      return `${pair}; Path=/; Max-Age=86400; SameSite=Lax${secure}`;
    });
    const wantsHtml = String(req.headers.accept || '').includes('text/html');
    const payload = wantsHtml
      ? `<!doctype html><meta charset="utf-8"><title>MOSS 已登录</title>` +
        `<body style="font-family:system-ui;display:grid;place-items:center;height:100vh;margin:0;background:#0b0d12;color:#e8ecf4">` +
        `<div style="text-align:center"><p>MOSS 已登录，正在返回播放器…</p></div>` +
        `<script>setTimeout(()=>{if(history.length>1)history.back();else location.reload();},600)</script>`
      : JSON.stringify({ ok: true, cookies: mossCookies.length, trail: result.trail });
    const body = Buffer.from(payload, 'utf8');
    const headers = {
      'Content-Type': wantsHtml ? 'text/html; charset=utf-8' : 'application/json; charset=utf-8',
      'Content-Length': body.length,
    };
    if (mossCookies.length) headers['Set-Cookie'] = mossCookies;
    res.writeHead(200, headers);
    return res.end(body);
  } catch (err) {
    return sendJson(res, 502, { ok: false, message: 'MOSS 单点登录失败: ' + err.message });
  }
}

// ---------------------------------------------------------------------------
// 匿名访客计数：浏览器在 localStorage 里生成随机 visitor id，每 30 分钟最多上报一次。
// 只记 id / 路径 / 来源 / IP / UA / 国家，不记录账号信息；data/visits.jsonl 每行一条。
// 统计：node scripts/visitors.mjs
// ---------------------------------------------------------------------------
const VISITS_FILE = join(HERE, 'data', 'visits.jsonl');

function readSmallJson(req, limit = 4096) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > limit) {
        reject(Object.assign(new Error('body too large'), { status: 413 }));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => {
      try {
        resolve(chunks.length ? JSON.parse(Buffer.concat(chunks).toString('utf8')) : {});
      } catch {
        reject(Object.assign(new Error('invalid json'), { status: 400 }));
      }
    });
    req.on('error', reject);
  });
}

async function handleVisit(req, res) {
  if (req.method !== 'POST') return sendJson(res, 405, { message: 'Method Not Allowed' });
  let body = {};
  try {
    body = await readSmallJson(req);
  } catch {
    res.writeHead(204).end();
    return;
  }
  const id = String(body.id || '').toLowerCase();
  if (!/^[a-z0-9-]{8,64}$/.test(id)) {
    res.writeHead(204).end();
    return;
  }
  const ip = String(
    req.headers['x-real-ip'] || req.headers['cf-connecting-ip'] || req.socket.remoteAddress || ''
  ).replace(/^::ffff:/, '');
  const record = {
    ts: new Date().toISOString(),
    id,
    path: String(body.path || '').slice(0, 200),
    ref: String(body.ref || '').slice(0, 300),
    ip,
    country: String(req.headers['cf-ipcountry'] || ''),
    ua: String(req.headers['user-agent'] || '').slice(0, 300),
  };
  try {
    await appendFile(VISITS_FILE, JSON.stringify(record) + '\n');
  } catch (err) {
    // 统计失败绝不能影响页面
  }
  res.writeHead(204, { 'Cache-Control': 'no-store' }).end();
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || '/', `http://${req.headers.host || HOST}`);
  try {
    if (url.pathname === '/__session') return await handleSession(req, res);
    if (url.pathname === '/__visit') return await handleVisit(req, res);
    if (url.pathname === '/proxy/media') return await handleMediaProxy(req, res, url);
    if (url.pathname === '/moss/sso') return await handleMossSso(req, res);
    if (url.pathname === '/moss' || url.pathname.startsWith('/moss/')) return await handleMossProxy(req, res, url);
    if (url.pathname === '/__health') {
      return sendJson(res, 200, {
        ok: true,
        upstream: UPSTREAM,
        connected: Boolean(sessionState.cookie),
        routes: ROUTES.length,
        time: new Date().toISOString(),
      });
    }
    if (url.pathname === '/__routes') {
      return sendJson(res, 200, { total: ROUTES.length, groups: ROUTE_GROUPS, routes: ROUTES });
    }
    if (url.pathname === '/legacy/openapi.json') {
      return sendJson(res, 200, {
        note: 'Pickcat-Reborn → 官方 API 迁移清单',
        total: ROUTES.length,
        legacy: [
          { old: 'GET /web/forums/posts/:id/details', new: ['GET /topics/{topicId}', 'GET /topics/{topicId}/posts'] },
          { old: 'GET /web/forums/posts/search', new: ['GET /topics?sort=latest（+本地标题过滤，官方无话题搜索）'] },
          { old: 'GET /web/forums/boards/simples/all', new: ['GET /topics（聚合 tags 作为板块）'] },
          { old: 'GET /web/forums/boards/:id/posts', new: ['GET /topics?tag={slug}'] },
          { old: 'POST /tiger/v3/web/accounts/login', new: ['POST /session（需 captchaVerifyParam）'] },
          { old: 'creation-tools/v1/user/center/work-list', new: ['GET /users/{userId}/works'] },
          { old: '/proxy/codemao/*', new: ['/api/v1/*（同源反代）'] },
        ],
        routes: ROUTES,
      });
    }
    // X 风格时间线视图：/x 与 /x/ 都指向 web/x/index.html（前端用 hash 路由）
    if (url.pathname === '/x' || url.pathname === '/x/') {
      url.pathname = '/x/index.html';
    }
    if (url.pathname.startsWith('/api/v1/')) return await handleApiProxy(req, res, url);
    if (url.pathname.startsWith('/legacy')) return await handleLegacy(req, res, url);
    return await serveStatic(req, res, url);
  } catch (err) {
    const status = err.status && Number.isInteger(err.status) ? err.status : 502;
    sendJson(res, status, {
      message: err.message || '服务内部错误',
      upstream: UPSTREAM,
      detail: err.data && err.data.message ? err.data.message : undefined,
    });
  }
});

server.listen(PORT, HOST, () => {
  const addr = `http://${HOST}:${PORT}`;
  console.log('PICKCAT 正式网页版已启动');
  console.log('  站点:      ' + addr + '/');
  console.log('  上游 API:  ' + UPSTREAM + '/api/v1');
  console.log('  路由清单:  ' + addr + '/__routes（' + ROUTES.length + ' 条）');
  console.log('  兼容层:    ' + addr + '/legacy/openapi.json');
  console.log('  登录方式:  浏览器 Cookie（settings 页粘贴 pickcat_session 即可）');
});
