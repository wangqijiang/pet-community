<script setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import CustomNavbar from '@/components/CustomNavbar.vue'
import CustomTabbar from '@/components/CustomTabbar.vue'

onShow(() => {
  if (typeof uni.$emit === 'function') {
    uni.$emit('updateTabBar', 2)
  }
})

const currentTab = ref(0)

// 私信列表
const privateMessages = ref([
  {
    id: 1,
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBwTHOqkyb3EzuPT_LjPOJCE1Qn_dolHGgbc25vn2fcaixQr9qOeZlgyv3bxGJuVjL3VuBdLmCjLEQ0Q0aNHYDANdV8bGXdnUewsvKPOOUceH4v6f7tPKaHdnP8WMho2jMlkoZ19Ru3pBPPXfdeIRjl5EMURO3Q7OFZfYX3CMfAjHNpjwm5oyZtejLZQtj-SkGEZAeoX9UZ3W1cDBi5xmTze6E_OPbQh_N5fTH9HoUfiDe9cZPuPN1HL1DOtiKBRDAYb0HxCD2lKtX6',
    name: '糯米糍麻麻',
    lastMessage: '今天去公园玩吗？🐾',
    time: '14:20',
    unread: 2
  },
  {
    id: 2,
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDSNOpce6rdm62wpGzsB_yEvsL7UyfhmAk-_5l0Uk_FF21VSDHEjjwdPOOchpnRtV7OXr5PzrNNdzoiXqHcMwrl9HtqKOhETNPfhO7LHkpJTKwUkFOYUU6uO9GVzs6NU2AOlbhyt4QDm30pfDsaYFK1DOBen7tPfLJ4CqwsIn7EOZstRVO6yKzLyEorYwhcVkxXv7AmELZSiWjLRQloFukQKBH1Q2bJO-QI4THKZq8qTNY8t4zJ8fVG0i5JsS0ThgQyOsGx2EV8U4It',
    name: '柯基查理',
    lastMessage: '查理很喜欢你家宝贝送的骨头！🦴',
    time: '昨天',
    unread: 0
  },
  {
    id: 3,
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDyiYbrjQtRBocbaOJG966-ltEXQic5C42bQJVTPbSHIGKgiHI8bHwBsMXYSmETUfmbG75IISEJaHb8ryedtyIL6oNuq752ApZFHFaVYYJEvFMpx9GBGG-PwyCYwswHHnOvPTLsaIgD7zsppZPF7i61JBF2VMMzFQLudyTAqWj2ysx1REyl9H1uvjb3ED7rN0mVQikUMZcpXqJLbm06iPD',
    name: '金毛Lucky',
    lastMessage: '周末一起去宠物乐园吗？',
    time: '星期三',
    unread: 0
  },
  {
    id: 4,
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBTiTNBKYGMOInV0ngc1hWgKJFOkAAsxcAy1nCIn07yMnKNAvH2s9lowfgCy6plOiHjji2kHIcWobMBsR7Q8OlCFFUSzC0rXQgzFZF8572JhP7MzFSRT48L3HmmokUJXHcyYvQpfLyi_JrUYAAzoN0VX1wH1g-LwMj41a0jMvVS5ydVYzRxY7ah0Q6afmpgFy_5sW2LxTTEM8WPqm-9ujHIuqNlw2on4LEMZXlAQQw2dyN-dd3prkJGeCYILfV33gooDbIRIVAP6AMx',
    name: '小鱼干店长',
    lastMessage: '亲，您的宠粮已经发货啦 🚚',
    time: '星期一',
    unread: 0
  }
])

// 系统通知列表
const notifications = ref([
  {
    id: 1,
    type: 'system',
    icon: '🎉',
    title: '小确幸提醒',
    content: '恭喜！您的动态被选入今日萌宠推荐～ 🐾',
    time: '2023-11-24 10:30',
    read: false
  },
  {
    id: 2,
    type: 'like',
    icon: '❤️',
    title: '糯米妈妈 赞了你的动态',
    content: '你家宝贝真可爱！',
    time: '2小时前',
    read: false
  },
  {
    id: 3,
    type: 'comment',
    icon: '💬',
    title: '柴犬爸爸 评论了你',
    content: '我家也是这个品种，好亲切！',
    time: '昨天',
    read: true
  }
])

const switchTab = (index) => {
  currentTab.value = index
  uni.vibrateShort({ type: 'light' })
}

const handleMessageClick = (item) => {
  console.log(currentTab.value)
  if (currentTab.value === 1) {
    uni.navigateTo({
      url: `/pages/message/notification-detail?id=${item.id}`
    })
  } else {
    uni.navigateTo({
      url: `/pages/message/chat?id=${item.id}&name=${item.name}`
    })
  }
}
</script>

