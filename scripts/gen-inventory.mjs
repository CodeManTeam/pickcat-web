import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ROUTES, ROUTE_GROUPS } from '../lib/api-endpoints.js';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');

const lines = [];
lines.push('# 官方 PICKCAT API 路由清单');
lines.push('');
lines.push('> 自动生成：`node scripts/gen-inventory.mjs`，核对用 `GET /__routes`。');
lines.push('');
lines.push(`共 **${ROUTES.length}** 条 `+'`method + path`'+` 组合，全部挂在 \`https://pickcat.dao3.fun/api/v1\` 之下。`);
lines.push('');

for (const [group, list] of Object.entries(ROUTE_GROUPS)) {
  lines.push(`## ${group}（${list.length}）`);
  lines.push('');
  lines.push('| 方法 | 路径 | 客户端方法 |');
  lines.push('| --- | --- | --- |');
  for (const r of list) {
    lines.push(`| ${r.method} | \`${r.path}\` | \`api.call('${r.method}', '${r.path}')\` |`);
  }
  lines.push('');
}

mkdirSync(resolve(root, 'docs'), { recursive: true });
writeFileSync(resolve(root, 'docs', 'api-inventory.md'), lines.join('\n'), 'utf8');
console.log('inventory rows:', ROUTES.length);
