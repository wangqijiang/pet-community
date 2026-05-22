<template>
  <view class="textarea-wrapper" :class="{ 'textarea-error': error, 'textarea-disabled': disabled }">
    <view v-if="label" class="textarea-label">
      <text class="label-text">{{ label }}</text>
      <text v-if="required" class="label-required">*</text>
    </view>

    <view class="textarea-container" :class="{ 'textarea-focused': focused }">
      <textarea
        class="textarea-field"
        :value="modelValue"
        :placeholder="placeholder"
        :placeholder-style="placeholderStyle"
        :disabled="disabled"
        :maxlength="maxlength"
        :focus="autoFocus"
        :auto-height="autoHeight"
        :fixed="fixed"
        :cursor-spacing="cursorSpacing"
        :show-confirm-bar="showConfirmBar"
        :cursor="cursor"
        :selection-start="selectionStart"
        :selection-end="selectionEnd"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @confirm="handleConfirm"
      />
    </view>

    <view v-if="error" class="textarea-error-text">{{ error }}</view>
    <view v-else-if="hint" class="textarea-hint-text">{{ hint }}</view>

    <view v-if="showWordCount && maxlength > 0" class="textarea-word-count">
      <text class="count-text" :class="{ 'count-warning': modelValue.length >= maxlength * 0.8 }">
        {{ modelValue.length }}/{{ maxlength }}
      </text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  modelValue?: string
  label?: string
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  maxlength?: number
  autoHeight?: boolean
  fixed?: boolean
  autoFocus?: boolean
  showConfirmBar?: boolean
  cursor?: number
  selectionStart?: number
  selectionEnd?: number
  cursorSpacing?: number
  showWordCount?: boolean
  required?: boolean
  error?: string
  hint?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  label: '',
  placeholder: '请输入内容',
  disabled: false,
  readonly: false,
  maxlength: 500,
  autoHeight: true,
  fixed: false,
  autoFocus: false,
  showConfirmBar: true,
  cursor: -1,
  selectionStart: 0,
  selectionEnd: 0,
  cursorSpacing: 0,
  showWordCount: true,
  required: false,
  error: '',
  hint: '',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'focus': [event: any]
  'blur': [event: any]
  'confirm': [value: string]
}>()

const focused = ref(false)

const placeholderStyle = computed(() => {
  return 'color: #C0B8B9; font-size: 28rpx;'
})

const handleInput = (e: any) => {
  emit('update:modelValue', e.detail.value)
}

const handleFocus = (e: any) => {
  focused.value = true
  emit('focus', e)
}

const handleBlur = (e: any) => {
  focused.value = false
  emit('blur', e)
}

const handleConfirm = (e: any) => {
  emit('confirm', e.detail.value)
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.textarea-wrapper {
  margin-bottom: 32rpx;
}

.textarea-label {
  display: flex;
  align-items: center;
  margin-bottom: 16rpx;
}

.label-text {
  font-size: $font-size-body;
  font-weight: $font-weight-bold;
  color: $color-gray-dark;
}

.label-required {
  color: $color-error;
  margin-left: 8rpx;
  font-weight: bold;
}

.textarea-container {
  background: $color-bg-white;
  border: 2rpx solid rgba(113, 88, 92, 0.1);
  border-radius: $border-radius-medium;
  padding: 28rpx 24rpx;
  transition: all 0.3s ease;
  box-shadow: 0 4rpx 16rpx rgba(168, 155, 157, 0.06);

  &.textarea-focused {
    border-color: $color-primary;
    box-shadow: 0 0 0 6rpx rgba($color-primary, 0.1), 0 4rpx 16rpx rgba(168, 155, 157, 0.06);
  }
}

.textarea-field {
  width: 100%;
  min-height: 200rpx;
  font-size: $font-size-body;
  color: $color-gray-dark;
  line-height: 1.7;
  text-align: left;

  &::placeholder {
    color: $color-gray-light;
  }

  &:disabled {
    color: $color-gray-light;
    background: transparent;
  }
}

.textarea-word-count {
  display: flex;
  justify-content: flex-end;
  margin-top: 12rpx;
}

.count-text {
  font-size: $font-size-helper;
  color: $color-gray-light;
  transition: color 0.3s ease;

  &.count-warning {
    color: $color-warning;
  }
}

.textarea-error-text {
  font-size: $font-size-helper;
  color: $color-error;
  margin-top: 12rpx;
  padding-left: 8rpx;
}

.textarea-hint-text {
  font-size: $font-size-helper;
  color: $color-gray-light;
  margin-top: 12rpx;
  padding-left: 8rpx;
}

.textarea-disabled {
  .textarea-container {
    background: rgba(113, 88, 92, 0.05);
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.textarea-error {
  .textarea-container {
    border-color: $color-error;

    &.textarea-focused {
      box-shadow: 0 0 0 6rpx rgba($color-error, 0.1), 0 4rpx 16rpx rgba(168, 155, 157, 0.06);
    }
  }
}
</style>
