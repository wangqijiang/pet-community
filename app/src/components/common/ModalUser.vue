<template>
  <view class="modal-overlay" v-if="visible" @click="handleClose">
    <view class="modal-content user-modal" @click.stop>
      <view class="avatar-container">
        <view class="avatar-wrapper">
          <view class="avatar-inner" :style="{ background: data.color }"></view>
        </view>
        <view class="avatar-badge">
          <view class="badge-icon"></view>
        </view>
      </view>
      
      <view class="content-section">
        <text class="user-name">{{ data.name }}</text>
        <view class="tags">
          <text class="tag">小型 · 温顺</text>
          <text class="tag">已接种疫苗</text>
        </view>
        <view class="location">
          <view class="location-icon"></view>
          <text class="location-text">西湖区 · 文三路片区</text>
        </view>
      </view>
      
      <view class="actions">
        <view class="btn btn-secondary" @click="handleViewProfile">查看主页</view>
        <view class="btn btn-primary" @click="handleSendMessage">发私信</view>
      </view>
      
      <view class="decoration"></view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

const props = defineProps<{
  visible: boolean
  data: {
    name: string
    color: string
  }
}>()

const emit = defineEmits(['close', 'viewProfile', 'sendMessage'])

const handleClose = () => {
  emit('close')
}

const handleViewProfile = () => {
  emit('viewProfile')
  emit('close')
}

const handleSendMessage = () => {
  emit('sendMessage')
  emit('close')
}
</script>

<style lang="scss" scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32rpx;
}

.modal-content {
  width: 100%;
  max-width: 640rpx;
  background: #FFFCFB;
  border-radius: 32rpx;
  border: 2rpx solid rgba(252, 218, 223, 0.3);
  box-shadow: 0 16rpx 48rpx rgba(168, 155, 157, 0.15);
  padding: 48rpx 32rpx;
  position: relative;
  animation: bounce 0.5s ease-out;
}

@keyframes bounce {
  0% { transform: scale(0.8); opacity: 0; }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); opacity: 1; }
}

.avatar-container {
  position: relative;
  display: flex;
  justify-content: center;
  margin-bottom: 32rpx;
}

.avatar-wrapper {
  width: 192rpx;
  height: 192rpx;
  border-radius: 50%;
  border: 8rpx solid rgba(252, 218, 223, 0.5);
  overflow: hidden;
  background: #F9F2F2;
  padding: 4rpx;
}

.avatar-inner {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.avatar-badge {
  position: absolute;
  bottom: 0;
  right: 50%;
  transform: translateX(60rpx);
  width: 56rpx;
  height: 56rpx;
  background: #FFC1E9;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

.badge-icon {
  width: 32rpx;
  height: 32rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23FFFFFF'%3E%3Cpath d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'/%3E%3C/svg%3E") no-repeat center;
  background-size: 100%;
}

.content-section {
  text-align: center;
  margin-bottom: 40rpx;
}

.user-name {
  font-size: 36rpx;
  font-weight: 700;
  color: #71585C;
  display: block;
  margin-bottom: 16rpx;
}

.tags {
  display: flex;
  justify-content: center;
  gap: 16rpx;
  margin-bottom: 16rpx;
}

.tag {
  padding: 8rpx 24rpx;
  background: rgba(237, 226, 192, 0.4);
  color: #7A8BA8;
  font-size: 22rpx;
  font-weight: 600;
  border-radius: 24rpx;
}

.location {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
}

.location-icon {
  width: 28rpx;
  height: 28rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23807476'%3E%3Cpath d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'/%3E%3C/svg%3E") no-repeat center;
  background-size: 100%;
}

.location-text {
  font-size: 26rpx;
  color: #807476;
}

.actions {
  display: flex;
  gap: 24rpx;
}

.btn {
  flex: 1;
  padding: 24rpx;
  border-radius: 32rpx;
  text-align: center;
  font-size: 28rpx;
  font-weight: 600;
  transition: all 0.2s;
  
  &:active {
    transform: scale(1);
  }
  
  &.btn-secondary {
    background: rgba(237, 226, 192, 0.6);
    color: #655E43;
  }
  
  &.btn-primary {
    background: rgba(252, 218, 223, 0.8);
    color: #71585C;
  }
}

.decoration {
  position: absolute;
  top: 24rpx;
  right: 24rpx;
  width: 48rpx;
  height: 48rpx;
  opacity: 0.1;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2371585C'%3E%3Cpath d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/%3E%3C/svg%3E") no-repeat center;
  background-size: 100%;
}
</style>
