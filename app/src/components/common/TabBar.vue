<template>
  <view class="tab-bar">
    <view
      v-for="(item, index) in tabs"
      :key="index"
      class="tab-item"
      :class="{ 'tab-pressed': pressedIndex === index }"
      @touchstart="handleTabPress(index)"
      @touchend="handleTabRelease"
      @tap="handleTabClick(index)"
    >
      <image
        class="tab-icon"
        :src="current === index ? item.selectedIcon : item.icon"
        mode="aspectFit"
      ></image>
      <text
        class="tab-text"
        :class="{ 'tab-text-active': current === index }"
      >{{ item.text }}</text>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  current: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['change'])

const pressedIndex = ref(-1)

const tabs = [
  {
    text: '首页',
    icon: '/static/images/tab-home.png',
    selectedIcon: '/static/images/tab-home-active.png',
    path: '/pages/home/index'
  },
  {
    text: '萌宠圈',
    icon: '/static/images/tab-circle.png',
    selectedIcon: '/static/images/tab-circle-active.png',
    path: '/pages/circle/index'
  },
  {
    text: '消息',
    icon: '/static/images/tab-message.png',
    selectedIcon: '/static/images/tab-message-active.png',
    path: '/pages/message/index'
  },
  {
    text: '我的',
    icon: '/static/images/tab-mine.png',
    selectedIcon: '/static/images/tab-mine-active.png',
    path: '/pages/mine/index'
  }
]

const handleTabPress = (index) => {
  pressedIndex.value = index
  uni.vibrateShort({ type: 'light' })
}

const handleTabRelease = () => {
  pressedIndex.value = -1
}

const handleTabClick = (index) => {
  if (index === props.current) return

  emit('change', index)

  uni.switchTab({
    url: tabs[index].path,
    success: () => {
      uni.vibrateShort({ type: 'medium' })
    }
  })
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: $tab-bar-height;
  background: $color-bg-white;
  display: flex;
  align-items: center;
  justify-content: space-around;
  box-shadow: 0 -4rpx 16rpx rgba(0, 0, 0, 0.06);
  z-index: $z-index-tab;
  padding-bottom: env(safe-area-inset-bottom);

  .tab-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8rpx;
    transition: transform $transition-base ease;

    &.tab-pressed {
      transform: scale($scale-press);
    }

    .tab-icon {
      width: $icon-size-large;
      height: $icon-size-large;
    }

    .tab-text {
      font-size: $font-size-helper;
      color: $color-gray-medium;
      transition: color $transition-base ease;

      &.tab-text-active {
        color: $color-primary;
        font-weight: $font-weight-bold;
      }
    }
  }
}
</style>
