<script setup>
import { ref, onMounted } from 'vue'
import CustomNavbar from '../../components/CustomNavbar.vue'
import CustomButton from '../../components/CustomButton.vue'
import api from '../../api/index.js'

const props = defineProps({
  id: String
})

const placeId = ref(0)
const placeInfo = ref({
  id: 0,
  name: '',
  images: [],
  rating: 0,
  reviewCount: 0,
  tags: [],
  address: '',
  distance: 0,
  openTime: '',
  phone: '',
  description: '',
  facilities: [],
  reviews: []
})

const loadPlaceDetail = async () => {
  try {
    const res = await api.getPlaceDetail(placeId.value)
    placeInfo.value = res.data
  } catch (error) {
    console.error('Load place detail failed:', error)
    uni.showToast({ title: '加载失败', icon: 'none' })
  }
}

const handleCall = () => {
  uni.makePhoneCall({
    phoneNumber: placeInfo.value.phone
  })
}

const handleNavigate = () => {
  uni.openLocation({
    latitude: placeInfo.value.latitude,
    longitude: placeInfo.value.longitude,
    name: placeInfo.value.name,
    address: placeInfo.value.address
  })
}

const handleShare = () => {
  uni.showShareMenu()
}

const handleCheckIn = () => {
  uni.showToast({ title: '打卡成功！', icon: 'success' })
}

const previewImage = (images, current) => {
  uni.previewImage({
    urls: images,
    current: current
  })
}

onMounted(() => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  placeId.value = currentPage.options.id
  loadPlaceDetail()
})
</script>

<template>
  <view class="store-detail-page">
    <custom-navbar :title="placeInfo.name" />

    <scroll-view scroll-y class="page-content">
      <!-- Image Gallery -->
      <swiper class="image-swiper" indicator-dots indicator-color="rgba(255,255,255,0.5)" indicator-active-color="#71585c">
        <swiper-item v-for="(img, index) in placeInfo.images" :key="index">
          <image :src="img" class="swiper-image" mode="aspectFill" />
        </swiper-item>
      </swiper>

      <!-- Basic Info -->
      <view class="info-section marshmallow-shadow">
        <view class="section-header">
          <text class="place-name">{{ placeInfo.name }}</text>
          <view class="rating-box">
            <text class="rating-star">⭐</text>
            <text class="rating-score">{{ placeInfo.rating }}</text>
            <text class="rating-count">({{ placeInfo.reviewCount }})</text>
          </view>
        </view>

        <view class="tags-row">
          <text v-for="(tag, idx) in placeInfo.tags" :key="idx" class="tag-item">
            {{ tag }}
          </text>
        </view>

        <view class="info-row">
          <text class="info-icon">📍</text>
          <text class="info-text">{{ placeInfo.address }}</text>
          <text class="info-distance">{{ placeInfo.distance }}km</text>
        </view>

        <view class="info-row">
          <text class="info-icon">🕐</text>
          <text class="info-text">{{ placeInfo.openTime }}</text>
        </view>

        <view v-if="placeInfo.phone" class="info-row bouncy-active" @tap="handleCall">
          <text class="info-icon">📞</text>
          <text class="info-text info-link">{{ placeInfo.phone }}</text>
        </view>
      </view>

      <!-- Description -->
      <view class="info-section marshmallow-shadow">
        <text class="section-title">场所介绍</text>
        <text class="description-text">{{ placeInfo.description }}</text>
      </view>

      <!-- Facilities -->
      <view class="info-section marshmallow-shadow">
        <text class="section-title">设施服务</text>
        <view class="facilities-grid">
          <view v-for="(facility, idx) in placeInfo.facilities" :key="idx" class="facility-item">
            <text class="facility-icon">✓</text>
            <text class="facility-text">{{ facility }}</text>
          </view>
        </view>
      </view>

      <!-- Reviews -->
      <view class="info-section marshmallow-shadow">
        <view class="section-header">
          <text class="section-title">用户评价</text>
          <text class="review-count">{{ placeInfo.reviewCount }}条</text>
        </view>

        <view v-for="review in placeInfo.reviews" :key="review.id" class="review-item">
          <view class="review-header">
            <image :src="review.userAvatar" class="review-avatar" mode="aspectFill" />
            <view class="review-user-info">
              <text class="review-username">{{ review.userName }}</text>
              <view class="review-rating">
                <text v-for="i in review.rating" :key="i" class="star-icon">⭐</text>
              </view>
            </view>
            <text class="review-time">{{ review.createTime }}</text>
          </view>
          <text class="review-content">{{ review.content }}</text>
          <view v-if="review.images.length > 0" class="review-images">
            <image
              v-for="(img, idx) in review.images"
              :key="idx"
              :src="img"
              class="review-image"
              mode="aspectFill"
              @tap="previewImage(review.images, idx)"
            />
          </view>
        </view>
      </view>

      <view style="height: 80px;"></view>
    </scroll-view>

    <!-- Bottom Actions -->
    <view class="bottom-actions">
      <view class="action-btn bouncy-active" @tap="handleNavigate">
        <text class="action-icon">🧭</text>
        <text class="action-text">导航</text>
      </view>
      <view class="action-btn bouncy-active" @tap="handleShare">
        <text class="action-icon">📤</text>
        <text class="action-text">分享</text>
      </view>
      <custom-button type="primary" size="large" block @click="handleCheckIn">
        打卡签到
      </custom-button>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.store-detail-page {
  width: 100%;
  min-height: 100vh;
  background-color: var(--background);
}

