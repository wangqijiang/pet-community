<script setup>
import { ref, nextTick } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import CustomNavbar from '@/components/CustomNavbar.vue'

const chatId = ref('')
const chatName = ref('')
const inputText = ref('')
const scrollViewId = ref('')

const messages = ref([
  {
    id: 1,
    type: 'received',
    content: '你好呀！糯米准备好今天去公园参加聚会了吗？🐾',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDHM1mD3NptkwmQGVyF2NL10zze1jZzRdtKzb5dwV1oMJJUJY7Pz9rcDsf6cdKDT3bvC41iQ9ipnT0QSm00tISvca91K3jmyD6t4SFEHepT1rawL6Ua5fEmUFCmaGBUDq5E6AGWSl5z40k-nKHP-o4mN89flOrQb34h6jX0ehUVWFuQYxZgQaKNL_CQNr_0pptY8Gy39FU7vqUIOHuv7hqTjbg6OcaVrmbROAi5gz824T-SmZMAOHLhvE_k7rALjxPxAac0aDb8WJEn'
  },
  {
    id: 2,
    type: 'sent',
    content: '她可兴奋啦！嘴里已经叼着她最喜欢的骨头了。😂',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBLr2yc4XLLFKo7O22zlfIak7xFHgaIlKrSa0Wp-FpxVlJ_Iwpm0GFJearLoDmsYOz7QYnhWFIJxfdDTeTC3JKw_TPCFOhWqA1wMpggujFDhtJ6Fcxka1vmBKzDxlFbZeEHeGZrhkNOmoPQIzl2BpnACxxtM2TT7m-MgXjtga7tVVolceVmXE5BcI3LVRJG1aSGlG3EUmgoy0k8JJj-4gllJopClTfWtAe2koyDMRv7Vr7gJ8uAod5Rsm4oWWYVn31aNH6UfCFonyux'
  },
  {
    id: 3,
    type: 'received',
    content: '太可爱了！我15分钟后就到，待会见！❤️',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDvwrETVL8gPsvJjyu777vOLAkavHz80WzsHxD16blI-q0keMxDeJ3wTiq3Vf4uyyUnt5hPSov9icp8jDUpnXOXOQvp7iV0BcBwzMap4C4-WzmCifTp97bvyPTUzd6kTzjfle7L2EAa2u_uSvP8NyflAyn0N0Q1VLEYhBVaINRZ5ABMOQqcNMMnqbLp7iImHuGsVjSZWEEVHtJ9irKXS5EZ--KbadbITtK0s2YGs6O4osMtTNzCNRRNNKOiU3DjuR6uyqArzZ1qNWcs'
  },
  {
    id: 4,
    type: 'sent-image',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBi9BWr3uvtOo9u1BdUwv-XqE1gIUmT3csmWGaZHTckWRlZ4EkpJQYdK_qkYWxF1un-E_vSNGflrnxctVW3pZ9TU0STDaGsoZGGq0Um345U9lcLIFn5Asr7B6igXnd0P1gvynJkanIyCsBwAg_Eq5x-Ghj8PFxxFqAxFpGJx-7ploOAMX1pES9WsSKT0KJqEEbNIc5e3UvTEDW4TAlHTC51XWSfjcWCcm9MWKZ9JtLrV3YcR33e9GLXy4rrnaOSr6HXSfAeUuiOCK46',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAThIBCGeS-F12Rw6FfOSXQ_q3elG6TEEu5NqzifS-LFan-4KbBG2QhBMNJ-D-L9Ag-WjpD5NOAOD6SwZvByBOFeTvOxNRGuXE0xeCsUlHIP6tZ3Cmk0bbAOUEo5Riy7x5Ggtk0234g27RF5bPenM8TZDVlXLk8S60gXr_MXtkwKux6mTNQ3rmuFZD_TvUehhEaJiqf4zJsdgQOPRzZQlX2PgeGAvYvohhtctWsGsPYZet9t67K1cjSPALWFJT9VplMfphL8rlleaZz'
  }
])

