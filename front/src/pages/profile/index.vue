<script setup>
import { ref, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import CustomNavbar from '@/components/CustomNavbar.vue'
import CustomTabbar from '@/components/CustomTabbar.vue'

onShow(() => {
  if (typeof uni.$emit === 'function') {
    uni.$emit('updateTabBar', 3)
  }
})

const userInfo = ref({
  id: '8820412',
  nickname: 'Summer Lin',
  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBVCVFDlM1aH73uspqp6mQwE5yLahI5rKpXfBGt627Hl_WmE0F3AtSV9EfNzy5_8vl11MpkN-6L1LSO4iYuFFxgLeAjW3kjr4J8UNcVUBiSuqcvaVZiGaQQCGdMFGKHg1enTw9y1ft04ohosHG6PuRYUTwLq7clR2I7AgJHOQ1j9mIVIVygT5G1a4sM25Qj8gkkXIbwFyCYm2T0O_kWRdCxKEbzK--gph451vsoBdcMtN4x5W7JdPrpr_6z0kPchxnjmm4fDDwbYJpw',
  bio: '爱宠物的铲屎官',
  postCount: 24,
  followCount: 1200,
  fanCount: 856,
  pets: [
    {
      id: 1,
      name: '糯米',
      type: '法斗',
      age: 2,
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD-5mved-C9YPabd_2Z1nK9gnjE54qatOK78OU9Sj55xNL5KKvA6DHkoaDbLoFXozC4GxSgy_wv6ypYvJ5UU_aKxv-jUrjCkAR_GLlLA1pS9jU6ZCE-E2YKSzJOG8pP0llHFXMsQWWVZlZ6gX3-rsX9Bp9htkaYyYxk7t4YKaZU0gBS0YEoaos_PNXFQkITmKcEX-5I29ZSi6dB_SdmisJ1JGZjqT6U_7j5oyqxpll4G4CMLZsd5sw94WPfJg38S5UvR33QNyem7qM7'
    },
    {
      id: 2,
      name: '芝士',
      type: '英短',
      age: 1,
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZMdKiDfzNAeNGEUcfHwrOtIGv2e3Y4brCvvnCRaDDr8LxzvUYuKxf_pENZy7DsEDodJAfXjGCLJtJcsWksOl_h4-IGU7dvjSmX8f5jNpiWCZ1Bi5WJ3BGMQunT2FYf3CV74091Tv9ArNEQ3pwKnD274Ron-PNGUYzcxag7ZlJ2cj6ecn48EfWD1mC46B_nlGPXUYYzK3r9WDCnjcu1k5cNSDICsqKqDo4A9fq58ezdCailt6HGt_luRCHDMHpgjxvm4mIWpag1Ema'
    }
  ]
})

const menuItems = ref([
  { icon: '📝', text: '我的动态', path: '/pages/profile/posts' },
  { icon: '⭐', text: '我的收藏', path: '/pages/profile/collections' },
  { icon: '🐾', text: '宠物档案', path: '/pages/profile/pet-info' },
  { icon: '⚙️', text: '设置', path: '/pages/profile/settings' }
])

const goToPage = (path) => {
  uni.navigateTo({ url: path })
}

const goToAIAssistant = () => {
  uni.showToast({ title: 'AI助手功能开发中', icon: 'none' })
}

const goToAddPet = () => {
  uni.navigateTo({ url: '/pages/profile/pet-info?action=add' })
}

const createHeartParticles = (e) => {
  uni.showToast({ title: '生成中...', icon: 'loading' })
}
</script>

<template>
  <view class="profile-page">
    <!-- 顶部导航栏 -->
    <CustomNavbar title="WaggleWorld">
      <template #right>
        <view class="notification-btn" @tap="goToPage('/pages/message/notification-detail')">
          <text class="material-symbols-outlined">notifications</text>
        </view>
      </template>
    </CustomNavbar>

    <scroll-view scroll-y class="page-content">
      <!-- 个人资料头部 -->
      <view class="user-header">
        <view class="user-info-wrapper">
          <view class="avatar-wrapper">
            <image :src="userInfo.avatar" class="user-avatar" mode="aspectFill" />
          </view>
          <view class="user-details">
            <text class="user-name font-display-title">{{ userInfo.nickname }}</text>
            <view class="user-id">
              <text class="id-text font-body-md">ID: {{ userInfo.id }}</text>
              <text class="edit-icon">✏️</text>
            </view>
          </view>
        </view>
        <view class="settings-btn bouncy-active" @tap="goToPage('/pages/profile/settings')">
          <text class="icon">⚙️</text>
        </view>
      </view>

      <!-- AI养宠助手卡片 -->
      <view class="ai-card bouncy-active" @tap="goToAIAssistant">
        <view class="ai-content">
          <view class="ai-icon-wrapper">
            <text class="ai-icon">🤖</text>
          </view>
          <view class="ai-text">
            <text class="ai-title font-headline-md">AI养宠助手</text>
            <text class="ai-desc font-body-md">懂你宠物的每一刻情绪</text>
          </view>
        </view>
        <text class="arrow-icon">›</text>
        <text class="bg-paw">🐾</text>
      </view>

      <!-- 数据统计 -->
      <view class="stats-section marshmallow-shadow">
        <view class="stat-item bouncy-active" @tap="goToPage('/pages/profile/posts')">
          <text class="stat-number font-display-title">{{ userInfo.postCount }}</text>
          <text class="stat-label font-label-caps">动态</text>
        </view>
        <view class="stat-divider"></view>
        <view class="stat-item bouncy-active" @tap="goToPage('/pages/profile/follows')">
          <text class="stat-number font-display-title">{{ userInfo.followCount > 999 ? (userInfo.followCount / 1000).toFixed(1) + 'k' : userInfo.followCount }}</text>
          <text class="stat-label font-label-caps">关注</text>
        </view>
        <view class="stat-divider"></view>
        <view class="stat-item bouncy-active" @tap="goToPage('/pages/profile/fans')">
          <text class="stat-number font-display-title">{{ userInfo.fanCount }}</text>
          <text class="stat-label font-label-caps">粉丝</text>
        </view>
      </view>

      <!-- 我的宠物模块 -->
      <view class="pets-section">
        <view class="section-header">
          <text class="section-title font-headline-md">我的宠物</text>
          <text class="section-more font-label-caps bouncy-active" @tap="goToPage('/pages/profile/pet-info')">查看全部</text>
        </view>
        <scroll-view scroll-x class="pets-scroll">
          <view class="pets-list">
            <!-- 宠物卡片 -->
            <view
              v-for="pet in userInfo.pets"
              :key="pet.id"
              class="pet-card bouncy-active"
              @tap="goToPage(`/pages/profile/pet-info?id=${pet.id}`)"
            >
              <image :src="pet.avatar" class="pet-avatar" mode="aspectFill" />
              <text class="pet-name font-body-lg">{{ pet.name }}</text>
              <text class="pet-info font-label-caps">{{ pet.age }}岁 · {{ pet.type }}</text>
            </view>

            <!-- 添加宠物入口 -->
            <view class="pet-card-add bouncy-active" @tap="goToAddPet">
              <view class="add-icon-wrapper">
                <text class="add-icon">+</text>
              </view>
              <text class="add-text font-body-md">添加宠物</text>
            </view>
          </view>
        </scroll-view>
      </view>

      <!-- 功能菜单 -->
      <view class="menu-section">
        <view
          v-for="(item, index) in menuItems"
          :key="index"
          class="menu-item bouncy-active"
          @tap="goToPage(item.path)"
        >
          <text class="menu-icon">{{ item.icon }}</text>
          <text class="menu-text font-body-lg">{{ item.text }}</text>
          <text class="menu-arrow">›</text>
        </view>
      </view>

      <!-- AI攻略卡片 -->
      <view class="ai-guide-card">
        <view class="guide-content">
          <text class="guide-title font-display-title">需要养宠建议吗？</text>
          <text class="guide-desc font-body-md">AI为您准备了专属今日攻略</text>
          <view class="guide-btn bouncy-active" @tap="createHeartParticles">
            <text class="btn-icon">⚡</text>
            <text class="btn-text font-label-caps">一键生成攻略</text>
          </view>
        </view>
        <text class="guide-bg-icon">💡</text>
      </view>
    </scroll-view>

    <!-- 底部TabBar -->
    <CustomTabbar :current="3" />
  </view>
</template>

<style lang="scss" scoped>
.profile-page {
  min-height: 100vh;
  background-color: var(--surface);
  padding-bottom: calc(144rpx + env(safe-area-inset-bottom));
}

.notification-btn {
  width: 88rpx;
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  transition: all 0.3s ease;

  &:active {
    transform: scale(0.9);
  }

  .material-symbols-outlined {
    font-size: 48rpx;
    color: var(--primary);
  }
}

/* 页面内容 */
.page-content {
  padding: 32rpx;
  padding-top: calc(88rpx + var(--status-bar-height, 40rpx) + 32rpx);
}

}

