<template>
  <view class="empty-container" :class="{ show: visible }">
    <view class="empty-wrapper">
      <!-- 图形区域 -->
      <view class="empty-image">
        <!-- 纸飞机 -->
        <view class="paper-plane"></view>

        <!-- 狗狗盒子 -->
        <view class="dog-box">
          <!-- 狗脸 -->
          <view class="dog-face">
            <view class="ear left"></view>
            <view class="ear right"></view>
            <view class="eye left"></view>
            <view class="eye right"></view>
            <view class="nose"></view>
            <view class="mouth"></view>
          </view>

          <!-- 盒子 -->
          <view class="box"></view>
        </view>
      </view>

      <!-- 文本内容 -->
      <view class="empty-content">
        <text class="empty-title">{{ title }}</text>
        <text class="empty-desc">{{ description }}</text>
      </view>

      <!-- 操作按钮 -->
      <view 
        v-if="buttonText" 
        class="empty-button"
        @tap="handleClick"
      >
        <text class="button-icon">🐾</text>
        <text class="button-text">{{ buttonText }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Props {
  title?: string
  description?: string
  buttonText?: string
  buttonIcon?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '还没有内容哦',
  description: '快去添加吧',
  buttonText: '',
  buttonIcon: '🐾'
})

const emit = defineEmits<{
  click: []
}>()

const visible = ref(false)

onMounted(() => {
  setTimeout(() => {
    visible.value = true
  }, 100)
})

const handleClick = () => {
  uni.vibrateShort({ type: 'light' })
  emit('click')
}
</script>

<style lang="scss" scoped>
.empty-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 120rpx 32rpx;
  opacity: 0;
  transform: translateY(30rpx);
  transition: opacity 0.6s ease, transform 0.6s ease;
  
  &.show {
    opacity: 1;
    transform: translateY(0);
  }
}

.empty-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

/* =========================
   Empty Image Area
========================= */

.empty-image {
  width: 240rpx;
  height: 240rpx;
  position: relative;
  margin-bottom: 40rpx;
}

/* 纸飞机 */
.paper-plane {
  position: absolute;
  top: 20rpx;
  right: 60rpx;
  width: 50rpx;
  height: 50rpx;
  background: linear-gradient(135deg, #f0d8cf, #e6c9c0);
  opacity: 0.7;
  transform: rotate(15deg);
  
  &::before {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    border-left: 25rpx solid transparent;
    border-right: 25rpx solid transparent;
    border-bottom: 50rpx solid #e6c9c0;
    transform: rotate(45deg) translate(-5rpx, -5rpx);
  }
}

/* 狗狗盒子 */
.dog-box {
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
  width: 190rpx;
  height: 160rpx;
}

/* 盒子 */
.box {
  width: 160rpx;
  height: 100rpx;
  background: linear-gradient(180deg, #f3dacb, #efd2c0);
  border-radius: 12rpx;
  position: absolute;
  bottom: 0;
  left: 15rpx;
  box-shadow: 0 12rpx 24rpx rgba(224, 184, 168, 0.25);

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: -22rpx;
    width: 70rpx;
    height: 30rpx;
    background: #f5e2d7;
  }

  &::before {
    left: 0;
    transform: skew(-25deg);
    border-radius: 8rpx 0 0 0;
  }

  &::after {
    right: 0;
    transform: skew(25deg);
    border-radius: 0 8rpx 0 0;
  }
}

/* 狗脸 */
.dog-face {
  width: 110rpx;
  height: 110rpx;
  background: #fff7f0;
  border-radius: 50%;
  position: absolute;
  top: 0;
  left: 40rpx;
  box-shadow: 0 8rpx 18rpx rgba(0, 0, 0, 0.05);
}

/* 耳朵 */
.ear {
  width: 34rpx;
  height: 46rpx;
  background: #ffd7ba;
  border-radius: 30rpx;
  position: absolute;
  top: 12rpx;

  &.left {
    left: 8rpx;
    transform: rotate(-25deg);
  }

  &.right {
    right: 8rpx;
    transform: rotate(25deg);
  }
}

/* 眼睛 */
.eye {
  width: 8rpx;
  height: 8rpx;
  background: #5f4545;
  border-radius: 50%;
  position: absolute;
  top: 48rpx;

  &.left {
    left: 36rpx;
  }

  &.right {
    right: 36rpx;
  }
}

/* 鼻子 */
.nose {
  width: 12rpx;
  height: 10rpx;
  background: #8b6666;
  border-radius: 999rpx;
  position: absolute;
  left: 50%;
  top: 60rpx;
  transform: translateX(-50%);
}

/* 嘴巴 */
.mouth {
  width: 24rpx;
  height: 12rpx;
  border-bottom: 3rpx solid #8b6666;
  border-radius: 0 0 20rpx 20rpx;
  position: absolute;
  left: 50%;
  top: 72rpx;
  transform: translateX(-50%);
}

/* =========================
   Empty Content
========================= */

.empty-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 56rpx;
}

.empty-title {
  font-size: 32rpx;
  font-weight: 800;
  color: #71585c;
  margin-bottom: 12rpx;
}

.empty-desc {
  font-size: 28rpx;
  color: #b7abaa;
}

/* =========================
   Empty Button
========================= */

.empty-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20rpx;
  height: 96rpx;
  padding: 0 56rpx;
  border-radius: 999rpx;
  border: 2rpx solid #f0c3b4;
  background: rgba(255, 255, 255, 0.8);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:active {
    transform: scale(0.97);
    box-shadow: 0 8rpx 16rpx rgba(240, 195, 180, 0.3);
  }
}

.button-icon {
  font-size: 32rpx;
}

.button-text {
  font-size: 30rpx;
  font-weight: 700;
  color: #d69783;
}
</style>
