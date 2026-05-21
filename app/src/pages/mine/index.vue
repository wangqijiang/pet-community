<template>
  <view class="page-container">
    <view class="header-safe"></view>

    <view class="page-content">
      <scroll-view class="content-scroll" scroll-y>
        <!-- 个人资料头部 -->
        <view class="profile-header-section">
          <view class="profile-left">
            <view class="user-avatar-wrapper">
              <image
                class="user-avatar"
                src="/static/images/avatar-default.png"
                mode="aspectFill"
              ></image>
            </view>
            <view class="user-info">
              <text class="user-name">Summer Lin</text>
            </view>
          </view>
          <view class="settings-btn" @tap="goToSetting">
            <view class="settings-icon"></view>
          </view>
        </view>

        <!-- 数据统计 -->
        <view class="stats-card">
          <view class="stat-item" @tap="goToMyDynamic">
            <text class="stat-number">24</text>
            <text class="stat-label">动态</text>
          </view>
          <view class="stat-divider"></view>
          <view class="stat-item" @tap="goToFollow">
            <text class="stat-number">1.2k</text>
            <text class="stat-label">关注</text>
          </view>
          <view class="stat-divider"></view>
          <view class="stat-item" @tap="goToFans">
            <text class="stat-number">856</text>
            <text class="stat-label">粉丝</text>
          </view>
        </view>

        <!-- 我的宠物 -->
        <view class="pets-section">
          <view class="section-header">
            <text class="section-title">我的宠物</text>
            <text class="view-all" @tap="goToPetInfo">查看全部</text>
          </view>
          <scroll-view class="pets-scroll" scroll-x>
            <view class="pets-list">
              <view class="pet-card" @tap="goToPetInfo">
                <view class="pet-avatar-wrapper">
                  <image
                    class="pet-avatar"
                    src="/static/images/avatar-default.png"
                    mode="aspectFill"
                  ></image>
                </view>
                <text class="pet-name">糯米</text>
                <text class="pet-detail">2岁 · 法斗</text>
              </view>
              <view class="pet-card" @tap="goToPetInfo">
                <view class="pet-avatar-wrapper">
                  <image
                    class="pet-avatar"
                    src="/static/images/avatar-default.png"
                    mode="aspectFill"
                  ></image>
                </view>
                <text class="pet-name">芝士</text>
                <text class="pet-detail">1岁 · 英短</text>
              </view>
              <view class="add-pet-card" @tap="goToPetInfo">
                <view class="add-icon-wrapper">
                  <view class="add-icon"></view>
                </view>
                <text class="add-pet-text">添加爱宠</text>
              </view>
            </view>
          </scroll-view>
        </view>

        <!-- AI一键生成攻略卡片 -->
        <view class="ai-tips-card" @tap="handleGenerateTips">
          <view class="ai-tips-content">
            <text class="ai-tips-title">需要养宠建议吗？</text>
            <text class="ai-tips-subtitle">AI为您准备了专属今日攻略</text>
            <view class="generate-btn">
              <view class="generate-icon"></view>
              <text class="generate-text">一键生成攻略</text>
            </view>
          </view>
          <view class="ai-tips-bg-decoration"></view>
        </view>

        <!-- 退出登录按钮 -->
        <view class="logout-section">
          <view class="logout-btn" @tap="handleLogout">
            <text class="logout-text">退出登录</text>
          </view>
        </view>
      </scroll-view>
    </view>

    <TabBar :current="3" />
    <Loading :visible="loading" />
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import TopNavBar from "@/components/common/TopNavBar.vue";
import TabBar from "@/components/common/TabBar.vue";
import Loading from "@/components/common/Loading.vue";

const loading = ref(false);

onMounted(() => {
  loadUserInfo();
});

const loadUserInfo = () => {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
  }, 1000);
};

const goToSetting = () => {
  uni.vibrateShort({ type: "light" });
  uni.navigateTo({
    url: "/pages/mine/setting",
  });
};

const goToPetInfo = () => {
  uni.vibrateShort({ type: "light" });
  uni.navigateTo({
    url: "/pages/mine/myPets",
  });
};

const goToFollow = () => {
  uni.vibrateShort({ type: "light" });
  uni.navigateTo({
    url: "/pages/mine/follow",
  });
};

const goToFans = () => {
  uni.vibrateShort({ type: "light" });
  uni.navigateTo({
    url: "/pages/mine/fans",
  });
};

const handleGenerateTips = () => {
  uni.vibrateShort({ type: "medium" });
  uni.showToast({
    title: "正在生成攻略...",
    icon: "loading",
  });
};

