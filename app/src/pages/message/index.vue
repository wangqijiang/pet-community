<template>
  <view class="page-container">
    <TopNavBar title="消息" />

    <view class="tabs">
      <view
        class="tab"
        :class="{ active: currentTab === 0 }"
        @click="currentTab = 0"
      >
        <text>系统通知</text>
        <view class="badge" v-if="systemBadge > 0">{{ systemBadge }}</view>
      </view>
      <view
        class="tab"
        :class="{ active: currentTab === 1 }"
        @click="currentTab = 1"
      >
        <text>好友私信</text>
      </view>
    </view>

    <scroll-view scroll-y class="content">
      <view class="list" :class="{ active: currentTab === 0 }">
        <view
          v-for="(item, index) in systemMessages"
          :key="index"
          class="card"
          @click="goToSystemDetail(item)"
        >
          <view class="left">
            <view class="icon-wrap">
              <view class="icon-inner" :class="item.type"></view>
            </view>
            <view class="info">
              <text class="name">{{ item.title }}</text>
              <text class="desc">{{ item.desc }}</text>
            </view>
          </view>
          <view class="right">
            <text class="time">{{ item.time }}</text>
            <view class="dot" v-if="item.unread"></view>
          </view>
        </view>
      </view>

      <view class="list" :class="{ active: currentTab === 1 }">
        <view
          v-for="(item, index) in chatList"
          :key="index"
          class="card"
          @click="goToChat(item)"
        >
          <view class="left">
            <image
              class="avatar"
              :src="item.avatar"
              mode="aspectFill"
            />
            <view class="info">
              <text class="name">{{ item.name }}</text>
              <text class="desc">{{ item.lastMessage }}</text>
            </view>
          </view>
          <view class="right">
            <text class="time">{{ item.time }}</text>
            <view class="badge" v-if="item.unreadCount > 0">{{ item.unreadCount }}</view>
          </view>
        </view>
      </view>

      <Empty
        v-if="
          (currentTab === 0 && systemMessages.length === 0) ||
          (currentTab === 1 && chatList.length === 0)
        "
        :type="currentTab === 0 ? 'bell' : 'dog'"
        :text="currentTab === 0 ? '暂无系统通知' : '暂无私信消息'"
      />
    </scroll-view>

    <TabBar :current="2" />
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";
import TopNavBar from "@/components/common/TopNavBar.vue";
import TabBar from "@/components/common/TabBar.vue";
import Empty from "@/components/common/Empty.vue";

const currentTab = ref(0);
const systemBadge = ref(2);

const systemMessages = ref([
  {
    id: 1,
    type: "heart",
    title: "点赞通知",
    desc: "小明 点赞了你的动态",
    time: "59分钟前",
    unread: true,
  },
  {
    id: 2,
    type: "message",
    title: "评论通知",
    desc: "阿花 评论了你的动态",
    time: "10分钟前",
    unread: true,
  },
  {
    id: 3,
    type: "user",
    title: "关注通知",
    desc: "旺财 关注了你",
    time: "1小时前",
    unread: false,
  },
  {
    id: 4,
    type: "badge",
    title: "系统通知",
    desc: "实名认证审核已通过",
    time: "3小时前",
    unread: false,
  },
]);

const chatList = ref([
  {
    id: 1,
    name: "小明",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop",
    lastMessage: "今天去遛狗吗？",
    time: "刚刚",
    unread: true,
    unreadCount: 3,
  },
  {
    id: 2,
    name: "阿花",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=400&auto=format&fit=crop",
    lastMessage: "好的，明天见～",
    time: "10分钟前",
    unread: false,
    unreadCount: 0,
  },
  {
    id: 3,
    name: "旺财",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop",
    lastMessage: "周末一起去公园吧 🐾",
    time: "1小时前",
    unread: false,
    unreadCount: 0,
  },
]);

const goToSystemDetail = (item: any) => {
  item.unread = false;
  systemBadge.value = systemMessages.value.filter((m) => m.unread).length;
  uni.navigateTo({
    url: "/pages/message/systemDetail",
  });
};

const goToChat = (item: any) => {
  item.unread = false;
  item.unreadCount = 0;
  uni.navigateTo({
    url: `/pages/message/chat?name=${item.name}`,
  });
};
</script>

<style lang="scss" scoped>
.page-container {
  width: 100%;
  min-height: 100vh;
  background: #FFF7F1;
  display: flex;
  flex-direction: column;
}

.tabs {
  padding: 32rpx;
  display: flex;
  gap: 24rpx;
}

.tab {
  flex: 1;
  height: 96rpx;
  border-radius: 999rpx;
  background: #ffffff;
  border: 1rpx solid #F1E5DA;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
  font-size: 28rpx;
  font-weight: 600;
  color: #8A7F7F;
  transition: all 0.2s ease;

  &.active {
    background: #8B6D73;
    color: #ffffff;
    border: none;

    .badge {
      background: #ffffff;
      color: #8B6D73;
    }
  }
}

.badge {
  min-width: 36rpx;
  height: 36rpx;
  padding: 0 10rpx;
  border-radius: 999rpx;
  background: #E54B4B;
  color: #ffffff;
  font-size: 22rpx;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.content {
  flex: 1;
  box-sizing: border-box;
  padding: 0 32rpx;
  padding-bottom: 200rpx;
}

.list {
  display: none;

  &.active {
    display: block;
  }
}

.card {
  background: #ffffff;
  border-radius: 48rpx;
  padding: 36rpx;
  margin-bottom: 32rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 16rpx 48rpx rgba(107, 78, 61, 0.05);
}

.left {
  display: flex;
  align-items: center;
  gap: 28rpx;
}

.icon-wrap {
  width: 104rpx;
  height: 104rpx;
  border-radius: 36rpx;
  background: #FFF1EC;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-inner {
  width: 48rpx;
  height: 48rpx;

  &.heart {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%238B6D73'%3E%3Cpath d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/%3E%3C/svg%3E")
      no-repeat center;
    background-size: 100%;
  }

  &.message {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%238B6D73'%3E%3Cpath d='M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2z'/%3E%3C/svg%3E")
      no-repeat center;
    background-size: 100%;
  }

  &.user {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%238B6D73'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E")
      no-repeat center;
    background-size: 100%;
  }

  &.badge {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%238B6D73'%3E%3Cpath d='M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z'/%3E%3C/svg%3E")
      no-repeat center;
    background-size: 100%;
  }
}

.avatar {
  width: 104rpx;
  height: 104rpx;
  border-radius: 36rpx;
}

.info {
  display: flex;
  flex-direction: column;
}

.name {
  font-size: 32rpx;
  font-weight: 700;
  color: #3D2F2F;
}

.desc {
  margin-top: 12rpx;
  font-size: 26rpx;
  color: #8A7F7F;
}

.right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 16rpx;
}

.time {
  font-size: 24rpx;
  color: #B0A6A6;
}

.dot {
  width: 16rpx;
  height: 16rpx;
  border-radius: 999rpx;
  background: #E54B4B;
}
</style>
