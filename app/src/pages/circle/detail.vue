<template>
  <view class="detail-container">
    <TopNavBar title="动态详情" />
    
    <scroll-view scroll-y class="detail-content">
      <view class="dynamic-detail">
        <view class="dynamic-header">
          <view class="user-avatar">
            <view class="avatar-bg" :style="{ background: dynamic.avatarColor }"></view>
          </view>
          <view class="user-info">
            <text class="user-name">{{ dynamic.userName }}</text>
            <text class="dynamic-time">{{ dynamic.time }}</text>
          </view>
          <view class="user-pet">
            <view class="pet-avatar" :style="{ background: dynamic.petColor }"></view>
            <text class="pet-name">{{ dynamic.petName }}</text>
          </view>
        </view>
        
        <text class="dynamic-content">{{ dynamic.content }}</text>
        
        <view class="dynamic-images" v-if="dynamic.images.length > 0">
          <view 
            v-for="(img, imgIndex) in dynamic.images" 
            :key="imgIndex" 
            class="dynamic-image"
            :style="{ background: img }"
            @click="previewImage(imgIndex)"
          ></view>
        </view>
        
        <view class="dynamic-footer">
          <view class="footer-item" @click="handleLike">
            <view class="footer-icon" :class="{ liked: dynamic.liked }">
              <view class="like-icon"></view>
            </view>
            <text class="footer-text">{{ dynamic.likes }}</text>
          </view>
          <view class="footer-item">
            <view class="footer-icon">
              <view class="comment-icon"></view>
            </view>
            <text class="footer-text">{{ dynamic.comments }}</text>
          </view>
          <view class="footer-item" @click="handleShare">
            <view class="footer-icon">
              <view class="share-icon"></view>
            </view>
            <text class="footer-text">分享</text>
          </view>
        </view>
      </view>
      
      <view class="comment-section">
        <text class="section-title">评论 ({{ comments.length }})</text>
        
        <view class="comment-list">
          <view 
            v-for="(comment, index) in comments" 
            :key="index" 
            class="comment-item"
          >
            <view class="comment-avatar">
              <view class="avatar-bg" :style="{ background: comment.avatarColor }"></view>
            </view>
            <view class="comment-content">
              <view class="comment-header">
                <text class="comment-name">{{ comment.userName }}</text>
                <text class="comment-time">{{ comment.time }}</text>
              </view>
              <text class="comment-text">{{ comment.content }}</text>
              <view class="comment-actions">
                <view class="action-item" @click="handleReply(comment)">
                  <text class="action-text">回复</text>
                </view>
                <view class="action-item" @click="handleCommentLike(comment)">
                  <view class="action-icon" :class="{ liked: comment.liked }"></view>
                  <text class="action-text">{{ comment.likes }}</text>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
    
    <view class="input-bar">
      <input 
        v-model="inputText"
        class="input-field"
        placeholder="发表评论..."
        placeholder-class="input-placeholder"
      />
      <view class="send-btn" @click="sendComment">
        <text class="send-text">发送</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import TopNavBar from '@/components/common/TopNavBar.vue'
import { ref, reactive } from 'vue'

const inputText = ref('')

const dynamic = reactive({
  userName: '小明',
  avatarColor: '#FFC1E9',
  petName: '旺财',
  petColor: '#FFD4F0',
  time: '10分钟前',
  content: '今天带旺财去公园玩，它玩得特别开心！看到了好多小伙伴，还交到了新朋友~ 🐕',
  images: ['#FFC1E9', '#FFD4F0', '#FFB6C1'],
  likes: 128,
  comments: 23,
  liked: false
})

const comments = ref([
  { userName: '阿花', avatarColor: '#FFD4F0', time: '5分钟前', content: '好可爱！', likes: 5, liked: false },
  { userName: '旺财', avatarColor: '#FFB6C1', time: '3分钟前', content: '旺财好活泼呀', likes: 3, liked: true },
  { userName: '球球', avatarColor: '#FFC0CB', time: '1分钟前', content: '下次一起遛狗呀~', likes: 0, liked: false }
])

const handleLike = () => {
  dynamic.liked = !dynamic.liked
  dynamic.likes += dynamic.liked ? 1 : -1
}

const handleShare = () => {
  uni.showShareMenu({
    withShareTicket: true
  })
}

const previewImage = (index: number) => {
  uni.previewImage({
    urls: dynamic.images,
    current: index
  })
}

const handleReply = (comment: any) => {
  uni.showToast({
    title: `回复 ${comment.userName}`,
    icon: 'none'
  })
}

const handleCommentLike = (comment: any) => {
  comment.liked = !comment.liked
  comment.likes += comment.liked ? 1 : -1
}

const sendComment = () => {
  if (!inputText.value.trim()) {
    uni.showToast({
      title: '请输入评论内容',
      icon: 'none'
    })
    return
  }
  
  comments.value.push({
    userName: '我',
    avatarColor: '#FFC1E9',
    time: '刚刚',
    content: inputText.value,
    likes: 0,
    liked: false
  })
  
  inputText.value = ''
  dynamic.comments++
}
</script>

