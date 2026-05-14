<script setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import CustomNavbar from '@/components/CustomNavbar.vue'
import CustomTabbar from '@/components/CustomTabbar.vue'

onShow(() => {
  if (typeof uni.$emit === 'function') {
    uni.$emit('updateTabBar', 1)
  }
})

const activeTab = ref('推荐')
const tabs = ref(['推荐', '关注', '附近'])

const posts = ref([
  {
    id: 1,
    author: {
      name: '小柴汪汪',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBLI_TiM-8WkRvWXF3zLl5insv5qwVJ4DP31d8Q83fyEoVhUn_p6EhyrL8P0oYHRYOG2C1EPGovSFDuRKtZEElf6Y3ekMCuXhCm6H8p7E-l9_uww9SEPQfSsuoH443tOg2AqsKTHZrtbleJrTmiyS4ihH0gnl-qs0p-HNYLLCj5ot5DckDWouuxn5prB2VnphtZOod7ht2zORDkmjR6121rLQSrVbmjT1rRu_5fuHxsf3EQVXzfFyXg3aya8R59XZAm0hfx9yP53yyg',
      time: '2小时前'
    },
    content: '今天带糯米去公园玩啦！遇到了好多小伙伴，它超级开心的~',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuD-5mved-C9YPabd_2Z1nK9gnjE54qatOK78OU9Sj55xNL5KKvA6DHkoaDbLoFXozC4GxSgy_wv6ypYvJ5UU_aKxv-jUrjCkAR_GLlLA1pS9jU6ZCE-E2YKSzJOG8pP0llHFXMsQWWVZlZ6gX3-rsX9Bp9htkaYyYxk7t4YKaZU0gBS0YEoaos_PNXFQkITmKcEX-5I29ZSi6dB_SdmisJ1JGZjqT6U_7j5oyqxpll4G4CMLZsd5sw94WPfJg38S5UvR33QNyem7qM7'],
    likeCount: 128,
    commentCount: 23,
    shareCount: 5,
    isLiked: false
  },
  {
    id: 2,
    author: {
      name: '布丁的麻麻',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDcROvBiAnlufyO5cfPaQY9mcv-yAsGEP9dXUnFbZGxCl42fv5RN3LQJNIpIv9sNV2ZXmOVdzfyjwT3PAt4gXu3MODPfEFH3NmiSjeO4p-fgWAWl9V_g7LhTGhMeoybvUj92PT6p7DNzlye9pTy68qY4Rg0IlMz1CAkg36HAlQcbrzpz27M4T83sUJBilrEPmqHEKZCo4-lP5AdeDiwDGXvlDwU0ZADAcUvTkXvepmkJepwdkRXWPEYpY7mRJZ9TUpDT4_XiuWFkKTU',
      time: '5小时前'
    },
    content: '芝士今天学会了新技能：握手！好聪明的小家伙',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAZMdKiDfzNAeNGEUcfHwrOtIGv2e3Y4brCvvnCRaDDr8LxzvUYuKxf_pENZy7DsEDodJAfXjGCLJtJcsWksOl_h4-IGU7dvjSmX8f5jNpiWCZ1Bi5WJ3BGMQunT2FYf3CV74091Tv9ArNEQ3pwKnD274Ron-PNGUYzcxag7ZlJ2cj6ecn48EfWD1mC46B_nlGPXUYYzK3r9WDCnjcu1k5cNSDICsqKqDo4A9fq58ezdCailt6HGt_luRCHDMHpgjxvm4mIWpag1Ema',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAANsaBJcSvFijrJYjk3WiHi-N3dPygzmsHAzlUi5KnqM9d9Raz9z8oiF-uj6S_B_ibX7n-YXkkOTr_7B7kApHP98BjswbGV8Bar6wTtOMkQtwv2F8Uc7xqj_gD1lSr-qIrYABO6-BQAWR1WQvVkzrLj5yq7tp6Y_H6GosFlhxKVNdCLewB62TnMkGI0czzfczVxJdIpyepqP_eBw4sUdVXMDrz1TEhPwuTKCqic4tm8_zQRpBFabXpw1gRLeRB4VlVUdmHSvo3AzoD'
    ],
    likeCount: 95,
    commentCount: 18,
    shareCount: 3,
    isLiked: true
  }
])

const switchTab = (tab) => {
  activeTab.value = tab
}

const goToPublish = () => {
  uni.navigateTo({ url: '/pages/circle/publish' })
}

const goToPostDetail = (postId) => {
  uni.navigateTo({ url: `/pages/circle/post-detail?id=${postId}` })
}

const toggleLike = (post) => {
  post.isLiked = !post.isLiked
  post.likeCount += post.isLiked ? 1 : -1
  uni.vibrateShort({ type: 'light' })
}

const previewImage = (images, index) => {
  uni.previewImage({
    urls: images,
    current: index
  })
}
</script>

