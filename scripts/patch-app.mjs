// 把 Reborn app.js 的数据层替换成官方 API 适配层（保留全部 UI 代码）
import { readFileSync, writeFileSync } from 'node:fs';

const file = 'web/app.js';
let src = readFileSync(file, 'utf8');
const orig = src.length;

function replaceOnce(label, from, to) {
  const idx = src.indexOf(from);
  if (idx === -1) throw new Error('未找到待替换片段: ' + label);
  src = src.slice(0, idx) + to + src.slice(idx + from.length);
  console.log('patched:', label);
}

// 1) 整个 api 对象 → 适配层
{
  const start = src.indexOf('const api = {');
  const endMarker = '\n};\n\nfunction stripHtml';
  const end = src.indexOf(endMarker, start);
  if (start === -1 || end === -1) throw new Error('api 对象定位失败');
  src = src.slice(0, start) + 'const api = window.PickcatOfficialApi;\n\n' + src.slice(end + '\n};\n\n'.length);
  console.log('patched: api object');
}

// 2) 登录表单 → Cookie 会话导入
{
  const start = src.indexOf('async function submitLogin(event) {');
  const end = src.indexOf('async function publishPost() {');
  if (start === -1 || end === -1) throw new Error('submitLogin 定位失败');
  const replacement = `async function submitLogin(event) {
  event.preventDefault();
  const submitButton = $("button[type='submit']", event.currentTarget);
  const form = new FormData(event.currentTarget);
  const status = $("[data-login-status]");
  const cookie = String(form.get("password") || form.get("identity") || "").trim();
  if (!cookie) {
    status.textContent = "请粘贴 pickcat_session 的值";
    return;
  }
  status.textContent = "正在校验会话...";
  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = "连接中...";
  }
  try {
    const loginResult = await api.loginV1("", cookie);
    state.user = loginResult.data.user_info;
    state.auth = { token: "pickcat_session", cookie: "", method: "session" };
    state.savedLogin = null;
    localStorage.removeItem("pickcat:login");
    saveSessionToStorage(false);
    syncPlayerAuth();
    status.textContent = "会话已连接，正在进入我的页面。";
    renderMineShell(state.user);
    navigateLocal("mine");
  } catch (error) {
    status.textContent = "连接失败：" + error.message;
  } finally {
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = "登录";
    }
  }
}

/** 读取服务端会话（pickcat_session 存在本机 data/session.json） */
async function hydrateOfficialSession() {
  try {
    const session = await window.PickcatOfficialApi.sessionState();
    if (session && session.connected && session.user) {
      const profile = window.PickcatOfficialApi.toUserProfile(session.user);
      state.user = profile;
      state.auth = { token: "pickcat_session", cookie: "", method: "session" };
      localStorage.setItem("pickcat:user", JSON.stringify(profile));
      localStorage.setItem("pickcat:auth", JSON.stringify(state.auth));
    } else {
      clearSavedSession();
    }
  } catch {
    // 离线时按未登录处理
  }
}

`;
  src = src.slice(0, start) + replacement + src.slice(end);
  console.log('patched: submitLogin + hydrateOfficialSession');
}

// 3) init 里注入会话恢复
{
  const from = `async function init() {
  applyRuntimeShellMode();
  hydrateNativeSession();
  syncPlayerAuth();`;
  const to = `async function init() {
  applyRuntimeShellMode();
  hydrateNativeSession();
  await hydrateOfficialSession();
  syncPlayerAuth();`;
  replaceOnce('init hydrate', from, to);
}

// 4) 版本号与页脚说明
src = src.replace('Pickcat Reborn v0.1.0', 'PICKCAT 正式网页版 v1.0.0');

writeFileSync(file, src, 'utf8');
console.log('app.js:', orig, '->', src.length);
