/* ---------------------------------------------------------------------------
   PICKCAT · 时间线（X / Twitter 风格）
   数据：官方 API（同源 /api/v1 反代）  登录态：pickcat_session（浏览器 Cookie）
   路由：#/home/:tab  #/explore/:sort  #/search/:q  #/tag/:slug/:name/:sort
         #/t/:topicId  #/u/:userId  #/me
   --------------------------------------------------------------------------- */
(function () {
  'use strict';

  const API = '/api/v1';
  const THEMES = ['dim', 'light', 'dark'];
  const THEME_LABEL = { dim: '暗色（蓝）', light: '亮色', dark: '纯黑' };
  const PROFILE_KEY = 'pickcat:user';

  /* ----------------------------------------------------------------- 图标 */

  const svg = (d, extra) =>
    `<svg viewBox="0 0 24 24" ${extra || ''}><path d="${d}"/></svg>`;

  const ICONS = {
    home: svg('M3.4 10.7 12 3.3l8.6 7.4V20a1.2 1.2 0 0 1-1.2 1.2h-4.7v-6.5H9.3v6.5H4.6A1.2 1.2 0 0 1 3.4 20v-9.3Z'),
    homeOn: svg('M3.4 10.7 12 3.3l8.6 7.4V20a1.2 1.2 0 0 1-1.2 1.2h-4.7v-6.5H9.3v6.5H4.6A1.2 1.2 0 0 1 3.4 20v-9.3Z', 'fill="currentColor" stroke="none"'),
    tag: svg('M4.2 9.2h15.6M4.2 14.8h15.6M9.6 3.6 8 20.4M16 3.6l-1.6 16.8', 'class="line"'),
    search: '<svg viewBox="0 0 24 24" class="line"><circle cx="10.5" cy="10.5" r="7.2"/><path d="M15.8 15.8 21 21"/></svg>',
    user: svg('M12 3.6a4.2 4.2 0 1 0 0 8.4 4.2 4.2 0 0 0 0-8.4ZM4.2 20.7c0-4 3.5-6.6 7.8-6.6s7.8 2.6 7.8 6.6'),
    userOn: svg('M12 3.6a4.2 4.2 0 1 0 0 8.4 4.2 4.2 0 0 0 0-8.4ZM4.2 20.7c0-4 3.5-6.6 7.8-6.6s7.8 2.6 7.8 6.6', 'fill="currentColor" stroke="none"'),
    reply: svg('M20.8 11.4a8.3 8.3 0 0 1-8.4 8.2 9 9 0 0 1-3.8-.8L3.4 20.8l2-5.3a8.2 8.2 0 0 1-.9-3.7 8.3 8.3 0 0 1 8.4-8.2 8.3 8.3 0 0 1 7.9 7.8Z'),
    eye: svg('M2.2 12S6 5.6 12 5.6 21.8 12 21.8 12 18 18.4 12 18.4 2.2 12 2.2 12Zm9.8-2.9a2.9 2.9 0 1 0 0 5.8 2.9 2.9 0 0 0 0-5.8Z'),
    heart: svg('M12 20.6C9.6 19.1 3.4 14.9 3.4 10.2A4.7 4.7 0 0 1 12 7.1a4.7 4.7 0 0 1 8.6 3.1c0 4.7-6.2 8.9-8.6 10.4Z'),
    bookmark: svg('M6.2 3.4h11.6a1 1 0 0 1 1 1v16.2L12 16.4l-6.8 4.2V4.4a1 1 0 0 1 1-1Z'),
    share: svg('M12 15.6V3.6m0 0 4.2 4.2M12 3.6 7.8 7.8M4.8 13.4v5.4a1.6 1.6 0 0 0 1.6 1.6h11.2a1.6 1.6 0 0 0 1.6-1.6v-5.4'),
    more: '<svg viewBox="0 0 24 24"><circle cx="5" cy="12" r="1.7"/><circle cx="12" cy="12" r="1.7"/><circle cx="19" cy="12" r="1.7"/></svg>',
    back: svg('M20.4 12H4.2m0 0 6.6-6.6M4.2 12l6.6 6.6'),
    pin: svg('M9.2 3.6h5.6l-.8 6 4.4 3.3v2.1H5.6v-2.1L10 9.6l-.8-6ZM12 15v5.2'),
    refresh: svg('M20.4 11.2a8.4 8.4 0 1 0-2.6 6.6M20.4 4.8v6.4h-6.4'),
    theme: svg('M12 3.4v2m0 13.2v2M3.4 12h2m13.2 0h2M6 6l1.4 1.4M16.6 16.6 18 18M18 6l-1.4 1.4M7.4 16.6 6 18M12 8.2a3.8 3.8 0 1 0 0 7.6 3.8 3.8 0 0 0 0-7.6Z'),
    phone: svg('M8.2 2.6h7.6a1.8 1.8 0 0 1 1.8 1.8v15.2a1.8 1.8 0 0 1-1.8 1.8H8.2a1.8 1.8 0 0 1-1.8-1.8V4.4a1.8 1.8 0 0 1 1.8-1.8Zm2.4 15.6h2.8'),
    calendar: svg('M7.6 3.4v3M16.4 3.4v3M3.6 9.4h16.8M5.2 5.4h13.6a1.6 1.6 0 0 1 1.6 1.6v12a1.6 1.6 0 0 1-1.6 1.6H5.2a1.6 1.6 0 0 1-1.6-1.6V7a1.6 1.6 0 0 1 1.6-1.6Z'),
    plus: svg('M12 4.6v14.8M4.6 12h14.8'),
    link: svg('M13.6 4h6.4v6.4M20 4l-8.4 8.4M17.4 13.6v5a1.4 1.4 0 0 1-1.4 1.4H4.4A1.4 1.4 0 0 1 3 18.6V7a1.4 1.4 0 0 1 1.4-1.4h5'),
    logout: svg('M15.6 8.2V4.6a1 1 0 0 0-1-1H4.6a1 1 0 0 0-1 1v14.8a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-3.6M9.4 12h11m0 0-3.4-3.4M20.4 12 17 15.4'),
  };

  const BRAND = `<svg viewBox="0 0 24 24"><path fill-rule="evenodd" d="M3.6 8.9 3.2 3.5a.75.75 0 0 1 1.2-.66l4.3 2.9a11.4 11.4 0 0 1 6.6 0l4.3-2.9a.75.75 0 0 1 1.2.66l-.4 5.4c.8 1.3 1.2 2.7 1.2 4.1 0 4.6-4.3 8-9.6 8s-9.6-3.4-9.6-8c0-1.4.4-2.8 1.2-4.1Zm5.5 2.7a1.35 1.35 0 1 0 0 2.7 1.35 1.35 0 0 0 0-2.7Zm5.8 0a1.35 1.35 0 1 0 0 2.7 1.35 1.35 0 0 0 0-2.7Z"/></svg>`;

  /* --------------------------------------------------------------- 小工具 */

  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => [...(root || document).querySelectorAll(sel)];

  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, (c) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    }[c]));
  }

  function num(value) {
    const n = Number(value) || 0;
    if (n >= 1e8) return (n / 1e8).toFixed(1).replace(/\.0$/, '') + '亿';
    if (n >= 1e4) return (n / 1e4).toFixed(1).replace(/\.0$/, '') + '万';
    return String(n);
  }

  function relTime(iso) {
    const t = Date.parse(iso || '');
    if (!t) return '';
    const s = Math.max(0, (Date.now() - t) / 1000);
    if (s < 60) return '刚刚';
    if (s < 3600) return Math.floor(s / 60) + '分钟';
    if (s < 86400) return Math.floor(s / 3600) + '小时';
    if (s < 86400 * 7) return Math.floor(s / 86400) + '天';
    const d = new Date(t);
    const md = d.getMonth() + 1 + '月' + d.getDate() + '日';
    return d.getFullYear() === new Date().getFullYear() ? md : d.getFullYear() + '年' + md;
  }

  function absTime(iso) {
    const t = Date.parse(iso || '');
    if (!t) return '';
    const d = new Date(t);
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日 ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  /** 内容里可能有 [emoji:xxx] / @{uuid} 这类占位符 */
  function clean(text) {
    return String(text == null ? '' : text)
      .replace(/\[emoji:[^\]]{0,60}\]/g, '')
      .replace(/@\{[0-9a-fA-F-]{36}\}/g, '')
      .replace(/[ \t]+\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .replace(/[ \t]{2,}/g, ' ')
      .trim();
  }

  function mediaUrl(value) {
    if (!value) return '';
    try {
      const url = new URL(value, location.origin);
      if (url.origin === location.origin) return url.pathname + url.search;
      const host = url.hostname.toLowerCase();
      const proxied = /(^|\.)(codemao\.cn|bcmcdn\.com|aliyuncs\.com|dao3\.fun)$/.test(host);
      return proxied ? '/proxy/media?url=' + encodeURIComponent(url.toString()) : url.toString();
    } catch {
      return value;
    }
  }

  function fallbackAvatar(name) {
    const ch = [...String(name || '猫')][0] || '猫';
    const mark =
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">` +
      `<rect width="40" height="40" fill="#1d9bf0"/>` +
      `<text x="20" y="26" font-family="-apple-system,Segoe UI,sans-serif" font-size="18" font-weight="700" fill="#fff" text-anchor="middle">${esc(ch)}</text>` +
      `</svg>`;
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(mark);
  }

  function avatarOf(user) {
    const url = user && user.avatar && (user.avatar.url || user.avatar.avatar_url);
    return url ? mediaUrl(url) : fallbackAvatar(user && user.username);
  }

  function avatarImg(user, cls) {
    const name = (user && user.username) || '未知用户';
    return `<span class="${cls || 'card-avatar'}"><img src="${esc(avatarOf(user))}" alt="${esc(name)}" loading="lazy" /></span>`;
  }

  function sanitizeRich(html, { inline = false } = {}) {
    if (!html) return '';
    const doc = new DOMParser().parseFromString(String(html), 'text/html');
    doc
      .querySelectorAll('script,style,iframe,object,embed,form,input,button,textarea,select,link,meta,base')
      .forEach((n) => n.remove());
    doc.body.querySelectorAll('*').forEach((node) => {
      [...node.attributes].forEach((attr) => {
        const name = attr.name.toLowerCase();
        const value = String(attr.value || '').trim().toLowerCase();
        if (name.startsWith('on') || name === 'srcdoc' || name === 'style' || value.startsWith('javascript:')) {
          node.removeAttribute(attr.name);
        }
      });
    });
    doc.body.querySelectorAll('img').forEach((img) => {
      const src = img.getAttribute('src') || '';
      img.removeAttribute('width');
      img.removeAttribute('height');
      img.setAttribute('src', mediaUrl(src));
      img.setAttribute('loading', 'lazy');
      if (!img.hasAttribute('alt')) img.setAttribute('alt', '');
      if (/emoji|expression|sticker/i.test(src + ' ' + (img.getAttribute('class') || ''))) img.classList.add('emoji');
    });
    doc.body.querySelectorAll('a').forEach((a) => {
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener noreferrer');
      const href = a.getAttribute('href') || '';
      if (href.startsWith('#')) a.removeAttribute('href');
    });
    let out = doc.body.innerHTML;
    out = out.replace(/\[emoji:[^\]]{0,60}\]/g, '');
    out = out.replace(/@\{[0-9a-fA-F-]{36}\}/g, '');
    if (inline) out = out.replace(/<\/?p(\s[^>]*)?>/g, ' ');
    return out.trim();
  }

  function toast(message, kind) {
    const host = $('#toasts');
    if (!host) return;
    const el = document.createElement('div');
    el.className = 'toast' + (kind === 'error' ? ' error' : '');
    el.textContent = message;
    host.append(el);
    setTimeout(() => {
      el.style.transition = 'opacity .25s ease, transform .25s ease';
      el.style.opacity = '0';
      el.style.transform = 'translateY(6px)';
      setTimeout(() => el.remove(), 260);
    }, 2600);
  }

  /* ------------------------------------------------------------------ API */

  async function api(path, { query, method = 'GET', body, signal } = {}) {
    const url = new URL(API + path, location.origin);
    Object.entries(query || {}).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, String(v));
    });
    const res = await fetch(url, {
      method,
      signal,
      headers: { Accept: 'application/json', ...(body ? { 'Content-Type': 'application/json' } : {}) },
      body: body ? JSON.stringify(body) : undefined,
    });
    const text = await res.text();
    let data = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = null;
    }
    if (!res.ok) {
      const message = (data && (data.message || data.error_message || data.code)) || `${path} ${res.status}`;
      const error = new Error(message);
      error.status = res.status;
      error.data = data;
      throw error;
    }
    return data || {};
  }

  /* ----------------------------------------------------------------- 状态 */

  const state = {
    viewer: null,
    theme: 'dim',
    side: null,
    sideLoading: false,
  };

  const NAV = [
    { key: 'home', label: '首页', href: '#/home/recommended', icons: [ICONS.home, ICONS.homeOn] },
    { key: 'explore', label: '探索', href: '#/explore/hot', icons: [ICONS.tag, ICONS.tag] },
    { key: 'search', label: '搜索', href: '#/search', icons: [ICONS.search, ICONS.search] },
    { key: 'me', label: '我的', href: '#/me', icons: [ICONS.user, ICONS.userOn] },
  ];

  /* --------------------------------------------------------------- 通用骨架 */

  function topbar({ title, back, tabs, sub, right }) {
    return (
      `<div class="topbar${back ? '' : ' topbar--plain'}">` +
      `<div class="topbar-title">` +
      (back ? `<a class="back-btn" href="${esc(back)}" aria-label="返回">${ICONS.back}</a>` : '') +
      `<h1>${esc(title || '')}</h1>` +
      (sub ? `<span class="topbar-sub">${sub}</span>` : '') +
      (right || '') +
      `</div>` +
      (tabs && tabs.length ? `<div class="tabs">${tabs.join('')}</div>` : '') +
      `</div>`
    );
  }

  function tabLinks(items, activeKey) {
    return items.map(
      (it) =>
        `<a class="tab${it.key === activeKey ? ' active' : ''}" href="${esc(it.href)}">${esc(it.label)}</a>`
    );
  }

  function skeleton(count) {
    let out = '';
    for (let i = 0; i < count; i++) {
      out +=
        `<div class="sk"><div class="sk-av shimmer"></div><div>` +
        `<div class="sk-line w40 shimmer"></div>` +
        `<div class="sk-line w90 shimmer"></div>` +
        `<div class="sk-line w70 shimmer"></div>` +
        `</div></div>`;
    }
    return out;
  }

  function emptyState({ title, text, action }) {
    return (
      `<div class="empty"><h3>${esc(title)}</h3><p>${text || ''}</p>` +
      (action ? action : '') +
      `</div>`
    );
  }

  function loginAction(label) {
    return `<button class="btn-solid js-login" type="button">${esc(label || '连接账号')}</button>`;
  }

  /* ------------------------------------------------------------- 时间线 */

  function createTimeline(container, { load, onItems }) {
    const list = document.createElement('div');
    list.className = 'list';
    const foot = document.createElement('div');
    foot.className = 'feed-foot';
    const skeletonHost = document.createElement('div');
    skeletonHost.innerHTML = skeleton(6);
    foot.innerHTML = '<div class="spinner" aria-label="加载中"></div>';
    container.append(skeletonHost, list, foot);

    let cursor = null;
    let loading = false;
    let done = false;
    let disposed = false;
    let count = 0;
    let failed = null;
    const seen = new Set();
    const sentinel = document.createElement('div');
    sentinel.style.cssText = 'width:1px;height:1px;';
    foot.append(sentinel);

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) loadMore();
      },
      { rootMargin: '900px 0px' }
    );
    io.observe(sentinel);

    function setFoot(mode, message) {
      if (mode === 'idle') foot.innerHTML = '';
      else if (mode === 'loading') foot.innerHTML = '<div class="spinner" aria-label="加载中"></div>';
      else if (mode === 'end') foot.innerHTML = '<span class="feed-end">— 到底了 —</span>';
      else if (mode === 'error') {
        foot.innerHTML = `<button class="retry" type="button">${ICONS.refresh}<span>加载失败，点此重试</span></button>`;
        const btn = foot.querySelector('.retry');
        btn.title = message || '';
        btn.addEventListener('click', () => {
          failed = null;
          loadMore();
        });
      }
      foot.append(sentinel);
    }

    async function loadMore() {
      if (disposed || loading || done || failed) return;
      loading = true;
      if (count === 0) skeletonHost.style.display = '';
      setFoot('loading');
      try {
        const page = await load(cursor);
        if (disposed) return;
        skeletonHost.remove();
        const items = (page && page.items) || [];
        if (page && page.note && items.length !== 0) {
          list.insertAdjacentHTML('beforeend', `<div class="feed-note">${esc(page.note)}</div>`);
        }
        items.forEach((item) => {
          if (!item || !item.id || seen.has(item.id)) return;
          seen.add(item.id);
          list.insertAdjacentHTML('beforeend', postCard(item));
          count += 1;
        });
        const info = (page && page.pageInfo) || {};
        cursor = info.nextCursor || null;
        done = !info.hasNextPage || !cursor;
        if (count === 0) {
          setFoot('idle');
          list.innerHTML = emptyState({
            title: '这里还没有帖子',
            text: '换个标签或稍后再来看看。',
          });
        } else {
          setFoot(done ? 'end' : 'idle');
        }
      } catch (error) {
        if (disposed) return;
        skeletonHost.remove();
        if (error.name === 'AbortError') return;
        if (count === 0) {
          list.innerHTML = emptyState({
            title: '加载失败',
            text: esc(error.message || '网络异常'),
            action: `<button class="btn-solid js-retry" type="button">重试</button>`,
          });
          const retry = list.querySelector('.js-retry');
          if (retry) retry.addEventListener('click', () => location.reload());
          setFoot('idle');
        } else {
          failed = error;
          setFoot('error', error.message);
        }
      } finally {
        loading = false;
      }
    }

    loadMore();

    return {
      dispose() {
        disposed = true;
        io.disconnect();
      },
      reload: loadMore,
    };
  }

  /* ------------------------------------------------------------- 帖子卡片 */

  function postCard(topic) {
    const author = topic.author || {};
    const tags = (topic.tags || []).filter(Boolean);
    const primary = tags[0];
    const pinned = Boolean(topic.pinnedGlobally || topic.pinned);
    const title = clean(topic.title);
    const excerpt = clean(topic.excerpt);
    const href = '#/t/' + encodeURIComponent(topic.id);
    const isQuestion = topic.kind === 'QUESTION';

    return (
      `<article class="card${pinned ? ' pinned-card' : ''}" data-id="${esc(topic.id)}" data-user="${esc(
        author.id || ''
      )}">` +
      `<a href="#/u/${encodeURIComponent(author.id || '')}" aria-label="${esc(author.username || '')}">${avatarImg(author)}</a>` +
      `<div class="card-body">` +
      `<div class="ctx">` +
      (pinned ? `${ICONS.pin}<span class="pin">置顶</span><span>·</span>` : '') +
      (primary
        ? `${ICONS.tag}<a href="#/tag/${encodeURIComponent(primary.slug)}/${encodeURIComponent(primary.name)}">${esc(primary.name)}</a>`
        : `${ICONS.tag}<span>PICKCAT</span>`) +
      (isQuestion ? `<span>·</span><span>问答</span>` : '') +
      `</div>` +
      `<div class="meta">` +
      `<a class="name" href="#/u/${encodeURIComponent(author.id || '')}">${esc(author.username || '未知用户')}</a>` +
      `<a class="time" href="${href}" title="${esc(absTime(topic.createdAt))}">${relTime(topic.createdAt)}</a>` +
      `<button class="more" type="button" aria-label="更多">${ICONS.more}</button>` +
      `</div>` +
      `<a class="card-link" href="${href}">` +
      (title ? `<h2 class="card-title">${esc(title)}</h2>` : '') +
      (excerpt ? `<p class="card-text">${esc(excerpt)}</p>` : '') +
      `</a>` +
      (tags.length > 1
        ? `<div class="card-tags">${tags
            .slice(1, 4)
            .map(
              (tag) =>
                `<a href="#/tag/${encodeURIComponent(tag.slug)}/${encodeURIComponent(tag.name)}">#${esc(tag.name)}</a>`
            )
            .join('')}</div>`
        : '') +
      `<div class="acts">` +
      `<a class="act" href="${href}" title="查看回复">` +
      `<span class="ico">${ICONS.reply}</span><span class="n">${num(topic.replyCount)}</span>` +
      `</a>` +
      `<span class="act static" title="浏览"><span class="ico">${ICONS.eye}</span><span class="n">${num(
        topic.viewCount
      )}</span></span>` +
      `<button class="act share" type="button" data-share="${esc(topic.id)}" title="复制链接">` +
      `<span class="ico">${ICONS.share}</span>` +
      `</button>` +
      `</div>` +
      `</div></article>`
    );
  }

  /* ---------------------------------------------------------------- 右栏 */

  function renderSide() {
    const side = $('#side');
    if (!side) return;
    side.innerHTML =
      `<div class="search"><form class="search-inner" id="sideSearch">${ICONS.search}` +
      `<input type="search" name="q" placeholder="搜索帖子、用户" autocomplete="off" /></form></div>` +
      `<section class="side-card" id="sideTags"><h2>热门喵圈</h2><div class="side-row"><div class="sk-line w70 shimmer" style="width:100%"></div></div></section>` +
      `<section class="side-card" id="sideUsers"><h2>活跃训练师</h2><div class="side-row"><div class="sk-line w70 shimmer" style="width:100%"></div></div></section>` +
      `<div class="side-foot">` +
      `<a href="/m">Pickcat 手机版</a><a href="#/explore/hot">探索</a><a href="https://pickcat.dao3.fun/" target="_blank" rel="noopener">官方站</a>` +
      `<div style="margin-top:8px">第三方时间线视图 · 数据来自 PICKCAT 公开 API</div>` +
      `</div>`;

    const form = $('#sideSearch', side);
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const value = form.elements.q.value.trim();
      if (value) location.hash = '#/search/' + encodeURIComponent(value);
    });

    renderSideCards();
  }

  function renderSideCards() {
    const tagsHost = $('#sideTags');
    const usersHost = $('#sideUsers');
    if (!tagsHost || !usersHost) return;
    const data = state.side;
    if (!data) {
      if (!state.sideLoading) loadSideData();
      return;
    }
    const tags = data.tags.slice(0, 6);
    const users = data.users.slice(0, 3);
    tagsHost.innerHTML =
      `<h2>热门喵圈</h2>` +
      (tags.length
        ? tags
            .map(
              (tag) =>
                `<a class="side-row" href="#/tag/${encodeURIComponent(tag.slug)}/${encodeURIComponent(tag.name)}">` +
                `<div class="side-row-main"><div class="side-row-title">${esc(tag.name)}</div>` +
                `<div class="side-row-sub">${tag.count} 条帖子</div></div></a>`
            )
            .join('')
        : `<div class="side-row"><div class="side-row-sub">暂无数据</div></div>`) +
      `<a class="side-more" href="#/explore/hot">查看更多</a>`;

    usersHost.innerHTML =
      `<h2>活跃训练师</h2>` +
      (users.length
        ? users
            .map(
              (user) =>
                `<a class="side-row" href="#/u/${encodeURIComponent(user.id)}">${avatarImg(user, 'card-avatar')}` +
                `<div class="side-row-main"><div class="side-row-title">${esc(user.username)}</div>` +
                `<div class="side-row-sub">${user.count} 条热帖</div></div></a>`
            )
            .join('')
        : `<div class="side-row"><div class="side-row-sub">暂无数据</div></div>`);
  }

  async function loadSideData() {
    if (state.sideLoading) return;
    // 手机上侧栏根本不显示，别白跑两个请求
    if (!window.matchMedia('(min-width: 1096px)').matches) {
      state.side = { tags: [], users: [] };
      return;
    }
    state.sideLoading = true;
    try {
      const [rec, hot] = await Promise.allSettled([
        api('/topic-recommendations', { query: { sort: 'recommended', limit: 30 } }),
        api('/topics', { query: { sort: 'hot', limit: 30 } }),
      ]);
      const tagMap = new Map();
      const userMap = new Map();
      const eat = (page) => {
        ((page && page.items) || []).forEach((item) => {
          (item.tags || []).forEach((tag) => {
            const hit = tagMap.get(tag.slug) || { slug: tag.slug, name: tag.name, count: 0 };
            hit.count += 1;
            tagMap.set(tag.slug, hit);
          });
          const author = item.author;
          if (author && author.id) {
            const hit = userMap.get(author.id) || { id: author.id, username: author.username, avatar: author.avatar, count: 0 };
            hit.count += 1;
            userMap.set(author.id, hit);
          }
        });
      };
      [rec, hot].forEach((r) => {
        if (r.status === 'fulfilled') eat(r.value);
      });
      state.side = {
        tags: [...tagMap.values()].sort((a, b) => b.count - a.count),
        users: [...userMap.values()].sort((a, b) => b.count - a.count),
      };
      renderSideCards();
    } catch {
      state.side = { tags: [], users: [] };
      renderSideCards();
    } finally {
      state.sideLoading = false;
    }
  }

  /* --------------------------------------------------------------- 外层壳 */

  function renderChrome() {
    const railNav = $('#railNav');
    const mobileTabs = $('#mobileTabs');
    const mobileTop = $('#mobileTop');
    const activeKey = (() => {
      const hash = location.hash || '#/home/recommended';
      if (hash.startsWith('#/explore')) return 'explore';
      if (hash.startsWith('#/search') || hash.startsWith('#/tag')) return 'search';
      if (hash.startsWith('#/me') || hash.startsWith('#/u/')) return 'me';
      return 'home';
    })();

    railNav.innerHTML = NAV.map((item) => {
      const active = item.key === activeKey;
      return (
        `<a class="nav-item${active ? ' active' : ''}" href="${item.href}" data-nav="${item.key}">` +
        `<span class="ico">${active ? item.icons[1] : item.icons[0]}</span>` +
        `<span class="nav-label">${item.label}</span></a>`
      );
    }).join('');

    $('.brand').innerHTML = BRAND;

    mobileTabs.innerHTML = NAV.map((item) => {
      const active = item.key === activeKey;
      return `<a class="m-tab${active ? ' active' : ''}" href="${item.href}" aria-label="${item.label}">${
        active ? item.icons[1] : item.icons[0]
      }</a>`;
    }).join('');

    const me = state.viewer || null;
    mobileTop.innerHTML =
      `<a class="m-avatar${me ? '' : ' m-avatar--anon'}" href="${me ? '#/u/' + encodeURIComponent(me.id) : '#/me'}" aria-label="我的">` +
      (me ? `<img src="${esc(avatarOf(me))}" alt="" />` : ICONS.user) +
      `</a>` +
      `<a class="m-brand" href="#/home/recommended" aria-label="PICKCAT">${BRAND}</a>` +
      `<button class="m-btn" type="button" data-theme-toggle aria-label="切换外观">${ICONS.theme}</button>`;

    const refresh = $('#refreshBtn');
    refresh.innerHTML = `${ICONS.refresh}<span>刷新时间线</span>`;
    const phone = $('.rail-foot a.rail-link');
    phone.innerHTML = `${ICONS.phone}<span>手机版</span>`;
    const themeBtn = $('#themeBtn');
    themeBtn.innerHTML = `${ICONS.theme}<span>${THEME_LABEL[state.theme]}</span>`;
  }

  function applyTheme(theme) {
    state.theme = THEMES.includes(theme) ? theme : 'dim';
    document.documentElement.setAttribute('data-theme', state.theme);
    try {
      localStorage.setItem('pickcat:x:theme', state.theme);
    } catch {}
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', state.theme === 'light' ? '#ffffff' : state.theme === 'dark' ? '#000000' : '#15202b');
    const btn = $('#themeBtn');
    if (btn) btn.innerHTML = `${ICONS.theme}<span>${THEME_LABEL[state.theme]}</span>`;
  }

  /* ----------------------------------------------------------------- 视图 */

  let disposeView = null;
  let routeToken = 0;

  function resetMain(html) {
    const main = $('#main');
    main.innerHTML = html;
    return main;
  }

  /**
   * 官方推荐流（/topic-recommendations?sort=recommended）的 HMAC 游标在匿名访问下
   * 会返回 RECOMMENDATION_CURSOR_INVALID（实测），所以翻页时降级到热门榜；
   * latest 与 topics 的 base64 游标是正常的。
   */
  function buildFeedLoader(tab) {
    let phase = tab;
    let hotCursor = null;
    return async (cursor) => {
      if (phase === 'recommended') {
        try {
          const page = await api('/topic-recommendations', { query: { sort: 'recommended', limit: 20, cursor } });
          if (!page.pageInfo || !page.pageInfo.hasNextPage) phase = 'done';
          return page;
        } catch (error) {
          const code = String((error.data && error.data.code) || '');
          const expiring = /RECOMMENDATION_(CURSOR_INVALID|FEED_EXPIRED)/.test(code);
          if (!cursor || !expiring) throw error;
          phase = 'hot';
          hotCursor = null;
          const page = await api('/topics', { query: { sort: 'hot', limit: 20 } });
          hotCursor = (page.pageInfo && page.pageInfo.nextCursor) || null;
          if (!page.pageInfo || !page.pageInfo.hasNextPage) phase = 'done';
          return { items: page.items, pageInfo: page.pageInfo, note: '推荐流翻页已失效，下面是热门帖子' };
        }
      }
      if (phase === 'hot') {
        const page = await api('/topics', { query: { sort: 'hot', limit: 20, cursor: hotCursor } });
        hotCursor = (page.pageInfo && page.pageInfo.nextCursor) || null;
        if (!page.pageInfo || !page.pageInfo.hasNextPage) phase = 'done';
        return page;
      }
      if (phase === 'latest') {
        const page = await api('/topic-recommendations', { query: { sort: 'latest', limit: 20, cursor } });
        if (!page.pageInfo || !page.pageInfo.hasNextPage) phase = 'done';
        return page;
      }
      if (phase === 'following') {
        try {
          const page = await api('/topic-recommendations', {
            query: { sort: 'recommended', scope: 'following', limit: 20, cursor },
          });
          if (!page.pageInfo || !page.pageInfo.hasNextPage) phase = 'done';
          return page;
        } catch (error) {
          if (!cursor) throw error;
          phase = 'done';
          return { items: [], pageInfo: { hasNextPage: false }, note: '关注流翻页受限，先看到这里' };
        }
      }
      return { items: [], pageInfo: { hasNextPage: false } };
    };
  }

  function homeView(tab) {
    const safeTab = ['recommended', 'latest', 'following'].includes(tab) ? tab : 'recommended';
    const main = resetMain(
      topbar({
        title: '首页',
        tabs: tabLinks(
          [
            { key: 'recommended', label: '推荐', href: '#/home/recommended' },
            { key: 'latest', label: '最新', href: '#/home/latest' },
            { key: 'following', label: '关注', href: '#/home/following' },
          ],
          safeTab
        ),
      }) + `<div id="feed"></div>`
    );

    if (safeTab === 'following' && !state.viewer) {
      $('#feed', main).innerHTML = emptyState({
        title: '登录后查看关注的帖子',
        text: '在 Pickcat 官网登录一次，或把 <code>pickcat_session</code> 粘到这里的登录框。',
        action: loginAction('连接账号'),
      });
      return;
    }

    const feed = $('#feed', main);
    const timeline = createTimeline(feed, { load: buildFeedLoader(safeTab) });
    disposeView = () => timeline.dispose();
  }

  function exploreView(sort) {
    const safeSort = sort === 'latest' ? 'latest' : 'hot';
    const main = resetMain(
      topbar({
        title: '探索',
        tabs: tabLinks(
          [
            { key: 'hot', label: '热门', href: '#/explore/hot' },
            { key: 'latest', label: '最新', href: '#/explore/latest' },
          ],
          safeSort
        ),
      }) + `<div id="feed"></div>`
    );
    const timeline = createTimeline($('#feed', main), {
      load: (cursor) => api('/topics', { query: { sort: safeSort, limit: 20, cursor } }),
    });
    disposeView = () => timeline.dispose();
  }

  function tagView(slug, name, sort) {
    const safeSort = sort === 'hot' ? 'hot' : 'latest';
    const label = name || slug;
    const main = resetMain(
      topbar({
        title: '#' + label,
        back: '#/explore/hot',
        tabs: tabLinks(
          [
            { key: 'latest', label: '最新', href: `#/tag/${encodeURIComponent(slug)}/${encodeURIComponent(label)}/latest` },
            { key: 'hot', label: '热门', href: `#/tag/${encodeURIComponent(slug)}/${encodeURIComponent(label)}/hot` },
          ],
          safeSort
        ),
      }) + `<div id="feed"></div>`
    );
    const timeline = createTimeline($('#feed', main), {
      load: (cursor) => api('/topics', { query: { tag: slug, sort: safeSort, limit: 20, cursor } }),
    });
    disposeView = () => timeline.dispose();
  }

  function searchView(query) {
    const q = (query || '').trim();
    const main = resetMain(
      topbar({ title: '搜索', back: '#/home/recommended' }) +
        `<div class="search-hero"><form class="search-inner" id="searchForm">${ICONS.search}` +
        `<input type="search" name="q" placeholder="搜索帖子、用户" value="${esc(q)}" autocomplete="off" /></form></div>` +
        `<div id="searchUsers"></div>` +
        `<div id="searchTopics"></div>`
    );

    const form = $('#searchForm', main);
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const value = form.elements.q.value.trim();
      location.hash = value ? '#/search/' + encodeURIComponent(value) : '#/search';
    });
    if (!q) {
      const input = form.querySelector('input');
      if (input && window.matchMedia('(min-width: 701px)').matches) input.focus();
      const tags = state.side ? state.side.tags.slice(0, 10) : [];
      $('#searchTopics', main).innerHTML =
        `<div class="search-block">热门喵圈</div>` +
        (tags.length
          ? `<div class="chip-grid">${tags
              .map(
                (tag) =>
                  `<a class="chip" href="#/tag/${encodeURIComponent(tag.slug)}/${encodeURIComponent(tag.name)}">` +
                  `<b># ${esc(tag.name)}</b><span>${tag.count}</span></a>`
              )
              .join('')}</div>`
          : `<div class="empty"><p>输入关键词开始搜索。</p></div>`);
      return;
    }

    document.title = q + ' · 搜索 · PICKCAT';
    const token = ++routeToken;

    api('/search/users', { query: { q, limit: 6 } })
      .then((page) => {
        if (token !== routeToken) return;
        const items = (page.items || []).slice(0, 6);
        if (!items.length) return;
        $('#searchUsers', main).innerHTML =
          `<div class="search-block">用户</div>` +
          items
            .map(
              (user) =>
                `<a class="user-row" href="#/u/${encodeURIComponent(user.id)}">${avatarImg(user, 'card-avatar')}` +
                `<div style="min-width:0"><div class="side-row-title">${esc(user.username)}</div>` +
                `<div class="bio">${esc(clean(user.bio) || '还没有简介')}</div></div>` +
                `<span class="chip">查看</span></a>`
            )
            .join('');
      })
      .catch(() => {});

    const timeline = createTimeline($('#searchTopics', main), {
      load: (cursor) => api('/topics', { query: { q, sort: 'relevance', limit: 20, cursor } }),
    });
    $('#searchTopics', main).insertAdjacentHTML('afterbegin', `<div class="search-block">帖子</div>`);
    disposeView = () => timeline.dispose();
  }

  function replyNode(post, depth) {
    const author = post.author || {};
    const body = sanitizeRich(post.deleted ? '<p>该回复已删除</p>' : post.cookedHtml || post.plainText, {
      inline: false,
    });
    const children = (post.children || []).filter(Boolean);
    const likeCount = Number(post.likeCount) || 0;
    const liked = Boolean(post.viewerState && post.viewerState.liked);
    const wrapCls = depth > 0 ? 'child' : 'reply';
    return (
      `<article class="${wrapCls}" data-post="${esc(post.id)}">` +
      `<a href="#/u/${encodeURIComponent(author.id || '')}" aria-label="${esc(author.username || '')}">${avatarImg(
        author
      )}</a>` +
      `<div class="reply-body">` +
      `<div class="meta"><a class="name" href="#/u/${encodeURIComponent(author.id || '')}">${esc(
        author.username || '未知用户'
      )}</a><span class="time" title="${esc(absTime(post.createdAt))}">${relTime(post.createdAt)}</span></div>` +
      `<div class="reply-text">${body || '<span style="color:var(--muted)">（空回复）</span>'}</div>` +
      `<div class="reply-acts">` +
      `<button class="act like${liked ? ' on' : ''}" type="button" data-like="${esc(post.id)}" data-liked="${
        liked ? '1' : '0'
      }" data-count="${likeCount}">` +
      `<span class="ico">${ICONS.heart}</span><span class="n">${num(likeCount)}</span></button>` +
      `</div>` +
      (children.length
        ? `<div class="children">${children.map((child) => replyNode(child, depth + 1)).join('')}</div>`
        : '') +
      `</div></article>`
    );
  }

  function threadView(topicId) {
    const main = resetMain(topbar({ title: '帖子', back: '#/home/recommended' }) + `<div id="thread"></div>`);
    const host = $('#thread', main);
    host.innerHTML = skeleton(1);

    api('/topics/' + encodeURIComponent(topicId))
      .then((topic) => {
        if (!host.isConnected) return;
        const author = topic.author || {};
        const first = topic.firstPost || {};
        const caps = (first.viewerCapabilities) || {};
        const liked = Boolean(first.viewerState && first.viewerState.liked);
        const likeCount = Number(first.likeCount) || 0;
        const tags = (topic.tags || []).filter(Boolean);
        const body = sanitizeRich(first.cookedHtml);
        const canLike = caps.canLike !== false;

        host.innerHTML =
          `<article class="thread">` +
          `<div class="thread-head">` +
          `<a href="#/u/${encodeURIComponent(author.id || '')}" aria-label="${esc(author.username || '')}">${avatarImg(
            author
          )}</a>` +
          `<div class="thread-body">` +
          `<div class="thread-user"><b>${esc(author.username || '未知用户')}</b>` +
          (tags[0]
            ? `<span class="muted">·</span><a class="muted" href="#/tag/${encodeURIComponent(tags[0].slug)}/${encodeURIComponent(tags[0].name)}">${esc(tags[0].name)}</a>`
            : '') +
          `</div>` +
          (topic.pinnedGlobally || topic.pinned
            ? `<div class="thread-chip">${ICONS.pin}<span>置顶</span></div>`
            : '') +
          `<h1 class="thread-title">${esc(clean(topic.title) || '（无标题）')}</h1>` +
          `<div class="rich">${body || '<p style="color:var(--muted)">（没有正文）</p>'}</div>` +
          `</div></div>` +
          `<div class="thread-foot">` +
          `<div class="thread-stamp">${esc(absTime(topic.createdAt))}` +
          `<span class="views">· <b>${num(topic.viewCount)}</b> 浏览</span></div>` +
          `<div class="thread-actions">` +
          `<a class="act" href="#/t/${encodeURIComponent(topic.id)}" title="回复数"><span class="ico">${ICONS.reply}</span><span class="n">${num(
            topic.replyCount
          )}</span></a>` +
          `<button class="act like${liked ? ' on' : ''}" type="button" data-like="${esc(first.id || '')}" data-liked="${
            liked ? '1' : '0'
          }" data-count="${likeCount}" ${canLike ? '' : 'disabled'} style="${canLike ? '' : 'opacity:.5;cursor:not-allowed'}">` +
          `<span class="ico">${ICONS.heart}</span><span class="n">${num(likeCount)}</span></button>` +
          `<button class="act share" type="button" data-share="${esc(topic.id)}" title="复制链接"><span class="ico">${ICONS.share}</span></button>` +
          `</div></div></article>` +
          `<div class="replies-head">回复 <span>${num(topic.replyCount)}</span></div>` +
          `<div id="replies"></div>`;

        const repliesHost = $('#replies', host);
        return api('/topics/' + encodeURIComponent(topicId) + '/posts', { query: { limit: 30 } }).then((page) => {
          if (!repliesHost.isConnected) return;
          const seen = new Set();
          const addPage = (payload) => {
            const items = (payload.items || []).filter((p) => p && p.postNumber !== 1 && !p.deleted && !seen.has(p.id));
            items.forEach((p) => seen.add(p.id));
            if (items.length) repliesHost.insertAdjacentHTML('beforeend', items.map((p) => replyNode(p, 0)).join(''));
            return items.length;
          };
          if (!addPage(page)) {
            repliesHost.innerHTML = `<div class="empty"><p>还没有回复。去手机版或者官方站参与讨论吧。</p></div>`;
            return;
          }
          let cursor = (page.pageInfo && page.pageInfo.nextCursor) || null;
          if (!cursor) return;
          repliesHost.insertAdjacentHTML(
            'beforeend',
            `<div class="feed-foot"><button class="retry" type="button" data-more-replies>加载更多回复</button></div>`
          );
          const foot = repliesHost.querySelector('.feed-foot');
          const button = foot.querySelector('[data-more-replies]');
          button.addEventListener('click', async () => {
            button.disabled = true;
            button.textContent = '加载中…';
            try {
              const next = await api('/topics/' + encodeURIComponent(topicId) + '/posts', {
                query: { limit: 30, cursor },
              });
              addPage(next);
              cursor = (next.pageInfo && next.pageInfo.nextCursor) || null;
              if (cursor) {
                button.disabled = false;
                button.textContent = '加载更多回复';
              } else {
                foot.remove();
              }
            } catch (error) {
              button.disabled = false;
              button.textContent = '重试';
              toast(error.message || '加载失败', 'error');
            }
          });
        });
      })
      .catch((error) => {
        if (!host.isConnected) return;
        host.innerHTML = emptyState({
          title: '帖子加载失败',
          text: esc(error.message || '网络异常'),
          action: `<a class="btn-solid" href="/m">回到手机版</a>`,
        });
      });

    disposeView = null;
  }

  function profileView(userId) {
    const main = resetMain(
      topbar({ title: '个人主页', back: '#/home/recommended' }) +
        `<div id="profile"><div style="padding:0 0 16px">${skeleton(2)}</div></div>`
    );
    const host = $('#profile', main);
    const token = ++routeToken;

    api('/users/' + encodeURIComponent(userId))
      .then((user) => {
        if (token !== routeToken || !host.isConnected) return;
        const isMe = state.viewer && state.viewer.id === user.id;
        const following = Boolean(user.viewerState && user.viewerState.following);
        const stats = user.stats || {};
        const level = user.level && user.level.current;
        host.innerHTML =
          `<div class="profile-cover"></div>` +
          `<div class="profile-head">` +
          `<span class="profile-avatar"><img src="${esc(avatarOf(user))}" alt="${esc(user.username || '')}" /></span>` +
          `<div class="profile-actions">` +
          (isMe
            ? `<button class="btn-ghost" type="button" data-logout>${ICONS.logout}退出登录</button>`
            : `<button class="btn-solid js-follow${following ? ' following' : ''}" type="button" data-follow="${esc(
                user.id
              )}" data-following="${following ? '1' : '0'}">${following ? '已关注' : ICONS.plus + '关注'}</button>`) +
          `</div></div>` +
          `<div class="profile-info">` +
          `<div class="profile-name">${esc(user.username || '未知用户')}` +
          (level ? `<span class="lvl">Lv.${esc(level)}</span>` : '') +
          `</div>` +
          `<div class="profile-handle">@${esc(user.username || '')}${user.region ? ' · ' + esc(user.region) : ''}</div>` +
          (user.bio ? `<p class="profile-bio">${esc(clean(user.bio))}</p>` : '') +
          `<div class="profile-meta">` +
          `<span>${ICONS.calendar}${esc((user.createdAt || '').slice(0, 10))} 加入</span>` +
          (stats.topics ? `<span>${ICONS.tag}${num(stats.topics)} 帖子</span>` : '') +
          `</div>` +
          `<div class="profile-stats">` +
          `<span><b>${num(stats.following)}</b> 关注</span>` +
          `<span><b>${num(stats.followers)}</b> 粉丝</span>` +
          `</div>` +
          `</div>` +
          `<div class="tabs"><span class="tab active">帖子</span></div>` +
          `<div id="feed"></div>`;

        document.title = (user.username || '用户') + ' · PICKCAT';

        const timeline = createTimeline($('#feed', host), {
          load: (cursor) => api('/users/' + encodeURIComponent(userId) + '/topics', { query: { limit: 20, cursor } }),
        });
        disposeView = () => timeline.dispose();
      })
      .catch((error) => {
        if (!host.isConnected) return;
        host.innerHTML = emptyState({
          title: '用户加载失败',
          text: esc(error.message || '网络异常'),
          action: loginAction('重新连接'),
        });
      });
  }

  function meView() {
    if (state.viewer) {
      location.replace('#/u/' + encodeURIComponent(state.viewer.id));
      return;
    }
    resetMain(
      topbar({ title: '我的' }) +
        emptyState({
          title: '还没有连接账号',
          text: '在 Pickcat 官方站登录后，把 <code>pickcat_session</code> 粘贴进来，就能看到关注流、点赞和你自己的主页。',
          action: loginAction('连接账号'),
        }) +
        `<div class="side-foot" style="text-align:center;padding-bottom:32px">` +
        `<a href="https://pickcat.dao3.fun/login" target="_blank" rel="noopener">打开官方登录页</a>` +
        `</div>`
    );
  }

  /* ----------------------------------------------------------------- 路由 */

  function parseHash() {
    const raw = (location.hash || '').replace(/^#/, '');
    const path = raw.split('?')[0] || '/home/recommended';
    const segs = path
      .split('/')
      .filter(Boolean)
      .map((seg) => {
        try {
          return decodeURIComponent(seg);
        } catch {
          return seg;
        }
      });
    return segs;
  }

  function route() {
    if (disposeView) {
      try {
        disposeView();
      } catch {}
      disposeView = null;
    }
    routeToken += 1;
    const segs = parseHash();
    const head = segs[0] || 'home';

    if (head === 'home') homeView(segs[1]);
    else if (head === 'explore') exploreView(segs[1]);
    else if (head === 'tag') tagView(segs[1] || '', segs[2] || '', segs[3]);
    else if (head === 'search') searchView(segs[1] || '');
    else if (head === 't') threadView(segs[1] || '');
    else if (head === 'u') profileView(segs[1] || '');
    else if (head === 'me') meView();
    else {
      location.replace('#/home/recommended');
      return;
    }

    if (head !== 't' && head !== 'u') document.title = 'PICKCAT · 时间线';
    document.body.dataset.view = head;
    renderChrome();
    window.scrollTo(0, 0);
  }

  /* ----------------------------------------------------------------- 登录 */

  function openLogin() {
    if ($('.modal-back')) return;
    const back = document.createElement('div');
    back.className = 'modal-back';
    back.innerHTML =
      `<div class="modal" role="dialog" aria-modal="true" aria-label="连接账号">` +
      `<h2>连接 Pickcat 账号</h2>` +
      `<p>1. 打开 <a href="https://pickcat.dao3.fun/login" target="_blank" rel="noopener" style="color:var(--blue)">pickcat.dao3.fun/login</a> 完成登录；<br>` +
      `2. DevTools → Application → Cookies → 复制 <code>pickcat_session</code> 的值；<br>` +
      `3. 粘到下面点「连接」。只保存在本机浏览器。</p>` +
      `<textarea id="cookieInput" placeholder="pickcat_session=...（也可以直接粘整段 Cookie）" spellcheck="false"></textarea>` +
      `<div class="modal-row">` +
      `<button class="btn-ghost" type="button" data-close>取消</button>` +
      `<button class="btn-solid" type="button" data-connect>连接</button>` +
      `</div></div>`;
    document.body.append(back);
    const input = $('#cookieInput', back);
    setTimeout(() => input.focus(), 30);

    const close = () => back.remove();
    back.addEventListener('click', (event) => {
      if (event.target === back || event.target.closest('[data-close]')) close();
    });
    document.addEventListener(
      'keydown',
      (event) => {
        if (event.key === 'Escape' && $('.modal-back')) close();
      },
      { once: true }
    );

    $('[data-connect]', back).addEventListener('click', async () => {
      const value = input.value.trim();
      if (!value) return toast('先粘贴 Cookie', 'error');
      const btn = $('[data-connect]', back);
      btn.disabled = true;
      btn.textContent = '连接中…';
      try {
        const result = await window.PickcatAuth.importCookie(value);
        state.viewer = result.user;
        toast('已连接：' + (result.user && result.user.username ? '@' + result.user.username : '账号'));
        close();
        renderChrome();
        route();
      } catch (error) {
        toast(error.message || '连接失败', 'error');
        btn.disabled = false;
        btn.textContent = '连接';
      }
    });
  }

  async function toggleLike(button) {
    const postId = button.getAttribute('data-like');
    if (!postId) return;
    if (!state.viewer) {
      openLogin();
      return;
    }
    const liked = button.getAttribute('data-liked') === '1';
    let count = Number(button.getAttribute('data-count')) || 0;
    button.disabled = true;
    try {
      await api('/posts/' + encodeURIComponent(postId) + '/like', { method: liked ? 'DELETE' : 'PUT' });
      button.setAttribute('data-liked', liked ? '0' : '1');
      count = Math.max(0, count + (liked ? -1 : 1));
      button.setAttribute('data-count', String(count));
      button.classList.toggle('on', !liked);
      const n = button.querySelector('.n');
      if (n) n.textContent = num(count);
    } catch (error) {
      if (error.status === 401) {
        toast('登录已过期，请重新连接', 'error');
        state.viewer = null;
        renderChrome();
      } else {
        toast(error.message || '操作失败', 'error');
      }
    } finally {
      button.disabled = false;
    }
  }

  async function toggleFollow(button) {
    const userId = button.getAttribute('data-follow');
    if (!userId) return;
    if (!state.viewer) {
      openLogin();
      return;
    }
    const following = button.getAttribute('data-following') === '1';
    button.disabled = true;
    try {
      await api('/users/' + encodeURIComponent(userId) + '/follow', { method: following ? 'DELETE' : 'PUT' });
      button.setAttribute('data-following', following ? '0' : '1');
      button.classList.toggle('following', !following);
      button.innerHTML = following ? ICONS.plus + '关注' : '已关注';
      toast(following ? '已取消关注' : '已关注');
    } catch (error) {
      if (error.status === 401) {
        toast('登录已过期，请重新连接', 'error');
        state.viewer = null;
        renderChrome();
      } else {
        toast(error.message || '操作失败', 'error');
      }
    } finally {
      button.disabled = false;
    }
  }

  /* ------------------------------------------------------------- 卡片菜单 */

  function closeMenu() {
    const menu = $('.menu');
    if (menu) menu.remove();
  }

  function openCardMenu(button, card) {
    const already = $('.menu');
    closeMenu();
    if (already) return;
    const topicId = card.getAttribute('data-id');
    const userId = card.getAttribute('data-user');
    const url = location.origin + '/x/#/t/' + encodeURIComponent(topicId);
    const menu = document.createElement('div');
    menu.className = 'menu';
    menu.setAttribute('role', 'menu');
    menu.innerHTML =
      `<button type="button" data-menu-copy>${ICONS.link}<span>复制帖子链接</span></button>` +
      (userId ? `<a href="#/u/${encodeURIComponent(userId)}" data-menu-user>${ICONS.user}<span>打开作者主页</span></a>` : '');
    document.body.append(menu);

    const rect = button.getBoundingClientRect();
    const width = menu.offsetWidth;
    const left = Math.min(Math.max(8, rect.right - width), window.innerWidth - width - 8);
    const top = Math.min(rect.bottom + 6, window.innerHeight - menu.offsetHeight - 8);
    menu.style.left = left + 'px';
    menu.style.top = top + 'px';

    const copy = $('[data-menu-copy]', menu);
    copy.addEventListener('click', () => {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(
          () => toast('链接已复制'),
          () => toast(url)
        );
      } else {
        toast(url);
      }
      closeMenu();
    });
    const userLink = $('[data-menu-user]', menu);
    if (userLink) userLink.addEventListener('click', closeMenu);
  }

  /* --------------------------------------------------------------- 事件绑定 */

  document.addEventListener('click', (event) => {
    const more = event.target.closest('.meta .more');
    if (more) {
      event.preventDefault();
      event.stopPropagation();
      openCardMenu(more, more.closest('.card'));
      return;
    }
    if (!event.target.closest('.menu')) closeMenu();

    const login = event.target.closest('.js-login');
    if (login) {
      event.preventDefault();
      openLogin();
      return;
    }

    const themeToggle = event.target.closest('[data-theme-toggle], #themeBtn');
    if (themeToggle) {
      event.preventDefault();
      const next = THEMES[(THEMES.indexOf(state.theme) + 1) % THEMES.length];
      applyTheme(next);
      toast('外观：' + THEME_LABEL[next]);
      return;
    }

    const like = event.target.closest('[data-like]');
    if (like) {
      event.preventDefault();
      toggleLike(like);
      return;
    }

    const follow = event.target.closest('[data-follow]');
    if (follow) {
      event.preventDefault();
      toggleFollow(follow);
      return;
    }

    const share = event.target.closest('[data-share]');
    if (share) {
      event.preventDefault();
      event.stopPropagation();
      const id = share.getAttribute('data-share');
      const url = location.origin + '/x/#/t/' + encodeURIComponent(id);
      const done = () => toast('链接已复制');
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(done, () => toast(url));
      } else {
        toast(url);
      }
      return;
    }

    const logout = event.target.closest('[data-logout]');
    if (logout) {
      event.preventDefault();
      window.PickcatAuth.logout().then(() => {
        state.viewer = null;
        toast('已退出登录');
        renderChrome();
        location.hash = '#/home/recommended';
        route();
      });
      return;
    }

    // 点卡片空白区域进入帖子（和 X 一致），但不抢链接/按钮的点击
    const card = event.target.closest('.card');
    if (card && !event.target.closest('a,button')) {
      const id = card.getAttribute('data-id');
      if (id) location.hash = '#/t/' + encodeURIComponent(id);
    }
  });

  const refreshBtn = $('#refreshBtn');
  if (refreshBtn) refreshBtn.addEventListener('click', () => route());

  window.addEventListener('hashchange', route);
  window.addEventListener('scroll', closeMenu, { passive: true });

  /* ----------------------------------------------------------------- 启动 */

  // 门禁签署完成后别整页刷新：内容已经在门禁后面加载好了
  window.__pickcatStartApp = function () {};

  (function boot() {
    let theme = 'dim';
    try {
      theme = localStorage.getItem('pickcat:x:theme') || 'dim';
    } catch {}
    applyTheme(theme);
    renderChrome();
    renderSide();
    route();

    if (window.PickcatAuth && typeof window.PickcatAuth.status === 'function') {
      window.PickcatAuth.status()
        .then((result) => {
          if (!result || !result.connected) return;
          state.viewer = result.user;
          try {
            localStorage.setItem(PROFILE_KEY, JSON.stringify(result.user));
          } catch {}
          renderChrome();
          if (location.hash === '#/me' || !location.hash) route();
        })
        .catch(() => {});
    } else {
      const cached = (() => {
        try {
          return JSON.parse(localStorage.getItem(PROFILE_KEY) || 'null');
        } catch {
          return null;
        }
      })();
      if (cached && cached.id) state.viewer = cached;
    }
  })();
})();
