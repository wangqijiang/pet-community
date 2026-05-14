---
skill: uniapp-page
description: 创建 uniapp 页面（支持小程序、H5、App 多端适配）
tags: [uniapp, miniprogram, vue3, page]
---

# Uniapp 页面生成器

创建符合 uniapp 规范的多端页面，自动配置路由和页面配置。

## 使用方式

```
/uniapp-page PageName [path]
```

## 功能

1. 创建 uniapp 页面文件
2. 自动添加到 pages.json
3. 配置页面标题、导航栏样式
4. 使用 uni-app API
5. 支持多端条件编译
6. 集成常用生命周期
7. 响应式布局（rpx 单位）

## 示例

创建宠物详情页：
```
/uniapp-page PetDetail pages/pet/detail
```

生成的页面：
```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { onLoad, onShow, onPullDownRefresh } from '@dcloudio/uni-app'

const petInfo = ref(null)
const loading = ref(false)

// 页面加载
onLoad((options) => {
  const petId = options.id
  loadPetDetail(petId)
})

// 页面显示
onShow(() => {
  console.log('页面显示')
})

// 下拉刷新
onPullDownRefresh(() => {
  loadPetDetail()
  setTimeout(() => {
    uni.stopPullDownRefresh()
  }, 1000)
})

// 加载数据
const loadPetDetail = async (id?: string) => {
  loading.value = true
  try {
    const res = await uni.request({
      url: `/api/pet/${id}`,
      method: 'GET'
    })
    petInfo.value = res.data
  } catch (error) {
    uni.showToast({
      title: '加载失败',
      icon: 'none'
    })
  } finally {
    loading.value = false
  }
}

// 返回上一页
const goBack = () => {
  uni.navigateBack()
}
</script>

<template>
  <view class="pet-detail">
    <view v-if="loading" class="loading">加载中...</view>
    <view v-else-if="petInfo" class="content">
      <image :src="petInfo.avatar" mode="aspectFill" class="avatar" />
      <view class="info">
        <text class="name">{{ petInfo.name }}</text>
        <text class="desc">{{ petInfo.description }}</text>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.pet-detail {
  min-height: 100vh;
  background: #f5f5f5;
  
  .loading {
    padding: 100rpx;
    text-align: center;
  }
  
  .content {
    padding: 32rpx;
    
    .avatar {
      width: 100%;
      height: 400rpx;
      border-radius: 16rpx;
    }
    
    .info {
      margin-top: 32rpx;
      
      .name {
        font-size: 36rpx;
        font-weight: bold;
      }
      
      .desc {
        margin-top: 16rpx;
        font-size: 28rpx;
        color: #666;
      }
    }
  }
}
</style>
```

同时更新 pages.json：
```json
{
  "path": "pages/pet/detail",
  "style": {
    "navigationBarTitleText": "宠物详情",
    "enablePullDownRefresh": true
  }
}
```
