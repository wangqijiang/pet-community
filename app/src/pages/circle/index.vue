<template>
  <view class="circle-container">
    <TopNavBar
      title="萌宠朋友圈 🐾"
      :showBack="false"
      rightIcon="icon-ellipsis"
    />

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

    <scroll-view 
      scroll-y 
      class="feed-list"
      :refresher-enabled="true"
      :refresher-triggered="refreshing"
      @refresherrefresh="onRefresh"
      @scrolltolower="onLoadMore"
    >
      <view v-if="feedList.length === 0 && !loading" class="empty-state">
        <view class="empty-icon"></view>
        <text class="empty-text">暂无动态，快来发布第一条吧～</text>
      </view>
      
      <view
        v-for="(item, index) in filteredList"
        :key="item.id"
        class="feed-card"
        @click="goToDetail(item)"
      >
        <view class="card-header">
          <view class="user-row">
            <view class="user-left">
              <view class="user-avatar" @tap="goToUserProfile(item)">
                <image v-if="item.avatar" :src="getAvatarUrl(item.avatar)" mode="aspectFill" />
                <view v-else class="avatar-placeholder"></view>
              </view>
              <view class="user-info">
                <view class="user-name-row">
                  <text class="user-name">{{ item.username }}</text>
                  <text class="level">Lv.2</text>
                </view>
                <text class="user-meta">{{ formatTime(item.created_at) }}</text>
              </view>
            </view>
            <view class="header-right">
              <view v-if="isOwnPost(item)" class="delete-btn" @click.stop="handleDelete(item)">
                <view class="delete-icon"></view>
              </view>
              <view v-else class="more-icon"></view>
            </view>
          </view>
        </view>

        <text class="card-content">{{ item.content }}</text>

        <view class="card-images" v-if="item.images && item.images.length > 0">
          <image
            v-for="(img, imgIndex) in item.images"
            :key="imgIndex"
            class="image-item"
            :src="img"
            mode="aspectFill"
            @click.stop="previewImage(item, imgIndex)"
          />
        </view>

        <view class="location" v-if="item.location">
          <view class="location-left">
            <view class="location-icon"></view>
            <text class="location-text">{{ item.location }}</text>
          </view>
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

      <view v-if="loading" class="loading-more">
        <text>加载中...</text>
      </view>
      
      <view v-if="!loading && !hasMore && feedList.length > 0" class="no-more">
        <text>没有更多了</text>
      </view>
    </scroll-view>

    <view class="fab" @click="goToPublish">
      <view class="fab-icon"></view>
    </view>

    <TabBar :current="1" />
  </view>
</template>

<script setup lang="ts">
import TopNavBar from "@/components/common/TopNavBar.vue";
import TabBar from "@/components/common/TabBar.vue";
import { ref, computed, onMounted, onUnmounted } from "vue";
import { getPostList, likePost, unlikePost, deletePost, checkLiked, type Post } from "@/api/post";
import { getUserInfo } from "@/api/auth";

const currentTab = ref(0);
const feedList = ref<(Post & { images: string[]; liked: boolean })[]>([]);
const loading = ref(false);
const refreshing = ref(false);
const page = ref(1);
const size = ref(10);
const hasMore = ref(true);
const currentUser = ref(getUserInfo());

const tabs = [
  { label: "全部动态", key: "all" },
  { label: "修勾日常", key: "daily" },
  { label: "技能秀场", key: "skill" },
  { label: "寻宠启事", key: "lost" },
  { label: "遛狗搭子", key: "walk" },
  { label: "养宠种草", key: "share" },
];

const filteredList = computed(() => {
  if (currentTab.value === 0) return feedList.value;
  return feedList.value;
});

const isOwnPost = (item: any) => {
  return currentUser.value && currentUser.value.id === item.user_id;
};

const getAvatarUrl = (avatar: string) => {
  if (!avatar) return "";
  if (avatar.startsWith("http")) return avatar;
  return `${import.meta.env.VITE_API_BASE_URL || "https://api.example.com"}${avatar}`;
};

