# NOTICE

## 上游与版权

- **界面（HTML / CSS / 交互逻辑、图标素材）**
  来源：<https://github.com/CodeManTeam/Pickcat-Reborn>
  版权归 CodeManTeam 及 PICKCAT / 编程猫原作者所有，按上游自定义限制许可使用（禁止商用，修改/分发需保持同条件）。

- **数据接口**
  `https://pickcat.dao3.fun/api/v1`，由 PICKCAT 官方提供。本项目只调用公开接口，不包含官方私有代码或 SDK。

- **验证码**
  登录使用阿里云验证码 2.0 前端 SDK（`o.alicdn.com/captcha-frontend/aliyunCaptcha/AliyunCaptcha.js`），
  按其服务条款使用。

## 本项目自行编写的内容（MIT，见 LICENSE）

- `server.mjs`：静态托管、`/api/v1` 反代、`/moss/*` 播放器反代与 OIDC 单点登录、`/proxy/media`、`/legacy/*` 兼容层
- `web/auth.js`：客户端登录态（Cookie + localStorage）
- `web/login.js`：站内账号密码登录（阿里云验证码）
- `web/api-official.js`：官方接口适配层
- `scripts/*`：路由抽取、文档生成、UI 探针、端到端校验
- `docs/*`、`README.md`

## 免责声明

本项目为第三方独立客户端，与 PICKCAT 官方无任何关联。仅供学习交流，不得用于商业用途。
使用本项目产生的一切数据与行为由使用者自行负责。
