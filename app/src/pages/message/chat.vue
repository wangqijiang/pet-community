<template>
  <PageLayout
    :footer-height="footerHeight"
    :scroll-into-view="scrollToId"
    :scroll-with-animation="true"
  >
    <template #navbar>
      <TopNavBar :title="friendName" :showBack="true" />
    </template>
    <view
      v-for="msg in messages"
      :key="msg.id"
      :id="'msg-' + msg.id"
      class="message"
      :class="{ right: msg.isMe }"
    >
      <view class="message-wrap">
        <image
          class="avatar"
          :src="msg.isMe ? myAvatar : msg.avatar"
          mode="aspectFill"
        />
        <view class="bubble-group">
          <image
            v-if="msg.type === 'image'"
            class="bubble-image"
            :src="resolveLocalOrMediaUrl(msg.content)"
            mode="widthFix"
            @click="previewImage(msg.content)"
          />
          <view v-else class="bubble">{{ msg.content }}</view>
          <text class="time">{{ msg.time }}</text>
        </view>
      </view>
    </view>

    <template #fixed>
      <view id="chat-input-bar" class="input-area">
        <view class="input-icon" @click="openEmojiSheet">
          <text class="emoji-trigger">☺</text>
        </view>
        <view class="input-icon" @click="chooseChatImage">
          <view class="icon-image"></view>
        </view>
        <input
          v-model="inputText"
          class="input-box"
          placeholder="输入消息..."
          @confirm="sendMessage"
        />
        <view
          class="send-btn"
          :class="{ active: inputText.trim() }"
          @click="sendMessage"
        >
          <text class="send-text">发送</text>
        </view>
      </view>

      <BottomSheet
        :visible="emojiVisible"
        title="选择表情"
        @update:visible="emojiVisible = $event"
      >
        <view class="emoji-grid">
          <view
            v-for="emoji in CHAT_EMOJIS"
            :key="emoji"
            class="emoji-item"
            @click="appendEmoji(emoji)"
          >
            <text>{{ emoji }}</text>
          </view>
        </view>
      </BottomSheet>
    </template>
  </PageLayout>
</template>

<script setup lang="ts">
import { showRequestError } from "@/utils/request";
import { ref, watch, onMounted, onUnmounted } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import TopNavBar from "@/components/common/TopNavBar.vue";
import PageLayout from "@/components/common/PageLayout.vue";
import BottomSheet from "@/components/common/BottomSheet.vue";
import {
  getChatMessages,
  sendMessage as sendMsgApi,
  type ChatMessage,
} from "@/api/message";
import { getUserInfo as getStoredUser } from "@/api/auth";
import { getUserInfo } from "@/api/user";
import { formatTime } from "@/utils/format";
import { resolveLocalOrMediaUrl, resolveMediaUrl } from "@/utils/media";
import { useFixedFooterHeight } from "@/composables/useLayout";
import { useChooseImage } from "@/composables/useChooseImage";
import { ensureUploaded, isLocalMediaPath } from "@/utils/uploadMedia";
import { ensureRealtimeConnected, setActiveChatUserId } from "@/utils/realtime";
import { scheduleTabBarBadgeRefresh } from "@/utils/tabBarBadge";

const CHAT_EMOJIS = [
  "😀", "😁", "😂", "🤣", "😊", "😍", "🥰", "😘",
  "🐶", "🐕", "🦮", "🐩", "🐾", "❤️", "👍", "🎉",
  "🌞", "☕", "🌳", "🏃", "💬", "🙏", "😢", "😴",
];

const { footerHeight } = useFixedFooterHeight("#chat-input-bar", 24 + 88 + 24 + 16);
const { chooseSingle } = useChooseImage();

const peerUserId = ref(0);
const friendName = ref("");
const inputText = ref("");
const scrollToId = ref("");
const myAvatar = ref("");
const myUserId = ref(0);
const emojiVisible = ref(false);
const sendingImage = ref(false);

interface UiMessage {
  id: number;
  content: string;
  time: string;
  isMe: boolean;
  avatar: string;
  type: string;
}

const messages = ref<UiMessage[]>([]);

const scrollToBottom = () => {
  setTimeout(() => {
    const last = messages.value[messages.value.length - 1];
    if (last) scrollToId.value = `msg-${last.id}`;
  }, 100);
};

const mapMessage = (m: ChatMessage): UiMessage => {
  const isImage = m.type === "image";
  const content = isImage
    ? isLocalMediaPath(m.content)
      ? m.content
      : resolveMediaUrl(m.content)
    : m.content;
  return {
    id: m.id,
    content,
    time: formatTime(m.created_at),
    isMe: m.from_id === myUserId.value,
    avatar: resolveMediaUrl(
      m.from_id === myUserId.value ? myAvatar.value : m.from_avatar,
    ),
    type: m.type || "text",
  };
};

const appendMessage = (m: ChatMessage) => {
  if (messages.value.some((item) => item.id === m.id)) return;
  if (
    m.from_id !== peerUserId.value &&
    m.to_id !== peerUserId.value &&
    m.from_id !== myUserId.value &&
    m.to_id !== myUserId.value
  ) {
    return;
  }
  messages.value.push(mapMessage(m));
  scrollToBottom();
};

