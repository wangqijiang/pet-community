<template>
  <view class="detail-container">
    <TopNavBar :showBack="true" title="动态详情" />

    <scroll-view scroll-y class="detail-content">
      <view class="feed-card">
        <view class="card-header">
          <view class="user-avatar">
            <view
              class="avatar-bg"
              :style="{ background: dynamic.avatarColor }"
            ></view>
          </view>
          <view class="user-info">
            <text class="user-name">{{ dynamic.userName }}</text>
            <view class="user-tags">
              <text class="tag">{{ dynamic.userTag }}</text>
            </view>
          </view>
          <view class="more-btn">
            <view class="more-icon"></view>
          </view>
        </view>

        <text class="card-content">{{ dynamic.content }}</text>

        <view class="card-images" v-if="dynamic.images.length > 0">
          <view
            v-for="(img, imgIndex) in dynamic.images"
            :key="imgIndex"
            class="image-item"
            :style="{ background: img }"
          ></view>
        </view>

        <view class="card-footer">
          <view class="footer-item" @click="handleLike">
            <view class="footer-icon" :class="{ liked: dynamic.liked }">
              <view class="like-icon"></view>
            </view>
            <text class="footer-count">{{ dynamic.likes }}</text>
          </view>
          <view class="footer-item">
            <view class="footer-icon">
              <view class="comment-icon"></view>
            </view>
            <text class="footer-count">{{ dynamic.comments }}</text>
          </view>
        </view>
      </view>

      <view class="comment-section">
        <text class="section-title">评论 ({{ comments.length }})</text>

        <view class="comment-list">
          <view
            v-for="(comment, index) in comments"
            :key="index"
            class="comment-item"
          >
            <view class="comment-avatar">
              <view
                class="avatar-bg"
                :style="{ background: comment.avatarColor }"
              ></view>
            </view>
            <view class="comment-content">
              <view class="comment-header">
                <text class="comment-name">{{ comment.userName }}</text>
                <text class="comment-time">{{ comment.time }}</text>
              </view>
              <text class="comment-text">{{ comment.content }}</text>
              <view class="comment-actions">
                <view class="action-item" @click="handleReply(comment)">
                  <text class="action-text">回复</text>
                </view>
                <view class="action-item" @click="handleCommentLike(comment)">
                  <view
                    class="action-icon"
                    :class="{ liked: comment.liked }"
                  ></view>
                  <text class="action-text">{{ comment.likes }}</text>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>

    <view class="input-bar">
      <input
        v-model="inputText"
        class="input-field"
        placeholder="发表评论..."
        placeholder-class="input-placeholder"
      />
      <view class="send-btn" @click="sendComment">
        <text class="send-text">发送</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import TopNavBar from "@/components/common/TopNavBar.vue";
import { ref } from "vue";

const inputText = ref("");

const dynamic = ref({
  userName: "布丁麻麻",
  avatarColor: "#FFC1E9",
  userTag: "柯基 · 2岁",
  content:
    "今天带布丁去公园草坪打滚啦！阳光超级好，它开心得像个200斤的孩子哈哈。这就是简单的幸福吧～✨",
  images: ["#FFE4E1", "#FFD4F0", "#FFC1E9", "#FFB6C1"],
  likes: 128,
  comments: 32,
  liked: false,
});

const comments = ref([
  {
    userName: "阿花",
    avatarColor: "#FFD4F0",
    time: "5分钟前",
    content: "好可爱呀！布丁好活泼~",
    likes: 5,
    liked: false,
  },
  {
    userName: "旺财",
    avatarColor: "#FFB6C1",
    time: "3分钟前",
    content: "下次一起去呀！",
    likes: 3,
    liked: true,
  },
  {
    userName: "球球",
    avatarColor: "#FFC0CB",
    time: "1分钟前",
    content: "这就是幸福的模样 💕",
    likes: 8,
    liked: false,
  },
]);

const handleLike = () => {
  dynamic.value.liked = !dynamic.value.liked;
  dynamic.value.likes += dynamic.value.liked ? 1 : -1;
};

const handleShare = () => {
  uni.showShareMenu({
    withShareTicket: true,
  });
};

const previewImage = (index: number) => {
  uni.previewImage({
    urls: dynamic.value.images,
    current: index,
  });
};

const handleReply = (comment: any) => {
  uni.showToast({
    title: `回复 ${comment.userName}`,
    icon: "none",
  });
};

const handleCommentLike = (comment: any) => {
  comment.liked = !comment.liked;
  comment.likes += comment.liked ? 1 : -1;
};

const sendComment = () => {
  if (!inputText.value.trim()) {
    uni.showToast({
      title: "请输入评论内容",
      icon: "none",
    });
    return;
  }

  comments.value.push({
    userName: "我",
    avatarColor: "#FFC1E9",
    time: "刚刚",
    content: inputText.value,
    likes: 0,
    liked: false,
  });

  inputText.value = "";
  dynamic.value.comments++;
};
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.detail-container {
  min-height: 100vh;
  background: $color-bg-primary;
  padding-bottom: 120rpx;
}