const quickReplies = ref([
  { text: '汪汪！🦴' },
  { text: '在路上啦！🐾' },
  { text: '真可爱！❤️' }
])

onLoad((options) => {
  if (options.id) {
    chatId.value = options.id
  }
  if (options.name) {
    chatName.value = options.name
  }
  scrollToBottom()
})

const scrollToBottom = () => {
  nextTick(() => {
    if (messages.value.length > 0) {
      scrollViewId.value = 'msg-' + messages.value[messages.value.length - 1].id
    }
  })
}

const handleBack = () => {
  uni.navigateBack()
}

const handleMore = () => {
  uni.showActionSheet({
    itemList: ['查看资料', '清空聊天记录', '举报'],
    success: (res) => {
      console.log('选择了：' + res.tapIndex)
    }
  })
}

const handleSend = () => {
  if (!inputText.value.trim()) return

  const newMessage = {
    id: messages.value.length + 1,
    type: 'sent',
    content: inputText.value,
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBLr2yc4XLLFKo7O22zlfIak7xFHgaIlKrSa0Wp-FpxVlJ_Iwpm0GFJearLoDmsYOz7QYnhWFIJxfdDTeTC3JKw_TPCFOhWqA1wMpggujFDhtJ6Fcxka1vmBKzDxlFbZeEHeGZrhkNOmoPQIzl2BpnACxxtM2TT7m-MgXjtga7tVVolceVmXE5BcI3LVRJG1aSGlG3EUmgoy0k8JJj-4gllJopClTfWtAe2koyDMRv7Vr7gJ8uAod5Rsm4oWWYVn31aNH6UfCFonyux'
  }

  messages.value.push(newMessage)
  inputText.value = ''
  uni.vibrateShort({ type: 'light' })
  scrollToBottom()
}

const handleQuickReply = (text) => {
  inputText.value = text
  handleSend()
}

const handleAddAction = () => {
  uni.showActionSheet({
    itemList: ['相册', '拍摄', '位置'],
    success: (res) => {
      if (res.tapIndex === 0) {
        chooseImage()
      } else if (res.tapIndex === 1) {
        takePhoto()
      }
    }
  })
}

const chooseImage = () => {
  uni.chooseImage({
    count: 1,
    success: (res) => {
      const newMessage = {
        id: messages.value.length + 1,
        type: 'sent-image',
        image: res.tempFilePaths[0],
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAThIBCGeS-F12Rw6FfOSXQ_q3elG6TEEu5NqzifS-LFan-4KbBG2QhBMNJ-D-L9Ag-WjpD5NOAOD6SwZvByBOFeTvOxNRGuXE0xeCsUlHIP6tZ3Cmk0bbAOUEo5Riy7x5Ggtk0234g27RF5bPenM8TZDVlXLk8S60gXr_MXtkwKux6mTNQ3rmuFZD_TvUehhEaJiqf4zJsdgQOPRzZQlX2PgeGAvYvohhtctWsGsPYZet9t67K1cjSPALWFJT9VplMfphL8rlleaZz'
      }
      messages.value.push(newMessage)
      scrollToBottom()
    }
  })
}

const takePhoto = () => {
  uni.chooseImage({
    count: 1,
    sourceType: ['camera'],
    success: (res) => {
      const newMessage = {
        id: messages.value.length + 1,
        type: 'sent-image',
        image: res.tempFilePaths[0],
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAThIBCGeS-F12Rw6FfOSXQ_q3elG6TEEu5NqzifS-LFan-4KbBG2QhBMNJ-D-L9Ag-WjpD5NOAOD6SwZvByBOFeTvOxNRGuXE0xeCsUlHIP6tZ3Cmk0bbAOUEo5Riy7x5Ggtk0234g27RF5bPenM8TZDVlXLk8S60gXr_MXtkwKux6mTNQ3rmuFZD_TvUehhEaJiqf4zJsdgQOPRzZQlX2PgeGAvYvohhtctWsGsPYZet9t67K1cjSPALWFJT9VplMfphL8rlleaZz'
      }
      messages.value.push(newMessage)
      scrollToBottom()
    }
  })
}

