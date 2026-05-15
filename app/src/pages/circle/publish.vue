<template>
  <view class="publish-page">
    <TopNavBar title="发布动态">
      <template #right>
        <view class="publish-btn" @tap="handlePublish">
          <text class="btn-text">发布</text>
        </view>
      </template>
    </TopNavBar>

    <view class="page-content">
      <!-- 文字输入 -->
      <textarea
        class="content-input"
        v-model="formData.content"
        placeholder="分享你和宠物的快乐时光..."
        maxlength="500"
        :auto-height="true"
      ></textarea>
      <view class="char-count">
        <text class="count-text">{{ formData.content.length }}/500</text>
      </view>

      <!-- 图片上传 -->
      <view class="image-section">
        <view class="section-title">
          <text class="title-text">添加图片</text>
          <text class="subtitle-text">最多9张</text>
        </view>
        <view class="image-grid">
          <view
            v-for="(image, index) in formData.images"
            :key="index"
            class="image-item"
          >
            <image class="preview-image" :src="image" mode="aspectFill"></image>
            <view class="delete-btn" @tap="deleteImage(index)">
              <image class="delete-icon" src="/static/images/icon-close.png" mode="aspectFit"></image>
            </view>
          </view>
          <view
            v-if="formData.images.length < 9"
            class="add-image-btn"
            @tap="chooseImage"
          >
            <image class="add-icon" src="/static/images/icon-add-gray.png" mode="aspectFit"></image>
          </view>
        </view>
      </view>

      <!-- 话题选择 -->
      <view class="option-section" @tap="showTopicPicker">
        <view class="option-label">
          <image class="option-icon" src="/static/images/icon-topic.png" mode="aspectFit"></image>
          <text class="option-text">添加话题</text>
        </view>
        <view class="option-value">
          <text class="value-text">{{ formData.topic || '选择话题' }}</text>
          <image class="arrow-icon" src="/static/images/icon-arrow-right.png" mode="aspectFit"></image>
        </view>
      </view>

      <!-- 位置选择 -->
      <view class="option-section" @tap="showLocationPicker">
        <view class="option-label">
          <image class="option-icon" src="/static/images/icon-location-small.png" mode="aspectFit"></image>
          <text class="option-text">添加位置</text>
        </view>
        <view class="option-value">
          <text class="value-text">{{ formData.location || '选择位置' }}</text>
          <image class="arrow-icon" src="/static/images/icon-arrow-right.png" mode="aspectFit"></image>
        </view>
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
  content: '',
  images: [],
  topic: '',
  location: ''
})

const chooseImage = () => {
  uni.vibrateShort({ type: 'light' })
  uni.chooseImage({
    count: 9 - formData.value.images.length,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      formData.value.images.push(...res.tempFilePaths)
    }
  })
}

const deleteImage = (index) => {
  uni.vibrateShort({ type: 'light' })
  formData.value.images.splice(index, 1)
}

const showTopicPicker = () => {
  uni.vibrateShort({ type: 'light' })
  uni.showActionSheet({
    itemList: ['日常分享', '遛狗日记', '萌宠美食', '训练技巧', '求助问答'],
    success: (res) => {
      const topics = ['日常分享', '遛狗日记', '萌宠美食', '训练技巧', '求助问答']
      formData.value.topic = topics[res.tapIndex]
    }
  })
}

const showLocationPicker = () => {
  uni.vibrateShort({ type: 'light' })
  uni.chooseLocation({
    success: (res) => {
      formData.value.location = res.name
    }
  })
}

const handlePublish = () => {
  if (!formData.value.content.trim()) {
    uni.showToast({
      title: '请输入内容',
      icon: 'none'
    })
    return
  }

  uni.vibrateShort({ type: 'medium' })
  loading.value = true

  setTimeout(() => {
    loading.value = false
    uni.showToast({
      title: '发布成功',
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

.publish-page {
  width: 100%;
  min-height: 100vh;
  background: $color-bg-primary;
}

.page-content {
  padding-top: calc(#{$nav-bar-height} + 20rpx);
  padding: calc(#{$nav-bar-height} + 20rpx) $spacing-page-horizontal $spacing-page-horizontal;
}

.publish-btn {
  padding: 8rpx 24rpx;
  background: linear-gradient(135deg, $color-primary 0%, #FFD4F0 100%);
  border-radius: $border-radius-base;
  transition: transform $transition-base ease;

  &:active {
    transform: scale($scale-press);
  }

  .btn-text {
    font-size: $font-size-body;
    font-weight: $font-weight-bold;
    color: $color-bg-white;
  }
}

.content-input {
  width: 100%;
  min-height: 300rpx;
  padding: $spacing-component;
  background: $color-bg-white;
  border-radius: $border-radius-base;
  font-size: $font-size-body;
  color: $color-gray-dark;
  line-height: 1.6;
  box-shadow: $shadow-light;
}

.char-count {
  text-align: right;
  padding: $spacing-small 0;

  .count-text {
    font-size: $font-size-helper;
    color: $color-gray-lighter;
  }
}

.image-section {
  margin-top: $spacing-component;

  .section-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: $spacing-item;

    .title-text {
      font-size: $font-size-button;
      font-weight: $font-weight-bold;
      color: $color-gray-dark;
    }

    .subtitle-text {
      font-size: $font-size-helper;
      color: $color-gray-lighter;
    }
  }

  .image-grid {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-small;

    .image-item {
      width: calc((100% - #{$spacing-small} * 2) / 3);
      height: 200rpx;
      position: relative;

      .preview-image {
        width: 100%;
        height: 100%;
        border-radius: $border-radius-base;
      }

      .delete-btn {
        position: absolute;
        top: -12rpx;
        right: -12rpx;
        width: 48rpx;
        height: 48rpx;
        background: rgba(0, 0, 0, 0.6);
        border-radius: $border-radius-circle;
        display: flex;
        align-items: center;
        justify-content: center;

        .delete-icon {
          width: 24rpx;
          height: 24rpx;
        }
      }
    }

    .add-image-btn {
      width: calc((100% - #{$spacing-small} * 2) / 3);
      height: 200rpx;
      background: $color-bg-white;
      border: 2rpx dashed $border-color;
      border-radius: $border-radius-base;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform $transition-base ease;

      &:active {
        transform: scale($scale-press);
      }

      .add-icon {
        width: 64rpx;
        height: 64rpx;
        opacity: 0.4;
      }
    }
  }
}

.option-section {
  margin-top: $spacing-component;
  padding: $spacing-component;
  background: $color-bg-white;
  border-radius: $border-radius-base;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: $shadow-light;
  transition: transform $transition-base ease;

  &:active {
    transform: scale($scale-press);
  }

  .option-label {
    display: flex;
    align-items: center;
    gap: $spacing-small;

    .option-icon {
      width: 32rpx;
      height: 32rpx;
    }

    .option-text {
      font-size: $font-size-button;
      color: $color-gray-dark;
    }
  }

  .option-value {
    display: flex;
    align-items: center;
    gap: $spacing-small;

    .value-text {
      font-size: $font-size-body;
      color: $color-gray-lighter;
    }

    .arrow-icon {
      width: 24rpx;
      height: 24rpx;
    }
  }
}
</style>
