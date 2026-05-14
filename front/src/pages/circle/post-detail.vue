<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import CustomNavbar from '@/components/CustomNavbar.vue'

const postId = ref('')
const post = ref({
  author: {
    name: '小柴汪汪',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBLI_TiM-8WkRvWXF3zLl5insv5qwVJ4DP31d8Q83fyEoVhUn_p6EhyrL8P0oYHRYOG2C1EPGovSFDuRKtZEElf6Y3ekMCuXhCm6H8p7E-l9_uww9SEPQfSsuoH443tOg2AqsKTHZrtbleJrTmiyS4ihH0gnl-qs0p-HNYLLCj5ot5DckDWouuxn5prB2VnphtZOod7ht2zORDkmjR6121rLQSrVbmjT1rRu_5fuHxsf3EQVXzfFyXg3aya8R59XZAm0hfx9yP53yyg',
    time: '2小时前'
  },
  content: '今天带糯米去公园玩啦！遇到了好多小伙伴，它超级开心的~看它这个笑容就知道有多快乐了哈哈哈',
  images: [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuD-5mved-C9YPabd_2Z1nK9gnjE54qatOK78OU9Sj55xNL5KKvA6DHkoaDbLoFXozC4GxSgy_wv6ypYvJ5UU_aKxv-jUrjCkAR_GLlLA1pS9jU6ZCE-E2YKSzJOG8pP0llHFXMsQWWVZlZ6gX3-rsX9Bp9htkaYyYxk7t4YKaZU0gBS0YEoaos_PNXFQkITmKcEX-5I29ZSi6dB_SdmisJ1JGZjqT6U_7j5oyqxpll4G4CMLZsd5sw94WPfJg38S5UvR33QNyem7qM7'
  ],
  likeCount: 128,
  commentCount: 23,
  shareCount: 5,
  isLiked: false,
  isCollected: false
})

const comments = ref([
  {
    id: 1,
    author: {
      name: '布丁的麻麻',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDcROvBiAnlufyO5cfPaQY9mcv-yAsGEP9dXUnFbZGxCl42fv5RN3LQJNIpIv9sNV2ZXmOVdzfyjwT3PAt4gXu3MODPfEFH3NmiSjeO4p-fgWAWl9V_g7LhTGhMeoybvUj92PT6p7DNzlye9pTy68qY4Rg0IlMz1CAkg36HAlQcbrzpz27M4T83sUJBilrEPmqHEKZCo4-lP5AdeDiwDGXvlDwU0ZADAcUvTkXvepmkJepwdkRXWPEYpY7mRJZ9TUpDT4_XiuWFkKTU'
    },
    content: '好可爱啊！我家布丁也超喜欢去公园玩',
    time: '1小时前',
    likeCount: 12
  },
  {
    id: 2,
    author: {
      name: '养宠日记',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAANsaBJcSvFijrJYjk3WiHi-N3dPygzmsHAzlUi5KnqM9d9Raz9z8oiF-uj6S_B_ibX7n-YXkkOTr_7B7kApHP98BjswbGV8Bar6wTtOMkQtwv2F8Uc7xqj_gD1lSr-qIrYABO6-BQAWR1WQvVkzrLj5yq7tp6Y_H6GosFlhxKVNdCLewB62TnMkGI0czzfczVxJdIpyepqP_eBw4sUdVXMDrz1TEhPwuTKCqic4tm8_zQRpBFabXpw1gRLeRB4VlVUdmHSvo3AzoD'
    },
    content: '又是被治愈的一天，我家那只逆子今天刚拆了家[流泪]',
    time: '刚刚',
    likeCount: 8
  }
])

const commentInput = ref('')

onLoad((options) => {
  if (options.id) {
    postId.value = options.id
  }
})

const goBack = () => {
  uni.navigateBack()
}

const toggleLike = () => {
  post.value.isLiked = !post.value.isLiked
  post.value.likeCount += post.value.isLiked ? 1 : -1
  uni.vibrateShort({ type: 'light' })
}

const toggleCollect = () => {
  post.value.isCollected = !post.value.isCollected
  uni.showToast({
    title: post.value.isCollected ? '已收藏' : '已取消收藏',
    icon: 'success'
  })
}

const sharePost = () => {
  uni.showToast({ title: '分享功能开发中', icon: 'none' })
}

const previewImage = (index) => {
  uni.previewImage({
    urls: post.value.images,
    current: index
  })
}

const sendComment = () => {
  if (!commentInput.value.trim()) {
    return
  }

  uni.showToast({ title: '评论成功', icon: 'success' })
  commentInput.value = ''
}

const replyComment = (comment) => {
  uni.showToast({ title: '回复功能开发中', icon: 'none' })
}
</script>

