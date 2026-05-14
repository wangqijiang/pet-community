<script setup>
import { ref } from 'vue'

const props = defineProps({
  value: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  prefixIcon: {
    type: String,
    default: ''
  },
  suffixIcon: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  maxlength: {
    type: Number,
    default: 140
  },
  error: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['input', 'focus', 'blur', 'suffix-click'])

const isFocused = ref(false)

const handleInput = (e) => {
  emit('input', e.detail.value)
}

const handleFocus = () => {
  isFocused.value = true
  emit('focus')
}

const handleBlur = () => {
  isFocused.value = false
  emit('blur')
}

const handleSuffixClick = () => {
  emit('suffix-click')
}
</script>

<template>
  <view class="custom-input" :class="{ 'input-focused': isFocused, 'input-error': error }">
    <text v-if="label" class="input-label">{{ label }}</text>
    <view class="input-wrapper">
      <text v-if="prefixIcon" class="input-icon prefix-icon">{{ prefixIcon }}</text>
      <input
        class="input-field"
        :type="type"
        :value="value"
        :placeholder="placeholder"
        :disabled="disabled"
        :maxlength="maxlength"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
      />
      <text v-if="suffixIcon" class="input-icon suffix-icon" @tap="handleSuffixClick">{{ suffixIcon }}</text>
    </view>
    <text v-if="error" class="input-error-text">{{ error }}</text>
  </view>
</template>

<style lang="scss" scoped>
.custom-input {
  margin-bottom: 8px;
}

.input-label {
  display: block;
  font-size: 14px;
  color: #1e1b1b;
  margin-bottom: 8px;
  font-weight: 600;
}

.input-wrapper {
  display: flex;
  align-items: center;
  background-color: #f9f2f2;
  border: 1px solid #d2c3c4;
  border-radius: 12px;
  padding: 0 16px;
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(168, 155, 157, 0.06);
}

.input-focused .input-wrapper {
  border-color: #71585c;
  background-color: #eadfbd;
  box-shadow: 0 4px 12px rgba(113, 88, 92, 0.12);
}

.input-error .input-wrapper {
  border-color: #ba1a1a;
  background-color: #ffdad6;
}

.input-field {
  flex: 1;
  height: 48px;
  font-size: 14px;
  color: #1e1b1b;
  background-color: transparent;
  border: none;
}

.input-field::placeholder {
  color: #4f4446;
  opacity: 0.6;
}

.input-icon {
  font-size: 20px;
  color: #4f4446;
  transition: color 200ms cubic-bezier(0.4, 0, 0.2, 1);
}

.input-focused .input-icon {
  color: #71585c;
}

.prefix-icon {
  margin-right: 8px;
}

.suffix-icon {
  margin-left: 8px;
  cursor: pointer;
}

.suffix-icon:active {
  transform: scale(0.9);
}

.input-error-text {
  display: block;
  font-size: 12px;
  color: #ba1a1a;
  margin-top: 6px;
  font-weight: 500;
}
</style>
