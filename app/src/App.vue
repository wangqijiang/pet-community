<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
import { isLoggedIn } from "@/api/auth";
import {
  resolveAppLaunchRedirect,
  resolveAppResumeRedirect,
} from "@/utils/appLaunch";
import { connectRealtime, disconnectRealtime, ensureRealtimeConnected } from "@/utils/realtime";
import { safeReLaunch } from "@/utils/navigation";
import {
  warmupNetwork,
  onAppHide,
  onAppShow,
} from "@/utils/networkWarmup";

onLaunch((options) => {
  void warmupNetwork(true).then(() => {
    if (isLoggedIn()) {
      setTimeout(() => connectRealtime(), 1200);
    }
  });

  const target = resolveAppLaunchRedirect(
    (options?.query as Record<string, string | undefined>) || undefined,
  );
  safeReLaunch(target);
});

onShow(() => {
  void onAppShow().then(() => {
    if (isLoggedIn()) ensureRealtimeConnected();
  });

  const resumeTarget = resolveAppResumeRedirect();
  if (resumeTarget) {
    safeReLaunch(resumeTarget);
  }
});

onHide(() => {
  onAppHide();
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
  font-family: "Noto Sans SC", -apple-system, BlinkMacSystemFont, "Segoe UI",
    "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
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
