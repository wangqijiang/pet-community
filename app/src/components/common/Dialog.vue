<template>
  <view v-if="visible" class="dialog-mask" @tap="handleMaskClick">
    <view class="dialog-container" :class="dialogClass" @tap.stop>
      <!-- 提示弹窗 -->
      <view v-if="type === 'alert'" class="dialog-content">
        <image class="dialog-icon" :src="iconSrc" mode="aspectFit"></image>
        <text class="dialog-title">{{ title }}</text>
        <text class="dialog-message">{{ message }}</text>
        <view
          class="dialog-button primary"
          :class="{ 'button-pressed': buttonPressed }"
          @touchstart="handleButtonPress"
          @touchend="handleButtonRelease"
          @tap="handleConfirm"
        >
          <text class="button-text">{{ confirmText }}</text>
        </view>
      </view>

      <!-- 确认弹窗 -->
      <view v-else-if="type === 'confirm'" class="dialog-content">
        <image class="dialog-icon" :src="iconSrc" mode="aspectFit"></image>
        <text class="dialog-title">{{ title }}</text>
        <text class="dialog-message">{{ message }}</text>
        <view class="dialog-buttons">
          <view
            class="dialog-button secondary"
            :class="{ 'button-pressed': cancelPressed }"
            @touchstart="handleCancelPress"
            @touchend="handleCancelRelease"
            @tap="handleCancel"
          >
            <text class="button-text">{{ cancelText }}</text>
          </view>
          <view
            class="dialog-button primary"
            :class="{ 'button-pressed': confirmPressed }"
            @touchstart="handleConfirmPress"
            @touchend="handleConfirmRelease"
            @tap="handleConfirm"
          >
            <text class="button-text">{{ confirmText }}</text>
          </view>
        </view>
      </view>

      <!-- 输入弹窗 -->
      <view v-else-if="type === 'input'" class="dialog-content">
        <text class="dialog-title">{{ title }}</text>
        <input
          class="dialog-input"
          v-model="inputValue"
          :placeholder="placeholder"
          :maxlength="maxlength"
        />
        <view class="dialog-buttons">
          <view
            class="dialog-button secondary"
            :class="{ 'button-pressed': cancelPressed }"
            @touchstart="handleCancelPress"
            @touchend="handleCancelRelease"
            @tap="handleCancel"
          >
            <text class="button-text">{{ cancelText }}</text>
          </view>
          <view
            class="dialog-button primary"
            :class="{ 'button-pressed': confirmPressed }"
            @touchstart="handleConfirmPress"
            @touchend="handleConfirmRelease"
            @tap="handleConfirm"
          >
            <text class="button-text">{{ confirmText }}</text>
          </view>
        </view>
      </view>

      <!-- 选择弹窗 -->
      <view v-else-if="type === 'select'" class="dialog-content">
        <text class="dialog-title">{{ title }}</text>
        <view class="dialog-options">
          <view
            v-for="(option, index) in options"
            :key="index"
            class="option-item"
            :class="{ 'option-pressed': pressedOption === index }"
            @touchstart="handleOptionPress(index)"
            @touchend="handleOptionRelease"
            @tap="handleOptionSelect(index)"
          >
            <text class="option-text">{{ option }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'alert', // alert, confirm, input, select
    validator: (value) => ['alert', 'confirm', 'input', 'select'].includes(value)
  },
  title: {
    type: String,
    default: '提示'
  },
  message: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: 'info' // success, error, warning, info
  },
  confirmText: {
    type: String,
    default: '确定'
  },
  cancelText: {
    type: String,
    default: '取消'
  },
  placeholder: {
    type: String,
    default: '请输入'
  },
  maxlength: {
    type: Number,
    default: 50
  },
  options: {
    type: Array,
    default: () => []
  },
  closeOnClickMask: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['confirm', 'cancel', 'select', 'update:visible'])

const inputValue = ref('')
const buttonPressed = ref(false)
const confirmPressed = ref(false)
const cancelPressed = ref(false)
const pressedOption = ref(-1)

const iconSrc = computed(() => {
  const iconMap = {
    success: '/static/images/icon-success.png',
    error: '/static/images/icon-error.png',
    warning: '/static/images/icon-warning.png',
    info: '/static/images/icon-info.png'
  }
  return iconMap[props.icon] || iconMap.info
})

