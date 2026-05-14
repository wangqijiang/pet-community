<script setup>
import { ref } from 'vue'

const searchKeyword = ref('')

const fansList = ref([
  {
    id: 1,
    nickname: '可爱的肉垫子',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCMfYL8-gjY-xxOVvP1y5TYS0lGRHSNjTKfr-5fVyZHe-NU1flkjci2XGLkaMugAG80TZWoa2M3rqy_LDJGMNchcK6237kKlqdex32hhOyuNb-VPRQM5QzlIuEheqni3TUdtVvJafcgo0bwk0CGIQ0AYD6cfloURJABQ-qLbBPJr-hzvYDn1DfL5XZX2w0Br2iyyIAnGa853Zw6lI5DK9jIw096Mzor_ch2cvx-384xol2IcViLd50Zad7eOu-fnTCFJ2SEprvKb6Dm',
    bio: '喜欢撸猫撸狗的铲屎官',
    level: 6,
    isFollowing: false
  },
  {
    id: 2,
    nickname: '布丁的麻麻',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDcROvBiAnlufyO5cfPaQY9mcv-yAsGEP9dXUnFbZGxCl42fv5RN3LQJNIpIv9sNV2ZXmOVdzfyjwT3PAt4gXu3MODPfEFH3NmiSjeO4p-fgWAWl9V_g7LhTGhMeoybvUj92PT6p7DNzlye9pTy68qY4Rg0IlMz1CAkg36HAlQcbrzpz27M4T83sUJBilrEPmqHEKZCo4-lP5AdeDiwDGXvlDwU0ZADAcUvTkXvepmkJepwdkRXWPEYpY7mRJZ9TUpDT4_XiuWFkKTU',
    bio: '记录布丁成长的每一天',
    level: 4,
    isFollowing: true
  },
  {
    id: 3,
    nickname: '萌宠小达人',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAANsaBJcSvFijrJYjk3WiHi-N3dPygzmsHAzlUi5KnqM9d9Raz9z8oiF-uj6S_B_ibX7n-YXkkOTr_7B7kApHP98BjswbGV8Bar6wTtOMkQtwv2F8Uc7xqj_gD1lSr-qIrYABO6-BQAWR1WQvVkzrLj5yq7tp6Y_H6GosFlhxKVNdCLewB62TnMkGI0czzfczVxJdIpyepqP_eBw4sUdVXMDrz1TEhPwuTKCqic4tm8_zQRpBFabXpw1gRLeRB4VlVUdmHSvo3AzoD',
    bio: '分享养宠心得',
    level: 9,
    isFollowing: false
  }
])

const goBack = () => {
  uni.navigateBack()
}

const toggleFollow = (user) => {
  user.isFollowing = !user.isFollowing
  uni.showToast({
    title: user.isFollowing ? '已关注' : '已取消关注',
    icon: 'success'
  })
}

const goToUserProfile = (userId) => {
  uni.navigateTo({ url: `/pages/profile/user-detail?id=${userId}` })
}
</script>

