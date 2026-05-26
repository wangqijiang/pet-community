<template>
  <view class="page-container">
    <TopNavBar title="同城狗友地图" />

    <view class="map-container">
      <image
        class="map-image"
        src="https://maps.geoapify.com/v1/staticmap?style=osm-bright&width=600&height=1200&center=lonlat:116.397128,39.916527&zoom=11&apiKey=YOUR_API_KEY"
        mode="aspectFill"
      />

      <view class="marker m1" @click="handleMarkerTap(1)">
        <view class="marker-icon icon-paw"></view>
      </view>
      <view class="marker m2" @click="handleMarkerTap(2)">
        <view class="marker-icon icon-trees"></view>
      </view>
      <view class="marker m3" @click="handleMarkerTap(3)">
        <view class="marker-icon icon-coffee"></view>
      </view>

      <view class="location-btn" @click="handleLocation">
        <view class="location-icon"></view>
      </view>

      <view class="bottom-card" @click="goToPlaceList">
        <view class="card-left">
          <view class="card-icon">
            <view class="card-icon-inner icon-map"></view>
          </view>
          <view class="card-info">
            <text class="card-title">附近遛狗好去处</text>
            <text class="card-desc">发现周边宠物友好地点</text>
          </view>
        </view>
        <view class="card-arrow"></view>
      </view>
    </view>

    <TabBar :current="0" />
  </view>
</template>

<script setup lang="ts">
import TopNavBar from "@/components/common/TopNavBar.vue";
import TabBar from "@/components/common/TabBar.vue";

const handleMarkerTap = (id: number) => {
  console.log("Marker tapped:", id);
};

const handleLocation = () => {
  uni.showToast({
    title: "定位中...",
    icon: "loading",
  });
};

const goToPlaceList = () => {
  uni.navigateTo({
    url: "/pages/home/placeList",
  });
};
</script>

<style lang="scss" scoped>
.page-container {
  width: 100%;
  min-height: 100vh;
  background: #FFF7F1;
  position: relative;
  display: flex;
  flex-direction: column;
}

.map-container {
  flex: 1;
  width: 100%;
  position: relative;
  overflow: hidden;
}

.map-image {
  width: 100%;
  height: 100%;
  filter: saturate(0.88) brightness(1.02);
}

.marker {
  position: absolute;
  width: 108rpx;
  height: 108rpx;
  border-radius: 999rpx;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 20rpx 48rpx rgba(255, 179, 107, 0.18);
  z-index: 5;

  &::after {
    content: '';
    position: absolute;
    bottom: -12rpx;
    width: 36rpx;
    height: 36rpx;
    background: #ffffff;
    transform: rotate(45deg);
    z-index: -1;
  }
}

.marker-icon {
  width: 48rpx;
  height: 48rpx;

  &.icon-paw {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23F4A259'%3E%3Cpath d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'/%3E%3C/svg%3E")
      no-repeat center;
    background-size: 100%;
  }

  &.icon-trees {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%235BA85B'%3E%3Cpath d='M12 22c2.76 0 5-2.24 5-5 0-.62-.13-1.21-.34-1.76l1.45 1.45c.39.39 1.03.39 1.42 0 .38-.39.39-1.03 0-1.42l-1.45-1.45C18.79 14.13 19 13.54 19 13c0-3.86-3.14-7-7-7s-7 3.14-7 7c0 .54.21 1.13.54 1.61l-1.45 1.45c-.39.39-.38 1.03 0 1.42.39.39 1.03.39 1.42 0l1.45-1.45c-.21.55-.34 1.14-.34 1.76 0 2.76 2.24 5 5 5zm-3-8c0-1.66 1.34-3 3-3s3 1.34 3 3-1.34 3-3 3-3-1.34-3-3z'/%3E%3C/svg%3E")
      no-repeat center;
    background-size: 100%;
  }

  &.icon-coffee {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%238B6914'%3E%3Cpath d='M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z'/%3E%3C/svg%3E")
      no-repeat center;
    background-size: 100%;
  }
}

.m1 {
  top: 240rpx;
  left: 180rpx;
}

.m2 {
  top: 520rpx;
  right: 120rpx;
}

.m3 {
  bottom: 360rpx;
  left: 140rpx;
}

.location-btn {
  position: absolute;
  right: 40rpx;
  bottom: 280rpx;
  width: 112rpx;
  height: 112rpx;
  border-radius: 999rpx;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 16rpx 48rpx rgba(107, 78, 61, 0.12);
  z-index: 5;
}

.location-icon {
  width: 48rpx;
  height: 48rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%237A6E6E'%3E%3Cpath d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;
}

.bottom-card {
  position: absolute;
  left: 32rpx;
  right: 32rpx;
  bottom: 200rpx;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(20px);
  border-radius: 56rpx;
  padding: 40rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 24rpx 64rpx rgba(107, 78, 61, 0.08);
  z-index: 5;
}

.card-left {
  display: flex;
  align-items: center;
  gap: 32rpx;
}

.card-icon {
  width: 112rpx;
  height: 112rpx;
  border-radius: 999rpx;
  background: #FFF0E0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-icon-inner {
  width: 56rpx;
  height: 56rpx;

  &.icon-map {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23F4A259'%3E%3Cpath d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'/%3E%3C/svg%3E")
      no-repeat center;
    background-size: 100%;
  }
}

.card-info {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.card-title {
  font-size: 40rpx;
  font-weight: 700;
  color: #3D2F2F;
}

.card-desc {
  font-size: 26rpx;
  color: #8A7F7F;
}

.card-arrow {
  width: 36rpx;
  height: 36rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%238A7F7F'%3E%3Cpath d='M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;
}
</style>
