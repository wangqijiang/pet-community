<template>
  <view class="date-picker-mask" @click="handleMaskClick">
    <view class="date-picker-container" @click.stop>
      <view class="picker-header">
        <view class="picker-cancel" @click="handleCancel">{{ cancelText }}</view>
        <view class="picker-title">{{ title }}</view>
        <view class="picker-confirm" @click="handleConfirm">{{ confirmText }}</view>
      </view>

      <view class="picker-body">
        <view class="picker-columns">
          <view class="picker-column">
            <scroll-view
              class="picker-scroll"
              scroll-y
              :scroll-into-view="`year-${currentIndex[0]}`"
              scroll-with-animation
            >
              <view 
                v-for="(item, index) in years" 
                :key="index"
                :id="`year-${index}`"
                class="picker-item"
                :class="{ 'picker-item-active': currentIndex[0] === index }"
                @click="handleYearClick(index)"
              >
                <text class="picker-item-text">{{ item }}年</text>
              </view>
            </scroll-view>
          </view>

          <view class="picker-column">
            <scroll-view
              class="picker-scroll"
              scroll-y
              :scroll-into-view="`month-${currentIndex[1]}`"
              scroll-with-animation
            >
              <view 
                v-for="(item, index) in months" 
                :key="index"
                :id="`month-${index}`"
                class="picker-item"
                :class="{ 'picker-item-active': currentIndex[1] === index }"
                @click="handleMonthClick(index)"
              >
                <text class="picker-item-text">{{ String(item).padStart(2, '0') }}月</text>
              </view>
            </scroll-view>
          </view>

          <view class="picker-column">
            <scroll-view
              class="picker-scroll"
              scroll-y
              :scroll-into-view="`day-${currentIndex[2]}`"
              scroll-with-animation
            >
              <view 
                v-for="(item, index) in days" 
                :key="index"
                :id="`day-${index}`"
                class="picker-item"
                :class="{ 'picker-item-active': currentIndex[2] === index }"
                @click="handleDayClick(index)"
              >
                <text class="picker-item-text">{{ String(item).padStart(2, '0') }}日</text>
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
import { ref, watch, onMounted } from 'vue'

interface Props {
  title?: string
  value?: string
  startDate?: string
  endDate?: string
  cancelText?: string
  confirmText?: string
  maskClosable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '选择日期',
  value: '',
  startDate: '1900-01-01',
  endDate: '2100-12-31',
  cancelText: '取消',
  confirmText: '确定',
  maskClosable: true,
})

const emit = defineEmits<{
  'confirm': [value: string]
  'cancel': []
}>()

const years = ref<number[]>([])
const months = ref<number[]>(Array.from({ length: 12 }, (_, i) => i + 1))
const days = ref<number[]>([])
const currentIndex = ref([0, 0, 0])

const initDate = () => {
  const [startYear] = props.startDate.split('-').map(Number)
  const [endYear] = props.endDate.split('-').map(Number)

  years.value = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i)

  if (props.value) {
    const [year, month, day] = props.value.split('-').map(Number)
    currentIndex.value = [
      year - startYear,
      month - 1,
      day - 1,
    ]
  } else {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth() + 1
    const day = now.getDate()
    currentIndex.value = [
      year - startYear,
      month - 1,
      day - 1,
    ]
  }

  updateDays()
}

const updateDays = () => {
  const yearIndex = currentIndex.value[0]
  const monthIndex = currentIndex.value[1]
  const year = years.value[yearIndex]
  const month = monthIndex + 1

  const daysInMonth = new Date(year, month, 0).getDate()
  days.value = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  if (currentIndex.value[2] >= days.value.length) {
    currentIndex.value[2] = days.value.length - 1
  }
}

onMounted(() => {
  initDate()
})

watch(
  () => props.value,
  () => {
    initDate()
  }
)

const handleYearClick = (index: number) => {
  uni.vibrateShort({ type: 'light' })
  currentIndex.value[0] = index
  updateDays()
}

const handleMonthClick = (index: number) => {
  uni.vibrateShort({ type: 'light' })
  currentIndex.value[1] = index
  updateDays()
}

const handleDayClick = (index: number) => {
  uni.vibrateShort({ type: 'light' })
  currentIndex.value[2] = index
}

const handleConfirm = () => {
  const year = years.value[currentIndex.value[0]]
  const month = String(currentIndex.value[1] + 1).padStart(2, '0')
  const day = String(currentIndex.value[2] + 1).padStart(2, '0')
  const value = `${year}-${month}-${day}`

  emit('confirm', value)
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

.date-picker-mask {
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

.date-picker-container {
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
  gap: 10rpx;
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
  padding: 24rpx 0;
  transition: all 0.2s ease;

  &.picker-item-active {
    .picker-item-text {
      font-weight: $font-weight-bold;
      color: $color-primary;
      font-size: $font-size-title;
    }
  }

  &:active {
    transform: scale(1.05);
  }
}

.picker-item-text {
  font-size: $font-size-body;
  color: $color-gray-dark;
  font-weight: 500;
  transition: all 0.2s ease;
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