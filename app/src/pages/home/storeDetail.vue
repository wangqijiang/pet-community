<template>
  <view class="store-detail-page">
    <TopNavBar title="门店详情">
      <template #right>
        <image
          class="share-icon"
          src="/static/images/icon-share.png"
          mode="aspectFit"
          @tap="handleShare"
        ></image>
      </template>
    </TopNavBar>

    <view class="page-content">
      <!-- 轮播图 -->
      <swiper class="store-swiper" indicator-dots indicator-color="rgba(255,255,255,0.5)" indicator-active-color="#FFC1E9">
        <swiper-item v-for="(image, index) in storeInfo.images" :key="index">
          <image class="swiper-image" :src="image" mode="aspectFill"></image>
        </swiper-item>
      </swiper>

      <!-- 基本信息 -->
      <view class="store-info-card">
        <view class="store-header">
          <text class="store-name">{{ storeInfo.name }}</text>
          <view class="store-type">
            <text class="type-text">{{ storeInfo.type }}</text>
          </view>
        </view>
        <view class="store-rating">
          <image class="star-icon" src="/static/images/icon-star.png" mode="aspectFit"></image>
          <text class="rating-text">{{ storeInfo.rating }}</text>
          <text class="review-count">({{ storeInfo.reviewCount }}条评价)</text>
        </view>
        <view class="store-meta">
          <view class="meta-row">
            <image class="meta-icon" src="/static/images/icon-location-small.png" mode="aspectFit"></image>
            <text class="meta-text">{{ storeInfo.address }}</text>
          </view>
          <view class="meta-row">
            <image class="meta-icon" src="/static/images/icon-phone.png" mode="aspectFit"></image>
            <text class="meta-text">{{ storeInfo.phone }}</text>
          </view>
          <view class="meta-row">
            <image class="meta-icon" src="/static/images/icon-time.png" mode="aspectFit"></image>
            <text class="meta-text">{{ storeInfo.businessHours }}</text>
          </view>
        </view>
      </view>

      <!-- 地图位置 -->
      <view class="map-card">
        <view class="card-title">
          <text class="title-text">位置信息</text>
        </view>
        <map
          class="store-map"
          :latitude="storeInfo.latitude"
          :longitude="storeInfo.longitude"
          :markers="markers"
        ></map>
      </view>

      <!-- 操作按钮 -->
      <view class="action-buttons">
        <view class="action-btn" @tap="handleCall">
          <image class="btn-icon" src="/static/images/icon-phone-white.png" mode="aspectFit"></image>
          <text class="btn-text">拨打电话</text>
        </view>
        <view class="action-btn" @tap="handleNavigate">
          <image class="btn-icon" src="/static/images/icon-navigate.png" mode="aspectFit"></image>
          <text class="btn-text">导航</text>
        </view>
        <view
          class="action-btn collect-btn"
          :class="{ 'collected': storeInfo.isCollected }"
          @tap="toggleCollect"
        >
          <image
            class="btn-icon"
            :src="storeInfo.isCollected ? '/static/images/icon-heart-filled-white.png' : '/static/images/icon-heart-white.png'"
            mode="aspectFit"
          ></image>
          <text class="btn-text">{{ storeInfo.isCollected ? '已收藏' : '收藏' }}</text>
        </view>
      </view>

      <!-- 用户评价 -->
      <view class="review-card">
        <view class="card-title">
          <text class="title-text">用户评价</text>
          <text class="more-text">查看全部</text>
        </view>
        <view class="review-list">
          <view v-for="review in reviewList" :key="review.id" class="review-item">
            <view class="review-header">
              <image class="user-avatar" :src="review.avatar" mode="aspectFill"></image>
              <view class="user-info">
                <text class="user-name">{{ review.nickname }}</text>
                <view class="review-rating">
                  <image
                    v-for="star in 5"
                    :key="star"
                    class="star-small"
                    :src="star <= review.rating ? '/static/images/icon-star.png' : '/static/images/icon-star-gray.png'"
                    mode="aspectFit"
                  ></image>
                </view>
              </view>
              <text class="review-time">{{ review.time }}</text>
            </view>
            <text class="review-content">{{ review.content }}</text>
          </view>
        </view>
      </view>
    </view>

    <Loading :visible="loading" />
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import TopNavBar from '@/components/common/TopNavBar.vue'
import Loading from '@/components/common/Loading.vue'

const loading = ref(false)

const storeInfo = ref({
  id: 1,
  name: '朝阳公园',
  type: '公园',
  rating: 4.8,
  reviewCount: 128,
  address: '朝阳区朝阳公园南路1号',
  phone: '010-12345678',
  businessHours: '06:00-22:00',
  latitude: 39.908823,
  longitude: 116.397470,
  isCollected: false,
  images: [
    '/static/images/place-default.png',
    '/static/images/place-default.png',
    '/static/images/place-default.png'
  ]
})

const markers = ref([
  {
    id: 1,
    latitude: 39.908823,
    longitude: 116.397470,
    iconPath: '/static/images/marker-place.png',
    width: 30,
    height: 30
  }
])

const reviewList = ref([
  {
    id: 1,
    avatar: '/static/images/avatar-default.png',
    nickname: '铲屎官小王',
    rating: 5,
    time: '2天前',
    content: '环境很好，草坪很大，狗狗玩得很开心！'
  },
  {
    id: 2,
    avatar: '/static/images/avatar-default.png',
    nickname: '爱狗人士',
    rating: 4,
    time: '5天前',
    content: '不错的遛狗地点，就是人有点多。'
  }
])

onMounted(() => {
  loadStoreDetail()
})

const loadStoreDetail = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 1000)
}

const handleShare = () => {
  uni.vibrateShort({ type: 'light' })
  uni.showToast({
    title: '分享功能开发中',
    icon: 'none'
  })
}

