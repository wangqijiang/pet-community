<script setup>
import { ref } from 'vue'

const settings = ref([
  { icon: '🔔', text: '消息通知', path: '' },
  { icon: '🔒', text: '隐私设置', path: '' },
  { icon: '🌙', text: '深色模式', path: '', hasSwitch: true, value: false },
  { icon: '📱', text: '关于我们', path: '' },
  { icon: '📝', text: '用户协议', path: '' },
  { icon: '🔐', text: '隐私政策', path: '' }
])

const goBack = () => {
  uni.navigateBack()
}

const handleSettingClick = (setting) => {
  if (setting.hasSwitch) {
    setting.value = !setting.value
    uni.showToast({
      title: setting.value ? '已开启' : '已关闭',
      icon: 'success'
    })
  } else {
    uni.showToast({ title: '功能开发中', icon: 'none' })
  }
}

const logout = () => {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        uni.showToast({
          title: '已退出登录',
          icon: 'success',
          success: () => {
            setTimeout(() => {
              uni.reLaunch({ url: '/pages/home/index' })
            }, 1500)
          }
        })
      }
    }
  })
}
</script>

<template>
  <view class="settings-page">
    <!-- 顶部导航栏 -->
    <view class="header">
      <view class="header-content">
        <view class="back-btn bouncy-active" @tap="goBack">
          <text class="icon">‹</text>
        </view>
        <text class="header-title font-display-title">设置</text>
        <view class="placeholder"></view>
      </view>
    </view>

    <scroll-view scroll-y class="page-content">
      <!-- 设置列表 -->
      <view class="settings-section">
        <view
          v-for="(item, index) in settings"
          :key="index"
          class="setting-item bouncy-active"
          @tap="handleSettingClick(item)"
        >
          <view class="setting-left">
            <text class="setting-icon">{{ item.icon }}</text>
            <text class="setting-text font-body-lg">{{ item.text }}</text>
          </view>
          <view v-if="item.hasSwitch" class="switch-wrapper">
            <switch :checked="item.value" color="#71585c" />
          </view>
          <text v-else class="arrow-icon">›</text>
        </view>
      </view>

      <!-- 退出登录按钮 -->
      <view class="logout-section">
        <view class="logout-btn bouncy-active" @tap="logout">
          <text class="logout-text font-headline-md">退出登录</text>
        </view>
      </view>

      <!-- 版本信息 -->
      <view class="version-info">
        <text class="version-text font-body-md">版本 1.0.0</text>
      </view>
    </scroll-view>
  </view>
</template>

<style lang="scss" scoped>
.settings-page {
  min-height: 100vh;
  background-color: var(--surface);
}

/* 顶部导航栏 */
.header {
  position: sticky;
  top: 0;
  z-index: 50;
  background-color: rgba(255, 248, 247, 0.95);
  backdrop-filter: blur(24rpx);
  -webkit-backdrop-filter: blur(24rpx);
  border-bottom: 2rpx solid var(--outline-variant);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx 32rpx;
}

.back-btn {
  width: 80rpx;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  background-color: var(--surface-container);

  .icon {
    font-size: 64rpx;
    color: var(--primary);
    font-weight: 300;
  }
}

.header-title {
  color: var(--primary);
  font-size: 40rpx;
}

.placeholder {
  width: 80rpx;
}

/* 页面内容 */
.page-content {
  height: calc(100vh - 120rpx);
  padding: 32rpx;
}

/* 设置列表 */
.settings-section {
  background-color: var(--surface-container-lowest);
  border-radius: 48rpx;
  overflow: hidden;
  margin-bottom: 48rpx;
  box-shadow: 0 4rpx 16rpx rgba(168, 155, 157, 0.08);
}

.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32rpx;
  border-bottom: 2rpx solid var(--outline-variant);

  &:last-child {
    border-bottom: none;
  }
}

.setting-left {
  display: flex;
  align-items: center;
  gap: 24rpx;
}

.setting-icon {
  font-size: 48rpx;
}

.setting-text {
  color: var(--on-surface);
}

.switch-wrapper {
  display: flex;
  align-items: center;
}

.arrow-icon {
  font-size: 48rpx;
  color: var(--on-surface-variant);
  opacity: 0.4;
}

/* 退出登录 */
.logout-section {
  margin-bottom: 48rpx;
}

.logout-btn {
  width: 100%;
  height: 112rpx;
  background-color: var(--error-container);
  border-radius: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 16rpx rgba(186, 26, 26, 0.1);
}

.logout-text {
  color: var(--error);
}

/* 版本信息 */
.version-info {
  display: flex;
  justify-content: center;
  padding: 32rpx 0;
}

.version-text {
  color: var(--on-surface-variant);
  opacity: 0.5;
  font-size: 24rpx;
}
</style>
