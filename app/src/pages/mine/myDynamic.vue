<template>
  <view class="page-container">
    <view class="header-safe"></view>
    <TopNavBar title="我的动态" :showBack="true" />

    <view class="stats-bar">
      <view class="stat-item">
        <text class="stat-number">{{ dynamicList.length }}</text>
        <text class="stat-label">全部动态</text>
      </view>
      <view class="stat-divider"></view>
      <view class="stat-item">
        <text class="stat-number">{{ totalLikes }}</text>
        <text class="stat-label">获赞总数</text>
      </view>
      <view class="stat-divider"></view>
      <view class="stat-item">
        <text class="stat-number">{{ totalComments }}</text>
        <text class="stat-label">评论总数</text>
      </view>
    </view>

    <scroll-view
      class="feed-list"
      scroll-y
      @scrolltolower="loadMore"
      refresher-enabled
      :refresher-triggered="isRefreshing"
      @refresherrefresh="onRefresh"
    >
      <view
        v-for="item in dynamicList"
        :key="item.id"
        class="feed-card"
        @click="goToDetail(item)"
      >
        <view class="card-header">
          <view class="user-info">
            <view class="user-avatar">
              <view
                class="avatar-bg"
                :style="{ background: item.avatarColor }"
              ></view>
            </view>
            <view class="user-text">
              <text class="user-name">{{ item.userName }}</text>
              <text class="post-time">{{ item.time }}</text>
            </view>
          </view>
          <view class="action-btn" @click.stop="showMoreActions(item)">
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
            @click.stop="previewImage(item, imgIndex)"
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
          <view class="footer-right">
            <view class="footer-item" @click.stop="handleEdit(item)">
              <view class="edit-icon"></view>
              <text class="footer-text">编辑</text>
            </view>
          </view>
        </view>
      </view>

      <view v-if="dynamicList.length === 0 && !loading" class="empty-state">
        <view class="empty-icon"></view>
        <text class="empty-text">还没有发布过动态哦</text>
        <view class="empty-btn" @click="goToPublish">
          <text class="btn-text">去发布</text>
        </view>
      </view>

      <view v-if="dynamicList.length > 0" class="bottom-hint">
        <text class="hint-text">已经到底啦～</text>
      </view>
    </scroll-view>

    <view class="fab" @click="goToPublish">
      <view class="fab-icon"></view>
    </view>

    <Loading :visible="loading" />
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import TopNavBar from "@/components/common/TopNavBar.vue";
import Loading from "@/components/common/Loading.vue";

const loading = ref(false);
const isRefreshing = ref(false);

const dynamicList = ref([
  {
    id: 1,
    userName: "Summer Lin",
    avatarColor: "#FFC1E9",
    time: "2小时前",
    content:
      "今天带布丁去公园草坪打滚啦！阳光超级好，它开心得像个200斤的孩子哈哈。这就是简单的幸福吧～✨",
    images: [{ color: "#FFE4E1" }, { color: "#FFD4F0" }, { color: "#FFC1E9" }],
    likes: 128,
    comments: 32,
    liked: false,
  },
  {
    id: 2,
    userName: "Summer Lin",
    avatarColor: "#E8F5E9",
    time: "昨天 18:30",
    content: "午后的小憩时光，它睡得像个小猪哼唧哼唧的。安静的日子，真好。💤",
    images: [{ color: "#FFF4D2" }],
    likes: 85,
    comments: 12,
    liked: true,
  },
  {
    id: 3,
    userName: "Summer Lin",
    avatarColor: "#FFD4F0",
    time: "3天前",
    content: "今天训练了新技能！握手、趴下、打滚一气呵成，奖励了超多零食～🐾",
    images: [{ color: "#FFE4E1" }, { color: "#FFC1E9" }],
    likes: 234,
    comments: 45,
    liked: false,
  },
]);

const totalLikes = computed(() => {
  return dynamicList.value.reduce((sum, item) => sum + item.likes, 0);
});

const totalComments = computed(() => {
  return dynamicList.value.reduce((sum, item) => sum + item.comments, 0);
});

const onRefresh = () => {
  isRefreshing.value = true;
  setTimeout(() => {
    isRefreshing.value = false;
    uni.showToast({
      title: "刷新成功",
      icon: "success",
    });
  }, 1000);
};

const loadMore = () => {
  console.log("Load more");
};

const goToDetail = (item: any) => {
  uni.navigateTo({
    url: "/pages/circle/detail?id=" + item.id,
  });
};

const goToPublish = () => {
  uni.navigateTo({
    url: "/pages/circle/publish",
  });
};

const handleLike = (item: any) => {
  if (!item.liked) {
    item.liked = true;
    item.likes += 1;
    uni.vibrateShort({ type: "light" });
  }
};

const showMoreActions = (item: any) => {
  uni.vibrateShort({ type: "light" });
  uni.showActionSheet({
    itemList: ["编辑动态", "删除动态", "分享动态"],
    success: (res) => {
      if (res.tapIndex === 0) {
        handleEdit(item);
      } else if (res.tapIndex === 1) {
        handleDelete(item);
      } else if (res.tapIndex === 2) {
        handleShare(item);
      }
    },
  });
};

const handleEdit = (item: any) => {
  uni.vibrateShort({ type: "light" });
  uni.showToast({
    title: "编辑功能开发中",
    icon: "none",
  });
};

