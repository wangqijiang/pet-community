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
          <view 
            v-for="(img, index) in images" 
            :key="index" 
            class="image-item"
          >
            <view class="image-preview" :style="{ background: img }"></view>
            <view class="image-delete" @click="deleteImage(index)">
              <view class="delete-icon"></view>
            </view>
          </view>
          <view class="upload-btn" v-if="images.length < 9" @click="chooseImage">
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
            @click="selectedCategory = index"
          >
            {{ cat }}
          </view>
        </view>
      </view>
      
      <view class="options-section">
        <view class="option-item" @click="showLocationPicker">
          <view class="option-left">
            <view class="option-icon icon-location"></view>
            <text class="option-text">{{ location || '你在哪里？' }}</text>
          </view>
          <view class="option-arrow"></view>
        </view>
        
        <view class="option-divider"></view>
        
        <view class="option-item" @click="showPrivacyPicker">
          <view class="option-left">
            <view class="option-icon icon-visible"></view>
            <text class="option-text">公开范围</text>
          </view>
          <view class="option-right">
            <text class="option-value">{{ privacyText }}</text>
            <view class="option-arrow"></view>
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
import TopNavBar from '@/components/common/TopNavBar.vue'
import { ref } from 'vue'

const content = ref('')
const images = ref<string[]>([])
const selectedCategory = ref(0)
const location = ref('')
const privacy = ref(0)

const categories = ['日常萌照', '训练日常', '寻狗求助']
const privacyOptions = ['所有人可见', '仅好友可见', '仅自己可见']

const privacyText = privacyOptions[privacy.value]

const chooseImage = () => {
  const colors = ['#FFE4E1', '#FFD4F0', '#FFC1E9', '#FFB6C1', '#FFC0CB', '#E0F7FF', '#FFF4D2', '#E8F5E9', '#FCE4EC']
  if (images.value.length < 9) {
    const randomColor = colors[Math.floor(Math.random() * colors.length)]
    images.value.push(randomColor)
  }
}

const deleteImage = (index: number) => {
  images.value.splice(index, 1)
}

const showLocationPicker = () => {
  uni.showToast({
    title: '选择位置',
    icon: 'none'
  })
}

const showPrivacyPicker = () => {
  uni.showActionSheet({
    itemList: privacyOptions,
    success: (res) => {
      privacy.value = res.tapIndex
    }
  })
}

const handlePublish = () => {
  if (!content.value.trim() && images.value.length === 0) {
    uni.showToast({
      title: '请填写内容或添加图片',
      icon: 'none'
    })
    return
  }
  
  uni.showLoading({
    title: '发布中...'
  })
  
  setTimeout(() => {
    uni.hideLoading()
    uni.showToast({
      title: '发布成功',
      icon: 'success'
    })
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  }, 1000)
}
</script>

<style lang="scss" scoped>
.publish-container {
  min-height: 100vh;
  background: #FFF8F7;
  padding-bottom: 140rpx;
}

.publish-content {
  padding: 24rpx 32rpx;
  padding-top: calc(var(--status-bar-height, 44px) + 120rpx);
  box-sizing: border-box;
}

.text-area {
  background: #FFFFFF;
  border-radius: 32rpx;
  padding: 32rpx;
  margin-bottom: 32rpx;
  box-shadow: 0 8rpx 32rpx rgba(168, 155, 157, 0.12);
  border: 1rpx solid rgba(210, 195, 196, 0.2);
}

.content-input {
  width: 100%;
  min-height: 300rpx;
  font-size: 28rpx;
  color: #1E1B1B;
  line-height: 1.6;
  background: transparent;
  border: none;
}

.input-placeholder {
  color: rgba(30, 27, 27, 0.5);
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
  border-radius: 20rpx;
  box-shadow: 0 8rpx 32rpx rgba(168, 155, 157, 0.12);
}