const goToUserProfile = (item: any) => {
  uni.navigateTo({
    url: `/pages/mine/userProfile?id=${item.user_id}&name=${encodeURIComponent(item.username)}`,
  });
};

const goToPublish = () => {
  uni.navigateTo({
    url: "/pages/circle/publish",
  });
};

const goToDetail = (item: any) => {
  uni.navigateTo({
    url: "/pages/circle/detail?id=" + item.id,
  });
};

const loadPosts = async (pageNum: number, isRefresh = false) => {
  if (loading.value) return;
  
  loading.value = true;
  try {
    const response = await getPostList(pageNum, size.value);
    const list = await Promise.all(response.list.map(async (post) => {
      const postData = {
        ...post,
        images: typeof post.images === 'string' ? JSON.parse(post.images) : post.images,
        liked: false
      };
      
      if (currentUser.value) {
        try {
          const likedResult = await checkLiked(post.id);
          postData.liked = likedResult.liked;
        } catch (error) {
          console.warn("检查点赞状态失败:", error);
        }
      }
      
      return postData;
    }));
    
    if (isRefresh) {
      feedList.value = list;
    } else {
      feedList.value = [...feedList.value, ...list];
    }
    
    hasMore.value = response.pagination.page < response.pagination.pages;
  } catch (error) {
    console.error("获取动态列表失败:", error);
    uni.showToast({ title: "加载失败", icon: "none" });
  } finally {
    loading.value = false;
    refreshing.value = false;
  }
};

const onRefresh = () => {
  refreshing.value = true;
  page.value = 1;
  loadPosts(1, true);
};

const onLoadMore = () => {
  if (!hasMore.value || loading.value) return;
  page.value++;
  loadPosts(page.value);
};

const handleLike = async (item: any) => {
  uni.vibrateShort({ type: "light" });
  
  if (item.liked) {
    try {
      await unlikePost(item.id);
      item.liked = false;
      item.likes--;
    } catch (error) {
      console.error("取消点赞失败:", error);
      uni.showToast({ title: "操作失败", icon: "none" });
    }
  } else {
    try {
      await likePost(item.id);
      item.liked = true;
      item.likes++;
    } catch (error) {
      console.error("点赞失败:", error);
      uni.showToast({ title: "操作失败", icon: "none" });
    }
  }
};

const handleShare = () => {
  uni.showShareMenu({
    withShareTicket: true,
  });
};

const handleDelete = async (item: any) => {
  uni.showModal({
    title: "确认删除",
    content: "确定要删除这条动态吗？",
    success: async (res) => {
      if (res.confirm) {
        try {
          await deletePost(item.id);
          uni.showToast({ title: "删除成功", icon: "success" });
          const index = feedList.value.findIndex(p => p.id === item.id);
          if (index > -1) {
            feedList.value.splice(index, 1);
          }
        } catch (error) {
          console.error("删除失败:", error);
          uni.showToast({ title: "删除失败", icon: "none" });
        }
      }
    }
  });
};

const previewImage = (item: any, index: number) => {
  if (!item.images || item.images.length === 0) return;
  
  uni.previewImage({
    urls: item.images,
    current: index,
  });
};

const formatTime = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return "刚刚";
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  if (days < 7) return `${days}天前`;
  
  return `${date.getMonth() + 1}月${date.getDate()}日`;
};

const handlePostCreated = () => {
  onRefresh();
};

onMounted(() => {
  loadPosts(1);
  uni.$on('postCreated', handlePostCreated);
});

onUnmounted(() => {
  uni.$off('postCreated', handlePostCreated);
});
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";

