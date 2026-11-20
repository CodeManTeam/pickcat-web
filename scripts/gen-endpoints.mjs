// 生成 lib/api-endpoints.js —— 官方 pickcat.dao3.fun 全量路由清单
// 数据源：_src/api-routes.json（从官方 Nuxt 客户端 SDK 中抽取的 119 条 method+path）
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const src = resolve(here, '../../pickcat-migration/_src/api-routes.json');
const routes = JSON.parse(readFileSync(src, 'utf8').replace(/^\uFEFF/, ''));

const clean = routes
  .filter((r) => r.Path.startsWith('/') && !r.Path.startsWith('/api/'))
  .map((r) => ({ method: r.Method, path: r.Path }))
  .sort((a, b) => a.path.localeCompare(b.path) || a.method.localeCompare(b.method));

const uniq = [];
const seen = new Set();
for (const r of clean) {
  const k = `${r.method} ${r.path}`;
  if (seen.has(k)) continue;
  seen.add(k);
  uniq.push(r);
}

const header = `/**
 * 官方 PICKCAT API 路由清单（自动生成，勿手改）
 *
 * 来源：https://pickcat.dao3.fun 的 Nuxt 客户端 SDK chunk 静态抽取
 * 生成命令：node scripts/gen-endpoints.mjs
 * 共 ${uniq.length} 条 method + path 组合，全部挂在 /api/v1 之下。
 */
`;

const body = `export const API_BASE = '/api/v1';

export const ROUTES = ${JSON.stringify(uniq, null, 2)};

/** 路由分组：按业务域归类，便于 SDK 与文档引用 */
export const ROUTE_GROUPS = (() => {
  const groups = {};
  const pick = (p) => {
    if (p.startsWith('/manage')) return '后台管理';
    if (p.startsWith('/session') || p.startsWith('/registrations') || p.startsWith('/password-resets') || p.startsWith('/security-flows') || p.startsWith('/account-recovery')) return '认证与会话';
    if (p.startsWith('/works') || p.includes('/works/') || p.startsWith('/work-')) return '作品';
    if (p.startsWith('/posts') || p.startsWith('/post-submissions')) return '帖子回复';
    if (p.startsWith('/topics') || p.startsWith('/questions')) return '话题问答';
    if (p.startsWith('/users')) return '用户';
    if (p.startsWith('/search')) return '搜索';
    if (p.startsWith('/notifications') || p.startsWith('/like-notification-groups')) return '通知';
    if (p.startsWith('/bookmark')) return '收藏夹';
    return '通用';
  };
  for (const r of ROUTES) {
    const g = pick(r.path);
    (groups[g] ||= []).push(r);
  }
  return groups;
})();

/** 把 \`/works/{workId}\` 这类模板替换成真实路径 */
export function fillPath(template, params = {}) {
  return template.replace(/\\{(\\w+)\\}/g, (_, key) => {
    const v = params[key];
    if (v === undefined || v === null || v === '') throw new Error('缺少路径参数 ' + key + ' 于 ' + template);
    return encodeURIComponent(String(v));
  });
}
`;

mkdirSync(resolve(here, '..', 'lib'), { recursive: true });
writeFileSync(resolve(here, '..', 'lib', 'api-endpoints.js'), header + body, 'utf8');
console.log('wrote', uniq.length, 'routes');
