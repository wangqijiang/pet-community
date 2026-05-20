<template>
  <view class="dialog-mask" v-if="visible" @click="handleMaskClick">
    <view class="dialog-content" @click.stop>
      <view class="dialog-icon" v-if="type !== 'loading'">
        <view :class="['icon', `icon-${type}`]"></view>
      </view>
      <view class="dialog-title" v-if="title">{{ title }}</view>
      <view class="dialog-desc">{{ content }}</view>
      <view class="dialog-loading" v-if="type === 'loading'">
        <view class="loading-spinner"></view>
      </view>
      <view class="dialog-btn-area">
        <view 
          class="dialog-btn dialog-btn-cancel" 
          v-if="type === 'confirm'" 
          @click="handleCancel"
        >
          取消
        </view>
        <view 
          class="dialog-btn dialog-btn-confirm" 
          @click="handleConfirm"
        >
          {{ type === 'confirm' ? '确定' : '知道了' }}
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
defineProps<{
  visible: boolean
  type?: 'alert' | 'confirm' | 'success' | 'error' | 'loading'
  title?: string
  content?: string
}>()

const emit = defineEmits<{
  close: []
  confirm: []
  cancel: []
}>()

const handleMaskClick = () => {
  emit('close')
}

const handleConfirm = () => {
  emit('confirm')
}

const handleCancel = () => {
  emit('cancel')
}
</script>

<style lang="scss" scoped>
.dialog-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.dialog-content {
  width: 85%;
  max-width: 600rpx;
  background: #FFFFFF;
  border-radius: 24rpx;
  padding: 48rpx 32rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 8rpx 32rpx rgba(255, 193, 233, 0.3);
}

.dialog-icon {
  width: 80rpx;
  height: 80rpx;
  margin-bottom: 24rpx;
  
  .icon {
    width: 100%;
    height: 100%;
    
    &.icon-alert {
      background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23FFC1E9'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z'/%3E%3C/svg%3E") no-repeat center;
      background-size: 100%;
    }
    
    &.icon-success {
      background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%237ED6A5'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z'/%3E%3C/svg%3E") no-repeat center;
      background-size: 100%;
    }
    
    &.icon-error {
      background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23FF6B6B'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z'/%3E%3C/svg%3E") no-repeat center;
      background-size: 100%;
    }
    
    &.icon-confirm {
      background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23FFC1E9'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-6h2v6zm0-8h-2V7h2v4z'/%3E%3C/svg%3E") no-repeat center;
      background-size: 100%;
    }
  }
}

.dialog-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #FFC1E9;
  margin-bottom: 16rpx;
}

.dialog-desc {
  font-size: 28rpx;
  color: #333333;
  text-align: center;
  line-height: 1.6;
  margin-bottom: 32rpx;
}

.dialog-loading {
  margin-bottom: 32rpx;
  
  .loading-spinner {
    width: 60rpx;
    height: 60rpx;
    border: 4rpx solid #FFC1E9;
    border-top-color: transparent;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.dialog-btn-area {
  width: 100%;
  display: flex;
  gap: 24rpx;
}

.dialog-btn {
  flex: 1;
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 24rpx;
  font-size: 32rpx;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:active {
    transform: scale(1);
  }
}

.dialog-btn-cancel {
  background: #E5E5E5;
  color: #666666;
}

.dialog-btn-confirm {
  background: #FFC1E9;
  color: #FFFFFF;
}
</style>