# HTTPS 间歇失败排查（api.wqjwin.top）

## 症状

- `http://124.223.94.156:3000/api/health` 稳定 200
- `https://api.wqjwin.top/api/health` 手机 Safari / Postman 前几次失败，偶尔成功后再稳定
- 4G、WiFi 均有

说明：**Node 正常，443（Nginx TLS）或云防护异常**。

---

## 第一步：SSH 在服务器跑（把输出保存发给别人排查）

```bash
echo "=== 1. 本机 → Nginx (30次) ==="
for i in $(seq 1 30); do
  curl -sk -o /dev/null -w "local $i: %{http_code} %{time_total}s\n" \
    https://127.0.0.1/api/health -H "Host: api.wqjwin.top"
done

echo "=== 2. 服务器 → 公网域名 (30次) ==="
for i in $(seq 1 30); do
  curl -sk -o /dev/null -w "domain $i: %{http_code} %{time_total}s\n" \
    https://api.wqjwin.top/api/health
done

echo "=== 3. Node 直连 ==="
curl -s http://127.0.0.1:3000/api/health; echo

echo "=== 4. 443 监听 ==="
ss -tlnp | grep -E ':443|:3000'

echo "=== 5. 所有 443 server 块 ==="
nginx -T 2>/dev/null | grep -E "listen.*443|server_name"

echo "=== 6. 最近错误日志 ==="
tail -30 /www/wwwlogs/api.wqjwin.top.error.log
```

### 结果解读

| 结果 | 结论 |
|------|------|
| local 全 200，domain 有失败 | 腾讯云公网入站 / DDoS / 线路问题 |
| local 也有失败 | Nginx 配置或证书问题 |
| error.log 出现 `SSL_do_handshake` / `broken header` | TLS/证书链问题 |
| 失败时 access.log **无记录** | 握手阶段被掐断（防护/WAF/证书） |
| 失败时 access.log **502** | Node 未启动或崩溃 |

---

## 第二步：手机失败时实时看日志

终端 A：

```bash
tail -f /www/wwwlogs/api.wqjwin.top.error.log
```

终端 B：

```bash
tail -f /www/wwwlogs/api.wqjwin.top.log
```

手机 Safari 刷新 health，看失败瞬间有没有新日志。

---

## 第三步：宝塔必做

1. **WAF** → 关闭，或 `api.wqjwin.top` 加白名单
2. **网站 → api.wqjwin.top → 防 CC** → 关闭
3. **SSL** → 改用 **Let's Encrypt** 重新申请（替换 LiteSSL 试一轮）
4. 确认证书文件是 **fullchain.pem**（含中间证书）

---

## 第四步：Nginx 使用稳定版

见 `nginx-api.wqjwin.top.conf.example`：

- 仅 `listen 443 ssl`（无 `[::]:443`、无 `http2`）
- 无 `upstream keepalive`
- `proxy_pass http://127.0.0.1:3000/api/`

保存后：`nginx -t && nginx -s reload`

---

## 第五步：安全组收紧（推荐）

- **删除 3000 入站**（外网不应直连 Node）
- Node 只监听 `127.0.0.1:3000`（见 app.js 生产环境）

外网只走 443，行为一致。

---

## 第六步：腾讯云控制台

轻量服务器 → 查看是否有：

- DDoS 基础防护 / 流量清洗
- 异常连接限制

若有「新 IP 连接限制」类选项，可暂时放宽或加白名单测试。
