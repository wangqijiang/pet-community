<template>
  <PageLayout
    refresher
    :refresher-triggered="isRefreshing"
    @refresh="onRefresh"
    @scrolltolower="loadMore"
  >
    <template #navbar>
      <TopNavBar title="我的动态" showBack />
    </template>

    <view class="page-inner my-dynamic-inner">
      <view class="stats-card">
        <view class="stat">
          <text class="stat-num">{{ dynamicList.length }}</text>
          <text class="stat-label">全部动态</text>
        </view>
        <view class="stat">
          <text class="stat-num">{{ totalLikes }}</text>
          <text class="stat-label">获赞总数</text>
        </view>
        <view class="stat">
          <text class="stat-num">{{ totalComments }}</text>
          <text class="stat-label">评论总数</text>
        </view>
      </view>

      <view class="feed-list">
        <view
          v-for="item in dynamicList"
          :key="item.id"
          class="post-card"
          @click="goToDetail(item)"
        >
          <view class="post-header">
            <view class="user">
              <image class="avatar" :src="item.avatar" mode="aspectFill" />
              <view class="user-info">
                <text class="username">{{ item.userName }}</text>
                <text class="time">{{ item.time }}</text>
              </view>
            </view>
          </view>

          <text class="post-content" @click.stop="goToDetail(item)">{{ item.content }}</text>

          <view
            class="image-grid"
            :class="item.images.length === 1 ? 'grid-1' : 'grid-3'"
          >
            <image
              v-for="(img, imgIndex) in item.images"
              :key="imgIndex"
              class="post-image"
              :class="item.images.length === 1 ? 'single-image' : ''"
              :src="img.url"
              mode="aspectFill"
              @click.stop="previewImage(item, imgIndex)"
            />
          </view>

          <PostProtagonistPets :pets="item.pets" />

          <view class="post-footer">
            <view class="left-actions">
              <view class="action" @click.stop="handleLike(item)">
                <view class="action-icon" :class="{ 'is-liked': item.liked }">
                  <view class="icon-heart"></view>
                </view>
                <text class="action-count">{{ item.likes }}</text>
              </view>
              <view class="action" @click.stop="goToDetail(item)">
                <view class="action-icon">
                  <view class="icon-comment"></view>
                </view>
                <text class="action-count">{{ item.comments }}</text>
              </view>
              <view class="action" @click.stop="handleShare(item)">
                <view class="action-icon">
                  <view class="icon-share"></view>
                </view>
                <text class="action-count">分享</text>
              </view>
            </view>
            <view class="right-actions">
              <view class="edit-btn" @click.stop="handleEdit(item)">
                <view class="edit-icon"></view>
                <text class="edit-text">编辑</text>
              </view>
              <view class="delete-btn" @click.stop="handleDelete(item)">
                <view class="delete-icon"></view>
                <text class="delete-text">删除</text>
              </view>
            </view>
          </view>
        </view>

        <view v-if="dynamicList.length === 0" class="empty-state">
          <view class="empty-illustration"></view>
          <text class="empty-text">还没有发布过动态哦</text>
          <view class="empty-btn" @click="goToPublish">
            <text class="btn-text">去发布</text>
          </view>
        </view>

        <view v-if="dynamicList.length > 0" class="bottom-hint">
          <text class="hint-text">已经到底啦～</text>
        </view>
      </view>
    </view>

    <template #fixed>
      <view class="fab" @click="goToPublish">
        <view class="fab-icon"></view>
      </view>
    </template>

    <PostSharePanel v-model:visible="shareVisible" :post="sharePost" />
  </PageLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { onShow } from "@dcloudio/uni-app";
import TopNavBar from "@/components/common/TopNavBar.vue";
import PageLayout from "@/components/common/PageLayout.vue";
import PostSharePanel from "@/components/common/PostSharePanel.vue";
import PostProtagonistPets from "@/components/common/PostProtagonistPets.vue";
import { getPostList, deletePost, toggleLikePost } from "@/api/post";
import { getUserInfo as getStoredUser } from "@/api/auth";
import { formatRelativeTime } from "@/utils/format";
import { resolveMediaUrl } from "@/utils/media";
import type { PostShareInput } from "@/utils/postShare";
import { usePostShareRegistry } from "@/composables/usePostShare";

usePostShareRegistry();

import type { Post } from "@/api/post";

type SharePet = {
  id: number;
  name: string;
  avatar: string;
  type?: string;
};

type DynamicItem = {
  id: number;
  userName: string;
  avatar: string;
  time: string;
  content: string;
  images: Array<{ url: string }>;
  likes: number;
  comments: number;
  liked: boolean;
  pets: SharePet[];
};

const mapPostPets = (pets?: Post["pets"]): SharePet[] =>
  (pets || []).map((pet) => ({
    id: pet.id,
    name: pet.name,
    avatar: resolveMediaUrl(pet.avatar || ""),
    type: pet.type,
  }));

