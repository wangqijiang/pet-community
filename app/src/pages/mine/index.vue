<template>
  <view class="mine-page">
    <TopNavBar title="我的" :showBack="false">
      <template #right>
        <image
          class="setting-icon"
          src="/static/images/icon-setting.png"
          mode="aspectFit"
          @tap="goToSetting"
        ></image>
      </template>
    </TopNavBar>

    <view class="page-content">
      <scroll-view class="content-scroll" scroll-y>
        <view class="profile-card">
          <view class="profile-header">
            <image class="user-avatar" src="/static/images/avatar-default.png" mode="aspectFill"></image>
            <view class="user-info">
              <text class="user-name">我的昵称</text>
              <text class="user-bio">这是一段个人简介</text>
            </view>
            <view class="edit-btn" @tap="goToEditInfo">
              <text class="edit-text">编辑资料</text>
            </view>
          </view>

          <view class="profile-stats">
            <view class="stat-item" @tap="goToFollow">
              <text class="stat-number">128</text>
              <text class="stat-label">关注</text>
            </view>
            <view class="stat-item" @tap="goToFans">
              <text class="stat-number">256</text>
              <text class="stat-label">粉丝</text>
            </view>
            <view class="stat-item" @tap="goToMyDynamic">
              <text class="stat-number">32</text>
              <text class="stat-label">动态</text>
            </view>
          </view>
        </view>

        <view class="pet-card">
          <view class="card-header">
            <text class="card-title">我的宠物</text>
            <view class="add-pet-btn" @tap="goToPetInfo">
              <image class="add-icon" src="/static/images/icon-add-small.png" mode="aspectFit"></image>
              <text class="add-text">添加</text>
            </view>
          </view>
          <view class="pet-list">
            <view class="pet-item" @tap="goToPetInfo">
              <image class="pet-avatar" src="/static/images/avatar-default.png" mode="aspectFill"></image>
              <view class="pet-info">
                <text class="pet-name">旺财</text>
                <text class="pet-detail">金毛 · 3岁</text>
              </view>
            </view>
          </view>
        </view>

        <view class="ai-card" @tap="goToAIAssistant">
          <view class="ai-icon-wrapper">
            <image class="ai-icon" src="/static/images/icon-ai.png" mode="aspectFit"></image>
          </view>
          <view class="ai-info">
            <text class="ai-title">AI养宠助手</text>
            <text class="ai-subtitle">智能问答 · 健康建议 · 训练技巧</text>
          </view>
          <image class="arrow-icon" src="/static/images/icon-arrow-right.png" mode="aspectFit"></image>
        </view>

        <view class="menu-section">
          <view class="menu-item" @tap="goToFollow">
            <image class="menu-icon" src="/static/images/icon-follow.png" mode="aspectFit"></image>
            <text class="menu-text">我的关注</text>
            <image class="arrow-icon" src="/static/images/icon-arrow-right.png" mode="aspectFit"></image>
          </view>
          <view class="menu-item" @tap="goToFans">
            <image class="menu-icon" src="/static/images/icon-fans.png" mode="aspectFit"></image>
            <text class="menu-text">我的粉丝</text>
            <image class="arrow-icon" src="/static/images/icon-arrow-right.png" mode="aspectFit"></image>
          </view>
          <view class="menu-item" @tap="goToMyDynamic">
            <image class="menu-icon" src="/static/images/icon-dynamic.png" mode="aspectFit"></image>
            <text class="menu-text">我的动态</text>
            <image class="arrow-icon" src="/static/images/icon-arrow-right.png" mode="aspectFit"></image>
          </view>
          <view class="menu-item" @tap="goToCollection">
            <image class="menu-icon" src="/static/images/icon-star-gray.png" mode="aspectFit"></image>
            <text class="menu-text">我的收藏</text>
            <image class="arrow-icon" src="/static/images/icon-arrow-right.png" mode="aspectFit"></image>
          </view>
        </view>
      </scroll-view>
    </view>

    <TabBar :current="3" />
    <Loading :visible="loading" />
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import TopNavBar from '@/components/common/TopNavBar.vue'
import TabBar from '@/components/common/TabBar.vue'
import Loading from '@/components/common/Loading.vue'

const loading = ref(false)

onMounted(() => {
  loadUserInfo()
})

const loadUserInfo = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 1000)
}

const goToSetting = () => {
  uni.vibrateShort({ type: 'light' })
  uni.navigateTo({
    url: '/pages/mine/setting'
  })
}

const goToEditInfo = () => {
  uni.vibrateShort({ type: 'light' })
  uni.navigateTo({
    url: '/pages/mine/editInfo'
  })
}

const goToPetInfo = () => {
  uni.vibrateShort({ type: 'light' })
  uni.navigateTo({
    url: '/pages/mine/petInfo'
  })
}

const goToFollow = () => {
  uni.vibrateShort({ type: 'light' })
  uni.navigateTo({
    url: '/pages/mine/follow'
  })
}

const goToFans = () => {
  uni.vibrateShort({ type: 'light' })
  uni.navigateTo({
    url: '/pages/mine/fans'
  })
}

const goToMyDynamic = () => {
  uni.vibrateShort({ type: 'light' })
  uni.navigateTo({
    url: '/pages/mine/myDynamic'
  })
}

const goToCollection = () => {
  uni.vibrateShort({ type: 'light' })
  uni.navigateTo({
    url: '/pages/mine/collection'
  })
}

