<template>
  <view class="store-detail-container">
    <TopNavBar title="店铺详情" />
    
    <view class="store-header">
      <view class="header-image">
        <view class="image-placeholder"></view>
      </view>
      <view class="store-info">
        <text class="store-name">中央公园</text>
        <view class="store-meta">
          <view class="meta-item">
            <view class="meta-icon icon-star"></view>
            <text class="meta-text">4.9</text>
          </view>
          <view class="meta-divider"></view>
          <view class="meta-item">
            <view class="meta-icon icon-foot"></view>
            <text class="meta-text">500m</text>
          </view>
          <view class="meta-divider"></view>
          <view class="meta-item">
            <view class="meta-icon icon-paw"></view>
            <text class="meta-text">23只宠物</text>
          </view>
        </view>
      </view>
    </view>
    
    <view class="store-content">
      <view class="section">
        <text class="section-title">店铺介绍</text>
        <text class="section-content">
          中央公园是城市中最受欢迎的宠物友好公园之一，拥有广阔的草坪和专业的宠物活动区域。公园内设有宠物饮水点、便便袋分发站、休息区等完善设施，是您和爱宠休闲娱乐的最佳选择。
        </text>
      </view>
      
      <view class="section">
        <text class="section-title">营业时间</text>
        <view class="time-info">
          <text class="time-text">周一至周日 06:00 - 22:00</text>
        </view>
      </view>
      
      <view class="section">
        <text class="section-title">地址</text>
        <text class="section-content">市中心区公园路88号</text>
      </view>
      
      <view class="section">
        <text class="section-title">用户评价</text>
        <view class="review-list">
          <view class="review-item">
            <view class="review-avatar">
              <view class="avatar-bg"></view>
            </view>
            <view class="review-content">
              <view class="review-header">
                <text class="review-name">小明</text>
                <view class="review-rating">
                  <view class="star" v-for="i in 5" :key="i"></view>
                </view>
              </view>
              <text class="review-text">非常棒的公园！草坪很干净，设施也很齐全，狗狗玩得很开心。</text>
              <text class="review-time">2024-01-15</text>
            </view>
          </view>
          <view class="review-item">
            <view class="review-avatar">
              <view class="avatar-bg"></view>
            </view>
            <view class="review-content">
              <view class="review-header">
                <text class="review-name">阿花</text>
                <view class="review-rating">
                  <view class="star" v-for="i in 5" :key="i"></view>
                </view>
              </view>
              <text class="review-text">环境很好，人不多，狗狗可以自由奔跑。推荐！</text>
              <text class="review-time">2024-01-14</text>
            </view>
          </view>
        </view>
      </view>
    </view>
    
    <view class="store-footer">
      <view class="footer-btn btn-nav" @click="handleNavigate">
        <view class="btn-icon icon-nav"></view>
        <text class="btn-text">导航</text>
      </view>
      <view class="footer-btn btn-call" @click="handleCall">
        <view class="btn-icon icon-call"></view>
        <text class="btn-text">电话</text>
      </view>
      <view class="footer-btn btn-collect" @click="handleCollect">
        <view class="btn-icon icon-collect"></view>
        <text class="btn-text">收藏</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import TopNavBar from '@/components/common/TopNavBar.vue'

const handleNavigate = () => {
  uni.showToast({
    title: '正在导航...',
    icon: 'loading'
  })
}

const handleCall = () => {
  uni.showToast({
    title: '正在拨打电话...',
    icon: 'loading'
  })
}

const handleCollect = () => {
  uni.showToast({
    title: '已收藏',
    icon: 'success'
  })
}
</script>

<style lang="scss" scoped>
.store-detail-container {
  min-height: 100vh;
  background: #FFF9F9;
  padding-bottom: 140rpx;
}

.store-header {
}

.header-image {
  height: 400rpx;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #FFC1E9 0%, #FFD4F0 100%);
}