<template>
  <view class="post-detail-page">
    <!-- 顶部导航栏 -->
    <CustomNavbar title="动态详情">
      <template #right>
        <view class="share-btn" @tap="sharePost">
          <text class="material-symbols-outlined">share</text>
        </view>
      </template>
    </CustomNavbar>

    <scroll-view scroll-y class="page-content">
      <!-- 动态内容 -->
      <view class="post-card">
        <view class="post-header">
          <image :src="post.author.avatar" class="author-avatar" mode="aspectFill" />
          <view class="author-info">
            <text class="author-name font-headline-md">{{ post.author.name }}</text>
            <text class="post-time font-body-md">{{ post.author.time }}</text>
          </view>
        </view>

        <text class="post-content font-body-lg">{{ post.content }}</text>

        <view v-if="post.images.length > 0" class="post-images">
          <image
            v-for="(img, index) in post.images"
            :key="index"
            :src="img"
            class="post-image"
            mode="aspectFill"
            @tap="previewImage(index)"
          />
        </view>

        <view class="post-actions">
          <view class="action-item bouncy-active" @tap="toggleLike">
            <text class="action-icon" :class="{ liked: post.isLiked }">{{ post.isLiked ? '❤️' : '🤍' }}</text>
            <text class="action-text font-body-md">{{ post.likeCount }}</text>
          </view>
          <view class="action-item">
            <text class="action-icon">💬</text>
            <text class="action-text font-body-md">{{ post.commentCount }}</text>
          </view>
          <view class="action-item bouncy-active" @tap="toggleCollect">
            <text class="action-icon">{{ post.isCollected ? '⭐' : '☆' }}</text>
            <text class="action-text font-body-md">收藏</text>
          </view>
        </view>
      </view>

      <!-- 评论区 -->
      <view class="comments-section">
        <text class="section-title font-headline-md">评论 {{ comments.length }}</text>

        <view
          v-for="comment in comments"
          :key="comment.id"
          class="comment-item"
        >
          <image :src="comment.author.avatar" class="comment-avatar" mode="aspectFill" />
          <view class="comment-content">
            <view class="comment-header">
              <text class="comment-author font-headline-md">{{ comment.author.name }}</text>
              <view class="comment-like bouncy-active">
                <text class="like-icon">🤍</text>
              </view>
            </view>
            <text class="comment-text font-body-md">{{ comment.content }}</text>
            <view class="comment-footer">
              <text class="comment-time font-label-caps">{{ comment.time }}</text>
              <text class="reply-btn font-label-caps bouncy-active" @tap="replyComment(comment)">回复</text>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 底部评论输入框 -->
    <view class="comment-input-bar">
      <view class="input-wrapper">
        <text class="input-icon">✏️</text>
        <input
          v-model="commentInput"
          class="comment-input font-body-md"
          placeholder="写下你的评论～"
          @confirm="sendComment"
        />
        <text class="emoji-icon">😊</text>
      </view>
      <view class="send-btn bouncy-active" @tap="sendComment">
        <text class="send-icon">📨</text>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.post-detail-page {
  min-height: 100vh;
  background-color: var(--surface);
  padding-bottom: calc(120rpx + env(safe-area-inset-bottom));
}

.share-btn {
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

.header-title {
  color: var(--primary);
  font-size: 40rpx;
}

/* 动态卡片 */
.post-card {
  background-color: var(--surface-container-lowest);
  border-radius: 48rpx;
  padding: 32rpx;
  margin-bottom: 32rpx;
  box-shadow: 0 8rpx 32rpx rgba(168, 155, 157, 0.12);
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

.post-content {
  color: var(--on-surface);
  line-height: 1.6;
  margin-bottom: 24rpx;
  display: block;
}

.post-images {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16rpx;
  margin-bottom: 24rpx;
}

.post-image {
  width: 100%;
  height: 200rpx;
  border-radius: 24rpx;
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

/* 评论区 */
.comments-section {
  background-color: var(--surface-container-lowest);
  border-radius: 48rpx;
  padding: 32rpx;
  box-shadow: 0 8rpx 32rpx rgba(168, 155, 157, 0.12);
}

.section-title {
  color: var(--primary);
  margin-bottom: 32rpx;
  display: block;
}

.comment-item {
  display: flex;
  gap: 24rpx;
  margin-bottom: 32rpx;

  &:last-child {
    margin-bottom: 0;
  }
}

.comment-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: var(--radius-full);
  border: 3rpx solid var(--primary-container);
}

.comment-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.comment-author {
  color: var(--on-surface);
  font-size: 28rpx;
}

.comment-like {
  display: flex;
  align-items: center;
}

.like-icon {
  font-size: 36rpx;
}

.comment-text {
  color: var(--on-surface-variant);
  line-height: 1.5;
}

.comment-footer {
  display: flex;
  align-items: center;
  gap: 32rpx;
  padding-top: 8rpx;
}

.comment-time {
  color: var(--outline);
  font-size: 20rpx;
}

.reply-btn {
  color: var(--primary);
  font-size: 24rpx;
}

/* 底部评论输入框 */
.comment-input-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(255, 248, 247, 0.9);
  backdrop-filter: blur(24rpx);
  -webkit-backdrop-filter: blur(24rpx);
  border-top: 2rpx solid rgba(210, 195, 196, 0.2);
  padding: 24rpx 32rpx;
  padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
  display: flex;
  align-items: center;
  gap: 16rpx;
  z-index: 50;
}

.input-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  background-color: var(--surface-container-high);
  border-radius: var(--radius-full);
  padding: 0 32rpx;
  height: 80rpx;
  transition: all 0.3s ease;

  &:focus-within {
    box-shadow: 0 0 0 4rpx var(--primary-container);
  }
}

.input-icon {
  font-size: 40rpx;
  margin-right: 16rpx;
  opacity: 0.6;
}

.comment-input {
  flex: 1;
  border: none;
  background: transparent;
  color: var(--on-surface);
  font-size: 28rpx;
}

.emoji-icon {
  font-size: 44rpx;
  margin-left: 16rpx;
}

.send-btn {
  width: 80rpx;
  height: 80rpx;
  border-radius: var(--radius-full);
  background-color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 24rpx rgba(113, 88, 92, 0.2);
}

.send-icon {
  font-size: 40rpx;
}
</style>
