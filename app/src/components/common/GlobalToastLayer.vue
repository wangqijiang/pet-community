<template>
  <!-- 独立 Toast 层：与 BottomSheet 同级分离，避免被父级 z-index 压住 -->
  <view class="global-toast-layer">
    <Toast
      :visible="toast.visible"
      :type="toast.type"
      :message="toast.message"
    />
  </view>
</template>

<script setup lang="ts">
import Toast from "@/components/common/Toast.vue";
import { useToastState } from "@/composables/useOverlay";

const toast = useToastState();
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";

.global-toast-layer {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: $z-index-toast;
  pointer-events: none;
}
</style>
