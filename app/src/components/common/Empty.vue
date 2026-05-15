<template>
  <view class="empty-container">
    <image class="empty-image" :src="imageSrc" mode="aspectFit"></image>
    <text class="empty-text">{{ text }}</text>
    <view
      v-if="showButton"
      class="empty-button"
      :class="{ 'button-pressed': buttonPressed }"
      @touchstart="handleButtonPress"
      @touchend="handleButtonRelease"
      @tap="handleButtonClick"
    >
      <text class="button-text">{{ buttonText }}</text>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'default', // default, noData, noNetwork, noResult
    validator: (value) => ['default', 'noData', 'noNetwork', 'noResult'].includes(value)
  },
  text: {
    type: String,
    default: ''
  },
  showButton: {
    type: Boolean,
    default: false
  },
  buttonText: {
    type: String,
    default: '重新加载'
  }
})

const emit = defineEmits(['buttonClick'])

const buttonPressed = ref(false)

const imageSrc = computed(() => {
  const imageMap = {
    default: '/static/images/empty-default.png',
    noData: '/static/images/empty-nodata.png',
    noNetwork: '/static/images/empty-network.png',
    noResult: '/static/images/empty-result.png'
  }
  return imageMap[props.type] || imageMap.default
})

const handleButtonPress = () => {
  buttonPressed.value = true
  uni.vibrateShort({ type: 'light' })
}

const handleButtonRelease = () => {
  buttonPressed.value = false
}

const handleButtonClick = () => {
  uni.vibrateShort({ type: 'medium' })
  emit('buttonClick')
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.empty-container {
  width: 100%;
  padding: 120rpx 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-component;

  .empty-image {
    width: 320rpx;
    height: 320rpx;
    opacity: 0.6;
  }

  .empty-text {
    font-size: $font-size-body;
    color: $color-gray-lighter;
    text-align: center;
  }

  .empty-button {
    margin-top: $spacing-component;
    padding: 0 48rpx;
    height: $button-height-medium;
    background: linear-gradient(135deg, $color-primary 0%, #FFD4F0 100%);
    border-radius: $border-radius-base;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: $shadow-pink;
    transition: transform $transition-base ease;

    &.button-pressed {
      transform: scale($scale-press);
    }

    .button-text {
      font-size: $font-size-button;
      font-weight: $font-weight-bold;
      color: $color-bg-white;
    }
  }
}
</style>