.detail-content {
  padding: 24rpx 32rpx;
  padding-top: calc(var(--status-bar-height, 44px) + 120rpx);
  height: calc(100vh - var(--status-bar-height, 44px) - 120rpx);
  box-sizing: border-box;
}

.feed-card {
  background: $color-bg-white;
  border-radius: $border-radius-large;
  padding: 32rpx;
  margin-bottom: 32rpx;
  border: 1rpx solid rgba(113, 88, 92, 0.1);
  box-shadow: 0 8rpx 24rpx rgba(168, 155, 157, 0.08);
}

.card-header {
  display: flex;
  align-items: flex-start;
  margin-bottom: 24rpx;
}

.user-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  padding: 4rpx;
  border: 4rpx solid $color-primary-light;
  margin-right: 20rpx;
}

.avatar-bg {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.user-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.user-name {
  font-size: $font-size-body;
  font-weight: $font-weight-bold;
  color: $color-gray-dark;
}

.user-tags {
  display: flex;
  gap: 8rpx;
}

.tag {
  padding: 6rpx 16rpx;
  background: rgba(113, 88, 92, 0.08);
  color: $color-primary;
  font-size: $font-size-helper;
  font-weight: $font-weight-bold;
  border-radius: $border-radius-small;
}

.more-btn {
  padding: 8rpx;
}

.more-icon {
  width: 36rpx;
  height: 36rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23807476'%3E%3Cpath d='M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;
}

.card-content {
  font-size: $font-size-body;
  color: $color-gray-dark;
  line-height: 1.6;
  margin-bottom: 24rpx;
}

.card-images {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16rpx;
  margin-bottom: 24rpx;
}

.image-item {
  aspect-ratio: 1;
  border-radius: $border-radius-medium;
}

.card-footer {
  display: flex;
  gap: 48rpx;
  padding-top: 24rpx;
  border-top: 1rpx solid rgba(113, 88, 92, 0.1);
}

.footer-item {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.footer-icon {
  width: 36rpx;
  height: 36rpx;

  &.liked {
    .like-icon {
      background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2371585C'%3E%3Cpath d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/%3E%3C/svg%3E")
        no-repeat center;
      background-size: 100%;
    }
  }
}

.like-icon {
  width: 100%;
  height: 100%;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23807476'%3E%3Cpath d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;
}

.comment-icon {
  width: 100%;
  height: 100%;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23807476'%3E%3Cpath d='M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2z'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;
}

.footer-count {
  font-size: 22rpx;
  font-weight: 600;
  color: #807476;
}

.comment-section {
  background: $color-bg-white;
  border-radius: $border-radius-large;
  padding: 32rpx;
  border: 1rpx solid rgba(113, 88, 92, 0.1);
  box-shadow: 0 8rpx 24rpx rgba(168, 155, 157, 0.08);
}

.section-title {
  font-size: $font-size-body;
  font-weight: $font-weight-bold;
  color: $color-primary;
  margin-bottom: 24rpx;
  display: block;
}

.comment-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.comment-item {
  display: flex;
  gap: 16rpx;
}

.comment-avatar {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  padding: 3rpx;
  background: $color-primary-light;
}

.comment-content {
  flex: 1;
}

.comment-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8rpx;
}

.comment-name {
  font-size: $font-size-body;
  font-weight: $font-weight-bold;
  color: $color-gray-dark;
}

.comment-time {
  font-size: $font-size-helper;
  color: $color-gray-medium;
}

.comment-text {
  font-size: $font-size-body;
  color: $color-gray-dark;
  line-height: 1.5;
  margin-bottom: 12rpx;
  display: block;
}

.comment-actions {
  display: flex;
  gap: 24rpx;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.action-icon {
  width: 28rpx;
  height: 28rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23807476'%3E%3Cpath d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;

  &.liked {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2371585C'%3E%3Cpath d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/%3E%3C/svg%3E")
      no-repeat center;
    background-size: 100%;
  }
}

.action-text {
  font-size: $font-size-helper;
  color: $color-gray-medium;
}

.input-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 16rpx 32rpx;
  padding-bottom: calc(16rpx + constant(safe-area-inset-bottom));
  background: $color-bg-white;
  border-top: 1rpx solid rgba(113, 88, 92, 0.1);
  box-shadow: 0 -4rpx 16rpx rgba(168, 155, 157, 0.08);
}

.input-field {
  flex: 1;
  height: 72rpx;
  background: $color-bg-primary;
  border-radius: 36rpx;
  padding: 0 24rpx;
  font-size: 26rpx;
  border: none;
}

.input-placeholder {
  color: $color-gray-medium;
}

.send-btn {
  padding: 16rpx 32rpx;
  background: $color-primary;
  border-radius: 36rpx;

  &:active {
    transform: scale(0.98);
  }
}

.send-text {
  font-size: $font-size-body;
  color: $color-bg-white;
  font-weight: $font-weight-bold;
}
</style>
