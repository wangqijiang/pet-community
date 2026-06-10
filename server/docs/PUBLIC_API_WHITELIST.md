# 公开 API 白名单（前后端统一）

## 单一数据源

| 文件 | 说明 |
|------|------|
| `shared/public-api-whitelist.json` | **白名单定义**（method + pattern） |
| `shared/publicApiMatcher.js` | 路径匹配逻辑（Node 复用） |
| `app/src/shared/publicApiMatcher.ts` | 同上（小程序，逻辑须保持一致） |

**新增游客可访问接口时：只改 JSON，并确认路由未挂 `auth` 或已用 `optionalAuth`。**

## 两层防护

### 前端（第一层）

`app/src/utils/request.ts`：

- 未登录且 URL **不在白名单** → 本地 `AuthRequiredError`，**不发 HTTP**
- 白名单接口 → 正常请求（可无 Authorization）

### 后端（第二层）

`server/src/middleware/publicApiGuard.js` 挂在 `/api` 下：

- 有效 JWT → 放行
- 无 token 但在白名单 → 放行
- 否则 → `401 请先登录`

各路由仍保留 `auth` / `optionalAuth`，负责登录态解析与业务权限。

## 当前公开能力（摘要）

- 健康检查、登录注册发码
- 动态/地点/指南/宠物 **浏览类** GET
- 用户 **他人主页**（`/user/info/:id`、粉丝/关注列表、搜索）

## 不在白名单（须登录）

- 消息、通知、AI、上传、管理后台
- 我的资料 `/user/info`、宠物 `/pet/list`、地图狗友 `/user/map/markers`
- 所有 POST/PUT/DELETE 写操作（点赞、关注、发布等）

## 本地校验

```bash
node server/scripts/verify-public-api-whitelist.js
```
