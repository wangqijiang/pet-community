<template>
  <view class="tabbar">
    <view class="tabbar-safe"></view>
    <view class="tabbar-content">
      <view 
        v-for="(item, index) in tabs" 
        :key="index"
        class="tab-item"
        :class="{ active: currentIndex === index }"
        @click="handleTabClick(index)"
      >
        <view class="tab-icon">
          <view :class="['icon', item.icon]"></view>
          <view class="badge" v-if="item.badge > 0">{{ item.badge }}</view>
        </view>
        <view class="tab-text">{{ item.text }}</view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'

const props = defineProps<{
  current: number
}>()

const currentIndex = ref(0)

const tabs = [
  {
    text: '首页',
    icon: 'icon-home',
    badge: 0,
    url: '/pages/home/index'
  },
  {
    text: '萌宠圈',
    icon: 'icon-circle',
    badge: 0,
    url: '/pages/circle/index'
  },
  {
    text: '消息',
    icon: 'icon-message',
    badge: 2,
    url: '/pages/message/index'
  },
  {
    text: '我的',
    icon: 'icon-mine',
    badge: 0,
    url: '/pages/mine/index'
  }
]

watch(() => props.current, (val) => {
  currentIndex.value = val
})

onMounted(() => {
  currentIndex.value = props.current
})

const handleTabClick = (index: number) => {
  if (currentIndex.value === index) return
  currentIndex.value = index
  uni.reLaunch({
    url: tabs[index].url
  })
}
</script>

<style lang="scss" scoped>
.tabbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 999;
  background: #FFFFFF;
}

.tabbar-safe {
  height: constant(safe-area-inset-bottom);
  height: env(safe-area-inset-bottom);
  background: #FFFFFF;
}

.tabbar-content {
  display: flex;
  height: 112rpx;
  border-top: 2rpx solid #FFC1E9;
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  
  &.active {
    .tab-icon {
      transform: scale(1.1);
      
      .icon {
        filter: brightness(1);
      }
    }
    
    .tab-text {
      color: #FFC1E9;
      font-weight: 600;
    }
  }
}

.tab-icon {
  position: relative;
  width: 56rpx;
  height: 56rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8rpx;
  transition: transform 0.3s ease;
}

.icon {
  width: 44rpx;
  height: 44rpx;
  filter: brightness(0.6);
  transition: filter 0.3s ease;
  
  &.icon-home {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23FFC1E9'%3E%3Cpath d='M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z'/%3E%3C/svg%3E") no-repeat center;
    background-size: 100%;
  }
  
  &.icon-circle {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23FFC1E9'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z'/%3E%3C/svg%3E") no-repeat center;
    background-size: 100%;
  }
  
  &.icon-message {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23FFC1E9'%3E%3Cpath d='M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z'/%3E%3C/svg%3E") no-repeat center;
    background-size: 100%;
  }
  
  &.icon-mine {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23FFC1E9'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E") no-repeat center;
    background-size: 100%;
  }
}

.badge {
  position: absolute;
  top: -8rpx;
  right: -8rpx;
  min-width: 32rpx;
  height: 32rpx;
  padding: 0 8rpx;
  background: #FF6B6B;
  border-radius: 16rpx;
  font-size: 20rpx;
  color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tab-text {
  font-size: 24rpx;
  color: #E5E5E5;
  transition: all 0.3s ease;
}
</style>