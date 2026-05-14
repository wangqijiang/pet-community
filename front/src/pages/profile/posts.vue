<script setup>
import { ref } from 'vue'

const posts = ref([
  {
    id: 1,
    content: '今天带糯米去公园玩啦！它超级开心的~',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuD-5mved-C9YPabd_2Z1nK9gnjE54qatOK78OU9Sj55xNL5KKvA6DHkoaDbLoFXozC4GxSgy_wv6ypYvJ5UU_aKxv-jUrjCkAR_GLlLA1pS9jU6ZCE-E2YKSzJOG8pP0llHFXMsQWWVZlZ6gX3-rsX9Bp9htkaYyYxk7t4YKaZU0gBS0YEoaos_PNXFQkITmKcEX-5I29ZSi6dB_SdmisJ1JGZjqT6U_7j5oyqxpll4G4CMLZsd5sw94WPfJg38S5UvR33QNyem7qM7'],
    likeCount: 128,
    commentCount: 23,
    time: '2小时前'
  },
  {
    id: 2,
    content: '芝士今天学会了新技能：握手！好聪明的小家伙',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuAZMdKiDfzNAeNGEUcfHwrOtIGv2e3Y4brCvvnCRaDDr8LxzvUYuKxf_pENZy7DsEDodJAfXjGCLJtJcsWksOl_h4-IGU7dvjSmX8f5jNpiWCZ1Bi5WJ3BGMQunT2FYf3CV74091Tv9ArNEQ3pwKnD274Ron-PNGUYzcxag7ZlJ2cj6ecn48EfWD1mC46B_nlGPXUYYzK3r9WDCnjcu1k5cNSDICsqKqDo4A9fq58ezdCailt6HGt_luRCHDMHpgjxvm4mIWpag1Ema'],
    likeCount: 95,
    commentCount: 18,
    time: '昨天'
  }
])

const goBack = () => {
  uni.navigateBack()
}

const goToPostDetail = (postId) => {
  uni.navigateTo({ url: `/pages/circle/post-detail?id=${postId}` })
}

const deletePost = (postId) => {
  uni.showModal({
    title: '提示',
    content: '确定要删除这条动态吗？',
    success: (res) => {
      if (res.confirm) {
        const index = posts.value.findIndex(p => p.id === postId)
        if (index > -1) {
          posts.value.splice(index, 1)
          uni.showToast({ title: '删除成功', icon: 'success' })
        }
      }
    }
  })
}
</script>

<template>
  <view class="posts-page">
    <!-- 顶部导航栏 -->
    <view class="header">
      <view class="header-content">
        <view class="back-btn bouncy-active" @tap="goBack">
          <text class="icon">‹</text>
        </view>
        <text class="header-title font-display-title">我的动态</text>
        <view class="placeholder"></view>
      </view>
    </view>

    <scroll-view scroll-y class="page-content">
      <view
        v-for="post in posts"
        :key="post.id"
        class="post-card bouncy-active"
        @tap="goToPostDetail(post.id)"
      >
        <view class="post-content">
          <text class="post-text font-body-lg">{{ post.content }}</text>
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
            <view class="stat-item">
              <text class="stat-icon">💬</text>
              <text class="stat-text font-body-md">{{ post.commentCount }}</text>
            </view>
            <text class="post-time font-body-md">{{ post.time }}</text>
          </view>
          <view class="delete-btn bouncy-active" @tap.stop="deletePost(post.id)">
            <text class="delete-icon">🗑️</text>
          </view>
        </view>
      </view>

      <view v-if="posts.length === 0" class="empty-state">
        <text class="empty-icon">📝</text>
        <text class="empty-text font-body-lg">还没有发布动态哦</text>
      </view>
    </scroll-view>
  </view>
</template>

<style lang="scss" scoped>
.posts-page {
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

.delete-btn {
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  background-color: var(--error-container);
}

.delete-icon {
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
