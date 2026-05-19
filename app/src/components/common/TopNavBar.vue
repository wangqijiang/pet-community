<template>
  <view class="navbar">
    <view class="navbar-status" :style="{ height: statusBarHeight + 'px' }"></view>
    <view class="navbar-content">
      <view class="navbar-left" @click="handleBack" v-if="showBack">
        <view class="back-icon">
          <view class="paw-print">
            <view class="paw-pad"></view>
            <view class="paw-pad"></view>
            <view class="paw-pad"></view>
            <view class="paw-pad"></view>
            <view class="paw-center"></view>
          </view>
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
  uni.navigateBack({
    fail: () => {
      uni.switchTab({
        url: '/pages/home/index'
      })
    }
  })
}

const handleRightClick = () => {
  emit('rightClick')
}
</script>

<style lang="scss" scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: #FFFFFF;
}

.navbar-content {
  height: 96rpx;
  display: flex;
  align-items: center;
  padding: 0 32rpx;
  border-bottom: 2rpx solid #FFC1E9;
}

.navbar-left {
  width: 80rpx;
  display: flex;
  align-items: center;
}

.back-icon {
  width: 48rpx;
  height: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.paw-print {
  position: relative;
  width: 36rpx;
  height: 36rpx;
  
  .paw-pad {
    position: absolute;
    width: 12rpx;
    height: 12rpx;
    background: #FFC1E9;
    border-radius: 50%;
    
    &:nth-child(1) { top: 0; left: 6rpx; }
    &:nth-child(2) { top: 0; right: 6rpx; }
    &:nth-child(3) { bottom: 6rpx; left: 0; }
    &:nth-child(4) { bottom: 6rpx; right: 0; }
  }
  
  .paw-center {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 16rpx;
    height: 16rpx;
    background: #FFC1E9;
    border-radius: 50%;
  }
}

.navbar-title {
  flex: 1;
  text-align: center;
  font-size: 36rpx;
  font-weight: 600;
  color: #FFC1E9;
}

.navbar-right {
  width: 80rpx;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.right-icon {
  width: 48rpx;
  height: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-btn {
  width: 40rpx;
  height: 40rpx;
  
  &.icon-bell {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23FFC1E9'%3E%3Cpath d='M18 16v-5c0-3.31-2.69-6-6-6S6 7.69 6 11v5l-2 2v1h16v-1l-2-2zm-6 1c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm5.17-3c-.83-.58-1.94-1-3.17-1s-2.34.42-3.17 1H7v-2c0-2.76 2.24-5 5-5s5 2.24 5 5v2h-2.83z'/%3E%3C/svg%3E") no-repeat center;
    background-size: 100%;
  }
  
  &.icon-setting {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23FFC1E9'%3E%3Cpath d='M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.39-1.08-.7-1.66-.94l-.38-2.65c-.03-.24-.24-.42-.48-.42h-4c-.24 0-.45.18-.48.42l-.38 2.65c-.58.24-1.14.55-1.66.94l-2.49-1c-.22-.08-.49 0-.61.22l-2 3.46c-.12.22-.07.49.12.64l2.11 1.65c-.04.32-.07.64-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.39 1.08.7 1.66.94l.38 2.65c.03.24.24.42.48.42h4c.24 0 .45-.18.48-.42l.38-2.65c.58-.24 1.14-.55 1.66-.94l2.49 1c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zm-7.43 2.52c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z'/%3E%3C/svg%3E") no-repeat center;
    background-size: 100%;
  }
  
  &.icon-add {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23FFC1E9'%3E%3Cpath d='M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z'/%3E%3C/svg%3E") no-repeat center;
    background-size: 100%;
  }
  
  &.icon-search {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23FFC1E9'%3E%3Cpath d='M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.77l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z'/%3E%3C/svg%3E") no-repeat center;
    background-size: 100%;
  }
}

.right-btn {
  font-size: 28rpx;
  color: #FFC1E9;
  font-weight: 600;
}
</style>