// 观察官方登录页如何产出 captchaVerifyParam：记录网络请求与脚本
import { spawn } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const child = spawn(EDGE, ['--headless=new', '--disable-gpu', '--remote-debugging-port=9337', '--user-data-dir=' + join(tmpdir(), 'pcn-login-' + Date.now()), 'about:blank'], { stdio: 'ignore' });

let page = null;
for (let i = 0; i < 40; i++) {
  await sleep(250);
  try {
    const list = await (await fetch('http://127.0.0.1:9337/json/list')).json();
    page = list.find((t) => t.type === 'page');
    if (page) break;
  } catch {}
}
if (!page) { console.error('no devtools'); child.kill(); process.exit(1); }

const ws = new WebSocket(page.webSocketDebuggerUrl);
let id = 0;
const pending = new Map();
const send = (m, p = {}) => new Promise((r) => { const mid = ++id; pending.set(mid, r); ws.send(JSON.stringify({ id: mid, method: m, params: p })); });

const requests = [];
const scripts = [];
await new Promise((r) => (ws.onopen = r));
ws.onmessage = (e) => {
  const msg = JSON.parse(e.data);
  if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg); pending.delete(msg.id); return; }
  if (msg.method === 'Network.requestWillBeSent') {
    const { request, type } = msg.params;
    if (type === 'Script') scripts.push(request.url);
    if (/\/api\/v1\/(session|registrations|captcha)/.test(request.url) || /captcha/.test(request.url)) {
      requests.push({ method: request.method, url: request.url, body: request.postData });
    }
  }
  if (msg.method === 'Network.responseReceived' && /captcha/i.test(msg.params.response.url)) {
    requests.push({ response: msg.params.response.url, status: msg.params.response.status });
  }
};

await send('Runtime.enable');
await send('Network.enable');
await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride', { width: 430, height: 932, deviceScaleFactor: 2, mobile: true });
await send('Page.navigate', { url: 'https://pickcat.dao3.fun/login' });
await sleep(6000);

// 填入假账号密码并提交，观察请求结构
const fill = `(() => {
  const inputs = [...document.querySelectorAll('input')];
  const acc = inputs.find((i) => /account|email|phone|账号|邮箱|手机/.test(i.name + i.placeholder + i.type));
  const pwd = inputs.find((i) => i.type === 'password');
  const setValue = (el, v) => {
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
    setter.call(el, v);
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  };
  if (acc) setValue(acc, 'TARGET_ACCOUNT@example.com');
  if (pwd) setValue(pwd, 'TARGET_PASSWORD');
  const btn = [...document.querySelectorAll('button')].find((b) => /登录|登陆/.test(b.textContent));
  return JSON.stringify({ inputs: inputs.map((i) => i.name + ':' + i.type + ':' + i.placeholder), btn: btn ? btn.textContent.trim() : null, clicked: !!btn });
})()`;
const filled = await send('Runtime.evaluate', { expression: fill, returnByValue: true });
console.log('PAGE:', filled.result?.result?.value);

await send('Runtime.evaluate', { expression: `[...document.querySelectorAll('button')].find((b)=>/登录|登陆/.test(b.textContent))?.click()` });
await sleep(8000);

const domShot = await send('Runtime.evaluate', { expression: `document.body.innerText.slice(0, 400)`, returnByValue: true });
console.log('AFTER:', JSON.stringify(domShot.result?.result?.value));
console.log('\nREQUESTS:');
for (const r of requests) console.log(JSON.stringify(r).slice(0, 500));
console.log('\nCAPTCHA SCRIPTS:');
console.log([...new Set(scripts.filter((s) => /captcha|aliyun|alicdn|aliyuncs/i.test(s)))].join('\n') || 'none');

child.kill();
process.exit(0);