.store-info {
  background: #FFFFFF;
  padding: 24rpx 32rpx;
  border-bottom: 2rpx solid #FFC1E9;
}

.store-name {
  font-size: 36rpx;
  font-weight: 600;
  color: #333333;
  margin-bottom: 16rpx;
}

.store-meta {
  display: flex;
  align-items: center;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.meta-icon {
  width: 28rpx;
  height: 28rpx;
  
  &.icon-star {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23FFD700'%3E%3Cpath d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'/%3E%3C/svg%3E") no-repeat center;
    background-size: 100%;
  }
  
  &.icon-foot {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23FFC1E9'%3E%3Cpath d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'/%3E%3C/svg%3E") no-repeat center;
    background-size: 100%;
  }
  
  &.icon-paw {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23FFC1E9'%3E%3Cpath d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'/%3E%3C/svg%3E") no-repeat center;
    background-size: 100%;
  }
}

.meta-text {
  font-size: 24rpx;
  color: #999999;
}

.meta-divider {
  width: 2rpx;
  height: 24rpx;
  background: #E5E5E5;
  margin: 0 24rpx;
}

.store-content {
  padding: 24rpx 32rpx;
}

.section {
  background: #FFFFFF;
  border-radius: 24rpx;
  padding: 24rpx;
  margin-bottom: 24rpx;
  border: 2rpx solid #FFC1E9;
}

.section-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #FFC1E9;
  margin-bottom: 16rpx;
}

.section-content {
  font-size: 26rpx;
  color: #333333;
  line-height: 1.6;
}

.time-info {
  background: rgba(255, 193, 233, 0.1);
  border-radius: 16rpx;
  padding: 16rpx;
}

.time-text {
  font-size: 26rpx;
  color: #FFC1E9;
}

.review-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.review-item {
  display: flex;
  gap: 16rpx;
}

.review-avatar {
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  padding: 4rpx;
  background: #FFC1E9;
}

.avatar-bg {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: #FFD4F0;
}

.review-content {
  flex: 1;
}

.review-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8rpx;
}

.review-name {
  font-size: 28rpx;
  font-weight: 600;
  color: #333333;
}

.review-rating {
  display: flex;
  gap: 4rpx;
}

.star {
  width: 24rpx;
  height: 24rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23FFD700'%3E%3Cpath d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'/%3E%3C/svg%3E") no-repeat center;
  background-size: 100%;
}

.review-text {
  font-size: 26rpx;
  color: #666666;
  line-height: 1.5;
  margin-bottom: 8rpx;
}

.review-time {
  font-size: 22rpx;
  color: #999999;
}

.store-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  background: #FFFFFF;
  padding: 20rpx 32rpx;
  padding-bottom: calc(20rpx + constant(safe-area-inset-bottom));
  border-top: 2rpx solid #FFC1E9;
}

.footer-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
  
  &:active {
    opacity: 0.7;
  }
}

.btn-icon {
  width: 40rpx;
  height: 40rpx;
  
  &.icon-nav {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23FFC1E9'%3E%3Cpath d='M12 3L1 10l4 2.18v6L12 21l7-3.82v-6l4-2.18L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 17.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z'/%3E%3C/svg%3E") no-repeat center;
    background-size: 100%;
  }
  
  &.icon-call {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23FFC1E9'%3E%3Cpath d='M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z'/%3E%3C/svg%3E") no-repeat center;
    background-size: 100%;
  }
  
  &.icon-collect {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23FFC1E9'%3E%3Cpath d='M17.34 14.86l-1.41 1.41-6.3-6.3-2.83 2.83-1.41-1.41L4.27 11l3.54-3.54 6.3 6.3 9.17-9.17 1.41 1.41-10.58 10.58z'/%3E%3C/svg%3E") no-repeat center;
    background-size: 100%;
  }
}

.btn-text {
  font-size: 22rpx;
  color: #FFC1E9;
}
</style>
