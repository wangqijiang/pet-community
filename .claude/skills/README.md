# 🎯 Pet Community 项目技能库

适用于 Vue3.2 + 小程序 + uniapp + Node.js + MySQL 全栈开发的技能集合。

## 📦 已安装技能

### 前端开发

1. **vue3-component** - Vue3.2 组件生成器
   - 使用 `<script setup>` 语法
   - TypeScript 支持
   - Composition API
   - 响应式数据管理

2. **uniapp-page** - Uniapp 页面生成器
   - 多端适配（小程序/H5/App）
   - 自动配置路由
   - uni-app API 集成
   - 响应式布局（rpx）

3. **pinia-store** - Pinia 状态管理
   - Composition API 风格
   - TypeScript 类型支持
   - 持久化存储
   - 异步 actions

4. **wechat-miniprogram** - 微信小程序助手
   - 微信登录授权
   - 微信支付
   - 分享功能
   - 订阅消息
   - 图片上传
   - 扫码功能

5. **ui-design** - UI 设计系统
   - 现代化设计风格
   - Tailwind/UnoCSS 配置
   - 响应式布局
   - 深色模式
   - 动画效果

### 后端开发

6. **node-api** - Node.js API 生成器
   - RESTful 路由
   - Express/Koa 支持
   - MySQL 数据库操作
   - JWT 身份验证
   - 参数验证

7. **mysql-schema** - MySQL 数据库设计
   - 表结构 SQL
   - 索引和外键
   - 迁移脚本
   - ORM 模型（Sequelize）

## 🚀 使用方法

在对话中直接使用斜杠命令调用技能：

```bash
# 创建 Vue3 组件
/vue3-component UserCard

# 创建 uniapp 页面
/uniapp-page PetDetail pages/pet/detail

# 创建 Pinia Store
/pinia-store user

# 创建 Node.js API
/node-api pet express

# 创建数据库表
/mysql-schema pets

# 生成 UI 设计
/ui-design card

# 微信小程序功能
/wechat-miniprogram login
```

## 📚 技能详情

### Vue3 组件示例
```vue
<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  title: string
}

const props = defineProps<Props>()
const count = ref(0)
</script>

<template>
  <div>{{ title }}: {{ count }}</div>
</template>
```

### Uniapp 页面示例
```vue
<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'

onLoad((options) => {
  console.log('页面参数:', options)
})
</script>

<template>
  <view class="page">
    <text>Hello Uniapp</text>
  </view>
</template>

<style scoped lang="scss">
.page {
  padding: 32rpx;
}
</style>
```

### Node.js API 示例
```javascript
// routes/pet.js
router.get('/', petController.getList)
router.post('/', authenticate, petController.create)

// controllers/petController.js
async getList(req, res) {
  const result = await petService.getList(req.query)
  return successResponse(res, result)
}
```

### MySQL 表结构示例
```sql
CREATE TABLE `pets` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(50) NOT NULL,
  `type` VARCHAR(20) NOT NULL,
  `age` INT UNSIGNED DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## 🎨 技术栈

- **前端框架**: Vue 3.2 + Composition API
- **跨端框架**: uniapp
- **状态管理**: Pinia
- **UI 框架**: Tailwind CSS / UnoCSS
- **后端框架**: Node.js + Express
- **数据库**: MySQL
- **ORM**: Sequelize
- **认证**: JWT
- **小程序**: 微信小程序

## 💡 最佳实践

1. **组件设计**: 使用 `<script setup>` 和 TypeScript
2. **状态管理**: 优先使用 Pinia 而非 Vuex
3. **API 设计**: RESTful 风格，统一响应格式
4. **数据库**: 规范命名，添加索引，写注释
5. **代码风格**: ESLint + Prettier
6. **Git 提交**: 遵循 Conventional Commits

## 📖 相关文档

- [Vue 3 官方文档](https://cn.vuejs.org/)
- [uniapp 官方文档](https://uniapp.dcloud.net.cn/)
- [Pinia 官方文档](https://pinia.vuejs.org/zh/)
- [Express 官方文档](https://expressjs.com/)
- [MySQL 官方文档](https://dev.mysql.com/doc/)

## 🔧 自定义技能

你可以在 `.claude/skills/` 目录下添加自己的技能文件：

```markdown
---
skill: my-skill
description: 我的自定义技能
tags: [custom]
---

# 技能说明

这里是技能的详细说明...
```

## 📝 更新日志

- 2026-05-13: 初始化技能库，添加 7 个核心技能
