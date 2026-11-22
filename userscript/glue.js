/**
 * 油猴运行时胶水层
 *
 * 由 scripts/build-userscript.mjs 注入下面几个占位符（注释里不写原名，避免被误替换）：
 *   MARKUP   = web/index.html 的 <body> 内容（已内联图片、去掉 script）
 *   APP_CSS  = web/styles.css（已内联图片）
 *   HOST_CSS = 宿主站覆盖样式（隐藏官方 Nuxt 界面等）
 *   VERSION  = 版本号
 *   APP_BODY = auth.js / login.js / api-official.js / app.js 拼接
 */
'use strict';

const MARKUP = __MARKUP__;
const APP_CSS = __APP_CSS__;
const HOST_CSS = __HOST_CSS__;
const VERSION = '__VERSION__';
const ENABLED_KEY = 'pickcat:userscript:enabled';
const HOST_ID = 'pc-ua-shell';
const TOGGLE_ID = 'pc-ua-toggle';

/* ------------------------------------------------------------------ */
/* 小工具                                                              */
/* ------------------------------------------------------------------ */

const pendingStyles = [];

function addStyle(css) {
  try {
    if (typeof GM_addStyle === 'function') return GM_addStyle(css);
  } catch (err) {
    /* 忽略：退回 DOM 注入 */
  }
  const parent = document.head || document.documentElement;
  if (!parent) {
    // document-start 时 <head> 还不存在，等 body 就绪再补
    pendingStyles.push(css);
    return null;
  }
  const el = document.createElement('style');
  el.textContent = css;
  parent.appendChild(el);
  return el;
}

function flushStyles() {
  if (!pendingStyles.length) return;
  const parent = document.head || document.documentElement;
  if (!parent) return;
  for (const css of pendingStyles.splice(0)) {
    const el = document.createElement('style');
    el.textContent = css;
    parent.appendChild(el);
  }
}

function storageGet(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value === null ? fallback : value;
  } catch (err) {
    return fallback;
  }
}

function storageSet(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (err) {
    /* 私密模式忽略 */
  }
}

function whenBody(cb) {
  if (document.body) return cb();
  document.addEventListener(
    'DOMContentLoaded',
    () => {
      flushStyles();
      cb();
    },
    { once: true }
  );
}

function setEnabled(on) {
  storageSet(ENABLED_KEY, on ? '1' : '0');
  location.reload();
}

/* ------------------------------------------------------------------ */
/* 切换按钮（右侧小挂耳）                                              */
/* ------------------------------------------------------------------ */

const PILL_CSS = [
  '#' + TOGGLE_ID + '{position:fixed;right:0;top:50%;transform:translateY(-50%);z-index:2147483000;',
  'writing-mode:vertical-rl;letter-spacing:2px;padding:10px 4px;border:0;border-radius:10px 0 0 10px;',
  'background:rgba(22,24,29,.55);color:#fff;font:600 11px/1 -apple-system,BlinkMacSystemFont,"PingFang SC",sans-serif;',
  'cursor:pointer;opacity:.5;transition:opacity .18s ease,background .18s ease;-webkit-tap-highlight-color:transparent;}',
  '#' + TOGGLE_ID + ':hover,#' + TOGGLE_ID + ':focus-visible{opacity:1;background:rgba(22,119,255,.9);outline:none;}',
  '@media (max-width:430px){#' + TOGGLE_ID + '{opacity:.42;padding:8px 3px;font-size:10px;}}',
].join('');

function installPill() {
  if (document.getElementById(TOGGLE_ID)) return;
  const button = document.createElement('button');
  button.id = TOGGLE_ID;
  button.type = 'button';
  button.textContent = '官方';
  button.title = '切换到 PICKCAT 官方界面（可在右侧小挂耳切回旧版）';
  button.addEventListener('click', () => setEnabled(false));
  document.body.appendChild(button);
  addStyle(PILL_CSS);
}

function installRestorePill() {
  if (document.getElementById(TOGGLE_ID)) return;
  const button = document.createElement('button');
  button.id = TOGGLE_ID;
  button.type = 'button';
  button.textContent = '旧版';
  button.title = '切回手机版旧界面';
  button.addEventListener('click', () => setEnabled(true));
  document.body.appendChild(button);
  addStyle(PILL_CSS);
}

/* ------------------------------------------------------------------ */
/* 滚轮：官方站的滚动劫持会把 wheel 事件 preventDefault 掉，            */
/* 导致旧版界面里滚轮完全没反应（拖动滚动条/触摸拖动却正常）。           */
/* 这里在 window 捕获阶段抢先接管：自己做滚动，再阻止事件继续传播。       */
/* ------------------------------------------------------------------ */

