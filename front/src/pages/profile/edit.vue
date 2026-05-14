<script setup>
import { ref } from 'vue'
import CustomNavbar from '@/components/CustomNavbar.vue'

const userInfo = ref({
  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBLI_TiM-8WkRvWXF3zLl5insv5qwVJ4DP31d8Q83fyEoVhUn_p6EhyrL8P0oYHRYOG2C1EPGovSFDuRKtZEElf6Y3ekMCuXhCm6H8p7E-l9_uww9SEPQfSsuoH443tOg2AqsKTHZrtbleJrTmiyS4ihH0gnl-qs0p-HNYLLCj5ot5DckDWouuxn5prB2VnphtZOod7ht2zORDkmjR6121rLQSrVbmjT1rRu_5fuHxsf3EQVXzfFyXg3aya8R59XZAm0hfx9yP53yyg',
  nickname: '小柴汪汪',
  userId: 'Waggle_882934',
  bio: ''
})

const goBack = () => {
  uni.navigateBack()
}

const chooseAvatar = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      userInfo.value.avatar = res.tempFilePaths[0]
      uni.showToast({ title: '头像已更新', icon: 'success' })
    }
  })
}

const copyUserId = () => {
  uni.setClipboardData({
    data: userInfo.value.userId,
    success: () => {
      uni.showToast({ title: '已复制', icon: 'success' })
    }
  })
}

const saveProfile = () => {
  if (!userInfo.value.nickname.trim()) {
    uni.showToast({ title: '请输入昵称', icon: 'none' })
    return
  }

  uni.showLoading({ title: '保存中...' })

  setTimeout(() => {
    uni.hideLoading()
    uni.showToast({
      title: '保存成功',
      icon: 'success',
      success: () => {
        setTimeout(() => {
          uni.navigateBack()
        }, 1500)
      }
    })
  }, 1000)
}
</script>

<template>
  <view class="edit-page">
    <!-- 顶部导航栏 -->
    <CustomNavbar title="个人资料编辑" />

    <scroll-view scroll-y class="page-content">
      <!-- 头像上传区域 -->
      <view class="avatar-section">
        <view class="avatar-wrapper bouncy-active" @tap="chooseAvatar">
          <view class="avatar-container">
            <image :src="userInfo.avatar" class="avatar-image" mode="aspectFill" />
          </view>
          <view class="edit-badge active-sink">
            <text class="edit-icon">✏️</text>
          </view>
        </view>
        <text class="avatar-hint font-label-caps">点击更换头像</text>
      </view>

      <!-- 表单区域 -->
      <view class="form-section">
        <!-- 昵称 -->
        <view class="form-group">
          <text class="form-label font-label-caps">昵称</text>
          <view class="input-wrapper">
            <input
              v-model="userInfo.nickname"
              class="form-input font-body-lg"
              placeholder="输入你的昵称"
              maxlength="20"
            />
            <text class="input-icon">🐾</text>
          </view>
        </view>

        <!-- 用户ID（不可编辑） -->
        <view class="form-group">
          <text class="form-label font-label-caps">用户 ID</text>
          <view class="input-wrapper readonly">
            <text class="readonly-text font-body-lg">{{ userInfo.userId }}</text>
            <view class="copy-btn bouncy-active" @tap="copyUserId">
              <text class="copy-icon">📋</text>
            </view>
          </view>
        </view>

        <!-- 个性签名 -->
        <view class="form-group">
          <text class="form-label font-label-caps">个性签名</text>
          <view class="textarea-wrapper">
            <textarea
              v-model="userInfo.bio"
              class="form-textarea font-body-md"
              placeholder="分享一下你和毛孩子的故事吧..."
              maxlength="100"
              :auto-height="false"
            />
          </view>
        </view>
      </view>

      <!-- 提示卡片 -->
      <view class="tips-card">
        <text class="tips-icon">💡</text>
        <text class="tips-text font-body-md">
          完善个人资料可以让更多的宠友认识你哦！别忘了上传一张最可爱的头像。
        </text>
      </view>
    </scroll-view>

    <!-- 底部保存按钮 -->
    <view class="footer">
      <view class="save-btn bouncy-active" @tap="saveProfile">
        <text class="save-text font-headline-md">保存修改</text>
        <text class="check-icon">✓</text>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.edit-page {
  min-height: 100vh;
  background-color: var(--surface);
  padding-bottom: calc(120rpx + env(safe-area-inset-bottom));
}

/* 页面内容 */
.page-content {
  padding: 48rpx 32rpx;
  padding-top: calc(88rpx + var(--status-bar-height, 40rpx) + 48rpx);
}

.back-btn {
  width: 80rpx;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  background-color: var(--surface-container);

  .icon {
    font-size: 64rpx;
    color: var(--primary);
    font-weight: 300;
  }
}