.page-content {
  padding-top: 88px;
  height: calc(100vh - 88px);
  padding-bottom: 80px;
}

.image-swiper {
  width: 100%;
  height: 300px;
}

.swiper-image {
  width: 100%;
  height: 100%;
}

.info-section {
  margin: var(--gutter-card) var(--margin-page);
  padding: var(--padding-container);
  background-color: var(--surface-container);
  border-radius: var(--radius-xl);
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.place-name {
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 700;
  color: var(--on-surface);
}

.rating-box {
  display: flex;
  align-items: center;
  gap: 4px;
}

.rating-star {
  font-size: 16px;
}

.rating-score {
  font-size: 18px;
  font-weight: 600;
  color: var(--primary);
}

.rating-count {
  font-size: 12px;
  color: var(--on-surface-variant);
}

.tags-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.tag-item {
  font-size: 12px;
  color: var(--on-secondary-container);
  background-color: var(--secondary-container);
  padding: 4px 12px;
  border-radius: var(--radius-lg);
}

.info-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.info-icon {
  font-size: 18px;
}

.info-text {
  flex: 1;
  font-size: var(--text-body-md);
  color: var(--on-surface);
}

.info-link {
  color: var(--primary);
}

.info-distance {
  font-size: 12px;
  color: var(--on-surface-variant);
}

.section-title {
  font-size: var(--text-headline-md);
  font-weight: 600;
  color: var(--on-surface);
  margin-bottom: 12px;
  display: block;
}

.description-text {
  font-size: var(--text-body-md);
  color: var(--on-surface-variant);
  line-height: 1.6;
}

.facilities-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.facility-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.facility-icon {
  font-size: 16px;
  color: var(--primary);
}

.facility-text {
  font-size: var(--text-body-md);
  color: var(--on-surface);
}

.review-count {
  font-size: 12px;
  color: var(--on-surface-variant);
}

.review-item {
  padding: 12px 0;
  border-bottom: 1px solid var(--outline-variant);

  &:last-child {
    border-bottom: none;
  }
}

.review-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.review-avatar {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-full);
}

.review-user-info {
  flex: 1;
}

.review-username {
  font-size: var(--text-body-md);
  font-weight: 600;
  color: var(--on-surface);
  display: block;
}

.review-rating {
  display: flex;
  gap: 2px;
}

.star-icon {
  font-size: 12px;
}

.review-time {
  font-size: 11px;
  color: var(--on-surface-variant);
}

.review-content {
  font-size: var(--text-body-md);
  color: var(--on-surface);
  line-height: 1.5;
  margin-bottom: 8px;
  display: block;
}

.review-images {
  display: flex;
  gap: 8px;
}

.review-image {
  width: 80px;
  height: 80px;
  border-radius: var(--radius-lg);
}

.bottom-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 12px var(--margin-page);
  background-color: var(--surface);
  border-top: 1px solid var(--outline-variant);
  box-shadow: 0 -4px 12px rgba(113, 88, 92, 0.08);
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: calc(12px + env(safe-area-inset-bottom));
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  background-color: var(--surface-container);
  border-radius: var(--radius-lg);
}

.action-icon {
  font-size: 20px;
}

.action-text {
  font-size: 11px;
  color: var(--on-surface-variant);
}
</style>
