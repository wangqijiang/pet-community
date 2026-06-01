# 萌宠朋友圈 - 管理后台

基于 **Vite + Vue 3.5 + Element Plus** 的运营后台，对接 `server` 的 `/api/admin` 接口。

## 功能模块

| 模块 | 说明 |
|------|------|
| 仪表盘 | 用户/动态/宠物/场所等统计 |
| 用户管理 | 禁用/启用、重置密码 |
| 动态管理 | 列表、置顶、删除 |
| 评论管理 | 审核删除 |
| 宠物管理 | 状态（正常/领养/丢失/删除） |
| 场所管理 | 增删改查、图片、坐标 |
| 场所评价 | 删除违规评价 |
| 动态分类 / 场所分类 | key、名称、排序、启用 |
| 攻略管理 | CMS 增删改 |
| 系统通知 | 全员广播 |
| AI 对话 | 记录查看与删除 |

## 启动

### 1. 后端（需先跑迁移与管理员种子）

```bash
cd server
# 若尚未执行 008 迁移
mysql -u root -p pet_community < migrations/008_admin_role.sql
node scripts/seed-admin.js
npm run dev
```

### 2. 管理前端

```bash
cd admin
npm install
npm run dev
```

浏览器打开 http://localhost:5174

### 默认管理员

在 `server/.env` 中配置：

```
ADMIN_PHONE=13800000000
ADMIN_PASSWORD=admin123
```

也可用测试账号（迁移 008 会将 `13800138001` 设为 admin，密码为库内原密码如 `123456`）。

## 构建

```bash
npm run build
```

产物在 `admin/dist`，可挂到 Nginx 静态目录，并反向代理 `/api` 到 Node 服务。
