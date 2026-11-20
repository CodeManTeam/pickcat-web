# Pickcat-Reborn → PICKCAT 正式网页版 API 迁移说明

## 结论先说

| 项目 | 状态 |
| --- | --- |
| 迁移目标 | 把 `CodeManTeam/Pickcat-Reborn` 里对「编程猫旧社区（`/web/forums/*`、`/tiger/v3/web/accounts/*`、`creation-tools/*`）」的调用，全部改接到 `https://pickcat.dao3.fun/api/v1` |
| 正式网页版地址 | <https://pickcat.dao3.fun>（实测 `X-Powered-By: Nuxt`，API 为独立 REST 服务） |
| 官方路由总数 | **119** 条（从官方 Nuxt 客户端 SDK 静态抽取，见 [api-inventory.md](./api-inventory.md)） |
| 客户端覆盖 | `lib/client.js` 语义化封装 + `api.call(method, path)` 全量兜底 |
| 无对应接口 | 已按「同类功能降级」接入，逐条列在下方《缺失接口降级表》 |
| 本地反代 | `server.mjs` 把 `/api/v1/*` 同源转发，解决 CORS 并把 `pickcat_session` 收在服务端 |
| 兼容层 | `server.mjs` 暴露 `/legacy/*`，保持 Reborn 的旧 URL 语义，内部改走官方接口 |
| **UI 处理** | **完全沿用 Reborn 的 `index.html` + `styles.css` + `app.js` + `public/assets`，只把 `const api = {...}` 换成 `web/api-official.js` 适配层；旧逻辑与样式零改动** |

---

## 一、Reborn 旧接口 → 官方接口 逐条映射

Reborn 的 `docs/api-map.md` 只声明了 5 个社区接口 + 1 个登录接口 + 1 个作品列表接口。逐条对照如下。

| # | Reborn 旧接口 | 官方对应 | 迁移方式 | 备注 |
| --- | --- | --- | --- | --- |
| 1 | `GET /web/forums/posts/<post_id>/details` | `GET /topics/{topicId}` + `GET /topics/{topicId}/posts` | 直连替换 | 正文在 `topic.firstPost.cookedHtml`；楼层在 `posts.items[]` |
| 2 | `GET /web/forums/posts/search?title=&page=&limit=` | ❌ 无 `/search/topics` | **降级** | 官方仅有 `/search/works`、`/search/users`。降级为「`/topics?sort=latest` 拉 100 条 + 本地标题匹配 + 分页切片」 |
| 3 | `GET /web/forums/boards/simples/all` | ❌ 无 `/boards` | **降级** | 板块 = 话题 `tags[]`。由 `/topics` 响应聚合 `tag.id / tag.slug / tag.name`，并保留 Reborn 内置板块表兜底 |
| 4 | `GET /web/forums/boards/<board_id>/posts?offset=&limit=` | `GET /topics?tag=<slug>&limit=&cursor=&sort=` | 直连替换（offset 语义适配） | 官方是游标分页，兼容层按 `offset` 自动翻页补齐 |
| 5 | `POST /tiger/v3/web/accounts/login` | `POST /session` | 条件直连 | 官方强制 `captchaVerifyParam`（阿里云验证码 2.0）。无该参数时兼容层返回 `CAPTCHA_REQUIRED` + 两条可行路径 |
| 6 | `GET creation-tools/v1/user/center/work-list` | `GET /users/{userId}/works` | 直连替换 | 先 `GET /session` 取当前用户，再查其作品 |
| 7 | `/proxy/codemao/*`、`/proxy/creation/*`、`/proxy/open-service/*` | `/api/v1/*` | 直连替换 | Reborn 用它绕 CORS，正式版由 `server.mjs` 反代完成 |

### 字段级差异（前端必须改的地方）

| 场景 | Reborn（旧社区） | 正式版（pickcat.dao3.fun） |
| --- | --- | --- |
| 帖子正文 | Markdown 文本 | 服务端渲染的 `cookedHtml`（可直接展示，需白名单清洗） |
| 楼层/评论 | 自建结构 | `postNumber` / `commentNumber`，树形 `children[]` |
| 头像 | 绝对 URL | 相对 `/api/v1/avatars/{id}` 或 `/api/v1/files/{id}`，需经同源代理 |
| 板块 | `board_id` 数字 | `tag.slug` 字符串（如 `interest-plaza`） |
| 作品 | 数字 `workId` | UUID `id`；数字编号在 `sourceWorkId` |
| 用户 | 数字 uid | UUID `id`；统计在 `stats.{topics,replies,followers,following}` |
| 分页 | `offset + limit` | `cursor + limit`，`pageInfo.nextCursor` |

---

## 二、缺失接口降级表（"没有的就寻找类似功能"）