<template>
  <view class="circle-page">
    <!-- 顶部导航栏 -->
    <CustomNavbar title="WaggleWorld">
      <template #right>
        <view class="publish-btn" @tap="goToPublish">
          <text class="material-symbols-outlined">edit</text>
        </view>
      </template>
    </CustomNavbar>

    <!-- 标签栏 -->
    <view class="tabs-section">
      <view class="tabs-wrapper">
        <view
          v-for="tab in tabs"
          :key="tab"
          class="tab-item"
          :class="{ active: activeTab === tab }"
          @tap="switchTab(tab)"
        >
          <text class="tab-text font-headline-md">{{ tab }}</text>
          <view v-if="activeTab === tab" class="tab-indicator"></view>
        </view>
      </view>
    </view>

    <scroll-view scroll-y class="page-content">
      <view
        v-for="post in posts"
        :key="post.id"
        class="post-card bouncy-active"
        @tap="goToPostDetail(post.id)"
      >
        <view class="post-header">
          <image :src="post.author.avatar" class="author-avatar" mode="aspectFill" />
          <view class="author-info">
            <text class="author-name font-headline-md">{{ post.author.name }}</text>
            <text class="post-time font-body-md">{{ post.author.time }}</text>
          </view>
          <text class="more-icon">⋯</text>
        </view>

        <text class="post-content font-body-lg">{{ post.content }}</text>

        <view v-if="post.images.length > 0" class="post-images" :class="'images-' + post.images.length">
          <image
            v-for="(img, index) in post.images"
            :key="index"
            :src="img"
            class="post-image"
            mode="aspectFill"
            @tap.stop="previewImage(post.images, index)"
          />
        </view>

        <view class="post-actions">
          <view class="action-item bouncy-active" @tap.stop="toggleLike(post)">
            <text class="action-icon" :class="{ liked: post.isLiked }">{{ post.isLiked ? '❤️' : '🤍' }}</text>
            <text class="action-text font-body-md">{{ post.likeCount }}</text>
          </view>
          <view class="action-item">
            <text class="action-icon">💬</text>
            <text class="action-text font-body-md">{{ post.commentCount }}</text>
          </view>
          <view class="action-item">
            <text class="action-icon">📤</text>
            <text class="action-text font-body-md">{{ post.shareCount }}</text>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 底部TabBar -->
    <CustomTabbar :current="1" />
  </view>
</template>

<style lang="scss" scoped>
.circle-page {
  min-height: 100vh;
  background-color: var(--surface);
  padding-bottom: calc(144rpx + env(safe-area-inset-bottom));
}

.publish-btn {
  width: 88rpx;
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  background-color: var(--primary);
  box-shadow: 0 8rpx 24rpx rgba(113, 88, 92, 0.2);
  transition: all 0.3s ease;

  &:active {
    transform: scale(0.9);
  }

  .material-symbols-outlined {
    font-size: 48rpx;
    color: var(--on-primary);
  }
}

/* 标签栏 */
.tabs-section {
  position: sticky;
  top: 0;
  z-index: 40;
  background-color: var(--surface);
  padding-top: calc(88rpx + var(--status-bar-height, 40rpx));
}

.tabs-wrapper {
  display: flex;
  align-items: center;
  gap: 48rpx;
  padding: 0 32rpx 24rpx;
}

.tab-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
}

.tab-text {
  color: var(--on-surface-variant);
  transition: all 0.3s ease;

  .active & {
    color: var(--primary);
    font-weight: 700;
  }
}

.tab-indicator {
  width: 48rpx;
  height: 6rpx;
  background-color: var(--primary);
  border-radius: var(--radius-full);
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    width: 0;
    opacity: 0;
  }
  to {
    width: 48rpx;
    opacity: 1;
  }
}

/* 页面内容 */
.page-content {
  padding: 32rpx;
  padding-top: calc(88rpx + var(--status-bar-height, 40rpx) + 120rpx);
}

/* 动态卡片 */
.post-card {
  background-color: var(--surface-container-lowest);
  border-radius: 48rpx;
  padding: 32rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 8rpx 32rpx rgba(168, 155, 157, 0.12);
  border: 2rpx solid rgba(255, 255, 255, 0.5);
}

.post-header {
  display: flex;
  align-items: center;
  gap: 24rpx;
  margin-bottom: 24rpx;
}

.author-avatar {
  width: 96rpx;
  height: 96rpx;
  border-radius: var(--radius-full);
  border: 4rpx solid var(--primary-container);
}

.author-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.author-name {
  color: var(--on-surface);
}

.post-time {
  color: var(--on-surface-variant);
  font-size: 24rpx;
}

.more-icon {
  font-size: 48rpx;
  color: var(--on-surface-variant);
  opacity: 0.4;
}

.post-content {
  color: var(--on-surface);
  line-height: 1.6;
  margin-bottom: 24rpx;
  display: block;
}

.post-images {
  display: grid;
  gap: 16rpx;
  margin-bottom: 24rpx;
}

.images-1 {
  grid-template-columns: 1fr;
}

.images-2,
.images-4 {
  grid-template-columns: repeat(2, 1fr);
}

.images-3,
.images-5,
.images-6,
.images-7,
.images-8,
.images-9 {
  grid-template-columns: repeat(3, 1fr);
}

.post-image {
  width: 100%;
  height: 200rpx;
  border-radius: 24rpx;
}

.images-1 .post-image {
  height: 400rpx;
}

.post-actions {
  display: flex;
  align-items: center;
  gap: 48rpx;
  padding-top: 24rpx;
  border-top: 2rpx solid var(--outline-variant);
}

.action-item {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.action-icon {
  font-size: 40rpx;

  &.liked {
    animation: heartBeat 0.3s ease;
  }
}

.action-text {
  color: var(--on-surface-variant);
  font-size: 28rpx;
}

@keyframes heartBeat {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}
</style>
