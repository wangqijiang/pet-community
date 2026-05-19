<template>
  <view class="place-list-container">
    <TopNavBar title="遛狗好去处" />
    
    <view class="place-tabs">
      <view 
        v-for="(tab, index) in tabs" 
        :key="index"
        class="tab-item"
        :class="{ active: currentTab === index }"
        @click="currentTab = index"
      >
        {{ tab }}
      </view>
    </view>
    
    <view class="place-list">
      <view 
        v-for="(place, index) in placeList" 
        :key="index" 
        class="place-item"
        @click="goToDetail(place)"
      >
        <view class="place-image">
          <view class="image-placeholder" :style="{ background: place.color }"></view>
          <view class="place-tag">{{ place.type }}</view>
        </view>
        <view class="place-info">
          <text class="place-name">{{ place.name }}</text>
          <text class="place-desc">{{ place.desc }}</text>
          <view class="place-footer">
            <view class="place-meta">
              <view class="meta-icon icon-star"></view>
              <text class="meta-text">{{ place.rating }}</text>
            </view>
            <view class="place-meta">
              <view class="meta-icon icon-foot"></view>
              <text class="meta-text">{{ place.distance }}</text>
            </view>
            <view class="place-meta">
              <view class="meta-icon icon-paw"></view>
              <text class="meta-text">{{ place.petCount }}只宠物</text>
            </view>
          </view>
        </view>
      </view>
    </view>
    
    <view class="list-footer">
      <text class="footer-text">- 已显示全部地点 -</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import TopNavBar from '@/components/common/TopNavBar.vue'
import { ref } from 'vue'

const currentTab = ref(0)

const tabs = ['全部', '公园', '宠物乐园', '宠物店']

const placeList = [
  { 
    name: '中央公园', 
    desc: '草坪宽广，宠物友好设施完善，有专门的宠物活动区域', 
    type: '公园', 
    rating: '4.9', 
    distance: '500m', 
    petCount: 23,
    color: '#FFC1E9' 
  },
  { 
    name: '萌宠乐园', 
    desc: '室内宠物乐园，有各种游乐设施，适合雨天遛狗', 
    type: '宠物乐园', 
    rating: '4.8', 
    distance: '1.2km', 
    petCount: 15,
    color: '#FFD4F0' 
  },
  { 
    name: '汪汪宠物店', 
    desc: '提供宠物美容、洗澡、用品销售等一站式服务', 
    type: '宠物店', 
    rating: '4.7', 
    distance: '800m', 
    petCount: 8,
    color: '#FFB6C1' 
  },
  { 
    name: '滨江绿道', 
    desc: '沿江绿道，风景优美，适合带宠物散步慢跑', 
    type: '公园', 
    rating: '4.6', 
    distance: '1.5km', 
    petCount: 18,
    color: '#FFC0CB' 
  },
  { 
    name: '宠物天地', 
    desc: '大型户外宠物乐园，有专业训练场地和障碍设施', 
    type: '宠物乐园', 
    rating: '4.9', 
    distance: '2.0km', 
    petCount: 32,
    color: '#FFE4E1' 
  },
  { 
    name: '爱心宠物医院', 
    desc: '专业宠物医疗服务，24小时急诊，设备先进', 
    type: '宠物店', 
    rating: '4.8', 
    distance: '1.0km', 
    petCount: 5,
    color: '#FFB6C1' 
  }
]

const goToDetail = (place: any) => {
  uni.navigateTo({
    url: `/pages/home/storeDetail?name=${place.name}`
  })
}
</script>

<style lang="scss" scoped>
.place-list-container {
  min-height: 100vh;
  background: #FFF9F9;
}

.place-tabs {
  display: flex;
  padding: 24rpx 32rpx;
  gap: 24rpx;
  padding-top: calc(var(--status-bar-height, 44px) + 120rpx);
}

.tab-item {
  padding: 16rpx 32rpx;
  background: #FFFFFF;
  border-radius: 24rpx;
  font-size: 26rpx;
  color: #999999;
  border: 2rpx solid #E5E5E5;
  
  &.active {
    background: #FFC1E9;
    color: #FFFFFF;
    border-color: #FFC1E9;
  }
}

.place-list {
  padding: 0 32rpx;
}

.place-item {
  background: #FFFFFF;
  border-radius: 24rpx;
  overflow: hidden;
  margin-bottom: 24rpx;
  border: 2rpx solid #FFC1E9;
  
  &:active {
    transform: scale(0.98);
  }
}

.place-image {
  position: relative;
  height: 280rpx;
}

.image-placeholder {
  width: 100%;
  height: 100%;
}

.place-tag {
  position: absolute;
  top: 16rpx;
  left: 16rpx;
  padding: 8rpx 20rpx;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16rpx;
  font-size: 22rpx;
  color: #FFC1E9;
}

.place-info {
  padding: 24rpx;
}

.place-name {
  font-size: 32rpx;
  font-weight: 600;
  color: #333333;
  margin-bottom: 12rpx;
}

.place-desc {
  font-size: 26rpx;
  color: #999999;
  line-height: 1.5;
  margin-bottom: 16rpx;
}

.place-footer {
  display: flex;
  gap: 32rpx;
}

.place-meta {
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

.list-footer {
  padding: 40rpx;
  text-align: center;
}

.footer-text {
  font-size: 24rpx;
  color: #E5E5E5;
}
</style>
