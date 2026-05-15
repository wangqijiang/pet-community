<template>
  <view class="follow-page">
    <TopNavBar title="我的关注" />

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
          <view class="unfollow-btn" @tap.stop="handleUnfollow(user)">
            <text class="btn-text">已关注</text>
          </view>
        </view>

        <Empty v-if="userList.length === 0 && !loading" type="noData" text="暂无关注" />
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
    nickname: '铲屎官小王',
    petBreed: '金毛',
    petName: '旺财'
  },
  {
    id: 2,
    avatar: '/static/images/avatar-default.png',
    nickname: '爱狗人士',
    petBreed: '哈士奇',
    petName: '二哈'
  }
])

onMounted(() => {
  loadFollowList()
})

const loadFollowList = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 1000)
}

const onRefresh = () => {
  loadFollowList()
}

const loadMore = () => {
  console.log('Load more')
}

const handleUnfollow = (user) => {
  uni.vibrateShort({ type: 'medium' })
  uni.showModal({
    title: '提示',
    content: `确定取消关注 ${user.nickname} 吗？`,
    success: (res) => {
      if (res.confirm) {
        const index = userList.value.findIndex(u => u.id === user.id)
        if (index > -1) {
          userList.value.splice(index, 1)
        }
        uni.showToast({
          title: '已取消关注',
          icon: 'success'
        })
      }
    }
  })
}

const goToUserProfile = (userId) => {
  console.log('Go to user profile:', userId)
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.follow-page {
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

  .unfollow-btn {
    padding: 12rpx 32rpx;
    background: $color-bg-white;
    border: $border-width solid $border-color;
    border-radius: $border-radius-base;
    transition: transform $transition-base ease;

    &:active {
      transform: scale($scale-press);
    }

    .btn-text {
      font-size: $font-size-body;
      color: $color-gray-medium;
    }
  }
}
</style>
