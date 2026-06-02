<template>
  <PageLayout
    :tab-bar="true"
    :header-height="categoryTabsHeight"
    refresher
    :refresher-triggered="refreshing"
    @refresh="onRefresh"
    @scrolltolower="onLoadMore"
  >
    <template #navbar>
      <TopNavBar title="萌宠朋友圈" :showBack="false" />
    </template>

    <template #header>
      <view class="category-tabs">
        <scroll-view scroll-x class="tab-scroll" :show-scrollbar="false">
          <view class="tab-list">
            <view
              v-for="(tab, index) in tabs"
              :key="tab.key"
              class="tab-item"
              :class="{ active: currentTab === index }"
              @click="switchTab(index)"
            >
              {{ tab.label }}
            </view>
          </view>
        </scroll-view>
      </view>
    </template>

    <Empty
      v-if="feedList.length === 0 && !loading"
      title="暂无动态"
      description="快来发布第一条吧～"
      button-text="去发布"
      @click="goToPublish"
    />

    <view
      v-for="item in filteredList"
      :key="item.id"
      class="feed-card"
      @click="goToDetail(item)"
    >
      <view class="card-header">
        <view class="user-row">
          <view class="user-left">
            <view class="user-avatar" @tap.stop="goToUserProfile(item)">
              <image
                :src="resolveAvatarUrl(item.avatar, item.user_id)"
                mode="aspectFill"
              />
            </view>
            <view class="user-info">
              <text class="user-name">{{ item.username }}</text>
              <text class="user-meta">{{ formatTime(item.created_at) }}</text>
            </view>
          </view>
          <view class="header-right">
            <view
              v-if="isOwnPost(item)"
              class="delete-btn"
              @click.stop="handleDelete(item)"
            >
              <view class="delete-icon"></view>
            </view>
          </view>
        </view>
      </view>

      <text class="feed-card__content">{{ item.content }}</text>

      <PostImageGrid :images="item.images" />

      <PostProtagonistPets :pets="item.pets" />

      <view class="card-footer">
        <view class="footer-left">
          <view class="footer-item" @click.stop="handleLike(item)">
            <view class="footer-icon" :class="{ liked: item.liked }">
              <text class="like-icon">{{ item.liked ? "♥" : "♡" }}</text>
            </view>
            <text class="footer-count">{{ item.likes }}</text>
          </view>
          <view class="footer-item">
            <view class="footer-icon">
              <text class="comment-icon">💬</text>
            </view>
            <text class="footer-count">{{ item.comments }}</text>
          </view>
        </view>
      </view>
    </view>

    <view v-if="loading" class="loading-more">
      <text>加载中...</text>
    </view>
    <view v-if="!loading && !hasMore && feedList.length > 0" class="no-more">
      <text>没有更多了</text>
    </view>

    <template #tabbar>
      <TabBar :current="1" />
    </template>

    <template #fixed>
      <view class="fab" :style="fabStyle" @click="goToPublish">
        <view class="fab-icon"></view>
      </view>
    </template>
  </PageLayout>
</template>

<script setup lang="ts">
import { showRequestError, promptLogin, showToast } from "@/utils/request";
import TopNavBar from "@/components/common/TopNavBar.vue";
import TabBar from "@/components/common/TabBar.vue";
import PageLayout from "@/components/common/PageLayout.vue";
import PostImageGrid from "@/components/common/PostImageGrid.vue";
import PostProtagonistPets from "@/components/common/PostProtagonistPets.vue";
import Empty from "@/components/common/Empty.vue";
import { ref, computed, onMounted, onUnmounted } from "vue";
import { getLayoutMetrics } from "@/composables/useLayout";
import {
  getPostList,
  getPostCategories,
  toggleLikePost,
  deletePost,
  type Post,
  type PostCategory,
} from "@/api/post";
import { getUserInfo, isLoggedIn } from "@/api/auth";
import { resolveAvatarUrl, resolveMediaUrl } from "@/utils/media";
import { formatRelativeTime, parseJsonArray } from "@/utils/format";
import { useDialog } from "@/composables/useComponents";

const dialog = useDialog();

// 分类 Tab 实际高度：上下 padding 36rpx + 标签行约 60rpx
const categoryTabsHeight = uni.upx2px(120);
const fabStyle = computed(() => ({
  bottom: `${getLayoutMetrics().tabbarHeight + uni.upx2px(32)}px`,
  right: "32rpx",
}));

const currentTab = ref(0);
const feedList = ref<(Post & { images: string[]; liked: boolean })[]>([]);
const loading = ref(false);
const refreshing = ref(false);
const page = ref(1);
const size = ref(10);
const hasMore = ref(true);
const currentUser = ref(getUserInfo());

const ALL_TAB: PostCategory = { key: "all", label: "全部动态" };
const categories = ref<PostCategory[]>([]);
const tabs = computed(() => [ALL_TAB, ...categories.value]);
const activeCategoryKey = computed(
  () => tabs.value[currentTab.value]?.key || "all",
);

const filteredList = computed(() => feedList.value);

const isOwnPost = (item: Post) =>
  !!currentUser.value && currentUser.value.id === item.user_id;

const getAvatarUrl = (avatar: string) => resolveMediaUrl(avatar);
const formatTime = (t: string) => formatRelativeTime(t);

