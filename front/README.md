# 萌宠治愈家 WaggleWorld

宠物社交小程序 - 基于 uniapp + Vue 3.2 开发

## 项目特点

- ✅ Vue 3.2+ Composition API (script setup)
- ✅ SCSS 样式语言
- ✅ Mock API 与真实后端一键切换
- ✅ 完整的宠物社交功能
- ✅ 精美的 UI 设计（柔和可爱风格）

## 技术栈

- **框架**: uniapp + Vue 3.2
- **样式**: SCSS
- **API**: Mock 数据 / 真实后端可切换
- **平台**: 微信小程序

## 项目结构

```
front/
├── api/                    # API 接口
│   └── index.js           # API 服务封装
├── components/            # 全局组件
│   ├── CustomButton.vue   # 按钮组件
│   ├── CustomCard.vue     # 卡片组件
│   ├── CustomInput.vue    # 输入框组件
│   ├── CustomModal.vue    # 模态框组件
│   ├── CustomNavbar.vue   # 导航栏组件
│   ├── CustomTabbar.vue   # 底部导航组件
│   └── EmptyState.vue     # 空状态组件
├── config/                # 配置文件
│   └── api.config.js      # API 配置（Mock/Real 切换）
├── mock/                  # Mock 数据
│   ├── user.js           # 用户数据
│   ├── home.js           # 首页数据
│   ├── circle.js         # 圈子数据
│   └── message.js        # 消息数据
├── pages/                # 页面
│   ├── home/             # 首页模块
│   │   ├── index.vue     # 地图首页
│   │   └── store-detail.vue  # 场所详情
│   ├── circle/           # 圈子模块
│   │   ├── index.vue     # 动态列表
│   │   ├── publish.vue   # 发布动态
│   │   └── post-detail.vue   # 动态详情
│   ├── message/          # 消息模块
│   │   ├── index.vue     # 消息列表
│   │   └── chat.vue      # 聊天页面
│   └── profile/          # 个人中心模块
│       └── index.vue     # 个人主页
├── styles/               # 全局样式
│   └── theme.css         # 主题变量
├── App.vue               # 应用入口
├── main.js               # 主入口文件
├── manifest.json         # 应用配置
├── pages.json            # 页面配置
└── package.json          # 依赖配置
```

## 功能模块

### 1. 首页 (Home)
- 地图展示附近宠物好友
- 附近场所列表
- 场所详情（评价、设施、导航）

### 2. 圈子 (Circle)
- 动态列表（图片/视频）
- 发布动态
- 点赞、评论、收藏
- 动态详情

### 3. 消息 (Message)
- 聊天列表
- 系统通知
- 私聊功能

### 4. 个人中心 (Profile)
- 个人信息展示
- 宠物信息
- 关注/粉丝
- 我的动态/收藏
- **API 模式切换**（Mock/真实后端）

## 快速开始

### 1. 安装依赖

```bash
cd front
npm install
```

### 2. 运行项目

```bash
# 开发模式
npm run dev:mp-weixin

# 构建生产版本
npm run build:mp-weixin
```

### 3. 导入微信开发者工具

1. 打开微信开发者工具
2. 导入项目，选择 `front/dist/dev/mp-weixin` 目录
3. 填写 AppID（测试号或正式 AppID）
4. 开始调试

## API 模式切换

项目支持 Mock 数据和真实后端一键切换：

### 方式一：在小程序内切换（推荐）

1. 进入「我的」页面
2. 点击「API模式切换」
3. 选择「Mock模式」或「真实后端」
4. 重启小程序生效

### 方式二：修改配置文件

编辑 `config/api.config.js`：

```javascript
// Mock 模式
const API_MODE = 'mock'

// 真实后端模式
const API_MODE = 'real'
```

修改后重新编译即可。

## Mock 数据说明

所有 Mock 数据位于 `mock/` 目录：

- `user.js` - 用户信息、关注列表、粉丝列表
- `home.js` - 附近用户、附近场所、场所详情
- `circle.js` - 动态列表、动态详情、评论
- `message.js` - 消息列表、聊天记录、系统通知

Mock 数据会模拟 300ms 网络延迟，提供真实的加载体验。

## 真实后端对接

当切换到真实后端模式时，需要：

1. 在 `config/api.config.js` 中配置后端地址：

```javascript
const BASE_URL = {
  mock: '',
  real: 'https://api.waggleworld.com'  // 修改为你的后端地址
}
```

2. 确保后端 API 接口格式与 Mock 数据一致

3. 后端需要返回统一格式：

```javascript
{
  code: 200,
  message: 'success',
  data: { ... }
}
```

## 设计系统

### 颜色主题

- Primary: `#71585c` (主色调)
- Secondary: `#655e43` (次要色)
- Background: `#fff8f7` (背景色)
- Surface: `#fff8f7` (表面色)

### 圆角规范

- Small: `0.25rem`
- Medium: `0.5rem`
- Large: `0.75rem`
- XL: `1rem`
- Full: `9999px`

### 间距规范

- Unit: `4px`
- Padding Container: `16px`
- Gutter Card: `12px`
- Stack Gap: `8px`
- Margin Page: `20px`

## 注意事项

1. **Vue 3.2+**: 所有组件使用 Composition API (`<script setup>`)
2. **SCSS**: 所有样式使用 SCSS 语法
3. **微信小程序限制**: 
   - 不支持某些 CSS 特性
   - 图片需要使用网络地址或本地路径
   - 地图功能需要配置 AppID 和权限

## 开发建议

1. 先使用 Mock 模式开发和调试
2. UI 完成后再对接真实后端
3. 使用微信开发者工具的调试功能
4. 注意小程序包大小限制（主包 2MB）

## 待完善功能

- [ ] 个人中心其他子页面（编辑资料、关注列表等）
- [ ] 更多交互动画效果
- [ ] 图片上传到服务器
- [ ] 实时消息推送
- [ ] 更多场所类型筛选

## License

MIT

## 联系方式

如有问题，请提交 Issue 或联系开发团队。
