<template>
  <view class="detail-page">
    <TopNavBar title="动态详情">
      <template #right>
        <image
          class="more-icon"
          src="/static/images/icon-more.png"
          mode="aspectFit"
          @tap="showMoreActions"
        ></image>
      </template>
    </TopNavBar>

    <view class="page-content">
      <scroll-view class="content-scroll" scroll-y>
        <!-- 动态内容 -->
        <view class="post-card">
          <view class="post-header">
            <image class="user-avatar" :src="postDetail.avatar" mode="aspectFill"></image>
            <view class="user-info">
              <text class="user-name">{{ postDetail.nickname }}</text>
              <text class="post-time">{{ postDetail.time }}</text>
            </view>
          </view>

          <text class="post-content">{{ postDetail.content }}</text>

          <view v-if="postDetail.images && postDetail.images.length > 0" class="post-images">
            <image
              v-for="(img, index) in postDetail.images"
              :key="index"
              class="post-image"
              :class="{ 'single': postDetail.images.length === 1 }"
              :src="img"
              mode="aspectFill"
              @tap="previewImage(index)"
            ></image>
          </view>

          <view class="post-footer">
            <view class="action-item" @tap="toggleLike">
              <image
                class="action-icon"
                :src="postDetail.isLiked ? '/static/images/icon-like-filled.png' : '/static/images/icon-like.png'"
                mode="aspectFit"
              ></image>
              <text class="action-text">{{ postDetail.likeCount }}</text>
            </view>
            <view class="action-item">
              <image class="action-icon" src="/static/images/icon-comment.png" mode="aspectFit"></image>
              <text class="action-text">{{ postDetail.commentCount }}</text>
            </view>
            <view class="action-item" @tap="toggleCollect">
              <image
                class="action-icon"
                :src="postDetail.isCollected ? '/static/images/icon-star-filled.png' : '/static/images/icon-star-gray.png'"
                mode="aspectFit"
              ></image>
            </view>
          </view>
        </view>

        <!-- 评论列表 -->
        <view class="comment-section">
          <view class="section-title">
            <text class="title-text">评论 {{ commentList.length }}</text>
          </view>
          <view class="comment-list">
            <view v-for="comment in commentList" :key="comment.id" class="comment-item">
              <image class="comment-avatar" :src="comment.avatar" mode="aspectFill"></image>
              <view class="comment-content">
                <text class="comment-name">{{ comment.nickname }}</text>
                <text class="comment-text">{{ comment.content }}</text>
                <view class="comment-footer">
                  <text class="comment-time">{{ comment.time }}</text>
                  <view class="comment-actions">
                    <view class="comment-action" @tap="likeComment(comment)">
                      <image
                        class="action-icon-small"
                        :src="comment.isLiked ? '/static/images/icon-like-filled.png' : '/static/images/icon-like.png'"
                        mode="aspectFit"
                      ></image>
                      <text class="action-count">{{ comment.likeCount }}</text>
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </scroll-view>

      <!-- 评论输入框 -->
      <view class="comment-input-bar">
        <input
          class="comment-input"
          v-model="commentText"
          placeholder="说点什么..."
          confirm-type="send"
          @confirm="sendComment"
        />
        <view class="send-btn" @tap="sendComment">
          <text class="send-text">发送</text>
        </view>
      </view>
    </view>

    <Loading :visible="loading" />
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import TopNavBar from '@/components/common/TopNavBar.vue'
import Loading from '@/components/common/Loading.vue'

const loading = ref(false)
const commentText = ref('')

const postDetail = ref({
  id: 1,
  avatar: '/static/images/avatar-default.png',
  nickname: '铲屎官小王',
  time: '2小时前',
  content: '今天带旺财去公园玩，遇到了好多小伙伴！天气真好，狗狗们玩得特别开心。分享一些今天拍的照片给大家～',
  images: [
    '/static/images/post-default.png',
    '/static/images/post-default.png',
    '/static/images/post-default.png'
  ],
  likeCount: 128,
  commentCount: 32,
  isLiked: false,
  isCollected: false
})

const commentList = ref([
  {
    id: 1,
    avatar: '/static/images/avatar-default.png',
    nickname: '爱狗人士',
    content: '好可爱的狗狗！',
    time: '1小时前',
    likeCount: 5,
    isLiked: false
  },
  {
    id: 2,
    avatar: '/static/images/avatar-default.png',
    nickname: '宠物达人',
    content: '这是在哪个公园啊？我也想带我家狗狗去玩',
    time: '30分钟前',
    likeCount: 2,
    isLiked: true
  }
])

onMounted(() => {
  loadPostDetail()
})

const loadPostDetail = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 1000)
}

const toggleLike = () => {
  postDetail.value.isLiked = !postDetail.value.isLiked
  postDetail.value.likeCount += postDetail.value.isLiked ? 1 : -1
  uni.vibrateShort({ type: 'light' })
}

const toggleCollect = () => {
  postDetail.value.isCollected = !postDetail.value.isCollected
  uni.vibrateShort({ type: 'light' })
  uni.showToast({
    title: postDetail.value.isCollected ? '收藏成功' : '取消收藏',
    icon: 'none'
  })
}

const previewImage = (index) => {
  uni.previewImage({
    urls: postDetail.value.images,
    current: index
  })
}