const loadMessages = async () => {
  if (!peerUserId.value) return;
  try {
    const list = await getChatMessages(peerUserId.value, 1, 100);
    messages.value = list.map(mapMessage);
    scrollToBottom();
    scheduleTabBarBadgeRefresh();
  } catch (error) {
    showRequestError(error, "加载失败");
  }
};

const sendMessage = async () => {
  const text = inputText.value.trim();
  if (!text || !peerUserId.value) return;
  try {
    const sent = await sendMsgApi(peerUserId.value, text);
    inputText.value = "";
    appendMessage(sent);
  } catch (error) {
    showRequestError(error, "发送失败");
  }
};

const openEmojiSheet = () => {
  uni.vibrateShort({ type: "light" });
  emojiVisible.value = true;
};

const appendEmoji = (emoji: string) => {
  inputText.value += emoji;
  emojiVisible.value = false;
};

const chooseChatImage = () => {
  if (sendingImage.value || !peerUserId.value) return;
  chooseSingle(async (tempPath) => {
    sendingImage.value = true;
    uni.showLoading({ title: "上传中...", mask: true });
    try {
      const ossUrl = await ensureUploaded(tempPath);
      const sent = await sendMsgApi(peerUserId.value, ossUrl, "image");
      appendMessage(sent);
    } catch (error) {
      showRequestError(error, "图片发送失败");
    } finally {
      uni.hideLoading();
      sendingImage.value = false;
    }
  });
};

const previewImage = (url: string) => {
  const resolved = resolveLocalOrMediaUrl(url);
  if (!resolved) return;
  uni.previewImage({ urls: [resolved], current: resolved });
};

const onRealtimeMessage = (raw: ChatMessage) => {
  appendMessage(raw);
};

watch(
  () => messages.value.length,
  () => scrollToBottom(),
);

onLoad(async (options) => {
  ensureRealtimeConnected();
  peerUserId.value = Number(options?.userId || 0);
  setActiveChatUserId(peerUserId.value);
  friendName.value = decodeURIComponent(options?.name || "聊天");
  const stored = getStoredUser();
  if (stored) {
    myUserId.value = stored.id;
    myAvatar.value = resolveMediaUrl(stored.avatar);
  }
  try {
    const me = await getUserInfo();
    myUserId.value = me.id;
    myAvatar.value = resolveMediaUrl(me.avatar);
  } catch {
    /* ignore */
  }
  await loadMessages();
});

onMounted(() => {
  uni.$on("realtime:message", onRealtimeMessage);
});

onUnmounted(() => {
  setActiveChatUserId(0);
  uni.$off("realtime:message", onRealtimeMessage);
  scheduleTabBarBadgeRefresh();
});
</script>

<style lang="scss" scoped>
@import "@/styles/layout.scss";

.message {
  padding: 16rpx 40rpx;
}

.message-wrap {
  display: flex;
  align-items: flex-start;
  gap: 16rpx;
}

.message.right .message-wrap {
  flex-direction: row-reverse;
}

.avatar {
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  flex-shrink: 0;
}

.bubble-group {
  max-width: 70%;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.message.right .bubble-group {
  align-items: flex-end;
}

.bubble {
  padding: 20rpx 28rpx;
  background: #fff;
  border-radius: 24rpx;
  font-size: 28rpx;
  color: #4d3e3e;
  line-height: 1.5;
  box-shadow: 0 4rpx 16rpx rgba(107, 78, 61, 0.06);
}

.bubble-image {
  max-width: 360rpx;
  border-radius: 24rpx;
  box-shadow: 0 4rpx 16rpx rgba(107, 78, 61, 0.06);
}

.message.right .bubble {
  background: linear-gradient(135deg, #ffb6c1, #ffc1e9);
  color: #5e4636;
}

.time {
  font-size: 22rpx;
  color: #9b9090;
}

.input-area {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 20rpx 24rpx calc(20rpx + env(safe-area-inset-bottom));
  background: rgba(255, 247, 241, 0.96);
  border-top: 1rpx solid rgba(0, 0, 0, 0.04);
  z-index: 100;
}

.input-icon {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.emoji-trigger {
  font-size: 40rpx;
  line-height: 1;
  color: #8a7f7f;
}

.icon-image {
  width: 32rpx;
  height: 32rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23C4B5B5'%3E%3Cpath d='M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;
}

.input-box {
  flex: 1;
  height: 72rpx;
  background: #fff;
  border-radius: 36rpx;
  padding: 0 28rpx;
  font-size: 28rpx;
}

.send-btn {
  padding: 16rpx 28rpx;
  border-radius: 36rpx;
  background: #e8e8e8;
  flex-shrink: 0;

  &.active {
    background: linear-gradient(135deg, #ffb6c1, #ffc1e9);
  }
}

.send-text {
  font-size: 26rpx;
  font-weight: 600;
  color: #9b9090;
}

.send-btn.active .send-text {
  color: #fff;
}

.emoji-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  padding: 8rpx 0 24rpx;
}

.emoji-item {
  width: 80rpx;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 44rpx;
  border-radius: 16rpx;
  background: #fff7f1;

  &:active {
    transform: scale(1.05);
  }
}
</style>