const handleDelete = (item: any) => {
  uni.showModal({
    title: "删除动态",
    content: "确定要删除这条动态吗？删除后无法恢复",
    confirmColor: "#FF6B8A",
    success: (res) => {
      if (res.confirm) {
        const index = dynamicList.value.findIndex((d) => d.id === item.id);
        if (index > -1) {
          dynamicList.value.splice(index, 1);
          uni.showToast({
            title: "删除成功",
            icon: "success",
          });
        }
      }
    },
  });
};

const handleShare = (item: any) => {
  uni.showShareMenu({
    withShareTicket: true,
  });
};

const previewImage = (item: any, index: number) => {
  const imageUrls = item.images.map((img: any) => {
    return `https://via.placeholder.com/400x400/${img.color.replace("#", "")}`;
  });
  uni.previewImage({
    urls: imageUrls,
    current: index,
  });
};
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";

.page-container {
  min-height: 100vh;
  background: $color-bg-primary;
}

.header-safe {
  height: 80rpx;
  background: $color-bg-primary;
}

.stats-bar {
  display: flex;
  align-items: center;
  justify-content: space-around;
  background: $color-bg-white;
  margin: 0 32rpx 32rpx;
  padding: 32rpx;
  border-radius: $border-radius-large;
  border: 2rpx solid rgba(113, 88, 92, 0.1);
  box-shadow: 0 8rpx 24rpx rgba(168, 155, 157, 0.08);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
}

.stat-number {
  font-size: 40rpx;
  font-weight: $font-weight-bold;
  color: $color-primary;
}

.stat-label {
  font-size: $font-size-helper;
  color: $color-gray-medium;
}

.stat-divider {
  width: 2rpx;
  height: 60rpx;
  background: rgba(113, 88, 92, 0.1);
}

.feed-list {
  padding: 0 32rpx;
  padding-bottom: calc(200rpx + env(safe-area-inset-bottom));
  height: calc(100vh - 340rpx);
  box-sizing: border-box;
}

.feed-card {
  background: $color-bg-white;
  border-radius: $border-radius-large;
  padding: 32rpx;
  margin-bottom: 32rpx;
  border: 2rpx solid rgba(113, 88, 92, 0.1);
  box-shadow: 0 8rpx 24rpx rgba(168, 155, 157, 0.08);
  transition: transform $transition-base;

  &:active {
    transform: scale(1);
    box-shadow: 0 8rpx 24rpx rgba(168, 155, 157, 0.12);
  }
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24rpx;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.user-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  padding: 4rpx;
  border: 4rpx solid $color-primary-light;
}

.avatar-bg {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.user-text {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.user-name {
  font-size: $font-size-body;
  font-weight: $font-weight-bold;
  color: $color-gray-dark;
}

.post-time {
  font-size: $font-size-helper;
  color: $color-gray-light;
}

.action-btn {
  width: 56rpx;
  height: 56rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.more-icon {
  width: 40rpx;
  height: 40rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23807476'%3E%3Cpath d='M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;
  opacity: 0.6;
}

.card-content {
  font-size: $font-size-body;
  color: $color-gray-dark;
  line-height: 1.6;
  margin-bottom: 24rpx;
}

.card-images {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16rpx;
  margin-bottom: 24rpx;
}

.image-item {
  aspect-ratio: 1;
  border-radius: $border-radius-medium;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 24rpx;
  border-top: 2rpx solid rgba(113, 88, 92, 0.1);
}

.footer-left {
  display: flex;
  gap: 32rpx;
}

.footer-right {
  display: flex;
  gap: 16rpx;
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
      background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2371585C'%3E%3Cpath d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/%3E%3C/svg%3E")
        no-repeat center;
      background-size: 100%;
    }
  }
}

.like-icon {
  width: 100%;
  height: 100%;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23807476'%3E%3Cpath d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;
}

.comment-icon {
  width: 100%;
  height: 100%;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23807476'%3E%3Cpath d='M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2z'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;
}

.edit-icon {
  width: 36rpx;
  height: 36rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23807476'%3E%3Cpath d='M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;
  opacity: 0.6;
}

.footer-count {
  font-size: $font-size-helper;
  font-weight: $font-weight-bold;
  color: $color-gray-medium;
}

.footer-text {
  font-size: $font-size-helper;
  color: $color-gray-medium;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 0;
}

.empty-icon {
  width: 200rpx;
  height: 200rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23D2C3C4'%3E%3Cpath d='M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;
  margin-bottom: 32rpx;
  opacity: 0.4;
}

.empty-text {
  font-size: $font-size-body;
  color: $color-gray-light;
  margin-bottom: 48rpx;
}

.empty-btn {
  background: $color-primary;
  padding: 24rpx 64rpx;
  border-radius: $border-radius-large;
  box-shadow: 0 8rpx 24rpx rgba(113, 88, 92, 0.2);

  &:active {
    transform: scale(1);
  }
}

.btn-text {
  font-size: $font-size-body;
  font-weight: $font-weight-bold;
  color: $color-bg-white;
}

.bottom-hint {
  padding: 48rpx 0;
  text-align: center;
}

.hint-text {
  font-size: $font-size-helper;
  color: $color-gray-light;
}

.fab {
  position: fixed;
  bottom: 160rpx;
  right: 32rpx;
  width: 100rpx;
  height: 100rpx;
  background: $color-primary;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 24rpx rgba(113, 88, 92, 0.3);
  z-index: 9999;

  &:active {
    transform: scale(1);
    background: $color-primary-dark;
  }
}

.fab-icon {
  width: 48rpx;
  height: 48rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23FFFFFF'%3E%3Cpath d='M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;
}
</style>
