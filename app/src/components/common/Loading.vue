<template>
  <view class="loading-mask" v-if="visible">
    <view class="loading-box">
      <view class="loader"></view>
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
  background: rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.loading-box {
  width: 360rpx;
  background: #ffffff;
  border-radius: 60rpx;
  padding: 64rpx 48rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 40rpx 100rpx rgba(0, 0, 0, 0.12);
}

.loader {
  width: 108rpx;
  height: 108rpx;
  border-radius: 999rpx;
  border: 10rpx solid #F5E7DF;
  border-top-color: #8B6D73;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  margin-top: 40rpx;
  font-size: 30rpx;
  font-weight: 700;
  color: #6B5B5B;
}
</style>
