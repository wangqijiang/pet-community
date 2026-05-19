<template>
  <view class="circle-container">
    <TopNavBar title="萌宠朋友圈" :showBack="false" rightIcon="icon-bell" />
    
    <view class="category-tabs">
      <scroll-view scroll-x class="tab-scroll">
        <view class="tab-list">
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
      </scroll-view>
    </view>
    
    <scroll-view scroll-y class="feed-list">
      <view 
        v-for="(item, index) in feedList" 
        :key="index" 
        class="feed-card"
        @click="goToDetail(item)"
      >
        <view class="card-header">
          <view class="user-avatar">
            <view class="avatar-bg" :style="{ background: item.avatarColor }"></view>
          </view>
          <view class="user-info">
            <text class="user-name">{{ item.userName }}</text>
            <view class="user-tags">
              <text class="tag">{{ item.userTag }}</text>
            </view>
          </view>
          <view class="more-btn">
            <view class="more-icon"></view>
          </view>
        </view>
        
        <text class="card-content">{{ item.content }}</text>
        
        <view class="card-images" v-if="item.images.length > 0">
          <view 
            v-for="(img, imgIndex) in item.images" 
            :key="imgIndex" 
            class="image-item"
            :style="{ background: img.color }"
          ></view>
        </view>
        
        <view class="card-footer">
          <view class="footer-left">
            <view class="footer-item" @click.stop="handleLike(item)">
              <view class="footer-icon" :class="{ liked: item.liked }">
                <view class="like-icon"></view>
              </view>
              <text class="footer-count">{{ item.likes }}</text>
            </view>
            <view class="footer-item">
              <view class="footer-icon">
                <view class="comment-icon"></view>
              </view>
              <text class="footer-count">{{ item.comments }}</text>
            </view>
          </view>
          <view class="footer-item" @click.stop="handleShare">
            <view class="share-icon"></view>
          </view>
        </view>
      </view>
    </scroll-view>
    
    <view class="fab" @click="goToPublish">
      <view class="fab-icon"></view>
    </view>
    
    <TabBar :current="1" />
  </view>
</template>

<script setup lang="ts">
import TopNavBar from '@/components/common/TopNavBar.vue'
import TabBar from '@/components/common/TabBar.vue'
import { ref } from 'vue'

const currentTab = ref(0)

const tabs = [
  { label: '全部动态' },
  { label: '日常萌照' },
  { label: '训练日常' },
  { label: '寻狗求助' }
]

const feedList = ref([
  {
    id: 1,
    userName: '布丁麻麻',
    avatarColor: '#FFC1E9',
    userTag: '柯基 · 2岁',
    content: '今天带布丁去公园草坪打滚啦！阳光超级好，它开心得像个200斤的孩子哈哈。这就是简单的幸福吧～✨',
    images: [
      { color: '#FFE4E1' },
      { color: '#FFD4F0' },
      { color: '#FFC1E9' },
      { color: '#FFB6C1' }
    ],
    likes: 128,
    comments: 32,
    liked: false
  },
  {
    id: 2,
    userName: '喵星人领养中心',
    avatarColor: '#E8F5E9',
    userTag: '志愿者',
    content: '新来的小橘太粘人啦！一进门就开始蹭腿，求一个有缘的家庭带它回家～ 坐标上海。🍊',
    images: [
      { color: '#FFF4D2' }
    ],
    likes: 456,
    comments: 89,
    liked: true
  }
])

const goToPublish = () => {
  uni.navigateTo({
    url: '/pages/circle/publish'
  })
}

const handleLike = (item: any) => {
  item.liked = !item.liked
  item.likes += item.liked ? 1 : -1
}

const handleShare = () => {
  uni.showShareMenu({
    withShareTicket: true
  })
}
</script>

<style lang="scss" scoped>
.circle-container {
  min-height: 100vh;
  background: #FFF8F7;
}

.category-tabs {
  padding: 0 32rpx;
  padding-top: calc(var(--status-bar-height, 44px) + 120rpx);
}

.tab-scroll {
  white-space: nowrap;
}

