<template>
  <view
    v-if="urls.length > 0"
    class="post-images"
    :class="'post-images--' + displayCount"
  >
    <template v-if="urls.length === 1">
      <image
        class="post-images__single"
        :src="urls[0]"
        mode="widthFix"
        @tap.stop="onPreview(0)"
      />
    </template>
    <template v-else>
      <image
        v-for="(url, index) in displayUrls"
        :key="index"
        class="post-images__cell"
        :src="url"
        mode="aspectFill"
        @tap.stop="onPreview(index)"
      />
      <view
        v-if="urls.length > 9"
        class="post-images__more"
        @tap.stop="onPreview(8)"
      >
        <text>+{{ urls.length - 9 }}</text>
      </view>
    </template>
  </view>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  images: string[];
}>();

const urls = computed(() => props.images.filter(Boolean));

const displayCount = computed(() =>
  Math.min(urls.value.length, 9),
);

const displayUrls = computed(() => urls.value.slice(0, 9));

const onPreview = (index: number) => {
  uni.previewImage({
    urls: urls.value,
    current: index,
  });
};
</script>

<style lang="scss" scoped>
@import "@/styles/feed.scss";

.post-images__more {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 200rpx;
  height: 200rpx;
  background: rgba(0, 0, 0, 0.45);
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 36rpx;
  font-weight: 600;
}
</style>
