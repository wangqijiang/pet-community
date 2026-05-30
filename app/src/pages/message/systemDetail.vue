<template>
  <PageLayout>
    <template #navbar>
      <TopNavBar title="系统通知" :showBack="true" />
    </template>

    <view class="page-inner system-detail-inner">
      <view class="notice-card">
        <view class="notice-icon-wrapper">
          <image
            class="notice-icon"
            src="/static/images/icon-like-filled.png"
            mode="aspectFit"
          ></image>
        </view>
        <text class="notice-title">{{ noticeDetail.title }}</text>
        <text class="notice-time">{{ noticeDetail.time }}</text>
        <view class="notice-content">
          <text class="content-text">{{ noticeDetail.content }}</text>
        </view>
        <view
          v-if="noticeDetail.target_id && noticeDetail.target_type === 'post'"
          class="action-btn"
          @tap="goToRelated"
        >
          <text class="btn-text">查看动态</text>
        </view>
      </view>
    </view>

    <Loading :visible="loading" />
  </PageLayout>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import TopNavBar from "@/components/common/TopNavBar.vue";
import PageLayout from "@/components/common/PageLayout.vue";
import Loading from "@/components/common/Loading.vue";
import { getNotificationDetail } from "@/api/notification";
import { formatRelativeTime } from "@/utils/format";

const loading = ref(false);
const noticeDetail = ref({
  id: 0,
  title: "",
  time: "",
  content: "",
  target_id: 0 as number | undefined,
  target_type: "" as string | undefined,
});

const loadNoticeDetail = async (id: number) => {
  loading.value = true;
  try {
    const n = await getNotificationDetail(id);
    noticeDetail.value = {
      id: n.id,
      title: n.title,
      time: formatRelativeTime(n.created_at),
      content: n.content || "",
      target_id: n.target_id,
      target_type: n.target_type,
    };
  } catch {
    uni.showToast({ title: "加载失败", icon: "none" });
  } finally {
    loading.value = false;
  }
};

const goToRelated = () => {
  if (!noticeDetail.value.target_id) return;
  uni.navigateTo({
    url: `/pages/circle/detail?id=${noticeDetail.value.target_id}`,
  });
};

onLoad((options) => {
  const id = Number(options?.id);
  if (id) loadNoticeDetail(id);
});
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";
@import "@/styles/layout.scss";

.system-detail-inner {
  padding-top: 20rpx;
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