const handleCall = () => {
  uni.vibrateShort({ type: 'medium' })
  uni.makePhoneCall({
    phoneNumber: storeInfo.value.phone
  })
}

const handleNavigate = () => {
  uni.vibrateShort({ type: 'medium' })
  uni.openLocation({
    latitude: storeInfo.value.latitude,
    longitude: storeInfo.value.longitude,
    name: storeInfo.value.name,
    address: storeInfo.value.address
  })
}

const toggleCollect = () => {
  storeInfo.value.isCollected = !storeInfo.value.isCollected
  uni.vibrateShort({ type: 'medium' })
  uni.showToast({
    title: storeInfo.value.isCollected ? '收藏成功' : '取消收藏',
    icon: 'none'
  })
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.store-detail-page {
  width: 100%;
  min-height: 100vh;
  background: $color-bg-primary;
}

.page-content {
  padding-top: $nav-bar-height;
  padding-bottom: $spacing-page-horizontal;
}

.store-swiper {
  width: 100%;
  height: 500rpx;

  .swiper-image {
    width: 100%;
    height: 100%;
  }
}

.store-info-card {
  margin: $spacing-component $spacing-page-horizontal;
  padding: $spacing-component;
  background: $color-bg-white;
  border-radius: $border-radius-base;
  box-shadow: $shadow-light;

  .store-header {
    display: flex;
    align-items: center;
    gap: $spacing-small;
    margin-bottom: $spacing-item;

    .store-name {
      font-size: $font-size-title;
      font-weight: $font-weight-bold;
      color: $color-gray-dark;
      flex: 1;
    }

    .store-type {
      padding: 8rpx 20rpx;
      background: linear-gradient(135deg, $color-primary 0%, #FFD4F0 100%);
      border-radius: $border-radius-small;

      .type-text {
        font-size: $font-size-body;
        color: $color-bg-white;
      }
    }
  }

  .store-rating {
    display: flex;
    align-items: center;
    gap: 8rpx;
    margin-bottom: $spacing-component;

    .star-icon {
      width: 32rpx;
      height: 32rpx;
    }

    .rating-text {
      font-size: $font-size-button;
      font-weight: $font-weight-bold;
      color: $color-primary;
    }

    .review-count {
      font-size: $font-size-body;
      color: $color-gray-lighter;
    }
  }

  .store-meta {
    display: flex;
    flex-direction: column;
    gap: $spacing-item;

    .meta-row {
      display: flex;
      align-items: center;
      gap: $spacing-small;

      .meta-icon {
        width: 32rpx;
        height: 32rpx;
      }

      .meta-text {
        font-size: $font-size-body;
        color: $color-gray-medium;
        flex: 1;
      }
    }
  }
}

.map-card {
  margin: 0 $spacing-page-horizontal $spacing-component;
  background: $color-bg-white;
  border-radius: $border-radius-base;
  overflow: hidden;
  box-shadow: $shadow-light;

  .card-title {
    padding: $spacing-component;
    border-bottom: $border-width solid $border-color;

    .title-text {
      font-size: $font-size-button;
      font-weight: $font-weight-bold;
      color: $color-gray-dark;
    }
  }

  .store-map {
    width: 100%;
    height: 400rpx;
  }
}

.action-buttons {
  display: flex;
  gap: $spacing-component;
  padding: 0 $spacing-page-horizontal;
  margin-bottom: $spacing-component;

  .action-btn {
    flex: 1;
    height: 88rpx;
    background: linear-gradient(135deg, $color-primary 0%, #FFD4F0 100%);
    border-radius: $border-radius-base;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8rpx;
    box-shadow: $shadow-pink;
    transition: transform $transition-base ease;

    &:active {
      transform: scale($scale-press);
    }

    &.collect-btn.collected {
      background: $color-bg-white;
      border: $border-width solid $color-primary;

      .btn-text {
        color: $color-primary;
      }
    }

    .btn-icon {
      width: 32rpx;
      height: 32rpx;
    }

    .btn-text {
      font-size: $font-size-body;
      color: $color-bg-white;
    }
  }
}

.review-card {
  margin: 0 $spacing-page-horizontal;
  padding: $spacing-component;
  background: $color-bg-white;
  border-radius: $border-radius-base;
  box-shadow: $shadow-light;

  .card-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: $spacing-component;

    .title-text {
      font-size: $font-size-button;
      font-weight: $font-weight-bold;
      color: $color-gray-dark;
    }

    .more-text {
      font-size: $font-size-body;
      color: $color-primary;
    }
  }

  .review-list {
    display: flex;
    flex-direction: column;
    gap: $spacing-component;

    .review-item {
      padding-bottom: $spacing-component;
      border-bottom: $border-width solid $border-color;

      &:last-child {
        border-bottom: none;
        padding-bottom: 0;
      }

      .review-header {
        display: flex;
        align-items: center;
        gap: $spacing-small;
        margin-bottom: $spacing-item;

        .user-avatar {
          width: 64rpx;
          height: 64rpx;
          border-radius: $border-radius-circle;
        }

        .user-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 8rpx;

          .user-name {
            font-size: $font-size-body;
            font-weight: $font-weight-bold;
            color: $color-gray-dark;
          }

          .review-rating {
            display: flex;
            gap: 4rpx;

            .star-small {
              width: 24rpx;
              height: 24rpx;
            }
          }
        }

        .review-time {
          font-size: $font-size-helper;
          color: $color-gray-lighter;
        }
      }

      .review-content {
        font-size: $font-size-body;
        color: $color-gray-medium;
        line-height: 1.6;
      }
    }
  }
}

.share-icon {
  width: $icon-size-medium;
  height: $icon-size-medium;
}
</style>
