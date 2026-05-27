<template>
  <view class="toast" :class="{ show: visible }">
    <view class="toast-icon" :class="iconClass"></view>
    <view class="toast-text">{{ text }}</view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  visible: boolean
  text: string
  type?: 'success' | 'error' | 'warning' | 'info'
}>()

const iconClass = computed(() => {
  return `icon-${props.type || 'success'}`
})
</script>

<style lang="scss" scoped>
.toast {
  position: fixed;
  left: 50%;
  bottom: 240rpx;
  transform: translateX(-50%) scale(0.92);
  opacity: 0;
  min-width: 440rpx;
  background: rgba(50, 40, 40, 0.92);
  color: #ffffff;
  padding: 36rpx 44rpx;
  border-radius: 44rpx;
  display: flex;
  align-items: center;
  gap: 24rpx;
  backdrop-filter: blur(10px);
  z-index: 200;
  transition: all 0.2s ease;

  &.show {
    transform: translateX(-50%) scale(1);
    opacity: 1;
  }
}

.toast-icon {
  width: 40rpx;
  height: 40rpx;

  &.icon-success {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%238ED39B'%3E%3Cpath d='M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z'/%3E%3C/svg%3E")
      no-repeat center;
    background-size: 100%;
  }

  &.icon-error {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23E26D6D'%3E%3Cpath d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'/%3E%3C/svg%3E")
      no-repeat center;
    background-size: 100%;
  }

  &.icon-warning {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23F4A259'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z'/%3E%3C/svg%3E")
      no-repeat center;
    background-size: 100%;
  }

  &.icon-info {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%238ED39B'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z'/%3E%3C/svg%3E")
      no-repeat center;
    background-size: 100%;
  }
}

.toast-text {
  font-size: 28rpx;
  font-weight: 600;
}
</style>
