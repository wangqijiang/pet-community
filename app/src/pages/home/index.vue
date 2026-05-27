<template>
  <view class="page-container">
    <TopNavBar title="同城狗友地图" />

    <view class="map-container">
      <map
        id="map"
        class="map-component"
        :latitude="39.916527"
        :longitude="116.397128"
        :scale="13"
        :markers="markers"
        :show-location="true"
        @markertap="handleMarkerTap"
        @tap="handleMapTap"
      />

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
import { ref } from "vue";
import TopNavBar from "@/components/common/TopNavBar.vue";
import TabBar from "@/components/common/TabBar.vue";

const markers = ref([
  {
    id: 1,
    latitude: 39.926527,
    longitude: 116.407128,
    iconPath: "/static/images/marker-place.png",
    width: 48,
    height: 48,
    callout: {
      content: "宠物乐园",
      fontSize: 14,
      borderRadius: 8,
      bgColor: "#ffffff",
      padding: 8,
    },
  },
  {
    id: 2,
    latitude: 39.906527,
    longitude: 116.417128,
    iconPath: "/static/images/marker-store.png",
    width: 48,
    height: 48,
    callout: {
      content: "中央公园",
      fontSize: 14,
      borderRadius: 8,
      bgColor: "#ffffff",
      padding: 8,
    },
  },
  {
    id: 3,
    latitude: 39.916527,
    longitude: 116.387128,
    iconPath: "/static/images/marker-user.png",
    width: 48,
    height: 48,
    callout: {
      content: "宠物咖啡馆",
      fontSize: 14,
      borderRadius: 8,
      bgColor: "#ffffff",
      padding: 8,
    },
  },
]);

const handleMarkerTap = (e: any) => {
  const markerId = e.detail.markerId;
  const marker = markers.value.find((m) => m.id === markerId);
  if (marker) {
    uni.navigateTo({
      url: `/pages/home/storeDetail?id=${markerId}`,
    });
  }
};

const handleMapTap = () => {
  console.log("Map tapped");
};

const handleLocation = () => {
  uni.getLocation({
    type: "gcj02",
    success: (res) => {
      const mapContext = uni.createMapContext("map");
      mapContext.moveToLocation();
      uni.showToast({
        title: "定位成功",
        icon: "success",
      });
    },
    fail: () => {
      uni.showToast({
        title: "定位失败",
        icon: "none",
      });
    },
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
  height: 100vh;
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
  min-height: 0;
}

.map-component {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
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
