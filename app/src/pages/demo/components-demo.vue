<template>
  <view class="demo-container">
    <view class="header-safe"></view>
    <TopNavBar title="组件演示" :showBack="true" />

    <scroll-view class="demo-content" scroll-y>
      <view class="demo-section card-section">
        <view class="section-header">
          <view class="section-icon toast-icon"></view>
          <text class="section-title">Toast 提示</text>
          <text class="section-badge">4种类型</text>
        </view>
        <view class="section-desc">轻量级反馈组件，支持多种状态提示</view>
        <view class="demo-buttons">
          <view class="demo-btn success" @click="testSuccessToast">
            <text class="btn-text">成功提示</text>
          </view>
          <view class="demo-btn error" @click="testErrorToast">
            <text class="btn-text">错误提示</text>
          </view>
          <view class="demo-btn warning" @click="testLoadingToast">
            <text class="btn-text">加载提示</text>
          </view>
          <view class="demo-btn info" @click="testInfoToast">
            <text class="btn-text">信息提示</text>
          </view>
        </view>
      </view>

      <view class="demo-section card-section">
        <view class="section-header">
          <view class="section-icon dialog-icon"></view>
          <text class="section-title">Dialog 对话框</text>
          <text class="section-badge">2种模式</text>
        </view>
        <view class="section-desc">用于重要操作确认或信息展示</view>
        <view class="demo-buttons">
          <view class="demo-btn primary" @click="testConfirm">
            <text class="btn-text">确认对话框</text>
          </view>
          <view class="demo-btn outline" @click="testAlert">
            <text class="btn-text">警告对话框</text>
          </view>
        </view>
      </view>

      <view class="demo-section card-section">
        <view class="section-header">
          <view class="section-icon action-icon"></view>
          <text class="section-title">ActionSheet 底部菜单</text>
          <text class="section-badge">灵活配置</text>
        </view>
        <view class="section-desc">底部弹出的操作菜单</view>
        <view class="demo-buttons">
          <view class="demo-btn primary" @click="showActionSheet">
            <text class="btn-text">弹出菜单</text>
          </view>
        </view>
      </view>

      <view class="demo-section card-section">
        <view class="section-header">
          <view class="section-icon picker-icon"></view>
          <text class="section-title">Picker 选择器</text>
          <text class="section-badge">支持多列</text>
        </view>
        <view class="section-desc">单列或多列数据选择</view>
        <view class="demo-buttons">
          <view class="demo-btn primary" @click="showPicker">
            <text class="btn-text">单列选择</text>
          </view>
          <view class="demo-btn primary" @click="showMultiPicker">
            <text class="btn-text">多列选择</text>
          </view>
        </view>
        <view v-if="pickerResult" class="result-display">
          <text class="result-label">选择结果：</text>
          <text class="result-value">{{ pickerResult }}</text>
        </view>
      </view>

      <view class="demo-section card-section">
        <view class="section-header">
          <view class="section-icon date-icon"></view>
          <text class="section-title">DatePicker 日期选择器</text>
          <text class="section-badge">日期范围</text>
        </view>
        <view class="section-desc">日期选择组件</view>
        <view class="demo-buttons">
          <view class="demo-btn primary full-width" @click="showDatePicker">
            <text class="btn-text">选择日期</text>
          </view>
        </view>
        <view v-if="dateResult" class="result-display">
          <text class="result-label">选择日期：</text>
          <text class="result-value">{{ dateResult }}</text>
        </view>
      </view>

      <view class="bottom-spacing"></view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TopNavBar from '@/components/common/TopNavBar.vue'

const pickerResult = ref('')
const dateResult = ref('')

const testSuccessToast = () => {
  uni.showToast({
    title: '操作成功！',
    icon: 'success',
    duration: 2000,
  })
}

const testErrorToast = () => {
  uni.showToast({
    title: '操作失败，请重试',
    icon: 'error',
    duration: 2000,
  })
}

const testLoadingToast = () => {
  uni.showToast({
    title: '正在加载...',
    icon: 'loading',
    duration: 0,
  })
  setTimeout(() => {
    uni.hideToast()
  }, 2000)
}

const testInfoToast = () => {
  uni.showToast({
    title: '这是一条普通信息',
    icon: 'none',
    duration: 2000,
  })
}

const testConfirm = () => {
  uni.showModal({
    title: '确认删除',
    content: '确定要删除这条动态吗？删除后无法恢复',
    confirmText: '删除',
    confirmColor: '#FF6B8A',
    success: (res) => {
      if (res.confirm) {
        uni.showToast({ title: '删除成功', icon: 'success' })
      }
    },
  })
}

const testAlert = () => {
  uni.showModal({
    title: '温馨提示',
    content: '您的会员即将到期，请及时续费',
    showCancel: false,
    confirmText: '我知道了',
  })
}

const showActionSheet = () => {
  uni.showActionSheet({
    itemList: ['编辑', '删除', '分享'],
    success: (res) => {
      uni.showToast({ title: `选择了第 ${res.tapIndex + 1} 项`, icon: 'none' })
    },
  })
}

