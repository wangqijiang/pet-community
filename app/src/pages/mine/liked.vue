<template>
  <PageLayout refresher @refresh="onRefresh">
    <template #navbar>
      <TopNavBar title="我的点赞" :showBack="true" />
    </template>

    <view class="liked-inner">
      <view
        v-for="item in likedList"
        :key="item.id"
        class="dynamic-card"
        @tap="goToDetail(item.id)"
      >
        <view class="card-header">
          <image
            class="user-avatar"
            :src="item.avatar"
            mode="aspectFill"
          ></image>
          <view class="user-info">
            <text class="user-name">{{ item.nickname }}</text>
            <text class="post-time">{{ item.time }}</text>
          </view>
        </view>

        <text class="post-content">{{ item.content }}</text>

        <view
          v-if="item.images && item.images.length > 0"
          class="post-images"
        >
          <image
            v-for="(img, index) in item.images"
            :key="index"
            class="post-image"
            :class="{ single: item.images.length === 1 }"
            :src="img"
            mode="aspectFill"
          ></image>
        </view>

        <view class="card-footer">
          <view class="stat-item" @tap.stop="handleUnlike(item)">
            <text class="stat-icon liked">♥</text>
            <text class="stat-text">{{ item.likeCount }}</text>
          </view>
          <view class="stat-item" @tap.stop="goToDetail(item.id)">
            <text class="stat-icon">💬</text>
            <text class="stat-text">{{ item.commentCount }}</text>
          </view>
        </view>
      </view>

      <Empty
        v-if="likedList.length === 0 && !loading"
        title="暂无点赞"
        description="去萌宠圈看看吧"
      />
    </view>

    <Loading :visible="loading" />
  </PageLayout>
</template>

<script setup lang="ts">
import { showRequestError, showToast } from "@/utils/request";
import { ref, onMounted } from "vue";
import TopNavBar from "@/components/common/TopNavBar.vue";
import PageLayout from "@/components/common/PageLayout.vue";
import Empty from "@/components/common/Empty.vue";
import Loading from "@/components/common/Loading.vue";
import { getLikedPosts, toggleLikePost } from "@/api/post";
import { formatRelativeTime } from "@/utils/format";
import { resolveMediaUrl } from "@/utils/media";
import { useDialog } from "@/composables/useComponents";

const dialog = useDialog();

const loading = ref(false);
const likedList = ref<
  Array<{
    id: number;
    avatar: string;
    nickname: string;
    time: string;
    content: string;
    images: string[];
    likeCount: number;
    commentCount: number;
  }>
>([]);

const loadLikedList = async () => {
  loading.value = true;
  try {
    const res = await getLikedPosts(1, 50);
    likedList.value = res.list.map((p) => ({
      id: p.id,
      avatar: resolveMediaUrl(p.avatar),
      nickname: p.username,
      time: formatRelativeTime(p.created_at),
      content: p.content,
      images: (p.images || []).map((url) => resolveMediaUrl(url)),
      likeCount: p.likes || 0,
      commentCount: p.comments || 0,
    }));
  } catch (error) {
    showRequestError(error, "加载失败");
  } finally {
    loading.value = false;
  }
};

onMounted(loadLikedList);

const onRefresh = () => loadLikedList();

const goToDetail = (id: number) => {
  uni.navigateTo({ url: `/pages/circle/detail?id=${id}` });
};

const handleUnlike = (item: { id: number }) => {
  dialog.confirm({
    title: "提示",
    content: "确定取消点赞吗？",
    success: async (res) => {
      if (!res.confirm) return;
      try {
        await toggleLikePost(item.id);
        likedList.value = likedList.value.filter((c) => c.id !== item.id);
        showToast({ title: "已取消点赞", icon: "success" });
      } catch (error) {
        showRequestError(error, "操作失败");
      }
    },
  });
};
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";

.liked-inner {
  padding: 0 $spacing-page-horizontal 32rpx;
  box-sizing: border-box;
}

.dynamic-card {
  background: $color-bg-white;
  border-radius: $border-radius-base;
  padding: $spacing-component;
  margin-bottom: $spacing-component;
  box-shadow: $shadow-light;

  .card-header {
    display: flex;
    align-items: center;
    gap: $spacing-small;
    margin-bottom: $spacing-item;

    .user-avatar {
      width: $avatar-size-small;
      height: $avatar-size-small;
      border-radius: $border-radius-circle;
    }

    .user-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 4rpx;

      .user-name {
        font-size: $font-size-button;
        font-weight: $font-weight-bold;
        color: $color-gray-dark;
      }

      .post-time {
        font-size: $font-size-helper;
        color: $color-gray-lighter;
      }
    }
  }

  .post-content {
    font-size: $font-size-body;
    color: $color-gray-dark;
    line-height: 1.6;
    margin-bottom: $spacing-item;
  }

  .post-images {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-small;
    margin-bottom: $spacing-item;

    .post-image {
      width: calc((100% - #{$spacing-small} * 2) / 3);
      height: 200rpx;
      border-radius: $border-radius-base;

      &.single {
        width: 100%;
        height: 400rpx;
      }
    }
  }

  .card-footer {
    display: flex;
    align-items: center;
    gap: $spacing-component;
    padding-top: $spacing-item;
    border-top: $border-width solid $border-color;

    .stat-item {
      display: flex;
      align-items: center;
      gap: 8rpx;

      .stat-icon {
        font-size: 28rpx;
        line-height: 1;

        &.liked {
          color: #f4a259;
        }
      }

      .stat-text {
        font-size: $font-size-body;
        color: $color-gray-medium;
      }
    }
  }
}
</style>
