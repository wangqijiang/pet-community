<script setup>
import { ref } from 'vue'

const pets = ref([
  {
    id: 1,
    name: '糯米',
    type: '法斗',
    age: 2,
    gender: '公',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD-5mved-C9YPabd_2Z1nK9gnjE54qatOK78OU9Sj55xNL5KKvA6DHkoaDbLoFXozC4GxSgy_wv6ypYvJ5UU_aKxv-jUrjCkAR_GLlLA1pS9jU6ZCE-E2YKSzJOG8pP0llHFXMsQWWVZlZ6gX3-rsX9Bp9htkaYyYxk7t4YKaZU0gBS0YEoaos_PNXFQkITmKcEX-5I29ZSi6dB_SdmisJ1JGZjqT6U_7j5oyqxpll4G4CMLZsd5sw94WPfJg38S5UvR33QNyem7qM7',
    description: '活泼可爱的小法斗'
  },
  {
    id: 2,
    name: '芝士',
    type: '英短',
    age: 1,
    gender: '母',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZMdKiDfzNAeNGEUcfHwrOtIGv2e3Y4brCvvnCRaDDr8LxzvUYuKxf_pENZy7DsEDodJAfXjGCLJtJcsWksOl_h4-IGU7dvjSmX8f5jNpiWCZ1Bi5WJ3BGMQunT2FYf3CV74091Tv9ArNEQ3pwKnD274Ron-PNGUYzcxag7ZlJ2cj6ecn48EfWD1mC46B_nlGPXUYYzK3r9WDCnjcu1k5cNSDICsqKqDo4A9fq58ezdCailt6HGt_luRCHDMHpgjxvm4mIWpag1Ema',
    description: '温柔的小公主'
  }
])

const goBack = () => {
  uni.navigateBack()
}

const addPet = () => {
  uni.showToast({ title: '添加宠物功能开发中', icon: 'none' })
}

const editPet = (petId) => {
  uni.showToast({ title: '编辑宠物功能开发中', icon: 'none' })
}
</script>

<template>
  <view class="pet-info-page">
    <!-- 顶部导航栏 -->
    <view class="header">
      <view class="header-content">
        <view class="back-btn bouncy-active" @tap="goBack">
          <text class="icon">‹</text>
        </view>
        <text class="header-title font-display-title">我的宠物</text>
        <view class="add-btn bouncy-active" @tap="addPet">
          <text class="add-icon">+</text>
        </view>
      </view>
    </view>

    <scroll-view scroll-y class="page-content">
      <view
        v-for="pet in pets"
        :key="pet.id"
        class="pet-card bouncy-active"
        @tap="editPet(pet.id)"
      >
        <image :src="pet.avatar" class="pet-avatar" mode="aspectFill" />
        <view class="pet-info">
          <text class="pet-name font-headline-md">{{ pet.name }}</text>
          <view class="pet-details">
            <text class="detail-item font-body-md">{{ pet.type }}</text>
            <text class="detail-divider">·</text>
            <text class="detail-item font-body-md">{{ pet.age }}岁</text>
            <text class="detail-divider">·</text>
            <text class="detail-item font-body-md">{{ pet.gender }}</text>
          </view>
          <text class="pet-desc font-body-md">{{ pet.description }}</text>
        </view>
        <text class="arrow-icon">›</text>
      </view>

      <view v-if="pets.length === 0" class="empty-state">
        <text class="empty-icon">🐾</text>
        <text class="empty-text font-body-lg">还没有添加宠物哦</text>
        <view class="add-pet-btn bouncy-active" @tap="addPet">
          <text class="btn-text font-label-caps">添加宠物</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<style lang="scss" scoped>
.pet-info-page {
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

.add-btn {
  width: 80rpx;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  background-color: var(--primary);

  .add-icon {
    font-size: 48rpx;
    color: var(--on-primary);
    font-weight: 300;
  }
}

/* 页面内容 */
.page-content {
  height: calc(100vh - 120rpx);
  padding: 32rpx;
}

.pet-card {
  display: flex;
  align-items: center;
  gap: 24rpx;
  background-color: var(--surface-container-lowest);
  border-radius: 48rpx;
  padding: 32rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 4rpx 16rpx rgba(168, 155, 157, 0.08);
  border: 2rpx solid rgba(255, 255, 255, 0.5);
}

.pet-avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: var(--radius-full);
  border: 4rpx solid var(--primary-container);
}

.pet-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.pet-name {
  color: var(--primary);
  font-weight: 700;
}

.pet-details {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.detail-item {
  color: var(--on-surface-variant);
  font-size: 24rpx;
}

.detail-divider {
  color: var(--on-surface-variant);
  opacity: 0.3;
}

.pet-desc {
  color: var(--on-surface-variant);
  font-size: 24rpx;
  line-height: 1.4;
}

.arrow-icon {
  font-size: 48rpx;
  color: var(--on-surface-variant);
  opacity: 0.4;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 0;
  gap: 24rpx;
}

.empty-icon {
  font-size: 96rpx;
  opacity: 0.3;
}

.empty-text {
  color: var(--on-surface-variant);
  opacity: 0.5;
  margin-bottom: 24rpx;
}

.add-pet-btn {
  background-color: var(--primary);
  color: var(--on-primary);
  padding: 24rpx 64rpx;
  border-radius: var(--radius-full);
  box-shadow: 0 8rpx 24rpx rgba(113, 88, 92, 0.2);
}

.btn-text {
  color: var(--on-primary);
}
</style>