const loading = ref(false);
const isRefreshing = ref(false);
const myUserId = ref(0);

const dynamicList = ref<DynamicItem[]>([]);
const shareVisible = ref(false);
const sharePost = ref<PostShareInput | null>(null);

const totalLikes = computed(() => {
  return dynamicList.value.reduce((sum, item) => sum + item.likes, 0);
});

const totalComments = computed(() => {
  return dynamicList.value.reduce((sum, item) => sum + item.comments, 0);
});

const loadDynamics = async () => {
  if (!myUserId.value) return;
  loading.value = true;
  try {
    const res = await getPostList(1, 50, myUserId.value);
    dynamicList.value = res.list.map((p) => ({
      id: p.id,
      userName: p.username,
      avatar: resolveMediaUrl(p.avatar),
      time: formatRelativeTime(p.created_at),
      content: p.content,
      images: (p.images || []).map((url) => ({ url: resolveMediaUrl(url) })),
      likes: p.likes_count ?? p.likes ?? 0,
      comments: p.comments_count ?? p.comments ?? 0,
      liked: !!p.liked,
      pets: mapPostPets(p.pets),
    }));
  } catch {
    uni.showToast({ title: "加载失败", icon: "none" });
  } finally {
    loading.value = false;
    isRefreshing.value = false;
  }
};

const onRefresh = () => {
  isRefreshing.value = true;
  loadDynamics();
};

const loadMore = () => {};

onMounted(() => {
  const u = getStoredUser();
  if (u) {
    myUserId.value = u.id;
  }
  uni.$on("refreshPostList", loadDynamics);
});

onShow(() => {
  if (myUserId.value) {
    loadDynamics();
  } else {
    const u = getStoredUser();
    if (u) {
      myUserId.value = u.id;
      loadDynamics();
    }
  }
});

onUnmounted(() => {
  uni.$off("refreshPostList", loadDynamics);
});

const goToDetail = (item: DynamicItem) => {
  uni.vibrateShort({ type: "light" });
  uni.navigateTo({ url: `/pages/circle/detail?id=${item.id}` });
};

const handleShare = (item: DynamicItem) => {
  uni.vibrateShort({ type: "light" });
  sharePost.value = {
    id: item.id,
    userName: item.userName,
    avatar: item.avatar,
    time: item.time,
    content: item.content,
    images: item.images.map((img) => img.url),
    likes: item.likes,
    comments: item.comments,
    pets: item.pets,
  };
  shareVisible.value = true;
};

const handleLike = async (item: DynamicItem) => {
  uni.vibrateShort({ type: "light" });
  try {
    const res = await toggleLikePost(item.id);
    item.liked = res.liked;
    item.likes = Math.max(0, item.likes + (res.liked ? 1 : -1));
  } catch {
    uni.showToast({ title: "操作失败", icon: "none" });
  }
};

const handleEdit = (item: DynamicItem) => {
  uni.vibrateShort({ type: "light" });
  uni.navigateTo({
    url: `/pages/circle/publish?editId=${item.id}`,
  });
};

const handleDelete = (item: { id: number }) => {
  uni.vibrateShort({ type: "light" });
  uni.showModal({
    title: "删除动态",
    content: "确定要删除这条动态吗？删除后无法恢复",
    confirmColor: "#FF6B8A",
    success: async (res) => {
      if (!res.confirm) return;
      try {
        await deletePost(item.id);
        dynamicList.value = dynamicList.value.filter((d) => d.id !== item.id);
        uni.$emit("refreshPostList");
        uni.showToast({ title: "删除成功", icon: "success" });
      } catch {
        uni.showToast({ title: "删除失败", icon: "none" });
      }
    },
  });
};

const previewImage = (item: DynamicItem, index: number) => {
  const imageUrls = item.images.map((img) => img.url);
  uni.previewImage({
    urls: imageUrls,
    current: index,
  });
};

const goToPublish = () => {
  uni.navigateTo({
    url: "/pages/circle/publish",
  });
};
</script>

<style lang="scss" scoped>
@import "@/styles/layout.scss";

.my-dynamic-inner {
  padding-top: 0;
  background: #fff8f5;
}

.stats-card {
  margin: 44rpx 36rpx 0;
  background: white;
  border-radius: 64rpx;
  padding: 48rpx 20rpx;
  display: flex;
  justify-content: space-around;
  box-shadow: 0 24rpx 60rpx rgba(107, 78, 61, 0.05);
}

.stat {
  flex: 1;
  text-align: center;
  position: relative;
  display: flex;
  flex-direction: column;
}

.stat:not(:last-child)::after {
  content: "";
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 2rpx;
  height: 84rpx;
  background: #f1e6e0;
}

.stat-num {
  font-size: 72rpx;
  font-weight: 800;
  color: #7b5e5e;
  line-height: 1;
}

.stat-label {
  margin-top: 16rpx;
  font-size: 26rpx;
  color: #aa9f9f;
}

