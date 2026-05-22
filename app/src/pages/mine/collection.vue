<template>
  <view class="collection-page">
    <TopNavBar title="我的收藏" :showBack="true" />

    <view class="page-content">
      <scroll-view
        class="dynamic-list"
        scroll-y
        @scrolltolower="loadMore"
        refresher-enabled
        @refresherrefresh="onRefresh"
      >
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
      </scroll-view>
    </view>

    <Loading :visible="loading" />
  </view>
</template>

<script setup>
import { ref, onMounted } from "vue";
import TopNavBar from "@/components/common/TopNavBar.vue";
import Empty from "@/components/common/Empty.vue";
import Loading from "@/components/common/Loading.vue";

const loading = ref(false);

const collectionList = ref([
  {
    id: 1,
    avatar: "/static/images/avatar-default.png",
    nickname: "铲屎官小王",
    time: "2小时前",
    content: "今天带旺财去公园玩，遇到了好多小伙伴！",
    images: [
      "/static/images/post-default.png",
      "/static/images/post-default.png",
    ],
    likeCount: 128,
    commentCount: 32,
  },
  {
    id: 2,
    avatar: "/static/images/avatar-default.png",
    nickname: "爱狗人士",
    time: "昨天",
    content: "分享一下我家狗狗的日常～",
    images: ["/static/images/post-default.png"],
    likeCount: 256,
    commentCount: 48,
  },
]);

onMounted(() => {
  loadCollectionList();
});

const loadCollectionList = () => {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
  }, 1000);
};

const onRefresh = () => {
  loadCollectionList();
};

const loadMore = () => {
  console.log("Load more");
};

const goToDetail = (id) => {
  uni.navigateTo({
    url: `/pages/circle/detail?id=${id}`,
  });
};

const handleUncollect = (item) => {
  uni.vibrateShort({ type: "medium" });
  uni.showModal({
    title: "提示",
    content: "确定取消收藏吗？",
    success: (res) => {
      if (res.confirm) {
        const index = collectionList.value.findIndex((c) => c.id === item.id);
        if (index > -1) {
          collectionList.value.splice(index, 1);
        }
        uni.showToast({
          title: "取消收藏",
          icon: "success",
        });
      }
    },
  });
};
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";

.collection-page {
  width: 100%;
  min-height: 100vh;
  background: $color-bg-primary;
}

.page-content {
  padding-top: calc(#{$nav-bar-height} + 20rpx);
}

.dynamic-list {
  height: calc(100vh - #{$nav-bar-height} - 40rpx);
  padding: 0 $spacing-page-horizontal;
  padding-bottom: calc(40rpx + env(safe-area-inset-bottom));
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
