<template>
  <view class="date-picker-mask" v-if="visible" @click="handleMaskClick">
    <view class="date-picker-container" :class="{ 'picker-show': visible }" @click.stop>
      <view class="picker-header">
        <view class="picker-cancel" @click="handleCancel">{{ cancelText }}</view>
        <view class="picker-title">{{ title }}</view>
        <view class="picker-confirm" @click="handleConfirm">{{ confirmText }}</view>
      </view>

      <view class="picker-body">
        <picker-view
          class="picker-view"
          :value="pickerValue"
          @change="handleChange"
        >
          <picker-view-column>
            <view v-for="(item, index) in years" :key="index" class="picker-item">
              <text class="picker-item-text">{{ item }}年</text>
            </view>
          </picker-view-column>

          <picker-view-column>
            <view v-for="(item, index) in months" :key="index" class="picker-item">
              <text class="picker-item-text">{{ String(item).padStart(2, '0') }}月</text>
            </view>
          </picker-view-column>

          <picker-view-column>
            <view v-for="(item, index) in days" :key="index" class="picker-item">
              <text class="picker-item-text">{{ String(item).padStart(2, '0') }}日</text>
            </view>
          </picker-view-column>
        </picker-view>

        <view class="picker-indicator"></view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface Props {
  visible?: boolean
  title?: string
  value?: string
  startDate?: string
  endDate?: string
  cancelText?: string
  confirmText?: string
  maskClosable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  title: '选择日期',
  value: '',
  startDate: '1900-01-01',
  endDate: '2100-12-31',
  cancelText: '取消',
  confirmText: '确定',
  maskClosable: true,
})

const emit = defineEmits<{
  'update:visible': [value: boolean]
  'confirm': [value: string]
  'cancel': []
}>()

const currentYear = new Date().getFullYear()
const years = ref<number[]>([])
const months = ref<number[]>(Array.from({ length: 12 }, (_, i) => i + 1))
const days = ref<number[]>([])

const pickerValue = ref([0, 0, 0])

watch(
  () => props.visible,
  (newVal) => {
    if (newVal) {
      initDate()
    }
  }
)

watch(
  () => props.value,
  () => {
    initDate()
  }
)

const initDate = () => {
  const [startYear] = props.startDate.split('-').map(Number)
  const [endYear] = props.endDate.split('-').map(Number)

  years.value = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i)

  if (props.value) {
    const [year, month, day] = props.value.split('-').map(Number)
    pickerValue.value = [
      year - startYear,
      month - 1,
      day - 1,
    ]
  } else {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth() + 1
    const day = now.getDate()
    pickerValue.value = [
      year - startYear,
      month - 1,
      day - 1,
    ]
  }

  updateDays()
}

const updateDays = () => {
  const yearIndex = pickerValue.value[0]
  const monthIndex = pickerValue.value[1]
  const year = years.value[yearIndex]
  const month = monthIndex + 1

  const daysInMonth = new Date(year, month, 0).getDate()
  days.value = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  if (pickerValue.value[2] >= days.value.length) {
    pickerValue.value[2] = days.value.length - 1
  }
}

watch(
  () => pickerValue.value,
  () => {
    updateDays()
  },
  { deep: true }
)

const handleChange = (e: any) => {
  pickerValue.value = e.detail.value
}

const handleConfirm = () => {
  const year = years.value[pickerValue.value[0]]
  const month = String(pickerValue.value[1] + 1).padStart(2, '0')
  const day = String(pickerValue.value[2] + 1).padStart(2, '0')
  const value = `${year}-${month}-${day}`

  emit('confirm', value)
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

.date-picker-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1000;
}

.date-picker-container {
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

.picker-body {
  position: relative;
  padding: 20rpx 0;
}

.picker-view {
  width: 100%;
  height: 400rpx;
}

.picker-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80rpx;
}

.picker-item-text {
  font-size: $font-size-body;
  color: $color-gray-dark;
}

.picker-indicator {
  position: absolute;
  left: 32rpx;
  right: 32rpx;
  top: 50%;
  transform: translateY(-50%);
  height: 80rpx;
  background: rgba(255, 221, 226, 0.3);
  border-radius: 16rpx;
  pointer-events: none;
  z-index: -1;
}
</style>
