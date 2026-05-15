<template>
  <view class="fans-page">
    <TopNavBar title="我的粉丝" />

    <view class="page-content">
      <scroll-view
        class="user-list"
        scroll-y
        @scrolltolower="loadMore"
        refresher-enabled
        @refresherrefresh="onRefresh"
      >
        <view
          v-for="user in userList"
          :key="user.id"
          class="user-card"
          @tap="goToUserProfile(user.id)"
        >
          <image class="user-avatar" :src="user.avatar" mode="aspectFill"></image>
          <view class="user-info">
            <text class="user-name">{{ user.nickname }}</text>
            <text class="pet-info">{{ user.petBreed }} · {{ user.petName }}</text>
          </view>
          <view
            class="follow-btn"
            :class="{ 'followed': user.isFollowed }"
            @tap.stop="toggleFollow(user)"
          >
            <text class="btn-text">{{ user.isFollowed ? '已关注' : '关注' }}</text>
          </view>
        </view>

        <Empty v-if="userList.length === 0 && !loading" type="noData" text="暂无粉丝" />
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

const userList = ref([
  {
    id: 1,
    avatar: '/static/images/avatar-default.png',
    nickname: '宠物达人',
    petBreed: '柯基',
    petName: '小短腿',
    isFollowed: true
  },
  {
    id: 2,
    avatar: '/static/images/avatar-default.png',
    nickname: '养狗新手',
    petBreed: '泰迪',
    petName: '小可爱',
    isFollowed: false
  }
])

onMounted(() => {
  loadFansList()
})

const loadFansList = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 1000)
}

const onRefresh = () => {
  loadFansList()
}

const loadMore = () => {
  console.log('Load more')
}

const toggleFollow = (user) => {
  user.isFollowed = !user.isFollowed
  uni.vibrateShort({ type: 'medium' })
  uni.showToast({
    title: user.isFollowed ? '关注成功' : '取消关注',
    icon: 'success'
  })
}

const goToUserProfile = (userId) => {
  console.log('Go to user profile:', userId)
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.fans-page {
  width: 100%;
  min-height: 100vh;
  background: $color-bg-primary;
}

.page-content {
  padding-top: calc(#{$nav-bar-height} + 20rpx);
}

.user-list {
  height: calc(100vh - #{$nav-bar-height} - 40rpx);
  padding: 0 $spacing-page-horizontal;
}

.user-card {
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

  .user-avatar {
    width: $avatar-size-medium;
    height: $avatar-size-medium;
    border-radius: $border-radius-circle;
  }

  .user-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8rpx;

    .user-name {
      font-size: $font-size-button;
      font-weight: $font-weight-bold;
      color: $color-gray-dark;
    }

    .pet-info {
      font-size: $font-size-body;
      color: $color-gray-medium;
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

      .btn-text {
        color: $color-gray-medium;
      }
    }

    &:active {
      transform: scale($scale-press);
    }

    .btn-text {
      font-size: $font-size-body;
      font-weight: $font-weight-bold;
      color: $color-bg-white;
    }
  }
}
</style>
