<template>
  <view class="edit-info-page">
    <TopNavBar title="编辑资料" />

    <view class="page-content">
      <scroll-view class="form-scroll" scroll-y>
        <!-- 头像 -->
        <view class="form-item" @tap="chooseAvatar">
          <text class="item-label">头像</text>
          <view class="item-value">
            <image class="avatar-preview" :src="formData.avatar" mode="aspectFill"></image>
            <image class="arrow-icon" src="/static/images/icon-arrow-right.png" mode="aspectFit"></image>
          </view>
        </view>

        <!-- 昵称 -->
        <view class="form-item">
          <text class="item-label">昵称</text>
          <input
            class="item-input"
            v-model="formData.nickname"
            placeholder="请输入昵称"
            maxlength="8"
          />
        </view>

        <!-- 性别 -->
        <view class="form-item" @tap="showGenderPicker">
          <text class="item-label">性别</text>
          <view class="item-value">
            <text class="value-text">{{ formData.gender || '请选择' }}</text>
            <image class="arrow-icon" src="/static/images/icon-arrow-right.png" mode="aspectFit"></image>
          </view>
        </view>

        <!-- 生日 -->
        <view class="form-item" @tap="showDatePicker">
          <text class="item-label">生日</text>
          <view class="item-value">
            <text class="value-text">{{ formData.birthday || '请选择' }}</text>
            <image class="arrow-icon" src="/static/images/icon-arrow-right.png" mode="aspectFit"></image>
          </view>
        </view>

        <!-- 地区 -->
        <view class="form-item" @tap="showRegionPicker">
          <text class="item-label">地区</text>
          <view class="item-value">
            <text class="value-text">{{ formData.region || '请选择' }}</text>
            <image class="arrow-icon" src="/static/images/icon-arrow-right.png" mode="aspectFit"></image>
          </view>
        </view>

        <!-- 简介 -->
        <view class="form-item textarea-item">
          <text class="item-label">简介</text>
          <textarea
            class="item-textarea"
            v-model="formData.bio"
            placeholder="介绍一下自己吧"
            maxlength="50"
          ></textarea>
          <text class="char-count">{{ formData.bio.length }}/50</text>
        </view>
      </scroll-view>

      <!-- 保存按钮 -->
      <view class="save-btn" @tap="handleSave">
        <text class="btn-text">保存</text>
      </view>
    </view>

    <Loading :visible="loading" />
  </view>
</template>

<script setup>
import { ref } from 'vue'
import TopNavBar from '@/components/common/TopNavBar.vue'
import Loading from '@/components/common/Loading.vue'

const loading = ref(false)

const formData = ref({
  avatar: '/static/images/avatar-default.png',
  nickname: '我的昵称',
  gender: '男',
  birthday: '1990-01-01',
  region: '北京市 朝阳区',
  bio: '这是一段个人简介'
})

const chooseAvatar = () => {
  uni.vibrateShort({ type: 'light' })
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      formData.value.avatar = res.tempFilePaths[0]
    }
  })
}

const showGenderPicker = () => {
  uni.vibrateShort({ type: 'light' })
  uni.showActionSheet({
    itemList: ['男', '女', '保密'],
    success: (res) => {
      const genders = ['男', '女', '保密']
      formData.value.gender = genders[res.tapIndex]
    }
  })
}

const showDatePicker = () => {
  uni.vibrateShort({ type: 'light' })
  // 实际项目中应使用日期选择器组件
  uni.showToast({
    title: '日期选择功能开发中',
    icon: 'none'
  })
}

const showRegionPicker = () => {
  uni.vibrateShort({ type: 'light' })
  // 实际项目中应使用地区选择器组件
  uni.showToast({
    title: '地区选择功能开发中',
    icon: 'none'
  })
}

const handleSave = () => {
  if (!formData.value.nickname.trim()) {
    uni.showToast({
      title: '请输入昵称',
      icon: 'none'
    })
    return
  }

  uni.vibrateShort({ type: 'medium' })
  loading.value = true

  setTimeout(() => {
    loading.value = false
    uni.showToast({
      title: '保存成功',
      icon: 'success'
    })
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  }, 1500)
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.edit-info-page {
  width: 100%;
  min-height: 100vh;
  background: $color-bg-primary;
}

.page-content {
  padding-top: $nav-bar-height;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.form-scroll {
  flex: 1;
  box-sizing: border-box;
  padding: $spacing-page-horizontal;
}

.form-item {
  background: $color-bg-white;
  border-radius: $border-radius-base;
  padding: $spacing-component;
  margin-bottom: $spacing-component;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: $shadow-light;

  &.textarea-item {
    flex-direction: column;
    align-items: stretch;
  }

  .item-label {
    font-size: $font-size-button;
    color: $color-gray-dark;
    font-weight: $font-weight-bold;
    min-width: 120rpx;
  }

  .item-input {
    flex: 1;
    font-size: $font-size-body;
    color: $color-gray-dark;
    text-align: right;
  }

  .item-value {
    display: flex;
    align-items: center;
    gap: $spacing-small;

    .avatar-preview {
      width: $avatar-size-medium;
      height: $avatar-size-medium;
      border-radius: $border-radius-circle;
    }

    .value-text {
      font-size: $font-size-body;
      color: $color-gray-medium;
    }

    .arrow-icon {
      width: 32rpx;
      height: 32rpx;
    }
  }

  .item-textarea {
    width: 100%;
    min-height: 200rpx;
    margin-top: $spacing-item;
    padding: $spacing-component;
    background: $color-bg-primary;
    border-radius: $border-radius-base;
    font-size: $font-size-body;
    color: $color-gray-dark;
    line-height: 1.6;
  }

  .char-count {
    text-align: right;
    margin-top: $spacing-small;
    font-size: $font-size-helper;
    color: $color-gray-lighter;
  }
}

.save-btn {
  margin: $spacing-page-horizontal;
  height: $button-height-large;
  background: linear-gradient(135deg, $color-primary 0%, #FFD4F0 100%);
  border-radius: $border-radius-base;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: $shadow-pink;
  transition: transform $transition-base ease;

  &:active {
    transform: scale($scale-press);
  }

  .btn-text {
    font-size: $font-size-button;
    font-weight: $font-weight-bold;
    color: $color-bg-white;
  }
}
</style>