const dialogClass = computed(() => {
  return `dialog-${props.type}`
})

const handleMaskClick = () => {
  if (props.closeOnClickMask && props.type !== 'input') {
    emit('update:visible', false)
    emit('cancel')
  }
}

const handleButtonPress = () => {
  buttonPressed.value = true
  uni.vibrateShort({ type: 'light' })
}

const handleButtonRelease = () => {
  buttonPressed.value = false
}

const handleConfirmPress = () => {
  confirmPressed.value = true
  uni.vibrateShort({ type: 'light' })
}

const handleConfirmRelease = () => {
  confirmPressed.value = false
}

const handleCancelPress = () => {
  cancelPressed.value = true
  uni.vibrateShort({ type: 'light' })
}

const handleCancelRelease = () => {
  cancelPressed.value = false
}

const handleConfirm = () => {
  uni.vibrateShort({ type: 'medium' })
  if (props.type === 'input') {
    emit('confirm', inputValue.value)
  } else {
    emit('confirm')
  }
  emit('update:visible', false)
}

const handleCancel = () => {
  uni.vibrateShort({ type: 'medium' })
  emit('cancel')
  emit('update:visible', false)
}

const handleOptionPress = (index) => {
  pressedOption.value = index
  uni.vibrateShort({ type: 'light' })
}

const handleOptionRelease = () => {
  pressedOption.value = -1
}

const handleOptionSelect = (index) => {
  uni.vibrateShort({ type: 'medium' })
  emit('select', index, props.options[index])
  emit('update:visible', false)
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.dialog-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: $z-index-dialog;
  animation: fadeIn $transition-fast ease;
}

.dialog-container {
  width: 85%;
  max-height: 60vh;
  background: $color-bg-white;
  border: $border-width solid $color-primary;
  border-radius: $border-radius-base;
  padding: 40rpx 32rpx;
  box-shadow: 0 0 40rpx rgba(255, 193, 233, 0.3);
  animation: scaleIn $transition-fast ease;
}

.dialog-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-item;

  .dialog-icon {
    width: 64rpx;
    height: 64rpx;
    margin-bottom: $spacing-item;
  }

  .dialog-title {
    font-size: $font-size-button;
    font-weight: $font-weight-bold;
    color: $color-primary;
    text-align: center;
  }

  .dialog-message {
    font-size: $font-size-body;
    color: $color-gray-dark;
    text-align: center;
    line-height: $line-height-base;
    margin-bottom: $spacing-item;
  }

  .dialog-input {
    width: 100%;
    height: 72rpx;
    background: $color-bg-primary;
    border-radius: $border-radius-small;
    padding: 0 $spacing-component;
    font-size: $font-size-body;
    color: $color-gray-dark;
    margin-bottom: $spacing-item;
  }

  .dialog-button {
    width: 100%;
    height: $button-height-medium;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: $border-radius-base;
    transition: transform $transition-base ease;

    &.button-pressed {
      transform: scale($scale-press);
    }

    &.primary {
      background: linear-gradient(135deg, $color-primary 0%, #FFD4F0 100%);
      box-shadow: $shadow-pink;

      .button-text {
        color: $color-bg-white;
      }
    }

    &.secondary {
      background: $color-bg-white;
      border: $border-width solid $border-color;

      .button-text {
        color: $color-gray-medium;
      }
    }

    .button-text {
      font-size: $font-size-button;
      font-weight: $font-weight-bold;
    }
  }

  .dialog-buttons {
    width: 100%;
    display: flex;
    gap: $spacing-component;
    margin-top: $spacing-item;

    .dialog-button {
      flex: 1;
    }
  }

  .dialog-options {
    width: 100%;
    max-height: 400rpx;
    overflow-y: auto;

    .option-item {
      width: 100%;
      height: 88rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      border-bottom: $border-width solid $border-color;
      transition: transform $transition-base ease, background $transition-base ease;

      &:last-child {
        border-bottom: none;
      }

      &.option-pressed {
        transform: scale($scale-press);
        background: rgba($color-primary, 0.05);
      }

      .option-text {
        font-size: $font-size-body;
        color: $color-gray-dark;
      }
    }
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes scaleIn {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
