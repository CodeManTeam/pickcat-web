# 部署说明（dangerous_pickdog.dao4.fun）

第三方测试站，域名经 Cloudflare 代理到 `tokyo-ai`（43.167.16.178）。

## 当前生产环境

| 项目 | 值 |
| --- | --- |
| 域名 | `dangerous_pickdog.dao4.fun`（Cloudflare 代理，HTTP + HTTPS 均可用） |
| 主机 | `tokyo-ai` / `43.167.16.178` / 用户 `ai-migrate`（sudo 免密） |
| 代码目录 | `/srv/migration/pickcat-web` |
| 进程 | `pickcat-web.service` → `/usr/local/bin/node server.mjs`，监听 `127.0.0.1:4173` |
| 反向代理 | `/etc/nginx/conf.d/pickcat-dao4.conf`（80 + 443） |
| 源站证书 | `/etc/nginx/ssl/pickcat-dao4.{crt,key}`（自签，SAN = 该域名，10 年） |
| 应用日志 | `journalctl -u pickcat-web` |
| 访问日志 | `/var/log/nginx/pickcat-dao4.access.log` |

### 证书说明（重要）

域名含下划线（`dangerous_pickdog`），Let's Encrypt 明确拒绝签发：
`Cannot issue for "dangerous_pickdog.dao4.fun": Domain name contains an invalid character`。

因此源站用自签证书，浏览器看到的证书是 Cloudflare 的边缘证书（正常可信），
但 **Cloudflare 的 SSL/TLS 模式必须保持 `Flexible` 或 `Full`，不能改成 `Full (strict)`**，
否则 CF 会因源站证书不可信而返回 526。

## 入口门禁（您走错了）

`web/gate.js` + `web/gate.css`，在 `web/index.html` 的 `<head>` 里同步加载：

- 未签署时给 `<html>` 加 `gate-locked`，`.phone-shell` 直接 `visibility:hidden`，
  再叠一层全屏门禁（标题「您走错了」、官方入口 `https://pickcat.dao3.fun`、严肃声明）；
- `web/app.js` 末尾的启动逻辑被门禁接管：未签署不执行 `init()`，
  所以**签署前不会发出任何 `/api/v1` 请求**（实测 0 次）；
- 必须逐字输入「这个项目非官方，随时关闭，账号存储不安全」才能进入；
- 签署结果写入 `localStorage`：

  ```json
  { "accepted": true, "text": "这个项目非官方，随时关闭，账号存储不安全", "version": 1, "acceptedAt": "..." }
  ```

  键名 `pickcat:thirdparty-consent:v1`；再次访问直接进站，不再询问；
- 想强制重新签署：控制台执行 `PickcatThirdPartyGate.reset()` 后刷新，
  或点门禁页右下角「清除记录」；
- 改声明文案时把 `gate.js` 里的 `version` 一起 +1，老签署记录会自动失效。

深链接（`/login`、`/?post=…`）同样先过门禁，因为 SPA 回退的入口也是这份 `index.html`。

## 访问统计 / 唯一访客

### 1. 真实客户端 IP（nginx realip）

源站看到的 `$remote_addr` 本来是 Cloudflare 边缘 IP（172.x / 162.159.x / 104.x…），
无法区分访客。现已在 **本站 vhost 内**单独 include：

```nginx
include /etc/nginx/snippets/cloudflare-realip.conf;   # set_real_ip_from CF 网段 + CF-Connecting-IP
```

- 网段取自 Cloudflare 官方 `ips-v4` / `ips-v6`，只在这两个 server 块生效，
  其他直连站点不会被伪造的 `CF-Connecting-IP` 污染；
- 从此 `/var/log/nginx/pickcat-dao4.access.log` 第一列就是访客真实 IP；
- Cloudflare 网段会变，隔几个月重跑一次生成命令即可（见文件头注释日期）。

### 2. 匿名访客 ID（去重靠它）

`web/gate.js` 会给每个浏览器生成 `pickcat:visitor-id`（`crypto.randomUUID()`，
存在 localStorage），**每 30 分钟最多上报一次** `POST /__visit`：

```json
{"ts":"...","id":"uuid","path":"/","ref":"https://pickcat.dao3.fun/","ip":"1.2.3.4","country":"HK","ua":"..."}
```

- 落在 `data/visits.jsonl`，一行一条，不记录任何账号/密码信息；
- 换设备、清缓存算新访客；同一 NAT 后的不同设备算不同访客（比按 IP 去重准）；
- 门禁页和进入后的页面都会上报，所以「只看了眼门禁就走」也算一次访问。

### 3. 看报表

```bash
cd /srv/migration/pickcat-web
node scripts/visitors.mjs              # 概览 + 最近 30 位访客（IP/地区/浏览器/来源/停留）
node scripts/visitors.mjs --days 7     # 只看近 7 天
node scripts/visitors.mjs --top 200    # 列更多人
node scripts/visitors.mjs --json       # 机器可读
```

清空统计：`: > /srv/migration/pickcat-web/data/visits.jsonl`

> 2026-11-22 之前的访问只能看 nginx 日志，且日志里是 CF 边缘 IP，**无法精确去重**；
> 真实 IP 与 visitor id 从 2026-11-22 12:21 起才开始记录。

## 更新发布

本地改完后重新打包上传（`node --check web/gate.js web/app.js` 先过一遍）：

```powershell
tar.exe -czf pickcat-web.tar.gz -C <repo> --exclude=.git --exclude=scripts/shots .
scp -i C:/Users/ourmi/.ssh/SpecialKey4AI-LoginAndMigration pickcat-web.tar.gz ai-migrate@43.167.16.178:/srv/migration/
ssh -i C:/Users/ourmi/.ssh/SpecialKey4AI-LoginAndMigration ai-migrate@43.167.16.178 \
  "tar -xzf /srv/migration/pickcat-web.tar.gz -C /srv/migration/pickcat-web && sudo systemctl restart pickcat-web"
```

只改前端静态文件时不用重启：直接覆盖对应文件即可（`Cache-Control: max-age=60`，
Cloudflare 可能再缓存 60 秒，必要时在 CF 面板 Purge）。

## 常用命令

```bash
sudo systemctl status pickcat-web
sudo journalctl -u pickcat-web -f
sudo systemctl restart pickcat-web
sudo nginx -t && sudo systemctl reload nginx

# 本机直连校验
curl -sS http://127.0.0.1:4173/__health
curl -sS -H 'Host: dangerous_pickdog.dao4.fun' http://127.0.0.1/ | grep gate.js

# 绕过 Cloudflare 直连源站
curl -sk --resolve dangerous_pickdog.dao4.fun:443:127.0.0.1 https://dangerous_pickdog.dao4.fun/
```

## 其他站未受影响

新增的是独立 `server` 块，只匹配 `server_name dangerous_pickdog.dao4.fun`；
`astra-ai.xyz` / `bazi.daoverse.lol` 等既有站点仍返回 200。
（`daoverse.lol` 的 502 是它自己的 upstream `127.0.0.1:3001` 没起，与本次部署无关。）