const previewImage = (url) => {
  uni.previewImage({
    urls: [url],
    current: url
  })
}
</script>

<template>
  <view class="chat-page">
    <!-- Top AppBar -->
    <CustomNavbar :title="chatName">
      <template #right>
        <view class="header-actions">
          <view class="icon-button">
            <text class="material-symbols-outlined">videocam</text>
          </view>
          <view class="icon-button" @tap="handleMore">
            <text class="material-symbols-outlined">more_vert</text>
          </view>
        </view>
      </template>
    </CustomNavbar>

    <!-- Chat History -->
    <scroll-view
      scroll-y
      class="chat-container"
      :scroll-into-view="scrollViewId"
      scroll-with-animation
    >
      <!-- Date Indicator -->
      <view class="date-indicator">
        <text class="date-text">Today, 2:45 PM</text>
      </view>

      <view
        v-for="msg in messages"
        :id="'msg-' + msg.id"
        :key="msg.id"
        class="message-wrapper"
        :class="msg.type"
      >
        <!-- Received Message -->
        <template v-if="msg.type === 'received'">
          <view class="message-row">
            <image :src="msg.avatar" class="message-avatar" mode="aspectFill" />
            <view class="message-bubble received-bubble">
              <text class="message-text">{{ msg.content }}</text>
            </view>
          </view>
        </template>

        <!-- Sent Message -->
        <template v-if="msg.type === 'sent'">
          <view class="message-row reverse">
            <image :src="msg.avatar" class="message-avatar" mode="aspectFill" />
            <view class="message-bubble sent-bubble">
              <text class="message-text">{{ msg.content }}</text>
            </view>
          </view>
        </template>

        <!-- Sent Image -->
        <template v-if="msg.type === 'sent-image'">
          <view class="message-row reverse">
            <image :src="msg.avatar" class="message-avatar" mode="aspectFill" />
            <view class="image-bubble" @tap="previewImage(msg.image)">
              <image :src="msg.image" class="message-image" mode="aspectFill" />
            </view>
          </view>
        </template>
      </view>
    </scroll-view>

    <!-- Input Footer -->
    <view class="input-footer">
      <view class="input-row">
        <view class="add-button" @tap="handleAddAction">
          <text class="add-icon">+</text>
        </view>
        <view class="input-wrapper">
          <input
            v-model="inputText"
            class="text-input"
            placeholder="和主人聊一聊吧～"
            confirm-type="send"
            @confirm="handleSend"
          />
          <view class="emoji-button">
            <text class="emoji-icon">😊</text>
          </view>
        </view>
        <view class="send-button" @tap="handleSend">
          <text class="send-icon">➤</text>
        </view>
      </view>
      <!-- Quick Reply -->
      <view class="quick-reply-row">
        <view
          v-for="(reply, index) in quickReplies"
          :key="index"
          class="quick-reply-chip"
          @tap="handleQuickReply(reply.text)"
        >
          <text class="quick-reply-text">{{ reply.text }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped>
.chat-page {
  width: 100%;
  height: 100vh;
  background: linear-gradient(180deg, #fff8f7 0%, #ffdde2 100%);
  display: flex;
  flex-direction: column;
  padding-bottom: calc(120rpx + env(safe-area-inset-bottom));
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.icon-button {
  width: 72rpx;
  height: 72rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  transition: all 0.3s ease;

  &:active {
    transform: scale(0.9);
  }

  .material-symbols-outlined {
    font-size: 44rpx;
    color: var(--primary);
  }
}

}

/* Chat Container */
.chat-container {
  flex: 1;
  margin-top: calc(88rpx + var(--status-bar-height, 40rpx));
  margin-bottom: 280rpx;
  padding: 32rpx 40rpx 80rpx;
  overflow-y: auto;
  max-width: 750rpx;
  margin-left: auto;
  margin-right: auto;
}

.date-indicator {
  display: flex;
  justify-content: center;
  margin-bottom: 48rpx;
}

.date-text {
  background-color: #f9f2f2;
  padding: 8rpx 24rpx;
  border-radius: 40rpx;
  font-size: 20rpx;
  font-weight: 700;
  color: #807476;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  font-family: 'Plus Jakarta Sans', sans-serif;
}

.message-wrapper {
  margin-bottom: 48rpx;
}

.message-row {
  display: flex;
  align-items: flex-end;
  gap: 16rpx;
  max-width: 85%;
}

.message-row.reverse {
  flex-direction: row-reverse;
  margin-left: auto;
}

.message-avatar {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  flex-shrink: 0;
  box-shadow: 0 4rpx 8rpx rgba(168, 155, 157, 0.1);
}

.message-bubble {
  padding: 24rpx 32rpx;
  border-radius: 32rpx;
  box-shadow: 0 8rpx 24rpx rgba(168, 155, 157, 0.08);
}

.received-bubble {
  background-color: #eadfbd;
  color: #6a6347;
  border-bottom-left-radius: 0;
}

.sent-bubble {
  background-color: #ffdde2;
  color: #795f64;
  border-bottom-right-radius: 0;
}

.message-text {
  font-size: 28rpx;
  line-height: 1.5;
  font-family: 'Nunito Sans', sans-serif;
}

.image-bubble {
  background-color: #ffdde2;
  padding: 8rpx;
  border-radius: 32rpx;
  border-bottom-right-radius: 0;
  box-shadow: 0 8rpx 24rpx rgba(168, 155, 157, 0.1);
}

.message-image {
  width: 400rpx;
  height: 320rpx;
  border-radius: 24rpx;
  display: block;
}

/* Input Footer */
.input-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #ffffff;
  padding: 24rpx 32rpx;
  padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
  box-shadow: 0 -8rpx 32rpx rgba(168, 155, 157, 0.08);
  max-width: 750rpx;
  margin: 0 auto;
}

.input-row {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 16rpx;
}

.add-button {
  width: 88rpx;
  height: 88rpx;
  border-radius: 50%;
  background-color: #ffdde2;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.add-icon {
  font-size: 48rpx;
  color: #71585c;
  font-weight: bold;
}

.input-wrapper {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  background-color: #f9f2f2;
  border-radius: 44rpx;
  height: 88rpx;
}

.text-input {
  flex: 1;
  height: 88rpx;
  background-color: transparent;
  border: none;
  padding: 0 32rpx;
  font-size: 28rpx;
  color: #1e1b1b;
}

.text-input::placeholder {
  color: rgba(128, 116, 118, 0.5);
}

.emoji-button {
  width: 80rpx;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.emoji-icon {
  font-size: 40rpx;
}

.send-button {
  width: 88rpx;
  height: 88rpx;
  border-radius: 50%;
  background-color: #71585c;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 8rpx 16rpx rgba(113, 88, 92, 0.2);
}

.send-icon {
  font-size: 36rpx;
  color: #ffffff;
  transform: rotate(-45deg) translateX(2rpx);
}

/* Quick Reply */
.quick-reply-row {
  display: flex;
  gap: 16rpx;
  overflow-x: auto;
  padding-bottom: 16rpx;
}

.quick-reply-chip {
  flex-shrink: 0;
  padding: 12rpx 32rpx;
  background-color: #daead8;
  border: 2rpx solid rgba(187, 203, 186, 0.3);
  border-radius: 40rpx;
}

.quick-reply-text {
  font-size: 22rpx;
  font-weight: 700;
  color: #5b6a5c;
  letter-spacing: 0.05em;
  font-family: 'Plus Jakarta Sans', sans-serif;
}
</style>
