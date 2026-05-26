<template>
  <view class="chat-container">
    <view class="topbar">
      <view class="top-left">
        <view class="back-btn" @click="goBack">
          <view class="back-icon"></view>
        </view>
      </view>
      <text class="title">{{ friendName }}</text>
      <view class="action-btn">
        <view class="action-icon"></view>
      </view>
    </view>

    <scroll-view
      scroll-y
      class="chat-area"
      :scroll-into-view="scrollToId"
      scroll-with-animation
    >
      <view
        v-for="(msg, index) in messages"
        :key="index"
        :id="'msg-' + index"
        class="message"
        :class="{ right: msg.isMe }"
      >
        <view class="message-wrap">
          <image class="avatar" :src="msg.isMe ? myAvatar : msg.avatar" mode="aspectFill" />
          <view class="bubble-group">
            <view class="bubble">{{ msg.content }}</view>
            <text class="time">{{ msg.time }}</text>
          </view>
        </view>
      </view>
    </scroll-view>

    <view class="input-area">
      <view class="input-icon">
        <view class="icon-plus"></view>
      </view>
      <view class="input-icon">
        <view class="icon-image"></view>
      </view>
      <input
        v-model="inputText"
        class="input-box"
        placeholder="输入消息..."
        @confirm="sendMessage"
      />
      <view class="send-btn" :class="{ active: inputText.trim() }" @click="sendMessage">
        <text class="send-text">发送</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";

const friendName = ref("小明");
const inputText = ref("");
const scrollToId = ref("");
const myAvatar = ref("https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop");

const messages = ref([
  {
    id: 1,
    content: "你好呀！🐶",
    time: "10:00",
    isMe: false,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: 2,
    content: "你好呀！今天出去遛狗吗？",
    time: "10:01",
    isMe: true,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: 3,
    content: "今天不下雨，要不要一起去公园？",
    time: "10:02",
    isMe: false,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: 4,
    content: "好呀！去哪边？",
    time: "10:03",
    isMe: true,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: 5,
    content: "中央公园吧，那边草坪大～",
    time: "10:05",
    isMe: false,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: 6,
    content: "可以，几点？",
    time: "10:06",
    isMe: true,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: 7,
    content: "下午三点怎么样？",
    time: "10:08",
    isMe: false,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: 8,
    content: "没问题，到时见！🐾",
    time: "10:10",
    isMe: true,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop",
  },
]);

const goBack = () => {
  uni.navigateBack();
};

const sendMessage = () => {
  if (!inputText.value.trim()) return;

  messages.value.push({
    id: messages.value.length + 1,
    content: inputText.value,
    time: new Date().toLocaleTimeString("zh-CN", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    isMe: true,
    avatar: myAvatar.value,
  });

  inputText.value = "";

  setTimeout(() => {
    messages.value.push({
      id: messages.value.length + 1,
      content: "好的，不见不散！",
      time: new Date().toLocaleTimeString("zh-CN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isMe: false,
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop",
    });
  }, 1000);
};

watch(
  messages,
  () => {
    setTimeout(() => {
      scrollToId.value = "msg-" + (messages.value.length - 1);
    }, 100);
  },
  { deep: true },
);

onMounted(() => {
  scrollToId.value = "msg-" + (messages.value.length - 1);
});
</script>

<style lang="scss" scoped>
.chat-container {
  min-height: 100vh;
  background: #FFF7F1;
  display: flex;
  flex-direction: column;
}

.topbar {
  height: 184rpx;
  padding: 104rpx 20rpx 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(255, 247, 241, 0.92);
  backdrop-filter: blur(20px);
  border-bottom: 1rpx solid rgba(0, 0, 0, 0.03);
}

.top-left {
  width: 80rpx;
  display: flex;
  align-items: center;
}

.back-btn {
  width: 80rpx;
  height: 80rpx;
  border-radius: 999rpx;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 24rpx rgba(107, 78, 61, 0.08);
}

.back-icon {
  width: 32rpx;
  height: 32rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%237A6E6E'%3E%3Cpath d='M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;
}

.title {
  font-size: 40rpx;
  font-weight: 700;
  color: #5E4636;
}

.action-btn {
  width: 80rpx;
  height: 80rpx;
  border-radius: 999rpx;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 24rpx rgba(107, 78, 61, 0.08);
}

.action-icon {
  width: 32rpx;
  height: 32rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%237A6E6E'%3E%3Cpath d='M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;
}

.chat-area {
  flex: 1;
  overflow-y: auto;
  padding: 40rpx 36rpx 80rpx;
}

.message {
  display: flex;
  margin-bottom: 44rpx;

  &.right {
    justify-content: flex-end;

    .message-wrap {
      flex-direction: row-reverse;
    }

    .bubble {
      background: #8B6D73;
      color: #ffffff;
      border-bottom-right-radius: 16rpx;
      box-shadow: 0 16rpx 40rpx rgba(139, 109, 115, 0.22);
    }

    .time {
      text-align: right;
    }
  }
}

.message-wrap {
  display: flex;
  align-items: flex-end;
  gap: 20rpx;
  max-width: 78%;
}

.avatar {
  width: 84rpx;
  height: 84rpx;
  border-radius: 32rpx;
  flex-shrink: 0;
}

.bubble-group {
  display: flex;
  flex-direction: column;
}

.bubble {
  padding: 28rpx 32rpx;
  border-radius: 44rpx;
  font-size: 30rpx;
  line-height: 1.7;
  background: #ffffff;
  color: #4D3E3E;
  border-bottom-left-radius: 16rpx;
  box-shadow: 0 12rpx 36rpx rgba(107, 78, 61, 0.05);
  word-break: break-word;
}

.time {
  margin-top: 12rpx;
  font-size: 22rpx;
  color: #B0A6A6;
}

.input-area {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 160rpx;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-top: 1rpx solid rgba(0, 0, 0, 0.03);
  padding: 24rpx 32rpx 40rpx;
  display: flex;
  align-items: center;
  gap: 24rpx;
}

.input-icon {
  width: 72rpx;
  height: 72rpx;
  border-radius: 24rpx;
  background: #FFF2EA;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.icon-plus {
  width: 32rpx;
  height: 32rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%238B6D73'%3E%3Cpath d='M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;
}

.icon-image {
  width: 32rpx;
  height: 32rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%238B6D73'%3E%3Cpath d='M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;
}

.input-box {
  flex: 1;
  height: 88rpx;
  border: none;
  border-radius: 999rpx;
  background: #F7F1EE;
  padding: 0 36rpx;
  font-size: 28rpx;
  outline: none;
  color: #4D3E3E;
}

.send-btn {
  height: 80rpx;
  padding: 0 36rpx;
  border-radius: 999rpx;
  background: rgba(255, 179, 107, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 16rpx 40rpx rgba(255, 179, 107, 0.15);
  transition: all 0.2s ease;

  &.active {
    background: #FFB36B;

    .send-text {
      color: #ffffff;
    }
  }

  &:active {
    transform: scale(1.03);
  }
}

.send-text {
  font-size: 28rpx;
  font-weight: 600;
  color: #B0A6A6;
}
</style>
