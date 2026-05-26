<template>
  <view class="login-page">
    <!-- 顶部光晕 -->
    <view class="top-light"></view>

    <!-- 底部光晕 -->
    <view class="bottom-light"></view>

    <!-- 内容区域 -->
    <view class="content">
      <!-- 头部区域 -->
      <view class="hero">
        <!-- Logo -->
        <view class="logo-wrap">
          <view class="logo-icon icon-paw"></view>
        </view>

        <!-- 标题 -->
        <text class="title">萌宠朋友圈</text>

        <!-- 副标题 -->
        <text class="subtitle"
          >记录和毛孩子的每一天<br />发现城市里的宠物友好生活 🐾</text
        >

        <!-- 宠物卡片 -->
        <view class="pet-card">
          <view class="pet-row">
            <image
              class="pet-avatar"
              src="https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=400&auto=format&fit=crop"
              mode="aspectFill"
            />
            <view class="pet-info">
              <text class="pet-name">带上狗狗去生活</text>
              <text class="pet-desc"
                >分享日常 · 发现遛狗好去处 · 认识附近狗友</text
              >
            </view>
          </view>
        </view>
      </view>

      <!-- 登录区域 -->
      <view class="login-area">
        <view class="wechat-btn" @click="handleLogin">
          <view class="wechat-icon icon-heart"></view>
          <text class="wechat-text">微信一键登录</text>
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
  border-radius: 999rpx;
  background: linear-gradient(135deg, #ffb36b, #ffa95d);
  color: #ffffff;
  font-size: 34rpx;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20rpx;
  box-shadow: 0 24rpx 56rpx rgba(255, 179, 107, 0.32);
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
}

.agreement {
  margin-top: 44rpx;
  text-align: center;
  font-size: 24rpx;
  line-height: 1.8;
  color: #a39797;
  width: 100%;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.agreement-link {
  color: #f4a259;
}
</style>