const handleLogout = () => {
  uni.vibrateShort({ type: "medium" });
  uni.showModal({
    title: "提示",
    content: "确定要退出登录吗？",
    success: (res) => {
      if (res.confirm) {
        uni.showToast({
          title: "已退出登录",
          icon: "success",
        });
        setTimeout(() => {
          uni.reLaunch({
            url: "/pages/login/index",
          });
        }, 1500);
      }
    },
  });
};
</script>

<style lang="scss" scoped>
.mine-page {
  width: 100%;
  min-height: 100vh;
  background: #fff8f7;
}

.header-safe {
  height: 80rpx;
  background: #fff8f7;
}

.page-content {
  padding-bottom: calc(152rpx + env(safe-area-inset-bottom));
}

.content-scroll {
  width: 100%;
  box-sizing: border-box;
  height: calc(100vh - 200rpx);
  padding: 16rpx 40rpx 0;
}

/* 个人资料头部 */
.profile-header-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8rpx 0 24rpx;
}

.profile-left {
  display: flex;
  align-items: center;
  gap: 32rpx;
}

.user-avatar-wrapper {
  width: 136rpx;
  height: 136rpx;
  border-radius: 50%;
  border: 6rpx solid #ffdde2;
  overflow: hidden;
  background: #ffffff;
  padding: 4rpx;
  box-shadow: 0 4rpx 16rpx rgba(168, 155, 157, 0.08);
}

.user-avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.user-name {
  font-size: 40rpx;
  font-weight: 700;
  color: #1e1b1b;
  letter-spacing: -0.01em;
}

.settings-btn {
  width: 88rpx;
  height: 88rpx;
  border-radius: 50%;
  background: #f3ecec;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
}

.settings-btn:active {
  transform: scale(1);
}

.settings-icon {
  width: 48rpx;
  height: 48rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2371585c'%3E%3Cpath d='M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.39-1.08-.7-1.66-.94l-.38-2.65c-.03-.24-.24-.42-.48-.42h-4c-.24 0-.45.18-.48.42l-.38 2.65c-.58.24-1.14.55-1.66.94l-2.49-1c-.22-.08-.49 0-.61.22l-2 3.46c-.12.22-.07.49.12.64l2.11 1.65c-.04.32-.07.64-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.39 1.08.7 1.66.94l.38 2.65c.03.24.24.42.48.42h4c.24 0 .45-.18-.48.42l.38-2.65c.58-.24 1.14-.55 1.66-.94l2.49 1c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zm-7.43 2.52c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;
}

/* 数据统计 */
.stats-card {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 48rpx;
  padding: 40rpx;
  margin-bottom: 24rpx;
  display: flex;
  align-items: center;
  justify-content: space-around;
  box-shadow: 0 8rpx 32rpx rgba(168, 155, 157, 0.12);
  border: 2rpx solid #ffffff;
  backdrop-filter: blur(10rpx);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
  transition: transform 0.2s ease;
}

.stat-item:active {
  transform: scale(1);
}

.stat-number {
  font-size: 40rpx;
  font-weight: 700;
  color: #71585c;
}

.stat-label {
  font-size: 24rpx;
  font-weight: 700;
  color: #4f4446;
  letter-spacing: 0.05em;
}

.stat-divider {
  width: 2rpx;
  height: 80rpx;
  background: rgba(210, 195, 196, 0.3);
}

/* 我的宠物 */
.pets-section {
  margin-bottom: 24rpx;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 4rpx;
  margin-bottom: 32rpx;
}

.section-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #1e1b1b;
  letter-spacing: 0.05em;
}

.view-all {
  font-size: 24rpx;
  font-weight: 700;
  color: #71585c;
  letter-spacing: 0.05em;
}

.pets-scroll {
  white-space: nowrap;
  margin: 0 -8rpx;
  padding: 0 8rpx;
}

.pets-list {
  display: inline-flex;
  gap: 32rpx;
}

.pet-card {
  min-width: 290rpx;
  background: #ffffff;
  border-radius: 48rpx;
  padding: 32rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 4rpx 12rpx rgba(168, 155, 157, 0.06);
  border: 2rpx solid rgba(255, 221, 226, 0.1);
  transition: transform 0.2s ease;
}

.pet-card:active {
  transform: scale(1);
}

.pet-avatar-wrapper {
  width: 160rpx;
  height: 160rpx;
  border-radius: 50%;
  margin-bottom: 24rpx;
  border: 4rpx solid rgba(255, 221, 226, 0.2);
  padding: 4rpx;
  overflow: hidden;
}

.pet-avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.pet-name {
  font-size: 32rpx;
  font-weight: 700;
  color: #71585c;
}

