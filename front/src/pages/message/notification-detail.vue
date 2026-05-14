<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import CustomNavbar from '@/components/CustomNavbar.vue'

const notificationId = ref('')
const notification = ref({
  type: 'system',
  icon: '🎉',
  image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCZvKtqzcydOf5NDKyci1z_phSZFzJ2x_3_tHR7p-qNSoLS9irg5ocftyf318n_yhcnv875gIl8fl7L5VbMv9xPkYMQjKwMoS5DnBPc5XVoomhcv6xfUyCwiih4uLVZNiEaLMtHLkdFREJMY64LYEKAbWNwEJiQF_pig8lmIJzFG9qwqoL-5Hf4W-KR8gr7NvLZ8sF8HJ33OejsmUao2XRdDLWw18TcWQt3ml7a0eZHfCMnWbRQcSYSbQ7eH-kYUX6KFlqkCH7cssLC',
  title: '小确幸提醒',
  content: '恭喜！您的动态被选入今日萌宠推荐～ 🐾',
  detail: '亲爱的铲屎官，你分享的精彩瞬间温暖了整个社区！由于内容极具治愈感，我们已将其推荐至首页精选位，让更多爱宠人士感受到这份喜悦。',
  time: '2023-11-24 10:30',
  badges: ['secondary-fixed', 'primary-fixed', 'tertiary-fixed']
})

onLoad((options) => {
  if (options.id) {
    notificationId.value = options.id
  }
})

const handleBack = () => {
  uni.navigateBack()
}
</script>

<template>
  <view class="notification-detail-page">
    <!-- TopAppBar -->
    <CustomNavbar title="通知详情" />

    <!-- Main Content -->
    <view class="main-content">
      <!-- Notification Illustration -->
      <view class="illustration-wrapper">
        <image :src="notification.image" class="illustration-image" mode="aspectFill" />
      </view>

      <!-- Notification Content Card -->
      <view class="content-card">
        <view class="card-header">
          <view class="icon-wrapper">
            <text class="celebration-icon">{{ notification.icon }}</text>
          </view>
          <view class="header-text">
            <text class="system-badge">SYSTEM MESSAGE</text>
            <text class="card-title">{{ notification.title }}</text>
          </view>
        </view>

        <view class="divider"></view>

        <view class="card-body">
          <text class="body-content">{{ notification.content }}</text>
          <text class="body-detail">{{ notification.detail }}</text>
        </view>

        <view class="card-footer">
          <view class="time-wrapper">
            <text class="time-icon">⏰</text>
            <text class="time-text">{{ notification.time }}</text>
          </view>
          <view class="badges-wrapper">
            <view
              v-for="(badge, index) in notification.badges"
              :key="index"
              class="badge-dot"
              :class="badge"
            ></view>
          </view>
        </view>
      </view>

      <!-- Decorative Element -->
      <view class="decorative-footer">
        <text class="decorative-icon">🐾</text>
        <text class="decorative-text">WAGGLE WORLD MOMENT</text>
        <text class="decorative-icon">🐾</text>
      </view>

      <!-- Bottom Buffer -->
      <view class="bottom-buffer"></view>
    </view>
  </view>
</template>

<style scoped>
.notification-detail-page {
  width: 100%;
  min-height: 100vh;
  background-color: #fff8f7;
  padding-bottom: calc(80rpx + env(safe-area-inset-bottom));
}

/* Main Content */
.main-content {
  max-width: 750rpx;
  margin: 0 auto;
  padding: 32rpx 40rpx;
  padding-top: calc(88rpx + var(--status-bar-height, 40rpx) + 32rpx);
}

/* TopAppBar */
.top-bar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 50;
  background-color: rgba(255, 248, 247, 0.8);
  backdrop-filter: blur(24rpx);
  box-shadow: 0 16rpx 64rpx rgba(168, 155, 157, 0.12);
}

.top-bar-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 750rpx;
  margin: 0 auto;
  padding: 32rpx 40rpx;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 16rpx;
  transition: transform 200ms ease;
}

.back-button:active {
  transform: scale(1.05);
}

.back-icon {
  font-size: 48rpx;
  color: #71585c;
}

.top-title {
  font-size: 40rpx;
  font-weight: 700;
  color: #71585c;
  font-family: 'Quicksand', sans-serif;
  letter-spacing: -0.01em;
}

.spacer {
  width: 48rpx;
}

/* Illustration */
.illustration-wrapper {
  position: relative;
  width: 100%;
  max-width: 400rpx;
  margin: 0 auto;
  overflow: hidden;
  border-radius: 48rpx;
  box-shadow: 0 16rpx 64rpx rgba(168, 155, 157, 0.12);
}

.illustration-image {
  width: 100%;
  height: 400rpx;
  display: block;
}

/* Content Card */
.content-card {
  background: #ffffff;
  border: 2rpx solid #f3ecec;
  border-radius: 48rpx;
  padding: 48rpx;
  display: flex;
  flex-direction: column;
  gap: 32rpx;
  box-shadow: 0 16rpx 64rpx rgba(168, 155, 157, 0.12);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.icon-wrapper {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background-color: #ffdde2;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.celebration-icon {
  font-size: 48rpx;
}

.header-text {
  display: flex;
  flex-direction: column;
}

.system-badge {
  font-size: 24rpx;
  font-weight: 700;
  color: #584145;
  letter-spacing: 0.05em;
  font-family: 'Plus Jakarta Sans', sans-serif;
  display: block;
}

.card-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #1e1b1b;
  font-family: 'Quicksand', sans-serif;
}

.divider {
  height: 2rpx;
  background: rgba(210, 195, 196, 0.3);
  width: 100%;
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 32rpx;
}

.body-content {
  font-size: 32rpx;
  color: #4f4446;
  line-height: 1.5;
  font-family: 'Nunito Sans', sans-serif;
}

.body-detail {
  font-size: 28rpx;
  color: rgba(79, 68, 70, 0.8);
  line-height: 1.6;
  font-family: 'Nunito Sans', sans-serif;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 32rpx;
}

.time-wrapper {
  display: flex;
  align-items: center;
  gap: 8rpx;
  color: #71585c;
}

.time-icon {
  font-size: 36rpx;
}

.time-text {
  font-size: 24rpx;
  font-weight: 700;
  letter-spacing: 0.05em;
  font-family: 'Plus Jakarta Sans', sans-serif;
}

.badges-wrapper {
  display: flex;
  margin-left: -16rpx;
}

.badge-dot {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  border: 4rpx solid #fff8f7;
  margin-left: -16rpx;
}

.badge-dot.secondary-fixed {
  background-color: #ede2c0;
}

.badge-dot.primary-fixed {
  background-color: #fcdadf;
}

.badge-dot.tertiary-fixed {
  background-color: #d7e7d5;
}

/* Decorative Footer */
.decorative-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 24rpx;
  opacity: 0.4;
}

.decorative-icon {
  font-size: 28rpx;
  color: #71585c;
}

.decorative-text {
  font-size: 24rpx;
  font-weight: 700;
  color: #71585c;
  letter-spacing: 0.1em;
  font-family: 'Plus Jakarta Sans', sans-serif;
}

.bottom-buffer {
  height: 80rpx;
}
</style>
