<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
import { isLoggedIn } from "@/api/auth";
import {
  PENDING_SHARE_ROUTE_KEY,
  resolveSharedPostRoute,
} from "@/utils/postShare";

onLaunch((options) => {
  const sharedRoute = resolveSharedPostRoute(
    (options?.query as Record<string, string | undefined>) || undefined,
  );

  if (sharedRoute) {
    if (isLoggedIn()) {
      uni.reLaunch({ url: sharedRoute });
      return;
    }
    uni.setStorageSync(PENDING_SHARE_ROUTE_KEY, sharedRoute);
  }

  const pages = getCurrentPages();
  const route = pages.length ? (pages[0] as { route?: string }).route : "";
  if (!isLoggedIn() && route && !route.includes("login")) {
    uni.reLaunch({ url: "/pages/login/index" });
  }
});
onShow(() => {
  console.log("App Show");
});
onHide(() => {
  console.log("App Hide");
});
</script>
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
