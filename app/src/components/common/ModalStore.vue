<template>
  <view class="modal-overlay" v-if="visible" @click="handleClose">
    <view class="modal-content store-modal" @click.stop>
      <view class="close-btn" @click="handleClose">
        <view class="close-icon"></view>
      </view>
      
      <view class="cover-image">
        <view class="image-placeholder"></view>
      </view>
      
      <view class="content-section">
        <view class="header-row">
          <text class="store-name">{{ data.name }}</text>
          <text class="tag">{{ data.tag }}</text>
        </view>
        
        <view class="info-list">
          <view class="info-item">
            <view class="info-icon info-icon-location"></view>
            <text class="info-text">{{ data.address }}</text>
          </view>
          <view class="info-item">
            <view class="info-icon info-icon-schedule"></view>
            <text class="info-text">{{ data.hours }}</text>
          </view>
        </view>
        
        <view class="divider"></view>
        
        <text class="description">{{ data.description }}</text>
      </view>
      
      <view class="actions">
        <view class="btn btn-secondary" @click="handleViewDetail">查看详情</view>
        <view class="btn btn-primary" @click="handleNavigate">立即导航</view>
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
    tag: string
    address: string
    hours: string
    description: string
  }
}>()

const emit = defineEmits(['close', 'viewDetail', 'navigate'])

const handleClose = () => {
  emit('close')
}

const handleViewDetail = () => {
  emit('viewDetail')
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
  background: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32rpx;
}

.modal-content {
  width: 100%;
  max-width: 640rpx;
  background: #FDFCF8;
  border-radius: 24rpx;
  box-shadow: 0 16rpx 48rpx rgba(168, 155, 157, 0.15);
  overflow: hidden;
  position: relative;
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  0% { opacity: 0; transform: scale(1); }
  100% { opacity: 1; transform: scale(1); }
}

.close-btn {
  position: absolute;
  top: 24rpx;
  right: 24rpx;
  width: 48rpx;
  height: 48rpx;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  backdrop-filter: blur(4px);
  
  &:active {
    transform: scale(1);
  }
}

.close-icon {
  width: 28rpx;
  height: 28rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23FFFFFF'%3E%3Cpath d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'/%3E%3C/svg%3E") no-repeat center;
  background-size: 100%;
}

.cover-image {
  width: 100%;
  height: 270rpx;
  border-radius: 24rpx 24rpx 0 0;
  overflow: hidden;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #FCE9EB 0%, #F9F3D9 100%);
}

.content-section {
  padding: 24rpx;
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20rpx;
}

.store-name {
  font-size: 40rpx;
  font-weight: 700;
  color: #71585C;
  line-height: 1.2;
}

.tag {
  padding: 8rpx 16rpx;
  background: #F9F3D9;
  color: #9CB6E0;
  font-size: 22rpx;
  font-weight: 600;
  border-radius: 12rpx;
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  margin-bottom: 20rpx;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.info-icon {
  width: 36rpx;
  height: 36rpx;
  
  &.info-icon-location {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23807476'%3E%3Cpath d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'/%3E%3C/svg%3E") no-repeat center;
    background-size: 100%;
  }
  
  &.info-icon-schedule {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23807476'%3E%3Cpath d='M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z'/%3E%3C/svg%3E") no-repeat center;
    background-size: 100%;
  }
}

.info-text {
  font-size: 26rpx;
  color: #4F4446;
}

.divider {
  height: 1rpx;
  background: rgba(210, 195, 196, 0.3);
  margin-bottom: 16rpx;
}

.description {
  font-size: 26rpx;
  color: #4F4446;
  line-height: 1.6;
  display: block;
}

.actions {
  display: flex;
  gap: 24rpx;
  padding: 0 24rpx 24rpx;
}

.btn {
  flex: 1;
  height: 96rpx;
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  font-weight: 600;
  transition: all 0.2s;
  
  &:active {
    transform: scale(1);
  }
  
  &.btn-secondary {
    background: #F9F3D9;
    color: #6A6347;
  }
  
  &.btn-primary {
    background: #FCE9EB;
    color: #71585C;
  }
}
</style>
