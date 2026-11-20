// 验证站内登录：点击登录 → 验证码 → POST /api/v1/session 的请求体是否带 captchaVerifyParam
import { spawn } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const child = spawn(EDGE, ['--headless=new', '--disable-gpu', '--remote-debugging-port=9338', '--user-data-dir=' + join(tmpdir(), 'pcn-login2-' + Date.now()), 'about:blank'], { stdio: 'ignore' });

let page = null;
for (let i = 0; i < 40; i++) {
  await sleep(250);
  try {
    const list = await (await fetch('http://127.0.0.1:9338/json/list')).json();
    page = list.find((t) => t.type === 'page');
    if (page) break;
  } catch {}
}
if (!page) { console.error('no devtools'); child.kill(); process.exit(1); }

const ws = new WebSocket(page.webSocketDebuggerUrl);
let id = 0;
const pending = new Map();
const send = (m, p = {}) => new Promise((r) => { const mid = ++id; pending.set(mid, r); ws.send(JSON.stringify({ id: mid, method: m, params: p })); });

const posts = [];
await new Promise((r) => (ws.onopen = r));
ws.onmessage = (e) => {
  const msg = JSON.parse(e.data);
  if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg); pending.delete(msg.id); return; }
  if (msg.method === 'Network.requestWillBeSent') {
    const { request } = msg.params;
    if (request.url.includes('/api/v1/session') && request.method === 'POST') posts.push(request.postData || '');
  }
};

await send('Runtime.enable');
await send('Network.enable');
await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride', { width: 430, height: 932, deviceScaleFactor: 2, mobile: true });
await send('Page.navigate', { url: 'http://127.0.0.1:4173/?view=login' });
await sleep(7000);

// 判断 SDK 是否初始化
const ready = await send('Runtime.evaluate', { expression: "document.querySelector('[data-login-status]')?.textContent", returnByValue: true });
console.log('STATUS:', ready.result?.result?.value);

await send('Runtime.evaluate', {
  expression: `(() => {
    const f = document.querySelector('[data-login-form]');
    f.elements.account.value = 'TARGET_ACCOUNT@example.com';
    f.elements.password.value = 'TARGET_PASSWORD';
    document.querySelector('#pickcat-login-btn').click();
  })()`,
});
await sleep(9000);

const after = await send('Runtime.evaluate', { expression: "document.querySelector('[data-login-status]')?.textContent", returnByValue: true });
const dom = await send('Runtime.evaluate', { expression: "document.body.innerText.slice(-200)", returnByValue: true });
console.log('AFTER:', after.result?.result?.value);
console.log('DOM TAIL:', JSON.stringify(dom.result?.result?.value));
console.log('LOGIN POSTS:', posts.length ? posts.map((b) => b.slice(0, 260)).join('\n') : 'none');

child.kill();
process.exit(0);
