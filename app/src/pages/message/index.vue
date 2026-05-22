<template>
  <view class="page-container">
    <TopNavBar title="消息" :showBack="false" />

    <view class="message-tabs">
      <view
        class="tab-item"
        :class="{ active: currentTab === 0 }"
        @click="currentTab = 0"
      >
        <text class="tab-text">系统通知</text>
        <view class="tab-badge" v-if="systemBadge > 0">{{ systemBadge }}</view>
      </view>
      <view
        class="tab-item"
        :class="{ active: currentTab === 1 }"
        @click="currentTab = 1"
      >
        <text class="tab-text">好友私信</text>
      </view>
    </view>

    <scroll-view scroll-y class="message-list">
      <template v-if="currentTab === 0">
        <view
          v-for="(item, index) in systemMessages"
          :key="index"
          class="message-item"
          :class="{ unread: item.unread }"
          @click="goToSystemDetail(item)"
        >
          <view class="message-icon system-icon">
            <view class="icon-inner" :class="item.type"></view>
          </view>
          <view class="message-content">
            <view class="message-header">
              <text class="message-title">{{ item.title }}</text>
              <text class="message-time">{{ item.time }}</text>
            </view>
            <text class="message-desc">{{ item.desc }}</text>
          </view>
          <view class="message-indicator" v-if="item.unread"></view>
        </view>
      </template>

      <template v-else>
        <view
          v-for="(item, index) in chatList"
          :key="index"
          class="message-item"
          :class="{ unread: item.unread }"
          @click="goToChat(item)"
        >
          <view class="message-icon chat-icon">
            <view
              class="icon-inner"
              :style="{ background: item.avatarColor }"
            ></view>
          </view>
          <view class="message-content">
            <view class="message-header">
              <text class="message-title">{{ item.name }}</text>
              <text class="message-time">{{ item.time }}</text>
            </view>
            <text class="message-desc">{{ item.lastMessage }}</text>
          </view>
          <view class="message-badge" v-if="item.unreadCount > 0">{{
            item.unreadCount
          }}</view>
        </view>
      </template>

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
import TopNavBar from "@/components/common/TopNavBar.vue";
import TabBar from "@/components/common/TabBar.vue";
import Empty from "@/components/common/Empty.vue";
import { ref } from "vue";

const currentTab = ref(0);
const systemBadge = ref(2);

const systemMessages = ref([
  {
    id: 1,
    type: "like",
    title: "点赞通知",
    desc: "小明 点赞了你的动态",
    time: "5分钟前",
    unread: true,
  },
  {
    id: 2,
    type: "comment",
    title: "评论通知",
    desc: "阿花 评论了你的动态",
    time: "10分钟前",
    unread: true,
  },
  {
    id: 3,
    type: "follow",
    title: "关注通知",
    desc: "旺财 关注了你",
    time: "1小时前",
    unread: false,
  },
  {
    id: 4,
    type: "system",
    title: "系统通知",
    desc: "您的账号已完成实名认证",
    time: "3小时前",
    unread: false,
  },
]);

const chatList = ref([
  {
    id: 1,
    name: "小明",
    avatarColor: "#FFC1E9",
    lastMessage: "今天遛狗吗？",
    time: "刚刚",
    unread: true,
    unreadCount: 3,
  },
  {
    id: 2,
    name: "阿花",
    avatarColor: "#FFD4F0",
    lastMessage: "好的，明天见",
    time: "10分钟前",
    unread: false,
    unreadCount: 0,
  },
  {
    id: 3,
    name: "旺财",
    avatarColor: "#FFB6C1",
    lastMessage: "周末一起去公园吧",
    time: "1小时前",
    unread: false,
    unreadCount: 0,
  },
  {
    id: 4,
    name: "球球",
    avatarColor: "#FFC0CB",
    lastMessage: "收到，谢谢",
    time: "昨天",
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
@import "@/styles/variables.scss";

.message-container {
  min-height: 100vh;
  background: $color-bg-primary;
}

.message-tabs {
  display: flex;
  padding: 24rpx 32rpx;
  gap: 24rpx;
}

.tab-item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  padding: 20rpx;
  background: $color-bg-white;
  border-radius: $border-radius-large;
  border: 2rpx solid rgba(113, 88, 92, 0.1);

  &.active {
    background: $color-primary;
    border-color: $color-primary;

    .tab-text {
      color: $color-bg-white;
    }

    .tab-badge {
      background: $color-bg-white;
      color: $color-primary;
    }
  }
}

.tab-text {
  font-size: $font-size-body;
  color: $color-gray-medium;
}

.tab-badge {
  min-width: 32rpx;
  height: 32rpx;
  padding: 0 8rpx;
  background: $color-error;
  border-radius: 16rpx;
  font-size: $font-size-helper;
  color: $color-bg-white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.message-list {
  box-sizing: border-box;
  padding: 0 32rpx;
  padding-bottom: calc(112rpx + env(safe-area-inset-bottom));
  height: calc(100vh - 280rpx);
}

.message-item {
  display: flex;
  align-items: center;
  background: $color-bg-white;
  border-radius: $border-radius-large;
  padding: 24rpx;
  margin-bottom: 16rpx;
  border: 2rpx solid rgba(113, 88, 92, 0.1);

  &.unread {
    background: rgba(113, 88, 92, 0.03);
  }

  &:active {
    background: rgba(113, 88, 92, 0.05);
  }
}

.message-icon {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;

  &.system-icon {
    background: rgba(113, 88, 92, 0.08);
  }

  &.chat-icon {
    padding: 4rpx;
    background: $color-primary-light;
  }
}

.icon-inner {
  width: 100%;
  height: 100%;

  &.like {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2371585C'%3E%3Cpath d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/%3E%3C/svg%3E")
      no-repeat center;
    background-size: 60%;
  }

  &.comment {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2371585C'%3E%3Cpath d='M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2z'/%3E%3C/svg%3E")
      no-repeat center;
    background-size: 60%;
  }

  &.follow {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2371585C'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E")
      no-repeat center;
    background-size: 60%;
  }

  &.system {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2371585C'%3E%3Cpath d='M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z'/%3E%3C/svg%3E")
      no-repeat center;
    background-size: 60%;
  }
}

.message-content {
  flex: 1;
}

.message-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8rpx;
}

.message-title {
  font-size: $font-size-body;
  font-weight: $font-weight-bold;
  color: $color-gray-dark;
}

.message-time {
  font-size: $font-size-helper;
  color: $color-gray-medium;
}

.message-desc {
  font-size: $font-size-body;
  color: $color-gray-medium;
}

.message-indicator {
  width: 12rpx;
  height: 12rpx;
  background: $color-primary;
  border-radius: 50%;
}

.message-badge {
  min-width: 36rpx;
  height: 36rpx;
  padding: 0 10rpx;
  background: $color-error;
  border-radius: 18rpx;
  font-size: $font-size-helper;
  color: $color-bg-white;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
