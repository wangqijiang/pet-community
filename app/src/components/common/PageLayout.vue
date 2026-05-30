<template>
  <view class="page-layout" :style="pageStyle">
    <view class="page-layout__navbar">
      <slot name="navbar" />
    </view>
    <view v-if="$slots.header" class="page-layout__header">
      <slot name="header" />
    </view>
    <scroll-view
      scroll-y
      class="page-layout__content"
      :style="contentStyle"
      :refresher-enabled="refresher"
      :refresher-triggered="refresherTriggered"
      @refresherrefresh="$emit('refresh')"
      @scrolltolower="$emit('scrolltolower')"
    >
      <slot />
    </scroll-view>
    <view v-if="tabBar" class="page-layout__tabbar">
      <slot name="tabbar" />
    </view>
    <slot name="fixed" />
  </view>
</template>

<script setup lang="ts">
import { useLayout } from "@/composables/useLayout";

const props = withDefaults(
  defineProps<{
    tabBar?: boolean;
    headerHeight?: number;
    footerHeight?: number;
    refresher?: boolean;
    refresherTriggered?: boolean;
  }>(),
  {
    tabBar: false,
    headerHeight: 0,
    footerHeight: 0,
    refresher: false,
    refresherTriggered: false,
  },
);

defineEmits<{
  refresh: [];
  scrolltolower: [];
}>();

const { contentStyle, pageStyle } = useLayout({
  tabBar: props.tabBar,
  headerHeight: props.headerHeight,
  footerHeight: props.footerHeight,
});
</script>

<style lang="scss" scoped>
@import "@/styles/layout.scss";
</style>
