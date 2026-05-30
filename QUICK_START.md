# WaggleWorld 快速启动指南

## 一键启动

### 1. 数据库设置

```bash
# 登录 MySQL
mysql -u root -p

# 创建数据库
CREATE DATABASE pet_community CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# 退出
exit

# 导入表结构和测试数据
mysql -u root -p pet_community < server/migrations/001_create_tables.sql
mysql -u root -p pet_community < server/migrations/002_insert_test_data.sql
```

### 2. 配置环境变量

编辑 `server/.env` 文件：

```env
# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=你的数据库密码
DB_NAME=pet_community

# Redis配置（可选）
REDIS_HOST=localhost
REDIS_PORT=6379

# 服务配置
PORT=3000

# JWT配置
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d
```

### 3. 启动后端

```bash
cd server
npm install
npm run dev
```

看到以下输出表示启动成功：
```
╔════════════════════════════════════════════════╗
║     WaggleWorld 宠物社交小程序 - 后端服务      ║
╠════════════════════════════════════════════════╣
║  Server running on: http://localhost:3000     ║
║  API docs:          http://localhost:3000/api ║
╚════════════════════════════════════════════════╝
```

### 4. 打开前端

直接在浏览器中打开 `UI/index.html` 文件即可。

## 测试账号

| 用户名 | 手机号 | 密码 |
|--------|--------|------|
| 铲屎官小明 | 13800138001 | 123456 |
| 狗狗妈妈 | 13800138002 | 123456 |
| 宠物达人 | 13800138003 | 123456 |
| 猫咪控 | 13800138004 | 123456 |
| 哈士奇主人 | 13800138005 | 123456 |
| 仓鼠达人 | 13800138006 | 123456 |

## 功能列表

### 已完成 ✅

**后端 API：**
- [x] 用户注册/登录
- [x] 用户信息管理
- [x] 关注/取消关注
- [x] 动态发布/删除/点赞/评论
- [x] 消息发送/接收
- [x] 地点列表/详情/收藏/评价
- [x] 宠物管理
- [x] 通知系统
- [x] 攻略列表/详情/点赞/收藏
- [x] AI养宠助手

**前端页面：**
- [x] 首页（地点+攻略）
- [x] 萌宠圈（动态列表）
- [x] 消息列表
- [x] 个人中心
- [x] 登录/注册
- [x] 发布动态
- [x] AI对话

### 开发中 🚧

- [ ] 地点详情页
- [ ] 攻略详情页
- [ ] 评论详情页
- [ ] 聊天详情页
- [ ] 个人主页
- [ ] 宠物管理页
- [ ] 通知列表页
- [ ] 搜索功能
- [ ] 图片上传

## API 接口列表

### 认证 `/api/auth`
- `POST /register` - 注册
- `POST /login` - 登录
- `GET /check` - 检查token

### 用户 `/api/user`
- `GET /info` - 获取当前用户信息
- `GET /info/:id` - 获取指定用户信息
- `PUT /info` - 更新用户信息
- `POST /follow` - 关注用户
- `POST /unfollow` - 取消关注
- `GET /followers` - 获取粉丝列表
- `GET /following` - 获取关注列表

### 动态 `/api/post`
- `GET /` - 获取动态列表
- `POST /` - 发布动态
- `GET /:id` - 获取动态详情
- `PUT /:id` - 更新动态
- `DELETE /:id` - 删除动态
- `POST /:id/like` - 点赞动态
- `POST /:id/favorite` - 收藏动态
- `GET /:id/comments` - 获取评论
- `POST /:id/comment` - 发表评论

### 消息 `/api/message`
- `GET /` - 获取会话列表
- `GET /chat/:userId` - 获取聊天记录
- `POST /send` - 发送消息
- `GET /unread/count` - 获取未读数
- `POST /read` - 标记已读

### 地点 `/api/place`
- `GET /` - 获取地点列表
- `GET /:id` - 获取地点详情
- `POST /:id/like` - 收藏地点
- `POST /:id/reviews` - 发表评价
- `GET /:id/reviews` - 获取评价列表

### 宠物 `/api/pet`
- `GET /list` - 获取宠物列表
- `GET /:id` - 获取宠物详情
- `POST /` - 添加宠物
- `PUT /:id` - 更新宠物
- `DELETE /:id` - 删除宠物

### 通知 `/api/notification`
- `GET /` - 获取通知列表
- `GET /unread/count` - 获取未读数
- `POST /read` - 标记已读
- `DELETE /:id` - 删除通知

### 攻略 `/api/guide`
- `GET /` - 获取攻略列表
- `GET /:id` - 获取攻略详情
- `POST /:id/like` - 点赞攻略
- `POST /:id/favorite` - 收藏攻略

### AI助手 `/api/ai`
- `POST /chat` - AI对话
- `GET /history` - 获取对话历史
- `DELETE /history/:id` - 删除对话

## 常见问题

### Q: 数据库连接失败
A: 检查 `server/.env` 中的数据库配置是否正确

### Q: 前端无法访问API
A: 确保后端服务正在运行，并检查API地址配置

### Q: 测试数据导入失败
A: 确保先导入 `001_create_tables.sql`，再导入 `002_insert_test_data.sql`

## 技术支持

如有问题，请查看完整文档：
- `README.md` - 项目说明
- `DEPLOYMENT.md` - 部署指南
- `PROJECT_SUMMARY.md` - 项目总结
