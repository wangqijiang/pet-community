<template>
  <view class="tabbar">
    <view class="tabbar-content">
      <view
        v-for="(item, index) in tabs"
        :key="index"
        class="tab-item"
        :class="{ active: currentIndex === index }"
        @click="handleTabClick(index)"
      >
        <view class="tab-icon">
          <image
            class="tab-icon-img"
            :src="currentIndex === index ? item.iconActive : item.icon"
            mode="aspectFit"
          />
          <view class="badge" v-if="index === 2 && messageBadge > 0">{{
            messageBadge
          }}</view>
        </view>
        <view class="tab-text">{{ item.text }}</view>
      </view>
    </view>
    <view class="tabbar-safe"></view>
  </view>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from "vue";
import { isLoggedIn } from "@/api/auth";
import {
  TAB_BAR_BADGE_COUNT,
  scheduleTabBarBadgeRefresh,
} from "@/utils/tabBarBadge";
import { safeReLaunch } from "@/utils/navigation";

const props = defineProps<{
  current: number;
}>();

const currentIndex = ref(0);
const messageBadge = ref(0);

const tabs = [
  {
    text: "首页",
    icon: "/static/tabbar/home.png",
    iconActive: "/static/tabbar/home-active.png",
    url: "/pages/home/index",
  },
  {
    text: "萌宠圈",
    icon: "/static/tabbar/circle.png",
    iconActive: "/static/tabbar/circle-active.png",
    url: "/pages/circle/index",
  },
  {
    text: "消息",
    icon: "/static/tabbar/message.png",
    iconActive: "/static/tabbar/message-active.png",
    url: "/pages/message/index",
  },
  {
    text: "我的",
    icon: "/static/tabbar/mine.png",
    iconActive: "/static/tabbar/mine-active.png",
    url: "/pages/mine/index",
  },
];

watch(
  () => props.current,
  (val) => {
    currentIndex.value = val;
  },
);

const onBadgeCount = (count: number) => {
  messageBadge.value = count;
};

onMounted(() => {
  currentIndex.value = props.current;
  if (!isLoggedIn()) {
    messageBadge.value = 0;
  } else {
    scheduleTabBarBadgeRefresh(1500);
  }
  uni.$on(TAB_BAR_BADGE_COUNT, onBadgeCount);
});

onUnmounted(() => {
  uni.$off(TAB_BAR_BADGE_COUNT, onBadgeCount);
});

const handleTabClick = (index: number) => {
  if (currentIndex.value === index) return;
  uni.vibrateShort({ type: "light" });
  currentIndex.value = index;
  safeReLaunch(tabs[index].url);
};
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";

.tabbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: $z-index-tab;
  background: rgba(255, 255, 255, 1);
  backdrop-filter: blur(24px);
  border-radius: 28px 28px 0 0;
  border-top: 1px solid rgba(0, 0, 0, 0.03);
  box-shadow: 0 -4px 20px rgba(107, 78, 61, 0.04);
}

.tabbar-safe {
  height: env(safe-area-inset-bottom);
  background: rgba(255, 255, 255, 0.88);
}

.tabbar-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 120rpx;
}

.tab-item {
  display: flex;
  flex: 1;
  width: 25%;
  height: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 8rpx 0;
  gap: 8rpx;
  color: #8a7f7f;
  font-size: 22rpx;
  font-weight: 500;
  transition: all 0.2s ease;

  &.active {
    color: #ffb36b;
  }
}

.tab-icon {
  position: relative;
  width: 44rpx;
  height: 44rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tab-icon-img {
  width: 44rpx;
  height: 44rpx;
}

.badge {
  position: absolute;
  top: -8rpx;
  right: -8rpx;
  min-width: 32rpx;
  height: 32rpx;
  padding: 0 8rpx;
  background: $color-error;
  border-radius: 16rpx;
  font-size: 20rpx;
  color: $color-bg-white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tab-text {
  font-size: 22rpx;
  transition: color 0.2s ease;
}
</style>
