<template>
  <view class="modal-overlay" v-if="visible" @click="handleClose">
    <view class="modal-content place-modal" @click.stop>
      <view class="cover-image">
        <view class="image-placeholder"></view>
      </view>
      
      <view class="content-section">
        <text class="place-name">{{ data.name }}</text>
        <view class="tags">
          <text class="tag tag-park">
            <view class="tag-icon tag-icon-park"></view>
            遛狗公园
          </text>
          <text class="tag tag-distance">
            <view class="tag-icon tag-icon-distance"></view>
            {{ data.distance }}
          </text>
        </view>
        <text class="description">{{ data.description }}</text>
      </view>
      
      <view class="action-btn" @click="handleNavigate">
        <view class="btn-icon"></view>
        <text class="btn-text">立即导航</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

const props = defineProps<{
  visible: boolean
  data: {
    name: string
    distance: string
    description: string
  }
}>()

const emit = defineEmits(['close', 'navigate'])

const handleClose = () => {
  emit('close')
}

const handleNavigate = () => {
  emit('navigate')
  emit('close')
}
</script>

<style lang="scss" scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(2px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32rpx;
}

.modal-content {
  width: 100%;
  max-width: 600rpx;
  background: #FFFFFF;
  border-radius: 32rpx;
  box-shadow: 0 16rpx 48rpx rgba(168, 155, 157, 0.15);
  overflow: hidden;
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  0% { opacity: 0; transform: translateY(20rpx); }
  100% { opacity: 1; transform: translateY(0); }
}

.cover-image {
  width: 100%;
  height: 270rpx;
  border-radius: 32rpx 32rpx 0 0;
  overflow: hidden;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #DAEAD8 0%, #E3F2FD 100%);
}

.content-section {
  padding: 24rpx;
}

.place-name {
  font-size: 36rpx;
  font-weight: 700;
  color: #1E1B1B;
  display: block;
  margin-bottom: 16rpx;
}

.tags {
  display: flex;
  gap: 16rpx;
  margin-bottom: 16rpx;
}

.tag {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 8rpx 20rpx;
  border-radius: 16rpx;
  font-size: 22rpx;
  font-weight: 600;
  
  &.tag-park {
    background: rgba(234, 223, 189, 0.6);
    color: #5B6A5C;
  }
  
  &.tag-distance {
    color: #807476;
  }
}

.tag-icon {
  width: 24rpx;
  height: 24rpx;
  
  &.tag-icon-park {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%235B6A5C'%3E%3Cpath d='M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z'/%3E%3C/svg%3E") no-repeat center;
    background-size: 100%;
  }
  
  &.tag-icon-distance {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23807476'%3E%3Cpath d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'/%3E%3C/svg%3E") no-repeat center;
    background-size: 100%;
  }
}

.description {
  font-size: 26rpx;
  color: #4F4446;
  line-height: 1.6;
  display: block;
}

.action-btn {
  margin: 0 24rpx 24rpx;
  padding: 28rpx;
  background: rgba(255, 221, 226, 0.6);
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  
  &:active {
    transform: scale(0.98);
  }
}

.btn-icon {
  width: 32rpx;
  height: 32rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2371585C'%3E%3Cpath d='M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z'/%3E%3C/svg%3E") no-repeat center;
  background-size: 100%;
}

.btn-text {
  font-size: 30rpx;
  font-weight: 600;
  color: #71585C;
}
</style>
