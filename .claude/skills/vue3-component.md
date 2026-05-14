---
skill: vue3-component
description: 创建 Vue3.2 组合式 API 组件（支持 script setup、TypeScript、响应式）
tags: [vue3, component, composition-api, typescript]
---

# Vue3 组件生成器

创建符合 Vue3.2+ 最佳实践的组件，使用 Composition API 和 script setup 语法。

## 使用方式

```
/vue3-component ComponentName [options]
```

## 功能

1. 使用 `<script setup>` 语法
2. 支持 TypeScript 类型定义
3. 使用 Composition API (ref, reactive, computed, watch)
4. 自动导入常用 API
5. 包含 props、emits 类型定义
6. 响应式数据管理
7. 生命周期钩子

## 示例

创建一个用户卡片组件：
```
/vue3-component UserCard
```

生成的组件结构：
```vue
<template>
  <div class="user-card" @click="handleClick">
    <div v-if="loading">加载中...</div>
    <div v-else>
      <img v-if="showAvatar" :src="userData?.avatar" />
      <span>{{ displayName }}</span>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface Props {
  userId?: string
  showAvatar?: boolean
}

interface Emits {
  (e: 'click', id: string): void
  (e: 'update', data: any): void
}

const props = withDefaults(defineProps<Props>(), {
  showAvatar: true
})

const emit = defineEmits<Emits>()

// 响应式数据
const loading = ref(false)
const userData = ref(null)

// 计算属性
const displayName = computed(() => {
  return userData.value?.name || '未知用户'
})

// 方法
const handleClick = () => {
  emit('click', props.userId)
}

// 生命周期
onMounted(() => {
  // 初始化逻辑
})
</script>



<style scoped lang="scss">
.user-card {
  padding: 16px;
  border-radius: 8px;
  background: #fff;
}
</style>
```
