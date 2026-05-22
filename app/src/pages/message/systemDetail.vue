<template>
  <view class="system-detail-page">
    <TopNavBar title="系统通知" :showBack="true" />

    <view class="page-content">
      <view class="notice-card">
        <view class="notice-icon-wrapper">
          <image
            class="notice-icon"
            src="/static/images/icon-like-filled.png"
            mode="aspectFit"
          ></image>
        </view>
        <text class="notice-title">点赞通知</text>
        <text class="notice-time">2小时前</text>
        <view class="notice-content">
          <text class="content-text">铲屎官小王 赞了你的动态</text>
        </view>
        <view class="action-btn" @tap="goToRelated">
          <text class="btn-text">查看动态</text>
        </view>
      </view>
    </view>

    <Loading :visible="loading" />
  </view>
</template>

<script setup>
import { ref, onMounted } from "vue";
import TopNavBar from "@/components/common/TopNavBar.vue";
import Loading from "@/components/common/Loading.vue";

const loading = ref(false);
const noticeDetail = ref({
  id: 1,
  icon: "/static/images/icon-like-filled.png",
  title: "点赞通知",
  time: "2小时前",
  content: "铲屎官小王 赞了你的动态",
});

onMounted(() => {
  loadNoticeDetail();
});

const loadNoticeDetail = () => {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
  }, 1000);
};

const goToRelated = () => {
  uni.vibrateShort({ type: "medium" });
  uni.navigateTo({
    url: "/pages/circle/detail?id=1",
  });
};
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";

.system-detail-page {
  min-height: 100vh;
  background: $color-bg-primary;
}

.page-content {
  padding-top: calc(#{$nav-bar-height} + 20rpx);
  padding: calc(#{$nav-bar-height} + 20rpx) $spacing-page-horizontal;
  padding-bottom: calc(40rpx + env(safe-area-inset-bottom));
}

.notice-card {
  background: $color-bg-white;
  border-radius: $border-radius-base;
  padding: $spacing-component;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-component;
  box-shadow: $shadow-light;

  .notice-icon-wrapper {
    width: 120rpx;
    height: 120rpx;
    background: linear-gradient(135deg, $color-primary 0%, #ffd4f0 100%);
    border-radius: $border-radius-circle;
    display: flex;
    align-items: center;
    justify-content: center;

    .notice-icon {
      width: 64rpx;
      height: 64rpx;
    }
  }

  .notice-title {
    font-size: $font-size-title;
    font-weight: $font-weight-bold;
    color: $color-gray-dark;
  }

  .notice-time {
    font-size: $font-size-body;
    color: $color-gray-lighter;
  }

  .notice-content {
    box-sizing: border-box;
    width: 100%;
    padding: $spacing-component;
    background: $color-bg-primary;
    border-radius: $border-radius-base;

    .content-text {
      font-size: $font-size-body;
      color: $color-gray-dark;
      line-height: 1.6;
    }
  }

  .action-btn {
    width: 100%;
    height: $button-height-large;
    background: linear-gradient(135deg, $color-primary 0%, #ffd4f0 100%);
    border-radius: $border-radius-base;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: $shadow-pink;
    transition: transform $transition-base ease;

    &:active {
      transform: scale($scale-press);
    }

    .btn-text {
      font-size: $font-size-button;
      font-weight: $font-weight-bold;
      color: $color-bg-white;
    }
  }
}
</style>
