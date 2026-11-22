// X 时间线视图的探针：打开页面 → 滚动若干屏 → 统计卡片/控制台错误 → 截图
// 用法: node scripts/probe-x.mjs <url> <out.png> [width] [height] [scrolls]
import { spawn } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const [url, out = 'x.png', w = '1440', h = '1000', scrolls = '0'] = process.argv.slice(2);
const width = Number(w);
const height = Number(h);

const child = spawn(
  EDGE,
  ['--headless=new', '--disable-gpu', '--remote-debugging-port=9338', '--user-data-dir=' + join(tmpdir(), 'pcx-' + Date.now()), 'about:blank'],
  { stdio: 'ignore' }
);

let page = null;
for (let i = 0; i < 40; i++) {
  await sleep(250);
  try {
    const list = await (await fetch('http://127.0.0.1:9338/json/list')).json();
    page = list.find((t) => t.type === 'page');
    if (page) break;
  } catch {}
}
if (!page) {
  console.error('devtools not ready');
  child.kill();
  process.exit(1);
}

const ws = new WebSocket(page.webSocketDebuggerUrl);
let id = 0;
const pending = new Map();
const send = (method, params = {}) =>
  new Promise((res) => {
    const mid = ++id;
    pending.set(mid, res);
    ws.send(JSON.stringify({ id: mid, method, params }));
  });

const logs = [];
await new Promise((r) => (ws.onopen = r));
ws.onmessage = (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) {
    pending.get(m.id)(m);
    pending.delete(m.id);
    return;
  }
  if (m.method === 'Runtime.consoleAPICalled' && ['error', 'warning'].includes(m.params.type)) {
    logs.push('[console.' + m.params.type + '] ' + m.params.args.map((a) => a.value ?? a.description ?? a.type).join(' '));
  }
  if (m.method === 'Runtime.exceptionThrown') {
    logs.push('[exception] ' + (m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text));
  }
};

await send('Runtime.enable');
await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 2, mobile: width < 800 });
await send('Page.navigate', { url });
await sleep(2600);

// 第三方门禁：开发探针直接写入「已签署」，省得每跑一次都要打字
const gated = await send('Runtime.evaluate', {
  expression: "!!document.querySelector('.pc-gate')",
  returnByValue: true,
});
if (gated.result?.result?.value) {
  await send('Runtime.evaluate', {
    expression:
      "localStorage.setItem('pickcat:thirdparty-consent:v1', JSON.stringify({accepted:true,text:'这个项目非官方，随时关闭，账号存储不安全',version:1,acceptedAt:new Date().toISOString()})); 'signed'",
  });
  await send('Page.reload', {});
  await sleep(3200);
} else {
  await sleep(1200);
}

for (let i = 0; i < Number(scrolls); i++) {
  await send('Runtime.evaluate', { expression: 'window.scrollTo(0, document.body.scrollHeight)' });
  await sleep(1500);
}

const expr = `(() => {
  const cards = document.querySelectorAll('.card').length;
  const replies = document.querySelectorAll('.reply, .child').length;
  const sk = document.querySelectorAll('.sk').length;
  const end = document.querySelector('.feed-end')?.textContent || '';
  const err = document.querySelector('.empty h3')?.textContent || '';
  return JSON.stringify({ cards, replies, sk, end, err, title: document.title, hash: location.hash });
})()`;
const res = await send('Runtime.evaluate', { expression: expr, returnByValue: true });
console.log('STATE:', res.result?.result?.value);
if (process.env.X_EVAL) {
  const extra = await send('Runtime.evaluate', {
    expression: process.env.X_EVAL,
    returnByValue: true,
    awaitPromise: true,
  });
  console.log('EVAL:', JSON.stringify(extra.result?.result?.value ?? extra.result));
}
console.log('LOGS:', logs.length ? '\n  ' + logs.slice(0, 10).join('\n  ') : 'none');

await send('Runtime.evaluate', { expression: 'window.scrollTo(0,0)' });
await sleep(600);
const shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
if (shot.result?.data) {
  writeFileSync(out, Buffer.from(shot.result.data, 'base64'));
  console.log('SAVED', out);
} else {
  console.log('CAPTURE FAILED');
}
child.kill();
process.exit(0);
