<template>
  <view v-if="visible" class="share-overlay" @click="handleClose">
    <view class="share-panel" @click.stop>
      <view class="panel-header">
        <text class="panel-title">分享动态</text>
        <view class="panel-close" @click="handleClose">
          <text>×</text>
        </view>
      </view>

      <view class="card-preview-wrap">
        <view class="preview-stage">
          <canvas
            :canvas-id="POST_SHARE_CANVAS_ID"
            :id="POST_SHARE_CANVAS_ID"
            class="share-canvas-preview"
            :class="{ 'is-hidden': !!cardImage }"
            :style="canvasStyle"
          />
          <image
            v-if="cardImage"
            class="card-preview-image"
            :src="cardImage"
            mode="widthFix"
            show-menu-by-longpress
          />
          <view v-if="generating" class="card-loading-mask">
            <text class="loading-text">正在绘制分享卡片...</text>
          </view>
        </view>
      </view>

      <text class="panel-tip">好友或朋友圈用户点击后将直达这条动态详情</text>

      <view class="share-actions">
        <!-- #ifdef MP-WEIXIN -->
        <button class="share-action primary" open-type="share" @click="prepareWeixinShare">
          <view class="action-icon friend"></view>
          <text>分享给好友</text>
        </button>
        <view class="share-action" @click="shareToMoments">
          <view class="action-icon moments"></view>
          <text>分享到朋友圈</text>
        </view>
        <!-- #endif -->

        <!-- #ifndef MP-WEIXIN -->
        <view class="share-action primary" @click="copyShareLink">
          <view class="action-icon link"></view>
          <text>复制链接分享</text>
        </view>
        <view class="share-action" @click="shareToMoments">
          <view class="action-icon moments"></view>
          <text>保存卡片发朋友圈</text>
        </view>
        <!-- #endif -->

        <view class="share-action" @click="saveCardImage">
          <view class="action-icon save"></view>
          <text>保存分享卡片</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, getCurrentInstance } from "vue";
import type { PostShareInput } from "@/utils/postShare";
import { buildPostShareLink } from "@/utils/postShare";
import {
  generatePostShareCard,
  POST_SHARE_CANVAS_ID,
  getPostShareCanvasSize,
} from "@/utils/postShareCard";
import { buildPendingPostShare, setPendingPostShare } from "@/composables/usePostShare";

const props = defineProps<{
  visible: boolean;
  post: PostShareInput | null;
}>();

const emit = defineEmits<{
  "update:visible": [value: boolean];
  close: [];
}>();

const instance = getCurrentInstance();
const generating = ref(false);
const cardImage = ref("");

const canvasSize = getPostShareCanvasSize();
const canvasStyle = computed(() => ({
  width: `${canvasSize.width}px`,
  height: `${canvasSize.height}px`,
}));

const resetState = () => {
  cardImage.value = "";
  generating.value = false;
  setPendingPostShare(null);
};

const handleClose = () => {
  emit("update:visible", false);
  emit("close");
  resetState();
};

const drawCard = async () => {
  if (!props.post) return "";

  generating.value = true;
  cardImage.value = "";

  await nextTick();
  await new Promise((r) => setTimeout(r, 100));

  try {
    const imagePath = await generatePostShareCard(props.post, instance);
    cardImage.value = imagePath;
    setPendingPostShare(buildPendingPostShare(props.post, imagePath));
    return imagePath;
  } catch (error) {
    console.error("分享卡片绘制失败:", error);
    uni.showToast({ title: "卡片生成失败，请重试", icon: "none" });
    return "";
  } finally {
    generating.value = false;
  }
};

const ensureCard = async () => {
  if (!props.post) return "";
  if (cardImage.value) return cardImage.value;
  return drawCard();
};

watch(
  () => props.visible,
  async (show) => {
    if (!show) {
      resetState();
      return;
    }
    if (!props.post) return;
    await nextTick();
    drawCard();
  },
);

watch(
  () => props.post?.id,
  async (id, prevId) => {
    if (!props.visible || !id || id === prevId) return;
    cardImage.value = "";
    await nextTick();
    drawCard();
  },
);

const prepareWeixinShare = async () => {
  await ensureCard();
  if (!props.post || !cardImage.value) return;
  setPendingPostShare(buildPendingPostShare(props.post, cardImage.value));
};

