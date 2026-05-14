<script setup>
import { ref, computed } from 'vue'

const selected = ref(0)

const tabList = ref([
  {
    pagePath: '/pages/home/index',
    text: 'Home',
    iconPath: 'map',
    selectedIconPath: 'map'
  },
  {
    pagePath: '/pages/circle/index',
    text: 'Circle',
    iconPath: 'pets',
    selectedIconPath: 'pets'
  },
  {
    pagePath: '/pages/message/index',
    text: 'Messages',
    iconPath: 'chat_bubble',
    selectedIconPath: 'chat_bubble'
  },
  {
    pagePath: '/pages/profile/index',
    text: 'Me',
    iconPath: 'person',
    selectedIconPath: 'person'
  }
])

const switchTab = (index) => {
  const item = tabList.value[index]
  uni.switchTab({
    url: item.pagePath,
    success: () => {
      selected.value = index
    }
  })
}

// 监听页面切换，更新选中状态
uni.$on('updateTabBar', (index) => {
  selected.value = index
})
</script>

<template>
  <view class="custom-tab-bar">
    <view
      v-for="(item, index) in tabList"
      :key="index"
      class="tab-item"
      :class="{ active: selected === index }"
      @tap="switchTab(index)"
    >
      <view class="tab-icon-wrapper">
        <text
          class="material-symbols-outlined tab-icon"
          :class="{ 'active-icon': selected === index }"
        >
          {{ selected === index ? item.selectedIconPath : item.iconPath }}
        </text>
      </view>
      <text class="tab-text">{{ item.text }}</text>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.custom-tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  z-index: 9999;
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 144rpx;
  padding: 0 32rpx;
  padding-bottom: env(safe-area-inset-bottom);
  background-color: rgba(255, 248, 247, 0.9);
  backdrop-filter: blur(24rpx);
  -webkit-backdrop-filter: blur(24rpx);
  border-top: 2rpx solid rgba(252, 221, 226, 0.3);
  box-shadow: 0 -8rpx 24rpx rgba(168, 155, 157, 0.12);
  border-top-left-radius: 24rpx;
  border-top-right-radius: 24rpx;
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  color: rgba(79, 68, 70, 0.7);
  padding: 8rpx 0;

  &.active {
    color: #71585c;
    transform: scale(1.1);

    &::after {
      content: '❤';
      position: absolute;
      top: -8rpx;
      font-size: 16rpx;
      animation: bounce 2s ease-in-out infinite;
    }
  }

  &:active {
    transform: scale(0.95);
  }
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4rpx);
  }
}

.tab-icon-wrapper {
  position: relative;
  margin-bottom: 4rpx;
}

.tab-icon {
  font-size: 48rpx;
  transition: all 0.3s ease;
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

.active-icon {
  font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

.tab-text {
  font-size: 24rpx;
  line-height: 32rpx;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  transition: color 0.3s ease;
}
</style>
