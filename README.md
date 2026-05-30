# WaggleWorld 宠物社交小程序

一个基于 Node.js + Express + MySQL 的宠物社交平台，提供同城宠物社交、动态分享、AI养宠助手等功能。

## 功能特性

- 🐾 **同城宠物社交**: 发现附近的宠物友好地点
- 📝 **动态分享**: 分享宠物日常，与其他宠物主互动
- 💬 **私信系统**: 与其他宠物主一对一交流
- 🤖 **AI养宠助手**: 获取专业的养宠建议
- 📚 **宠物攻略**: 丰富的养宠知识库

## 技术栈

### 后端
- Node.js + Express
- MySQL 数据库
- Redis 缓存
- JWT 认证
- Swagger API 文档

### 前端
- HTML5 + Tailwind CSS
- Material Icons
- 响应式设计

## 快速开始

### 1. 环境准备

确保已安装以下软件：
- Node.js (v14+)
- MySQL (v5.7+)
- Redis (可选)

### 2. 数据库配置

1. 创建数据库：
```sql
CREATE DATABASE pet_community CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. 导入数据库结构：
```bash
mysql -u root -p pet_community < server/migrations/001_create_tables.sql
```

### 3. 后端配置

1. 进入 server 目录：
```bash
cd server
```

2. 安装依赖：
```bash
npm install
```

3. 配置环境变量，编辑 `.env` 文件：
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=pet_community

REDIS_HOST=localhost
REDIS_PORT=6379

PORT=3000
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
```

### 4. 启动服务

1. 启动后端服务：
```bash
cd server
npm run dev
```

2. 访问前端页面：
   - 直接在浏览器中打开 `UI/index.html`
   - 或使用 HTTP 服务器：`npx http-server UI -p 8080`

3. 访问 API 文档：
   - http://localhost:3000/api-docs

## 测试账号

数据库初始化后会创建以下测试账号：

| 用户名 | 手机号 | 密码 |
|--------|--------|------|
| 铲屎官小明 | 13800138001 | 123456 |
| 狗狗妈妈 | 13800138002 | 123456 |
| 宠物达人 | 13800138003 | 123456 |

## API 接口

### 认证相关
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录

### 用户相关
- `GET /api/user/info` - 获取用户信息
- `PUT /api/user/info` - 更新用户信息
- `GET /api/user/followers` - 获取粉丝列表
- `POST /api/user/follow` - 关注用户

### 动态相关
- `GET /api/post` - 获取动态列表
- `POST /api/post` - 发布动态
- `POST /api/post/:id/like` - 点赞动态
- `GET /api/post/:id/comments` - 获取评论

### 消息相关
- `GET /api/message` - 获取会话列表
- `GET /api/message/chat/:userId` - 获取聊天记录
- `POST /api/message/send` - 发送消息

### 地点相关
- `GET /api/place` - 获取地点列表
- `GET /api/place/:id` - 获取地点详情
- `POST /api/place/:id/like` - 点赞地点

### 宠物相关
- `GET /api/pet/list` - 获取宠物列表
- `POST /api/pet` - 添加宠物
- `PUT /api/pet/:id` - 更新宠物信息

### AI助手
- `POST /api/ai/chat` - AI对话
- `GET /api/ai/history` - 获取对话历史

### 攻略相关
- `GET /api/guide` - 获取攻略列表
- `GET /api/guide/:id` - 获取攻略详情

## 项目结构

```
pet-community/
├── UI/                    # 前端页面
│   ├── index.html        # 主入口页面
│   ├── home/             # 首页相关页面
│   ├── message/          # 消息页面
│   ├── profile/          # 个人中心页面
│   └── components/       # 公共组件
├── server/               # 后端服务
│   ├── src/
│   │   ├── app.js       # 主应用文件
│   │   ├── routes/      # 路由文件
│   │   ├── middleware/   # 中间件
│   │   ├── config/      # 配置文件
│   │   └── utils/       # 工具函数
│   ├── migrations/      # 数据库迁移
│   └── package.json
└── README.md
```

## 开发说明

### 添加新功能

1. 后端路由添加到 `server/src/routes/` 目录
2. 在 `server/src/app.js` 中注册路由
3. 前端页面添加到 `UI/` 目录
4. 在 `UI/index.html` 中集成新功能

### 数据库修改

1. 在 `server/migrations/` 目录创建新的迁移文件
2. 执行迁移脚本更新数据库结构

## 常见问题

### 1. 数据库连接失败
- 检查 MySQL 服务是否启动
- 确认 `.env` 文件中的数据库配置正确

### 2. 跨域问题
- 后端已配置 CORS 中间件
- 确保前端请求的 API 地址正确

### 3. 文件上传失败
- 检查 `server/uploads/` 目录权限
- 确认文件大小未超过限制 (10MB)

## License

MIT
