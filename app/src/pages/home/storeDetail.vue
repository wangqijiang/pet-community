<template>
  <view class="store-detail-container">
    <view class="hero">
      <image
        class="hero-image"
        src="https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=1200&auto=format&fit=crop"
        mode="aspectFill"
      />
      <view class="hero-mask"></view>

      <view class="topbar">
        <view class="nav-btn" @click="goBack">
          <view class="nav-icon icon-back"></view>
        </view>
        <view class="nav-group">
          <view class="nav-btn">
            <view class="nav-icon icon-ellipsis"></view>
          </view>
          <view class="nav-btn">
            <view class="nav-icon icon-circle"></view>
          </view>
        </view>
      </view>

      <view class="hero-content">
        <view class="tag">{{ typeLabel }}</view>
        <text class="store-name">{{ place.name || "加载中..." }}</text>
        <text class="store-desc">{{ place.description || place.address }}</text>
        <view class="meta-row">
          <view class="meta-item">
            <view class="meta-icon icon-star"></view>
            <text>{{ place.rating }}评分</text>
          </view>
          <view class="meta-item" v-if="place.distance">
            <view class="meta-icon icon-map-pin"></view>
            <text>距离{{ place.distance }}</text>
          </view>
          <view class="meta-item">
            <view class="meta-icon icon-paw"></view>
            <text>{{ place.reviews_count || 0 }}条评价</text>
          </view>
        </view>
      </view>
    </view>

    <view class="content">
      <view class="card">
        <view class="section-title">
          <view class="title-icon icon-file"></view>
          <text>店铺介绍</text>
        </view>
        <text class="intro">{{ place.description || "暂无介绍" }}</text>
      </view>

      <view class="card">
        <view class="section-title">
          <view class="title-icon icon-info"></view>
          <text>基础信息</text>
        </view>
        <view class="info-list">
          <view class="info-item">
            <view class="info-icon icon-clock"></view>
            <view class="info-content">
              <text class="info-label">营业时间</text>
              <text class="info-value">{{ place.business_hours || "暂无" }}</text>
            </view>
          </view>
          <view class="info-item">
            <view class="info-icon icon-map"></view>
            <view class="info-content">
              <text class="info-label">店铺地址</text>
              <text class="info-value">{{ place.address || "暂无" }}</text>
            </view>
          </view>
        </view>
      </view>

      <view class="card">
        <view class="section-title">
          <view class="title-icon icon-sparkles"></view>
          <text>快捷操作</text>
        </view>
        <view class="action-grid">
          <view class="action-item" @click="handleNavigate">
            <view class="action-icon icon-nav"></view>
            <text class="action-text">导航前往</text>
          </view>
          <view class="action-item" @click="handleCall">
            <view class="action-icon icon-phone"></view>
            <text class="action-text">联系店铺</text>
          </view>
          <view class="action-item" @click="handleCollect">
            <view class="action-icon icon-heart"></view>
            <text class="action-text">收藏地点</text>
          </view>
        </view>
      </view>

      <view class="card">
        <view class="section-title">
          <view class="title-icon icon-message"></view>
          <text>用户评价</text>
        </view>
        <view v-if="reviews.length === 0" class="review-text">暂无评价</view>
        <view v-for="review in reviews" :key="review.id" class="review-block">
          <view class="review-header">
            <view class="user">
              <image
                class="avatar"
                :src="resolveMediaUrl(review.avatar)"
                mode="aspectFill"
              />
              <view class="user-info">
                <text class="username">{{ review.username }}</text>
                <text class="date">{{ formatRelativeTime(review.created_at) }}</text>
              </view>
            </view>
          </view>
          <text class="review-text">{{ review.content }}</text>
        </view>
      </view>

      <view class="bottom-space"></view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { getPlaceDetail, getPlaceReviews, togglePlaceLike, type Place, type PlaceReview } from "@/api/place";
import { PLACE_TYPE_LABEL, formatRelativeTime } from "@/utils/format";
import { resolveMediaUrl } from "@/utils/media";

