<template>
  <PageLayout :tab-bar="true" :header-height="tabsHeight">
    <template #navbar>
      <TopNavBar title="消息" :showBack="false" />
    </template>

    <template #header>
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
    </template>

    <view v-show="currentTab === 0">
      <view
        v-for="item in systemMessages"
        :key="item.id"
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
      <Empty
        v-if="systemMessages.length === 0"
        type="bell"
        text="暂无系统通知"
      />
    </view>

    <view v-show="currentTab === 1">
      <view
        v-for="item in chatList"
        :key="item.id"
        class="card"
        @click="goToChat(item)"
      >
        <view class="left">
          <image class="avatar" :src="item.avatar" mode="aspectFill" />
          <view class="info">
            <text class="name">{{ item.name }}</text>
            <text class="desc">{{ item.lastMessage }}</text>
          </view>
        </view>
        <view class="right">
          <text class="time">{{ item.time }}</text>
          <view class="badge-num" v-if="item.unreadCount > 0">{{
            item.unreadCount
          }}</view>
        </view>
      </view>
      <Empty v-if="chatList.length === 0" type="dog" text="暂无私信消息" />
    </view>

    <template #tabbar>
      <TabBar :current="2" />
    </template>
  </PageLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { onShow } from "@dcloudio/uni-app";
import TopNavBar from "@/components/common/TopNavBar.vue";
import TabBar from "@/components/common/TabBar.vue";
import PageLayout from "@/components/common/PageLayout.vue";
import Empty from "@/components/common/Empty.vue";
import { getNotifications } from "@/api/notification";
import { getConversations } from "@/api/message";
import { formatRelativeTime } from "@/utils/format";
import { resolveMediaUrl } from "@/utils/media";
import { ensureRealtimeConnected, getActiveChatUserId } from "@/utils/realtime";
import type { Notification } from "@/api/notification";
import type { Conversation, ChatMessage } from "@/api/message";

const tabsHeight = uni.upx2px(120);
const currentTab = ref(0);
const systemBadge = ref(0);
const systemMessages = ref<
  Array<{
    id: number;
    type: string;
    title: string;
    desc: string;
    time: string;
    unread: boolean;
  }>
>([]);
const chatList = ref<
  Array<{
    id: number;
    name: string;
    avatar: string;
    lastMessage: string;
    time: string;
    unreadCount: number;
  }>
>([]);

const notifTypeIcon: Record<string, string> = {
  like: "heart",
  comment: "message",
  follow: "user",
  system: "badge",
  message: "message",
};

const mapNotification = (n: Notification) => ({
  id: n.id,
  type: notifTypeIcon[n.type] || "badge",
  title: n.title,
  desc: n.content || "",
  time: formatRelativeTime(n.created_at),
  unread: !n.is_read,
});

const refreshSystemBadge = () => {
  systemBadge.value = systemMessages.value.filter((m) => m.unread).length;
};

const upsertChatFromMessage = (msg: ChatMessage) => {
  const stored = uni.getStorageSync("user");
  const me = stored ? JSON.parse(stored).id : 0;
  if (!me) return;

  const otherId = msg.from_id === me ? msg.to_id : msg.from_id;
  const otherName =
    msg.from_id === me ? msg.to_username || "用户" : msg.from_username || "用户";
  const otherAvatar =
    msg.from_id === me ? msg.to_avatar || "" : msg.from_avatar || "";
  const incoming = msg.to_id === me;
  const inActiveChat = getActiveChatUserId() === otherId;

  const idx = chatList.value.findIndex((c) => c.id === otherId);
  const item = {
    id: otherId,
    name: idx >= 0 ? chatList.value[idx].name : otherName,
    avatar: resolveMediaUrl(
      idx >= 0 && chatList.value[idx].avatar
        ? chatList.value[idx].avatar
        : otherAvatar,
    ),
    lastMessage: msg.content,
    time: formatRelativeTime(msg.created_at),
    unreadCount:
      idx >= 0
        ? chatList.value[idx].unreadCount + (incoming && !inActiveChat ? 1 : 0)
        : incoming && !inActiveChat
          ? 1
          : 0,
  };

  if (idx >= 0) {
    chatList.value.splice(idx, 1);
  }
  chatList.value.unshift(item);
};

