<template>
  <view class="login-page">
    <!-- 主背景区域 -->
    <view class="main-container paw-pattern">
      <!-- 插画区域 -->
      <view class="illustration-area">
        <view class="mascot-wrapper">
          <image
            class="mascot"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC8JgpHQAmP9OCn4WDQmV7sHMV9DqTCdkLEB_g-8yUMppPn3hACdkAj2F3XioEuVxSk61S_sLRszkFe3HotbOJdWlaRoMfvimnzih0T7OjP6ahQuwFClON9UVbIxRMa8ZgUtR9KGO1XVHhIvQMrBqCwzqQaWH6nlmw4n_-Nv9HXVFLS6GnEDTvYDvperQkw5miFzvuWWrXXfw4dRnXl04FF1xwtCYBoz6IqCuIDIVCYpElzZwW91911akVhYGbnrBd4NvpBGpAm3Efg"
            mode="aspectFit"
          />
        </view>
        <view class="title-area">
          <text class="app-title">WaggleWorld</text>
          <text class="app-subtitle">狗狗的治愈星球 · 遇见温暖</text>
        </view>
      </view>

      <!-- 登录容器 -->
      <view class="login-container">
        <view class="login-btn-area">
          <view class="login-btn" @click="handleLogin">
            <text class="btn-icon">🐾</text>
            <text class="btn-text">微信一键登录</text>
          </view>
        </view>
      </view>

      <!-- 底部条款区域 -->
      <view class="terms-area">
        <text class="terms-text">
          登录即代表同意
          <text class="link-text">《用户协议》</text>
          和
          <text class="link-text">《隐私政策》</text>
        </text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
const handleLogin = () => {
  uni.showToast({
    title: "登录成功",
    icon: "success",
  });
  setTimeout(() => {
    uni.reLaunch({
      url: "/pages/home/index",
    });
  }, 1500);
};
</script>

<style lang="scss">
@import "@/styles/variables.scss";

.login-page {
  min-height: 100vh;
  background-color: $color-bg-primary;
}

.main-container {
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 48rpx 40rpx;
  box-sizing: border-box;
}

.paw-pattern {
  background-image: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 25c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm-5-3c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm10 0c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm-5-6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z' fill='%23FFC1E9' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E");
}

.illustration-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 80rpx;
  z-index: 10;
}

.mascot-wrapper {
  width: 224rpx;
  height: 224rpx;
  margin-bottom: 16rpx;
}

.mascot {
  width: 100%;
  height: 100%;
}

.title-area {
  text-align: center;
}

.app-title {
  display: block;
  font-size: 48rpx;
  font-weight: 700;
  color: #71585c;
  letter-spacing: -0.5rpx;
  margin-bottom: 8rpx;
}

.app-subtitle {
  display: block;
  font-size: 28rpx;
  color: #71585c;
  font-weight: 500;
}

.login-container {
  width: 100%;
  max-width: 560rpx;
  padding: 32rpx;
  border-radius: 48rpx;
  z-index: 10;
  margin: 32rpx 0;
}

.login-btn-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8rpx 0;
}

.login-btn {
  width: 100%;
  height: 88rpx;
  background: $color-primary;
  border-radius: 44rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 12rpx rgba(113, 88, 92, 0.3);
  transition: all 0.2s ease;

  &:active {
    transform: scale(1);
    opacity: 0.9;
  }
}

.btn-icon {
  font-size: 40rpx;
  margin-right: 12rpx;
}

.btn-text {
  font-size: 32rpx;
  font-weight: 600;
  color: #ffffff;
}

.terms-area {
  margin-bottom: 48rpx;
  z-index: 10;
}

.terms-text {
  font-size: 24rpx;
  color: #807476;
  text-align: center;
  line-height: 1.6;
}

.link-text {
  color: #71585c;
}
</style>
