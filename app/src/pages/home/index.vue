<template>
  <view class="page-container">
    <TopNavBar
      title="同城狗友地图"
      :showBack="false"
      rightIcon="icon-refresh"
    />

    <view class="home-content">
      <view class="filter-bar" @click="showFilterPanel = true">
        <view class="filter-tag">
          <text class="tag-badge">狗狗品种</text>
          <text class="tag-text">{{ selectedBreedName }}</text>
        </view>
        <view class="filter-arrow"></view>
      </view>

      <view class="map-container">
        <map
          class="map-component"
          :latitude="mapCenter.latitude"
          :longitude="mapCenter.longitude"
          :scale="15"
          :markers="markers"
          @markertap="handleMarkerTap"
          @tap="handleMapTap"
        >
          <view class="center-marker">
            <view class="center-ring"></view>
            <view class="center-dot"></view>
          </view>
        </map>

        <view class="location-btn" @click="handleLocation">
          <view class="location-icon"></view>
        </view>
      </view>

      <view class="quick-cards">
        <view class="quick-card" @click="goToFriendList">
          <view class="card-icon icon-friend"></view>
          <text class="card-title">同片区热门狗友</text>
        </view>

        <view class="quick-card" @click="goToPlaceList">
          <view class="card-icon icon-place"></view>
          <text class="card-title">附近遛狗好去处</text>
        </view>
      </view>
    </view>

    <TabBar :current="0" />

    <view
      class="filter-panel"
      v-if="showFilterPanel"
      @click="showFilterPanel = false"
    >
      <view class="panel-content" @click.stop>
        <view class="panel-header">
          <text class="panel-title">选择狗狗品种</text>
          <view class="panel-close" @click="showFilterPanel = false"></view>
        </view>

        <view class="panel-full-btn" @click="selectBreed('all', '全部品种')"
          >全部品种</view
        >

        <view class="popular-section">
          <text class="section-title">热门品种</text>
          <scroll-view scroll-x class="popular-scroll">
            <view class="popular-list">
              <view
                v-for="(breed, index) in popularBreeds"
                :key="index"
                class="popular-item"
                @click="selectBreed(breed.value, breed.label)"
              >
                <view
                  class="popular-avatar"
                  :style="{ background: breed.color }"
                ></view>
                <text class="popular-name">{{ breed.label }}</text>
              </view>
            </view>
          </scroll-view>
        </view>

        <view class="alphabet-section">
          <view
            v-for="group in breedGroups"
            :key="group.letter"
            class="breed-group"
          >
            <text class="group-letter">{{ group.letter }}</text>
            <view
              v-for="breed in group.breeds"
              :key="breed.value"
              class="breed-item"
              @click="selectBreed(breed.value, breed.label)"
            >
              {{ breed.label }}
            </view>
          </view>
        </view>

        <view class="panel-confirm" @click="showFilterPanel = false"
          >确定选择</view
        >
      </view>
    </view>

    <ModalUser
      :visible="showUserModal"
      :data="{ name: '糯米', color: '#FFC1E9' }"
      @close="showUserModal = false"
      @viewProfile="handleViewProfile"
      @sendMessage="handleSendMessage"
    />

    <ModalPlace
      :visible="showPlaceModal"
      :data="{
        name: '宠物草坪',
        distance: '800m',
        description:
          '草坪非常开阔，定期消毒修剪，非常适合狗狗社交奔跑，还有专属休息区。',
      }"
      @close="showPlaceModal = false"
      @navigate="handlePlaceNavigate"
    />

    <ModalStore
      :visible="showStoreModal"
      :data="{
        name: '汪汪门店',
        tag: '宠物洗护',
        address: '虹桥路 1234 号萌宠广场 B1 层',
        hours: '周一至周日 09:00 - 21:00',
        description:
          '专注高端宠物SPA与日系造型，采用进口洗护产品，为爱宠打造云朵般的柔顺质感。',
      }"
      @close="showStoreModal = false"
      @viewDetail="handleStoreDetail"
      @navigate="handleStoreNavigate"
    />
  </view>
</template>

<script setup lang="ts">
import TopNavBar from "@/components/common/TopNavBar.vue";
import TabBar from "@/components/common/TabBar.vue";
import ModalUser from "@/components/common/ModalUser.vue";
import ModalPlace from "@/components/common/ModalPlace.vue";
import ModalStore from "@/components/common/ModalStore.vue";
import { ref, computed } from "vue";

const selectedBreed = ref("all");
const showFilterPanel = ref(false);

const showUserModal = ref(false);
const showPlaceModal = ref(false);
const showStoreModal = ref(false);