.image-delete {
  position: absolute;
  top: -12rpx;
  right: -12rpx;
  width: 40rpx;
  height: 40rpx;
  background: #BA1A1A;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

.delete-icon {
  width: 20rpx;
  height: 20rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23FFFFFF'%3E%3Cpath d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'/%3E%3C/svg%3E") no-repeat center;
  background-size: 100%;
}

.upload-btn {
  aspect-ratio: 1;
  background: rgba(234, 223, 189, 0.3);
  border: 4rpx dashed #EADFBD;
  border-radius: 20rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  
  &:active {
    transform: scale(0.95);
  }
}

.upload-icon {
  width: 64rpx;
  height: 64rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23655E43'%3E%3Cpath d='M3 4V1h2v3h3v2H5v3H3V6H0V4h3zm6 9l-4 5h12l-3-4-2.03 2.71L10 13l-4-5H4l2 3-2 2 3 3H18l-4-5-2.5 3.33L12 19l-3-6z'/%3E%3C/svg%3E") no-repeat center;
  background-size: 100%;
}

.upload-count {
  font-size: 22rpx;
  font-weight: 600;
  color: #655E43;
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
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2371585C'%3E%3Cpath d='M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z'/%3E%3C/svg%3E") no-repeat center;
  background-size: 100%;
}

.section-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #71585C;
}

.category-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}

.category-item {
  padding: 20rpx 32rpx;
  background: rgba(255, 221, 226, 0.6);
  color: #71585C;
  border-radius: 32rpx;
  font-size: 26rpx;
  box-shadow: 0 8rpx 32rpx rgba(168, 155, 157, 0.12);
  border: 1rpx solid rgba(113, 88, 92, 0.1);
  
  &:active {
    transform: scale(0.95);
  }
  
  &.active {
    background: #FFDDE2;
    color: #795F64;
    border-color: rgba(113, 88, 92, 0.1);
  }
  
  &:nth-child(2) {
    background: rgba(218, 234, 216, 0.6);
    &.active {
      background: #DAEAD8;
      color: #5B6A5C;
    }
  }
  
  &:nth-child(3) {
    background: rgba(234, 223, 189, 0.5);
    &.active {
      background: #EADFBD;
      color: #6A6347;
    }
  }
}

.options-section {
  background: #F9F2F2;
  border-radius: 20rpx;
  padding: 8rpx 0;
  box-shadow: 0 8rpx 32rpx rgba(168, 155, 157, 0.12);
}

.option-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 24rpx;
}

.option-left {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.option-icon {
  width: 40rpx;
  height: 40rpx;
  
  &.icon-location {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2371585C'%3E%3Cpath d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'/%3E%3C/svg%3E") no-repeat center;
    background-size: 100%;
  }
  
  &.icon-visible {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2371585C'%3E%3Cpath d='M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z'/%3E%3C/svg%3E") no-repeat center;
    background-size: 100%;
  }
}

.option-text {
  font-size: 26rpx;
  color: #1E1B1B;
}

.option-right {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.option-value {
  font-size: 24rpx;
  color: rgba(30, 27, 27, 0.6);
}

.option-arrow {
  width: 32rpx;
  height: 32rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23807476'%3E%3Cpath d='M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z'/%3E%3C/svg%3E") no-repeat center;
  background-size: 100%;
  opacity: 0.4;
}

.option-divider {
  height: 1rpx;
  background: rgba(210, 195, 196, 0.3);
  margin: 0 24rpx;
}

.action-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 32rpx;
  padding-bottom: calc(32rpx + constant(safe-area-inset-bottom));
  background: linear-gradient(to top, #FFF8F7 50%, transparent 100%);
  z-index: 100;
  box-sizing: border-box;
}

.publish-btn {
  width: 100%;
  padding: 32rpx;
  background: #FCDADF;
  color: #29161A;
  border-radius: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  box-shadow: 0 8rpx 32rpx rgba(168, 155, 157, 0.12);
  
  &:active {
    transform: scale(0.98);
  }
}

.publish-icon {
  width: 36rpx;
  height: 36rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2329161A'%3E%3Cpath d='M2.01 21L23 12 2.01 3 2 10l15 2-15 2z'/%3E%3C/svg%3E") no-repeat center;
  background-size: 100%;
}

.publish-text {
  font-size: 32rpx;
  font-weight: 700;
  color: #29161A;
}
</style>