const goToAIAssistant = () => {
  uni.vibrateShort({ type: 'medium' })
  uni.showToast({
    title: 'AI助手功能开发中',
    icon: 'none'
  })
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.mine-page {
  width: 100%;
  min-height: 100vh;
  background: $color-bg-primary;
}

.page-content {
  padding-top: $nav-bar-height;
  padding-bottom: $tab-bar-height;
}

.content-scroll {
  height: calc(100vh - #{$nav-bar-height} - #{$tab-bar-height});
  padding: $spacing-page-horizontal;
}

.profile-card {
  background: linear-gradient(135deg, $color-primary 0%, #FFD4F0 100%);
  border-radius: $border-radius-base;
  padding: $spacing-component;
  margin-bottom: $spacing-component;
  box-shadow: $shadow-pink;

  .profile-header {
    display: flex;
    align-items: center;
    gap: $spacing-component;
    margin-bottom: $spacing-component;

    .user-avatar {
      width: $avatar-size-large;
      height: $avatar-size-large;
      border-radius: $border-radius-circle;
      border: 4rpx solid $color-bg-white;
    }

    .user-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 8rpx;

      .user-name {
        font-size: $font-size-title;
        font-weight: $font-weight-bold;
        color: $color-bg-white;
      }

      .user-bio {
        font-size: $font-size-body;
        color: rgba(255, 255, 255, 0.9);
      }
    }

    .edit-btn {
      padding: 12rpx 24rpx;
      background: $color-bg-white;
      border-radius: $border-radius-base;
      transition: transform $transition-base ease;

      &:active {
        transform: scale($scale-press);
      }

      .edit-text {
        font-size: $font-size-body;
        color: $color-primary;
        font-weight: $font-weight-bold;
      }
    }
  }

  .profile-stats {
    display: flex;
    justify-content: space-around;
    padding-top: $spacing-component;
    border-top: 2rpx solid rgba(255, 255, 255, 0.3);

    .stat-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8rpx;

      .stat-number {
        font-size: $font-size-title;
        font-weight: $font-weight-bold;
        color: $color-bg-white;
      }

      .stat-label {
        font-size: $font-size-body;
        color: rgba(255, 255, 255, 0.9);
      }
    }
  }
}

.pet-card {
  background: $color-bg-white;
  border-radius: $border-radius-base;
  padding: $spacing-component;
  margin-bottom: $spacing-component;
  box-shadow: $shadow-light;

  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: $spacing-component;

    .card-title {
      font-size: $font-size-button;
      font-weight: $font-weight-bold;
      color: $color-gray-dark;
    }

    .add-pet-btn {
      display: flex;
      align-items: center;
      gap: 4rpx;
      padding: 8rpx 16rpx;
      background: $color-bg-primary;
      border-radius: $border-radius-base;
      transition: transform $transition-base ease;

      &:active {
        transform: scale($scale-press);
      }

      .add-icon {
        width: 24rpx;
        height: 24rpx;
      }

      .add-text {
        font-size: $font-size-body;
        color: $color-primary;
      }
    }
  }

  .pet-list {
    .pet-item {
      display: flex;
      align-items: center;
      gap: $spacing-component;
      padding: $spacing-item;
      background: $color-bg-primary;
      border-radius: $border-radius-base;
      transition: transform $transition-base ease;

      &:active {
        transform: scale($scale-press);
      }

      .pet-avatar {
        width: $avatar-size-medium;
        height: $avatar-size-medium;
        border-radius: $border-radius-circle;
      }

      .pet-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 4rpx;

        .pet-name {
          font-size: $font-size-button;
          font-weight: $font-weight-bold;
          color: $color-gray-dark;
        }

        .pet-detail {
          font-size: $font-size-body;
          color: $color-gray-medium;
        }
      }
    }
  }
}

.ai-card {
  background: linear-gradient(135deg, #667EEA 0%, #764BA2 100%);
  border-radius: $border-radius-base;
  padding: $spacing-component;
  margin-bottom: $spacing-component;
  display: flex;
  align-items: center;
  gap: $spacing-component;
  box-shadow: 0 8rpx 24rpx rgba(102, 126, 234, 0.3);
  transition: transform $transition-base ease;

  &:active {
    transform: scale($scale-press);
  }

  .ai-icon-wrapper {
    width: 96rpx;
    height: 96rpx;
    background: rgba(255, 255, 255, 0.2);
    border-radius: $border-radius-circle;
    display: flex;
    align-items: center;
    justify-content: center;

    .ai-icon {
      width: 56rpx;
      height: 56rpx;
    }
  }

  .ai-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8rpx;

    .ai-title {
      font-size: $font-size-button;
      font-weight: $font-weight-bold;
      color: $color-bg-white;
    }

    .ai-subtitle {
      font-size: $font-size-body;
      color: rgba(255, 255, 255, 0.9);
    }
  }

  .arrow-icon {
    width: 32rpx;
    height: 32rpx;
  }
}

.menu-section {
  background: $color-bg-white;
  border-radius: $border-radius-base;
  overflow: hidden;
  box-shadow: $shadow-light;

  .menu-item {
    display: flex;
    align-items: center;
    gap: $spacing-component;
    padding: $spacing-component;
    border-bottom: $border-width solid $border-color;
    transition: background $transition-base ease;

    &:last-child {
      border-bottom: none;
    }

    &:active {
      background: $color-bg-primary;
    }

    .menu-icon {
      width: 40rpx;
      height: 40rpx;
    }

    .menu-text {
      flex: 1;
      font-size: $font-size-button;
      color: $color-gray-dark;
    }

    .arrow-icon {
      width: 32rpx;
      height: 32rpx;
    }
  }
}

.setting-icon {
  width: $icon-size-medium;
  height: $icon-size-medium;
}
</style>