| 需求 | 官方现状 | 采用的同类功能 |
| --- | --- | --- |
| 话题搜索 | 无 `/search/topics` | `/topics?sort=latest` 全量拉取 + 服务端标题过滤；前端搜索页只保留「作品 / 用户」两个官方检索 |
| 板块/分区 | 无 `/boards`、`/circles` | 话题 `tags[]` 聚合为板块；`/topics?tag=<slug>` 作为板块帖子流 |
| 关注流 | 无 `/feed/following` | `/topic-recommendations` + `/work-recommendations` 的 `reason` 字段；关注关系用 `GET /users/{userId}/following` |
| 动态/广场 | 无 `/feed` | `/topics?sort=hot|latest` 与 `/works` 组合 |
| 收藏（旧） | 无独立接口 | `/work-favorites`（作品收藏）+ `/bookmark-folders`（帖子/楼层收藏夹） |
| 草稿箱 | 无 | `POST /posts` 的 `Idempotency-Key` + `POST /post-submissions` 审核流 |
| 点赞通知聚合 | 旧接口无 | `/like-notification-groups`、`/notification-summary` |
| 登录（免验证码） | 不支持 | 会话桥：浏览器登录官方站点 → 复制 `pickcat_session` → `PUT /__session` |
| 作品同步 | 旧接口无 | `POST /works/{workId}/sync`（同步编程猫源站改动） |
| 实名/换绑/安全 | 旧接口无 | `/security-flows/*`、`/users/{userId}/email-changes`、`/phone-changes` 等 |

---

## 三、兼容层 `/legacy/*` 用法

保留 Reborn 旧 URL，内部改走官方接口，便于把旧页面逐步替换成正式版数据源。

```bash
# 1. 板块列表（聚合话题 tags）
curl 'http://127.0.0.1:4173/legacy/forums/boards/simples/all'

# 2. 板块帖子流（offset 语义，内部转游标）
curl 'http://127.0.0.1:4173/legacy/forums/boards/interest-plaza/posts?offset=0&limit=8'

# 3. 帖子搜索（降级实现，返回 degraded:true）
curl 'http://127.0.0.1:4173/legacy/forums/posts/search?title=公告&page=1&limit=5'

# 4. 帖子详情（topic + 楼层）
curl 'http://127.0.0.1:4173/legacy/forums/posts/01a1e9c1-566d-7268-bbca-4f0bececb8e4/details'

# 5. 我的作品（需会话）
curl 'http://127.0.0.1:4173/legacy/works/mine?limit=10'

# 6. 旧登录（无验证码参数时给出引导）
curl -X POST 'http://127.0.0.1:4173/legacy/login' \
  -H 'Content-Type: application/json' \
  -d '{"account":"TARGET_ACCOUNT","password":"TARGET_PASSWORD"}'

# 7. 透传代理（替代 Reborn /proxy/codemao/*）
curl 'http://127.0.0.1:4173/legacy/proxy/v1/works?limit=2'
```

---

## 四、会话获取（官方登录必须过验证码）

官方 `POST /api/v1/session` 的请求体：

```json
{
  "account": "TARGET_ACCOUNT",
  "password": "TARGET_PASSWORD",
  "captchaVerifyParam": "ALIYUN_CAPTCHA_TOKEN"
}
```

`captchaVerifyParam` 由阿里云验证码 2.0 前端 SDK 生成（`GET /captcha-config?purpose=login` 返回
`{"provider":"ALIYUN_CAPTCHA","region":"cn","prefix":"1rbvwn","sceneId":"1icer78a"}`），纯 HTTP 无法稳定伪造。

正式网页版因此提供会话桥：

```bash
# 1. 在 https://pickcat.dao3.fun/login 完成滑块登录
# 2. DevTools → Application → Cookies → 复制 pickcat_session 的值
curl -X PUT http://127.0.0.1:4173/__session \
  -H 'Content-Type: application/json' \
  -d '{"cookie":"<pickcat_session 值>"}'

# 3. 校验
curl http://127.0.0.1:4173/__session

# 4. 断开
curl -X DELETE http://127.0.0.1:4173/__session
```

也可以通过环境变量直接注入：`PICKCAT_SESSION=<值> npm start`。

如果确实拿到了 `captchaVerifyParam`，`POST /legacy/login` 会把它转发给官方接口，成功后自动收下并保存会话 Cookie。

---

## 五、错误码对照

| HTTP | `code` | 处理建议 |
| --- | --- | --- |
| 401 | `UNAUTHENTICATED` / `AUTHENTICATION_REQUIRED` | 未连接账号 → 「设置」页导入会话 |
| 400 | `VALIDATION_FAILED` | 请求参数不合法，`details` 字段会给出原因（如 `sort` 只允许 `relevance|latest|hot`） |
| 400 | `INVALID_CURSOR` | 游标失效，重置为首屏重新拉取 |
| 403 | `USER_FOLLOW_LIST_PRIVATE` | 对方关闭了关注/粉丝名单 |
| 404 | `ROUTE_NOT_FOUND` | 该接口不存在（本题「缺失接口」） |
| 422 | `CONTENT_MODERATION_REJECTED` | 内容审核拒绝，带 `submissionId` 与 `reasonCode` |

---

## 六、已知限制

1. **写操作**（发帖 / 回复 / 评论 / 点赞 / 关注 / 收藏 / 资料修改）需要有效会话，且部分还需要手机绑定与社区权限，未连接账号时页面会显式拦截。
2. `POST /posts`、`POST /works/{workId}/comments` 的字段结构官方未公开（客户端 SDK 里是透传的 `body`），本项目的请求体按最短合法形态构造，服务端的 `VALIDATION_FAILED` / `422` 会原样回显给用户。
3. 官方推荐接口（`/work-recommendations`、`/topic-recommendations`）会返回 `impressionId`，正式上报浏览需再调 `POST /session/activity` 或对应埋点接口，本项目暂不上报。
4. 作品封面部分 CDN 链接（`creation.bcmcdn.com`）会 404，属于官方源数据问题，前端已做占位兜底。
5. 本项目为第三方独立客户端，与官方无关联，数据全部来自官方公开 API，仅供学习交流、不得商用。
