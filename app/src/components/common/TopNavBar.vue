<template>
  <view class="top-nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
    <view class="nav-content">
      <!-- 左侧返回按钮 -->
      <view
        v-if="showBack"
        class="nav-left"
        :class="{ 'nav-pressed': backPressed }"
        @touchstart="handleBackPress"
        @touchend="handleBackRelease"
        @tap="handleBack"
      >
        <image class="back-icon" :src="backIcon" mode="aspectFit"></image>
      </view>

      <!-- 中间标题 -->
      <view class="nav-center">
        <text class="nav-title">{{ title }}</text>
      </view>

      <!-- 右侧操作区 -->
      <view class="nav-right">
        <slot name="right"></slot>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  showBack: {
    type: Boolean,
    default: true
  },
  backIcon: {
    type: String,
    default: '/static/images/back-icon.png'
  }
})

const emit = defineEmits(['back'])

const statusBarHeight = ref(0)
const backPressed = ref(false)

onMounted(() => {
  // 获取状态栏高度
  const systemInfo = uni.getSystemInfoSync()
  statusBarHeight.value = systemInfo.statusBarHeight || 0
})

const handleBackPress = () => {
  backPressed.value = true
  uni.vibrateShort({ type: 'light' })
}

const handleBackRelease = () => {
  backPressed.value = false
}

const handleBack = () => {
  emit('back')
  if (!emit('back')) {
    uni.navigateBack({
      delta: 1,
      success: () => {
        uni.vibrateShort({ type: 'light' })
      }
    })
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.top-nav-bar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: $color-bg-white;
  box-shadow: $shadow-light;
  z-index: $z-index-nav;

  .nav-content {
    height: $nav-bar-height;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 $spacing-page-horizontal;
    position: relative;

    .nav-left {
      width: 48rpx;
      height: 48rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: $border-radius-base;
      transition: transform $transition-base ease;

      &.nav-pressed {
        transform: scale($scale-press);
      }

      .back-icon {
        width: 24rpx;
        height: 24rpx;
      }
    }

    .nav-center {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      max-width: 60%;

      .nav-title {
        font-size: $font-size-title;
        font-weight: $font-weight-bold;
        color: $color-gray-dark;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 16em;
      }
    }

    .nav-right {
      display: flex;
      align-items: center;
      gap: $spacing-item;
    }
  }
}
</style>
