<template>
  <view class="place-list-page">
    <TopNavBar title="附近遛狗好去处" />

    <view class="page-content">
      <!-- 筛选栏 -->
      <view class="filter-row">
        <view class="filter-item" @tap="showTypeFilter">
          <text class="filter-text">类型筛选</text>
          <image class="arrow-icon" src="/static/images/icon-arrow-down.png" mode="aspectFit"></image>
        </view>
        <view class="filter-item" @tap="showDistanceFilter">
          <text class="filter-text">距离排序</text>
          <image class="arrow-icon" src="/static/images/icon-arrow-down.png" mode="aspectFit"></image>
        </view>
      </view>

      <!-- 地点列表 -->
      <scroll-view
        class="place-list"
        scroll-y
        @scrolltolower="loadMore"
        refresher-enabled
        @refresherrefresh="onRefresh"
      >
        <view
          v-for="place in placeList"
          :key="place.id"
          class="place-card"
          @tap="goToStoreDetail(place.id)"
        >
          <image class="place-image" :src="place.image" mode="aspectFill"></image>
          <view class="place-info">
            <view class="place-header">
              <text class="place-name">{{ place.name }}</text>
              <view class="place-type">
                <text class="type-text">{{ place.type }}</text>
              </view>
            </view>
            <view class="place-meta">
              <view class="meta-item">
                <image class="meta-icon" src="/static/images/icon-location-small.png" mode="aspectFit"></image>
                <text class="meta-text">{{ place.distance }}km</text>
              </view>
              <view class="meta-item">
                <image class="meta-icon" src="/static/images/icon-star.png" mode="aspectFit"></image>
                <text class="meta-text">{{ place.rating }}</text>
              </view>
            </view>
            <text class="place-address">{{ place.address }}</text>
          </view>
          <view
            class="collect-btn"
            :class="{ 'collected': place.isCollected }"
            @tap.stop="toggleCollect(place)"
          >
            <image
              class="collect-icon"
              :src="place.isCollected ? '/static/images/icon-heart-filled.png' : '/static/images/icon-heart.png'"
              mode="aspectFit"
            ></image>
          </view>
        </view>

        <Empty v-if="placeList.length === 0 && !loading" type="noData" text="暂无地点数据" />
      </scroll-view>
    </view>

    <Loading :visible="loading" />
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import TopNavBar from '@/components/common/TopNavBar.vue'
import Empty from '@/components/common/Empty.vue'
import Loading from '@/components/common/Loading.vue'

const loading = ref(false)
const placeList = ref([
  {
    id: 1,
    image: '/static/images/place-default.png',
    name: '朝阳公园',
    type: '公园',
    distance: 1.2,
    rating: 4.8,
    address: '朝阳区朝阳公园南路1号',
    isCollected: false
  },
  {
    id: 2,
    image: '/static/images/place-default.png',
    name: '萌宠乐园宠物店',
    type: '宠物店',
    distance: 0.8,
    rating: 4.9,
    address: '朝阳区建国路88号',
    isCollected: true
  }
])

onMounted(() => {
  loadPlaceList()
})

const loadPlaceList = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 1000)
}

const onRefresh = () => {
  loadPlaceList()
}

const loadMore = () => {
  console.log('Load more')
}

const showTypeFilter = () => {
  uni.vibrateShort({ type: 'light' })
}

const showDistanceFilter = () => {
  uni.vibrateShort({ type: 'light' })
}

const toggleCollect = (place) => {
  place.isCollected = !place.isCollected
  uni.vibrateShort({ type: 'medium' })
}

const goToStoreDetail = (placeId) => {
  uni.navigateTo({
    url: `/pages/home/storeDetail?id=${placeId}`
  })
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.place-list-page {
  width: 100%;
  min-height: 100vh;
  background: $color-bg-primary;
}

.page-content {
  padding-top: calc(#{$nav-bar-height} + 20rpx);
}

.filter-row {
  display: flex;
  gap: $spacing-component;
  padding: 0 $spacing-page-horizontal $spacing-component;

  .filter-item {
    flex: 1;
    height: 72rpx;
    background: $color-bg-white;
    border-radius: $border-radius-base;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: $spacing-small;
    box-shadow: $shadow-light;

    .filter-text {
      font-size: $font-size-body;
      color: $color-gray-dark;
    }

    .arrow-icon {
      width: 24rpx;
      height: 24rpx;
    }
  }
}

.place-list {
  height: calc(100vh - #{$nav-bar-height} - 140rpx);
  padding: 0 $spacing-page-horizontal;
}

.place-card {
  background: $color-bg-white;
  border-radius: $border-radius-base;
  padding: $spacing-component;
  margin-bottom: $spacing-component;
  display: flex;
  gap: $spacing-component;
  box-shadow: $shadow-light;
  transition: transform $transition-base ease;
  position: relative;

  &:active {
    transform: scale($scale-press);
  }

  .place-image {
    width: 160rpx;
    height: 160rpx;
    border-radius: $border-radius-base;
    flex-shrink: 0;
  }

  .place-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 12rpx;

    .place-header {
      display: flex;
      align-items: center;
      gap: $spacing-small;

      .place-name {
        font-size: $font-size-button;
        font-weight: $font-weight-bold;
        color: $color-gray-dark;
        flex: 1;
      }

      .place-type {
        padding: 4rpx 16rpx;
        background: linear-gradient(135deg, $color-primary 0%, #FFD4F0 100%);
        border-radius: $border-radius-small;

        .type-text {
          font-size: $font-size-helper;
          color: $color-bg-white;
        }
      }
    }

    .place-meta {
      display: flex;
      gap: $spacing-component;

      .meta-item {
        display: flex;
        align-items: center;
        gap: 8rpx;

        .meta-icon {
          width: 24rpx;
          height: 24rpx;
        }

        .meta-text {
          font-size: $font-size-body;
          color: $color-gray-medium;
        }
      }
    }

    .place-address {
      font-size: $font-size-helper;
      color: $color-gray-lighter;
      line-height: 1.5;
    }
  }

  .collect-btn {
    position: absolute;
    top: $spacing-component;
    right: $spacing-component;
    width: 56rpx;
    height: 56rpx;
    background: $color-bg-white;
    border-radius: $border-radius-circle;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: $shadow-light;

    .collect-icon {
      width: 32rpx;
      height: 32rpx;
    }
  }
}
</style>
