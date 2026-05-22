<template>
  <view class="action-sheet-mask" @click="handleMaskClick">
    <view class="action-sheet-container" @click.stop>
      <view class="action-sheet-header" v-if="title">
        <text class="header-title">{{ title }}</text>
      </view>

      <view class="action-sheet-content">
        <view
          v-for="(item, index) in actions"
          :key="index"
          class="action-item"
          :class="{
            'action-item-disabled': item.disabled,
            'action-item-danger': item.type === 'danger'
          }"
          @click="handleActionClick(item, index)"
        >
          <view v-if="item.icon" class="action-icon">
            <image v-if="item.iconType === 'image'" :src="item.icon" mode="aspectFit" />
            <view v-else :class="['icon', item.icon]"></view>
          </view>
          <text class="action-text">{{ item.name }}</text>
          <text v-if="item.subname" class="action-subname">{{ item.subname }}</text>
        </view>
      </view>

      <view class="action-sheet-divider"></view>
      
      <view class="action-sheet-cancel" @click="handleCancel">
        <text class="cancel-text">{{ cancelText }}</text>
      </view>

      <view class="safe-area-bottom"></view>
    </view>
  </view>
</template>

<script setup lang="ts">
interface ActionSheetItem {
  name: string
  subname?: string
  icon?: string
  iconType?: 'svg' | 'image'
  disabled?: boolean
  type?: 'default' | 'danger'
}

interface Props {
  title?: string
  actions?: ActionSheetItem[]
  cancelText?: string
  maskClosable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  actions: () => [],
  cancelText: '取消',
  maskClosable: true,
})

const emit = defineEmits<{
  'select': [item: ActionSheetItem, index: number]
  'cancel': []
}>()

const handleActionClick = (item: ActionSheetItem, index: number) => {
  if (item.disabled) return

  uni.vibrateShort({ type: 'light' })
  emit('select', item, index)
}

const handleCancel = () => {
  uni.vibrateShort({ type: 'light' })
  emit('cancel')
}

const handleMaskClick = () => {
  if (props.maskClosable) {
    handleCancel()
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.action-sheet-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  align-items: flex-end;
}

.action-sheet-container {
  width: 100%;
  background: $color-bg-white;
  border-radius: 32rpx 32rpx 0 0;
  transform: translateY(100%);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &.sheet-show {
    transform: translateY(0);
  }
}

@keyframes slideUp {
  0% {
    transform: translateY(100%);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

.action-sheet-header {
  padding: 32rpx;
  text-align: center;
  border-bottom: 2rpx solid rgba(113, 88, 92, 0.08);
}

.header-title {
  font-size: $font-size-body;
  color: $color-gray-medium;
  font-weight: 500;
}

.action-sheet-content {
  padding: 16rpx 0;
}

.action-item {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 32rpx;
  transition: all 0.2s ease;
  position: relative;

  &:active {
    background: rgba(252, 218, 223, 0.3);
  }

  &.action-item-disabled {
    opacity: 0.4;
    pointer-events: none;
  }

  &.action-item-danger {
    .action-text {
      color: $color-error;
    }
  }

  &::after {
    content: '';
    position: absolute;
    left: 32rpx;
    right: 32rpx;
    bottom: 0;
    height: 2rpx;
    background: rgba(113, 88, 92, 0.06);
  }

  &:last-child::after {
    display: none;
  }
}

.action-icon {
  width: 56rpx;
  height: 56rpx;
  margin-bottom: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;

  image {
    width: 100%;
    height: 100%;
  }

  .icon {
    width: 100%;
    height: 100%;
  }
}

.action-text {
  font-size: $font-size-body;
  color: $color-gray-dark;
  font-weight: 600;
  text-align: center;
}

.action-subname {
  font-size: $font-size-helper;
  color: $color-gray-light;
  margin-top: 8rpx;
  text-align: center;
}

.action-sheet-divider {
  height: 16rpx;
  background: $color-bg-primary;
}

.action-sheet-cancel {
  padding: 28rpx;
  text-align: center;
  transition: all 0.2s ease;

  &:active {
    background: rgba(113, 88, 92, 0.05);
  }
}

.cancel-text {
  font-size: $font-size-body;
  color: $color-gray-medium;
  font-weight: 600;
}

.safe-area-bottom {
  height: constant(safe-area-inset-bottom);
  height: env(safe-area-inset-bottom);
  background: $color-bg-white;
}
</style>