const goToUserProfile = (item: Post) => {
  uni.navigateTo({
    url: `/pages/mine/userProfile?id=${item.user_id}&name=${encodeURIComponent(
      item.username,
    )}`,
  });
};

const goToPublish = () => {
  if (!promptLogin()) return;
  uni.navigateTo({ url: "/pages/circle/publish" });
};

const goToDetail = (item: Post) => {
  uni.navigateTo({ url: `/pages/circle/detail?id=${item.id}` });
};

const loadCategories = async () => {
  try {
    categories.value = await getPostCategories();
  } catch (error) {
    showRequestError(error, "加载分类失败");
  }
};

const switchTab = (index: number) => {
  if (currentTab.value === index) return;
  currentTab.value = index;
  page.value = 1;
  hasMore.value = true;
  loadPosts(1, true);
};

const loadPosts = async (pageNum: number, isRefresh = false) => {
  if (loading.value) return;
  loading.value = true;
  try {
    const category =
      activeCategoryKey.value === "all" ? undefined : activeCategoryKey.value;
    const response = await getPostList(
      pageNum,
      size.value,
      undefined,
      undefined,
      category,
    );
    const list = response.list.map((post) => ({
      ...post,
      images: parseJsonArray<string>(post.images).map((url) =>
        resolveMediaUrl(url),
      ),
      liked: !!post.liked,
      likes: post.likes_count ?? post.likes ?? 0,
      comments: post.comments_count ?? post.comments ?? 0,
    }));
    feedList.value = isRefresh ? list : [...feedList.value, ...list];
    hasMore.value = response.pagination.page < response.pagination.pages;
  } catch (error) {
    if (!isRefresh && pageNum > 1) {
      page.value = Math.max(1, pageNum - 1);
    }
    showRequestError(error, "加载失败");
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

const handleLike = async (item: Post & { liked: boolean; likes: number }) => {
  if (!promptLogin()) return;
  uni.vibrateShort({ type: "light" });
  try {
    const res = await toggleLikePost(item.id);
    item.liked = res.liked;
    item.likes = Math.max(0, item.likes + (res.liked ? 1 : -1));
  } catch (error) {
    showRequestError(error, "操作失败");
  }
};

const handleDelete = async (item: Post) => {
  dialog.confirm({
    title: "确认删除",
    content: "确定要删除这条动态吗？",
    success: async (res) => {
      if (!res.confirm) return;
      try {
        await deletePost(item.id);
        feedList.value = feedList.value.filter((p) => p.id !== item.id);
        showToast({ title: "删除成功", icon: "success" });
      } catch (error) {
        showRequestError(error, "删除失败");
      }
    },
  });
};

onMounted(() => {
  loadCategories();
  loadPosts(1, true);
  uni.$on("refreshPostList", () => onRefresh());
});

onUnmounted(() => {
  uni.$off("refreshPostList");
});
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";
@import "@/styles/feed.scss";

.category-tabs {
  padding: 16rpx 32rpx 20rpx;
  background: $color-bg-primary;
}

.tab-scroll {
  white-space: nowrap;
}

.tab-list {
  display: inline-flex;
  gap: 16rpx;
}

.tab-item {
  flex-shrink: 0;
  padding: 16rpx 28rpx;
  background: $color-bg-white;
  border-radius: 999rpx;
  font-size: 26rpx;
  color: #7a6e6e;

  &.active {
    background: #ffe2c2;
    color: #d97d2f;
    font-weight: 600;
  }
}

:deep(.page-layout__inner) {
  padding: 0 32rpx 24rpx;
  box-sizing: border-box;
}

.card-header {
  margin-bottom: 20rpx;
}

.user-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-left {
  display: flex;
  gap: 20rpx;
  align-items: center;
}

.user-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  overflow: hidden;
  image {
    width: 100%;
    height: 100%;
  }
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #ffc1e9, #ffd4f0);
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.user-name {
  font-size: 30rpx;
  font-weight: 700;
  color: #3d2f2f;
}

.user-meta {
  font-size: 24rpx;
  color: #9b9090;
}

.delete-btn {
  width: 56rpx;
  height: 56rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff0f0;
  border-radius: 50%;
}

.delete-icon {
  width: 28rpx;
  height: 28rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23E53935'%3E%3Cpath d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;
}

.card-footer {
  display: flex;
  align-items: center;
  padding-top: 8rpx;
}

.footer-left {
  display: flex;
  gap: 32rpx;
}

.footer-item {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.footer-icon {
  width: 48rpx;
  height: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;

  &.liked .like-icon {
    color: #ff6b6b;
  }
}

.like-icon {
  font-size: 36rpx;
  color: #c4b5b5;
  line-height: 1;
}

.comment-icon {
  font-size: 32rpx;
  color: #c4b5b5;
  line-height: 1;
}

.footer-count {
  font-size: 24rpx;
  color: #8a7f7f;
}

.loading-more,
.no-more {
  text-align: center;
  padding: 24rpx;
  font-size: 24rpx;
  color: #9b9090;
}

.fab {
  position: fixed;
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #ffb36b, #f4a259);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 16rpx 40rpx rgba(244, 162, 89, 0.4);
  z-index: 50;
}

.fab-icon {
  width: 44rpx;
  height: 44rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23FFFFFF'%3E%3Cpath d='M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;
}
</style>
