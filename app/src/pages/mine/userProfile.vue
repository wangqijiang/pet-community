<template>
  <view class="user-profile-page">
    <TopNavBar title="用户主页" :showBack="true" />

    <view class="page-content">
      <scroll-view class="content-scroll" scroll-y>
        <!-- 个人资料头部 -->
        <view class="profile-header">
          <view class="avatar-wrapper">
            <image
              class="user-avatar"
              src="/static/images/avatar-default.png"
              mode="aspectFill"
            ></image>
            <view class="pet-badge">
              <view class="pet-icon"></view>
            </view>
          </view>
          <view class="profile-info">
            <text class="user-name">肉垫守护者</text>
            <text class="user-desc">记录和毛孩子在一起的每一个治愈瞬间</text>
          </view>
        </view>

        <!-- 操作按钮 -->
        <view class="action-buttons">
          <view class="action-btn followed" @tap="handleFollow">
            <view class="check-icon"></view>
            <text class="btn-text">已关注</text>
          </view>
          <view class="action-btn secondary" @tap="sendMessage">
            <view class="message-icon"></view>
            <text class="btn-text">发私信</text>
          </view>
        </view>

        <!-- 数据统计 -->
        <view class="stats-bar">
          <view class="stat-item">
            <text class="stat-number">128</text>
            <text class="stat-label">动态</text>
          </view>
          <view class="stat-divider"></view>
          <view class="stat-item">
            <text class="stat-number">3.2k</text>
            <text class="stat-label">获赞</text>
          </view>
          <view class="stat-divider"></view>
          <view class="stat-item">
            <text class="stat-number">542</text>
            <text class="stat-label">粉丝</text>
          </view>
        </view>

        <!-- TA的宠物 -->
        <view class="pets-section">
          <view class="section-header">
            <text class="section-title">TA的宠物</text>
            <text class="view-all">查看全部</text>
          </view>
          <scroll-view class="pets-scroll" scroll-x>
            <view class="pets-list">
              <view class="pet-card">
                <image
                  class="pet-cover"
                  src="/static/images/post-default.png"
                  mode="aspectFill"
                ></image>
                <view class="pet-info">
                  <text class="pet-name">奶酪</text>
                  <text class="pet-detail">金毛 · 6个月</text>
                </view>
                <view class="pet-tag">活泼</view>
              </view>
              <view class="pet-card">
                <image
                  class="pet-cover"
                  src="/static/images/post-default.png"
                  mode="aspectFill"
                ></image>
                <view class="pet-info">
                  <text class="pet-name">布丁</text>
                  <text class="pet-detail">比格 · 2岁</text>
                </view>
                <view class="pet-tag secondary">贪吃</view>
              </view>
            </view>
          </scroll-view>
        </view>

        <!-- TA的萌宠日常 -->
        <view class="feed-section">
          <view class="section-header">
            <text class="section-title">TA的萌宠日常</text>
          </view>
          <view class="feed-grid">
            <view class="feed-card tall">
              <image
                class="feed-image"
                src="/static/images/post-default.png"
                mode="aspectFill"
              ></image>
              <view class="feed-info">
                <text class="feed-content"
                  >今天也是被小家伙治愈的一天呢，哪怕是拆家也舍不得骂它...</text
                >
                <view class="feed-stats">
                  <view class="feed-stat">
                    <view class="like-icon filled"></view>
                    <text class="stat-num">1.2k</text>
                  </view>
                  <view class="feed-stat">
                    <view class="comment-icon"></view>
                    <text class="stat-num">86</text>
                  </view>
                </view>
              </view>
            </view>
            <view class="feed-card">
              <image
                class="feed-image"
                src="/static/images/post-default.png"
                mode="aspectFill"
              ></image>
              <view class="feed-info">
                <text class="feed-content"
                  >带柯基去草地撒欢，这小短腿跑起来太带感了！</text
                >
                <view class="feed-stats">
                  <view class="feed-stat">
                    <view class="like-icon"></view>
                    <text class="stat-num">943</text>
                  </view>
                  <view class="feed-stat">
                    <view class="comment-icon"></view>
                    <text class="stat-num">42</text>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>

    <Loading :visible="loading" />
  </view>
</template>

<script setup>
import { ref, onMounted } from "vue";
import TopNavBar from "@/components/common/TopNavBar.vue";
import Loading from "@/components/common/Loading.vue";

const loading = ref(false);

onMounted(() => {
  loadUserProfile();
});

const loadUserProfile = () => {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
  }, 1000);
};

const handleFollow = () => {
  uni.vibrateShort({ type: "light" });
  uni.showToast({
    title: "已取消关注",
    icon: "success",
  });
};

const sendMessage = () => {
  uni.vibrateShort({ type: "light" });
  uni.showToast({
    title: "私信功能开发中",
    icon: "none",
  });
};
</script>

<style lang="scss" scoped>
.user-profile-page {
  width: 100%;
  min-height: 100vh;
  background: #fff8f7;
}

.page-content {
  padding-bottom: calc(152rpx + env(safe-area-inset-bottom));
  padding-bottom: calc(152rpx + env(safe-area-inset-bottom));
}

.content-scroll {
  width: 100%;
  box-sizing: border-box;
  height: calc(100vh - 200rpx);
  padding: 0 40rpx;
  padding-top: 16rpx;
}

/* 个人资料头部 */
.profile-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 40rpx 0;
  gap: 24rpx;
}

.avatar-wrapper {
  position: relative;
}

