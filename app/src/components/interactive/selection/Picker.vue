<template>
  <view class="picker-mask" v-if="visible" @click="handleMaskClick">
    <view class="picker-container" :class="{ 'picker-show': visible }" @click.stop>
      <view class="picker-header">
        <view class="picker-cancel" @click="handleCancel">{{ cancelText }}</view>
        <view class="picker-title">{{ title }}</view>
        <view class="picker-confirm" @click="handleConfirm">{{ confirmText }}</view>
      </view>

      <picker-view
        class="picker-view"
        :value="pickerValue"
        @change="handleChange"
        @pickstart="handlePickStart"
        @pickend="handlePickEnd"
      >
        <picker-view-column v-for="(column, columnIndex) in columns" :key="columnIndex">
          <view
            v-for="(item, index) in column"
            :key="index"
            class="picker-item"
            :class="{ 'picker-item-disabled': item.disabled }"
          >
            <text class="picker-item-text">{{ item.label || item }}</text>
            <text v-if="item.alias" class="picker-item-alias">({{ item.alias }})</text>
          </view>
        </picker-view-column>
      </picker-view>

      <view class="picker-indicator"></view>
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
  visible?: boolean
  title?: string
  data: PickerItem[][] | PickerItem[]
  value?: (string | number)[]
  defaultIndex?: number[]
  cancelText?: string
  confirmText?: string
  maskClosable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  title: '请选择',
  data: () => [],
  value: () => [],
  defaultIndex: () => [],
  cancelText: '取消',
  confirmText: '确定',
  maskClosable: true,
})

const emit = defineEmits<{
  'update:visible': [value: boolean]
  'confirm': [value: { value: (string | number)[], label: string[] }]
  'cancel': []
  'change': [value: (string | number)[], label: string[]]
}>()

const pickerValue = ref<number[]>([])

const columns = computed(() => {
  if (props.data.length === 0) return []
  if (Array.isArray(props.data[0])) {
    return props.data as PickerItem[][]
  }
  return [props.data as PickerItem[]]
})

watch(
  () => props.visible,
  (newVal) => {
    if (newVal) {
      initPickerValue()
    }
  }
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
    pickerValue.value = [...props.defaultIndex]
  } else if (columns.value.length > 0) {
    pickerValue.value = columns.value.map((_, index) => {
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

const handleChange = (e: any) => {
  const { value } = e.detail
  pickerValue.value = value

  const selectedValues = getSelectedValues()
  const selectedLabels = getSelectedLabels()
  emit('change', selectedValues, selectedLabels)
}

const handlePickStart = () => {
  uni.vibrateShort({ type: 'light' })
}

const handlePickEnd = () => {
  uni.vibrateShort({ type: 'light' })
}

const getSelectedValues = (): (string | number)[] => {
  return pickerValue.value.map((index, columnIndex) => {
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
  return pickerValue.value.map((index, columnIndex) => {
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
  emit('update:visible', false)
}

const handleCancel = () => {
  emit('cancel')
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

.picker-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1000;
  transition: opacity 0.3s ease;

  &.picker-hide {
    opacity: 0;
  }
}

.picker-container {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  background: $color-bg-white;
  border-radius: 32rpx 32rpx 0 0;
  transform: translateY(100%);
  transition: transform 0.3s ease;

  &.picker-show {
    transform: translateY(0);
  }
}

.picker-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32rpx;
  border-bottom: 2rpx solid rgba(113, 88, 92, 0.08);
}

.picker-cancel,
.picker-confirm {
  font-size: $font-size-body;
  font-weight: 500;
  padding: 8rpx 16rpx;
  transition: all 0.2s ease;

  &:active {
    opacity: 0.6;
  }
}

.picker-cancel {
  color: $color-gray-medium;
}

.picker-confirm {
  color: $color-primary;
  font-weight: $font-weight-bold;
}

.picker-title {
  font-size: $font-size-body;
  font-weight: $font-weight-bold;
  color: $color-gray-dark;
}

.picker-view {
  width: 100%;
  height: 480rpx;
  position: relative;
}

.picker-item {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 16rpx 0;
  transition: all 0.2s ease;

  &.picker-item-disabled {
    opacity: 0.3;
    pointer-events: none;
  }
}

.picker-item-text {
  font-size: $font-size-body;
  color: $color-gray-dark;
}

.picker-item-alias {
  font-size: $font-size-helper;
  color: $color-gray-light;
  margin-top: 4rpx;
}

.picker-indicator {
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  height: 80rpx;
  background: rgba(255, 221, 226, 0.3);
  border-radius: 16rpx;
  pointer-events: none;
  z-index: -1;
}
</style>
