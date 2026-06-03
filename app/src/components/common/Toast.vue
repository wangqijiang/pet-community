<template>
  <view
    v-if="rendered"
    class="tip-toast-root"
    :class="{ 'tip-toast-root--show': visible }"
  >
    <view class="tip-toast-mask" />
    <view
      class="tip-toast"
      :class="[`tip-toast--${type}`, { 'tip-toast--show': visible }]"
    >
      <image class="tip-toast__icon" :src="iconSrc" mode="aspectFit" />
      <text class="tip-toast__text">{{ message }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";

export type TipToastType = "success" | "warning" | "error";

const props = withDefaults(
  defineProps<{
    visible: boolean;
    message: string;
    type?: TipToastType;
  }>(),
  {
    type: "success",
  },
);

const ICON_MAP: Record<TipToastType, string> = {
  success: "/static/images/tips/success.png",
  warning: "/static/images/tips/warning.png",
  error: "/static/images/tips/err.png",
};

const rendered = ref(false);

watch(
  () => props.visible,
  (show) => {
    if (show) rendered.value = true;
    else {
      setTimeout(() => {
        rendered.value = false;
      }, 220);
    }
  },
  { immediate: true },
);

const iconSrc = computed(() => ICON_MAP[props.type]);
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";

.tip-toast-root {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.tip-toast-mask {
  position: absolute;
  inset: 0;
  background: rgba(61, 47, 47, 0.12);
  opacity: 0;
  transition: opacity 0.2s ease;
}

.tip-toast-root--show .tip-toast-mask {
  opacity: 1;
}

.tip-toast {
  position: absolute;
  top: calc(env(safe-area-inset-top) + 176rpx);
  left: 50%;
  width: calc(100% - 64rpx);
  max-width: 640rpx;
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 28rpx 32rpx;
  border-radius: 999rpx;
  box-shadow: 0 12rpx 40rpx rgba(107, 78, 61, 0.14);
  opacity: 0;
  transform: translateX(-50%) translateY(-20rpx);
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;

  &--show {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }

  &--success {
    background: #dff5df;
    border: 2rpx solid rgba(155, 207, 155, 0.65);
  }

  &--warning {
    background: #ffefd9;
    border: 2rpx solid rgba(255, 179, 107, 0.55);
  }

  &--error {
    background: #ffe4e4;
    border: 2rpx solid rgba(226, 109, 109, 0.55);
  }
}

.tip-toast__icon {
  width: 44rpx;
  height: 44rpx;
  flex-shrink: 0;
}

.tip-toast__text {
  flex: 1;
  font-size: 28rpx;
  font-weight: 600;
  line-height: 1.5;
}

.tip-toast--success .tip-toast__text {
  color: #3d2f2f;
}

.tip-toast--warning .tip-toast__text {
  color: #d97b2b;
}

.tip-toast--error .tip-toast__text {
  color: #d95555;
}
</style>
