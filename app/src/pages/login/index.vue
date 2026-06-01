<template>
  <view class="login-page">
    <view class="top-light"></view>
    <view class="bottom-light"></view>

    <view class="content">
      <view class="hero">
        <view class="logo-wrap">
          <view class="logo-icon icon-paw"></view>
        </view>

        <text class="title">萌宠朋友圈</text>

        <text class="subtitle">记录和毛孩子的每一天<br />发现城市里的宠物友好生活 🐾</text>

        <view class="pet-card">
          <view class="pet-row">
            <image
              class="pet-avatar"
              src="https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=400&auto=format&fit=crop"
              mode="aspectFill"
            />
            <view class="pet-info">
              <text class="pet-name">带上狗狗去生活</text>
              <text class="pet-desc">分享日常 · 发现遛狗好去处 · 认识附近狗友</text>
            </view>
          </view>
        </view>
      </view>

      <view class="login-area">
        <button
          class="wechat-btn"
          open-type="getPhoneNumber"
          :loading="isLoading"
          :disabled="isLoading"
          @getphonenumber="handleGetPhoneNumber"
        >
          <view class="wechat-btn-inner">
            <view class="wechat-icon icon-heart"></view>
            <text class="wechat-text">{{ isLoading ? '登录中...' : '微信一键登录' }}</text>
          </view>
        </button>

        <view class="guest-btn" @click="handleGuestLogin">
          <text class="guest-text">游客登录</text>
        </view>

        <text class="agreement">
          登录即代表同意
          <text class="agreement-link">《用户协议》</text>
          与
          <text class="agreement-link">《隐私政策》</text>
        </text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { loginWechat, setUserInfo, isLoggedIn, enterGuestMode } from '../../api/auth'
import { PENDING_SHARE_ROUTE_KEY } from '@/utils/postShare'
import { connectRealtime } from '@/utils/realtime'
import { safeReLaunch } from '@/utils/navigation'

const isLoading = ref(false)

const navigateAfterLogin = () => {
  const pendingRoute = uni.getStorageSync(PENDING_SHARE_ROUTE_KEY)
  if (pendingRoute) {
    uni.removeStorageSync(PENDING_SHARE_ROUTE_KEY)
    safeReLaunch(pendingRoute)
    return
  }
  safeReLaunch('/pages/home/index')
}

const finishLogin = (result: Awaited<ReturnType<typeof loginWechat>>) => {
  setUserInfo(result.user, result.token)
  connectRealtime()
  uni.showToast({
    title: '登录成功',
    icon: 'success',
  })
  setTimeout(navigateAfterLogin, 800)
}

const handleGuestLogin = () => {
  enterGuestMode()
  navigateAfterLogin()
}

const handleGetPhoneNumber = async (event: { detail?: { errMsg?: string; code?: string } }) => {
  if (isLoading.value) return

  const detail = event.detail || {}
  if (detail.errMsg !== 'getPhoneNumber:ok' || !detail.code) {
    uni.showToast({
      title: '需要授权手机号才能登录',
      icon: 'none',
    })
    return
  }

  isLoading.value = true
  try {
    const result = await loginWechat(detail.code)
    finishLogin(result)
  } catch (error) {
    uni.showToast({
      title: error instanceof Error ? error.message : '登录失败',
      icon: 'none',
    })
  } finally {
    isLoading.value = false
  }
}

onShow(() => {
  if (isLoggedIn()) {
    connectRealtime()
    navigateAfterLogin()
  }
})
</script>

<style lang="scss" scoped>
.login-page {
  width: 100%;
  height: 100vh;
  background: linear-gradient(180deg, #fff7f1 0%, #fff3ea 100%);
  position: relative;
  overflow: hidden;
}

.top-light {
  position: absolute;
  top: -360rpx;
  left: -240rpx;
  width: 840rpx;
  height: 840rpx;
  border-radius: 999rpx;
  background: radial-gradient(
    circle,
    rgba(255, 200, 150, 0.35) 0%,
    rgba(255, 200, 150, 0) 70%
  );
}

.bottom-light {
  position: absolute;
  bottom: -440rpx;
  right: -240rpx;
  width: 840rpx;
  height: 840rpx;
  border-radius: 999rpx;
  background: radial-gradient(
    circle,
    rgba(255, 220, 190, 0.45) 0%,
    rgba(255, 220, 190, 0) 70%
  );
}

.content {
  position: relative;
  z-index: 2;
  height: 100%;
  padding: 240rpx 72rpx 120rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;
}

.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.logo-wrap {
  width: 280rpx;
  height: 280rpx;
  border-radius: 999rpx;
  background: linear-gradient(135deg, #ffe7cc, #fff4e8);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 32rpx 80rpx rgba(255, 179, 107, 0.18);
}

.logo-icon {
  width: 128rpx;
  height: 128rpx;

  &.icon-paw {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23F4A259'%3E%3Cpath d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'/%3E%3C/svg%3E")
      no-repeat center;
    background-size: 100%;
  }
}

.title {
  margin-top: 72rpx;
  font-size: 76rpx;
  font-weight: 700;
  color: #4e3b32;
  letter-spacing: 2rpx;
}

.subtitle {
  margin-top: 32rpx;
  font-size: 30rpx;
  line-height: 1.9;
  color: #8a7f7f;
  text-align: center;
}

.pet-card {
  margin-top: 96rpx;
  width: 100%;
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(18px);
  border-radius: 64rpx;
  padding: 52rpx;
  box-shadow: 0 24rpx 72rpx rgba(107, 78, 61, 0.06);
}

.pet-row {
  display: flex;
  align-items: center;
  gap: 32rpx;
}

.pet-avatar {
  width: 128rpx;
  height: 128rpx;
  border-radius: 48rpx;
}

.pet-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.pet-name {
  font-size: 36rpx;
  font-weight: 700;
  color: #3d2f2f;
}

.pet-desc {
  margin-top: 12rpx;
  font-size: 26rpx;
  color: #8a7f7f;
}

.login-area {
  width: 100%;
}

.wechat-btn {
  width: 100%;
  height: 116rpx;
  padding: 0;
  margin: 0;
  border: none;
  border-radius: 999rpx;
  background: linear-gradient(135deg, #ffb36b, #ffa95d);
  box-shadow: 0 24rpx 56rpx rgba(255, 179, 107, 0.32);
  overflow: hidden;

  &::after {
    border: none;
  }

  &[disabled] {
    opacity: 0.7;
  }
}

.wechat-btn-inner {
  width: 100%;
  height: 116rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20rpx;
}

.wechat-icon {
  width: 44rpx;
  height: 44rpx;

  &.icon-heart {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23FFFFFF'%3E%3Cpath d='M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z'/%3E%3C/svg%3E")
      no-repeat center;
    background-size: 100%;
  }
}

.wechat-text {
  font-size: 34rpx;
  font-weight: 700;
  color: #ffffff;
}

.guest-btn {
  margin-top: 24rpx;
  width: 100%;
  height: 96rpx;
  border-radius: 999rpx;
  border: 2rpx solid rgba(244, 162, 89, 0.45);
  background: rgba(255, 255, 255, 0.72);
  display: flex;
  align-items: center;
  justify-content: center;

  &:active {
    opacity: 0.85;
    transform: scale(0.98);
  }
}

.guest-text {
  font-size: 30rpx;
  font-weight: 600;
  color: #d97d2f;
}

.agreement {
  margin-top: 32rpx;
  text-align: center;
  font-size: 24rpx;
  line-height: 1.8;
  color: #a39797;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.agreement-link {
  color: #f4a259;
}
</style>
