# WaggleWorld 部署指南

## 快速部署（本地开发）

### 1. 克隆项目
```bash
git clone <repository-url>
cd pet-community
```

### 2. 数据库设置
```bash
# 一键导入（会重建 pet_community 库，含表结构、配置与演示数据）
mysql -u root -p < server/scripts/init.sql

# 或在 server 目录
cd server && npm run db:init
```

### 3. 后端配置
```bash
cd server

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件，填入正确的数据库配置

# 启动服务
npm run dev
```

### 4. 前端访问
- 直接打开 `UI/index.html` 文件
- 或使用 HTTP 服务器：
  ```bash
  npx http-server UI -p 8080
  ```
  然后访问 http://localhost:8080

## 生产环境部署

### 1. 服务器要求
- Node.js v14+
- MySQL 5.7+
- Nginx（可选，用于反向代理）

### 2. 部署步骤

#### 后端部署
```bash
# 进入项目目录
cd server

# 安装依赖（生产环境）
npm install --production

# 使用 PM2 管理进程
npm install -g pm2
pm2 start src/app.js --name "waggleworld-api"

# 设置开机自启
pm2 startup
pm2 save
```

#### Nginx 配置
```nginx
server {
    listen 80;
    server_name your-domain.com;

    # 前端静态文件
    location / {
        root /path/to/UI;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # API 代理
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # 文件上传
    location /uploads {
        alias /path/to/server/uploads;
    }
}
```

### 3. 数据库优化
```sql
-- 添加索引优化查询性能
CREATE INDEX idx_posts_user_created ON posts(user_id, created_at);
CREATE INDEX idx_messages_from_to ON messages(from_id, to_id);
CREATE INDEX idx_notifications_user_read ON notifications(user_id, is_read);
```

### 4. 安全配置
1. 修改 JWT_SECRET 为强密码
2. 配置 HTTPS
3. 设置防火墙规则
4. 定期备份数据库

## Docker 部署（可选）

### docker-compose.yml
```yaml
version: '3.8'

services:
  api:
    build: ./server
    ports:
      - "3000:3000"
    environment:
      - DB_HOST=mysql
      - DB_PORT=3306
      - DB_USER=root
      - DB_PASSWORD=your_password
      - DB_NAME=pet_community
    depends_on:
      - mysql
      - redis

  mysql:
    image: mysql:8.0
    environment:
      - MYSQL_ROOT_PASSWORD=your_password
      - MYSQL_DATABASE=pet_community
    volumes:
      - mysql_data:/var/lib/mysql
      - ./server/scripts/init.sql:/docker-entrypoint-initdb.d/01-init.sql

  redis:
    image: redis:alpine

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./UI:/usr/share/nginx/html
      - ./nginx.conf:/etc/nginx/conf.d/default.conf
    depends_on:
      - api

volumes:
  mysql_data:
```

## 测试账号

| 用户名 | 手机号 | 密码 |
|--------|--------|------|
| 铲屎官小明 | 13800138001 | 123456 |
| 狗狗妈妈 | 13800138002 | 123456 |
| 宠物达人 | 13800138003 | 123456 |
| 猫咪控 | 13800138004 | 123456 |
| 哈士奇主人 | 13800138005 | 123456 |
| 仓鼠达人 | 13800138006 | 123456 |
| 系统管理员（管理后台） | 13800000000 | admin123 |

## 常见问题

### Q: 数据库连接失败
A: 检查 `.env` 文件中的数据库配置，确保 MySQL 服务正在运行

### Q: 文件上传失败
A: 确保 `server/uploads` 目录存在且有写入权限
```bash
mkdir -p server/uploads
chmod 755 server/uploads
```

### Q: 前端无法访问 API
A: 检查 API 地址配置，确保后端服务正在运行

### Q: 如何重置数据库
A: 删除数据库并重新导入
```sql
DROP DATABASE pet_community;
CREATE DATABASE pet_community CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```
然后重新导入 SQL 文件

## 监控和日志

### 查看服务状态
```bash
pm2 status
pm2 logs waggleworld-api
```

### 数据库备份
```bash
mysqldump -u root -p pet_community > backup.sql
```

## 联系方式

如有问题，请提交 Issue 或联系开发者。