.tab-list {
  display: inline-flex;
  gap: 16rpx;
}

.tab-item {
  flex-shrink: 0;
  padding: 16rpx 32rpx;
  background: #FFFFFF;
  border: 2rpx solid #E1F5FE;
  border-radius: 32rpx;
  font-size: 26rpx;
  color: #4A90E2;
  transition: all 0.3s;
  box-shadow: 0 4rpx 12rpx rgba(168, 155, 157, 0.08);
  
  &.active {
    background: #FFDDE2;
    color: #71585C;
    border-color: #FFC1E9;
  }
}

.feed-list {
  padding: 32rpx;
  padding-bottom: calc(140rpx + constant(safe-area-inset-bottom));
  height: calc(100vh - var(--status-bar-height, 44px) - 300rpx);
  box-sizing: border-box;
}

.feed-card {
  background: #FFFFFF;
  border-radius: 24rpx;
  padding: 32rpx;
  margin-bottom: 32rpx;
  border: 1rpx solid rgba(255, 221, 226, 0.4);
  box-shadow: 0 8rpx 24rpx rgba(168, 155, 157, 0.08);
  transition: transform 0.3s;
  
  &:active {
    transform: scale(0.98);
  }
}

.card-header {
  display: flex;
  align-items: flex-start;
  margin-bottom: 24rpx;
}

.user-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  padding: 4rpx;
  border: 4rpx solid #FFDDE2;
  margin-right: 20rpx;
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
  gap: 8rpx;
}

.user-name {
  font-size: 28rpx;
  font-weight: 600;
  color: #1E1B1B;
}

.user-tags {
  display: flex;
  gap: 8rpx;
}

.tag {
  padding: 6rpx 16rpx;
  background: rgba(234, 223, 189, 0.3);
  color: #6A6347;
  font-size: 20rpx;
  font-weight: 600;
  border-radius: 16rpx;
}

.more-btn {
  padding: 8rpx;
}

.more-icon {
  width: 36rpx;
  height: 36rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23807476'%3E%3Cpath d='M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z'/%3E%3C/svg%3E") no-repeat center;
  background-size: 100%;
}

.card-content {
  font-size: 28rpx;
  color: #4F4446;
  line-height: 1.6;
  margin-bottom: 24rpx;
}

.card-images {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16rpx;
  margin-bottom: 24rpx;
}

.image-item {
  aspect-ratio: 1;
  border-radius: 16rpx;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 24rpx;
  border-top: 1rpx solid #F3ECEC;
}

.footer-left {
  display: flex;
  gap: 32rpx;
}

.footer-item {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.footer-icon {
  width: 36rpx;
  height: 36rpx;
  
  &.liked {
    .like-icon {
      background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2371585C'%3E%3Cpath d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/%3E%3C/svg%3E") no-repeat center;
      background-size: 100%;
    }
  }
}

.like-icon {
  width: 100%;
  height: 100%;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23807476'%3E%3Cpath d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/%3E%3C/svg%3E") no-repeat center;
  background-size: 100%;
}

.comment-icon {
  width: 100%;
  height: 100%;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23807476'%3E%3Cpath d='M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2z'/%3E%3C/svg%3E") no-repeat center;
  background-size: 100%;
}

.share-icon {
  width: 36rpx;
  height: 36rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23807476'%3E%3Cpath d='M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z'/%3E%3C/svg%3E") no-repeat center;
  background-size: 100%;
}

.footer-count {
  font-size: 22rpx;
  font-weight: 600;
  color: #807476;
}

.fab {
  position: fixed;
  bottom: 160rpx;
  right: 32rpx;
  width: 100rpx;
  height: 100rpx;
  background: #EDE2C0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 24rpx rgba(234, 223, 189, 0.5);
  z-index: 40;
  
  &:active {
    transform: scale(0.9);
  }
}

.fab-icon {
  width: 48rpx;
  height: 48rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23201B06'%3E%3Cpath d='M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z'/%3E%3C/svg%3E") no-repeat center;
  background-size: 100%;
}
</style>
