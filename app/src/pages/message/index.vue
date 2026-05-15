<template>
  <view class="message-page">
    <TopNavBar title="消息" :show-back="false" />

    <view class="page-content">
      <!-- Tab切换 -->
      <view class="message-tabs">
        <view
          v-for="tab in tabs"
          :key="tab.value"
          class="tab-item"
          :class="{ 'active': currentTab === tab.value }"
          @tap="switchTab(tab.value)"
        >
          <text class="tab-text">{{ tab.label }}</text>
          <view v-if="tab.badge > 0" class="tab-badge">
            <text class="badge-text">{{ tab.badge > 99 ? '99+' : tab.badge }}</text>
          </view>
        </view>
      </view>

      <!-- 私信列表 -->
      <scroll-view
        v-if="currentTab === 'chat'"
        class="message-list"
        scroll-y
        refresher-enabled
        @refresherrefresh="onRefresh"
      >
        <view
          v-for="chat in chatList"
          :key="chat.id"
          class="message-item"
          @tap="goToChat(chat.id)"
        >
          <image class="message-avatar" :src="chat.avatar" mode="aspectFill"></image>
          <view class="message-content">
            <view class="content-header">
              <text class="user-name">{{ chat.nickname }}</text>
              <text class="message-time">{{ chat.time }}</text>
            </view>
            <text class="message-text">{{ chat.lastMessage }}</text>
          </view>
          <view v-if="chat.unreadCount > 0" class="unread-badge">
            <text class="badge-text">{{ chat.unreadCount > 99 ? '99+' : chat.unreadCount }}</text>
          </view>
        </view>

        <Empty v-if="chatList.length === 0 && !loading" type="noData" text="暂无私信" />
      </scroll-view>

      <!-- 系统通知列表 -->
      <scroll-view
        v-if="currentTab === 'system'"
        class="message-list"
        scroll-y
        refresher-enabled
        @refresherrefresh="onRefresh"
      >
        <view
          v-for="notice in noticeList"
          :key="notice.id"
          class="message-item"
          @tap="goToSystemDetail(notice.id)"
        >
          <view class="notice-icon-wrapper">
            <image class="notice-icon" :src="notice.icon" mode="aspectFit"></image>
          </view>
          <view class="message-content">
            <view class="content-header">
              <text class="notice-title">{{ notice.title }}</text>
              <text class="message-time">{{ notice.time }}</text>
            </view>
            <text class="message-text">{{ notice.summary }}</text>
          </view>
          <view v-if="!notice.isRead" class="unread-dot"></view>
        </view>

        <Empty v-if="noticeList.length === 0 && !loading" type="noData" text="暂无通知" />
      </scroll-view>
    </view>

    <TabBar :current="2" />
    <Loading :visible="loading" />
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import TopNavBar from '@/components/common/TopNavBar.vue'
import TabBar from '@/components/common/TabBar.vue'
import Empty from '@/components/common/Empty.vue'
import Loading from '@/components/common/Loading.vue'

const loading = ref(false)
const currentTab = ref('chat')

const tabs = ref([
  { label: '私信', value: 'chat', badge: 3 },
  { label: '系统通知', value: 'system', badge: 5 }
])

const chatList = ref([
  {
    id: 1,
    avatar: '/static/images/avatar-default.png',
    nickname: '铲屎官小王',
    lastMessage: '今天有空一起遛狗吗？',
    time: '10:30',
    unreadCount: 2
  },
  {
    id: 2,
    avatar: '/static/images/avatar-default.png',
    nickname: '爱狗人士',
    lastMessage: '你家狗狗好可爱！',
    time: '昨天',
    unreadCount: 1
  },
  {
    id: 3,
    avatar: '/static/images/avatar-default.png',
    nickname: '宠物达人',
    lastMessage: '谢谢分享！',
    time: '2天前',
    unreadCount: 0
  }
])

const noticeList = ref([
  {
    id: 1,
    icon: '/static/images/icon-like-filled.png',
    title: '点赞通知',
    summary: '铲屎官小王 赞了你的动态',
    time: '1小时前',
    isRead: false
  },
  {
    id: 2,
    icon: '/static/images/icon-comment.png',
    title: '评论通知',
    summary: '爱狗人士 评论了你的动态：好可爱的狗狗！',
    time: '2小时前',
    isRead: false
  },
  {
    id: 3,
    icon: '/static/images/icon-follow.png',
    title: '关注通知',
    summary: '宠物达人 关注了你',
    time: '3小时前',
    isRead: true
  }
])