<template>
  <view class="message-page">
    <!-- TopAppBar -->
    <CustomNavbar title="我的消息">
      <template #right>
        <view class="notification-btn">
          <text class="material-symbols-outlined">notifications</text>
        </view>
      </template>
    </CustomNavbar>

    <view class="page-content">
      <!-- Top Tabs -->
      <view class="tabs-wrapper">
        <view
          class="tab-button"
          :class="{ active: currentTab === 0 }"
          @tap="switchTab(0)"
        >
          <text class="tab-button-text">私信会话</text>
        </view>
        <view
          class="tab-button"
          :class="{ active: currentTab === 1 }"
          @tap="switchTab(1)"
        >
          <text class="tab-button-text">系统通知</text>
        </view>
      </view>

      <!-- 私信列表 -->
      <scroll-view v-if="currentTab === 0" scroll-y class="message-list">
        <view
          v-for="item in privateMessages"
          :key="item.id"
          class="message-card"
          @tap="handleMessageClick(item)"
        >
          <view class="avatar-container">
            <image :src="item.avatar" class="avatar" mode="aspectFill" />
            <view v-if="item.unread > 0" class="unread-badge">
              <text class="unread-text">{{ item.unread }}</text>
            </view>
          </view>
          <view class="message-content">
            <view class="message-header">
              <text class="message-name">{{ item.name }}</text>
              <text class="message-time">{{ item.time }}</text>
            </view>
            <text class="message-preview">{{ item.lastMessage }}</text>
          </view>
        </view>

        <!-- Empty State -->
        <view class="empty-state">
          <text class="empty-icon">🐾</text>
          <text class="empty-text">到底啦，给毛孩子一个拥抱吧</text>
        </view>
      </scroll-view>

      <!-- 系统通知列表 -->
      <scroll-view v-if="currentTab === 1" scroll-y class="message-list">
        <view
          v-for="item in notifications"
          :key="item.id"
          class="message-card"
          @tap="handleMessageClick(item)"
        >
          <view class="avatar-container">
            <view class="notification-icon-wrapper">
              <text class="notification-icon">{{ item.icon }}</text>
            </view>
          </view>
          <view class="message-content">
            <view class="message-header">
              <text class="message-name">{{ item.title }}</text>
              <text class="message-time">{{ item.time }}</text>
            </view>
            <text class="message-preview">{{ item.content }}</text>
          </view>
        </view>

        <!-- Empty State -->
        <view class="empty-state">
          <text class="empty-icon">🐾</text>
          <text class="empty-text">到底啦，给毛孩子一个拥抱吧</text>
        </view>
      </scroll-view>
    </view>

    <CustomTabbar :current="2" />
  </view>
</template>

<style scoped>
.message-page {
  width: 100%;
  min-height: 100vh;
  background-color: #fff8f7;
  padding-bottom: calc(144rpx + env(safe-area-inset-bottom));
}

.notification-btn {
  width: 88rpx;
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  transition: all 0.3s ease;
}

.notification-btn:active {
  transform: scale(0.9);
}

.notification-btn .material-symbols-outlined {
  font-size: 48rpx;
  color: var(--primary);
}

/* Page Content */
.page-content {
  padding-top: calc(88rpx + var(--status-bar-height, 40rpx));
}

}

/* Tabs */
.tabs-wrapper {
  display: flex;
  background-color: #f9f2f2;
  padding: 6rpx;
  border-radius: 32rpx;
  margin: 32rpx 40rpx 48rpx;
  gap: 8rpx;
}

.tab-button {
  flex: 1;
  padding: 20rpx 32rpx;
  border-radius: 24rpx;
  background-color: #ffffff;
  transition: all 300ms ease;
}

.tab-button.active {
  background-color: #71585c;
  box-shadow: 0 8rpx 24rpx rgba(113, 88, 92, 0.15);
}

.tab-button-text {
  font-size: 24rpx;
  font-weight: 700;
  color: rgba(91, 106, 92, 0.6);
  letter-spacing: 0.05em;
  font-family: 'Plus Jakarta Sans', sans-serif;
  text-align: center;
  display: block;
}

.tab-button.active .tab-button-text {
  color: #ffffff;
}

/* Message List */
.message-list {
  height: calc(100vh - 88rpx - var(--status-bar-height, 40rpx) - 200rpx);
  padding: 0 40rpx;
}

/* Message Card */
.message-card {
  background-color: #ffffff;
  padding: 32rpx;
  border-radius: 48rpx;
  display: flex;
  align-items: center;
  gap: 32rpx;
  margin-bottom: 32rpx;
  box-shadow: 0 16rpx 64rpx rgba(168, 155, 157, 0.12);
  transition: all 300ms ease;
}

.message-card:active {
  transform: scale(1.02);
}

.avatar-container {
  position: relative;
  flex-shrink: 0;
}

.avatar {
  width: 112rpx;
  height: 112rpx;
  border-radius: 50%;
  border: 4rpx solid #ffdde2;
}

.unread-badge {
  position: absolute;
  top: -4rpx;
  right: -4rpx;
  background-color: #71585c;
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4rpx solid #ffffff;
  animation: pulse 2s ease-in-out infinite;
}

.unread-text {
  font-size: 20rpx;
  font-weight: bold;
  color: #ffffff;
}

.notification-icon-wrapper {
  width: 112rpx;
  height: 112rpx;
  border-radius: 50%;
  border: 4rpx solid #ffdde2;
  background: linear-gradient(135deg, #ffdde2 0%, #fcdadf 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.notification-icon {
  font-size: 56rpx;
}

.message-content {
  flex: 1;
  min-width: 0;
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 8rpx;
}

.message-name {
  font-size: 36rpx;
  font-weight: 600;
  color: #1e1b1b;
  font-family: 'Quicksand', sans-serif;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.message-time {
  font-size: 20rpx;
  font-weight: 700;
  color: #807476;
  letter-spacing: 0.05em;
  font-family: 'Plus Jakarta Sans', sans-serif;
  flex-shrink: 0;
  margin-left: 16rpx;
}

.message-preview {
  font-size: 28rpx;
  color: #4f4446;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
}

/* Empty State */
.empty-state {
  margin-top: 96rpx;
  text-align: center;
  opacity: 0.3;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.empty-icon {
  font-size: 80rpx;
  margin-bottom: 16rpx;
}

.empty-text {
  font-size: 24rpx;
  font-weight: 700;
  color: #71585c;
  letter-spacing: 0.1em;
  font-family: 'Plus Jakarta Sans', sans-serif;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}
</style>