const prependNotification = (n: Notification) => {
  const mapped = mapNotification(n);
  const idx = systemMessages.value.findIndex((item) => item.id === mapped.id);
  if (idx >= 0) systemMessages.value.splice(idx, 1);
  systemMessages.value.unshift(mapped);
  refreshSystemBadge();
};

const loadData = async () => {
  try {
    const notifRes = await getNotifications(1, 50);
    systemMessages.value = notifRes.list.map(mapNotification);
    refreshSystemBadge();

    const chats = await getConversations();
    chatList.value = chats.map((c: Conversation) => ({
      id: c.user_id,
      name: c.username,
      avatar: resolveMediaUrl(c.avatar),
      lastMessage: c.last_message || "",
      time: formatRelativeTime(c.last_time),
      unreadCount: Number(c.unread_count) || 0,
    }));
  } catch (e) {
    console.error(e);
  }
};

const goToSystemDetail = (item: { id: number }) => {
  uni.navigateTo({
    url: `/pages/message/systemDetail?id=${item.id}`,
  });
};

const goToChat = (item: { id: number; name: string }) => {
  uni.navigateTo({
    url: `/pages/message/chat?userId=${item.id}&name=${encodeURIComponent(item.name)}`,
  });
};

onMounted(() => {
  ensureRealtimeConnected();
  loadData();
  uni.$on("realtime:message", upsertChatFromMessage);
  uni.$on("realtime:notification", prependNotification);
});

onUnmounted(() => {
  uni.$off("realtime:message", upsertChatFromMessage);
  uni.$off("realtime:notification", prependNotification);
});

onShow(() => {
  ensureRealtimeConnected();
  loadData();
});
</script>

<style lang="scss" scoped>
.tabs {
  padding: 24rpx 32rpx;
  display: flex;
  gap: 20rpx;
}

.tab {
  flex: 1;
  height: 80rpx;
  border-radius: 999rpx;
  background: #fff;
  border: 1rpx solid #f1e5da;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  font-size: 28rpx;
  color: #8a7f7f;

  &.active {
    background: #8b6d73;
    color: #fff;
    border: none;
  }
}

.badge,
.badge-num {
  min-width: 32rpx;
  height: 32rpx;
  padding: 0 8rpx;
  border-radius: 999rpx;
  background: #e54b4b;
  color: #fff;
  font-size: 22rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-layout__content {
  padding: 0 32rpx 24rpx;
  box-sizing: border-box;
}

.card {
  background: #fff;
  border-radius: 40rpx;
  padding: 32rpx;
  margin-bottom: 24rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.left {
  display: flex;
  align-items: center;
  gap: 24rpx;
  flex: 1;
  min-width: 0;
}

.icon-wrap {
  width: 88rpx;
  height: 88rpx;
  border-radius: 28rpx;
  background: #fff1ec;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.icon-inner {
  width: 40rpx;
  height: 40rpx;

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
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%238B6D73'%3E%3Cpath d='M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z'/%3E%3C/svg%3E")
      no-repeat center;
    background-size: 100%;
  }
}

.avatar {
  width: 88rpx;
  height: 88rpx;
  border-radius: 28rpx;
  flex-shrink: 0;
}

.info {
  flex: 1;
  min-width: 0;
}

.name {
  font-size: 30rpx;
  font-weight: 700;
  color: #3d2f2f;
  display: block;
}

.desc {
  margin-top: 8rpx;
  font-size: 26rpx;
  color: #8a7f7f;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12rpx;
  flex-shrink: 0;
}

.time {
  font-size: 24rpx;
  color: #b0a6a6;
}

.dot {
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
  background: #e54b4b;
}
</style>
