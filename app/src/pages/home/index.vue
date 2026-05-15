<template>
  <view class="home-page">
    <TopNavBar title="同城狗友地图" :show-back="false">
      <template #right>
        <image
          class="message-icon"
          src="/static/images/icon-message.png"
          mode="aspectFit"
          @tap="goToMessage"
        ></image>
      </template>
    </TopNavBar>

    <view class="page-content">
      <!-- 品种筛选栏 -->
      <view class="filter-bar" @tap="toggleFilter">
        <view class="filter-tag">狗狗品种</view>
        <text class="filter-text">{{ selectedBreed || '全部品种' }}</text>
        <image
          class="arrow-icon"
          :class="{ 'arrow-rotate': showFilter }"
          src="/static/images/icon-arrow-down.png"
          mode="aspectFit"
        ></image>
      </view>

      <!-- 地图区域 -->
      <view class="map-container">
        <map
          id="petMap"
          class="pet-map"
          :latitude="mapCenter.latitude"
          :longitude="mapCenter.longitude"
          :markers="markers"
          :show-location="true"
          @markertap="onMarkerTap"
        >
          <!-- 定位按钮 -->
          <cover-view class="location-btn" @tap="relocate">
            <cover-image class="location-icon" src="/static/images/icon-location.png"></cover-image>
          </cover-view>
        </map>
      </view>

      <!-- 底部快捷卡片 -->
      <view class="quick-cards">
        <view class="quick-card" @tap="goToFriendList">
          <image class="card-icon" src="/static/images/icon-friends.png" mode="aspectFit"></image>
          <text class="card-title">同片区热门狗友</text>
          <text class="card-subtitle">找同城同品种宠物主</text>
        </view>
        <view class="quick-card" @tap="goToPlaceList">
          <image class="card-icon" src="/static/images/icon-place.png" mode="aspectFit"></image>
          <text class="card-title">附近遛狗好去处</text>
          <text class="card-subtitle">公园/草坪/友好商圈导航</text>
        </view>
      </view>
    </view>

    <TabBar :current="0" />
    <Loading :visible="loading" />
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import TopNavBar from '@/components/common/TopNavBar.vue'
import TabBar from '@/components/common/TabBar.vue'
import Loading from '@/components/common/Loading.vue'

const loading = ref(false)
const showFilter = ref(false)
const selectedBreed = ref('')

const mapCenter = ref({
  latitude: 39.908823,
  longitude: 116.397470
})

const markers = ref([
  {
    id: 1,
    latitude: 39.908823,
    longitude: 116.397470,
    iconPath: '/static/images/marker-user.png',
    width: 30,
    height: 30
  }
])

onMounted(() => {
  getLocation()
})

const getLocation = () => {
  uni.getLocation({
    type: 'gcj02',
    success: (res) => {
      mapCenter.value = {
        latitude: res.latitude,
        longitude: res.longitude
      }
    }
  })
}

const toggleFilter = () => {
  showFilter.value = !showFilter.value
  uni.vibrateShort({ type: 'light' })
}

const relocate = () => {
  getLocation()
  uni.vibrateShort({ type: 'medium' })
}

const onMarkerTap = (e) => {
  console.log('Marker tapped:', e.detail.markerId)
  uni.vibrateShort({ type: 'light' })
}

const goToMessage = () => {
  uni.switchTab({
    url: '/pages/message/index'
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
@import '@/styles/variables.scss';

.home-page {
  width: 100%;
  min-height: 100vh;
  background: $color-bg-primary;
}

.page-content {
  padding-top: calc(#{$nav-bar-height} + 20rpx);
  padding-bottom: $tab-bar-height;
}

.filter-bar {
  width: 90%;
  height: 88rpx;
  margin: 0 auto 24rpx;
  background: $color-bg-primary;
  border: $border-width solid $color-primary;
  border-radius: $border-radius-base;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32rpx;

  .filter-tag {
    padding: 8rpx 16rpx;
    background: $color-primary;
    color: $color-bg-white;
    font-size: $font-size-body;
    border-radius: $border-radius-small;
  }

  .filter-text {
    flex: 1;
    margin: 0 24rpx;
    font-size: $font-size-body;
    color: $color-gray-dark;
  }

  .arrow-icon {
    width: 40rpx;
    height: 40rpx;
    transition: transform $transition-base ease;

    &.arrow-rotate {
      transform: rotate(180deg);
    }
  }
}

.map-container {
  width: 100%;
  height: calc(100vh - #{$nav-bar-height} - #{$tab-bar-height} - 320rpx);
  position: relative;

  .pet-map {
    width: 100%;
    height: 100%;
  }

  .location-btn {
    position: absolute;
    top: 32rpx;
    right: 32rpx;
    width: 80rpx;
    height: 80rpx;
    background: $color-primary;
    border-radius: $border-radius-circle;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: $shadow-pink;

    .location-icon {
      width: 40rpx;
      height: 40rpx;
    }
  }
}

.quick-cards {
  display: flex;
  gap: $spacing-component;
  padding: $spacing-page-horizontal;

  .quick-card {
    flex: 1;
    background: $color-bg-white;
    border-radius: $border-radius-base;
    padding: $spacing-component;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $spacing-item;
    box-shadow: $shadow-light;
    transition: transform $transition-base ease;

    &:active {
      transform: scale($scale-press);
    }

    .card-icon {
      width: 48rpx;
      height: 48rpx;
    }

    .card-title {
      font-size: $font-size-button;
      font-weight: $font-weight-bold;
      color: $color-primary;
      text-align: center;
    }

    .card-subtitle {
      font-size: $font-size-helper;
      color: $color-gray-lighter;
      text-align: center;
    }
  }
}

.message-icon {
  width: $icon-size-medium;
  height: $icon-size-medium;
}
</style>
