<template>
  <PageLayout :header-height="tabsHeight">
    <template #navbar>
      <TopNavBar title="遛狗好去处" :showBack="true" />
    </template>

    <template #header>
      <scroll-view scroll-x class="tabs">
        <view class="tab-list">
          <view
            v-for="(tab, index) in tabs"
            :key="index"
            class="tab"
            :class="{ active: currentTab === index }"
            @click="switchTab(index)"
          >
            {{ tab.label }}
          </view>
        </view>
      </scroll-view>
    </template>

    <view
      v-for="place in placeList"
      :key="place.id"
      class="card"
      @click="goToDetail(place)"
    >
      <image class="cover" :src="coverImage(place)" mode="aspectFill" />
      <view class="content">
        <view class="tag">{{ typeLabel(place.type) }}</view>
        <view class="name">{{ place.name }}</view>
        <view class="desc">{{ place.description || place.address }}</view>
        <view class="meta">
          <text class="meta-text">评分 {{ place.rating }}</text>
          <text class="meta-text" v-if="place.distance">{{ place.distance }}</text>
        </view>
      </view>
    </view>
    <view v-if="!loading && placeList.length === 0" class="empty">暂无地点</view>
  </PageLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import TopNavBar from "@/components/common/TopNavBar.vue";
import PageLayout from "@/components/common/PageLayout.vue";
import { getPlaceList, type Place } from "@/api/place";
import { PLACE_TYPE_LABEL } from "@/utils/format";
import { resolveMediaUrl } from "@/utils/media";

const tabsHeight = uni.upx2px(88);
const currentTab = ref(0);
const placeList = ref<Place[]>([]);
const loading = ref(false);
const lat = ref(39.916527);
const lng = ref(116.397128);

const tabs = [
  { label: "全部", type: "" },
  { label: "公园", type: "park" },
  { label: "咖啡厅", type: "cafe" },
  { label: "宠物店", type: "shop" },
  { label: "医院", type: "hospital" },
];

const typeLabel = (type: string) => PLACE_TYPE_LABEL[type] || type;
const coverImage = (place: Place) => {
  const imgs = place.images;
  if (imgs && imgs.length > 0) return resolveMediaUrl(imgs[0]);
  return `https://picsum.photos/seed/place${place.id}/400/300`;
};

const loadPlaces = async (reset = false) => {
  if (loading.value) return;
  loading.value = true;
  try {
    const res = await getPlaceList({
      page: 1,
      size: 20,
      type: tabs[currentTab.value].type,
      lat: lat.value,
      lng: lng.value,
      radius: 20,
    });
    placeList.value = reset ? res.list : res.list;
  } catch {
    uni.showToast({ title: "加载失败", icon: "none" });
  } finally {
    loading.value = false;
  }
};

const switchTab = (i: number) => {
  currentTab.value = i;
  loadPlaces(true);
};

const goToDetail = (place: Place) => {
  uni.navigateTo({ url: `/pages/home/storeDetail?id=${place.id}` });
};

onMounted(() => {
  uni.getLocation({
    type: "gcj02",
    success: (res) => {
      lat.value = res.latitude;
      lng.value = res.longitude;
      loadPlaces(true);
    },
    fail: () => loadPlaces(true),
  });
});
</script>

<style lang="scss" scoped>
.tabs {
  padding: 16rpx 32rpx;
  white-space: nowrap;
}

.tab-list {
  display: inline-flex;
  gap: 16rpx;
}

.tab {
  padding: 16rpx 28rpx;
  border-radius: 999rpx;
  background: #fff;
  font-size: 26rpx;
  color: #8a7f7f;

  &.active {
    background: #71585c;
    color: #fff;
  }
}

.page-layout__content {
  padding: 0 32rpx 24rpx;
}

.card {
  background: #fff;
  border-radius: 32rpx;
  overflow: hidden;
  margin-bottom: 24rpx;
}

.cover {
  width: 100%;
  height: 280rpx;
}

.content {
  padding: 28rpx;
}

.tag {
  font-size: 22rpx;
  color: #f4a259;
}

.name {
  font-size: 34rpx;
  font-weight: 700;
  color: #3d2f2f;
  margin-top: 8rpx;
}

.desc {
  font-size: 26rpx;
  color: #8a7f7f;
  margin-top: 8rpx;
}

.meta-text {
  font-size: 24rpx;
  color: #8a7f7f;
  margin-right: 16rpx;
}

.empty {
  text-align: center;
  padding: 80rpx;
  color: #8a7f7f;
}
</style>
