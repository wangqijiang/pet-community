<template>
  <view class="page-container">
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
            @click="previewImage(imgIndex)"
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

              <!-- 回复列表 -->
              <view v-if="comment.replies && comment.replies.length > 0" class="reply-list">
                <view 
                  v-if="comment.replies.length > 5" 
                  class="reply-toggle"
                  @click="toggleReplyExpand(comment)"
                >
                  <text class="toggle-text">
                    {{ comment.showAllReplies ? `收起${comment.replies.length - 5}条回复` : `查看全部${comment.replies.length}条回复` }}
                  </text>
                </view>
                
                <view 
                  v-for="(reply, replyIndex) in (comment.showAllReplies ? comment.replies : comment.replies.slice(0, 5))" 
                  :key="replyIndex" 
                  class="reply-item"
                >
                  <text class="reply-name">{{ reply.userName }}</text>
                  <text class="reply-content">{{ reply.content }}</text>
                  <view class="reply-actions">
                    <view class="reply-action-item" @click="handleReply(comment)">
                      <text class="reply-action-text">回复</text>
                    </view>
                    <view class="reply-action-item" @click="handleReplyLike(reply)">
                      <text class="reply-action-text">{{ reply.likes }}</text>
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>

    <view v-if="replyingTo" class="reply-hint">
      <text class="reply-label">回复</text>
      <text class="reply-name">{{ replyingTo.userName }}</text>
      <view class="cancel-reply" @click="cancelReply">
        <text class="cancel-text">取消</text>
      </view>
    </view>
    <view class="input-bar">
      <input
        v-model="inputText"
        class="input-field"
        :placeholder="replyingTo ? `回复 ${replyingTo.userName}...` : '发表评论...'"
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
import { ref, onMounted } from "vue";
import { onLoad } from "@dcloudio/uni-app";

const inputText = ref("");
const replyingTo = ref<any>(null);

// Mock数据列表
const mockDynamics = [
  {
    id: 1,
    userName: "布丁麻麻",
    avatarColor: "#FFC1E9",
    userTag: "柯基 · 2岁",
    content:
      "今天带布丁去公园草坪打滚啦！阳光超级好，它开心得像个200斤的孩子哈哈。这就是简单的幸福吧～✨",
    images: ["#FFE4E1", "#FFD4F0", "#FFC1E9", "#FFB6C1"],
    likes: 128,
    comments: 32,
    liked: false,
  },
  {
    id: 2,
    userName: "喵星人领养中心",
    avatarColor: "#E8F5E9",
    userTag: "志愿者",
    content:
      "新来的小橘太粘人啦！一进门就开始蹭腿，求一个有缘的家庭带它回家～ 坐标上海。🍊",
    images: ["#FFF4D2"],
    likes: 456,
    comments: 89,
    liked: true,
  },
  {
    id: 3,
    userName: "金毛铲屎官",
    avatarColor: "#FFD4F0",
    userTag: "金毛 · 3岁",
    content:
      "今天训练了新技能！握手、趴下、打滚一气呵成，奖励了超多零食～🐾",
    images: ["#FFE4E1", "#FFC1E9"],
    likes: 234,
    comments: 45,
    liked: false,
  },
];

// Mock评论数据
const mockComments: Record<number, any[]> = {
  1: [
    {
      id: 1,
      userName: "阿花",
      avatarColor: "#FFD4F0",
      time: "5分钟前",
      content: "好可爱呀！布丁好活泼~",
      likes: 5,
      liked: false,
      replies: [
        {
          userName: "布丁麻麻",
          avatarColor: "#FFC1E9",
          time: "4分钟前",
          content: "哈哈，它每天精力都很旺盛！",
          likes: 3,
          liked: false,
        },
        {
          userName: "旺财",
          avatarColor: "#FFB6C1",
          time: "3分钟前",
          content: "我家的也是，每天都要遛好久",
          likes: 2,
          liked: false,
        },
        {
          userName: "球球",
          avatarColor: "#FFC0CB",
          time: "2分钟前",
          content: "柯基就是精力充沛",
          likes: 1,
          liked: false,
        },
        {
          userName: "小黄",
          avatarColor: "#FFF4D2",
          time: "1分钟前",
          content: "羡慕有院子的",
          likes: 0,
          liked: false,
        },
        {
          userName: "小黑",
          avatarColor: "#E8F5E9",
          time: "刚刚",
          content: "哈哈，太可爱了",
          likes: 0,
          liked: false,
        },
        {
          userName: "小白",
          avatarColor: "#FFE4E1",
          time: "刚刚",
          content: "想养一只",
          likes: 0,
          liked: false,
        },
      ],
    },
    {
      id: 2,
      userName: "旺财",
      avatarColor: "#FFB6C1",
      time: "3分钟前",
      content: "下次一起去呀！",
      likes: 3,
      liked: true,
      replies: [
        {
          userName: "布丁麻麻",
          avatarColor: "#FFC1E9",
          time: "2分钟前",
          content: "好呀好呀！约起来~",
          likes: 2,
          liked: false,
        },
      ],
    },
    {
      id: 3,
      userName: "球球",
      avatarColor: "#FFC0CB",
      time: "1分钟前",
      content: "这就是幸福的模样 💕",
      likes: 8,
      liked: false,
      replies: [],
    },
  ],
  2: [
    {
      id: 4,
      userName: "爱猫人士",
      avatarColor: "#E8F5E9",
      time: "10分钟前",
      content: "好可爱的小橘！想领养",
      likes: 12,
      liked: false,
      replies: [
        {
          userName: "喵星人领养中心",
          avatarColor: "#E8F5E9",
          time: "8分钟前",
          content: "欢迎来咨询哦！",
          likes: 5,
          liked: false,
        },
      ],
    },
    {
      id: 5,
      userName: "上海铲屎官",
      avatarColor: "#FFF4D2",
      time: "8分钟前",
      content: "请问具体在哪里呀？",
      likes: 6,
      liked: false,
      replies: [],
    },
  ],
  3: [
    {
      id: 6,
      userName: "训犬达人",
      avatarColor: "#FFC1E9",
      time: "15分钟前",
      content: "训练得真好！用的什么方法？",
      likes: 18,
      liked: true,
      replies: [],
    },
    {
      id: 7,
      userName: "新手铲屎官",
      avatarColor: "#FFD4F0",
      time: "12分钟前",
      content: "羡慕！我家的根本不听话 😂",
      likes: 9,
      liked: false,
      replies: [],
    },
  ],
};

