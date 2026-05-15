# 通知详情页面

## 页面说明
通知详情页面用于展示系统通知的详细内容，包括通知图标、插图、标题、内容和操作按钮。

## 设计规范
本页面严格遵循 WaggleWorld 项目设计规范：

### 颜色
- 背景色：`#FFF9F9`
- 主色调：`#FFC1E9` (粉色)
- 白色：`#FFFFFF`
- 文字主色：`#333333`
- 文字次色：`#666666`
- 文字辅助色：`#999999`

### 尺寸
- 顶部导航栏高度：`96rpx` (48px)
- 圆角：`24rpx` (12px)
- 页面边距：`32rpx` (16px)
- 区块间距：`40rpx` (20px)
- 组件间距：`24rpx` (12px)

### 字体
- 标题：`36rpx` (18px)
- 按钮：`32rpx` (16px)
- 正文：`28rpx` (14px)
- 辅助文字：`24rpx` (12px)

### 交互效果
- 按钮按下缩放：`0.98x`
- 过渡动画：`0.3s ease`
- 震动反馈：轻触 `light`，确认 `medium`

## 文件结构
```
notification-detail/
├── notification-detail.vue   # 页面组件
├── notification-detail.scss  # 样式文件
└── README.md                 # 说明文档
```

## 使用方法

### 1. 页面跳转
```javascript
uni.navigateTo({
  url: '/pages/notification-detail/notification-detail'
})
```

### 2. 传递参数（可选）
```javascript
uni.navigateTo({
  url: '/pages/notification-detail/notification-detail?id=123&type=system'
})
```

在页面中接收参数：
```javascript
onMounted(() => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const options = currentPage.options
  console.log(options.id, options.type)
})
```

## 图片资源
页面使用以下图片资源（位于 `/static/images/`）：
- `back-icon.png` - 返回按钮图标
- `notification-icon.png` - 通知图标
- `notification-illustration.png` - 通知插图
- `arrow-icon.png` - 箭头图标
- `check-icon.png` - 确认图标

## 功能特性

### 1. 顶部导航栏
- 自定义导航栏（`navigationStyle: "custom"`）
- 返回按钮带按下效果和震动反馈
- 标题居中显示，最多8个字符

### 2. 通知内容
- 通知类型标签
- 通知图标（圆角背景）
- 通知插图（响应式宽度）
- 通知标题和内容（白色卡片）

### 3. 操作按钮
- 主按钮：粉色渐变背景，用于主要操作
- 次按钮：白色背景带边框，用于次要操作
- 两个按钮都有按下缩放效果和震动反馈

### 4. 通知时间
- 显示在页面底部
- 灰色辅助文字

## 自定义修改

### 修改通知内容
在 `notification-detail.vue` 的 `<template>` 中修改：
```vue
<text class="card-title">您的标题</text>
<text class="card-content">您的内容</text>
```

### 修改按钮文字
```vue
<text class="button-text">您的按钮文字</text>
```

### 修改按钮跳转
在 `handlePrimaryAction` 或 `handleSecondaryAction` 方法中修改：
```javascript
const handlePrimaryAction = () => {
  uni.navigateTo({
    url: '/pages/your-page/your-page'
  })
}
```

## 注意事项
1. 页面使用 Vue 3.2 Composition API (`<script setup>`)
2. 样式使用 SCSS 预处理器，单位为 rpx
3. 所有交互都包含震动反馈，需要用户授权
4. 图片路径使用绝对路径 `/static/images/`
5. 页面已配置为自定义导航栏模式

## 兼容性
- 微信小程序
- uni-app 框架
- Vue 3.2+

## 开发调试
1. 启动开发服务器：`npm run dev:mp-weixin`
2. 在微信开发者工具中导入 `dist/dev/mp-weixin` 目录
3. 从首页点击"查看通知详情页"按钮进行测试
