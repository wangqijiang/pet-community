<template>
  <view class="loading-mask" v-if="visible">
    <view class="loading-content">
      <view class="loading-dog">
        <view class="dog-body"></view>
        <view class="dog-head">
          <view class="dog-eye dog-eye-left"></view>
          <view class="dog-eye dog-eye-right"></view>
          <view class="dog-nose"></view>
          <view class="dog-mouth"></view>
        </view>
        <view class="dog-tail"></view>
      </view>
      <view class="loading-text">{{ text }}</view>
    </view>
  </view>
</template>

<script setup lang="ts">
defineProps<{
  visible: boolean
  text?: string
}>()
</script>

<style lang="scss" scoped>
.loading-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 249, 249, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.loading-dog {
  position: relative;
  width: 80rpx;
  height: 80rpx;
  animation: spin 1.5s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.dog-body {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40rpx;
  height: 40rpx;
  background: #FFC1E9;
  border-radius: 50%;
}

.dog-head {
  position: absolute;
  top: 10rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 32rpx;
  height: 28rpx;
  background: #FFC1E9;
  border-radius: 50%;
  
  .dog-eye {
    position: absolute;
    width: 6rpx;
    height: 6rpx;
    background: #333;
    border-radius: 50%;
    top: 10rpx;
    
    &.dog-eye-left { left: 6rpx; }
    &.dog-eye-right { right: 6rpx; }
  }
  
  .dog-nose {
    position: absolute;
    top: 18rpx;
    left: 50%;
    transform: translateX(-50%);
    width: 6rpx;
    height: 4rpx;
    background: #333;
    border-radius: 50%;
  }
  
  .dog-mouth {
    position: absolute;
    bottom: 4rpx;
    left: 50%;
    transform: translateX(-50%);
    width: 12rpx;
    height: 6rpx;
    border-bottom: 3rpx solid #333;
    border-radius: 0 0 10rpx 10rpx;
  }
}

.dog-tail {
  position: absolute;
  bottom: 10rpx;
  right: 10rpx;
  width: 16rpx;
  height: 8rpx;
  background: #FFC1E9;
  border-radius: 8rpx;
  transform-origin: left center;
  animation: wag 0.3s ease-in-out infinite;
}

@keyframes wag {
  0%, 100% { transform: rotate(-30deg); }
  50% { transform: rotate(30deg); }
}

.loading-text {
  margin-top: 24rpx;
  font-size: 28rpx;
  color: #FFC1E9;
}
</style>