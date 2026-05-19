<template>
  <view class="chat-container">
    <TopNavBar :title="friendName" />
    
    <scroll-view 
      scroll-y 
      class="chat-content"
      :scroll-into-view="scrollToId"
      scroll-with-animation
    >
      <view 
        v-for="(msg, index) in messages" 
        :key="index"
        :id="'msg-' + index"
        class="message-bubble"
        :class="{ 'is-me': msg.isMe }"
      >
        <view class="bubble-avatar">
          <view class="avatar-bg" :style="{ background: msg.isMe ? '#FFC1E9' : msg.avatarColor }"></view>
        </view>
        <view class="bubble-content">
          <text class="bubble-text">{{ msg.content }}</text>
          <text class="bubble-time">{{ msg.time }}</text>
        </view>
      </view>
    </scroll-view>
    
    <view class="chat-input">
      <view class="input-tools">
        <view class="tool-item">
          <view class="tool-icon icon-emoji"></view>
        </view>
        <view class="tool-item">
          <view class="tool-icon icon-image"></view>
        </view>
        <view class="tool-item">
          <view class="tool-icon icon-camera"></view>
        </view>
      </view>
      <view class="input-area">
        <input 
          v-model="inputText"
          class="input-field"
          placeholder="输入消息..."
          placeholder-class="input-placeholder"
        />
        <view class="send-btn" :class="{ active: inputText.trim() }" @click="sendMessage">
          <text class="send-text">发送</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import TopNavBar from '@/components/common/TopNavBar.vue'
import { ref, watch, onMounted } from 'vue'

const friendName = ref('小明')
const inputText = ref('')
const scrollToId = ref('')

const messages = ref([
  { id: 1, content: '你好！', time: '10:00', isMe: false, avatarColor: '#FFC1E9' },
  { id: 2, content: '你好呀！', time: '10:01', isMe: true, avatarColor: '#FFC1E9' },
  { id: 3, content: '今天天气不错，要不要一起遛狗？', time: '10:02', isMe: false, avatarColor: '#FFC1E9' },
  { id: 4, content: '好呀！去哪里呢？', time: '10:03', isMe: true, avatarColor: '#FFC1E9' },
  { id: 5, content: '中央公园吧，那边草坪大', time: '10:05', isMe: false, avatarColor: '#FFC1E9' },
  { id: 6, content: '可以，几点？', time: '10:06', isMe: true, avatarColor: '#FFC1E9' },
  { id: 7, content: '下午3点怎么样？', time: '10:08', isMe: false, avatarColor: '#FFC1E9' },
  { id: 8, content: '没问题，到时见！', time: '10:10', isMe: true, avatarColor: '#FFC1E9' }
])

const sendMessage = () => {
  if (!inputText.value.trim()) return
  
  messages.value.push({
    id: messages.value.length + 1,
    content: inputText.value,
    time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    isMe: true,
    avatarColor: '#FFC1E9'
  })
  
  inputText.value = ''
  
  setTimeout(() => {
    messages.value.push({
      id: messages.value.length + 1,
      content: '好的，不见不散！',
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      isMe: false,
      avatarColor: '#FFC1E9'
    })
  }, 1000)
}

watch(messages, () => {
  setTimeout(() => {
    scrollToId.value = 'msg-' + (messages.value.length - 1)
  }, 100)
}, { deep: true })

onMounted(() => {
  scrollToId.value = 'msg-' + (messages.value.length - 1)
})
</script>

<style lang="scss" scoped>
.chat-container {
  min-height: 100vh;
  background: #FFF9F9;
  display: flex;
  flex-direction: column;
}

.chat-content {
  flex: 1;
  padding: 24rpx 32rpx;
  padding-top: calc(var(--status-bar-height, 44px) + 120rpx);
  padding-bottom: 200rpx;
}

.message-bubble {
  display: flex;
  margin-bottom: 24rpx;
  
  &.is-me {
    flex-direction: row-reverse;
    
    .bubble-content {
      background: #FFC1E9;
      border-radius: 24rpx 8rpx 24rpx 24rpx;
      
      .bubble-text {
        color: #FFFFFF;
      }
      
      .bubble-time {
        color: rgba(255, 255, 255, 0.8);
      }
    }
  }
}

.bubble-avatar {
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  padding: 4rpx;
  background: #FFC1E9;
  flex-shrink: 0;
}

.avatar-bg {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.bubble-content {
  max-width: 70%;
  background: #FFFFFF;
  border-radius: 8rpx 24rpx 24rpx 24rpx;
  padding: 20rpx;
  margin: 0 16rpx;
  border: 2rpx solid #FFC1E9;
}

.bubble-text {
  font-size: 28rpx;
  color: #333333;
  line-height: 1.5;
}

.bubble-time {
  display: block;
  text-align: right;
  font-size: 20rpx;
  color: #999999;
  margin-top: 8rpx;
}

.chat-input {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #FFFFFF;
  padding: 16rpx 32rpx;
  padding-bottom: calc(16rpx + constant(safe-area-inset-bottom));
  border-top: 2rpx solid #FFC1E9;
}

.input-tools {
  display: flex;
  gap: 32rpx;
  margin-bottom: 16rpx;
}

.tool-item {
  width: 56rpx;
  height: 56rpx;
  
  &:active {
    opacity: 0.7;
  }
}

.tool-icon {
  width: 100%;
  height: 100%;
  
  &.icon-emoji {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23FFC1E9'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z'/%3E%3C/svg%3E") no-repeat center;
    background-size: 100%;
  }
  
  &.icon-image {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23FFC1E9'%3E%3Cpath d='M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z'/%3E%3C/svg%3E") no-repeat center;
    background-size: 100%;
  }
  
  &.icon-camera {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23FFC1E9'%3E%3Cpath d='M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z'/%3E%3C/svg%3E") no-repeat center;
    background-size: 100%;
  }
}

.input-area {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.input-field {
  flex: 1;
  height: 72rpx;
  background: #FFF9F9;
  border-radius: 36rpx;
  padding: 0 24rpx;
  font-size: 26rpx;
}

.input-placeholder {
  color: #999999;
}

.send-btn {
  padding: 16rpx 32rpx;
  background: #E5E5E5;
  border-radius: 36rpx;
  
  &.active {
    background: #FFC1E9;
    
    .send-text {
      color: #FFFFFF;
    }
  }
  
  &:active {
    transform: scale(0.98);
  }
}

.send-text {
  font-size: 26rpx;
  color: #999999;
  font-weight: 600;
}
</style>
