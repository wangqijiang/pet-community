<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'primary' // primary, secondary, outline, text
  },
  size: {
    type: String,
    default: 'medium' // small, medium, large
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  block: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])

const buttonClass = computed(() => [
  `btn-${props.type}`,
  `btn-${props.size}`,
  {
    'btn-disabled': props.disabled || props.loading,
    'btn-block': props.block
  }
])

const handleClick = () => {
  if (props.disabled || props.loading) return
  uni.vibrateShort({ type: 'light' })
  emit('click')
}
</script>

<template>
  <view class="custom-button bouncy-active" :class="buttonClass" @tap="handleClick">
    <text v-if="loading" class="loading-icon">⏳</text>
    <slot v-else></slot>
  </view>
</template>

<style lang="scss" scoped>
.custom-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  font-family: 'Nunito Sans', sans-serif;
  font-weight: 600;
  transition: all 200ms cubic-bezier(0.34, 1.56, 0.64, 1);
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(168, 155, 157, 0.15);
}

.custom-button:active {
  transform: scale(1.05);
}

/* Types */
.btn-primary {
  background: linear-gradient(135deg, #71585c 0%, #5d474b 100%);
  color: #ffffff;
}

.btn-primary:active {
  box-shadow: 0 6px 16px rgba(113, 88, 92, 0.25);
}

.btn-secondary {
  background: #eadfbd;
  color: #6a6347;
  box-shadow: 0 4px 12px rgba(101, 94, 67, 0.12);
}

.btn-outline {
  background-color: transparent;
  border: 2px solid #71585c;
  color: #71585c;
  box-shadow: none;
}

.btn-outline:active {
  background: #ffdde2;
}

.btn-text {
  background-color: transparent;
  color: #71585c;
  box-shadow: none;
}

.btn-text:active {
  background: #f3ecec;
}

/* Sizes */
.btn-small {
  height: 36px;
  padding: 0 16px;
  font-size: 13px;
  border-radius: 10px;
}

.btn-medium {
  height: 44px;
  padding: 0 24px;
  font-size: 14px;
}

.btn-large {
  height: 52px;
  padding: 0 32px;
  font-size: 16px;
  border-radius: 14px;
}

/* States */
.btn-disabled {
  opacity: 0.4;
  cursor: not-allowed;
  box-shadow: none;
}

.btn-disabled:active {
  transform: none;
}

.btn-block {
  width: 100%;
  display: flex;
}

.loading-icon {
  animation: rotate 1s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
