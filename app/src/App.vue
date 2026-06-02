<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
import GlobalOverlays from "@/components/common/GlobalOverlays.vue";
import { isLoggedIn, canAccessApp } from "@/api/auth";
import {
  PENDING_SHARE_ROUTE_KEY,
  resolveSharedPostRoute,
} from "@/utils/postShare";
import { connectRealtime, disconnectRealtime, ensureRealtimeConnected } from "@/utils/realtime";
import { safeReLaunch } from "@/utils/navigation";

onLaunch((options) => {
  const sharedRoute = resolveSharedPostRoute(
    (options?.query as Record<string, string | undefined>) || undefined,
  );

  if (isLoggedIn()) {
    connectRealtime();
  }

  if (sharedRoute && canAccessApp()) {
    safeReLaunch(sharedRoute);
    return;
  }

  if (!canAccessApp()) {
    if (sharedRoute) {
      uni.setStorageSync(PENDING_SHARE_ROUTE_KEY, sharedRoute);
    }
    safeReLaunch("/pages/login/index");
    return;
  }
});

onShow(() => {
  if (isLoggedIn()) {
    ensureRealtimeConnected();
  }
});

onHide(() => {
  disconnectRealtime();
});
</script>

<template>
  <GlobalOverlays />
</template>

<style lang="scss">
@import "./styles/variables.scss";
@import "./styles/layout.scss";

page {
  width: 100%;
  height: 100%;
  background: $color-bg-primary;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC",
    "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
  font-size: $font-size-body;
  color: $color-gray-dark;
  line-height: $line-height-base;
  overflow: hidden;
}

view, text, image, button, input, textarea {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.page-container {
  width: 100%;
  min-height: 100vh;
  background: $color-bg-primary;
  box-sizing: border-box;
}
</style>
