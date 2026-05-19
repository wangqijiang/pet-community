<template>
  <view class="home-container">
    <TopNavBar title="同城狗友地图" :showBack="false" rightIcon="icon-bell" />
    
    <view class="home-content">
      <view class="filter-bar">
        <view 
          v-for="(item, index) in breedTags" 
          :key="index"
          class="filter-tag"
          :class="{ active: selectedBreed === item.value }"
          @click="handleBreedSelect(item.value)"
        >
          {{ item.label }}
        </view>
        <view class="filter-more" @click="showFilterPanel = true">
          <text class="more-text">更多</text>
          <view class="more-icon"></view>
        </view>
      </view>
      
      <view class="map-container">
        <view class="map-placeholder">
          <view class="map-grid">
            <view v-for="i in 20" :key="i" class="grid-cell"></view>
          </view>
          <view class="map-points">
            <view class="map-point point-user" v-for="(point, index) in userPoints" :key="index">
              <view class="point-avatar">
                <view class="avatar-inner" :style="{ background: point.color }"></view>
              </view>
              <view class="point-label">{{ point.name }}</view>
            </view>
          </view>
          <view class="map-center-marker">
            <view class="marker-ring"></view>
            <view class="marker-dot"></view>
          </view>
        </view>
        <view class="location-btn" @click="handleLocation">
          <view class="location-icon"></view>
        </view>
      </view>
      
      <view class="quick-cards">
        <view class="quick-card" @click="goToFriendList">
          <view class="card-header">
            <view class="card-icon icon-friend"></view>
            <text class="card-title">同片区热门狗友</text>
          </view>
          <view class="card-content">
            <view class="friend-avatars">
              <view v-for="(friend, index) in nearbyFriends" :key="index" class="friend-avatar">
                <view class="avatar-bg" :style="{ background: friend.color }"></view>
              </view>
              <view class="friend-more" v-if="nearbyFriends.length > 5">
                +{{ nearbyFriends.length - 5 }}
              </view>
            </view>
            <text class="card-desc">{{ nearbyFriends.length }}位狗友在附近</text>
          </view>
        </view>
        
        <view class="quick-card" @click="goToPlaceList">
          <view class="card-header">
            <view class="card-icon icon-place"></view>
            <text class="card-title">附近遛狗好去处</text>
          </view>
          <view class="card-content">
            <view class="place-info">
              <text class="place-name">{{ nearbyPlace.name }}</text>
              <text class="place-distance">{{ nearbyPlace.distance }}</text>
            </view>
            <text class="card-desc">{{ nearbyPlace.desc }}</text>
          </view>
        </view>
      </view>
    </view>
    
    <TabBar :current="0" />
    
    <view class="filter-panel" v-if="showFilterPanel" @click="showFilterPanel = false">
      <view class="panel-content" @click.stop>
        <view class="panel-header">
          <text class="panel-title">筛选狗狗品种</text>
          <view class="panel-close" @click="showFilterPanel = false"></view>
        </view>
        <view class="panel-body">
          <view 
            v-for="(item, index) in allBreeds" 
            :key="index"
            class="breed-item"
            :class="{ active: selectedBreed === item.value }"
            @click="handleBreedSelect(item.value)"
          >
            <view class="breed-check" :class="{ checked: selectedBreed === item.value }"></view>
            <text class="breed-name">{{ item.label }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import TopNavBar from '@/components/common/TopNavBar.vue'
import TabBar from '@/components/common/TabBar.vue'
import { ref } from 'vue'

const selectedBreed = ref('all')
const showFilterPanel = ref(false)

const breedTags = [
  { label: '全部', value: 'all' },
  { label: '金毛', value: 'golden' },
  { label: '泰迪', value: 'teddy' },
  { label: '哈士奇', value: 'husky' },
  { label: '柯基', value: 'corgi' }
]

const allBreeds = [
  { label: '全部品种', value: 'all' },
  { label: '金毛寻回犬', value: 'golden' },
  { label: '泰迪/贵宾', value: 'teddy' },
  { label: '哈士奇', value: 'husky' },
  { label: '柯基犬', value: 'corgi' },
  { label: '萨摩耶', value: 'samoyed' },
  { label: '拉布拉多', value: 'labrador' },
  { label: '柴犬', value: 'shiba' },
  { label: '法斗', value: 'french' },
  { label: '比熊', value: 'bichon' },
  { label: '英短', value: 'british' },
  { label: '布偶', value: 'ragdoll' }
]

const userPoints = [
  { name: '小明', color: '#FFC1E9', top: '20%', left: '25%' },
  { name: '阿花', color: '#FFD4F0', top: '35%', left: '65%' },
  { name: '旺财', color: '#FFB6C1', top: '55%', left: '45%' },
  { name: '球球', color: '#FFC0CB', top: '70%', left: '75%' }
]

const nearbyFriends = [
  { name: '小明', color: '#FFC1E9' },
  { name: '阿花', color: '#FFD4F0' },
  { name: '旺财', color: '#FFB6C1' },
  { name: '球球', color: '#FFC0CB' },
  { name: '豆豆', color: '#FFE4E1' },
  { name: '乐乐', color: '#FFB6C1' }
]

const nearbyPlace = {
  name: '中央公园',
  distance: '500m',
  desc: '草坪宽广，宠物友好设施完善'
}

const handleBreedSelect = (value: string) => {
  selectedBreed.value = value
  showFilterPanel.value = false
}

const handleLocation = () => {
  uni.showToast({
    title: '定位中...',
    icon: 'loading'
  })
}

const goToFriendList = () => {
  uni.navigateTo({
    url: '/pages/home/friendList'
  })
}

const goToPlaceList = () => {
  uni.navigateTo({
    url: '/pages/home/placeList'
  })
}
</script>

<style lang="scss" scoped>
.home-container {
  min-height: 100vh;
  background: #FFF9F9;
}

.home-content {
  padding-top: calc(var(--status-bar-height, 44px) + 96rpx);
  padding-bottom: calc(112rpx + constant(safe-area-inset-bottom));
}

.filter-bar {
  display: flex;
  padding: 24rpx 32rpx;
  gap: 16rpx;
  overflow-x: auto;
  white-space: nowrap;
}

.filter-tag {
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

.filter-more {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 16rpx 24rpx;
  background: #FFFFFF;
  border-radius: 24rpx;
  border: 2rpx solid #E5E5E5;
}

.more-text {
  font-size: 26rpx;
  color: #999999;
}

.more-icon {
  width: 0;
  height: 0;
  border-left: 8rpx solid transparent;
  border-right: 8rpx solid transparent;
  border-top: 12rpx solid #999999;
}

.map-container {
  position: relative;
  height: 500rpx;
  margin: 0 32rpx;
  border-radius: 24rpx;
  overflow: hidden;
  background: #FFFFFF;
  border: 2rpx solid #FFC1E9;
}

.map-placeholder {
  width: 100%;
  height: 100%;
  position: relative;
  background: linear-gradient(180deg, #E0F7FF 0%, #FFF9F9 100%);
}

.map-grid {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  grid-template-rows: repeat(10, 1fr);
  width: 100%;
  height: 100%;
  opacity: 0.3;
}

.grid-cell {
  border-right: 1rpx solid #FFC1E9;
  border-bottom: 1rpx solid #FFC1E9;
}

.map-points {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.map-point {
  position: absolute;
  
  &.point-user {
    .point-avatar {
      border: 3rpx solid #FFC1E9;
    }
  }
}

.point-avatar {
  width: 56rpx;
  height: 56rpx;
  border-radius: 50%;
  padding: 4rpx;
  background: #FFFFFF;
}

.avatar-inner {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.point-label {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  font-size: 20rpx;
  color: #FFC1E9;
  background: rgba(255, 255, 255, 0.9);
  padding: 4rpx 12rpx;
  border-radius: 12rpx;
  margin-top: 8rpx;
}

.map-center-marker {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.marker-ring {
  width: 60rpx;
  height: 60rpx;
  border: 4rpx solid #FF6B6B;
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0% { transform: scale(1); opacity: 1; }
  100% { transform: scale(2); opacity: 0; }
}

.marker-dot {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20rpx;
  height: 20rpx;
  background: #FF6B6B;
  border-radius: 50%;
}

.location-btn {
  position: absolute;
  bottom: 20rpx;
  right: 20rpx;
  width: 72rpx;
  height: 72rpx;
  background: #FFFFFF;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
}

.location-icon {
  width: 36rpx;
  height: 36rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23FFC1E9'%3E%3Cpath d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'/%3E%3C/svg%3E") no-repeat center;
  background-size: 100%;
}

.quick-cards {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  padding: 32rpx;
}

.quick-card {
  background: #FFFFFF;
  border-radius: 24rpx;
  padding: 24rpx;
  border: 2rpx solid #FFC1E9;
  
  &:active {
    transform: scale(0.98);
  }
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 16rpx;
}

.card-icon {
  width: 40rpx;
  height: 40rpx;
  
  &.icon-friend {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23FFC1E9'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E") no-repeat center;
    background-size: 100%;
  }
  
  &.icon-place {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23FFC1E9'%3E%3Cpath d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'/%3E%3C/svg%3E") no-repeat center;
    background-size: 100%;
  }
}

.card-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #FFC1E9;
}

.card-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.friend-avatars {
  display: flex;
}

.friend-avatar {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  margin-left: -12rpx;
  border: 3rpx solid #FFFFFF;
  
  &:first-child {
    margin-left: 0;
  }
}

.avatar-bg {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.friend-more {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  background: #FFC1E9;
  color: #FFFFFF;
  font-size: 22rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: -12rpx;
  border: 3rpx solid #FFFFFF;
}

.card-desc {
  font-size: 24rpx;
  color: #999999;
}

.place-info {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.place-name {
  font-size: 28rpx;
  font-weight: 600;
  color: #333333;
}

.place-distance {
  font-size: 22rpx;
  color: #FFC1E9;
}

.filter-panel {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  align-items: flex-end;
}

.panel-content {
  width: 100%;
  background: #FFFFFF;
  border-radius: 32rpx 32rpx 0 0;
  max-height: 70vh;
  overflow: hidden;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32rpx;
  border-bottom: 2rpx solid #FFC1E9;
}

.panel-title {
  font-size: 34rpx;
  font-weight: 600;
  color: #FFC1E9;
}

.panel-close {
  width: 48rpx;
  height: 48rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23FFC1E9'%3E%3Cpath d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'/%3E%3C/svg%3E") no-repeat center;
  background-size: 100%;
}

.panel-body {
  padding: 24rpx 32rpx;
  overflow-y: auto;
  max-height: calc(70vh - 100rpx);
}

.breed-item {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 24rpx 0;
  border-bottom: 1rpx solid #E5E5E5;
  
  &:last-child {
    border-bottom: none;
  }
  
  &.active {
    .breed-check {
      background: #FFC1E9;
      
      &::after {
        display: block;
      }
    }
    
    .breed-name {
      color: #FFC1E9;
      font-weight: 600;
    }
  }
}

.breed-check {
  width: 36rpx;
  height: 36rpx;
  border: 2rpx solid #E5E5E5;
  border-radius: 50%;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 16rpx;
    height: 16rpx;
    background: #FFFFFF;
    border-radius: 50%;
    display: none;
  }
}

.breed-name {
  font-size: 28rpx;
  color: #333333;
}
</style>
