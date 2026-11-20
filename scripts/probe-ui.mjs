// 鎵撳紑椤甸潰 鈫?鏀堕泦鎺у埗鍙伴敊璇?/ 椤甸潰閿欒 鈫?缁熻鍏抽敭鑺傜偣 鈫?鎴浘
// 鐢ㄦ硶: node scripts/probe-ui.mjs <url> <out.png> [width] [height]
import { spawn } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const [url, out = 'probe.png', w = '430', h = '932', action = ''] = process.argv.slice(2);
const width = Number(w);
const height = Number(h);

const child = spawn(EDGE, ['--headless=new', '--disable-gpu', '--remote-debugging-port=9336', '--user-data-dir=' + join(tmpdir(), 'pcn-probe-' + Date.now()), 'about:blank'], { stdio: 'ignore' });

let page = null;
for (let i = 0; i < 40; i++) {
  await sleep(250);
  try {
    const list = await (await fetch('http://127.0.0.1:9336/json/list')).json();
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
    logs.push(`[console.${m.params.type}] ` + m.params.args.map((a) => a.value ?? a.description ?? a.type).join(' '));
  }
  if (m.method === 'Runtime.exceptionThrown') {
    logs.push('[exception] ' + (m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text));
  }
};

await send('Runtime.enable');
await send('Network.enable');
await send('Network.setCacheDisabled', { cacheDisabled: true });
await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 2, mobile: width < 800 });
await send('Page.navigate', { url });
await sleep(6500);
if (action) { await send('Runtime.evaluate', { expression: action }); await sleep(4500); }

const expr = `(() => {
  const q = (s) => document.querySelectorAll(s).length;
  return JSON.stringify({
    view: [...document.querySelectorAll('.view')].filter((v) => v.offsetParent && v.getBoundingClientRect().height > 0).map((v) => v.id).join(','),
    feedCards: q('[data-feed] > *'),
    loading: q('.loading-card.is-loading'),
    errors: [...document.querySelectorAll('.loading-card.is-error, .error-card')].map((n) => n.textContent.trim().slice(0, 140)),
    circles: q('[data-circles] > *'),
    text: (document.querySelector('.view.active') || document.body).innerText.slice(0, 200),
    probe: document.body.getAttribute('data-probe') || '',
  });
})()`;

const res = await send('Runtime.evaluate', { expression: expr, returnByValue: true });
console.log('STATE:', res.result?.result?.value);
console.log('LOGS:', logs.length ? '\n  ' + logs.slice(0, 12).join('\n  ') : 'none');

const shot = await send('Page.captureScreenshot', { format: 'png' });
if (shot.result?.data) {
  const buf = Buffer.from(shot.result.data, 'base64');
  writeFileSync(out, buf);
  console.log('SAVED', out, buf.length, 'bytes');
} else {
  console.log('CAPTURE FAILED', JSON.stringify(shot).slice(0, 300));
}
child.kill();
process.exit(0);






