<template>
  <view class="page-layout" :style="pageStyle">
    <view class="page-layout__navbar">
      <slot name="navbar" />
    </view>
    <view v-if="$slots.header" class="page-layout__header">
      <slot name="header" />
    </view>
    <scroll-view
      :scroll-y="true"
      class="page-layout__content"
      :style="contentStyle"
      :refresher-enabled="refresher"
      :refresher-triggered="refresherTriggered"
      @refresherrefresh="$emit('refresh')"
      @scrolltolower="$emit('scrolltolower')"
    >
      <view class="page-layout__inner">
        <slot />
      </view>
    </scroll-view>
    <view v-if="tabBar" class="page-layout__tabbar">
      <slot name="tabbar" />
    </view>
    <slot name="fixed" />
  </view>
</template>

<script setup lang="ts">
import { computed } from "vue";
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

const layoutOptions = computed(() => ({
  tabBar: props.tabBar,
  headerHeight: props.headerHeight,
  footerHeight: props.footerHeight,
}));

const { contentStyle, pageStyle } = useLayout(layoutOptions);
</script>

<style lang="scss" scoped>
@import "@/styles/layout.scss";
</style>
