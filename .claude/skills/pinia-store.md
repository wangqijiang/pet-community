---
skill: pinia-store
description: 创建 Pinia 状态管理 Store（Vue3 官方推荐）
tags: [pinia, vuex, state-management, vue3]
---

# Pinia Store 生成器

创建符合 Pinia 最佳实践的状态管理模块，支持 TypeScript 和组合式 API。

## 使用方式

```
/pinia-store StoreName
```

## 功能

1. 使用 Composition API 风格
2. TypeScript 类型支持
3. 持久化存储（可选）
4. 异步 actions
5. Getters 计算属性
6. 模块化设计

## 示例

创建用户状态管理：
```
/pinia-store user
```

生成的 Store：

**stores/user.ts**
```typescript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface UserInfo {
  id: string
  username: string
  avatar: string
  email: string
  phone?: string
}

interface LoginParams {
  username: string
  password: string
}

export const useUserStore = defineStore('user', () => {
  // State
  const token = ref<string>('')
  const userInfo = ref<UserInfo | null>(null)
  const isLoggedIn = ref<boolean>(false)

  // Getters
  const userId = computed(() => userInfo.value?.id || '')
  const userName = computed(() => userInfo.value?.username || '游客')
  const userAvatar = computed(() => userInfo.value?.avatar || '/default-avatar.png')

  // Actions
  const login = async (params: LoginParams) => {
    try {
      const res = await uni.request({
        url: '/api/auth/login',
        method: 'POST',
        data: params
      })
      
      if (res.data.code === 0) {
        token.value = res.data.data.token
        userInfo.value = res.data.data.userInfo
        isLoggedIn.value = true
        
        // 保存 token 到本地
        uni.setStorageSync('token', token.value)
        uni.setStorageSync('userInfo', userInfo.value)
        
        return true
      } else {
        throw new Error(res.data.message)
      }
    } catch (error) {
      console.error('登录失败:', error)
      throw error
    }
  }

  const logout = () => {
    token.value = ''
    userInfo.value = null
    isLoggedIn.value = false
    
    // 清除本地存储
    uni.removeStorageSync('token')
    uni.removeStorageSync('userInfo')
    
    // 跳转到登录页
    uni.reLaunch({
      url: '/pages/login/index'
    })
  }

  const updateUserInfo = async (data: Partial<UserInfo>) => {
    try {
      const res = await uni.request({
        url: '/api/user/update',
        method: 'PUT',
        data
      })
      
      if (res.data.code === 0) {
        userInfo.value = { ...userInfo.value, ...data } as UserInfo
        uni.setStorageSync('userInfo', userInfo.value)
        return true
      }
      return false
    } catch (error) {
      console.error('更新用户信息失败:', error)
      return false
    }
  }

  const checkLoginStatus = () => {
    const savedToken = uni.getStorageSync('token')
    const savedUserInfo = uni.getStorageSync('userInfo')
    
    if (savedToken && savedUserInfo) {
      token.value = savedToken
      userInfo.value = savedUserInfo
      isLoggedIn.value = true
    }
  }

  // 初始化时检查登录状态
  checkLoginStatus()

  return {
    // State
    token,
    userInfo,
    isLoggedIn,
    // Getters
    userId,
    userName,
    userAvatar,
    // Actions
    login,
    logout,
    updateUserInfo,
    checkLoginStatus
  }
}, {
  // 持久化配置（可选）
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'user-store',
        storage: localStorage,
        paths: ['token', 'userInfo', 'isLoggedIn']
      }
    ]
  }
})
```

## 在组件中使用

```vue
<script setup lang="ts">
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

// 访问 state
console.log(userStore.token)
console.log(userStore.userInfo)

// 访问 getters
console.log(userStore.userName)

// 调用 actions
const handleLogin = async () => {
  try {
    await userStore.login({
      username: 'test',
      password: '123456'
    })
    uni.showToast({ title: '登录成功' })
  } catch (error) {
    uni.showToast({ title: '登录失败', icon: 'none' })
  }
}

const handleLogout = () => {
  userStore.logout()
}
</script>

<template>
  <view class="user-info">
    <image :src="userStore.userAvatar" />
    <text>{{ userStore.userName }}</text>
    <button @click="handleLogout">退出登录</button>
  </view>
</template>
```

## 其他常用 Store 示例

### 购物车 Store
```typescript
export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])
  
  const totalCount = computed(() => 
    items.value.reduce((sum, item) => sum + item.quantity, 0)
  )
  
  const totalPrice = computed(() =>
    items.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
  )
  
  const addToCart = (product: Product) => {
    const existItem = items.value.find(item => item.id === product.id)
    if (existItem) {
      existItem.quantity++
    } else {
      items.value.push({ ...product, quantity: 1 })
    }
  }
  
  return { items, totalCount, totalPrice, addToCart }
})
```
