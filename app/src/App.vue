<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
onLaunch(() => {
  console.log("App Launch");
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

page {
  width: 100%;
  height: 100%;
  min-height: 100vh;
  background: $color-bg-primary;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  font-size: $font-size-body;
  color: $color-gray-dark;
  line-height: $line-height-base;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
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