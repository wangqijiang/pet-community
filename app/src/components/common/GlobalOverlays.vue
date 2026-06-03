<template>
  <Dialog
    :visible="dialog.visible"
    :type="dialog.type"
    :title="dialog.title"
    :content="dialog.content"
    :confirm-text="dialog.confirmText"
    :cancel-text="dialog.cancelText"
    :show-cancel="dialog.showCancel"
    @confirm="resolveDialogOverlay(true)"
    @cancel="resolveDialogOverlay(false)"
    @close="resolveDialogOverlay(false)"
  />

  <BottomSheet
    :visible="sheet.visible"
    :title="sheet.title"
    @update:visible="onSheetVisibleChange"
    @close="cancelActionSheetOverlay"
  >
    <view class="sheet-options">
      <view
        v-for="(item, index) in sheet.items"
        :key="`${item}-${index}`"
        class="sheet-option"
        @tap="resolveActionSheetOverlay(index)"
      >
        <text>{{ item }}</text>
      </view>
    </view>
  </BottomSheet>
</template>

<script setup lang="ts">
import Dialog from "@/components/common/Dialog.vue";
import BottomSheet from "@/components/common/BottomSheet.vue";
import {
  useDialogState,
  useActionSheetState,
  resolveDialogOverlay,
  resolveActionSheetOverlay,
  cancelActionSheetOverlay,
} from "@/composables/useOverlay";

const dialog = useDialogState();
const sheet = useActionSheetState();

const onSheetVisibleChange = (visible: boolean) => {
  if (!visible) cancelActionSheetOverlay();
};
</script>

<style lang="scss" scoped>
.sheet-options {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.sheet-option {
  padding: 28rpx 32rpx;
  background: #fff7f1;
  border-radius: 24rpx;
  text-align: center;
  font-size: 30rpx;
  color: #3d2f2f;

  &:active {
    transform: scale(0.98);
    background: #ffe2c2;
  }
}
</style>
