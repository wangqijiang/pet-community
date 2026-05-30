<template>
  <view v-if="displayPets.length" class="post-protagonist" @click.stop>
    <view class="post-protagonist__head">
      <text class="post-protagonist__label">🐾 主角宠物</text>
    </view>
    <scroll-view scroll-x class="post-protagonist__scroll" :show-scrollbar="false">
      <view class="post-protagonist__list">
        <view
          v-for="pet in displayPets"
          :key="pet.id"
          class="post-protagonist__item"
          @click.stop="goPetProfile(pet.id)"
        >
          <view class="post-protagonist__avatar-wrap">
            <image
              v-if="resolveAvatar(pet)"
              class="post-protagonist__avatar"
              :src="resolveAvatar(pet)"
              mode="aspectFill"
            />
            <view v-else class="post-protagonist__avatar post-protagonist__avatar--placeholder">
              <text>{{ (pet.name || "宠").slice(0, 1) }}</text>
            </view>
          </view>
          <text class="post-protagonist__name">{{ pet.name }}</text>
          <text v-if="typeLabel(pet.type)" class="post-protagonist__type">{{ typeLabel(pet.type) }}</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { PostPet } from "@/api/post";
import { resolveMediaUrl } from "@/utils/media";

const props = defineProps<{
  pets?: PostPet[];
}>();

const displayPets = computed(() => props.pets || []);

const resolveAvatar = (pet: PostPet) => {
  const src = pet.avatar?.trim();
  return src ? resolveMediaUrl(src) : "";
};

const typeLabel = (type?: string) => {
  if (type === "dog") return "狗狗";
  if (type === "cat") return "猫咪";
  return type || "";
};

const goPetProfile = (petId: number) => {
  uni.vibrateShort({ type: "light" });
  uni.navigateTo({ url: `/pages/mine/petProfile?id=${petId}` });
};
</script>

<style lang="scss" scoped>
.post-protagonist {
  margin-bottom: 24rpx;
  padding: 20rpx 0 8rpx;
  border-top: 2rpx solid #f4ece7;
}

.post-protagonist__head {
  padding: 0 4rpx 16rpx;
}

.post-protagonist__label {
  font-size: 24rpx;
  font-weight: 700;
  color: #8b6d73;
}

.post-protagonist__scroll {
  width: 100%;
  white-space: nowrap;
}

.post-protagonist__list {
  display: inline-flex;
  gap: 20rpx;
  padding-bottom: 4rpx;
}

.post-protagonist__item {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  width: 120rpx;
  flex-shrink: 0;
}

.post-protagonist__avatar-wrap {
  margin-bottom: 10rpx;
}

.post-protagonist__avatar {
  width: 88rpx;
  height: 88rpx;
  border-radius: 32rpx;
  background: #f0e8e8;
  border: 3rpx solid #ffe8f0;
  box-sizing: border-box;

  &--placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32rpx;
    font-weight: 700;
    color: #8b6d73;
  }
}

.post-protagonist__name {
  font-size: 24rpx;
  font-weight: 700;
  color: #3d2f2f;
  max-width: 120rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
}

.post-protagonist__type {
  margin-top: 4rpx;
  font-size: 20rpx;
  color: #b0a6a6;
  text-align: center;
}
</style>
