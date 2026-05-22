<template>
  <view class="picker-mask" @click="handleMaskClick">
    <view class="picker-container" @click.stop>
      <view class="picker-header">
        <view class="picker-cancel" @click="handleCancel">{{ cancelText }}</view>
        <view class="picker-title">{{ title }}</view>
        <view class="picker-confirm" @click="handleConfirm">{{ confirmText }}</view>
      </view>

      <view class="picker-body">
        <view class="picker-columns">
          <view 
            v-for="(column, columnIndex) in columns" 
            :key="columnIndex" 
            class="picker-column"
          >
            <scroll-view
              class="picker-scroll"
              scroll-y
              :scroll-into-view="`item-${columnIndex}-${currentIndexes[columnIndex]}`"
              scroll-with-animation
            >
              <view 
                v-for="(item, index) in column" 
                :key="index"
                :id="`item-${columnIndex}-${index}`"
                class="picker-item"
                :class="{ 
                  'picker-item-disabled': item.disabled,
                  'picker-item-active': currentIndexes[columnIndex] === index
                }"
                @click="handleItemClick(columnIndex, index)"
              >
                <text class="picker-item-text">{{ item.label || item }}</text>
                <text v-if="item.alias" class="picker-item-alias">({{ item.alias }})</text>
              </view>
            </scroll-view>
          </view>
        </view>
        <view class="picker-indicator"></view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'

interface PickerItem {
  label: string
  value?: string | number
  alias?: string
  disabled?: boolean
  children?: PickerItem[]
}

interface Props {
  title?: string
  data: PickerItem[][] | PickerItem[]
  value?: (string | number)[]
  defaultIndex?: number[]
  cancelText?: string
  confirmText?: string
  maskClosable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '请选择',
  data: () => [],
  value: () => [],
  defaultIndex: () => [],
  cancelText: '取消',
  confirmText: '确定',
  maskClosable: true,
})

const emit = defineEmits<{
  'confirm': [value: { value: (string | number)[], label: string[] }]
  'cancel': []
  'change': [value: (string | number)[], label: string[]]
}>()

const currentIndexes = ref<number[]>([])

const columns = computed(() => {
  if (props.data.length === 0) return []
  if (Array.isArray(props.data[0])) {
    return props.data as PickerItem[][]
  }
  return [props.data as PickerItem[]]
})

watch(
  () => props.data,
  () => {
    initPickerValue()
  },
  { immediate: true }
)

watch(
  () => props.defaultIndex,
  () => {
    initPickerValue()
  },
  { deep: true }
)

const initPickerValue = () => {
  if (props.defaultIndex.length > 0) {
    currentIndexes.value = [...props.defaultIndex]
  } else if (columns.value.length > 0) {
    currentIndexes.value = columns.value.map((_, index) => {
      return props.value[index] ? getIndexByValue(columns.value[index], props.value[index]) : 0
    })
  }
}

const getIndexByValue = (column: PickerItem[], value: string | number): number => {
  return column.findIndex((item) => {
    const itemValue = typeof item === 'object' ? item.value : item
    return itemValue === value || item === value
  })
}

const handleItemClick = (columnIndex: number, index: number) => {
  const column = columns.value[columnIndex]
  if (column[index]?.disabled) return
  
  uni.vibrateShort({ type: 'light' })
  currentIndexes.value[columnIndex] = index
  
  const selectedValues = getSelectedValues()
  const selectedLabels = getSelectedLabels()
  emit('change', selectedValues, selectedLabels)
}

const getSelectedValues = (): (string | number)[] => {
  return currentIndexes.value.map((index, columnIndex) => {
    const column = columns.value[columnIndex]
    if (!column || !column[index]) return ''
    const item = column[index]
    if (typeof item === 'object') {
      return item.value ?? item.label
    }
    return item
  })
}

const getSelectedLabels = (): string[] => {
  return currentIndexes.value.map((index, columnIndex) => {
    const column = columns.value[columnIndex]
    if (!column || !column[index]) return ''
    const item = column[index]
    if (typeof item === 'object') {
      return item.label
    }
    return item
  })
}

const handleConfirm = () => {
  const selectedValues = getSelectedValues()
  const selectedLabels = getSelectedLabels()
  emit('confirm', { value: selectedValues, label: selectedLabels })
}

const handleCancel = () => {
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

.picker-mask {
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

.picker-container {
  width: 100%;
  background: $color-bg-white;
  border-radius: 32rpx 32rpx 0 0;
  transform: translateY(100%);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: pickerSlideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &.picker-show {
    transform: translateY(0);
  }
}

@keyframes pickerSlideUp {
  0% {
    transform: translateY(100%);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

.picker-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28rpx 32rpx;
  border-bottom: 2rpx solid rgba(113, 88, 92, 0.06);
  background: linear-gradient(180deg, rgba(255, 248, 247, 0.8) 0%, transparent 100%);
}

.picker-cancel,
.picker-confirm {
  font-size: $font-size-body;
  font-weight: 600;
  padding: 12rpx 24rpx;
  transition: all 0.2s ease;
  border-radius: 24rpx;

  &:active {
    opacity: 0.7;
    transform: scale(0.98);
  }
}

.picker-cancel {
  color: $color-gray-medium;
}

.picker-confirm {
  color: $color-bg-white;
  background: linear-gradient(135deg, $color-primary 0%, #FFD4F0 100%);
  box-shadow: 0 4rpx 16rpx rgba(113, 88, 92, 0.15);
}

.picker-title {
  font-size: $font-size-body;
  font-weight: $font-weight-bold;
  color: $color-gray-dark;
}

.picker-body {
  position: relative;
  padding: 20rpx 0;
}

.picker-columns {
  display: flex;
  justify-content: center;
  gap: 20rpx;
  padding: 0 24rpx;
}

.picker-column {
  flex: 1;
  text-align: center;
}

.picker-scroll {
  height: 400rpx;
}

.picker-item {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 24rpx 0;
  transition: all 0.2s ease;

  &.picker-item-disabled {
    opacity: 0.3;
    pointer-events: none;
  }

  &.picker-item-active {
    .picker-item-text {
      font-weight: $font-weight-bold;
      color: $color-primary;
      font-size: $font-size-title;
    }
  }

  &:active:not(.picker-item-disabled) {
    transform: scale(1.05);
  }
}

.picker-item-text {
  font-size: $font-size-body;
  color: $color-gray-dark;
  font-weight: 500;
  transition: all 0.2s ease;
}

.picker-item-alias {
  font-size: $font-size-helper;
  color: $color-gray-light;
  margin-top: 4rpx;
}

.picker-indicator {
  position: absolute;
  left: 24rpx;
  right: 24rpx;
  top: 50%;
  transform: translateY(-50%);
  height: 88rpx;
  background: linear-gradient(180deg, rgba(252, 218, 223, 0.6) 0%, rgba(252, 218, 223, 0.3) 50%, rgba(252, 218, 223, 0.6) 100%);
  border-radius: 20rpx;
  pointer-events: none;
  z-index: 1;
}
</style>