onMounted(() => {
  loadMessageList()
})

const loadMessageList = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 1000)
}

const onRefresh = () => {
  loadMessageList()
}

const switchTab = (tab) => {
  currentTab.value = tab
  uni.vibrateShort({ type: 'light' })
}

const goToChat = (chatId) => {
  uni.vibrateShort({ type: 'light' })
  uni.navigateTo({
    url: `/pages/message/chat?id=${chatId}`
  })
}

const goToSystemDetail = (noticeId) => {
  uni.vibrateShort({ type: 'light' })
  uni.navigateTo({
    url: `/pages/message/systemDetail?id=${noticeId}`
  })
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.message-page {
  width: 100%;
  min-height: 100vh;
  background: $color-bg-primary;
}

.page-content {
  padding-top: $nav-bar-height;
  padding-bottom: $tab-bar-height;
}

.message-tabs {
  display: flex;
  background: $color-bg-white;
  padding: $spacing-component $spacing-page-horizontal;
  gap: $spacing-component;

  .tab-item {
    flex: 1;
    height: 72rpx;
    border-radius: $border-radius-base;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    transition: all $transition-base ease;

    &.active {
      background: linear-gradient(135deg, $color-primary 0%, #FFD4F0 100%);
      box-shadow: $shadow-pink;

      .tab-text {
        color: $color-bg-white;
        font-weight: $font-weight-bold;
      }
    }

    .tab-text {
      font-size: $font-size-button;
      color: $color-gray-medium;
    }

    .tab-badge {
      position: absolute;
      top: -8rpx;
      right: -8rpx;
      min-width: 32rpx;
      height: 32rpx;
      padding: 0 8rpx;
      background: #FF4D4F;
      border-radius: 16rpx;
      display: flex;
      align-items: center;
      justify-content: center;

      .badge-text {
        font-size: 20rpx;
        color: $color-bg-white;
        transform: scale(0.9);
      }
    }
  }
}

.message-list {
  height: calc(100vh - #{$nav-bar-height} - #{$tab-bar-height} - 120rpx);
  padding: $spacing-component $spacing-page-horizontal;
}

.message-item {
  background: $color-bg-white;
  border-radius: $border-radius-base;
  padding: $spacing-component;
  margin-bottom: $spacing-component;
  display: flex;
  align-items: center;
  gap: $spacing-component;
  box-shadow: $shadow-light;
  transition: transform $transition-base ease;
  position: relative;

  &:active {
    transform: scale($scale-press);
  }

  .message-avatar {
    width: $avatar-size-medium;
    height: $avatar-size-medium;
    border-radius: $border-radius-circle;
    flex-shrink: 0;
  }

  .notice-icon-wrapper {
    width: $avatar-size-medium;
    height: $avatar-size-medium;
    background: linear-gradient(135deg, $color-primary 0%, #FFD4F0 100%);
    border-radius: $border-radius-circle;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    .notice-icon {
      width: 40rpx;
      height: 40rpx;
    }
  }

  .message-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8rpx;
    overflow: hidden;

    .content-header {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .user-name,
      .notice-title {
        font-size: $font-size-button;
        font-weight: $font-weight-bold;
        color: $color-gray-dark;
      }

      .message-time {
        font-size: $font-size-helper;
        color: $color-gray-lighter;
        flex-shrink: 0;
      }
    }

    .message-text {
      font-size: $font-size-body;
      color: $color-gray-medium;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .unread-badge {
    min-width: 36rpx;
    height: 36rpx;
    padding: 0 8rpx;
    background: #FF4D4F;
    border-radius: 18rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    .badge-text {
      font-size: 22rpx;
      color: $color-bg-white;
      font-weight: $font-weight-bold;
    }
  }

  .unread-dot {
    width: 16rpx;
    height: 16rpx;
    background: #FF4D4F;
    border-radius: 8rpx;
    flex-shrink: 0;
  }
}
</style>
