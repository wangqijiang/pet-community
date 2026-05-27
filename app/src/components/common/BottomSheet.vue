<template>
  <view
    class="bottom-sheet-mask"
    :class="{ show: visible }"
    @tap="handleMaskClick"
  >
    <view class="bottom-sheet-content" :class="{ show: visible }" @tap.stop>
      <view class="bottom-sheet-header">
        <text class="bottom-sheet-title">{{ title }}</text>
        <view class="bottom-sheet-close" @tap="handleClose">
          <text class="close-icon">×</text>
        </view>
      </view>
      <view class="bottom-sheet-body">
        <slot></slot>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { watch } from "vue";

interface Props {
  visible: boolean;
  title: string;
  closeOnClickMask?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  closeOnClickMask: true,
});

const emit = defineEmits<{
  "update:visible": [value: boolean];
  close: [];
}>();

watch(
  () => props.visible,
  (newVal) => {
    if (newVal) {
      uni.vibrateShort({ type: "light" });
    }
  },
);

const handleMaskClick = () => {
  if (props.closeOnClickMask) {
    handleClose();
  }
};

const handleClose = () => {
  uni.vibrateShort({ type: "light" });
  emit("update:visible", false);
  emit("close");
};
</script>

<style lang="scss" scoped>
.bottom-sheet-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: flex-end;
  z-index: 999;
  opacity: 0;
  visibility: hidden;
  transition:
    opacity 0.25s ease,
    visibility 0.25s ease;

  &.show {
    opacity: 1;
    visibility: visible;
  }
}

.bottom-sheet-content {
  width: 100%;
  background: white;
  border-radius: 56rpx 56rpx 0 0;
  padding: 40rpx 36rpx 60rpx;
  max-height: 75vh;
  overflow-y: auto;
  transform: translateY(100%);
  transition: transform 0.25s ease;

  &.show {
    transform: translateY(0);
  }

  &::-webkit-scrollbar {
    display: none;
  }
}

.bottom-sheet-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 40rpx;
}

.bottom-sheet-title {
  font-size: 36rpx;
  font-weight: 700;
  color: #5c4a4d;
}

.bottom-sheet-close {
  width: 68rpx;
  height: 68rpx;
  border-radius: 50%;
  background: #f5f1f1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-icon {
  display: flex;
  font-size: 60rpx;
  color: #8b7b7d;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
}

.bottom-sheet-body {
  width: 100%;
}
</style>
