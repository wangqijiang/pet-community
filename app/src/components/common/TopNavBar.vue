<template>
  <view class="navbar">
    <view class="navbar-status" :style="{ height: statusBarHeight + 'px' }"></view>
    <view class="navbar-content">
      <view class="navbar-left" @click="handleBack" v-if="showBack">
        <view class="back-btn">
          <view class="back-icon"></view>
        </view>
      </view>
      <view class="navbar-left" v-else></view>
      <view class="navbar-title">{{ title }}</view>
      <view class="navbar-right">
        <view class="right-icon" @click="handleRightClick" v-if="rightIcon">
          <view :class="['icon-btn', rightIcon]"></view>
        </view>
        <view class="right-btn" @click="handleRightClick" v-if="rightText">
          {{ rightText }}
        </view>
        <slot name="right"></slot>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

defineProps<{
  title: string
  showBack?: boolean
  rightIcon?: string
  rightText?: string
}>()

const emit = defineEmits<{
  rightClick: []
}>()

const statusBarHeight = ref(20)

onMounted(() => {
  const sysInfo = uni.getSystemInfoSync()
  statusBarHeight.value = sysInfo.statusBarHeight || 20
})

const handleBack = () => {
  uni.vibrateShort({ type: 'light' })
  uni.navigateBack({
    fail: () => {
      uni.switchTab({
        url: '/pages/home/index'
      })
    }
  })
}

const handleRightClick = () => {
  uni.vibrateShort({ type: 'light' })
  emit('rightClick')
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: $z-index-nav;
  background: rgba(255, 248, 247, 0.8);
  backdrop-filter: blur(20px);
}

.navbar-content {
  height: $nav-bar-height;
  display: flex;
  align-items: center;
  padding: 0 $spacing-page-horizontal;
  box-shadow: 0 8rpx 32rpx rgba(168, 155, 157, 0.12);
}

.navbar-left {
  width: 80rpx;
  display: flex;
  align-items: center;
}

.back-btn {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform $transition-fast ease;

  &:active {
    transform: scale(0.9);
  }
}

.back-icon {
  width: 40rpx;
  height: 40rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2371585C'%3E%3Cpath d='M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z'/%3E%3C/svg%3E") no-repeat center;
  background-size: 100%;
}

.navbar-title {
  flex: 1;
  text-align: center;
  font-size: $font-size-title;
  font-weight: $font-weight-bold;
  color: $color-primary;
}

.navbar-right {
  width: 80rpx;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.right-icon {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform $transition-fast ease;

  &:active {
    transform: scale(0.9);
  }
}

.icon-btn {
  width: 40rpx;
  height: 40rpx;

  &.icon-bell {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2371585C'%3E%3Cpath d='M18 16v-5c0-3.31-2.69-6-6-6S6 7.69 6 11v5l-2 2v1h16v-1l-2-2zm-6 1c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm5.17-3c-.83-.58-1.94-1-3.17-1s-2.34.42-3.17 1H7v-2c0-2.76 2.24-5 5-5s5 2.24 5 5v2h-2.83z'/%3E%3C/svg%3E") no-repeat center;
    background-size: 100%;
  }

  &.icon-setting {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2371585C'%3E%3Cpath d='M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.39-1.08-.7-1.66-.94l-.38-2.65c-.03-.24-.24-.42-.48-.42h-4c-.24 0-.45.18-.48.42l-.38 2.65c-.58.24-1.14.55-1.66.94l-2.49-1c-.22-.08-.49 0-.61.22l-2 3.46c-.12.22-.07.49.12.64l2.11 1.65c-.04.32-.07.64-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.39 1.08.7 1.66.94l.38 2.65c.03.24.24.42.48.42h4c.24 0 .45-.18.48-.42l.38-2.65c.58-.24 1.14-.55 1.66-.94l2.49 1c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zm-7.43 2.52c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z'/%3E%3C/svg%3E") no-repeat center;
    background-size: 100%;
  }

  &.icon-add {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2371585C'%3E%3Cpath d='M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z'/%3E%3C/svg%3E") no-repeat center;
    background-size: 100%;
  }

  &.icon-search {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2371585C'%3E%3Cpath d='M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.77l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z'/%3E%3C/svg%3E") no-repeat center;
    background-size: 100%;
  }
}

.right-btn {
  font-size: $font-size-body;
  color: $color-primary;
  font-weight: $font-weight-bold;
}
</style>