<template>
  <view class="fans-page">
    <!-- 顶部导航栏 -->
    <view class="header">
      <view class="header-content">
        <view class="back-btn bouncy-active" @tap="goBack">
          <text class="icon">‹</text>
        </view>
        <text class="header-title font-display-title">我的粉丝</text>
        <view class="placeholder"></view>
      </view>
    </view>

    <view class="page-content">
      <!-- 搜索框 -->
      <view class="search-wrapper">
        <view class="search-box">
          <text class="search-icon">🔍</text>
          <input
            v-model="searchKeyword"
            class="search-input font-body-md"
            placeholder="搜索粉丝..."
            placeholder-class="search-placeholder"
          />
        </view>
      </view>

      <!-- 用户列表 -->
      <scroll-view scroll-y class="user-list">
        <view
          v-for="user in fansList"
          :key="user.id"
          class="user-card bouncy-active"
          @tap="goToUserProfile(user.id)"
        >
          <view class="user-info">
            <view class="avatar-wrapper">
              <image :src="user.avatar" class="user-avatar" mode="aspectFill" />
            </view>
            <view class="user-details">
              <view class="user-name-row">
                <text class="user-name font-headline-md">{{ user.nickname }}</text>
                <view class="level-badge" :class="'level-' + (user.level > 10 ? 'high' : user.level > 5 ? 'mid' : 'low')">
                  <text class="level-text font-label-caps">LV.{{ user.level }}</text>
                </view>
              </view>
              <text class="user-bio font-body-md">{{ user.bio }}</text>
            </view>
          </view>
          <view
            class="follow-btn bouncy-active"
            :class="{ following: user.isFollowing }"
            @tap.stop="toggleFollow(user)"
          >
            <text class="follow-text font-label-caps">{{ user.isFollowing ? '已关注' : '关注' }}</text>
          </view>
        </view>

        <!-- 底部提示 -->
        <view class="list-end">
          <text class="end-icon">🐾</text>
          <text class="end-text font-label-caps">到底啦</text>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.fans-page {
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
  padding: 32rpx;
}

/* 搜索框 */
.search-wrapper {
  margin-bottom: 32rpx;
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
  background-color: var(--surface-container-lowest);
  border-radius: 40rpx;
  padding: 0 48rpx;
  height: 96rpx;
  box-shadow: 0 4rpx 16rpx rgba(168, 155, 157, 0.08);
  transition: all 0.3s ease;

  &:focus-within {
    box-shadow: 0 4rpx 24rpx rgba(113, 88, 92, 0.12);
  }
}

.search-icon {
  font-size: 40rpx;
  margin-right: 16rpx;
  opacity: 0.6;
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  color: var(--on-surface);
  font-size: 28rpx;
}

.search-placeholder {
  color: var(--outline);
}

/* 用户列表 */
.user-list {
  height: calc(100vh - 240rpx);
}

.user-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32rpx;
  background-color: var(--surface-container-lowest);
  border-radius: 48rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 4rpx 16rpx rgba(168, 155, 157, 0.08);
  border: 2rpx solid rgba(255, 255, 255, 0.5);
  transition: all 0.2s ease;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 24rpx;
  flex: 1;
}

.avatar-wrapper {
  width: 112rpx;
  height: 112rpx;
  border-radius: var(--radius-full);
  border: 4rpx solid var(--primary-container);
  overflow: hidden;
}

.user-avatar {
  width: 100%;
  height: 100%;
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  flex: 1;
}

.user-name-row {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.user-name {
  color: var(--on-surface);
}

.level-badge {
  padding: 4rpx 12rpx;
  border-radius: var(--radius-full);

  &.level-low {
    background-color: var(--tertiary-container);
    color: var(--on-tertiary-container);
  }

  &.level-mid {
    background-color: var(--secondary-container);
    color: var(--on-secondary-container);
  }

  &.level-high {
    background-color: var(--primary-container);
    color: var(--on-primary-container);
  }
}

.level-text {
  font-size: 20rpx;
}

.user-bio {
  color: var(--on-surface-variant);
  font-size: 24rpx;
  line-height: 1.4;
}

.follow-btn {
  padding: 12rpx 32rpx;
  border-radius: var(--radius-full);
  border: 2rpx solid var(--outline-variant);
  background-color: var(--surface);
  transition: all 0.2s ease;

  &.following {
    background-color: var(--primary-fixed);
    border-color: var(--primary-container);
  }
}

.follow-text {
  color: var(--primary);
  font-size: 24rpx;

  .following & {
    color: var(--on-primary-fixed-variant);
  }
}

/* 底部提示 */
.list-end {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64rpx 0;
  gap: 16rpx;
  opacity: 0.3;
}

.end-icon {
  font-size: 64rpx;
}

.end-text {
  font-size: 24rpx;
  color: var(--on-surface-variant);
}
</style>
