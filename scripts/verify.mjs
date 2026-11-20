// 端到端连通性验证
const base = 'http://127.0.0.1:4173';
let pass = 0;
let fail = 0;

async function check(label, fn) {
  try {
    const info = await fn();
    pass++;
    console.log('PASS  ' + label + (info ? '  → ' + info : ''));
  } catch (err) {
    fail++;
    console.log('FAIL  ' + label + '  → ' + err.message);
  }
}

const json = async (path) => {
  const r = await fetch(base + path);
  const t = await r.text();
  let d;
  try {
    d = JSON.parse(t);
  } catch {
    d = { raw: t };
  }
  return { status: r.status, data: d };
};

await check('静态首页', async () => {
  const r = await fetch(base + '/');
  const t = await r.text();
  if (r.status !== 200 || !t.includes('PICKCAT')) throw new Error('bad html');
  return t.length + ' bytes';
});

await check('lib 目录可访问', async () => {
  const r = await fetch(base + '/lib/api-endpoints.js');
  const t = await r.text();
  if (!t.includes('export const ROUTES')) throw new Error('missing routes export');
  return t.length + ' bytes';
});

await check('健康检查', async () => {
  const { data } = await json('/__health');
  if (!data.ok) throw new Error('not ok');
  return 'routes=' + data.routes + ' connected=' + data.connected;
});

await check('路由清单 119 条', async () => {
  const { data } = await json('/__routes');
  if (data.total !== 119) throw new Error('expected 119, got ' + data.total);
  return Object.keys(data.groups).join('/');
});

await check('反代 /works', async () => {
  const { status, data } = await json('/api/v1/works?limit=2');
  if (status !== 200 || !Array.isArray(data.items)) throw new Error('bad payload');
  return data.items.length + ' items, first=' + data.items[0].workName;
});

await check('反代 /topics', async () => {
  const { status, data } = await json('/api/v1/topics?sort=hot&limit=2');
  if (status !== 200 || !Array.isArray(data.items)) throw new Error('bad payload');
  return data.items.length + ' items';
});

await check('反代头像（二进制）', async () => {
  const r = await fetch(base + '/api/v1/avatars/1');
  const buf = await r.arrayBuffer();
  if (r.status !== 200 || buf.byteLength < 1000) throw new Error('bad image');
  return r.headers.get('content-type') + ' ' + buf.byteLength + ' bytes';
});

await check('legacy 板块列表', async () => {
  const { data } = await json('/legacy/forums/boards/simples/all');
  if (!data.items?.length) throw new Error('no boards');
  return data.items.length + ' boards e.g. ' + data.items.map((b) => b.slug).slice(0, 4).join(',');
});

await check('legacy 板块帖子流(offset)', async () => {
  const { data } = await json('/legacy/forums/boards/interest-plaza/posts?offset=2&limit=3');
  if (!Array.isArray(data.items) || data.items.length === 0) throw new Error('empty');
  return 'offset=' + data.offset + ' got=' + data.items.length;
});

await check('legacy 帖子搜索（降级）', async () => {
  const { data } = await json('/legacy/forums/posts/search?title=' + encodeURIComponent('公告') + '&page=1&limit=3');
  if (!data.degraded) throw new Error('expected degraded flag');
  return 'total=' + data.total + ' got=' + data.items.length;
});

await check('legacy 帖子详情', async () => {
  const { data } = await json('/legacy/forums/posts/01a1e9c1-566d-7268-bbca-4f0bececb8e4/details');
  if (!data.details?.title || !Array.isArray(data.posts)) throw new Error('bad shape');
  return data.details.title.slice(0, 16) + '… posts=' + data.posts.length;
});

await check('legacy 登录引导', async () => {
  const r = await fetch(base + '/legacy/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ account: 'TARGET', password: 'TARGET' }),
  });
  const data = await r.json();
  if (data.code !== 'CAPTCHA_REQUIRED') throw new Error('expected CAPTCHA_REQUIRED');
  return data.options.map((o) => o.id).join(',');
});

await check('legacy 我的作品(未登录应 401)', async () => {
  const r = await fetch(base + '/legacy/works/mine');
  if (r.status !== 401) throw new Error('expected 401, got ' + r.status);
  return '401 as expected';
});

await check('legacy 透传代理', async () => {
  const { status, data } = await json('/legacy/proxy/v1/works?limit=1');
  if (status !== 200 || !data.items) throw new Error('bad proxy result');
  return '1 work via proxy';
});

await check('会话状态(未连接)', async () => {
  const { data } = await json('/__session');
  if (data.connected !== false) throw new Error('unexpected session');
  return 'connected=false';
});

await check('写操作未登录被拒(401)', async () => {
  const r = await fetch(base + '/api/v1/works/01a1f83a-fe37-7767-8c35-989d0088e024/like', { method: 'PUT' });
  if (r.status !== 401) throw new Error('expected 401, got ' + r.status);
  return '401 as expected';
});

console.log('\n通过 ' + pass + ' / 失败 ' + fail);
process.exit(fail ? 1 : 0);
