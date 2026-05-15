<template>
  <view class="notification-detail-page">
    <!-- 顶部导航栏 -->
    <view class="top-nav-bar">
      <view
        class="nav-back"
        :class="{ 'nav-back-pressed': backPressed }"
        @touchstart="handleBackPress"
        @touchend="handleBackRelease"
        @tap="goBack"
      >
        <image class="back-icon" src="/static/images/back-icon.png" mode="aspectFit"></image>
      </view>
      <view class="nav-title">通知详情</view>
    </view>

    <!-- 通知内容区域 -->
    <view class="content-container">
      <!-- 通知头部 -->
      <view class="notification-header">
        <view class="icon-wrapper">
          <image class="notification-icon" src="/static/images/notification-icon.png" mode="aspectFit"></image>
        </view>
        <text class="notification-type">系统通知</text>
      </view>

      <!-- 通知插图 -->
      <view class="notification-illustration">
        <image class="illustration-img" src="/static/images/notification-illustration.png" mode="widthFix"></image>
      </view>

      <!-- 通知内容卡片 -->
      <view class="notification-card">
        <text class="card-title">恭喜！您的动态被选入今日萌宠推荐～ 🐾</text>
        <text class="card-content">亲爱的铲屎官，你分享的精彩瞬间温暖了许多人的心！继续记录你和毛孩子的美好日常吧～</text>
      </view>

      <!-- 操作按钮组 -->
      <view class="action-buttons">
        <view
          class="primary-button"
          :class="{ 'button-pressed': primaryPressed }"
          @touchstart="handlePrimaryPress"
          @touchend="handlePrimaryRelease"
          @tap="handlePrimaryAction"
        >
          <text class="button-text">查看详情</text>
          <image class="arrow-icon" src="/static/images/arrow-icon.png" mode="aspectFit"></image>
        </view>
        <view
          class="secondary-button"
          :class="{ 'button-pressed': secondaryPressed }"
          @touchstart="handleSecondaryPress"
          @touchend="handleSecondaryRelease"
          @tap="handleSecondaryAction"
        >
          <text class="button-text">知道了</text>
          <image class="check-icon" src="/static/images/check-icon.png" mode="aspectFit"></image>
        </view>
      </view>

      <!-- 通知时间 -->
      <view class="notification-footer">
        <text class="notification-time">{{ notificationTime }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// 按钮按下状态
const primaryPressed = ref(false)
const secondaryPressed = ref(false)
const backPressed = ref(false)

// 通知时间
const notificationTime = ref('2024年3月15日 14:30')

// 返回按钮交互
const handleBackPress = () => {
  backPressed.value = true
  uni.vibrateShort({ type: 'light' })
}

const handleBackRelease = () => {
  backPressed.value = false
}

const goBack = () => {
  uni.navigateBack({
    delta: 1,
    success: () => {
      uni.vibrateShort({ type: 'light' })
    }
  })
}

// 主按钮交互
const handlePrimaryPress = () => {
  primaryPressed.value = true
  uni.vibrateShort({ type: 'light' })
}

const handlePrimaryRelease = () => {
  primaryPressed.value = false
}

const handlePrimaryAction = () => {
  uni.navigateTo({
    url: '/pages/post-detail/post-detail',
    success: () => {
      uni.vibrateShort({ type: 'medium' })
    }
  })
}

// 次按钮交互
const handleSecondaryPress = () => {
  secondaryPressed.value = true
  uni.vibrateShort({ type: 'light' })
}

const handleSecondaryRelease = () => {
  secondaryPressed.value = false
}

const handleSecondaryAction = () => {
  uni.navigateBack({
    delta: 1,
    success: () => {
      uni.vibrateShort({ type: 'medium' })
    }
  })
}

// 页面加载
onMounted(() => {
  // 可以从路由参数获取通知数据
  // const pages = getCurrentPages()
  // const currentPage = pages[pages.length - 1]
  // const options = currentPage.options
})
</script>

<style lang="scss" scoped>
@import './notification-detail.scss';
</style>
