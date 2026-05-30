<template>
  <PageLayout refresher @refresh="onRefresh">
    <template #navbar>
      <TopNavBar title="我的收藏" :showBack="true" />
    </template>

    <view class="collection-inner">
        <view
          v-for="item in collectionList"
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
            <view class="uncollect-btn" @tap.stop="handleUncollect(item)">
              <image
                class="star-icon"
                src="/static/images/icon-star-filled.png"
                mode="aspectFit"
              ></image>
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
            <view class="stat-item">
              <image
                class="stat-icon"
                src="/static/images/icon-like.png"
                mode="aspectFit"
              ></image>
              <text class="stat-text">{{ item.likeCount }}</text>
            </view>
            <view class="stat-item">
              <image
                class="stat-icon"
                src="/static/images/icon-comment.png"
                mode="aspectFit"
              ></image>
              <text class="stat-text">{{ item.commentCount }}</text>
            </view>
          </view>
        </view>

        <Empty
          v-if="collectionList.length === 0 && !loading"
          type="noData"
          text="暂无收藏"
        />
    </view>

    <Loading :visible="loading" />
  </PageLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import TopNavBar from "@/components/common/TopNavBar.vue";
import PageLayout from "@/components/common/PageLayout.vue";
import Empty from "@/components/common/Empty.vue";
import Loading from "@/components/common/Loading.vue";
import { getFavoritePosts, toggleFavoritePost } from "@/api/post";
import { formatRelativeTime } from "@/utils/format";
import { resolveMediaUrl } from "@/utils/media";

const loading = ref(false);
const collectionList = ref<
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

const loadCollectionList = async () => {
  loading.value = true;
  try {
    const res = await getFavoritePosts(1, 50);
    collectionList.value = res.list.map((p) => ({
      id: p.id,
      avatar: resolveMediaUrl(p.avatar),
      nickname: p.username,
      time: formatRelativeTime(p.created_at),
      content: p.content,
      images: (p.images || []).map((url) => resolveMediaUrl(url)),
      likeCount: p.likes || 0,
      commentCount: p.comments || 0,
    }));
  } catch {
    uni.showToast({ title: "加载失败", icon: "none" });
  } finally {
    loading.value = false;
  }
};

onMounted(loadCollectionList);

const onRefresh = () => loadCollectionList();
const loadMore = () => {};

const goToDetail = (id: number) => {
  uni.navigateTo({ url: `/pages/circle/detail?id=${id}` });
};

const handleUncollect = (item: { id: number }) => {
  uni.showModal({
    title: "提示",
    content: "确定取消收藏吗？",
    success: async (res) => {
      if (!res.confirm) return;
      try {
        await toggleFavoritePost(item.id);
        collectionList.value = collectionList.value.filter((c) => c.id !== item.id);
        uni.showToast({ title: "取消收藏", icon: "success" });
      } catch {
        uni.showToast({ title: "操作失败", icon: "none" });
      }
    },
  });
};
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";

.collection-inner {
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

    .uncollect-btn {
      width: 56rpx;
      height: 56rpx;
      display: flex;
      align-items: center;
      justify-content: center;

      .star-icon {
        width: 36rpx;
        height: 36rpx;
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
        width: 32rpx;
        height: 32rpx;
      }

      .stat-text {
        font-size: $font-size-body;
        color: $color-gray-medium;
      }
    }
  }
}
</style>
