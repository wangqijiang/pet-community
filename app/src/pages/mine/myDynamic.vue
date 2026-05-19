<template>
  <view class="my-dynamic-page">
    <TopNavBar title="我的动态" />

    <view class="page-content">
      <scroll-view
        class="content-scroll"
        scroll-y
        @scrolltolower="loadMore"
        refresher-enabled
        @refresherrefresh="onRefresh"
      >
        <!-- 个人资料迷你卡片 -->
        <view class="profile-mini-card">
          <view class="profile-left">
            <view class="avatar-wrapper">
              <image
                class="avatar"
                src="/static/images/avatar-default.png"
                mode="aspectFill"
              ></image>
              <view class="edit-badge">
                <view class="edit-icon"></view>
              </view>
            </view>
            <view class="profile-info">
              <text class="profile-name">豆豆爸爸</text>
              <text class="profile-desc">记录豆豆的成长每一刻 🐾</text>
            </view>
          </view>
        </view>

        <!-- 动态列表 -->
        <view class="dynamic-list">
          <view
            v-for="item in dynamicList"
            :key="item.id"
            class="dynamic-card"
            @tap="goToDetail(item.id)"
          >
            <view class="card-header">
              <view class="author-info">
                <image class="author-avatar" :src="item.avatar" mode="aspectFill"></image>
                <view class="author-text">
                  <text class="author-name">{{ item.author }}</text>
                  <text class="post-time">{{ item.time }}</text>
                </view>
              </view>
              <view class="more-btn" @tap.stop="showMoreActions(item)">
                <view class="more-icon"></view>
              </view>
            </view>

            <text class="post-content">{{ item.content }}</text>

            <view v-if="item.images && item.images.length > 0" class="post-images">
              <image
                v-for="(img, index) in item.images"
                :key="index"
                class="post-image"
                :class="{ 'single': item.images.length === 1 }"
                :src="img"
                mode="aspectFill"
              ></image>
            </view>

            <view class="card-footer">
              <view class="stat-item" @tap.stop="handleLike(item)">
                <view class="stat-icon" :class="{ 'liked': item.isLiked }"></view>
                <text class="stat-text">{{ item.likeCount }}</text>
              </view>
              <view class="stat-item">
                <view class="stat-icon comment"></view>
                <text class="stat-text">{{ item.commentCount }}</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 底部提示 -->
        <view class="bottom-hint">
          <text class="hint-text">到底啦，去发现更多可爱的TA吧</text>
        </view>
      </scroll-view>
    </view>

    <TabBar :current="3" />
    <Loading :visible="loading" />
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import TopNavBar from '@/components/common/TopNavBar.vue'
import TabBar from '@/components/common/TabBar.vue'
import Loading from '@/components/common/Loading.vue'

const loading = ref(false)

const dynamicList = ref([
  {
    id: 1,
    author: '豆豆爸爸',
    avatar: '/static/images/avatar-default.png',
    time: '2小时前',
    content: '今天带豆豆去公园玩了，它看到蝴蝶的时候简直开心疯了！满草坪乱跑，真是个治愈系小天使呀~ ☀️🌸',
    images: [
      '/static/images/post-default.png',
      '/static/images/post-default.png',
      '/static/images/post-default.png'
    ],
    likeCount: 128,
    commentCount: 24,
    isLiked: false
  },
  {
    id: 2,
    author: '豆豆爸爸',
    avatar: '/static/images/avatar-default.png',
    time: '昨天 18:30',
    content: '午后的小憩时光，它睡得像个小猪哼唧哼唧的。安静的日子，真好。💤',
    images: [
      '/static/images/post-default.png'
    ],
    likeCount: 85,
    commentCount: 12,
    isLiked: true
  }
])

onMounted(() => {
  loadDynamicList()
})

const loadDynamicList = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 1000)
}

const onRefresh = () => {
  loadDynamicList()
}

const loadMore = () => {
  console.log('Load more')
}

const goToDetail = (id) => {
  uni.navigateTo({
    url: `/pages/circle/detail?id=${id}`
  })
}

const handleLike = (item) => {
  item.isLiked = !item.isLiked
  item.likeCount += item.isLiked ? 1 : -1
  uni.vibrateShort({ type: 'light' })
}

const showMoreActions = (item) => {
  uni.vibrateShort({ type: 'light' })
  uni.showActionSheet({
    itemList: ['删除'],
    success: (res) => {
      if (res.tapIndex === 0) {
        handleDelete(item)
      }
    }
  })
}

const handleDelete = (item) => {
  uni.showModal({
    title: '提示',
    content: '确定要删除这条动态吗？',
    success: (res) => {
      if (res.confirm) {
        const index = dynamicList.value.findIndex(d => d.id === item.id)
        if (index > -1) {
          dynamicList.value.splice(index, 1)
        }
        uni.showToast({
          title: '删除成功',
          icon: 'success'
        })
      }
    }
  })
}
</script>

