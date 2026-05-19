<template>
  <view class="circle-container">
    <TopNavBar title="萌宠圈" :showBack="false" rightIcon="icon-add" @rightClick="goToPublish" />
    
    <view class="filter-tabs">
      <view 
        v-for="(tab, index) in tabs" 
        :key="index"
        class="tab-item"
        :class="{ active: currentTab === index }"
        @click="currentTab = index"
      >
        {{ tab.label }}
      </view>
    </view>
    
    <scroll-view scroll-y class="dynamic-list">
      <view 
        v-for="(dynamic, index) in dynamicList" 
        :key="index" 
        class="dynamic-item"
        @click="goToDetail(dynamic)"
      >
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
            :class="{ 'image-full': dynamic.images.length === 1 }"
            :style="{ background: img }"
          ></view>
        </view>
        
        <view class="dynamic-footer">
          <view class="footer-item" @click.stop="handleLike(dynamic)">
            <view class="footer-icon" :class="{ liked: dynamic.liked }">
              <view class="like-icon"></view>
            </view>
            <text class="footer-text">{{ dynamic.likes }}</text>
          </view>
          <view class="footer-item" @click.stop="handleComment(dynamic)">
            <view class="footer-icon">
              <view class="comment-icon"></view>
            </view>
            <text class="footer-text">{{ dynamic.comments }}</text>
          </view>
          <view class="footer-item" @click.stop="handleShare(dynamic)">
            <view class="footer-icon">
              <view class="share-icon"></view>
            </view>
            <text class="footer-text">分享</text>
          </view>
        </view>
      </view>
      
      <view class="load-more" @click="loadMore">
        <text class="load-text">加载更多</text>
      </view>
    </scroll-view>
    
    <TabBar :current="1" />
  </view>
</template>

<script setup lang="ts">
import TopNavBar from '@/components/common/TopNavBar.vue'
import TabBar from '@/components/common/TabBar.vue'
import { ref } from 'vue'

const currentTab = ref(0)

const tabs = [
  { label: '全部', value: 'all' },
  { label: '图文', value: 'image' },
  { label: '视频', value: 'video' },
  { label: '纯文字', value: 'text' }
]

const dynamicList = ref([
  {
    id: 1,
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
  },
  {
    id: 2,
    userName: '阿花',
    avatarColor: '#FFD4F0',
    petName: '球球',
    petColor: '#FFC1E9',
    time: '30分钟前',
    content: '球球今天学会了新技能！会握手了，好开心~',
    images: ['#FFC0CB'],
    likes: 256,
    comments: 45,
    liked: true
  },
  {
    id: 3,
    userName: '旺财',
    avatarColor: '#FFB6C1',
    petName: '二哈',
    petColor: '#E0F7FF',
    time: '1小时前',
    content: '二哈拆家日常...沙发又遭殃了 😂',
    images: ['#FFE4E1', '#FFB6C1'],
    likes: 512,
    comments: 89,
    liked: false
  },
  {
    id: 4,
    userName: '球球',
    avatarColor: '#FFC0CB',
    petName: '短腿',
    petColor: '#FFF4D2',
    time: '2小时前',
    content: '柯基短腿跑起来真的太可爱了！',
    images: [],
    likes: 89,
    comments: 12,
    liked: false
  },
  {
    id: 5,
    userName: '豆豆',
    avatarColor: '#FFE4E1',
    petName: '小白',
    petColor: '#FFFFFF',
    time: '3小时前',
    content: '萨摩耶的微笑真的太治愈了！',
    images: ['#FFC1E9', '#FFD4F0', '#FFB6C1', '#FFC0CB'],
    likes: 756,
    comments: 134,
    liked: false
  }
])

const goToPublish = () => {
  uni.navigateTo({
    url: '/pages/circle/publish'
  })
}

const goToDetail = (dynamic: any) => {
  uni.navigateTo({
    url: `/pages/circle/detail?id=${dynamic.id}`
  })
}

const handleLike = (dynamic: any) => {
  dynamic.liked = !dynamic.liked
  dynamic.likes += dynamic.liked ? 1 : -1
}

const handleComment = (dynamic: any) => {
  uni.navigateTo({
    url: `/pages/circle/detail?id=${dynamic.id}`
  })
}

const handleShare = () => {
  uni.showShareMenu({
    withShareTicket: true
  })
}

const loadMore = () => {
  uni.showToast({
    title: '加载中...',
    icon: 'loading'
  })
}
</script>

<style lang="scss" scoped>
.circle-container {
  min-height: 100vh;
  background: #FFF9F9;
}

.filter-tabs {
  display: flex;
  padding: 24rpx 32rpx;
  gap: 32rpx;
  padding-top: calc(var(--status-bar-height, 44px) + 120rpx);
}

.tab-item {
  font-size: 28rpx;
  color: #999999;
  position: relative;
  
  &.active {
    color: #FFC1E9;
    font-weight: 600;
    
    &::after {
      content: '';
      position: absolute;
      bottom: -8rpx;
      left: 50%;
      transform: translateX(-50%);
      width: 40rpx;
      height: 6rpx;
      background: #FFC1E9;
      border-radius: 3rpx;
    }
  }
}

.dynamic-list {
  padding: 0 32rpx;
  padding-bottom: calc(112rpx + constant(safe-area-inset-bottom));
  height: calc(100vh - var(--status-bar-height, 44px) - 240rpx);
}

.dynamic-item {
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
  
  &.image-full {
    width: 100%;
    height: 400rpx;
  }
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

.load-more {
  padding: 32rpx;
  text-align: center;
}

.load-text {
  font-size: 26rpx;
  color: #FFC1E9;
}
</style>