const breeds: { value: string; label: string; color?: string }[] = [
  { label: "全部品种", value: "all" },
  { label: "金毛", value: "golden", color: "#FFC1E9" },
  { label: "柴犬", value: "shiba", color: "#FFB6C1" },
  { label: "柯基", value: "corgi", color: "#FFD4F0" },
  { label: "哈士奇", value: "husky", color: "#E0F7FF" },
  { label: "边牧", value: "border", color: "#FFE4E1" },
  { label: "泰迪", value: "teddy", color: "#FFC0CB" },
  { label: "阿拉斯加", value: "alaska", color: "#E8F5E9" },
  { label: "阿富汗猎犬", value: "afghan", color: "#FCE4EC" },
  { label: "边境牧羊犬", value: "border-collie", color: "#E3F2FD" },
  { label: "比熊", value: "bichon", color: "#FFF8E1" },
  { label: "巴哥", value: "pug", color: "#EFEBE9" },
];

const popularBreeds = breeds.filter((b) =>
  ["golden", "shiba", "corgi", "husky", "border"].includes(b.value),
);

const breedGroups = [
  {
    letter: "A",
    breeds: breeds.filter((b) => ["alaska", "afghan"].includes(b.value)),
  },
  {
    letter: "B",
    breeds: breeds.filter((b) =>
      ["border-collie", "bichon", "pug"].includes(b.value),
    ),
  },
  {
    letter: "C",
    breeds: breeds.filter((b) => ["corgi"].includes(b.value)),
  },
];

const selectedBreedName = computed(() => {
  const breed = breeds.find((b) => b.value === selectedBreed.value);
  return breed ? breed.label : "全部品种";
});

// 地图中心点（北京天安门附近，用于演示）
const mapCenter = ref({
  latitude: 39.9042,
  longitude: 116.4074,
});

// 地图标记点
const markers = ref([
  {
    id: 1,
    latitude: 39.9052,
    longitude: 116.4054,
    iconPath: "/static/images/marker-user.png",
    width: 48,
    height: 48,
    callout: {
      content: "糯米",
      fontSize: 12,
      borderRadius: 20,
      bgColor: "#ffffff",
      padding: 8,
      borderColor: "#FFC1E9",
      borderWidth: 2,
    },
    type: "user",
  },
  {
    id: 2,
    latitude: 39.9032,
    longitude: 116.4104,
    iconPath: "/static/images/marker-place.png",
    width: 40,
    height: 40,
    callout: {
      content: "宠物草坪",
      fontSize: 12,
      borderRadius: 20,
      bgColor: "#ffffff",
      padding: 8,
      borderColor: "#52c41a",
      borderWidth: 2,
    },
    type: "place",
  },
  {
    id: 3,
    latitude: 39.9062,
    longitude: 116.4124,
    iconPath: "/static/images/marker-store.png",
    width: 40,
    height: 40,
    callout: {
      content: "汪汪门店",
      fontSize: 12,
      borderRadius: 20,
      bgColor: "#ffffff",
      padding: 8,
      borderColor: "#1890ff",
      borderWidth: 2,
    },
    type: "store",
  },
]);

const selectBreed = (value: string, label: string) => {
  selectedBreed.value = value;
};

const handleMarkerTap = (e: any) => {
  const markerId = e.detail.markerId;
  const marker = markers.value.find((m) => m.id === markerId);
  if (marker) {
    if (marker.type === "user") {
      showUserModal.value = true;
    } else if (marker.type === "place") {
      showPlaceModal.value = true;
    } else if (marker.type === "store") {
      showStoreModal.value = true;
    }
  }
};

const handleMapTap = () => {
  console.log("Map tapped");
};

const handleViewProfile = () => {
  uni.showToast({ title: "查看主页", icon: "none" });
};

const handleSendMessage = () => {
  uni.showToast({ title: "发私信", icon: "none" });
};

const handlePlaceNavigate = () => {
  uni.showToast({ title: "导航到宠物草坪", icon: "none" });
};

const handleStoreDetail = () => {
  uni.showToast({ title: "查看门店详情", icon: "none" });
};

const handleStoreNavigate = () => {
  uni.showToast({ title: "导航到汪汪门店", icon: "none" });
};

const handleLocation = () => {
  uni.showToast({
    title: "定位中...",
    icon: "loading",
  });
};

const goToFriendList = () => {
  uni.navigateTo({
    url: "/pages/home/friendList",
  });
};

const goToPlaceList = () => {
  uni.navigateTo({
    url: "/pages/home/placeList",
  });
};
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";

.home-content {
  padding-bottom: calc(112rpx + constant(safe-area-inset-bottom));
}

.filter-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 32rpx;
  padding: 20rpx 32rpx;
  background: $color-bg-white;
  border: 2rpx solid $color-primary-light;
  border-radius: 40rpx;
  box-shadow: 0 4rpx 20rpx rgba(168, 155, 157, 0.12);
}

