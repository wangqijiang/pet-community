<template>
  <view class="publish-container">
    <TopNavBar title="发布萌宠日常" :showBack="true" rightIcon="icon-bell" />

    <view class="publish-content">
      <view class="text-area">
        <textarea
          v-model="content"
          class="content-input"
          placeholder="记录自家小可爱的日常吧～🐶"
          placeholder-class="input-placeholder"
          :maxlength="500"
        />
      </view>

      <view class="image-section">
        <view class="image-grid">
          <view v-for="(img, index) in images" :key="index" class="image-item">
            <view class="image-preview" :style="{ background: img }"></view>
            <view class="image-delete" @click="deleteImage(index)">
              <view class="delete-icon"></view>
            </view>
          </view>
          <view
            class="upload-btn"
            v-if="images.length < 9"
            @click="chooseImage"
          >
            <view class="upload-icon"></view>
            <text class="upload-count">{{ images.length }}/9</text>
          </view>
        </view>
      </view>

      <view class="category-section">
        <view class="section-header">
          <view class="section-icon"></view>
          <text class="section-title">选择分类</text>
        </view>
        <view class="category-list">
          <view
            v-for="(cat, index) in categories"
            :key="index"
            class="category-item"
            :class="{ active: selectedCategory === index }"
            @click="selectedCategory = selectedCategory === index ? -1 : index"
          >
            {{ cat }}
          </view>
        </view>
      </view>
    </view>

    <view class="action-bar">
      <view class="publish-btn" @click="handlePublish">
        <view class="publish-icon"></view>
        <text class="publish-text">确认发布</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import TopNavBar from "@/components/common/TopNavBar.vue";
import { ref } from "vue";

const content = ref("");
const images = ref<string[]>([]);
const selectedCategory = ref(-1);

const categories = ["修勾日常", "技能秀场", "寻宠启事", "遛狗搭子", "养宠种草"];

const chooseImage = () => {
  const colors = [
    "#FFE4E1",
    "#FFD4F0",
    "#FFC1E9",
    "#FFB6C1",
    "#FFC0CB",
    "#E0F7FF",
    "#FFF4D2",
    "#E8F5E9",
    "#FCE4EC",
  ];
  if (images.value.length < 9) {
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    images.value.push(randomColor);
  }
};

const deleteImage = (index: number) => {
  images.value.splice(index, 1);
};

const handlePublish = () => {
  if (!content.value.trim() && images.value.length === 0) {
    uni.showToast({
      title: "请填写内容或添加图片",
      icon: "none",
    });
    return;
  }

  uni.showLoading({
    title: "发布中...",
  });

  setTimeout(() => {
    uni.hideLoading();
    uni.showToast({
      title: "发布成功",
      icon: "success",
    });
    setTimeout(() => {
      uni.navigateBack();
    }, 1500);
  }, 1000);
};
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.publish-container {
  min-height: 100vh;
  background: $color-bg-primary;
  padding-bottom: 140rpx;
}

.publish-content {
  padding: 24rpx 32rpx;
  box-sizing: border-box;
}

.text-area {
  background: $color-bg-white;
  border-radius: $border-radius-large;
  padding: 32rpx;
  margin-bottom: 32rpx;
  box-shadow: 0 8rpx 32rpx rgba(168, 155, 157, 0.12);
  border: 1rpx solid rgba(113, 88, 92, 0.1);
}

.content-input {
  width: 100%;
  min-height: 300rpx;
  font-size: $font-size-body;
  color: $color-gray-dark;
  line-height: 1.6;
  background: transparent;
  border: none;
}

.input-placeholder {
  color: $color-gray-medium;
}

.image-section {
  margin-bottom: 32rpx;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20rpx;
}

.image-item {
  position: relative;
  aspect-ratio: 1;
}

.image-preview {
  width: 100%;
  height: 100%;
  border-radius: $border-radius-medium;
  box-shadow: 0 8rpx 32rpx rgba(168, 155, 157, 0.12);
}

.image-delete {
  position: absolute;
  top: -12rpx;
  right: -12rpx;
  width: 40rpx;
  height: 40rpx;
  background: #ba1a1a;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

.delete-icon {
  width: 20rpx;
  height: 20rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23FFFFFF'%3E%3Cpath d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;
}

.upload-btn {
  aspect-ratio: 1;
  background: rgba(113, 88, 92, 0.05);
  border: 4rpx dashed rgba(113, 88, 92, 0.2);
  border-radius: $border-radius-medium;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8rpx;

  &:active {
    transform: scale(1);
  }
}

.upload-icon {
  width: 64rpx;
  height: 64rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2371585C'%3E%3Cpath d='M3 4V1h2v3h3v2H5v3H3V6H0V4h3zm6 9l-4 5h12l-3-4-2.03 2.71L10 13l-4-5H4l2 3-2 2 3 3H18l-4-5-2.5 3.33L12 19l-3-6z'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;
}

.upload-count {
  font-size: $font-size-helper;
  font-weight: $font-weight-bold;
  color: $color-gray-medium;
}

.category-section {
  margin-bottom: 32rpx;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 20rpx;
}

.section-icon {
  width: 36rpx;
  height: 36rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2371585C'%3E%3Cpath d='M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;
}

.section-title {
  font-size: $font-size-body;
  font-weight: $font-weight-bold;
  color: $color-primary;
}

.category-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}

.category-item {
  padding: 20rpx 32rpx;
  background: rgba(255, 221, 226, 0.6);
  color: #71585c;
  border-radius: 32rpx;
  font-size: 26rpx;
  box-shadow: 0 8rpx 32rpx rgba(168, 155, 157, 0.12);
  border: 1rpx solid rgba(113, 88, 92, 0.1);

  &:active {
    transform: scale(1);
  }

  &.active {
    background: #ffdde2;
    color: #795f64;
    border-color: rgba(113, 88, 92, 0.1);
  }

  &:nth-child(2) {
    background: rgba(218, 234, 216, 0.6);
    &.active {
      background: #daead8;
      color: #5b6a5c;
    }
  }

  &:nth-child(3) {
    background: rgba(234, 223, 189, 0.5);
    &.active {
      background: #eadfbd;
      color: #6a6347;
    }
  }

  &:nth-child(4) {
    background: rgba(224, 247, 255, 0.6);
    &.active {
      background: #e0f7ff;
      color: #01579b;
    }
  }

  &:nth-child(5) {
    background: rgba(255, 235, 205, 0.6);
    &.active {
      background: #ffe0b2;
      color: #bf360c;
    }
  }
}

.action-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 32rpx;
  padding-bottom: calc(32rpx + constant(safe-area-inset-bottom));
  background: linear-gradient(to top, $color-bg-primary 50%, transparent 100%);
  z-index: 100;
  box-sizing: border-box;
}

.publish-btn {
  width: 100%;
  padding: 32rpx 0;
  background: $color-primary;
  border-radius: $border-radius-large;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  box-shadow: 0 8rpx 32rpx rgba(168, 155, 157, 0.12);

  &:active {
    transform: scale(1);
  }
}

.publish-icon {
  width: 36rpx;
  height: 36rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23FFFFFF'%3E%3Cpath d='M2.01 21L23 12 2.01 3 2 10l15 2-15 2z'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;
}

.publish-text {
  font-size: $font-size-title;
  font-weight: $font-weight-bold;
  color: $color-bg-white;
}
</style>
