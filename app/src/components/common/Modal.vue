<template>
  <view class="modal-mask" v-if="visible" @click="handleMaskClick">
    <view class="modal" @click.stop>
      <view class="modal-icon" :class="iconClass"></view>
      <view class="modal-title">{{ title }}</view>
      <view class="modal-desc">{{ desc }}</view>
      <view class="modal-actions">
        <view
          v-if="showCancel"
          class="action-btn btn-light"
          @click="$emit('cancel')"
        >
          {{ cancelText }}
        </view>
        <view
          class="action-btn"
          :class="confirmBtnClass"
          @click="$emit('confirm')"
        >
          {{ confirmText }}
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  visible: boolean
  title: string
  desc: string
  type?: 'success' | 'confirm' | 'delete'
  confirmText?: string
  cancelText?: string
  showCancel?: boolean
}>(), {
  type: 'success',
  confirmText: '我知道啦',
  cancelText: '取消',
  showCancel: false,
})

defineEmits<{
  confirm: []
  cancel: []
}>()

const handleMaskClick = () => {
  if (props.type === 'success') {
    return
  }
}

const iconClass = computed(() => {
  return `icon-${props.type}`
})

const confirmBtnClass = computed(() => {
  if (props.type === 'delete') {
    return 'btn-danger'
  }
  return 'btn-primary'
})
</script>

<style lang="scss" scoped>
.modal-mask {
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

.modal {
  width: 640rpx;
  background: #ffffff;
  border-radius: 68rpx;
  padding: 56rpx 48rpx 48rpx;
  box-shadow: 0 40rpx 100rpx rgba(0, 0, 0, 0.12);
  animation: popup 0.2s ease;
}

@keyframes popup {
  from {
    transform: scale(0.92);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.modal-icon {
  width: 144rpx;
  height: 144rpx;
  border-radius: 48rpx;
  margin: 0 auto 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;

  &.icon-success {
    background: #EAF8EC;

    .icon-inner {
      background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2364B76A'%3E%3Cpath d='M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z'/%3E%3C/svg%3E")
        no-repeat center;
      background-size: 100%;
    }
  }

  &.icon-confirm {
    background: #FFF3E8;

    .icon-inner {
      background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23F4A259'%3E%3Cpath d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'/%3E%3C/svg%3E")
        no-repeat center;
      background-size: 100%;
    }
  }

  &.icon-delete {
    background: #FFE8EA;

    .icon-inner {
      background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23E26D6D'%3E%3Cpath d='M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z'/%3E%3C/svg%3E")
        no-repeat center;
      background-size: 100%;
    }
  }
}

.icon-inner {
  width: 56rpx;
  height: 56rpx;
}

.modal-title {
  text-align: center;
  font-size: 44rpx;
  font-weight: 800;
  color: #4B3A3A;
}

.modal-desc {
  margin-top: 24rpx;
  text-align: center;
  font-size: 28rpx;
  line-height: 1.9;
  color: #9A8F8F;
}

.modal-actions {
  margin-top: 56rpx;
  display: flex;
  gap: 24rpx;
}

.action-btn {
  flex: 1;
  height: 104rpx;
  border-radius: 36rpx;
  font-size: 30rpx;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:active {
    opacity: 0.8;
  }
}

.btn-light {
  background: #F7F2EF;
  color: #7A6E6E;
}

.btn-primary {
  background: linear-gradient(135deg, #FFB36B, #FFA45C);
  color: #ffffff;
}

.btn-danger {
  background: linear-gradient(135deg, #F58B8B, #EB6F6F);
  color: #ffffff;
}
</style>
