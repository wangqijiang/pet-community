<template>
  <view class="chat-page">
    <TopNavBar :title="chatInfo.nickname" />

    <view class="page-content">
      <scroll-view
        class="message-list"
        scroll-y
        :scroll-into-view="scrollIntoView"
        scroll-with-animation
      >
        <view
          v-for="msg in messageList"
          :key="msg.id"
          :id="`msg-${msg.id}`"
          class="message-item"
          :class="{ 'self': msg.isSelf }"
        >
          <image class="msg-avatar" :src="msg.avatar" mode="aspectFill"></image>
          <view class="msg-content">
            <view v-if="msg.type === 'text'" class="msg-bubble text-bubble">
              <text class="msg-text">{{ msg.content }}</text>
            </view>
            <view v-if="msg.type === 'image'" class="msg-bubble image-bubble">
              <image class="msg-image" :src="msg.content" mode="aspectFill" @tap="previewImage(msg.content)"></image>
            </view>
          </view>
        </view>
      </scroll-view>

      <!-- 输入栏 -->
      <view class="input-bar">
        <image class="input-icon" src="/static/images/icon-emoji.png" mode="aspectFit" @tap="showEmojiPicker"></image>
        <input
          class="message-input"
          v-model="inputText"
          placeholder="说点什么..."
          confirm-type="send"
          @confirm="sendMessage"
        />
        <image class="input-icon" src="/static/images/icon-image.png" mode="aspectFit" @tap="chooseImage"></image>
        <view class="send-btn" @tap="sendMessage">
          <text class="send-text">发送</text>
        </view>
      </view>
    </view>

    <Loading :visible="loading" />
  </view>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import TopNavBar from '@/components/common/TopNavBar.vue'
import Loading from '@/components/common/Loading.vue'

const loading = ref(false)
const inputText = ref('')
const scrollIntoView = ref('')

const chatInfo = ref({
  id: 1,
  nickname: '铲屎官小王',
  avatar: '/static/images/avatar-default.png'
})

const messageList = ref([
  {
    id: 1,
    type: 'text',
    content: '你好，今天有空一起遛狗吗？',
    avatar: '/static/images/avatar-default.png',
    isSelf: false,
    time: '10:30'
  },
  {
    id: 2,
    type: 'text',
    content: '好啊，几点？',
    avatar: '/static/images/avatar-default.png',
    isSelf: true,
    time: '10:31'
  },
  {
    id: 3,
    type: 'text',
    content: '下午3点怎么样？在朝阳公园见',
    avatar: '/static/images/avatar-default.png',
    isSelf: false,
    time: '10:32'
  },
  {
    id: 4,
    type: 'text',
    content: '没问题！到时候见',
    avatar: '/static/images/avatar-default.png',
    isSelf: true,
    time: '10:33'
  }
])

onMounted(() => {
  loadChatHistory()
  scrollToBottom()
})

const loadChatHistory = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 1000)
}

const scrollToBottom = () => {
  nextTick(() => {
    if (messageList.value.length > 0) {
      scrollIntoView.value = `msg-${messageList.value[messageList.value.length - 1].id}`
    }
  })
}

const sendMessage = () => {
  if (!inputText.value.trim()) {
    return
  }

  uni.vibrateShort({ type: 'medium' })

  const newMsg = {
    id: Date.now(),
    type: 'text',
    content: inputText.value,
    avatar: '/static/images/avatar-default.png',
    isSelf: true,
    time: '刚刚'
  }

  messageList.value.push(newMsg)
  inputText.value = ''
  scrollToBottom()
}

const chooseImage = () => {
  uni.vibrateShort({ type: 'light' })
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      const newMsg = {
        id: Date.now(),
        type: 'image',
        content: res.tempFilePaths[0],
        avatar: '/static/images/avatar-default.png',
        isSelf: true,
        time: '刚刚'
      }
      messageList.value.push(newMsg)
      scrollToBottom()
    }
  })
}

const previewImage = (url) => {
  const imageUrls = messageList.value
    .filter(msg => msg.type === 'image')
    .map(msg => msg.content)

  uni.previewImage({
    urls: imageUrls,
    current: url
  })
}

const showEmojiPicker = () => {
  uni.vibrateShort({ type: 'light' })
  uni.showToast({
    title: '表情功能开发中',
    icon: 'none'
  })
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.chat-page {
  width: 100%;
  height: 100vh;
  background: $color-bg-primary;
  display: flex;
  flex-direction: column;
}

.page-content {
  flex: 1;
  padding-top: $nav-bar-height;
  display: flex;
  flex-direction: column;
}

.message-list {
  flex: 1;
  padding: $spacing-component $spacing-page-horizontal;
  padding-bottom: 120rpx;
}

.message-item {
  display: flex;
  gap: $spacing-small;
  margin-bottom: $spacing-component;

  &.self {
    flex-direction: row-reverse;

    .msg-content {
      align-items: flex-end;
    }

    .text-bubble {
      background: linear-gradient(135deg, $color-primary 0%, #FFD4F0 100%);

      .msg-text {
        color: $color-bg-white;
      }
    }
  }

  .msg-avatar {
    width: $avatar-size-small;
    height: $avatar-size-small;
    border-radius: $border-radius-circle;
    flex-shrink: 0;
  }

  .msg-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    .msg-bubble {
      max-width: 480rpx;
      border-radius: $border-radius-base;
      overflow: hidden;

      &.text-bubble {
        padding: $spacing-component;
        background: $color-bg-white;
        box-shadow: $shadow-light;

        .msg-text {
          font-size: $font-size-body;
          color: $color-gray-dark;
          line-height: 1.6;
          word-break: break-all;
        }
      }

      &.image-bubble {
        .msg-image {
          width: 320rpx;
          height: 320rpx;
          display: block;
        }
      }
    }
  }
}

.input-bar {
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

  .input-icon {
    width: 48rpx;
    height: 48rpx;
    flex-shrink: 0;
  }

  .message-input {
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
    flex-shrink: 0;

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
</style>