.feed-list {
  padding: 44rpx 36rpx 160rpx;
  max-height: 600px;
  overflow: scroll;
}

.post-card {
  background: white;
  border-radius: 68rpx;
  padding: 44rpx;
  margin-bottom: 40rpx;
  box-shadow: 0 24rpx 60rpx rgba(107, 78, 61, 0.05);
}

.post-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.user {
  display: flex;
  align-items: center;
  gap: 28rpx;
}

.avatar {
  width: 116rpx;
  height: 116rpx;
  border-radius: 44rpx;
  object-fit: cover;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.username {
  font-size: 40rpx;
  font-weight: 800;
  color: #3d2f2f;
}

.time {
  font-size: 26rpx;
  color: #b0a6a6;
}

.post-content {
  margin-top: 36rpx;
  font-size: 34rpx;
  line-height: 2;
  color: #4f4242;
  font-weight: 500;
}

.image-grid {
  margin-top: 40rpx;
  display: grid;
  gap: 20rpx;

  &.grid-3 {
    grid-template-columns: repeat(3, 1fr);
  }

  &.grid-1 {
    grid-template-columns: 1fr;
  }
}

.post-image {
  width: 100%;
  height: 320rpx;
  border-radius: 48rpx;
  object-fit: cover;

  &.single-image {
    height: 440rpx;
  }
}

.post-footer {
  margin-top: 44rpx;
  padding-top: 36rpx;
  border-top: 2rpx solid #f4ece7;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.left-actions {
  display: flex;
  align-items: center;
  gap: 44rpx;
}

.action {
  display: flex;
  align-items: center;
  gap: 16rpx;
  color: #7a6e6e;
  font-size: 30rpx;
  font-weight: 700;
}

.action-icon {
  width: 44rpx;
  height: 44rpx;

  &.is-liked {
    .icon-heart {
      background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23FFB36B' stroke='%23FFB36B' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z'/%3E%3C/svg%3E")
        no-repeat center;
      background-size: 100%;
    }
  }
}

.icon-heart {
  width: 100%;
  height: 100%;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%237A6E6E' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;
}

.icon-comment {
  width: 100%;
  height: 100%;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%237A6E6E' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M7.9 20A9 9 0 1 0 4 16.1L2 22Z'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;
}

.icon-share {
  width: 100%;
  height: 100%;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%237A6E6E' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8'/%3E%3Cpolyline points='16 6 12 2 8 6'/%3E%3Cline x1='12' y1='2' x2='12' y2='15'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;
}

.action-count {
  font-size: 30rpx;
  font-weight: 700;
  color: #7a6e6e;
}

.right-actions {
  display: flex;
  align-items: center;
  gap: 28rpx;
}

.edit-btn,
.delete-btn {
  display: flex;
  align-items: center;
  gap: 12rpx;
  font-size: 28rpx;
  font-weight: 700;
}

.edit-btn {
  color: #b0a6a6;
}

.delete-btn {
  color: #e07a7a;
}

.delete-icon {
  width: 36rpx;
  height: 36rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23E07A7A' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M3 6h18'/%3E%3Cpath d='M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6'/%3E%3Cpath d='M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2'/%3E%3Cline x1='10' y1='11' x2='10' y2='17'/%3E%3Cline x1='14' y1='11' x2='14' y2='17'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;
}

.edit-icon {
  width: 36rpx;
  height: 36rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23B0A6A6' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 160rpx 0;
}

.empty-illustration {
  width: 240rpx;
  height: 240rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23D2C3C4' stroke-width='1' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;
  opacity: 0.4;
  margin-bottom: 32rpx;
}

.empty-text {
  font-size: 28rpx;
  color: #b0a6a6;
  margin-bottom: 48rpx;
}

.empty-btn {
  background: linear-gradient(135deg, #8b6d73, #7a5c62);
  padding: 24rpx 64rpx;
  border-radius: 999rpx;
  box-shadow: 0 16rpx 32rpx rgba(139, 109, 115, 0.28);

  &:active {
    transform: scale(1.02);
  }
}

.btn-text {
  font-size: 28rpx;
  font-weight: 700;
  color: white;
}

.bottom-hint {
  padding: 96rpx 0;
  text-align: center;
}

.hint-text {
  font-size: 24rpx;
  color: #b0a6a6;
}

.fab {
  position: fixed;
  right: 44rpx;
  bottom: 68rpx;
  width: 148rpx;
  height: 148rpx;
  border-radius: 999rpx;
  background: linear-gradient(135deg, #8b6d73, #7a5c62);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 32rpx 64rpx rgba(139, 109, 115, 0.28);
  z-index: 9999;
  transition: all 0.2s ease;

  &:active {
    transform: scale(1.04);
  }
}

.fab-icon {
  width: 64rpx;
  height: 64rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23FFFFFF' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cline x1='12' y1='5' x2='12' y2='19'/%3E%3Cline x1='5' y1='12' x2='19' y2='12'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;
}
</style>
