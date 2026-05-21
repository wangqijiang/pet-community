<template>
  <view class="action-sheet-mask" v-if="visible" @click="handleMaskClick">
    <view class="action-sheet-container" :class="{ 'sheet-show': visible }" @click.stop>
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
  visible?: boolean
  title?: string
  actions?: ActionSheetItem[]
  cancelText?: string
  maskClosable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  title: '',
  actions: () => [],
  cancelText: '取消',
  maskClosable: true,
})

const emit = defineEmits<{
  'update:visible': [value: boolean]
  'select': [item: ActionSheetItem, index: number]
  'close': []
}>()

const handleActionClick = (item: ActionSheetItem, index: number) => {
  if (item.disabled) return

  uni.vibrateShort({ type: 'light' })
  emit('select', item, index)
  emit('update:visible', false)
}

const handleCancel = () => {
  uni.vibrateShort({ type: 'light' })
  emit('close')
  emit('update:visible', false)
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
  z-index: 1000;
  opacity: 0;
  transition: opacity 0.3s ease;

  &.action-sheet-show {
    opacity: 1;
  }
}

.action-sheet-container {
  position: absolute;
  left: 16rpx;
  right: 16rpx;
  bottom: 16rpx;
  background: $color-bg-white;
  border-radius: 32rpx;
  transform: translateY(100%);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;

  &.sheet-show {
    transform: translateY(0);
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
    background: rgba(113, 88, 92, 0.05);
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
    background: rgba(113, 88, 92, 0.08);
  }

  &:last-child::after {
    display: none;
  }
}

.action-icon {
  width: 48rpx;
  height: 48rpx;
  margin-bottom: 16rpx;

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
  font-weight: 500;
  text-align: center;
}

.action-subname {
  font-size: $font-size-helper;
  color: $color-gray-light;
  margin-top: 8rpx;
  text-align: center;
}

.action-sheet-cancel {
  margin: 16rpx 0;
  background: $color-bg-white;
  border-radius: 32rpx;
  padding: 32rpx;
  text-align: center;
  transition: all 0.2s ease;

  &:active {
    background: rgba(113, 88, 92, 0.05);
  }
}

.cancel-text {
  font-size: $font-size-body;
  color: $color-primary;
  font-weight: $font-weight-bold;
}

.safe-area-bottom {
  height: env(safe-area-inset-bottom);
  background: transparent;
}
</style>