const place = ref<Partial<Place>>({});
const reviews = ref<PlaceReview[]>([]);
const favorited = ref(false);

const typeLabel = computed(
  () => PLACE_TYPE_LABEL[place.value.type || ""] || "宠物友好地点",
);

const goBack = () => uni.navigateBack();

const handleNavigate = () => {
  if (!place.value.latitude) return;
  uni.openLocation({
    latitude: Number(place.value.latitude),
    longitude: Number(place.value.longitude),
    name: place.value.name,
    address: place.value.address,
  });
};

const handleCall = () => {
  if (place.value.phone) uni.makePhoneCall({ phoneNumber: place.value.phone });
  else uni.showToast({ title: "暂无电话", icon: "none" });
};

const handleCollect = async () => {
  if (!place.value.id) return;
  try {
    const res = await togglePlaceLike(place.value.id);
    favorited.value = res.liked;
    uni.showToast({ title: res.liked ? "已收藏" : "已取消", icon: "success" });
  } catch {
    uni.showToast({ title: "操作失败", icon: "none" });
  }
};

onLoad(async (options) => {
  const id = Number(options?.id);
  if (!id) return;
  try {
    place.value = await getPlaceDetail(id);
    const res = await getPlaceReviews(id, 1, 5);
    reviews.value = res.list;
  } catch {
    uni.showToast({ title: "加载失败", icon: "none" });
  }
});
</script>

<style lang="scss" scoped>
.store-detail-container {
  min-height: 100vh;
  background: #FFF8F5;
}

.hero {
  position: relative;
  width: 100%;
  height: 720rpx;
}

.hero-image {
  width: 100%;
  height: 100%;
}

.hero-mask {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 360rpx;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.65));
}

.topbar {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  padding: 104rpx 36rpx 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 10;
}

.nav-btn {
  width: 80rpx;
  height: 80rpx;
  border-radius: 999rpx;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20rpx);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.08);
}

.nav-group {
  display: flex;
  gap: 20rpx;
}

.nav-icon {
  width: 32rpx;
  height: 32rpx;

  &.icon-back {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%235E4636'%3E%3Cpath d='M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z'/%3E%3C/svg%3E")
      no-repeat center;
    background-size: 100%;
  }

  &.icon-ellipsis {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%235E4636'%3E%3Cpath d='M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z'/%3E%3C/svg%3E")
      no-repeat center;
    background-size: 100%;
  }

  &.icon-circle {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%235E4636'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z'/%3E%3C/svg%3E")
      no-repeat center;
    background-size: 100%;
  }
}

.hero-content {
  position: absolute;
  left: 44rpx;
  bottom: 56rpx;
  z-index: 2;
  color: #ffffff;
}

.tag {
  display: inline-flex;
  align-items: center;
  padding: 16rpx 28rpx;
  border-radius: 999rpx;
  background: rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(24rpx);
  font-size: 26rpx;
  font-weight: 600;
  margin-bottom: 28rpx;
}

.store-name {
  font-size: 68rpx;
  font-weight: 800;
  letter-spacing: 2rpx;
  display: block;
}

.store-desc {
  margin-top: 20rpx;
  font-size: 28rpx;
  line-height: 1.8;
  opacity: 0.95;
  display: block;
}

.meta-row {
  margin-top: 32rpx;
  display: flex;
  gap: 36rpx;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 12rpx;
  font-size: 26rpx;
}

.meta-icon {
  width: 28rpx;
  height: 28rpx;

  &.icon-star {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23FFB648'%3E%3Cpath d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'/%3E%3C/svg%3E")
      no-repeat center;
    background-size: 100%;
  }

  &.icon-map-pin {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ffffff'%3E%3Cpath d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'/%3E%3C/svg%3E")
      no-repeat center;
    background-size: 100%;
  }

  &.icon-paw {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ffffff'%3E%3Cpath d='M4.5 12.75l6 6 9-13.5'/%3E%3C/svg%3E")
      no-repeat center;
    background-size: 100%;
  }
}

.content {
  padding: 44rpx 36rpx 80rpx;
}

