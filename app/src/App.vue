<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
import { isLoggedIn } from "@/api/auth";
import {
  resolveAppLaunchRedirect,
  resolveAppResumeRedirect,
} from "@/utils/appLaunch";
import { connectRealtime, disconnectRealtime, ensureRealtimeConnected } from "@/utils/realtime";
import { safeReLaunch } from "@/utils/navigation";

onLaunch((options) => {
  // 首屏 HTTP 加载完后再连 WebSocket，避免与接口抢同域名连接数
  if (isLoggedIn()) {
    setTimeout(() => connectRealtime(), 1500);
  }

  const target = resolveAppLaunchRedirect(
    (options?.query as Record<string, string | undefined>) || undefined,
  );
  safeReLaunch(target);
});

onShow(() => {
  if (isLoggedIn()) {
    ensureRealtimeConnected();
  }

  const resumeTarget = resolveAppResumeRedirect();
  if (resumeTarget) {
    safeReLaunch(resumeTarget);
  }
});

onHide(() => {
  disconnectRealtime();
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
