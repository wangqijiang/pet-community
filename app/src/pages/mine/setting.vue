<template>
  <view class="setting-page">
    <TopNavBar title="设置" />

    <view class="page-content">
      <scroll-view class="setting-scroll" scroll-y>
        <!-- 账号安全 -->
        <view class="setting-section">
          <text class="section-title">账号安全</text>
          <view class="menu-list">
            <view class="menu-item" @tap="goToChangePassword">
              <text class="menu-text">修改密码</text>
              <image class="arrow-icon" src="/static/images/icon-arrow-right.png" mode="aspectFit"></image>
            </view>
            <view class="menu-item" @tap="goToBindPhone">
              <text class="menu-text">绑定手机</text>
              <view class="menu-value">
                <text class="value-text">138****8888</text>
                <image class="arrow-icon" src="/static/images/icon-arrow-right.png" mode="aspectFit"></image>
              </view>
            </view>
          </view>
        </view>

        <!-- 隐私设置 -->
        <view class="setting-section">
          <text class="section-title">隐私设置</text>
          <view class="menu-list">
            <view class="menu-item" @tap="showPrivacyOptions('dynamic')">
              <text class="menu-text">谁可以看我的动态</text>
              <view class="menu-value">
                <text class="value-text">所有人</text>
                <image class="arrow-icon" src="/static/images/icon-arrow-right.png" mode="aspectFit"></image>
              </view>
            </view>
            <view class="menu-item" @tap="showPrivacyOptions('message')">
              <text class="menu-text">谁可以给我发私信</text>
              <view class="menu-value">
                <text class="value-text">所有人</text>
                <image class="arrow-icon" src="/static/images/icon-arrow-right.png" mode="aspectFit"></image>
              </view>
            </view>
          </view>
        </view>

        <!-- 通知设置 -->
        <view class="setting-section">
          <text class="section-title">通知设置</text>
          <view class="menu-list">
            <view class="menu-item">
              <text class="menu-text">系统通知</text>
              <switch :checked="notificationSettings.system" @change="toggleNotification('system')" color="#FFC1E9" />
            </view>
            <view class="menu-item">
              <text class="menu-text">私信通知</text>
              <switch :checked="notificationSettings.message" @change="toggleNotification('message')" color="#FFC1E9" />
            </view>
            <view class="menu-item">
              <text class="menu-text">点赞通知</text>
              <switch :checked="notificationSettings.like" @change="toggleNotification('like')" color="#FFC1E9" />
            </view>
            <view class="menu-item">
              <text class="menu-text">评论通知</text>
              <switch :checked="notificationSettings.comment" @change="toggleNotification('comment')" color="#FFC1E9" />
            </view>
          </view>
        </view>

        <!-- 其他 -->
        <view class="setting-section">
          <text class="section-title">其他</text>
          <view class="menu-list">
            <view class="menu-item" @tap="clearCache">
              <text class="menu-text">清除缓存</text>
              <view class="menu-value">
                <text class="value-text">32.5MB</text>
                <image class="arrow-icon" src="/static/images/icon-arrow-right.png" mode="aspectFit"></image>
              </view>
            </view>
            <view class="menu-item" @tap="goToAbout">
              <text class="menu-text">关于我们</text>
              <image class="arrow-icon" src="/static/images/icon-arrow-right.png" mode="aspectFit"></image>
            </view>
            <view class="menu-item" @tap="goToAgreement">
              <text class="menu-text">用户协议</text>
              <image class="arrow-icon" src="/static/images/icon-arrow-right.png" mode="aspectFit"></image>
            </view>
            <view class="menu-item" @tap="goToPrivacy">
              <text class="menu-text">隐私政策</text>
              <image class="arrow-icon" src="/static/images/icon-arrow-right.png" mode="aspectFit"></image>
            </view>
          </view>
        </view>

        <!-- 退出登录 -->
        <view class="logout-btn" @tap="handleLogout">
          <text class="btn-text">退出登录</text>
        </view>
      </scroll-view>
    </view>

    <Loading :visible="loading" />
  </view>
</template>

