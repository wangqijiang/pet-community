<template>
  <view class="friend-list-page">
    <TopNavBar title="同片区热门狗友" />

    <view class="page-content">
      <!-- 筛选栏 -->
      <view class="filter-row">
        <view class="filter-item" @tap="showBreedFilter">
          <text class="filter-text">品种筛选</text>
          <image class="arrow-icon" src="/static/images/icon-arrow-down.png" mode="aspectFit"></image>
        </view>
        <view class="filter-item" @tap="showDistanceFilter">
          <text class="filter-text">距离排序</text>
          <image class="arrow-icon" src="/static/images/icon-arrow-down.png" mode="aspectFit"></image>
        </view>
      </view>

      <!-- 狗友列表 -->
      <scroll-view
        class="friend-list"
        scroll-y
        @scrolltolower="loadMore"
        refresher-enabled
        @refresherrefresh="onRefresh"
      >
        <view
          v-for="friend in friendList"
          :key="friend.id"
          class="friend-card"
          @tap="goToUserProfile(friend.id)"
        >
          <image class="avatar" :src="friend.avatar" mode="aspectFill"></image>
          <view class="friend-info">
            <text class="nickname">{{ friend.nickname }}</text>
            <text class="pet-info">{{ friend.petBreed }} · {{ friend.petName }}</text>
            <text class="distance">距离 {{ friend.distance }}km</text>
          </view>
          <view
            class="follow-btn"
            :class="{ 'followed': friend.isFollowed }"
            @tap.stop="toggleFollow(friend)"
          >
            <text class="btn-text">{{ friend.isFollowed ? '已关注' : '关注' }}</text>
          </view>
        </view>

        <Empty v-if="friendList.length === 0 && !loading" type="noData" text="暂无狗友数据" />
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
const friendList = ref([
  {
    id: 1,
    avatar: '/static/images/avatar-default.png',
    nickname: '铲屎官小王',
    petBreed: '金毛',
    petName: '旺财',
    distance: 0.5,
    isFollowed: false
  }
])

onMounted(() => {
  loadFriendList()
})

const loadFriendList = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 1000)
}

const onRefresh = () => {
  loadFriendList()
}

const loadMore = () => {
  console.log('Load more')
}

const showBreedFilter = () => {
  uni.vibrateShort({ type: 'light' })
}

const showDistanceFilter = () => {
  uni.vibrateShort({ type: 'light' })
}

const toggleFollow = (friend) => {
  friend.isFollowed = !friend.isFollowed
  uni.vibrateShort({ type: 'medium' })
}

const goToUserProfile = (userId) => {
  console.log('Go to user profile:', userId)
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.friend-list-page {
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

.friend-list {
  height: calc(100vh - #{$nav-bar-height} - 140rpx);
  padding: 0 $spacing-page-horizontal;
}

.friend-card {
  background: $color-bg-white;
  border-radius: $border-radius-base;
  padding: $spacing-component;
  margin-bottom: $spacing-component;
  display: flex;
  align-items: center;
  gap: $spacing-component;
  box-shadow: $shadow-light;
  transition: transform $transition-base ease;

  &:active {
    transform: scale($scale-press);
  }

  .avatar {
    width: $avatar-size-medium;
    height: $avatar-size-medium;
    border-radius: $border-radius-circle;
  }

  .friend-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8rpx;

    .nickname {
      font-size: $font-size-button;
      font-weight: $font-weight-bold;
      color: $color-gray-dark;
    }

    .pet-info {
      font-size: $font-size-body;
      color: $color-gray-medium;
    }

    .distance {
      font-size: $font-size-helper;
      color: $color-gray-lighter;
    }
  }

  .follow-btn {
    padding: 12rpx 32rpx;
    background: linear-gradient(135deg, $color-primary 0%, #FFD4F0 100%);
    border-radius: $border-radius-base;
    transition: transform $transition-base ease;

    &.followed {
      background: $color-bg-white;
      border: $border-width solid $border-color;
    }

    .btn-text {
      font-size: $font-size-body;
      font-weight: $font-weight-bold;
      color: $color-bg-white;
    }

    &.followed .btn-text {
      color: $color-gray-medium;
    }
  }
}
</style>
