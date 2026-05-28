<template>
  <view class="page-container">
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
        <view class="text-count">{{ content.length }}/500</view>
      </view>

      <view class="image-section">
        <view class="image-grid">
          <view v-for="(img, index) in images" :key="index" class="image-item">
            <image class="image-preview" :src="img" mode="aspectFill" />
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
      <view class="publish-btn" :class="{ active: canPublish }" @click="handlePublish">
        <view class="publish-icon"></view>
        <text class="publish-text">确认发布</text>
      </view>
    </view>

    <Loading :visible="loading" />
  </view>
</template>

<script setup lang="ts">
import TopNavBar from "@/components/common/TopNavBar.vue";
import Loading from "@/components/common/Loading.vue";
import { ref, computed } from "vue";
import { createPost } from "@/api/post";

const content = ref("");
const images = ref<string[]>([]);
const selectedCategory = ref(-1);
const loading = ref(false);

const categories = ["修勾日常", "技能秀场", "寻宠启事", "遛狗搭子", "养宠种草"];

const canPublish = computed(() => {
  return content.value.trim().length > 0 || images.value.length > 0;
});

const chooseImage = () => {
  const maxCount = 9 - images.value.length;
  uni.chooseImage({
    count: maxCount,
    sizeType: ["compressed"],
    sourceType: ["album", "camera"],
    success: (res) => {
      images.value = [...images.value, ...res.tempFilePaths];
    },
  });
};

const deleteImage = (index: number) => {
  uni.showModal({
    title: "提示",
    content: "确定要删除这张图片吗？",
    success: (res) => {
      if (res.confirm) {
        images.value.splice(index, 1);
      }
    },
  });
};

const handlePublish = async () => {
  if (!canPublish.value) {
    uni.showToast({
      title: "请填写内容或添加图片",
      icon: "none",
    });
    return;
  }

  loading.value = true;

  try {
    await createPost(content.value, images.value);
    
    uni.showToast({
      title: "发布成功",
      icon: "success",
    });
    
    setTimeout(() => {
      uni.$emit('postCreated');
      uni.navigateBack();
    }, 1500);
  } catch (error) {
    console.error("发布失败:", error);
    uni.showToast({
      title: "发布失败",
      icon: "none",
    });
  } finally {
    loading.value = false;
  }
};
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.page-container {
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
  position: relative;
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

.text-count {
  position: absolute;
  right: 32rpx;
  bottom: 32rpx;
  font-size: 24rpx;
  color: $color-gray-light;
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
  background: #F5F5F5;
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
  border: 2rpx dashed #D4C8C9;
  border-radius: $border-radius-medium;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
}

.upload-icon {
  width: 48rpx;
  height: 48rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23C4B5B5'%3E%3Cpath d='M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;
}

.upload-count {
  font-size: 22rpx;
  color: #9B9090;
}

.category-section {
  background: $color-bg-white;
  border-radius: $border-radius-large;
  padding: 32rpx;
  box-shadow: 0 8rpx 32rpx rgba(168, 155, 157, 0.12);
  border: 1rpx solid rgba(113, 88, 92, 0.1);
}

.section-header {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 24rpx;
}

.section-icon {
  width: 40rpx;
  height: 40rpx;
  background: linear-gradient(135deg, #FFC1E9, #FFD4F0);
  border-radius: 12rpx;
}

.section-title {
  font-size: $font-size-title;
  font-weight: $font-weight-bold;
  color: $color-gray-dark;
}

.category-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}

.category-item {
  padding: 20rpx 36rpx;
  background: #F8F5F5;
  border-radius: 999rpx;
  font-size: 26rpx;
  color: #6B5B5D;
  transition: all 0.2s;

  &.active {
    background: linear-gradient(135deg, #FFB6C1, #FFC1E9);
    color: white;
    font-weight: 600;
  }
}

.action-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 24rpx 32rpx;
  padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
  background: $color-bg-white;
  border-top: 1rpx solid rgba(113, 88, 92, 0.1);
}

.publish-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
  height: 96rpx;
  background: #E8E8E8;
  border-radius: 48rpx;

  &.active {
    background: linear-gradient(135deg, #FFB6C1, #FFC1E9);
    box-shadow: 0 16rpx 40rpx rgba(255, 182, 193, 0.3);
  }
}

.publish-icon {
  width: 36rpx;
  height: 36rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23FFFFFF'%3E%3Cpath d='M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;
}

.publish-text {
  font-size: $font-size-body;
  font-weight: $font-weight-bold;
  color: white;
}
</style>
