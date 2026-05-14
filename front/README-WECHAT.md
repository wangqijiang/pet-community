# 微信小程序编译指南

## 项目已修复

项目现在可以正确编译为微信小程序了！

## 修复内容

1. **添加了 cross-env** - 用于跨平台设置环境变量
2. **修改了编译脚本** - 添加 `UNI_PLATFORM=mp-weixin` 环境变量
3. **配置文件位置** - `pages.json` 和 `manifest.json` 已复制到项目根目录

## 编译命令

### 开发模式
```bash
npm run dev:mp-weixin
```

### 生产模式
```bash
npm run build:mp-weixin
```

## 在微信开发者工具中打开

1. 打开微信开发者工具
2. 选择"导入项目"
3. 选择项目目录：`E:\my-work\pet-community\front\dist`
4. AppID：可以选择"测试号"或填入你的小程序 AppID

## 输出目录

编译后的文件在 `dist/` 目录下，包含：
- `app.js` - 小程序入口文件
- `app.json` - 小程序配置
- `app.wxss` - 全局样式
- `pages/` - 页面文件
- `components/` - 组件文件
- `project.config.json` - 项目配置

## 注意事项

1. 首次编译可能需要较长时间
2. 开发模式下会有性能警告，这是正常的
3. 如需修改 AppID，请编辑 `manifest.json` 中的 `mp-weixin.appid` 字段
4. 自定义 tabBar 已启用，需要实现 `custom-tab-bar` 组件

## 项目结构

```
front/
├── src/              # 源代码
│   ├── pages/        # 页面
│   ├── components/   # 组件
│   ├── api/          # API 接口
│   ├── config/       # 配置
│   ├── mock/         # Mock 数据
│   └── styles/       # 样式
├── dist/             # 编译输出（微信小程序）
├── pages.json        # 页面配置
├── manifest.json     # 应用配置
└── vite.config.js    # Vite 配置
```