.filter-tag {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.tag-badge {
  padding: 6rpx 16rpx;
  background: rgba(113, 88, 92, 0.1);
  color: $color-primary;
  font-size: 20rpx;
  font-weight: $font-weight-bold;
  border-radius: 8rpx;
}

.tag-text {
  font-size: $font-size-body;
  color: $color-gray-dark;
  font-weight: $font-weight-medium;
}

.filter-arrow {
  width: 0;
  height: 0;
  border-left: 10rpx solid transparent;
  border-right: 10rpx solid transparent;
  border-top: 14rpx solid $color-gray-medium;
}

.map-container {
  position: relative;
  height: 600rpx;
  margin: 32rpx;
  border-radius: $border-radius-large;
  overflow: hidden;
  background: $color-bg-white;
}

.map-component {
  width: 100%;
  height: 100%;
}

.center-marker {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
}

.center-ring {
  width: 80rpx;
  height: 80rpx;
  border: 4rpx solid $color-primary;
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
}

.location-btn {
  position: absolute;
  bottom: 32rpx;
  right: 32rpx;
  width: 80rpx;
  height: 80rpx;
  background: $color-bg-white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 20rpx rgba(168, 155, 157, 0.12);
  border: 2rpx solid rgba(113, 88, 92, 0.2);

  &:active {
    transform: scale(1);
  }
}

.location-icon {
  width: 40rpx;
  height: 40rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2371585C'%3E%3Cpath d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;
}

.quick-cards {
  display: flex;
  gap: 24rpx;
  padding: 0 32rpx;
}

.quick-card {
  flex: 1;
  background: $color-bg-white;
  border-radius: $border-radius-large;
  padding: 32rpx 24rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 2rpx solid rgba(113, 88, 92, 0.1);
  box-shadow: 0 4rpx 20rpx rgba(168, 155, 157, 0.08);

  &:active {
    transform: scale(1);
    box-shadow: 0 4rpx 20rpx rgba(168, 155, 157, 0.15);
  }
}

.card-icon {
  width: 72rpx;
  height: 72rpx;
  background: rgba(113, 88, 92, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16rpx;

  &.icon-friend {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2371585C'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E")
      no-repeat center;
    background-size: 100%;
    background-color: rgba(113, 88, 92, 0.1);
  }

  &.icon-place {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2371585C'%3E%3Cpath d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'/%3E%3C/svg%3E")
      no-repeat center;
    background-size: 100%;
    background-color: rgba(113, 88, 92, 0.1);
  }
}

.card-title {
  font-size: 26rpx;
  font-weight: $font-weight-bold;
  color: $color-primary;
}

.filter-panel {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1000;
  display: flex;
  align-items: flex-end;
}

.panel-content {
  width: 100%;
  background: $color-bg-white;
  border-radius: $border-radius-xl $border-radius-xl 0 0;
  max-height: 80vh;
  overflow: hidden;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32rpx;
}

.panel-title {
  font-size: $font-size-title;
  font-weight: $font-weight-bold;
  color: $color-gray-dark;
}

.panel-close {
  width: 48rpx;
  height: 48rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%238A7A7C'%3E%3Cpath d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;
}

.panel-full-btn {
  margin: 0 32rpx 32rpx;
  padding: 24rpx;
  background: rgba(113, 88, 92, 0.1);
  color: $color-primary;
  font-weight: $font-weight-bold;
  text-align: center;
  border-radius: $border-radius-large;

  &:active {
    background: rgba(113, 88, 92, 0.15);
  }
}

.popular-section {
  padding: 0 32rpx;
  margin-bottom: 32rpx;
}

.section-title {
  font-size: $font-size-helper;
  font-weight: $font-weight-bold;
  color: $color-gray-medium;
  text-transform: uppercase;
  letter-spacing: 2rpx;
  margin-bottom: 20rpx;
  display: block;
}

.popular-scroll {
  white-space: nowrap;
}

.popular-list {
  display: inline-flex;
  gap: 32rpx;
}

.popular-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 128rpx;
}

.popular-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  margin-bottom: 12rpx;
  border: 3rpx solid $color-primary-light;
}

.popular-name {
  font-size: $font-size-helper;
  color: $color-gray-dark;
}

.alphabet-section {
  padding: 0 32rpx;
  max-height: 400rpx;
  overflow-y: auto;
}

.breed-group {
  margin-bottom: 24rpx;
}

.group-letter {
  font-size: $font-size-helper;
  font-weight: $font-weight-bold;
  color: $color-primary;
  margin-bottom: 16rpx;
  display: block;
}

.breed-item {
  font-size: $font-size-body;
  color: $color-gray-dark;
  padding: 16rpx 20rpx;
  border-radius: $border-radius-medium;

  &:active {
    background: rgba(113, 88, 92, 0.08);
  }
}

.panel-confirm {
  margin: 32rpx;
  padding: 28rpx;
  background: $color-primary;
  color: $color-bg-white;
  font-weight: $font-weight-bold;
  text-align: center;
  border-radius: $border-radius-large;

  &:active {
    background: $color-primary-dark;
  }
  box-shadow: 0 8rpx 24rpx rgba(255, 188, 198, 0.3);
}
</style>