const showPicker = () => {
  uni.showActionSheet({
    itemList: ['猫咪', '狗狗', '兔子', '仓鼠', '鹦鹉'],
    success: (res) => {
      const items = ['猫咪', '狗狗', '兔子', '仓鼠', '鹦鹉']
      pickerResult.value = items[res.tapIndex]
      uni.showToast({ title: `选择了: ${items[res.tapIndex]}`, icon: 'none' })
    },
  })
}

const showMultiPicker = () => {
  uni.showToast({ title: '多列选择演示', icon: 'none' })
}

const showDatePicker = () => {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  dateResult.value = `${year}-${month}-${day}`
  uni.showToast({ title: `选择日期: ${dateResult.value}`, icon: 'none' })
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.demo-container {
  min-height: 100vh;
  background: $color-bg-primary;
}

.demo-content {
  padding: 24rpx;
  padding-bottom: 160rpx;
  height: calc(100vh - 88rpx);
}

.demo-section {
  margin-bottom: 32rpx;
}

.card-section {
  background: $color-bg-white;
  border-radius: $border-radius-large;
  padding: 32rpx;
  box-shadow: 0 8rpx 32rpx rgba(168, 155, 157, 0.08);
  border: 2rpx solid rgba(113, 88, 92, 0.05);
}

.section-header {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 16rpx;
}

.section-icon {
  width: 48rpx;
  height: 48rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toast-icon {
  background: linear-gradient(135deg, #7ED6A5 0%, #A8E6CF 100%);
}

.dialog-icon {
  background: linear-gradient(135deg, #FFB347 0%, #FFD93D 100%);
}

.action-icon {
  background: linear-gradient(135deg, #9CB6E0 0%, #C9D8FF 100%);
}

.picker-icon {
  background: linear-gradient(135deg, #FFC1E9 0%, #FFD4F0 100%);
}

.date-icon {
  background: linear-gradient(135deg, #FFB6C1 0%, #FFC0CB 100%);
}

.input-icon {
  background: linear-gradient(135deg, #DAEAD8 0%, #E8F5E9 100%);
}

.section-title {
  font-size: 32rpx;
  font-weight: $font-weight-bold;
  color: $color-gray-dark;
}

.section-badge {
  margin-left: auto;
  padding: 6rpx 16rpx;
  background: rgba(113, 88, 92, 0.1);
  border-radius: 20rpx;
  font-size: 22rpx;
  color: $color-gray-medium;
}

.section-desc {
  font-size: 26rpx;
  color: $color-gray-medium;
  margin-bottom: 24rpx;
}

.demo-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}

.demo-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 180rpx;
  padding: 24rpx 32rpx;
  border-radius: $border-radius-medium;
  font-size: $font-size-body;
  font-weight: $font-weight-bold;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:active {
    transform: scale(0.96);
    opacity: 0.85;
  }

  &.full-width {
    width: 100%;
  }

  &.primary {
    background: linear-gradient(135deg, $color-primary 0%, #FFD4F0 100%);
    box-shadow: 0 8rpx 24rpx rgba(113, 88, 92, 0.15);

    .btn-text {
      color: $color-bg-white;
    }
  }

  &.success {
    background: linear-gradient(135deg, #7ED6A5 0%, #A8E6CF 100%);
    box-shadow: 0 8rpx 24rpx rgba(126, 214, 165, 0.3);

    .btn-text {
      color: #FFFFFF;
    }
  }

  &.error {
    background: linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%);
    box-shadow: 0 8rpx 24rpx rgba(255, 107, 107, 0.3);

    .btn-text {
      color: #FFFFFF;
    }
  }

  &.warning {
    background: linear-gradient(135deg, #FFB347 0%, #FFD93D 100%);
    box-shadow: 0 8rpx 24rpx rgba(255, 179, 71, 0.3);

    .btn-text {
      color: #FFFFFF;
    }
  }

  &.info {
    background: linear-gradient(135deg, #9CB6E0 0%, #C9D8FF 100%);
    box-shadow: 0 8rpx 24rpx rgba(156, 182, 224, 0.3);

    .btn-text {
      color: #FFFFFF;
    }
  }

  &.outline {
    background: transparent;
    border: 2rpx solid $color-primary;

    .btn-text {
      color: $color-primary;
    }

    &:active {
      background: rgba(113, 88, 92, 0.05);
    }
  }
}

.btn-text {
  font-size: $font-size-body;
  font-weight: 600;
}

.result-display {
  display: flex;
  align-items: center;
  margin-top: 20rpx;
  padding: 20rpx;
  background: rgba(252, 218, 223, 0.3);
  border-radius: $border-radius-medium;
}

.result-label {
  font-size: $font-size-body;
  color: $color-gray-medium;
}

.result-value {
  font-size: $font-size-body;
  font-weight: $font-weight-bold;
  color: $color-primary;
  margin-left: 8rpx;
}

.bottom-spacing {
  height: 48rpx;
}

.header-safe {
  height: constant(safe-area-inset-top);
  height: env(safe-area-inset-top);
}
</style>