.card {
  background: #ffffff;
  border-radius: 60rpx;
  padding: 44rpx;
  margin-bottom: 36rpx;
  box-shadow: 0 20rpx 60rpx rgba(107, 78, 61, 0.05);
}

.section-title {
  font-size: 36rpx;
  font-weight: 700;
  color: #4D3E3E;
  margin-bottom: 32rpx;
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.title-icon {
  width: 36rpx;
  height: 36rpx;

  &.icon-file {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23F4A259'%3E%3Cpath d='M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z'/%3E%3C/svg%3E")
      no-repeat center;
    background-size: 100%;
  }

  &.icon-info {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23F4A259'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z'/%3E%3C/svg%3E")
      no-repeat center;
    background-size: 100%;
  }

  &.icon-sparkles {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23F4A259'%3E%3Cpath d='M7 2v11h3v9l7-12h-4l4-8z'/%3E%3C/svg%3E")
      no-repeat center;
    background-size: 100%;
  }

  &.icon-message {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23F4A259'%3E%3Cpath d='M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2z'/%3E%3C/svg%3E")
      no-repeat center;
    background-size: 100%;
  }
}

.intro {
  color: #746868;
  font-size: 28rpx;
  line-height: 2;
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 32rpx;
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 28rpx;
}

.info-icon {
  width: 84rpx;
  height: 84rpx;
  border-radius: 32rpx;
  background: #FFF3E7;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &.icon-clock {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23F4A259'%3E%3Cpath d='M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z'/%3E%3C/svg%3E")
      no-repeat center;
    background-size: 60%;
    background-color: #FFF3E7;
  }

  &.icon-map {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23F4A259'%3E%3Cpath d='M20.5 3l-6 1.5-6-1.5-5.5 1.5v15l5.5-1.5 6 1.5 6-1.5v-15zm-6.5 13.5l-6-1.5v-11l6 1.5v11z'/%3E%3C/svg%3E")
      no-repeat center;
    background-size: 60%;
    background-color: #FFF3E7;
  }
}

.info-content {
  flex: 1;
}

.info-label {
  font-size: 26rpx;
  color: #B0A6A6;
  display: block;
}

.info-value {
  margin-top: 8rpx;
  font-size: 30rpx;
  font-weight: 600;
  color: #4D3E3E;
  line-height: 1.8;
  display: block;
}

.action-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 24rpx;
}

.action-item {
  height: 176rpx;
  border-radius: 48rpx;
  background: #FFF8F3;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
  transition: all 0.2s ease;

  &:active {
    transform: translateY(-4rpx);
  }
}

.action-icon {
  width: 48rpx;
  height: 48rpx;

  &.icon-nav {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23F4A259'%3E%3Cpath d='M12 3L1 10l4 2.18v6L12 21l7-3.82v-6l4-2.18L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9z'/%3E%3C/svg%3E")
      no-repeat center;
    background-size: 100%;
  }

  &.icon-phone {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23F4A259'%3E%3Cpath d='M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z'/%3E%3C/svg%3E")
      no-repeat center;
    background-size: 100%;
  }

  &.icon-heart {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23F4A259'%3E%3Cpath d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/%3E%3C/svg%3E")
      no-repeat center;
    background-size: 100%;
  }
}

.action-text {
  font-size: 28rpx;
  font-weight: 700;
  color: #6B5B5B;
}

.review-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 36rpx;
}

.user {
  display: flex;
  align-items: center;
  gap: 24rpx;
}

.avatar {
  width: 104rpx;
  height: 104rpx;
  border-radius: 36rpx;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.username {
  font-size: 32rpx;
  font-weight: 700;
  color: #4D3E3E;
}

.date {
  margin-top: 8rpx;
  font-size: 24rpx;
  color: #B0A6A6;
}

.stars {
  display: flex;
  gap: 4rpx;
}

.star-icon {
  width: 28rpx;
  height: 28rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23FFB648'%3E%3Cpath d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;
}

.review-text {
  font-size: 28rpx;
  line-height: 2;
  color: #746868;
}

.bottom-space {
  height: 80rpx;
}
</style>