.header-title {
  color: var(--primary);
  font-size: 40rpx;
}

.placeholder {
  width: 80rpx;
}

/* 头像上传区域 */
.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 80rpx;
}

.avatar-wrapper {
  position: relative;
  margin-bottom: 32rpx;
}

.avatar-container {
  width: 256rpx;
  height: 256rpx;
  border-radius: var(--radius-full);
  padding: 8rpx;
  background: linear-gradient(135deg, var(--primary-container) 0%, var(--secondary-container) 100%);
  box-shadow: 0 16rpx 64rpx rgba(168, 155, 157, 0.12);
}

.avatar-image {
  width: 100%;
  height: 100%;
  border-radius: var(--radius-full);
  border: 8rpx solid var(--surface-container-lowest);
}

.edit-badge {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 80rpx;
  height: 80rpx;
  border-radius: var(--radius-full);
  background-color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 8rpx solid var(--surface);
  box-shadow: 0 8rpx 24rpx rgba(113, 88, 92, 0.2);
}

.edit-icon {
  font-size: 40rpx;
}

.avatar-hint {
  color: var(--on-surface-variant);
}

/* 表单区域 */
.form-section {
  display: flex;
  flex-direction: column;
  gap: 48rpx;
  margin-bottom: 80rpx;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.form-label {
  padding: 0 32rpx;
  color: var(--primary);
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  background-color: var(--surface-container-lowest);
  border-radius: 48rpx;
  padding: 0 48rpx;
  height: 112rpx;
  box-shadow: 0 8rpx 32rpx rgba(168, 155, 157, 0.08);
  transition: all 0.3s ease;

  &:focus-within {
    box-shadow: 0 8rpx 40rpx rgba(113, 88, 92, 0.15);
    background-color: rgba(234, 223, 189, 0.2);
  }

  &.readonly {
    background-color: var(--surface-container-low);
    border: 2rpx solid var(--outline-variant);
    opacity: 0.5;
  }
}

.form-input {
  flex: 1;
  border: none;
  background: transparent;
  color: var(--on-surface);
  font-size: 32rpx;

  &::placeholder {
    color: var(--outline-variant);
  }
}

.input-icon {
  font-size: 40rpx;
  color: var(--primary);
  opacity: 0.4;
}

.readonly-text {
  flex: 1;
  color: var(--on-surface-variant);
}

.copy-btn {
  padding: 16rpx;
  border-radius: var(--radius-full);
  transition: background-color 0.2s ease;

  &:active {
    background-color: var(--primary-container);
  }
}

.copy-icon {
  font-size: 40rpx;
  color: var(--primary);
}

.textarea-wrapper {
  background-color: var(--surface-container-lowest);
  border-radius: 48rpx;
  padding: 40rpx 48rpx;
  box-shadow: 0 8rpx 32rpx rgba(168, 155, 157, 0.08);
  transition: all 0.3s ease;

  &:focus-within {
    box-shadow: 0 8rpx 40rpx rgba(113, 88, 92, 0.15);
  }
}

.form-textarea {
  width: 100%;
  min-height: 160rpx;
  border: none;
  background: transparent;
  color: var(--on-surface);
  font-size: 28rpx;
  line-height: 1.6;

  &::placeholder {
    color: var(--outline-variant);
  }
}

/* 提示卡片 */
.tips-card {
  display: flex;
  gap: 32rpx;
  padding: 48rpx;
  background: linear-gradient(135deg, rgba(218, 234, 216, 0.3) 0%, rgba(218, 234, 216, 0.15) 100%);
  border-radius: 48rpx;
  border: 2rpx solid rgba(218, 234, 216, 0.5);
}

.tips-icon {
  font-size: 48rpx;
  color: var(--tertiary);
}

.tips-text {
  flex: 1;
  color: var(--on-tertiary-fixed-variant);
  line-height: 1.6;
}

/* 底部保存按钮 */
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 32rpx;
  padding-bottom: calc(32rpx + env(safe-area-inset-bottom));
  background: linear-gradient(to top, var(--surface) 80%, transparent);
}

.save-btn {
  width: 100%;
  height: 112rpx;
  background: linear-gradient(135deg, var(--primary) 0%, #5d474b 100%);
  color: var(--on-primary);
  border-radius: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
  box-shadow: 0 16rpx 48rpx rgba(113, 88, 92, 0.2);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);

  &:active {
    transform: scale(0.98);
    box-shadow: 0 8rpx 32rpx rgba(113, 88, 92, 0.15);
  }
}

.save-text {
  color: var(--on-primary);
}

.check-icon {
  font-size: 40rpx;
  font-weight: 700;
}
</style>