.circle-container {
  height: 100vh;
  background: $color-bg-primary;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.category-tabs {
  padding: 24rpx 32rpx;
  flex-shrink: 0;
}

.tab-scroll {
  white-space: nowrap;
}

.tab-list {
  display: inline-flex;
  gap: 20rpx;
}

.tab-item {
  flex-shrink: 0;
  padding: 20rpx 32rpx;
  background: $color-bg-white;
  border-radius: 999rpx;
  font-size: 26rpx;
  color: #7a6e6e;
  transition: all $transition-base;

  &.active {
    background: #ffe2c2;
    color: #d97d2f;
    font-weight: 600;
  }
}

.feed-list {
  flex: 1;
  padding: 0 32rpx;
  padding-bottom: calc(240rpx + env(safe-area-inset-bottom));
  padding-bottom: calc(240rpx + constant(safe-area-inset-bottom));
  box-sizing: border-box;
}

.feed-card {
  background: $color-bg-white;
  border-radius: 24rpx;
  padding: 32rpx;
  margin-bottom: 36rpx;
  box-shadow: 0 12rpx 40rpx rgba(107, 78, 61, 0.06);
}

.card-header {
  margin-bottom: 28rpx;
}

.user-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-left {
  display: flex;
  gap: 24rpx;
  align-items: center;
}

.user-avatar {
  width: 96rpx;
  height: 96rpx;
  border-radius: 50%;
  overflow: hidden;
}

.avatar-bg {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: linear-gradient(135deg, #FFC1E9, #FFD4F0);
}

.user-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.user-name-row {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.user-name {
  font-size: 32rpx;
  font-weight: 700;
  color: #3d2f2f;
}

.level {
  background: #fff0d9;
  color: #e49743;
  font-size: 22rpx;
  padding: 6rpx 16rpx;
  border-radius: 999rpx;
  font-weight: 600;
}

.user-meta {
  font-size: 24rpx;
  color: #9b9090;
}

.header-right {
  display: flex;
  align-items: center;
}

.more-icon {
  width: 40rpx;
  height: 40rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%237A6E6E'%3E%3Cpath d='M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;
}

.delete-btn {
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff0f0;
  border-radius: 50%;
  
  &:active {
    background: #ffe0e0;
  }
}

.delete-icon {
  width: 32rpx;
  height: 32rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23E53935'%3E%3Cpath d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;
}

.card-content {
  font-size: 30rpx;
  color: #4d3e3e;
  line-height: 1.8;
  margin-bottom: 28rpx;
}

.card-images {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16rpx;
  margin-bottom: 28rpx;
}

.image-item {
  aspect-ratio: 1;
  border-radius: 16rpx;
}

.location {
  background: #fff5ea;
  border-radius: 16rpx;
  padding: 24rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32rpx;
}

.location-left {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.location-icon {
  width: 32rpx;
  height: 32rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%237B5B45'%3E%3Cpath d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;
}

.location-text {
  font-size: 28rpx;
  color: #7b5b45;
}

.location-distance {
  font-size: 28rpx;
  color: #7b5b45;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 32rpx;
}

.footer-left {
  display: flex;
  gap: 36rpx;
}

.footer-item {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.footer-icon {
  width: 36rpx;
  height: 36rpx;

  &.liked {
    .like-icon {
      background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23FF4757'%3E%3Cpath d='M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z'/%3E%3C/svg%3E")
        no-repeat center;
      background-size: 100%;
    }
  }
}

.like-icon {
  width: 100%;
  height: 100%;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%237A6E6E' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;
}

.comment-icon {
  width: 100%;
  height: 100%;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%237A6E6E' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;
}

.share-icon {
  width: 36rpx;
  height: 36rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%237A6E6E' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;
}

.footer-count {
  font-size: 28rpx;
  color: #7a6e6e;
}

.fab {
  position: fixed;
  right: 48rpx;
  bottom: calc(180rpx + env(safe-area-inset-bottom));
  width: 120rpx;
  height: 120rpx;
  background: linear-gradient(135deg, #FFB6C1, #FFC1E9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 16rpx 48rpx rgba(255, 182, 193, 0.4);
  z-index: 100;

  &:active {
    transform: scale(0.95);
  }
}

.fab-icon {
  width: 56rpx;
  height: 56rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23FFFFFF'%3E%3Cpath d='M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 200rpx 0;
  gap: 32rpx;
}

.empty-icon {
  width: 200rpx;
  height: 200rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23D4C8C9'%3E%3Cpath d='M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;
}

.empty-text {
  font-size: 28rpx;
  color: #9B9090;
}

.loading-more,
.no-more {
  text-align: center;
  padding: 32rpx 0;
  font-size: 26rpx;
  color: #9B9090;
}
</style>
