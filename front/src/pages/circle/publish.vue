<script setup>
import { ref } from 'vue'
import CustomNavbar from '@/components/CustomNavbar.vue'

const content = ref('')
const images = ref([])
const location = ref('')
const visibility = ref('所有人可见')

const goBack = () => {
  uni.navigateBack()
}

const chooseImage = () => {
  const maxCount = 9 - images.value.length
  if (maxCount <= 0) {
    uni.showToast({ title: '最多上传9张图片', icon: 'none' })
    return
  }

  uni.chooseImage({
    count: maxCount,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      images.value = [...images.value, ...res.tempFilePaths]
    }
  })
}

const deleteImage = (index) => {
  images.value.splice(index, 1)
}

const chooseLocation = () => {
  uni.chooseLocation({
    success: (res) => {
      location.value = res.name || res.address
    }
  })
}

const chooseVisibility = () => {
  uni.showActionSheet({
    itemList: ['所有人可见', '仅好友可见', '仅自己可见'],
    success: (res) => {
      const options = ['所有人可见', '仅好友可见', '仅自己可见']
      visibility.value = options[res.tapIndex]
    }
  })
}

const publish = () => {
  if (!content.value.trim() && images.value.length === 0) {
    uni.showToast({ title: '请输入内容或添加图片', icon: 'none' })
    return
  }

  uni.showLoading({ title: '发布中...' })

  setTimeout(() => {
    uni.hideLoading()
    uni.showToast({
      title: '发布成功',
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
  <view class="publish-page">
    <!-- 顶部导航栏 -->
    <CustomNavbar title="发布动态" />

    <scroll-view scroll-y class="page-content">
      <!-- 内容输入区 -->
      <view class="content-section">
        <textarea
          v-model="content"
          class="content-input font-body-lg"
          placeholder="分享你和宠物的快乐时光..."
          maxlength="500"
          :auto-height="true"
        />
        <text class="char-count font-label-caps">{{ content.length }}/500</text>
      </view>

      <!-- 图片上传区 -->
      <view class="media-section">
        <view class="media-grid">
          <view
            v-for="(img, index) in images"
            :key="index"
            class="media-item"
          >
            <image :src="img" class="media-image" mode="aspectFill" />
            <view class="delete-btn bouncy-active" @tap="deleteImage(index)">
              <text class="delete-icon">✕</text>
            </view>
          </view>

          <view
            v-if="images.length < 9"
            class="add-media-btn bouncy-active"
            @tap="chooseImage"
          >
            <text class="add-icon">📷</text>
            <text class="add-text font-label-caps">添加图片</text>
          </view>
        </view>
      </view>

      <!-- 选项区 -->
      <view class="options-section">
        <view class="option-item bouncy-active" @tap="chooseLocation">
          <view class="option-left">
            <text class="option-icon">📍</text>
            <text class="option-text font-body-md">{{ location || '你在哪里？' }}</text>
          </view>
          <text class="arrow-icon">›</text>
        </view>

        <view class="divider"></view>

        <view class="option-item bouncy-active" @tap="chooseVisibility">
          <view class="option-left">
            <text class="option-icon">👁️</text>
            <text class="option-text font-body-md">公开范围</text>
          </view>
          <view class="option-right">
            <text class="option-value font-label-caps">{{ visibility }}</text>
            <text class="arrow-icon">›</text>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 底部发布按钮 -->
    <view class="footer">
      <view class="publish-btn bouncy-active" @tap="publish">
        <text class="publish-icon">📨</text>
        <text class="publish-text font-display-title">确认发布</text>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.publish-page {
  min-height: 100vh;
  background-color: var(--surface);
  padding-bottom: calc(120rpx + env(safe-area-inset-bottom));
}

/* 页面内容 */
.page-content {
  padding: 32rpx;
  padding-top: calc(88rpx + var(--status-bar-height, 40rpx) + 32rpx);
}

.placeholder {
  width: 80rpx;
}

/* 内容输入区 */
.content-section {
  background-color: var(--surface-container-lowest);
  border-radius: 48rpx;
  padding: 32rpx;
  margin-bottom: 32rpx;
  box-shadow: 0 8rpx 32rpx rgba(168, 155, 157, 0.12);
  position: relative;
}

.content-input {
  width: 100%;
  min-height: 200rpx;
  color: var(--on-surface);
  line-height: 1.6;
  border: none;
  background: transparent;

  &::placeholder {
    color: var(--outline-variant);
  }
}

.char-count {
  position: absolute;
  bottom: 24rpx;
  right: 32rpx;
  color: var(--on-surface-variant);
  font-size: 24rpx;
}

/* 图片上传区 */
.media-section {
  margin-bottom: 32rpx;
}

.media-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16rpx;
}

.media-item {
  position: relative;
  width: 100%;
  padding-bottom: 100%;
  border-radius: 24rpx;
  overflow: hidden;
}

.media-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.delete-btn {
  position: absolute;
  top: 8rpx;
  right: 8rpx;
  width: 48rpx;
  height: 48rpx;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
}

.delete-icon {
  color: #ffffff;
  font-size: 28rpx;
}

.add-media-btn {
  width: 100%;
  padding-bottom: 100%;
  position: relative;
  background-color: var(--surface-container);
  border: 4rpx dashed var(--outline-variant);
  border-radius: 24rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.add-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -80%);
  font-size: 64rpx;
}

.add-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, 40%);
  color: var(--on-surface-variant);
  font-size: 22rpx;
  white-space: nowrap;
}

/* 选项区 */
.options-section {
  background-color: var(--surface-container-lowest);
  border-radius: 48rpx;
  padding: 32rpx;
  box-shadow: 0 8rpx 32rpx rgba(168, 155, 157, 0.12);
}

.option-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.option-left {
  display: flex;
  align-items: center;
  gap: 24rpx;
}

.option-icon {
  font-size: 48rpx;
}

.option-text {
  color: var(--on-surface);
}

.option-right {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.option-value {
  color: var(--on-surface-variant);
  font-size: 24rpx;
  opacity: 0.6;
}

.arrow-icon {
  font-size: 48rpx;
  color: var(--on-surface-variant);
  opacity: 0.4;
}

.divider {
  height: 2rpx;
  background-color: var(--outline-variant);
  opacity: 0.3;
  margin: 24rpx 0;
}

/* 底部发布按钮 */
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 32rpx;
  padding-bottom: calc(32rpx + env(safe-area-inset-bottom));
  background: linear-gradient(to top, var(--surface) 80%, transparent);
}

.publish-btn {
  width: 100%;
  height: 112rpx;
  background: linear-gradient(135deg, var(--primary-fixed) 0%, var(--primary-container) 100%);
  border-radius: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
  box-shadow: 0 16rpx 48rpx rgba(168, 155, 157, 0.12);
}

.publish-icon {
  font-size: 40rpx;
}

.publish-text {
  color: var(--on-primary-fixed-variant);
}
</style>
