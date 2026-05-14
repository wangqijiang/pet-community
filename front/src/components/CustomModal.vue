<script setup>
import { computed } from 'vue'
import CustomButton from './CustomButton.vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  showClose: {
    type: Boolean,
    default: true
  },
  showFooter: {
    type: Boolean,
    default: true
  },
  showCancel: {
    type: Boolean,
    default: true
  },
  confirmText: {
    type: String,
    default: '确定'
  },
  cancelText: {
    type: String,
    default: '取消'
  },
  maskClosable: {
    type: Boolean,
    default: true
  },
  width: {
    type: String,
    default: '80%'
  }
})

const emit = defineEmits(['close', 'cancel', 'confirm'])

const contentClass = computed(() => ({
  'modal-content-show': props.show
}))

const handleMaskClick = () => {
  if (props.maskClosable) {
    handleClose()
  }
}

const handleClose = () => {
  emit('close')
}

const handleCancel = () => {
  emit('cancel')
  handleClose()
}

const handleConfirm = () => {
  emit('confirm')
}
</script>

<template>
  <view v-if="show" class="custom-modal" @tap="handleMaskClick">
    <view class="modal-content marshmallow-shadow" :class="contentClass" @tap.stop>
      <!-- Header -->
      <view v-if="title || showClose" class="modal-header">
        <text class="modal-title">{{ title }}</text>
        <text v-if="showClose" class="modal-close" @tap="handleClose">✕</text>
      </view>

      <!-- Body -->
      <view class="modal-body">
        <slot></slot>
      </view>

      <!-- Footer -->
      <view v-if="showFooter" class="modal-footer">
        <slot name="footer">
          <custom-button
            v-if="showCancel"
            type="outline"
            size="medium"
            @click="handleCancel"
          >
            {{ cancelText }}
          </custom-button>
          <custom-button
            type="primary"
            size="medium"
            @click="handleConfirm"
          >
            {{ confirmText }}
          </custom-button>
        </slot>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.custom-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 0.3s ease;
}

.modal-content {
  width: 80%;
  max-width: 500px;
  background-color: #fff8f7;
  border-radius: 24px;
  overflow: hidden;
  transform: scale(0.9);
  opacity: 0;
  transition: all 0.3s ease;
  box-shadow: 0 12px 32px rgba(168, 155, 157, 0.18);
}

.modal-content-show {
  transform: scale(1);
  opacity: 1;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid #d2c3c4;
}

.modal-title {
  font-family: 'Quicksand', sans-serif;
  font-size: 18px;
  font-weight: 600;
  color: #1e1b1b;
}

.modal-close {
  font-size: 24px;
  color: #4f4446;
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  transition: background-color 0.3s ease;

  &:active {
    background-color: #f3ecec;
  }
}

.modal-body {
  padding: 16px;
  max-height: 60vh;
  overflow-y: auto;
}

.modal-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px;
  border-top: 1px solid #d2c3c4;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