/* 个人资料头部 */
.user-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 48rpx;
}

.user-info-wrapper {
  display: flex;
  align-items: center;
  gap: 32rpx;
}

.avatar-wrapper {
  width: 136rpx;
  height: 136rpx;
  border-radius: var(--radius-full);
  border: 6rpx solid var(--primary-container);
  padding: 4rpx;
  background-color: var(--surface-container-lowest);
  box-shadow: 0 8rpx 24rpx rgba(168, 155, 157, 0.1);
}

.user-avatar {
  width: 100%;
  height: 100%;
  border-radius: var(--radius-full);
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.user-name {
  color: var(--on-surface);
}

.user-id {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.id-text {
  color: var(--on-surface-variant);
  opacity: 0.6;
}

.edit-icon {
  font-size: 28rpx;
  color: var(--primary);
  opacity: 0.5;
}

.settings-btn {
  width: 88rpx;
  height: 88rpx;
  border-radius: var(--radius-full);
  background-color: var(--surface-container-high);
  display: flex;
  align-items: center;
  justify-content: center;

  .icon {
    font-size: 48rpx;
    color: var(--primary);
  }
}

/* AI养宠助手卡片 */
.ai-card {
  background: linear-gradient(135deg, rgba(255, 221, 226, 0.3) 0%, rgba(255, 221, 226, 0.15) 100%);
  border-radius: 56rpx;
  padding: 40rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 48rpx;
  position: relative;
  overflow: hidden;
  border: 2rpx solid rgba(255, 221, 226, 0.2);
  box-shadow: 0 8rpx 32rpx rgba(168, 155, 157, 0.08);
}

.ai-content {
  display: flex;
  align-items: center;
  gap: 32rpx;
  position: relative;
  z-index: 2;
}

.ai-icon-wrapper {
  width: 112rpx;
  height: 112rpx;
  background-color: var(--surface-container-lowest);
  border-radius: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 16rpx rgba(168, 155, 157, 0.08);
}

.ai-icon {
  font-size: 72rpx;
}

.ai-text {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.ai-title {
  color: var(--on-primary-container);
}

.ai-desc {
  color: var(--on-primary-fixed-variant);
  opacity: 0.8;
}

.arrow-icon {
  font-size: 56rpx;
  color: var(--primary);
  opacity: 0.6;
  position: relative;
  z-index: 2;
}

.bg-paw {
  position: absolute;
  right: -48rpx;
  bottom: -48rpx;
  font-size: 240rpx;
  opacity: 0.05;
  transform: rotate(12deg);
}

/* 数据统计 */
.stats-section {
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(249, 242, 242, 0.8) 100%);
  backdrop-filter: blur(16rpx);
  -webkit-backdrop-filter: blur(16rpx);
  border-radius: 48rpx;
  padding: 40rpx;
  margin-bottom: 48rpx;
  border: 2rpx solid var(--surface-container-lowest);
}

.stat-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
}

.stat-number {
  color: var(--primary);
  font-size: 40rpx;
}

.stat-label {
  color: var(--on-surface-variant);
}

.stat-divider {
  width: 2rpx;
  height: 64rpx;
  background-color: var(--outline-variant);
  opacity: 0.3;
}

/* 我的宠物模块 */
.pets-section {
  margin-bottom: 48rpx;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32rpx;
  padding: 0 8rpx;
}

.section-title {
  color: var(--on-surface);
  letter-spacing: 0.02em;
}

.section-more {
  color: var(--primary);
  font-weight: 700;
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
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  min-width: 290rpx;
  background-color: var(--surface-container-lowest);
  border-radius: 48rpx;
  padding: 32rpx;
  box-shadow: 0 8rpx 24rpx rgba(168, 155, 157, 0.08);
  border: 2rpx solid rgba(255, 221, 226, 0.1);
}

.pet-avatar {
  width: 160rpx;
  height: 160rpx;
  border-radius: var(--radius-full);
  margin-bottom: 24rpx;
  border: 4rpx solid rgba(255, 221, 226, 0.2);
  padding: 4rpx;
}

.pet-name {
  color: var(--primary);
  font-weight: 700;
  font-size: 32rpx;
  margin-bottom: 8rpx;
}

.pet-info {
  color: var(--on-surface-variant);
  font-size: 22rpx;
}

.pet-card-add {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 290rpx;
  border: 4rpx dashed rgba(255, 221, 226, 0.4);
  border-radius: 48rpx;
  padding: 32rpx;
  background: linear-gradient(135deg, rgba(255, 221, 226, 0.05) 0%, rgba(255, 221, 226, 0.02) 100%);
}

.add-icon-wrapper {
  width: 96rpx;
  height: 96rpx;
  border-radius: var(--radius-full);
  background: linear-gradient(135deg, rgba(255, 221, 226, 0.2) 0%, rgba(255, 221, 226, 0.1) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24rpx;
}

.add-icon {
  font-size: 56rpx;
  color: var(--primary);
  font-weight: 300;
}

.add-text {
  color: var(--on-surface-variant);
}

/* 功能菜单 */
.menu-section {
  background-color: var(--surface-container-lowest);
  border-radius: 48rpx;
  overflow: hidden;
  margin-bottom: 48rpx;
  box-shadow: 0 8rpx 24rpx rgba(168, 155, 157, 0.08);
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 32rpx;
  border-bottom: 2rpx solid var(--outline-variant);

  &:last-child {
    border-bottom: none;
  }
}

.menu-icon {
  font-size: 48rpx;
  margin-right: 24rpx;
}

.menu-text {
  flex: 1;
  color: var(--on-surface);
}

.menu-arrow {
  font-size: 48rpx;
  color: var(--on-surface-variant);
  opacity: 0.4;
}

/* AI攻略卡片 */
.ai-guide-card {
  background: linear-gradient(135deg, var(--primary-container) 0%, rgba(255, 221, 226, 0.6) 100%);
  border-radius: 56rpx;
  padding: 64rpx 32rpx;
  position: relative;
  overflow: hidden;
  margin-bottom: 48rpx;
}

.guide-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 2;
}

.guide-title {
  color: var(--on-primary-container);
  margin-bottom: 24rpx;
  font-size: 36rpx;
}

.guide-desc {
  color: var(--on-primary-fixed-variant);
  opacity: 0.7;
  margin-bottom: 48rpx;
}

.guide-btn {
  background-color: var(--primary);
  color: var(--on-primary);
  padding: 28rpx 80rpx;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  gap: 16rpx;
  box-shadow: 0 8rpx 32rpx rgba(113, 88, 92, 0.2);
}

.btn-icon {
  font-size: 32rpx;
}

.btn-text {
  letter-spacing: 0.1em;
  font-size: 28rpx;
}

.guide-bg-icon {
  position: absolute;
  left: -64rpx;
  top: 50%;
  transform: translateY(-50%) rotate(-15deg);
  font-size: 160rpx;
  opacity: 0.1;
}
</style>
