<template>
  <view v-if="visible" class="loading-mask">
    <view class="loading-container">
      <view class="loading-animation">
        <image class="loading-dog" src="/static/images/loading-dog.png" mode="aspectFit"></image>
      </view>
      <text class="loading-text">{{ text }}</text>
    </view>
  </view>
</template>

<script setup>
defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  text: {
    type: String,
    default: '加载中...'
  }
})
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.loading-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: $z-index-toast;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-component;
}

.loading-animation {
  width: 120rpx;
  height: 120rpx;
  animation: rotate 1s linear infinite;

  .loading-dog {
    width: 100%;
    height: 100%;
  }
}

.loading-text {
  font-size: $font-size-body;
  color: $color-primary;
  font-weight: $font-weight-medium;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