const dynamic = ref(mockDynamics[0]);
const comments = ref(mockComments[1] || []);

onLoad((options: any) => {
  if (options && options.id) {
    const id = parseInt(options.id);
    const found = mockDynamics.find((item) => item.id === id);
    if (found) {
      dynamic.value = { ...found };
      comments.value = mockComments[id] || [];
    }
  }
});

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
  replyingTo.value = comment;
};

const cancelReply = () => {
  replyingTo.value = null;
};

const toggleReplyExpand = (comment: any) => {
  comment.showAllReplies = !comment.showAllReplies;
};

const handleReplyLike = (reply: any) => {
  reply.liked = !reply.liked;
  reply.likes += reply.liked ? 1 : -1;
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

  const newComment = {
    userName: "我",
    avatarColor: "#FFC1E9",
    time: "刚刚",
    content: replyingTo.value 
      ? `@${replyingTo.value.userName} ${inputText.value}` 
      : inputText.value,
    likes: 0,
    liked: false,
    replyTo: replyingTo.value ? replyingTo.value.userName : null,
  };

  comments.value.push(newComment);
  inputText.value = "";
  dynamic.value.comments++;
  
  if (replyingTo.value) {
    replyingTo.value = null;
  }
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
  min-height: calc(100vh - 120rpx);
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

.reply-list {
  margin-top: 16rpx;
  padding-left: 24rpx;
  border-left: 2rpx solid $color-primary-light;
}

.reply-toggle {
  padding: 8rpx 0;
  margin-bottom: 8rpx;
}

.toggle-text {
  font-size: $font-size-helper;
  color: $color-primary;
}

.reply-item {
  padding: 12rpx 0;
  border-bottom: 1rpx solid rgba(113, 88, 92, 0.05);

  &:last-child {
    border-bottom: none;
  }
}

.reply-name {
  font-size: $font-size-body;
  font-weight: $font-weight-bold;
  color: $color-gray-dark;
  margin-right: 8rpx;
}

.reply-content {
  font-size: $font-size-body;
  color: $color-gray-medium;
  line-height: 1.5;
}

.reply-actions {
  display: flex;
  gap: 20rpx;
  margin-top: 8rpx;
}

.reply-action-item {
  display: flex;
  align-items: center;
}

.reply-action-text {
  font-size: $font-size-helper;
  color: $color-gray-medium;
}

.reply-hint {
  position: fixed;
  bottom: 96rpx;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  gap: 12rpx;
  padding: 16rpx 32rpx;
  background: $color-bg-primary;
  border-top: 1rpx solid rgba(113, 88, 92, 0.1);
}

.reply-label {
  font-size: $font-size-body;
  color: $color-gray-medium;
}

.reply-name {
  font-size: $font-size-body;
  color: $color-primary;
  font-weight: $font-weight-bold;
}

.cancel-reply {
  margin-left: auto;
  padding: 8rpx 20rpx;
  background: rgba(113, 88, 92, 0.1);
  border-radius: $border-radius-base;
}

.cancel-text {
  font-size: $font-size-body;
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
  padding-bottom: calc(16rpx + env(safe-area-inset-bottom));
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
    transform: scale(1);
  }
}

.send-text {
  font-size: $font-size-body;
  color: $color-bg-white;
  font-weight: $font-weight-bold;
}
</style>