.user-avatar {
  width: 192rpx;
  height: 192rpx;
  border-radius: 50%;
  border: 8rpx solid #ffdde2;
  padding: 6rpx;
  background: #ffffff;
}

.pet-badge {
  position: absolute;
  right: 8rpx;
  bottom: 8rpx;
  width: 56rpx;
  height: 56rpx;
  background: #71585c;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4rpx solid #ffffff;
}

.pet-icon {
  width: 32rpx;
  height: 32rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M12 2l-2.5 5-5 .7 3.7 3.6-.9 5.1 4.7-2.5 4.7 2.5-.9-5.1 3.7-3.6-5-.7L12 2z'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;
}

.profile-info {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.user-name {
  font-size: 40rpx;
  font-weight: 700;
  color: #71585c;
}

.user-desc {
  font-size: 26rpx;
  color: #4f4446;
  opacity: 0.8;
  max-width: 560rpx;
}

/* 操作按钮 */
.action-buttons {
  display: flex;
  gap: 24rpx;
  margin-bottom: 32rpx;
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  padding: 24rpx;
  border-radius: 48rpx;
  transition: transform 0.2s ease;

  &:active {
    transform: scale(1);
  }

  &.followed {
    background: #f3ecec;

    .btn-text {
      color: #4f4446;
    }
  }

  &.secondary {
    background: #eadfbd;

    .btn-text {
      color: #6a6347;
    }
  }
}

.btn-text {
  font-size: 30rpx;
  font-weight: 600;
}

.check-icon {
  width: 32rpx;
  height: 32rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2371585c'%3E%3Cpath d='M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;
}

.message-icon {
  width: 32rpx;
  height: 32rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%236a6347'%3E%3Cpath d='M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2z'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;
}

/* 数据统计 */
.stats-bar {
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 32rpx 0;
  margin-bottom: 32rpx;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 48rpx;
  box-shadow: 0 8rpx 32rpx rgba(168, 155, 157, 0.12);
  border: 2rpx solid #ffffff;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
}

.stat-number {
  font-size: 40rpx;
  font-weight: 700;
  color: #71585c;
}

.stat-label {
  font-size: 22rpx;
  font-weight: 700;
  color: #4f4446;
  letter-spacing: 0.05em;
}

.stat-divider {
  width: 2rpx;
  height: 60rpx;
  background: rgba(210, 195, 196, 0.3);
}

/* TA的宠物 */
.pets-section {
  margin-bottom: 32rpx;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24rpx;
}

.section-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #1e1b1b;
}

.view-all {
  font-size: 24rpx;
  font-weight: 700;
  color: #71585c;
}

.pets-scroll {
  white-space: nowrap;
  margin: 0 -8rpx;
  padding: 0 8rpx;
}

.pets-list {
  display: inline-flex;
  gap: 24rpx;
}

.pet-card {
  position: relative;
  width: 280rpx;
  background: #ffffff;
  border-radius: 48rpx;
  padding: 24rpx;
  box-shadow: 0 8rpx 32rpx rgba(168, 155, 157, 0.12);
  border: 2rpx solid rgba(255, 221, 226, 0.1);
  transition: transform 0.2s ease;

  &:active {
    transform: scale(1);
  }
}

.pet-cover {
  width: 100%;
  height: 200rpx;
  border-radius: 24rpx;
  margin-bottom: 20rpx;
}

.pet-info {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.pet-name {
  font-size: 30rpx;
  font-weight: 700;
  color: #71585c;
}

.pet-detail {
  font-size: 22rpx;
  color: #4f4446;
  opacity: 0.7;
}

.pet-tag {
  position: absolute;
  top: 24rpx;
  right: 24rpx;
  padding: 8rpx 16rpx;
  background: #daead8;
  border-radius: 20rpx;
  font-size: 20rpx;
  font-weight: 700;
  color: #5b6a5c;

  &.secondary {
    background: #eadfbd;
    color: #6a6347;
  }
}

/* TA的萌宠日常 */
.feed-section {
  margin-bottom: 40rpx;
}

.feed-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24rpx;
}

.feed-card {
  background: #ffffff;
  border-radius: 32rpx;
  overflow: hidden;
  box-shadow: 0 8rpx 32rpx rgba(168, 155, 157, 0.12);
  transition: transform 0.2s ease;

  &:active {
    transform: scale(1);
  }

  &.tall {
    grid-row: span 2;

    .feed-image {
      height: 360rpx;
    }
  }
}

.feed-image {
  width: 100%;
  height: 200rpx;
}

.feed-info {
  padding: 20rpx;
}

.feed-content {
  font-size: 24rpx;
  color: #1e1b1b;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 16rpx;
}

.feed-stats {
  display: flex;
  justify-content: space-between;
}

.feed-stat {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.like-icon {
  width: 32rpx;
  height: 32rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2371585c'%3E%3Cpath d='M12 2l-2.5 5-5 .7 3.7 3.6-.9 5.1 4.7-2.5 4.7 2.5-.9-5.1 3.7-3.6-5-.7L12 2z'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;

  &.filled {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23FF6B8A'%3E%3Cpath d='M12 2l-2.5 5-5 .7 3.7 3.6-.9 5.1 4.7-2.5 4.7 2.5-.9-5.1 3.7-3.6-5-.7L12 2z'/%3E%3C/svg%3E")
      no-repeat center;
    background-size: 100%;
  }
}

.comment-icon {
  width: 32rpx;
  height: 32rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23807476'%3E%3Cpath d='M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2z'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;
}

.stat-num {
  font-size: 22rpx;
  color: #4f4446;
}
</style>
