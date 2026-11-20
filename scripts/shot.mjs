// CDP 截图：可精确设置视口 / DPR，输出整页 PNG
// 用法: node scripts/shot.mjs <url> <outfile> [width] [height] [dpr]
import { spawn } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { setTimeout as sleep } from 'node:timers/promises';

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const [url, out, w = '1440', h = '1000', dpr = '1'] = process.argv.slice(2);
const width = Number(w);
const height = Number(h);

const child = spawn(EDGE, ['--headless=new', '--disable-gpu', '--remote-debugging-port=9334', 'about:blank'], { stdio: 'ignore' });

let page = null;
for (let i = 0; i < 40; i++) {
  await sleep(250);
  try {
    const list = await (await fetch('http://127.0.0.1:9334/json/list')).json();
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

await new Promise((r) => (ws.onopen = r));
ws.onmessage = (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) {
    pending.get(m.id)(m);
    pending.delete(m.id);
  }
};

await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: Number(dpr), mobile: width < 800 });
// 用 Promise 等待字体与图片
await send('Page.navigate', { url });
await sleep(4500);

const shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, fromSurface: true });
if (!shot.result?.data) {
  console.error('capture failed', JSON.stringify(shot).slice(0, 300));
  child.kill();
  process.exit(1);
}
writeFileSync(out, Buffer.from(shot.result.data, 'base64'));
console.log('saved', out);
child.kill();
process.exit(0);
