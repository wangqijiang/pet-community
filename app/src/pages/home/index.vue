<template>
  <PageLayout :tab-bar="true" :scrollable="false">
    <template #navbar>
      <TopNavBar title="同城狗友地图" :showBack="false" />
    </template>

    <view class="map-wrap" :style="mapAreaStyle">
      <map
        id="map"
        class="map-component"
        :style="mapAreaStyle"
        :latitude="mapCenter.lat"
        :longitude="mapCenter.lng"
        :scale="13"
        :markers="markers"
        :show-location="showLocation"
        @markertap="handleMarkerTap"
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

      <view class="friend-entry" @click="goToFriendList">
        <text>附近狗友</text>
      </view>
    </view>

    <template #tabbar>
      <TabBar :current="0" />
    </template>
  </PageLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { onShow } from "@dcloudio/uni-app";
import TopNavBar from "@/components/common/TopNavBar.vue";
import TabBar from "@/components/common/TabBar.vue";
import PageLayout from "@/components/common/PageLayout.vue";
import { useLayout } from "@/composables/useLayout";
import { getPlaceList } from "@/api/place";
import { getMapMarkers } from "@/api/user";
import { isLoggedIn } from "@/api/auth";
import { buildPlaceMarker, buildUserMarker } from "@/utils/mapMarkers";

const DEFAULT_MAP_CENTER = { lat: 39.916527, lng: 116.397128 };
const LOCATION_TIMEOUT_MS = 2500;

const { contentHeight } = useLayout({ tabBar: true });
const mapAreaStyle = computed(() => ({
  width: "100%",
  height: `${contentHeight.value}px`,
}));

const mapCenter = ref({ ...DEFAULT_MAP_CENTER });
const showLocation = ref(false);
const markers = ref<any[]>([]);
const markerMeta = ref<
  Record<number, { type: "place" | "user"; id: number; name: string }>
>({});

const loadMarkers = async (lat: number, lng: number) => {
  try {
    const list: ReturnType<typeof buildPlaceMarker>[] = [];
    const meta: Record<
      number,
      { type: "place" | "user"; id: number; name: string }
    > = {};

    // 地图展示全部上架场所，不按距离过滤（运营后台新增的场所任意坐标均可见）
    const placeRes = await getPlaceList({
      page: 1,
      size: 100,
    });

    placeRes.list.forEach((p) => {
      meta[p.id] = { type: "place", id: p.id, name: p.name };
      list.push(
        buildPlaceMarker({
          id: p.id,
          name: p.name,
          type: p.type,
          category_label: p.category_label,
          latitude: p.latitude,
          longitude: p.longitude,
        }),
      );
    });

    if (isLoggedIn()) {
      const data = await getMapMarkers(lat, lng);
      data.users.forEach((u) => {
        if (u.latitude == null || u.longitude == null) return;
        const marker = buildUserMarker(u);
        meta[marker.id] = { type: "user", id: u.id, name: u.username };
        list.push(marker);
      });
    }

    markers.value = list;
    markerMeta.value = meta;
  } catch (e) {
    console.error("加载地图标记失败", e);
  }
};

const handleMarkerTap = (e: { detail: { markerId: number } }) => {
  const info = markerMeta.value[e.detail.markerId];
  if (!info) return;
  if (info.type === "place") {
    uni.navigateTo({ url: `/pages/home/storeDetail?id=${info.id}` });
  } else {
    uni.navigateTo({
      url: `/pages/mine/userProfile?id=${info.id}&name=${encodeURIComponent(info.name)}`,
    });
  }
};

const applyMapCenter = (
  lat: number,
  lng: number,
  moveMap = false,
  hasRealLocation = false,
) => {
  mapCenter.value = { lat, lng };
  showLocation.value = hasRealLocation;
  if (moveMap && hasRealLocation) {
    uni.createMapContext("map").moveToLocation();
  }
  loadMarkers(lat, lng);
};