<style lang="scss" scoped>
.detail-container {
  min-height: 100vh;
  background: #FFF9F9;
  padding-bottom: 120rpx;
}

.detail-content {
  padding: 24rpx 32rpx;
  padding-top: calc(var(--status-bar-height, 44px) + 120rpx);
  height: calc(100vh - var(--status-bar-height, 44px) - 120rpx);
}

.dynamic-detail {
  background: #FFFFFF;
  border-radius: 24rpx;
  padding: 24rpx;
  margin-bottom: 24rpx;
  border: 2rpx solid #FFC1E9;
}

.dynamic-header {
  display: flex;
  align-items: center;
  margin-bottom: 16rpx;
}

.user-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  padding: 4rpx;
  background: #FFC1E9;
  margin-right: 16rpx;
}

.avatar-bg {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.user-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.user-name {
  font-size: 28rpx;
  font-weight: 600;
  color: #333333;
}

.dynamic-time {
  font-size: 22rpx;
  color: #999999;
}

.user-pet {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.pet-avatar {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
}

.pet-name {
  font-size: 22rpx;
  color: #FFC1E9;
}

.dynamic-content {
  font-size: 28rpx;
  color: #333333;
  line-height: 1.6;
  margin-bottom: 16rpx;
}

.dynamic-images {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
  margin-bottom: 16rpx;
}

.dynamic-image {
  width: calc(33.33% - 8rpx);
  height: 200rpx;
  border-radius: 16rpx;
}

.dynamic-footer {
  display: flex;
  justify-content: space-around;
  padding-top: 16rpx;
  border-top: 1rpx solid #E5E5E5;
}

.footer-item {
  display: flex;
  align-items: center;
  gap: 8rpx;
  
  &:active {
    opacity: 0.7;
  }
}

.footer-icon {
  width: 40rpx;
  height: 40rpx;
  
  &.liked {
    .like-icon {
      background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23FF6B6B'%3E%3Cpath d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/%3E%3C/svg%3E") no-repeat center;
      background-size: 100%;
    }
  }
}

.like-icon {
  width: 100%;
  height: 100%;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23FFC1E9'%3E%3Cpath d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/%3E%3C/svg%3E") no-repeat center;
  background-size: 100%;
}

.comment-icon {
  width: 100%;
  height: 100%;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23FFC1E9'%3E%3Cpath d='M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2z'/%3E%3C/svg%3E") no-repeat center;
  background-size: 100%;
}

.share-icon {
  width: 100%;
  height: 100%;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23FFC1E9'%3E%3Cpath d='M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z'/%3E%3C/svg%3E") no-repeat center;
  background-size: 100%;
}

.footer-text {
  font-size: 24rpx;
  color: #999999;
}

.comment-section {
  background: #FFFFFF;
  border-radius: 24rpx;
  padding: 24rpx;
  border: 2rpx solid #FFC1E9;
}

.section-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #FFC1E9;
  margin-bottom: 20rpx;
  display: block;
}

.comment-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.comment-item {
  display: flex;
  gap: 16rpx;
}

.comment-avatar {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  padding: 4rpx;
  background: #FFC1E9;
}

.comment-content {
  flex: 1;
}

.comment-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8rpx;
}

.comment-name {
  font-size: 26rpx;
  font-weight: 600;
  color: #333333;
}

.comment-time {
  font-size: 22rpx;
  color: #999999;
}

.comment-text {
  font-size: 26rpx;
  color: #666666;
  line-height: 1.5;
  margin-bottom: 12rpx;
}

.comment-actions {
  display: flex;
  gap: 24rpx;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 8rpx;
  
  &:active {
    opacity: 0.7;
  }
}

.action-icon {
  width: 28rpx;
  height: 28rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23FFC1E9'%3E%3Cpath d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/%3E%3C/svg%3E") no-repeat center;
  background-size: 100%;
  
  &.liked {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23FF6B6B'%3E%3Cpath d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/%3E%3C/svg%3E") no-repeat center;
    background-size: 100%;
  }
}

.action-text {
  font-size: 22rpx;
  color: #999999;
}

.input-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 16rpx 32rpx;
  padding-bottom: calc(16rpx + constant(safe-area-inset-bottom));
  background: #FFFFFF;
  border-top: 2rpx solid #FFC1E9;
}

.input-field {
  flex: 1;
  height: 72rpx;
  background: #FFF9F9;
  border-radius: 36rpx;
  padding: 0 24rpx;
  font-size: 26rpx;
}

.input-placeholder {
  color: #999999;
}

.send-btn {
  padding: 16rpx 32rpx;
  background: #FFC1E9;
  border-radius: 36rpx;
  
  &:active {
    transform: scale(0.98);
  }
}

.send-text {
  font-size: 26rpx;
  color: #FFFFFF;
  font-weight: 600;
}
</style>