<script setup>
import { ref } from 'vue'
import TopNavBar from '@/components/common/TopNavBar.vue'
import Loading from '@/components/common/Loading.vue'

const loading = ref(false)

const notificationSettings = ref({
  system: true,
  message: true,
  like: true,
  comment: true
})

const goToChangePassword = () => {
  uni.vibrateShort({ type: 'light' })
  uni.showToast({
    title: '功能开发中',
    icon: 'none'
  })
}

const goToBindPhone = () => {
  uni.vibrateShort({ type: 'light' })
  uni.showToast({
    title: '功能开发中',
    icon: 'none'
  })
}

const showPrivacyOptions = (type) => {
  uni.vibrateShort({ type: 'light' })
  uni.showActionSheet({
    itemList: ['所有人', '仅关注的人', '仅自己'],
    success: (res) => {
      const options = ['所有人', '仅关注的人', '仅自己']
      uni.showToast({
        title: `已设置为${options[res.tapIndex]}`,
        icon: 'success'
      })
    }
  })
}

const toggleNotification = (type) => {
  uni.vibrateShort({ type: 'light' })
  notificationSettings.value[type] = !notificationSettings.value[type]
}

const clearCache = () => {
  uni.vibrateShort({ type: 'medium' })
  uni.showModal({
    title: '提示',
    content: '确定要清除缓存吗？',
    success: (res) => {
      if (res.confirm) {
        loading.value = true
        setTimeout(() => {
          loading.value = false
          uni.showToast({
            title: '清除成功',
            icon: 'success'
          })
        }, 1000)
      }
    }
  })
}

const goToAbout = () => {
  uni.vibrateShort({ type: 'light' })
  uni.showToast({
    title: '功能开发中',
    icon: 'none'
  })
}

const goToAgreement = () => {
  uni.vibrateShort({ type: 'light' })
  uni.showToast({
    title: '功能开发中',
    icon: 'none'
  })
}

const goToPrivacy = () => {
  uni.vibrateShort({ type: 'light' })
  uni.showToast({
    title: '功能开发中',
    icon: 'none'
  })
}

const handleLogout = () => {
  uni.vibrateShort({ type: 'medium' })
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        uni.showToast({
          title: '已退出登录',
          icon: 'success'
        })
        setTimeout(() => {
          uni.reLaunch({
            url: '/pages/index/index'
          })
        }, 1500)
      }
    }
  })
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.setting-page {
  width: 100%;
  min-height: 100vh;
  background: $color-bg-primary;
}

.page-content {
  padding-top: $nav-bar-height;
}

.setting-scroll {
  height: calc(100vh - #{$nav-bar-height});
  padding: $spacing-page-horizontal;
}

.setting-section {
  margin-bottom: $spacing-component;

  .section-title {
    font-size: $font-size-body;
    color: $color-gray-lighter;
    padding: 0 $spacing-small $spacing-item;
  }

  .menu-list {
    background: $color-bg-white;
    border-radius: $border-radius-base;
    overflow: hidden;
    box-shadow: $shadow-light;

    .menu-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: $spacing-component;
      border-bottom: $border-width solid $border-color;
      transition: background $transition-base ease;

      &:last-child {
        border-bottom: none;
      }

      &:active {
        background: $color-bg-primary;
      }

      .menu-text {
        font-size: $font-size-button;
        color: $color-gray-dark;
      }

      .menu-value {
        display: flex;
        align-items: center;
        gap: $spacing-small;

        .value-text {
          font-size: $font-size-body;
          color: $color-gray-lighter;
        }

        .arrow-icon {
          width: 32rpx;
          height: 32rpx;
        }
      }

      .arrow-icon {
        width: 32rpx;
        height: 32rpx;
      }
    }
  }
}

.logout-btn {
  margin-top: $spacing-component;
  height: $button-height-large;
  background: $color-bg-white;
  border-radius: $border-radius-base;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: $shadow-light;
  transition: transform $transition-base ease;

  &:active {
    transform: scale($scale-press);
  }

  .btn-text {
    font-size: $font-size-button;
    font-weight: $font-weight-bold;
    color: #FF4D4F;
  }
}
</style>
