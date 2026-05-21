<template>
  <view class="input-wrapper" :class="{ 'input-error': error, 'input-disabled': disabled }">
    <view v-if="label" class="input-label">
      <text class="label-text">{{ label }}</text>
      <text v-if="required" class="label-required">*</text>
    </view>

    <view class="input-container" :class="{ 'input-focused': focused }">
      <view v-if="prefixIcon" class="input-prefix">
        <view :class="['prefix-icon', prefixIcon]"></view>
      </view>

      <input
        class="input-field"
        :type="inputType"
        :value="modelValue"
        :placeholder="placeholder"
        :placeholder-style="placeholderStyle"
        :disabled="disabled"
        :maxlength="maxlength"
        :focus="autoFocus"
        :confirm-type="confirmType"
        :cursor-spacing="cursorSpacing"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @confirm="handleConfirm"
      />

      <view v-if="clearable && modelValue" class="input-clear" @click="handleClear">
        <view class="clear-icon"></view>
      </view>

      <view v-if="suffixText" class="input-suffix">
        <text class="suffix-text">{{ suffixText }}</text>
      </view>

      <view v-if="suffixIcon" class="input-suffix">
        <view :class="['suffix-icon', suffixIcon]"></view>
      </view>
    </view>

    <view v-if="error" class="input-error-text">{{ error }}</view>
    <view v-else-if="hint" class="input-hint-text">{{ hint }}</view>

    <view v-if="showWordCount && maxlength > 0" class="input-word-count">
      <text class="count-text">{{ modelValue.length }}/{{ maxlength }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  modelValue?: string | number
  type?: 'text' | 'number' | 'idcard' | 'digit' | 'password'
  label?: string
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  maxlength?: number
  clearable?: boolean
  password?: boolean
  prefixIcon?: string
  suffixIcon?: string
  suffixText?: string
  required?: boolean
  error?: string
  hint?: string
  autoFocus?: boolean
  confirmType?: 'done' | 'search' | 'next' | 'go' | 'send'
  cursorSpacing?: number
  showWordCount?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  type: 'text',
  label: '',
  placeholder: '请输入',
  disabled: false,
  readonly: false,
  maxlength: -1,
  clearable: false,
  password: false,
  prefixIcon: '',
  suffixIcon: '',
  suffixText: '',
  required: false,
  error: '',
  hint: '',
  autoFocus: false,
  confirmType: 'done',
  cursorSpacing: 0,
  showWordCount: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'focus': [event: any]
  'blur': [event: any]
  'confirm': [value: string]
  'clear': []
}>()

const focused = ref(false)

const inputType = computed(() => {
  if (props.type === 'password' || props.password) return 'password'
  return props.type
})

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

const handleClear = () => {
  emit('update:modelValue', '')
  emit('clear')
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.input-wrapper {
  margin-bottom: 32rpx;
}

.input-label {
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
  margin-left: 4rpx;
}

.input-container {
  display: flex;
  align-items: center;
  background: $color-bg-white;
  border: 2rpx solid rgba(113, 88, 92, 0.15);
  border-radius: $border-radius-medium;
  padding: 24rpx;
  transition: all 0.3s ease;

  &.input-focused {
    border-color: $color-primary;
    box-shadow: 0 0 0 4rpx rgba($color-primary, 0.1);
  }
}

.input-prefix,
.input-suffix {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.prefix-icon {
  width: 40rpx;
  height: 40rpx;
  margin-right: 16rpx;
}

.suffix-text {
  font-size: $font-size-body;
  color: $color-gray-medium;
  margin-left: 8rpx;
}

.suffix-icon {
  width: 40rpx;
  height: 40rpx;
  margin-left: 16rpx;
}

.input-field {
  flex: 1;
  font-size: $font-size-body;
  color: $color-gray-dark;
  min-height: 40rpx;

  &::placeholder {
    color: $color-gray-light;
  }

  &:disabled {
    color: $color-gray-light;
    background: transparent;
  }
}

.input-clear {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40rpx;
  height: 40rpx;
  margin-left: 8rpx;
  flex-shrink: 0;
}

.clear-icon {
  width: 32rpx;
  height: 32rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23C0B8B9'%3E%3Cpath d='M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;
  transition: all 0.2s ease;

  &:active {
    transform: scale(1.1);
    opacity: 0.7;
  }
}

.input-error-text {
  font-size: $font-size-helper;
  color: $color-error;
  margin-top: 12rpx;
  padding-left: 8rpx;
}

.input-hint-text {
  font-size: $font-size-helper;
  color: $color-gray-light;
  margin-top: 12rpx;
  padding-left: 8rpx;
}

.input-word-count {
  display: flex;
  justify-content: flex-end;
  margin-top: 8rpx;
}

.count-text {
  font-size: $font-size-helper;
  color: $color-gray-light;
}

.input-disabled {
  .input-container {
    background: rgba(113, 88, 92, 0.05);
    opacity: 0.6;
  }
}

.input-error {
  .input-container {
    border-color: $color-error;

    &.input-focused {
      box-shadow: 0 0 0 4rpx rgba($color-error, 0.1);
    }
  }
}
</style>
