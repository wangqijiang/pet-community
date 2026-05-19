<template>
  <view class="preview-page">
    <TopNavBar title="预览">
      <template #right>
        <view class="confirm-btn" @tap="confirmPublish">
          <text class="btn-text">确认发布</text>
        </view>
      </template>
    </TopNavBar>

    <view class="page-content">
      <scroll-view class="preview-scroll" scroll-y>
        <view class="preview-card">
          <view class="card-header">
            <image class="user-avatar" src="/static/images/avatar-default.png" mode="aspectFill"></image>
            <view class="user-info">
              <text class="user-name">我</text>
              <text class="post-time">刚刚</text>
            </view>
          </view>

          <text class="post-content">{{ previewData.content }}</text>

          <view v-if="previewData.images && previewData.images.length > 0" class="post-images">
            <image
              v-for="(img, index) in previewData.images"
              :key="index"
              class="post-image"
              :class="{ 'single': previewData.images.length === 1, 'double': previewData.images.length === 2 }"
              :src="img"
              mode="aspectFill"
              @tap="previewImage(index)"
            ></image>
          </view>

          <view v-if="previewData.topic || previewData.location" class="post-tags">
            <view v-if="previewData.topic" class="tag-item">
              <image class="tag-icon" src="/static/images/icon-topic.png" mode="aspectFit"></image>
              <text class="tag-text">{{ previewData.topic }}</text>
            </view>
            <view v-if="previewData.location" class="tag-item">
              <image class="tag-icon" src="/static/images/icon-location-small.png" mode="aspectFit"></image>
              <text class="tag-text">{{ previewData.location }}</text>
            </view>
          </view>
        </view>

        <view class="action-buttons">
          <view class="action-btn secondary" @tap="goBack">
            <text class="btn-text">返回编辑</text>
          </view>
          <view class="action-btn primary" @tap="confirmPublish">
            <text class="btn-text">确认发布</text>
          </view>
        </view>
      </scroll-view>
    </view>

    <Loading :visible="loading" />
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import TopNavBar from '@/components/common/TopNavBar.vue'
import Loading from '@/components/common/Loading.vue'

const loading = ref(false)

const previewData = ref({
  content: '',
  images: [] as string[],
  topic: '',
  location: ''
})

onLoad((options: any) => {
  if (options.data) {
    previewData.value = JSON.parse(decodeURIComponent(options.data))
  }
})

const previewImage = (index: number) => {
  uni.previewImage({
    urls: previewData.value.images,
    current: index
  })
}

const goBack = () => {
  uni.vibrateShort({ type: 'light' })
  uni.navigateBack()
}

const confirmPublish = () => {
  uni.vibrateShort({ type: 'medium' })
  loading.value = true

  setTimeout(() => {
    loading.value = false
    uni.showToast({
      title: '发布成功',
      icon: 'success'
    })
    setTimeout(() => {
      uni.navigateBack({
        delta: 2
      })
    }, 1500)
  }, 1500)
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.preview-page {
  width: 100%;
  min-height: 100vh;
  background: $color-bg-primary;
}

.page-content {
  padding-top: $nav-bar-height;
  height: 100vh;
}

.preview-scroll {
  height: 100%;
  padding: $spacing-page-horizontal;
}

.confirm-btn {
  padding: 8rpx 24rpx;
  background: linear-gradient(135deg, $color-primary 0%, #FFD4F0 100%);
  border-radius: $border-radius-base;
  transition: transform $transition-base ease;

  &:active {
    transform: scale($scale-press);
  }

  .btn-text {
    font-size: $font-size-body;
    font-weight: $font-weight-bold;
    color: $color-bg-white;
  }
}

.preview-card {
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
      width: $avatar-size-medium;
      height: $avatar-size-medium;
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
    line-height: 1.8;
    margin-bottom: $spacing-component;
  }

  .post-images {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-small;
    margin-bottom: $spacing-component;

    .post-image {
      width: calc((100% - #{$spacing-small} * 2) / 3);
      height: 200rpx;
      border-radius: $border-radius-base;

      &.single {
        width: 100%;
        height: 500rpx;
      }

      &.double {
        width: calc((100% - #{$spacing-small}) / 2);
        height: 300rpx;
      }
    }
  }

  .post-tags {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-small;

    .tag-item {
      padding: 8rpx 20rpx;
      background: $color-bg-primary;
      border-radius: $border-radius-base;
      display: flex;
      align-items: center;
      gap: 8rpx;

      .tag-icon {
        width: 24rpx;
        height: 24rpx;
      }

      .tag-text {
        font-size: $font-size-body;
        color: $color-gray-medium;
      }
    }
  }
}

.action-buttons {
  display: flex;
  gap: $spacing-component;
  padding-bottom: $spacing-page-horizontal;

  .action-btn {
    flex: 1;
    height: $button-height-large;
    border-radius: $border-radius-base;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform $transition-base ease;

    &:active {
      transform: scale($scale-press);
    }

    &.secondary {
      background: $color-bg-white;
      border: $border-width solid $color-primary;

      .btn-text {
        color: $color-primary;
      }
    }

    &.primary {
      background: linear-gradient(135deg, $color-primary 0%, #FFD4F0 100%);
      box-shadow: $shadow-pink;

      .btn-text {
        color: $color-bg-white;
      }
    }

    .btn-text {
      font-size: $font-size-button;
      font-weight: $font-weight-bold;
    }
  }
}
</style>