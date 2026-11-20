/**
 * PICKCAT 客户端登录态（浏览器侧）
 *
 * 登录态完全放在客户端：
 *  - `pickcat_session` 存在浏览器 Cookie（同时备份到 localStorage，便于「记住我」）
 *  - 每次 /api/v1/* 请求由浏览器自动带上 Cookie，server.mjs 只做纯转发
 *  - 过期检测、登出、导入都由这里负责，服务端不再保存会话
 *
 * 说明：Cookie 可被同源 JS 读取（这是"客户端管理登录态"的代价），
 * 因此本文件写入的 Cookie 只作用于当前站点（同源代理），不会外泄给官方域名。
 */
(function () {
  'use strict';

  const COOKIE_NAME = 'pickcat_session';
  const STORE_KEY = 'pickcat:session';
  const PROFILE_KEY = 'pickcat:user';

  function readCookie(name) {
    const raw = document.cookie || '';
    for (const part of raw.split(';')) {
      const [k, ...rest] = part.trim().split('=');
      if (k === name) return rest.join('=');
    }
    return '';
  }

  function writeCookie(name, value, days = 30) {
    const maxAge = Math.max(60, days * 86400);
    document.cookie = `${name}=${value}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
  }

  function clearCookie(name) {
    document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax`;
  }

  function normalizeCookie(raw) {
    let value = String(raw || '').trim();
    if (!value) return '';
    if (value.toLowerCase().startsWith(COOKIE_NAME + '=')) value = value.slice(COOKIE_NAME.length + 1);
    // 支持整段 Cookie 串（a=b; c=d）里挑出 pickcat_session
    if (value.includes(';')) {
      const hit = value.split(';').map((s) => s.trim()).find((s) => s.startsWith(COOKIE_NAME + '='));
      if (hit) value = hit.slice(COOKIE_NAME.length + 1);
      else value = value.split(';')[0].split('=').slice(1).join('=');
    }
    return value.trim().split(';')[0].trim();
  }

  function readBackup() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (!raw) return '';
      const parsed = JSON.parse(raw);
      return typeof parsed?.cookie === 'string' ? parsed.cookie : '';
    } catch {
      return '';
    }
  }

  /** 启动时把 localStorage 备份恢复成 Cookie，保证刷新后仍然登录 */
  function restore() {
    if (readCookie(COOKIE_NAME)) return true;
    const backup = readBackup();
    if (!backup) return false;
    writeCookie(COOKIE_NAME, backup);
    return true;
  }

  async function fetchSession({ cookie } = {}) {
    // 浏览器 Cookie 会自动带上；如果传了参数（刚导入还没落到 jar），显式带上
    const init = { headers: { Accept: 'application/json' } };
    if (cookie) init.headers['X-Pickcat-Session'] = cookie;
    const res = await fetch('/api/v1/session', init);
    if (res.status === 401) return { connected: false, expired: true };
    if (!res.ok) return { connected: false, status: res.status };
    const data = await res.json().catch(() => null);
    const user = data?.user || null;
    if (!user) return { connected: false };
    localStorage.setItem(PROFILE_KEY, JSON.stringify(user));
    return { connected: true, user, raw: data };
  }

  /**
   * 账号密码登录（需前端阿里云验证码产出的 captchaVerifyParam）
   * 成功后官方会下发 pickcat_session，经 server.mjs 转写成本机 Cookie
   */
  async function loginWithPassword({ account, password, captchaVerifyParam }) {
    const res = await fetch('/api/v1/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ account, password, captchaVerifyParam }),
    });
    const data = await res.json().catch(() => null);
    if (res.status === 201 && data && data.user) {
      // 服务端把 Set-Cookie 回写了，这里确认一次并落备份
      const cookie = readCookie(COOKIE_NAME);
      if (cookie) localStorage.setItem(STORE_KEY, JSON.stringify({ cookie, savedAt: Date.now() }));
      localStorage.setItem(PROFILE_KEY, JSON.stringify(data.user));
      return data.user;
    }
    if (res.status === 202) {
      // 需要二次验证（安全流程），官方会返回 flowId
      const err = new Error('账号需要二次验证，请先到官方站完成一次登录');
      err.flow = data;
      throw err;
    }
    if (res.status === 401 || res.status === 403) throw new Error('账号或密码不正确');
    if (res.status === 429) throw new Error('尝试过于频繁，请稍后再试');
    if (res.status === 400) {
      // 官方校验失败会给出字段级原因，例如不是已验证邮箱/手机号
      const first = data && data.details ? Object.values(data.details)[0] : null;
      throw new Error((Array.isArray(first) && first[0]) || (data && data.message) || '账号格式不正确');
    }
    throw new Error((data && (data.message || data.code)) || '登录失败（' + res.status + '）');
  }

  async function importCookie(raw) {
    const value = normalizeCookie(raw);
    if (!value) throw new Error('请粘贴 pickcat_session 的值');
    const result = await fetchSession({ cookie: value });
    if (!result.connected) {
      clearCookie(COOKIE_NAME);
      localStorage.removeItem(STORE_KEY);
      throw new Error(result.expired ? 'Cookie 已过期或无效' : 'Cookie 校验失败');
    }
    writeCookie(COOKIE_NAME, value);
    localStorage.setItem(STORE_KEY, JSON.stringify({ cookie: value, savedAt: Date.now() }));
    return result;
  }

  async function logout() {
    try {
      await fetch('/api/v1/session', { method: 'DELETE', headers: { Accept: 'application/json' } });
    } catch {
      /* 网络失败也要清本地 */
    }
    clearCookie(COOKIE_NAME);
    localStorage.removeItem(STORE_KEY);
    localStorage.removeItem(PROFILE_KEY);
    localStorage.removeItem('pickcat:auth');
  }

  function cachedUser() {
    try {
      const raw = localStorage.getItem(PROFILE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  window.PickcatAuth = {
    COOKIE_NAME,
    restore,
    status: async () => {
      restore();
      if (!readCookie(COOKIE_NAME) && !readBackup()) return { connected: false };
      return fetchSession();
    },
    importCookie,
    loginWithPassword,
    logout,
    cachedUser,
    hasCookie: () => Boolean(readCookie(COOKIE_NAME)),
  };
})();
