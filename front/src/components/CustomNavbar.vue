<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  showBack: {
    type: Boolean,
    default: undefined
  }
})

const statusBarHeight = ref(0)
const navbarHeight = ref(88) // 44px = 88rpx

// Tabbar pages that should not show back button
const tabbarPages = [
  '/pages/home/index',
  '/pages/circle/index',
  '/pages/message/index',
  '/pages/profile/index'
]

// Auto-detect if back button should be shown
const shouldShowBack = computed(() => {
  if (props.showBack !== undefined) {
    return props.showBack
  }

  const pages = getCurrentPages()
  if (pages.length <= 1) {
    return false
  }

  const currentPage = pages[pages.length - 1]
  const route = '/' + currentPage.route

  return !tabbarPages.includes(route)
})

onMounted(() => {
  const systemInfo = uni.getSystemInfoSync()
  statusBarHeight.value = systemInfo.statusBarHeight || 20
})

const handleBack = () => {
  if (shouldShowBack.value) {
    uni.navigateBack()
  }
}
</script>

<template>
  <view class="custom-navbar" :style="{ paddingTop: statusBarHeight + 'px' }">
    <view class="navbar-content">
      <!-- Left: Back Button or Custom Slot -->
      <view class="navbar-left">
        <slot name="left">
          <view v-if="shouldShowBack" class="back-btn" @tap="handleBack">
            <text class="icon">🐾</text>
          </view>
          <view v-else class="logo-icon">
            <text class="icon">🐾</text>
          </view>
        </slot>
      </view>

      <!-- Center: Title -->
      <view class="navbar-center">
        <slot name="center">
          <text class="navbar-title font-display-title">{{ title }}</text>
        </slot>
      </view>

      <!-- Right: Custom Slot -->
      <view class="navbar-right">
        <slot name="right"></slot>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.custom-navbar {
  width: 100%;
  background-color: rgba(255, 248, 247, 0.8);
  backdrop-filter: blur(24rpx);
  -webkit-backdrop-filter: blur(24rpx);
  border-bottom: 2rpx solid var(--primary-container);
  box-shadow: 0 8rpx 32rpx rgba(168, 155, 157, 0.12);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

.navbar-content {
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32rpx;
}

.navbar-left,
.navbar-right {
  width: 88rpx;
  height: 88rpx;
  display: flex;
  align-items: center;
}

.navbar-left {
  justify-content: flex-start;
}

.navbar-right {
  justify-content: flex-end;
}

.back-btn,
.logo-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.back-btn:active {
  transform: scale(0.9);
}

.logo-icon:active {
  transform: scale(1.1);
}

.icon {
  font-size: 56rpx;
  color: var(--primary);
}

.navbar-center {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.navbar-title {
  color: var(--primary);
  letter-spacing: -0.01em;
}
</style>
