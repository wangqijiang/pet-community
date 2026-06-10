<template>
  <PageLayout refresher @refresh="onRefresh">
    <template #navbar>
      <TopNavBar :title="pageTitle" :showBack="true" />
    </template>

    <view class="page-inner notice-list-inner">
      <view v-if="noticeType === 'follow'" class="fans-link" @tap="goToFans">
        <text class="fans-link-text">查看全部粉丝</text>
        <view class="fans-link-arrow"></view>
      </view>

      <view
        v-for="item in noticeList"
        :key="item.id"
        class="notice-item"
        @tap="handleItemTap(item)"
      >
        <image class="avatar" :src="item.avatar" mode="aspectFill" />
        <view class="info">
          <view class="info-top">
            <text class="name">{{ item.name }}</text>
            <text class="time">{{ item.time }}</text>
          </view>
          <text class="desc">{{ item.desc }}</text>
        </view>
        <view v-if="item.unread" class="dot"></view>
      </view>

      <Empty v-if="noticeList.length === 0 && !loading" :title="emptyText" />
    </view>

    <Loading :visible="loading" />
  </PageLayout>
</template>

<script setup lang="ts">
import { showRequestError } from "@/utils/request";
import { ref, computed } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import TopNavBar from "@/components/common/TopNavBar.vue";
import PageLayout from "@/components/common/PageLayout.vue";
import Empty from "@/components/common/Empty.vue";
import Loading from "@/components/common/Loading.vue";
import {
  getNotifications,
  markNotificationsRead,
  type Notification,
} from "@/api/notification";
import { formatRelativeTime } from "@/utils/format";
import { resolveMediaUrl } from "@/utils/media";
import { resolveUserAvatarUrl } from "@/utils/defaultAvatar";
import { scheduleTabBarBadgeRefresh } from "@/utils/tabBarBadge";

type NoticeType = "like" | "comment" | "follow" | "message";

const TYPE_META: Record<
  NoticeType,
  { title: string; empty: string; action: string }
> = {
  like: {
    title: "点赞通知",
    empty: "暂无点赞通知",
    action: "赞了你的动态",
  },
  comment: {
    title: "评论通知",
    empty: "暂无评论通知",
    action: "评论了你的动态",
  },
  follow: {
    title: "关注通知",
    empty: "暂无关注通知",
    action: "关注了你",
  },
  message: {
    title: "私信通知",
    empty: "暂无私信通知",
    action: "给你发来私信",
  },
};

const loading = ref(false);
const noticeType = ref<NoticeType>("like");
const noticeList = ref<
  Array<{
    id: number;
    name: string;
    avatar: string;
    desc: string;
    time: string;
    unread: boolean;
    fromUserId?: number;
    targetId?: number;
    targetType?: string;
  }>
>([]);

const pageTitle = computed(
  () => TYPE_META[noticeType.value]?.title || "系统通知",
);
const emptyText = computed(
  () => TYPE_META[noticeType.value]?.empty || "暂无通知",
);

const mapNoticeItem = (n: Notification) => {
  const meta = TYPE_META[noticeType.value];
  const name = n.from_username || "用户";
  const actionText = n.content?.trim() || meta.action;
  let desc = actionText;
  if (noticeType.value === "like") {
    desc = `${name} ${actionText}`;
  } else if (noticeType.value === "comment") {
    desc = actionText.includes("：") ? actionText : `${name} ${actionText}`;
  }
  return {
    id: n.id,
    name,
    avatar: resolveUserAvatarUrl(n.from_avatar, n.from_user_id),
    desc,
    time: formatRelativeTime(n.created_at),
    unread: !n.is_read,
    fromUserId: n.from_user_id,
    targetId: n.target_id,
    targetType: n.target_type,
  };
};

const markUnreadAsRead = async (list: Notification[]) => {
  const ids = list.filter((n) => !n.is_read).map((n) => n.id);
  if (!ids.length) return;
  try {
    await markNotificationsRead(ids);
    scheduleTabBarBadgeRefresh();
  } catch {
    /* ignore */
  }
};

const loadNoticeList = async () => {
  loading.value = true;
  try {
    const res = await getNotifications(1, 50, noticeType.value);
    noticeList.value = res.list.map(mapNoticeItem);
    await markUnreadAsRead(res.list);
    noticeList.value = noticeList.value.map((item) => ({
      ...item,
      unread: false,
    }));
  } catch (error) {
    showRequestError(error, "加载失败");
  } finally {
    loading.value = false;
  }
};

const onRefresh = () => loadNoticeList();

const goToFans = () => {
  uni.navigateTo({ url: "/pages/mine/fans" });
};

const handleItemTap = (item: typeof noticeList.value[number]) => {
  if (noticeType.value === "message") {
    const chatUserId = item.fromUserId || item.targetId;
    if (!chatUserId) return;
    uni.navigateTo({
      url: `/pages/message/chat?userId=${chatUserId}&name=${encodeURIComponent(
        item.name,
      )}`,
    });
    return;
  }

  if (noticeType.value === "follow") {
    if (!item.fromUserId) return;
    uni.navigateTo({
      url: `/pages/mine/userProfile?id=${
        item.fromUserId
      }&name=${encodeURIComponent(item.name)}`,
    });
    return;
  }

  if (item.targetId && item.targetType === "post") {
    uni.navigateTo({ url: `/pages/circle/detail?id=${item.targetId}` });
    return;
  }

  if (item.fromUserId) {
    uni.navigateTo({
      url: `/pages/mine/userProfile?id=${
        item.fromUserId
      }&name=${encodeURIComponent(item.name)}`,
    });
  }
};

onLoad((options) => {
  const type = options?.type as NoticeType | undefined;
  if (type && TYPE_META[type]) {
    noticeType.value = type;
  }
  loadNoticeList();
});
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";

.notice-list-inner {
  padding-top: 8rpx;
}

.fans-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  border-radius: 32rpx;
  padding: 28rpx 32rpx;
  margin-bottom: 24rpx;
  box-shadow: $shadow-light;
}

.fans-link-text {
  font-size: 28rpx;
  font-weight: 600;
  color: #6b4e3d;
}

.fans-link-arrow {
  width: 28rpx;
  height: 28rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%238A7F7F'%3E%3Cpath d='M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;
}

.notice-item {
  display: flex;
  align-items: center;
  gap: 24rpx;
  background: #fff;
  border-radius: 32rpx;
  padding: 28rpx 32rpx;
  margin-bottom: 24rpx;
  box-shadow: $shadow-light;
  position: relative;
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

.info-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16rpx;
}

.name {
  font-size: 30rpx;
  font-weight: 700;
  color: #3d2f2f;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.time {
  font-size: 24rpx;
  color: #b0a6a6;
  flex-shrink: 0;
}

.desc {
  display: block;
  margin-top: 8rpx;
  font-size: 26rpx;
  color: #8a7f7f;
  line-height: 1.5;
}

.dot {
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
  background: #e54b4b;
  flex-shrink: 0;
}
</style>
