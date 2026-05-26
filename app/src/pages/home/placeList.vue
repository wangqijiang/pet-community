<template>
  <view class="place-list-container">
    <view class="topbar">
      <view class="back-btn" @click="goBack">
        <view class="back-icon"></view>
      </view>
      <text class="title">遛狗好去处</text>
      <view class="right-btn">
        <view class="action-icon icon-ellipsis"></view>
      </view>
    </view>

    <scroll-view scroll-x class="tabs">
      <view class="tab-list">
        <view
          v-for="(tab, index) in tabs"
          :key="index"
          class="tab"
          :class="{ active: currentTab === index }"
          @click="currentTab = index"
        >
          {{ tab }}
        </view>
      </view>
    </scroll-view>

    <scroll-view scroll-y class="list">
      <view
        v-for="(place, index) in placeList"
        :key="index"
        class="card"
        @click="goToDetail(place)"
      >
        <image class="cover" :src="place.image" mode="aspectFill" />
        <view class="content">
          <view class="tag">{{ place.type }}</view>
          <view class="name">{{ place.name }}</view>
          <view class="desc">{{ place.desc }}</view>
          <view class="meta">
            <view class="meta-item">
              <view class="meta-icon icon-star"></view>
              <text class="meta-text">{{ place.rating }}</text>
            </view>
            <view class="meta-item">
              <view class="meta-icon icon-pin"></view>
              <text class="meta-text">{{ place.distance }}</text>
            </view>
            <view class="meta-item">
              <view class="meta-icon icon-paw"></view>
              <text class="meta-text">{{ place.petCount }}只宠物</text>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";

const currentTab = ref(0);

const tabs = ["全部", "公园", "宠物乐园", "宠物店", "咖啡厅"];

const placeList = [
  {
    name: "中央公园",
    desc: "草坪非常大，很适合带狗狗奔跑，傍晚阳光特别舒服。",
    type: "公园",
    rating: "4.9",
    distance: "500m",
    petCount: 23,
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "萌宠乐园",
    desc: "有障碍区和互动区域，适合社交型狗狗一起玩耍。",
    type: "宠物乐园",
    rating: "4.8",
    distance: "1.2km",
    petCount: 15,
    image:
      "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=1200&auto=format&fit=crop",
  },
];

const goBack = () => {
  uni.navigateBack();
};

const goToDetail = (place: any) => {
  uni.navigateTo({
    url: `/pages/home/storeDetail?name=${place.name}`,
  });
};
</script>

<style lang="scss" scoped>
.place-list-container {
  min-height: 100vh;
  background: #fff7f1;
  display: flex;
  flex-direction: column;
}

.topbar {
  height: 184rpx;
  padding: 104rpx 40rpx 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(255, 247, 241, 0.88);
  backdrop-filter: blur(20px);
}

.back-btn {
  width: 80rpx;
  height: 80rpx;
  border-radius: 999rpx;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 24rpx rgba(107, 78, 61, 0.08);
}

.back-icon {
  width: 32rpx;
  height: 32rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%236B4E3D'%3E%3Cpath d='M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;
}

.title {
  font-size: 40rpx;
  font-weight: 700;
  color: #5e4636;
}

.right-btn {
  width: 80rpx;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-icon {
  width: 36rpx;
  height: 36rpx;

  &.icon-ellipsis {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%236B4E3D'%3E%3Cpath d='M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z'/%3E%3C/svg%3E")
      no-repeat center;
    background-size: 100%;
  }
}

.tabs {
  padding: 32rpx;
  flex-shrink: 0;
  box-sizing: border-box;
}

.tab-list {
  display: inline-flex;
  gap: 20rpx;
}

.tab {
  padding: 20rpx 36rpx;
  border-radius: 999rpx;
  background: #ffffff;
  color: #8a7f7f;
  font-size: 26rpx;
  white-space: nowrap;
  border: 1rpx solid #f1e5da;

  &.active {
    background: #ffd8e9;
    border: none;
    color: #d46e9b;
    font-weight: 600;
  }
}

.list {
  flex: 1;
  padding: 0 32rpx 32rpx;
  box-sizing: border-box;
}

.card {
  background: #ffffff;
  border-radius: 48rpx;
  overflow: hidden;
  margin-bottom: 36rpx;
  box-shadow: 0 16rpx 48rpx rgba(107, 78, 61, 0.06);
}

.cover {
  width: 100%;
  height: 400rpx;
}

.content {
  padding: 36rpx;
}

.tag {
  display: inline-flex;
  padding: 12rpx 24rpx;
  border-radius: 999rpx;
  background: #fff0f6;
  color: #d46e9b;
  font-size: 24rpx;
  margin-bottom: 24rpx;
}

.name {
  font-size: 44rpx;
  font-weight: 700;
  color: #3d2f2f;
}

.desc {
  margin-top: 16rpx;
  color: #7a6e6e;
  line-height: 1.8;
  font-size: 28rpx;
}

.meta {
  margin-top: 32rpx;
  display: flex;
  gap: 36rpx;
  color: #9b8f8f;
  font-size: 26rpx;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.meta-icon {
  width: 28rpx;
  height: 28rpx;

  &.icon-star {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23FFD700'%3E%3Cpath d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'/%3E%3C/svg%3E")
      no-repeat center;
    background-size: 100%;
  }

  &.icon-pin {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%237B5B45'%3E%3Cpath d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'/%3E%3C/svg%3E")
      no-repeat center;
    background-size: 100%;
  }

  &.icon-paw {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23D46E9B'%3E%3Cpath d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'/%3E%3C/svg%3E")
      no-repeat center;
    background-size: 100%;
  }
}

.meta-text {
  font-size: 26rpx;
}
</style>
