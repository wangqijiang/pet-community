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
          <view class="bubble">{{ msg.content }}</view>
          <text class="time">{{ msg.time }}</text>
        </view>
      </view>
    </view>

    <template #fixed>
      <view id="chat-input-bar" class="input-area">
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
        <view
          class="send-btn"
          :class="{ active: inputText.trim() }"
          @click="sendMessage"
        >
          <text class="send-text">发送</text>
        </view>
      </view>
    </template>
  </PageLayout>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import TopNavBar from "@/components/common/TopNavBar.vue";
import PageLayout from "@/components/common/PageLayout.vue";
import {
  getChatMessages,
  sendMessage as sendMsgApi,
  type ChatMessage,
} from "@/api/message";
import { getUserInfo as getStoredUser } from "@/api/auth";
import { getUserInfo } from "@/api/user";
import { formatTime } from "@/utils/format";
import { resolveMediaUrl } from "@/utils/media";
import { useFixedFooterHeight } from "@/composables/useLayout";
import { ensureRealtimeConnected, setActiveChatUserId } from "@/utils/realtime";

const { footerHeight } = useFixedFooterHeight("#chat-input-bar", 24 + 88 + 24);

const peerUserId = ref(0);
const friendName = ref("");
const inputText = ref("");
const scrollToId = ref("");
const myAvatar = ref("");
const myUserId = ref(0);

interface UiMessage {
  id: number;
  content: string;
  time: string;
  isMe: boolean;
  avatar: string;
}

const messages = ref<UiMessage[]>([]);

const scrollToBottom = () => {
  setTimeout(() => {
    const last = messages.value[messages.value.length - 1];
    if (last) scrollToId.value = `msg-${last.id}`;
  }, 100);
};

const mapMessage = (m: ChatMessage): UiMessage => ({
  id: m.id,
  content: m.content,
  time: formatTime(m.created_at),
  isMe: m.from_id === myUserId.value,
  avatar: resolveMediaUrl(
    m.from_id === myUserId.value ? myAvatar.value : m.from_avatar,
  ),
});

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
  } catch {
    uni.showToast({ title: "加载失败", icon: "none" });
  }
};

const sendMessage = async () => {
  const text = inputText.value.trim();
  if (!text || !peerUserId.value) return;
  try {
    const sent = await sendMsgApi(peerUserId.value, text);
    inputText.value = "";
    appendMessage(sent);
  } catch {
    uni.showToast({ title: "发送失败", icon: "none" });
  }
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

.icon-plus,
.icon-image {
  width: 32rpx;
  height: 32rpx;
  background: #c4b5b5;
  border-radius: 8rpx;
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
</style>
