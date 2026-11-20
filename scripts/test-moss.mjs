// 验证 MOSS 反代：取推荐流里的 MOSS 播放地址 → 走 /moss 代理 → 检查 HTML 是否注入 base
const base = 'http://127.0.0.1:4173';
const rec = await (await fetch(base + '/api/v1/work-recommendations')).json();
const moss = (rec.items || []).filter((w) => w.type === 'MOSS' && w.player);
console.log('moss works with player:', moss.length);
for (const w of moss.slice(0, 2)) {
  const proxied = w.player.entryUrl.replace('https://moss.pickcat.dao3.fun', '/moss');
  const res = await fetch(base + proxied);
  const text = await res.text();
  console.log('---');
  console.log('work:', w.id, 'sid:', w.sourceWorkId);
  console.log('proxy:', proxied);
  console.log('status:', res.status, res.headers.get('content-type'), 'len:', text.length);
  console.log('base injected:', /<base href="\/moss\/">/.test(text));
  console.log('title:', (text.match(/<title>([^<]*)<\/title>/) || [])[1] || '-');
}