const shareToMoments = async () => {
  const imagePath = await ensureCard();
  if (!imagePath || !props.post) return;

  setPendingPostShare(buildPendingPostShare(props.post, imagePath));

  // #ifdef MP-WEIXIN
  uni.showShareMenu({
    withShareTicket: true,
    menus: ["shareAppMessage", "shareTimeline"],
  });
  uni.showModal({
    title: "分享到朋友圈",
    content: "请点击右上角「···」，选择「分享到朋友圈」。好友点击后将直达动态详情页。",
    showCancel: false,
    confirmText: "我知道了",
  });
  // #endif

  // #ifndef MP-WEIXIN
  uni.saveImageToPhotosAlbum({
    filePath: imagePath,
    success: () => {
      uni.showModal({
        title: "卡片已保存",
        content: "打开微信朋友圈，选择刚保存的卡片图片发布即可。",
        confirmText: "复制链接",
        cancelText: "知道了",
        success: (res) => {
          if (res.confirm) copyShareLink();
        },
      });
    },
    fail: () => {
      uni.showToast({ title: "保存失败，请检查相册权限", icon: "none" });
    },
  });
  // #endif
};

const saveCardImage = async () => {
  const imagePath = await ensureCard();
  if (!imagePath) return;

  uni.saveImageToPhotosAlbum({
    filePath: imagePath,
    success: () => {
      uni.showToast({ title: "已保存到相册", icon: "success" });
    },
    fail: () => {
      uni.previewImage({ urls: [imagePath] });
    },
  });
};

const copyShareLink = async () => {
  if (!props.post) return;
  await ensureCard();
  const link = buildPostShareLink(props.post.id);
  uni.setClipboardData({
    data: link,
    success: () => {
      uni.showToast({ title: "链接已复制", icon: "none" });
    },
  });
};
</script>

<style lang="scss" scoped>
.share-overlay {
  position: fixed;
  inset: 0;
  z-index: 2000;
  background: rgba(30, 27, 27, 0.45);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: flex-end;
}

.share-panel {
  width: 100%;
  max-height: 92vh;
  background: #fff8f5;
  border-radius: 48rpx 48rpx 0 0;
  padding: 32rpx 36rpx calc(36rpx + env(safe-area-inset-bottom));
  box-shadow: 0 -16rpx 48rpx rgba(107, 78, 61, 0.12);
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 28rpx;
}

.panel-title {
  font-size: 36rpx;
  font-weight: 800;
  color: #3d2f2f;
}

.panel-close {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40rpx;
  color: #aa9f9f;
}

.card-preview-wrap {
  max-height: 56vh;
  overflow-y: auto;
  margin-bottom: 20rpx;
}

.preview-stage {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 360rpx;
}

.card-loading-mask {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 248, 245, 0.88);
  border-radius: 32rpx;
  z-index: 2;
}

.loading-text {
  font-size: 28rpx;
  color: #aa9f9f;
}

.share-canvas-preview {
  display: block;
  border-radius: 32rpx;
  box-shadow: 0 24rpx 60rpx rgba(107, 78, 61, 0.15);
  background: #fff8f5;

  &.is-hidden {
    position: absolute;
    opacity: 0;
    pointer-events: none;
    z-index: -1;
  }
}

.card-preview-image {
  width: 100%;
  max-width: 520rpx;
  border-radius: 32rpx;
  box-shadow: 0 24rpx 60rpx rgba(107, 78, 61, 0.15);
}

.panel-tip {
  display: block;
  text-align: center;
  font-size: 24rpx;
  color: #b0a6a6;
  margin-bottom: 28rpx;
}

.share-actions {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
}

.share-action {
  background: #ffffff;
  border-radius: 28rpx;
  padding: 28rpx 16rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
  box-shadow: 0 12rpx 32rpx rgba(107, 78, 61, 0.06);
  border: none;
  line-height: normal;
  font-size: 26rpx;
  color: #4f4242;
  font-weight: 700;

  &::after {
    border: none;
  }

  &.primary {
    background: linear-gradient(135deg, #8b6d73, #7a5c62);
    color: #ffffff;
  }
}

.action-icon {
  width: 48rpx;
  height: 48rpx;
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100%;

  &.friend {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23FFFFFF' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2'/%3E%3Ccircle cx='9' cy='7' r='4'/%3E%3Cpath d='M22 21v-2a4 4 0 0 0-3-3.87'/%3E%3Cpath d='M16 3.13a4 4 0 0 1 0 7.75'/%3E%3C/svg%3E");
  }

  &.moments {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%238B6D73' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3Ccircle cx='12' cy='12' r='4'/%3E%3Cline x1='21.17' y1='8' x2='12' y2='8'/%3E%3Cline x1='3.95' y1='6.06' x2='8.54' y2='14'/%3E%3Cline x1='10.88' y1='21.94' x2='15.46' y2='14'/%3E%3C/svg%3E");
  }

  &.save {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%238B6D73' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4'/%3E%3Cpolyline points='7 10 12 15 17 10'/%3E%3Cline x1='12' y1='15' x2='12' y2='3'/%3E%3C/svg%3E");
  }

  &.link {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23FFFFFF' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71'/%3E%3Cpath d='M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71'/%3E%3C/svg%3E");
  }
}
</style>