.pet-detail {
  font-size: 22rpx;
  font-weight: 700;
  color: #4f4446;
  margin-top: 8rpx;
  letter-spacing: 0.05em;
}

.add-pet-card {
  min-width: 290rpx;
  border: 4rpx dashed rgba(255, 221, 226, 0.4);
  border-radius: 48rpx;
  padding: 32rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(255, 221, 226, 0.05);
  transition: transform 0.2s ease;
}

.add-pet-card:active {
  transform: scale(1);
}

.add-icon-wrapper {
  width: 96rpx;
  height: 96rpx;
  background: rgba(255, 221, 226, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16rpx;
}

.add-icon {
  width: 48rpx;
  height: 48rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2371585c'%3E%3Cpath d='M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;
}

.add-pet-text {
  font-size: 22rpx;
  font-weight: 700;
  color: #71585c;
  letter-spacing: 0.05em;
}

/* 功能菜单 */
.menu-card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 56rpx;
  overflow: hidden;
  box-shadow: 0 8rpx 32rpx rgba(168, 155, 157, 0.12);
  border: 2rpx solid #ffffff;
  margin-bottom: 24rpx;
}

.menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 40rpx;
  transition: background-color 0.2s ease;
}

.menu-item:active {
  background-color: rgba(255, 221, 226, 0.05);
}

.menu-left {
  display: flex;
  align-items: center;
  gap: 32rpx;
}

.menu-icon-wrapper {
  width: 88rpx;
  height: 88rpx;
  background: rgba(255, 221, 226, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.menu-icon {
  width: 48rpx;
  height: 48rpx;
  background-size: 100%;
  background-position: center;
  background-repeat: no-repeat;
}

.menu-icon.icon-dynamic {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2371585c'%3E%3Cpath d='M4 11h5V5H4v6zm0 7h5v-6H4v6zm6 0h5v-6h-5v6zm6 0h5v-6h-5v6zm-6-7h5V5h-5v6zm6-6v6h5V5h-5z'/%3E%3C/svg%3E");
}

.menu-text {
  font-size: 32rpx;
  font-weight: 500;
  color: #1e1b1b;
}

.menu-arrow {
  width: 32rpx;
  height: 32rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23807476'%3E%3Cpath d='M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;
  opacity: 0.4;
}

/* AI一键生成攻略卡片 */
.ai-tips-card {
  background: linear-gradient(135deg, #ffdde2 0%, #ffffff 50%, #ede2c0 100%);
  border-radius: 56rpx;
  padding: 56rpx;
  text-align: center;
  box-shadow: 0 8rpx 32rpx rgba(168, 155, 157, 0.15);
  border: 2rpx solid #ffffff;
  position: relative;
  overflow: hidden;
  transition: transform 0.2s ease;
  margin-bottom: 40rpx;
}

.ai-tips-card:active {
  transform: scale(1);
}

.ai-tips-content {
  position: relative;
  z-index: 1;
}

.ai-tips-title {
  font-size: 36rpx;
  font-weight: 700;
  color: #795f64;
  display: block;
  margin-bottom: 12rpx;
}

.ai-tips-subtitle {
  font-size: 28rpx;
  color: #584145;
  opacity: 0.7;
  display: block;
  margin-bottom: 48rpx;
}

.generate-btn {
  background: #71585c;
  color: #ffffff;
  font-size: 24rpx;
  font-weight: 700;
  letter-spacing: 0.05em;
  padding: 28rpx 80rpx;
  border-radius: 100rpx;
  box-shadow: 0 8rpx 24rpx rgba(113, 88, 92, 0.3);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
}

.generate-icon {
  width: 32rpx;
  height: 32rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M13 3L4 14h7v7l9-11h-7V3z'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;
}

.generate-text {
  color: #ffffff;
  font-weight: 700;
  letter-spacing: 0.05em;
}

.ai-tips-bg-decoration {
  position: absolute;
  left: -64rpx;
  top: 50%;
  transform: translateY(-50%) rotate(-15deg);
  width: 240rpx;
  height: 240rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2371585c'%3E%3Cpath d='M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;
  opacity: 0.1;
}

/* 退出登录按钮 */
.logout-section {
  padding: 20rpx 0 60rpx;
}

.logout-btn {
  height: 96rpx;
  background: #ffffff;
  border-radius: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 32rpx rgba(168, 155, 157, 0.12);
  transition: transform 0.2s ease;

  &:active {
    transform: scale(1);
  }
}

.logout-text {
  font-size: 32rpx;
  font-weight: 600;
  color: #ba1a1a;
}
</style>