function findScrollableAncestor(node) {
  let el = node instanceof Element ? node : null;
  while (el && el !== document.body && el !== document.documentElement) {
    const style = getComputedStyle(el);
    if (/(auto|scroll)/.test(style.overflowY) && el.scrollHeight > el.clientHeight + 2) return el;
    el = el.parentElement;
  }
  return null;
}

function onWheel(event) {
  if (!document.getElementById(HOST_ID)) return;
  if (event.ctrlKey) return; // 触控板捏合缩放，交给浏览器
  const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1;
  const dy = event.deltaY * unit;
  const dx = event.deltaX * unit;
  if (!dx && !dy) return;

  const scroller = findScrollableAncestor(event.target);
  if (scroller) {
    const before = scroller.scrollTop;
    scroller.scrollTop = Math.max(0, Math.min(scroller.scrollHeight, before + dy));
    if (scroller.scrollTop !== before) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
    return;
  }

  const beforeY = window.scrollY;
  window.scrollBy(dx, dy);
  if (window.scrollY !== beforeY) {
    event.preventDefault();
    event.stopImmediatePropagation();
  }
}

function installWheelScroll() {
  window.addEventListener('wheel', onWheel, { capture: true, passive: false });
}

/* ------------------------------------------------------------------ */
/* 错误兜底                                                            */
/* ------------------------------------------------------------------ */

function reportError(error) {
  try {
    console.error('[PICKCAT 旧版 UI]', error);
  } catch (err) {
    /* ignore */
  }
  if (document.getElementById('pc-ua-error')) return;
  const box = document.createElement('div');
  box.id = 'pc-ua-error';
  box.innerHTML =
    '<div class="pc-ua-error-card"><strong>旧版界面加载失败</strong>' +
    '<p></p><div class="pc-ua-error-actions">' +
    '<button type="button" data-retry>重试</button>' +
    '<button type="button" data-official>回到官方界面</button></div></div>';
  box.querySelector('p').textContent = String((error && error.message) || error);
  box.querySelector('[data-retry]').addEventListener('click', () => location.reload());
  box.querySelector('[data-official]').addEventListener('click', () => setEnabled(false));
  document.body.appendChild(box);
  addStyle(
    '#pc-ua-error{position:fixed;inset:0;z-index:2147483200;display:flex;align-items:center;justify-content:center;' +
      'background:#0b0f14;padding:24px;font-family:-apple-system,"PingFang SC",sans-serif;}' +
      '.pc-ua-error-card{max-width:360px;width:100%;background:#141b25;border:1px solid #263243;border-radius:14px;' +
      'padding:20px;color:#e8edf4;font-size:13px;line-height:1.7;}' +
      '.pc-ua-error-card strong{display:block;margin-bottom:6px;font-size:15px;}' +
      '.pc-ua-error-card p{color:#93a2b6;word-break:break-all;margin:0 0 14px;}' +
      '.pc-ua-error-actions{display:flex;gap:8px;}' +
      '.pc-ua-error-actions button{flex:1;min-height:38px;border-radius:8px;border:1px solid #334152;background:#1d2836;' +
      'color:#e8edf4;font-size:13px;cursor:pointer;}' +
      '.pc-ua-error-actions button[data-retry]{background:#1677ff;border-color:#1677ff;}'
  );
}

/* ------------------------------------------------------------------ */
/* 挂载 + 启动                                                         */
/* ------------------------------------------------------------------ */

function mount() {
  if (document.getElementById(HOST_ID)) return;
  const host = document.createElement('div');
  host.id = HOST_ID;
  host.style.display = 'contents';
  host.innerHTML = MARKUP;
  document.body.appendChild(host);
  addStyle(APP_CSS);
  installPill();
  document.documentElement.classList.add('pc-ua-on');
}

function startApp() {
  __APP_BODY__
}

const enabled = storageGet(ENABLED_KEY, '1') !== '0';

if (!enabled) {
  whenBody(() => {
    installRestorePill();
    try {
      if (typeof GM_registerMenuCommand === 'function') {
        GM_registerMenuCommand('切回旧版界面', () => setEnabled(true));
      }
    } catch (err) {
      /* ignore */
    }
  });
} else {
  /* 先把官方界面藏掉，避免旧版挂载前闪一下 Nuxt 界面 */
  addStyle(HOST_CSS);
  /* 必须尽早注册：抢在官方滚动劫持之前拿到 wheel 事件 */
  installWheelScroll();
  whenBody(() => {
    try {
      mount();
    } catch (error) {
      reportError(error);
      return;
    }
    try {
      startApp();
    } catch (error) {
      reportError(error);
    }
    try {
      if (typeof GM_registerMenuCommand === 'function') {
        GM_registerMenuCommand('切换回官方界面', () => setEnabled(false));
        GM_registerMenuCommand('旧版 UI 版本 ' + VERSION, () => {});
      }
    } catch (err) {
      /* ignore */
    }
  });
}