<style lang="scss" scoped>
.my-dynamic-page {
  width: 100%;
  min-height: 100vh;
  background: #fff8f7;
}

.page-content {
  padding-bottom: calc(152rpx + env(safe-area-inset-bottom));
}

.content-scroll {
  width: 100%;
  box-sizing: border-box;
  height: calc(100vh - 200rpx);
  padding: 0 40rpx;
  padding-top: 16rpx;
}

/* 个人资料迷你卡片 */
.profile-mini-card {
  background: #ffffff;
  border-radius: 48rpx;
  padding: 32rpx;
  margin-bottom: 32rpx;
  box-shadow: 0 8rpx 32rpx rgba(168, 155, 157, 0.12);
  border: 2rpx solid rgba(255, 221, 226, 0.3);
}

.profile-left {
  display: flex;
  align-items: center;
  gap: 32rpx;
}

.avatar-wrapper {
  position: relative;
}

.avatar {
  width: 128rpx;
  height: 128rpx;
  border-radius: 50%;
  border: 4rpx solid #ffdde2;
}

.edit-badge {
  position: absolute;
  right: -8rpx;
  bottom: -8rpx;
  width: 40rpx;
  height: 40rpx;
  background: #71585c;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4rpx solid #ffffff;
}

.edit-icon {
  width: 24rpx;
  height: 24rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z'/%3E%3C/svg%3E") no-repeat center;
  background-size: 100%;
}

.profile-info {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.profile-name {
  font-size: 36rpx;
  font-weight: 600;
  color: #71585c;
}

.profile-desc {
  font-size: 26rpx;
  color: #4f4446;
  opacity: 0.7;
}

/* 动态列表 */
.dynamic-list {
  display: flex;
  flex-direction: column;
  gap: 32rpx;
}

.dynamic-card {
  background: #ffffff;
  border-radius: 48rpx;
  padding: 32rpx;
  box-shadow: 0 8rpx 32rpx rgba(168, 155, 157, 0.12);
  border: 2rpx solid rgba(255, 221, 226, 0.3);
  transition: transform 0.2s ease;

  &:active {
    transform: scale(0.98);
  }
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24rpx;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 24rpx;
}

.author-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
}

.author-text {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.author-name {
  font-size: 32rpx;
  font-weight: 600;
  color: #1e1b1b;
}

.post-time {
  font-size: 22rpx;
  color: #4f4446;
  opacity: 0.6;
}

.more-btn {
  width: 56rpx;
  height: 56rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.more-icon {
  width: 40rpx;
  height: 40rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%234f4446'%3E%3Cpath d='M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z'/%3E%3C/svg%3E") no-repeat center;
  background-size: 100%;
  opacity: 0.5;
}

.post-content {
  font-size: 32rpx;
  color: #1e1b1b;
  line-height: 1.7;
  margin-bottom: 24rpx;
}

.post-images {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  margin-bottom: 24rpx;
}

.post-image {
  width: calc((100% - 32rpx) / 3);
  height: 220rpx;
  border-radius: 24rpx;

  &.single {
    width: 100%;
    height: 420rpx;
  }
}

.card-footer {
  display: flex;
  align-items: center;
  gap: 48rpx;
  padding-top: 20rpx;
  border-top: 2rpx solid rgba(210, 195, 196, 0.2);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 12rpx;
  transition: transform 0.2s ease;

  &:active {
    transform: scale(0.95);
  }
}

.stat-icon {
  width: 40rpx;
  height: 40rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2371585c'%3E%3Cpath d='M12 2l-2.5 5-5 .7 3.7 3.6-.9 5.1 4.7-2.5 4.7 2.5-.9-5.1 3.7-3.6-5-.7L12 2z'/%3E%3C/svg%3E") no-repeat center;
  background-size: 100%;

  &.liked {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23FF6B8A'%3E%3Cpath d='M12 2l-2.5 5-5 .7 3.7 3.6-.9 5.1 4.7-2.5 4.7 2.5-.9-5.1 3.7-3.6-5-.7L12 2z'/%3E%3C/svg%3E") no-repeat center;
    background-size: 100%;
  }

  &.comment {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23807476'%3E%3Cpath d='M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2z'/%3E%3C/svg%3E") no-repeat center;
    background-size: 100%;
    opacity: 0.6;
  }
}

.stat-text {
  font-size: 24rpx;
  font-weight: 700;
  color: #71585c;
  letter-spacing: 0.05em;
}

.bottom-hint {
  padding: 48rpx 0;
  text-align: center;
}

.hint-text {
  font-size: 24rpx;
  color: #4f4446;
  opacity: 0.4;
}
</style>