const getUserLocation = (): Promise<{
  lat: number;
  lng: number;
  fromDefault: boolean;
}> =>
  new Promise((resolve) => {
    let settled = false;
    const finish = (result: {
      lat: number;
      lng: number;
      fromDefault: boolean;
    }) => {
      if (settled) return;
      settled = true;
      resolve(result);
    };

    const timer = setTimeout(() => {
      finish({
        ...DEFAULT_MAP_CENTER,
        fromDefault: true,
      });
    }, LOCATION_TIMEOUT_MS);

    uni.getLocation({
      type: "gcj02",
      success: (res) => {
        clearTimeout(timer);
        finish({
          lat: res.latitude,
          lng: res.longitude,
          fromDefault: false,
        });
      },
      fail: () => {
        clearTimeout(timer);
        finish({
          ...DEFAULT_MAP_CENTER,
          fromDefault: true,
        });
      },
    });
  });

const initMapLocation = async () => {
  const { lat, lng, fromDefault } = await getUserLocation();
  applyMapCenter(lat, lng, false, !fromDefault);
};

const handleLocation = async () => {
  const { lat, lng, fromDefault } = await getUserLocation();
  applyMapCenter(lat, lng, true, !fromDefault);
  uni.showToast({
    title: fromDefault ? "定位失败，已展示默认区域" : "定位成功",
    icon: fromDefault ? "none" : "success",
  });
};

const goToPlaceList = () => {
  uni.navigateTo({ url: "/pages/home/placeList" });
};

const goToFriendList = () => {
  uni.navigateTo({ url: "/pages/home/friendList" });
};

onMounted(() => {
  applyMapCenter(
    DEFAULT_MAP_CENTER.lat,
    DEFAULT_MAP_CENTER.lng,
    false,
    false,
  );
  initMapLocation();
});

onShow(() => {
  loadMarkers(mapCenter.value.lat, mapCenter.value.lng);
});
</script>

<style lang="scss" scoped>
.map-wrap {
  position: relative;
  overflow: hidden;
}

.map-component {
  display: block;
}

.location-btn {
  position: absolute;
  right: 32rpx;
  bottom: 280rpx;
  width: 88rpx;
  height: 88rpx;
  border-radius: 50%;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 12rpx 32rpx rgba(107, 78, 61, 0.12);
  z-index: 5;
}

.location-icon {
  width: 40rpx;
  height: 40rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%237A6E6E'%3E%3Cpath d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;
}

.bottom-card {
  position: absolute;
  left: 32rpx;
  right: 32rpx;
  bottom: 32rpx;
  background: rgba(255, 255, 255, 0.92);
  border-radius: 48rpx;
  padding: 32rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 16rpx 48rpx rgba(107, 78, 61, 0.08);
  z-index: 5;
}

.friend-entry {
  position: absolute;
  left: 32rpx;
  top: 24rpx;
  padding: 16rpx 28rpx;
  background: rgba(255, 255, 255, 0.92);
  border-radius: 999rpx;
  font-size: 26rpx;
  color: #6b4e3d;
  font-weight: 600;
  z-index: 5;
  box-shadow: 0 8rpx 24rpx rgba(107, 78, 61, 0.08);
}

.card-left {
  display: flex;
  align-items: center;
  gap: 24rpx;
}

.card-icon {
  width: 96rpx;
  height: 96rpx;
  border-radius: 50%;
  background: #fff0e0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-icon-inner.icon-map {
  width: 48rpx;
  height: 48rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23F4A259'%3E%3Cpath d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;
}

.card-title {
  font-size: 32rpx;
  font-weight: 700;
  color: #3d2f2f;
  display: block;
}

.card-desc {
  font-size: 24rpx;
  color: #8a7f7f;
  display: block;
  margin-top: 4rpx;
}

.card-arrow {
  width: 32rpx;
  height: 32rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%238A7F7F'%3E%3Cpath d='M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;
}
</style>
