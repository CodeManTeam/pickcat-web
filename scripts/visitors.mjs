#!/usr/bin/env node
/**
 * 访客统计（读 data/visits.jsonl）
 *
 *   node scripts/visitors.mjs                 # 概览 + 最近 30 位访客
 *   node scripts/visitors.mjs --days 7        # 只看最近 7 天
 *   node scripts/visitors.mjs --top 100       # 最多列 100 位
 *   node scripts/visitors.mjs --json          # 输出 JSON（给别的脚本用）
 *
 * 说明：visitor id 由浏览器在 localStorage 生成，换设备/清缓存会算新访客；
 * IP 来自 Cloudflare 的 CF-Connecting-IP（nginx realip），所以能区分 NAT 后的不同人。
 */
import { readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const FILE = process.env.PICKCAT_VISITS || join(HERE, '..', 'data', 'visits.jsonl');

const argv = process.argv.slice(2);
const arg = (name, def) => {
  const i = argv.indexOf(name);
  return i >= 0 ? argv[i + 1] : def;
};
const DAYS = Number(arg('--days', 0)) || 0;
const TOP = Number(arg('--top', 30)) || 30;
const AS_JSON = argv.includes('--json');

let rows = [];
try {
  const text = await readFile(FILE, 'utf8');
  rows = text
    .split('\n')
    .filter(Boolean)
    .map((line) => {
      try {
        return JSON.parse(line);
      } catch {
        return null;
      }
    })
    .filter(Boolean);
} catch (err) {
  if (err.code === 'ENOENT') {
    console.log('还没有访客记录：' + FILE);
    console.log('（部署后第一名访客打开页面就会生成）');
    process.exit(0);
  }
  throw err;
}

const now = Date.now();
const since = DAYS ? now - DAYS * 86400_000 : 0;
const inRange = rows.filter((r) => +new Date(r.ts) >= since);

if (!rows.length) {
  console.log('还没有访客记录：' + FILE);
  console.log('（有访客打开页面后会自动生成，每 30 分钟最多一条）');
  process.exit(0);
}

if (!inRange.length) {
  console.log(`近 ${DAYS} 天没有记录（总共 ${rows.length} 条）。`);
  process.exit(0);
}

const dayKey = (d) => new Date(d).toLocaleDateString('sv-SE'); // YYYY-MM-DD
const visitors = new Map();
for (const r of inRange) {
  const v = visitors.get(r.id) || {
    id: r.id,
    first: r.ts,
    last: r.ts,
    pings: 0,
    ip: r.ip,
    ua: r.ua,
    country: r.country,
    firstRef: r.ref,
    paths: new Map(),
    days: new Set(),
  };
  v.pings += 1;
  if (+new Date(r.ts) < +new Date(v.first)) v.first = r.ts;
  if (+new Date(r.ts) > +new Date(v.last)) {
    v.last = r.ts;
    v.ip = r.ip;
    v.ua = r.ua;
  }
  v.ip = v.ip || r.ip;
  v.ua = v.ua || r.ua;
  v.country = v.country || r.country;
  if (r.ref && !v.firstRef) v.firstRef = r.ref;
  v.paths.set(r.path, (v.paths.get(r.path) || 0) + 1);
  v.days.add(dayKey(r.ts));
  visitors.set(r.id, v);
}

const list = [...visitors.values()].sort((a, b) => +new Date(b.last) - +new Date(a.last));
const byDay = new Map();
for (const r of inRange) byDay.set(dayKey(r.ts), (byDay.get(dayKey(r.ts)) || 0) + 1);
const uniqueByDay = new Map();
for (const v of list) {
  for (const d of v.days) {
    if (!uniqueByDay.has(d)) uniqueByDay.set(d, new Set());
    uniqueByDay.get(d).add(v.id);
  }
}

const refHost = (ref) => {
  if (!ref) return '(直接访问)';
  try {
    return new URL(ref).hostname;
  } catch {
    return ref.slice(0, 40);
  }
};
const uaTag = (ua = '') => {
  if (/Edg\//.test(ua)) return 'Edge';
  if (/Chrome\//.test(ua) && /Mobile/.test(ua)) return 'Chrome 手机';
  if (/Chrome\//.test(ua)) return 'Chrome 桌面';
  if (/iPhone|iPad/.test(ua)) return 'iOS Safari';
  if (/Safari\//.test(ua)) return 'Safari';
  if (/Firefox\//.test(ua)) return 'Firefox';
  return (ua || '未知').slice(0, 24);
};
const dur = (a, b) => {
  const s = Math.max(0, Math.round((+new Date(b) - +new Date(a)) / 1000));
  if (s < 60) return `${s}s`;
  if (s < 3600) return `${Math.round(s / 60)}m`;
  return `${(s / 3600).toFixed(1)}h`;
};

const returning = list.filter((v) => v.pings > 1).length;

const summary = {
  window: { from: rows[0]?.ts, to: rows.at(-1)?.ts, days: DAYS || null },
  pings: inRange.length,
  uniqueVisitors: list.length,
  returningVisitors: returning,
  pingsPerVisitor: +(inRange.length / list.length).toFixed(2),
  today: {
    pings: byDay.get(dayKey(now)) || 0,
    visitors: uniqueByDay.get(dayKey(now))?.size || 0,
  },
  byDay: [...byDay.entries()].sort().map(([d, pings]) => ({
    day: d,
    pings,
    visitors: uniqueByDay.get(d)?.size || 0,
  })),
  referrers: Object.entries(
    inRange.reduce((acc, r) => {
      const h = refHost(r.ref);
      acc[h] = (acc[h] || 0) + 1;
      return acc;
    }, {})
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([host, pings]) => ({ host, pings })),
  visitors: list.slice(0, TOP).map((v) => ({
    id: v.id,
    first: v.first,
    last: v.last,
    pings: v.pings,
    ip: v.ip,
    country: v.country,
    browser: uaTag(v.ua),
    firstRef: v.firstRef,
    topPath: [...v.paths.entries()].sort((a, b) => b[1] - a[1])[0]?.[0],
  })),
};

if (AS_JSON) {
  console.log(JSON.stringify(summary, null, 2));
  process.exit(0);
}

const pad = (s, n) => String(s ?? '').padEnd(n).slice(0, n);
// 服务器本地时区（+0800）显示
const fmt = (iso) => new Date(iso).toLocaleString('sv-SE', { hour12: false }).slice(5, 16);
console.log('==== PICKCAT 第三方测试站 · 访客统计 ====');
console.log(`文件: ${FILE}`);
console.log(
  `范围: ${fmt(rows[0]?.ts)} ~ ${fmt(rows.at(-1)?.ts)}${DAYS ? `（近 ${DAYS} 天）` : ''}`
);
console.log('');
console.log(`唯一访客   ${list.length}`);
console.log(`上报次数   ${inRange.length}（人均 ${summary.pingsPerVisitor} 次）`);
console.log(`回访访客   ${returning}`);
console.log(`今天       ${summary.today.visitors} 人 / ${summary.today.pings} 次`);
console.log('');
console.log('-- 按天 --');
console.log(pad('日期', 12) + pad('访客', 8) + '上报');
for (const d of summary.byDay) {
  console.log(pad(d.day, 12) + pad(d.visitors, 8) + d.pings);
}
console.log('');
console.log('-- 来源 --');
for (const r of summary.referrers) console.log(pad(r.host, 34) + r.pings);
console.log('');
console.log(`-- 最近 ${Math.min(TOP, list.length)} 位访客 --`);
console.log(
  pad('最近访问', 17) + pad('停留', 8) + pad('次数', 6) + pad('IP', 18) + pad('地区', 5) + pad('浏览器', 12) + '首次来源'
);
for (const v of list.slice(0, TOP)) {
  console.log(
    pad(fmt(v.last), 17) +
      pad(dur(v.first, v.last), 8) +
      pad(v.pings, 6) +
      pad(v.ip, 18) +
      pad(v.country || '-', 5) +
      pad(uaTag(v.ua), 12) +
      refHost(v.firstRef)
  );
}
if (list.length > TOP) console.log(`…… 其余 ${list.length - TOP} 位用 --top ${list.length} 查看`);