const likeComment = (comment) => {
  comment.isLiked = !comment.isLiked
  comment.likeCount += comment.isLiked ? 1 : -1
  uni.vibrateShort({ type: 'light' })
}

const sendComment = () => {
  if (!commentText.value.trim()) {
    return
  }

  uni.vibrateShort({ type: 'medium' })

  commentList.value.unshift({
    id: Date.now(),
    avatar: '/static/images/avatar-default.png',
    nickname: '我',
    content: commentText.value,
    time: '刚刚',
    likeCount: 0,
    isLiked: false
  })

  postDetail.value.commentCount++
  commentText.value = ''

  uni.showToast({
    title: '评论成功',
    icon: 'success'
  })
}

const showMoreActions = () => {
  uni.vibrateShort({ type: 'light' })
  uni.showActionSheet({
    itemList: ['分享', '举报'],
    success: (res) => {
      if (res.tapIndex === 0) {
        uni.showToast({
          title: '分享功能开发中',
          icon: 'none'
        })
      } else if (res.tapIndex === 1) {
        uni.showToast({
          title: '举报功能开发中',
          icon: 'none'
        })
      }
    }
  })
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.detail-page {
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

.content-scroll {
  flex: 1;
  padding: $spacing-page-horizontal;
  padding-bottom: 120rpx;
}

.post-card {
  background: $color-bg-white;
  border-radius: $border-radius-base;
  padding: $spacing-component;
  margin-bottom: $spacing-component;
  box-shadow: $shadow-light;

  .post-header {
    display: flex;
    align-items: center;
    gap: $spacing-small;
    margin-bottom: $spacing-item;

    .user-avatar {
      width: $avatar-size-medium;
      height: $avatar-size-medium;
      border-radius: $border-radius-circle;
    }

    .user-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 4rpx;

      .user-name {
        font-size: $font-size-button;
        font-weight: $font-weight-bold;
        color: $color-gray-dark;
      }

      .post-time {
        font-size: $font-size-helper;
        color: $color-gray-lighter;
      }
    }
  }

  .post-content {
    font-size: $font-size-body;
    color: $color-gray-dark;
    line-height: 1.8;
    margin-bottom: $spacing-component;
  }

  .post-images {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-small;
    margin-bottom: $spacing-component;

    .post-image {
      width: calc((100% - #{$spacing-small} * 2) / 3);
      height: 200rpx;
      border-radius: $border-radius-base;

      &.single {
        width: 100%;
        height: 500rpx;
      }
    }
  }

  .post-footer {
    display: flex;
    align-items: center;
    gap: $spacing-component;
    padding-top: $spacing-item;
    border-top: $border-width solid $border-color;

    .action-item {
      display: flex;
      align-items: center;
      gap: 8rpx;

      .action-icon {
        width: 36rpx;
        height: 36rpx;
      }

      .action-text {
        font-size: $font-size-body;
        color: $color-gray-medium;
      }
    }
  }
}

.comment-section {
  background: $color-bg-white;
  border-radius: $border-radius-base;
  padding: $spacing-component;
  box-shadow: $shadow-light;

  .section-title {
    margin-bottom: $spacing-component;

    .title-text {
      font-size: $font-size-button;
      font-weight: $font-weight-bold;
      color: $color-gray-dark;
    }
  }

  .comment-list {
    display: flex;
    flex-direction: column;
    gap: $spacing-component;

    .comment-item {
      display: flex;
      gap: $spacing-small;

      .comment-avatar {
        width: $avatar-size-small;
        height: $avatar-size-small;
        border-radius: $border-radius-circle;
        flex-shrink: 0;
      }

      .comment-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 8rpx;

        .comment-name {
          font-size: $font-size-body;
          font-weight: $font-weight-bold;
          color: $color-gray-dark;
        }

        .comment-text {
          font-size: $font-size-body;
          color: $color-gray-medium;
          line-height: 1.6;
        }

        .comment-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;

          .comment-time {
            font-size: $font-size-helper;
            color: $color-gray-lighter;
          }

          .comment-actions {
            display: flex;
            gap: $spacing-component;

            .comment-action {
              display: flex;
              align-items: center;
              gap: 4rpx;

              .action-icon-small {
                width: 24rpx;
                height: 24rpx;
              }

              .action-count {
                font-size: $font-size-helper;
                color: $color-gray-lighter;
              }
            }
          }
        }
      }
    }
  }
}

.comment-input-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: $spacing-component $spacing-page-horizontal;
  background: $color-bg-white;
  border-top: $border-width solid $border-color;
  display: flex;
  align-items: center;
  gap: $spacing-small;
  box-shadow: 0 -4rpx 16rpx rgba(0, 0, 0, 0.05);

  .comment-input {
    flex: 1;
    height: 72rpx;
    padding: 0 $spacing-component;
    background: $color-bg-primary;
    border-radius: $border-radius-base;
    font-size: $font-size-body;
    color: $color-gray-dark;
  }

  .send-btn {
    padding: 0 32rpx;
    height: 72rpx;
    background: linear-gradient(135deg, $color-primary 0%, #FFD4F0 100%);
    border-radius: $border-radius-base;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform $transition-base ease;

    &:active {
      transform: scale($scale-press);
    }

    .send-text {
      font-size: $font-size-button;
      font-weight: $font-weight-bold;
      color: $color-bg-white;
    }
  }
}

.more-icon {
  width: $icon-size-medium;
  height: $icon-size-medium;
}
</style>
