# 油猴脚本：在官方站用手机版旧 UI

把 `pickcat-web` 的 Pickcat-Reborn 手机界面搬到**官方站** `https://pickcat.dao3.fun/` 上，
不用再走第三方测试站。

## 安装

1. 浏览器装 [Tampermonkey](https://www.tampermonkey.net/)（Edge / Chrome / Firefox / 手机版都行）；
2. 打开
   <https://raw.githubusercontent.com/CodeManTeam/pickcat-web/master/dist/pickcat-mobile.user.js>
   ，Tampermonkey 会弹出安装页，点「安装」；
3. 打开 <https://pickcat.dao3.fun/>，直接就是旧版界面。

脚本自带 `@updateURL`，以后仓库更新 `dist/` 后 Tampermonkey 会自动提示升级。

## 怎么切回去

右侧中间有个竖排小挂耳：点「官方」→ 回到官方原版界面（会刷新页面）；
回到官方界面后同一位置变成「旧版」，点它再切回来。

也可以在 Tampermonkey 菜单里「切换回官方界面」。
开关记在 `localStorage['pickcat:userscript:enabled']`（`1` = 旧版，`0` = 官方）。

## 它做了什么

| 能力 | 实现 |
| --- | --- |
| 旧版 UI | 把 `web/index.html` 的 body、`web/styles.css`、`app.js` 整套注入宿主页面 |
| 数据 | 直接同源请求官方 `/api/v1`（脚本就在 `pickcat.dao3.fun` 上跑，不存在跨域） |
| 登录态 | 完全复用官方 Cookie；`GET /api/v1/session` 校验，不写、不复制 Cookie |
| 站内登录 | 阿里云验证码同样走官方接口，官方站 CSP 已放行 `o.alicdn.com` |
| 图片/头像 | 官方 CDN 直连（没有测试站那层 `/proxy/media`） |
| MOSS 作品 | 用官方下发的签名播放地址直连（没有 `/moss` 反代） |
| 站内路由 | 改成 `?view=...&id=...`，刷新/前进后退能还原页面 |

## 和测试站版本的差异

- **没有**「您走错了」门禁页——这是官方域名，不需要；
- **没有** `/proxy/media`、`/moss/*` 反代，对应功能改成直连；
- **没有** 服务端，所有逻辑在浏览器里；
- 官方站自己的 Nuxt 界面被隐藏（`#__nuxt`），但它的 JS 仍会在后台跑，属于预期。

## 已知限制

- 官方站改版（换 Nuxt 构建、换 class）可能让注入样式冲突，需要重新对一下；
- 官方把 `pickcat_session` 设成 HttpOnly 时，脚本读不到 Cookie，但登录态判断走接口，不影响；
- MOSS 播放依赖官方 `player.entryUrl`（带签名、有时效），过期就点「打开官方页」；
- 脚本体积约 2 MB，因为 50 个图标/背景全部内联成 data URI（不依赖任何外部服务器）。

## 构建

改完 `web/` 里的 UI 后重新生成：

```bash
node scripts/build-userscript.mjs          # 产物 dist/pickcat-mobile.user.js
PICKCAT_UA_VERSION=1.0.1 node scripts/build-userscript.mjs
```

构建时会自动：

1. 把 `web/public/assets/**` 全部转成 data URI（HTML / CSS / JS 里的引用都替换）；
2. 给 `app.js` / `api-official.js` / `auth.js` 打 5 个最小补丁（去掉 `/proxy/media`、`/moss` 中转、
   不覆写官方 Cookie、返回键走站内路由）；
3. 拼上 `userscript/glue.js`（挂载、样式注入、切换按钮、错误兜底）和 `// ==UserScript==` 头。

## 调试

```js
// 控制台里
localStorage.setItem('pickcat:userscript:enabled', '0'); location.reload(); // 临时回官方界面
```
