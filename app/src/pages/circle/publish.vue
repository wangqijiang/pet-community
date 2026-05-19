<template>
  <view class="publish-container">
    <TopNavBar title="发布动态" rightText="发布" @rightClick="handlePublish" />
    
    <view class="publish-content">
      <view class="input-area">
        <textarea 
          v-model="content"
          class="content-input"
          placeholder="分享你的萌宠日常..."
          placeholder-class="input-placeholder"
          :maxlength="500"
          auto-height
        />
        <view class="char-count">{{ content.length }}/500</view>
      </view>
      
      <view class="image-area">
        <text class="area-title">添加图片</text>
        <view class="image-grid">
          <view 
            v-for="(img, index) in images" 
            :key="index" 
            class="image-item"
            @click="previewImage(index)"
          >
            <view class="image-content" :style="{ background: img }"></view>
            <view class="image-delete" @click.stop="deleteImage(index)"></view>
          </view>
          <view class="image-add" v-if="images.length < 9" @click="chooseImage">
            <view class="add-icon"></view>
            <text class="add-text">添加</text>
          </view>
        </view>
      </view>
      
      <view class="video-area" v-if="showVideo">
        <text class="area-title">视频</text>
        <view class="video-preview">
          <view class="video-placeholder"></view>
          <view class="video-delete" @click="removeVideo"></view>
        </view>
      </view>
      
      <view class="type-select">
        <text class="area-title">内容类型</text>
        <view class="type-options">
          <view 
            class="type-option"
            :class="{ active: contentType === 'text' }"
            @click="contentType = 'text'"
          >
            <view class="type-icon icon-text"></view>
            <text class="type-label">纯文字</text>
          </view>
          <view 
            class="type-option"
            :class="{ active: contentType === 'image' }"
            @click="contentType = 'image'"
          >
            <view class="type-icon icon-image"></view>
            <text class="type-label">图文</text>
          </view>
          <view 
            class="type-option"
            :class="{ active: contentType === 'video' }"
            @click="contentType = 'video'"
          >
            <view class="type-icon icon-video"></view>
            <text class="type-label">视频</text>
          </view>
        </view>
      </view>
      
      <view class="topic-area">
        <text class="area-title">添加话题</text>
        <view class="topic-list">
          <view 
            v-for="(topic, index) in hotTopics" 
            :key="index"
            class="topic-item"
            :class="{ active: selectedTopics.includes(topic) }"
            @click="toggleTopic(topic)"
          >
            #{{ topic }}
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import TopNavBar from '@/components/common/TopNavBar.vue'
import { ref } from 'vue'

const content = ref('')
const images = ref<string[]>([])
const showVideo = ref(false)
const contentType = ref('text')
const selectedTopics = ref<string[]>([])

const hotTopics = ['萌宠日常', '狗狗日记', '猫咪可爱', '宠物训练', '宠物美食', '遛狗日常']

const chooseImage = () => {
  const colors = ['#FFC1E9', '#FFD4F0', '#FFB6C1', '#FFC0CB', '#FFE4E1', '#E0F7FF', '#FFF4D2']
  const randomColor = colors[Math.floor(Math.random() * colors.length)]
  images.value.push(randomColor)
}

const deleteImage = (index: number) => {
  images.value.splice(index, 1)
}

const previewImage = (index: number) => {
  uni.previewImage({
    urls: images.value,
    current: index
  })
}

const removeVideo = () => {
  showVideo.value = false
}

const toggleTopic = (topic: string) => {
  const index = selectedTopics.value.indexOf(topic)
  if (index > -1) {
    selectedTopics.value.splice(index, 1)
  } else {
    selectedTopics.value.push(topic)
  }
}

