# 编译指南

## 编译命令

### 生产模式（推荐用于发布）
```bash
npm run build:mp-weixin
```

**特点：**
- 编译完成后控制台会停留在 Sass 警告处（这是正常的）
- 等待 10-15 秒后，检查 `dist/` 目录是否有文件生成
- 如果文件已生成，按 `Ctrl+C` 退出即可
- 生成的代码经过压缩和优化

### 开发模式（推荐用于开发调试）
```bash
npm run dev:mp-weixin
```

**特点：**
- 启动开发服务器，支持热更新
- 修改代码后自动重新编译
- 不会自动退出，需要手动 `Ctrl+C` 停止

## 如何判断编译是否完成

### 方法 1：检查文件
```bash
ls -la dist/
```
如果看到以下文件，说明编译成功：
- `app.js`
- `app.json`
- `app.wxss`
- `project.config.json`
- `pages/` 目录

### 方法 2：查看文件数量
```bash
find dist -type f | wc -l
```
应该有 90+ 个文件

### 方法 3：查看文件时间戳
```bash
ls -lt dist/ | head
```
查看文件的修改时间，如果是最近的时间，说明刚编译完成

## 常见问题

### Q: 控制台卡在"正在编译中"
**A:** 这是正常现象。等待 10-15 秒后检查 `dist/` 目录，如果文件已生成就说明完成了。

### Q: 看到很多 Sass 警告
**A:** 这些是 Sass 的弃用警告，不影响编译结果，可以忽略。

### Q: 如何在微信开发者工具中打开
**A:** 
1. 打开微信开发者工具
2. 选择"导入项目"
3. 项目目录选择：`E:\my-work\pet-community\front\dist`
4. AppID 可以选择"测试号"

## 编译输出说明

```
dist/
├── app.js              # 小程序入口逻辑
├── app.json            # 小程序配置
├── app.wxss            # 全局样式
├── App.wxml            # 根组件模板
├── project.config.json # 项目配置
├── pages/              # 页面文件
│   ├── home/
│   ├── circle/
│   ├── message/
│   └── profile/
├── components/         # 组件文件
├── api/               # API 接口
├── config/            # 配置文件
└── mock/              # Mock 数据
```

## 清理编译输出

```bash
rm -rf dist
```

## 完整编译流程

```bash
# 1. 清理旧文件
rm -rf dist

# 2. 编译
npm run build:mp-weixin

# 3. 等待 10-15 秒

# 4. 检查是否完成
ls -la dist/

# 5. 如果文件已生成，按 Ctrl+C 退出

# 6. 在微信开发者工具中打开 dist 目录
```
