<script setup>
import { ref } from 'vue'

const collections = ref([
  {
    id: 1,
    content: '超实用的狗狗训练技巧分享！',
    author: '训犬师小王',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuD-5mved-C9YPabd_2Z1nK9gnjE54qatOK78OU9Sj55xNL5KKvA6DHkoaDbLoFXozC4GxSgy_wv6ypYvJ5UU_aKxv-jUrjCkAR_GLlLA1pS9jU6ZCE-E2YKSzJOG8pP0llHFXMsQWWVZlZ6gX3-rsX9Bp9htkaYyYxk7t4YKaZU0gBS0YEoaos_PNXFQkITmKcEX-5I29ZSi6dB_SdmisJ1JGZjqT6U_7j5oyqxpll4G4CMLZsd5sw94WPfJg38S5UvR33QNyem7qM7'],
    likeCount: 256,
    time: '3天前'
  },
  {
    id: 2,
    content: '猫咪日常护理指南，新手必看！',
    author: '喵星人专家',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuAZMdKiDfzNAeNGEUcfHwrOtIGv2e3Y4brCvvnCRaDDr8LxzvUYuKxf_pENZy7DsEDodJAfXjGCLJtJcsWksOl_h4-IGU7dvjSmX8f5jNpiWCZ1Bi5WJ3BGMQunT2FYf3CV74091Tv9ArNEQ3pwKnD274Ron-PNGUYzcxag7ZlJ2cj6ecn48EfWD1mC46B_nlGPXUYYzK3r9WDCnjcu1k5cNSDICsqKqDo4A9fq58ezdCailt6HGt_luRCHDMHpgjxvm4mIWpag1Ema'],
    likeCount: 189,
    time: '1周前'
  }
])

const goBack = () => {
  uni.navigateBack()
}

const goToPostDetail = (postId) => {
  uni.navigateTo({ url: `/pages/circle/post-detail?id=${postId}` })
}

const uncollect = (postId) => {
  uni.showModal({
    title: '提示',
    content: '确定要取消收藏吗？',
    success: (res) => {
      if (res.confirm) {
        const index = collections.value.findIndex(p => p.id === postId)
        if (index > -1) {
          collections.value.splice(index, 1)
          uni.showToast({ title: '已取消收藏', icon: 'success' })
        }
      }
    }
  })
}
</script>

<template>
  <view class="collections-page">
    <!-- 顶部导航栏 -->
    <view class="header">
      <view class="header-content">
        <view class="back-btn bouncy-active" @tap="goBack">
          <text class="icon">‹</text>
        </view>
        <text class="header-title font-display-title">我的收藏</text>
        <view class="placeholder"></view>
      </view>
    </view>

    <scroll-view scroll-y class="page-content">
      <view
        v-for="post in collections"
        :key="post.id"
        class="post-card bouncy-active"
        @tap="goToPostDetail(post.id)"
      >
        <view class="post-content">
          <text class="post-text font-body-lg">{{ post.content }}</text>
          <text class="post-author font-body-md">@{{ post.author }}</text>
          <view v-if="post.images.length > 0" class="post-images">
            <image
              v-for="(img, index) in post.images"
              :key="index"
              :src="img"
              class="post-image"
              mode="aspectFill"
            />
          </view>
        </view>
        <view class="post-footer">
          <view class="post-stats">
            <view class="stat-item">
              <text class="stat-icon">❤️</text>
              <text class="stat-text font-body-md">{{ post.likeCount }}</text>
            </view>
            <text class="post-time font-body-md">{{ post.time }}</text>
          </view>
          <view class="uncollect-btn bouncy-active" @tap.stop="uncollect(post.id)">
            <text class="uncollect-icon">⭐</text>
          </view>
        </view>
      </view>

      <view v-if="collections.length === 0" class="empty-state">
        <text class="empty-icon">⭐</text>
        <text class="empty-text font-body-lg">还没有收藏内容哦</text>
      </view>
    </scroll-view>
  </view>
</template>

<style lang="scss" scoped>
.collections-page {
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

.post-card {
  background-color: var(--surface-container-lowest);
  border-radius: 48rpx;
  padding: 32rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 4rpx 16rpx rgba(168, 155, 157, 0.08);
  border: 2rpx solid rgba(255, 255, 255, 0.5);
}

.post-content {
  margin-bottom: 24rpx;
}

.post-text {
  color: var(--on-surface);
  line-height: 1.6;
  display: block;
  margin-bottom: 12rpx;
}

.post-author {
  color: var(--primary);
  font-size: 24rpx;
  display: block;
  margin-bottom: 24rpx;
}

.post-images {
  display: flex;
  gap: 16rpx;
  flex-wrap: wrap;
}

.post-image {
  width: 200rpx;
  height: 200rpx;
  border-radius: 24rpx;
}

.post-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.post-stats {
  display: flex;
  align-items: center;
  gap: 32rpx;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.stat-icon {
  font-size: 32rpx;
}

.stat-text {
  color: var(--on-surface-variant);
  font-size: 24rpx;
}

.post-time {
  color: var(--on-surface-variant);
  font-size: 24rpx;
  opacity: 0.6;
}

.uncollect-btn {
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  background-color: var(--secondary-container);
}

.uncollect-icon {
  font-size: 32rpx;
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
}
</style>