const handlePublish = () => {
  if (!content.value.trim() && images.value.length === 0 && !showVideo.value) {
    uni.showToast({
      title: '请填写内容',
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
  background: #FFF9F9;
}

.publish-content {
  padding: 24rpx 32rpx;
  padding-top: calc(var(--status-bar-height, 44px) + 120rpx);
}

.input-area {
  background: #FFFFFF;
  border-radius: 24rpx;
  padding: 24rpx;
  margin-bottom: 24rpx;
  border: 2rpx solid #FFC1E9;
}

.content-input {
  width: 100%;
  min-height: 200rpx;
  font-size: 28rpx;
  color: #333333;
  line-height: 1.6;
}

.input-placeholder {
  color: #999999;
}

.char-count {
  text-align: right;
  font-size: 22rpx;
  color: #999999;
  margin-top: 12rpx;
}

.image-area {
  background: #FFFFFF;
  border-radius: 24rpx;
  padding: 24rpx;
  margin-bottom: 24rpx;
  border: 2rpx solid #FFC1E9;
}

.area-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #FFC1E9;
  margin-bottom: 16rpx;
  display: block;
}

.image-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.image-item {
  position: relative;
  width: calc(33.33% - 12rpx);
  height: 200rpx;
}

.image-content {
  width: 100%;
  height: 100%;
  border-radius: 16rpx;
}

.image-delete {
  position: absolute;
  top: -12rpx;
  right: -12rpx;
  width: 40rpx;
  height: 40rpx;
  background: #FF6B6B;
  border-radius: 50%;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23FFFFFF'%3E%3Cpath d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'/%3E%3C/svg%3E") no-repeat center;
  background-size: 60%;
}

.image-add {
  width: calc(33.33% - 12rpx);
  height: 200rpx;
  border: 2rpx dashed #FFC1E9;
  border-radius: 16rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
}

.add-icon {
  width: 48rpx;
  height: 48rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23FFC1E9'%3E%3Cpath d='M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z'/%3E%3C/svg%3E") no-repeat center;
  background-size: 100%;
}

.add-text {
  font-size: 24rpx;
  color: #FFC1E9;
}

.video-area {
  background: #FFFFFF;
  border-radius: 24rpx;
  padding: 24rpx;
  margin-bottom: 24rpx;
  border: 2rpx solid #FFC1E9;
}

.video-preview {
  position: relative;
  height: 300rpx;
  border-radius: 16rpx;
}

.video-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #FFC1E9 0%, #FFD4F0 100%);
}

.video-delete {
  position: absolute;
  top: 12rpx;
  right: 12rpx;
  width: 48rpx;
  height: 48rpx;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23FFFFFF'%3E%3Cpath d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'/%3E%3C/svg%3E") no-repeat center;
  background-size: 60%;
}

.type-select {
  background: #FFFFFF;
  border-radius: 24rpx;
  padding: 24rpx;
  margin-bottom: 24rpx;
  border: 2rpx solid #FFC1E9;
}

.type-options {
  display: flex;
  gap: 24rpx;
}

.type-option {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
  padding: 24rpx;
  border-radius: 16rpx;
  border: 2rpx solid #E5E5E5;
  
  &.active {
    border-color: #FFC1E9;
    background: rgba(255, 193, 233, 0.1);
    
    .type-icon {
      filter: none;
    }
    
    .type-label {
      color: #FFC1E9;
      font-weight: 600;
    }
  }
}

.type-icon {
  width: 48rpx;
  height: 48rpx;
  filter: grayscale(50%);
  
  &.icon-text {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23FFC1E9'%3E%3Cpath d='M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z'/%3E%3C/svg%3E") no-repeat center;
    background-size: 100%;
  }
  
  &.icon-image {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23FFC1E9'%3E%3Cpath d='M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z'/%3E%3C/svg%3E") no-repeat center;
    background-size: 100%;
  }
  
  &.icon-video {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23FFC1E9'%3E%3Cpath d='M8 5v14l11-7z'/%3E%3C/svg%3E") no-repeat center;
    background-size: 100%;
  }
}

.type-label {
  font-size: 24rpx;
  color: #999999;
}

.topic-area {
  background: #FFFFFF;
  border-radius: 24rpx;
  padding: 24rpx;
  border: 2rpx solid #FFC1E9;
}

.topic-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.topic-item {
  padding: 12rpx 24rpx;
  background: rgba(255, 193, 233, 0.1);
  border-radius: 24rpx;
  font-size: 24rpx;
  color: #FFC1E9;
  border: 2rpx solid transparent;
  
  &.active {
    background: #FFC1E9;
    color: #FFFFFF;
  }
}
</style>
