<template>
  <PageLayout :footer-height="footerHeight">
    <template #navbar>
      <TopNavBar :title="navTitle" :showBack="true" rightIcon="icon-bell" />
    </template>

    <view class="publish-content">
      <view class="text-area">
        <textarea
          v-model="content"
          class="content-input"
          placeholder="记录自家小可爱的日常吧～🐶"
          placeholder-class="input-placeholder"
          :maxlength="500"
        />
        <view class="text-count">{{ content.length }}/500</view>
      </view>

      <view class="image-section">
        <view class="image-grid">
          <view v-for="(img, index) in images" :key="index" class="image-item">
            <image class="image-preview" :src="img" mode="aspectFill" />
            <view class="image-delete" @click="deleteImage(index)">
              <view class="delete-icon"></view>
            </view>
          </view>
          <view
            class="upload-btn"
            v-if="images.length < 9"
            @click="chooseImage"
          >
            <view class="upload-icon"></view>
            <text class="upload-count">{{ images.length }}/9</text>
          </view>
        </view>
      </view>

      <view class="pet-section">
        <view class="section-header">
          <view class="section-icon pet-icon"></view>
          <view class="section-title-wrap">
            <text class="section-title">主角宠物</text>
            <text class="section-sub">可多选，标记这条动态的主角是谁</text>
          </view>
        </view>

        <scroll-view v-if="pets.length" scroll-x class="pet-scroll" :show-scrollbar="false">
          <view class="pet-list">
            <view
              v-for="pet in pets"
              :key="pet.id"
              class="pet-item"
              :class="{ active: isPetSelected(pet.id) }"
              @click="togglePet(pet.id)"
            >
              <view class="pet-avatar-wrap">
                <image
                  v-if="getPetAvatar(pet)"
                  class="pet-avatar"
                  :src="getPetAvatar(pet)"
                  mode="aspectFill"
                />
                <view v-else class="pet-avatar pet-avatar-placeholder">
                  <text>{{ pet.name.slice(0, 1) }}</text>
                </view>
                <view v-if="isPetSelected(pet.id)" class="pet-check">
                  <text>✓</text>
                </view>
              </view>
              <text class="pet-name">{{ pet.name }}</text>
              <text class="pet-meta">{{ formatPetType(pet.type) }}</text>
            </view>
          </view>
        </scroll-view>

        <view v-else class="pet-empty" @click="goAddPet">
          <view class="pet-empty-icon"></view>
          <text class="pet-empty-text">还没有宠物，去添加一只吧</text>
        </view>
      </view>

      <view class="category-section">
        <view class="section-header">
          <view class="section-icon"></view>
          <text class="section-title">选择分类</text>
        </view>
        <view class="category-list">
          <view
            v-for="cat in categories"
            :key="cat.key"
            class="category-item"
            :class="{ active: selectedCategory === cat.key }"
            @click="toggleCategory(cat.key)"
          >
            {{ cat.label }}
          </view>
        </view>
      </view>
    </view>

    <template #fixed>
      <view id="publish-action-bar" class="action-bar">
        <view class="publish-btn" :class="{ active: canPublish }" @click="handlePublish">
          <view class="publish-icon"></view>
          <text class="publish-text">{{ editId ? "保存修改" : "确认发布" }}</text>
        </view>
      </view>
    </template>

    <Loading :visible="loading" />
  </PageLayout>
</template>

<script setup lang="ts">
import { showRequestError, isAuthRequiredError } from "@/utils/request";
import TopNavBar from "@/components/common/TopNavBar.vue";
import PageLayout from "@/components/common/PageLayout.vue";
import Loading from "@/components/common/Loading.vue";
import { ref, computed } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { createPost, updatePost, getPostDetail, getPostCategories, type PostCategory } from "@/api/post";
import { getPetList, type Pet } from "@/api/pet";
import { resolveMediaUrl } from "@/utils/media";
import { useFixedFooterHeight } from "@/composables/useLayout";
import { consumeAiGuidePublishDraft } from "@/utils/aiGuideDraft";
import { promptLogin } from "@/utils/request";

const LAST_PUBLISH_PET_IDS_KEY = "lastPublishPetIds";

const { footerHeight } = useFixedFooterHeight("#publish-action-bar", 24 + 96 + 24);

const content = ref("");
const images = ref<string[]>([]);
const selectedCategory = ref<string | null>(null);
const loading = ref(false);
const editId = ref<number | null>(null);
const pets = ref<Pet[]>([]);
const selectedPetIds = ref<number[]>([]);
const categories = ref<PostCategory[]>([]);

const navTitle = computed(() => (editId.value ? "编辑动态" : "发布萌宠日常"));

const canPublish = computed(() => {
  return content.value.trim().length > 0 || images.value.length > 0;
});

onLoad(async (options) => {
  if (!promptLogin()) return;
  await Promise.all([loadPets(), loadCategories()]);
  if (options?.editId) {
    editId.value = Number(options.editId);
    await loadPostForEdit();
  } else {
    applyDefaultPetSelection();
    if (options?.fromAi === "1") {
      const draft = consumeAiGuidePublishDraft();
      if (draft?.content) {
        content.value = draft.content;
        selectedCategory.value = "share";
      }
    }
  }
});

const loadCategories = async () => {
  try {
    categories.value = await getPostCategories();
  } catch (error) {
    showRequestError(error, "加载分类失败");
  }
};

const toggleCategory = (key: string) => {
  selectedCategory.value = selectedCategory.value === key ? null : key;
};

const loadPets = async () => {
  try {
    pets.value = await getPetList();
  } catch (error) {
    showRequestError(error, "加载宠物失败");
  }
};

const readSavedPetIds = (): number[] => {
  try {
    const saved = uni.getStorageSync(LAST_PUBLISH_PET_IDS_KEY);
    if (Array.isArray(saved)) {
      return saved.map((id) => Number(id)).filter((id) => id > 0);
    }
    if (typeof saved === "string" && saved) {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed)
        ? parsed.map((id) => Number(id)).filter((id) => id > 0)
        : [];
    }
  } catch {
    /* ignore */
  }
  return [];
};

const applyDefaultPetSelection = () => {
  const savedIds = readSavedPetIds();
  const validIds = savedIds.filter((id) => pets.value.some((pet) => pet.id === id));
  if (validIds.length) {
    selectedPetIds.value = validIds;
    return;
  }
  if (pets.value.length === 1) {
    selectedPetIds.value = [pets.value[0].id];
  }
};

const saveLastSelectedPets = () => {
  uni.setStorageSync(LAST_PUBLISH_PET_IDS_KEY, selectedPetIds.value);
};

const formatPetType = (type?: string) => {
  if (type === "dog") return "狗狗";
  if (type === "cat") return "猫咪";
  return type || "宠物";
};

const getPetAvatar = (pet: Pet) => {
  const source = pet.avatar || (Array.isArray(pet.photos) ? pet.photos[0] : "");
  return source ? resolveMediaUrl(source) : "";
};

const isPetSelected = (petId: number) => selectedPetIds.value.includes(petId);

const togglePet = (petId: number) => {
  uni.vibrateShort({ type: "light" });
  if (isPetSelected(petId)) {
    selectedPetIds.value = selectedPetIds.value.filter((id) => id !== petId);
  } else {
    selectedPetIds.value = [...selectedPetIds.value, petId];
  }
};

const goAddPet = () => {
  uni.navigateTo({ url: "/pages/mine/addPet" });
};

const loadPostForEdit = async () => {
  if (!editId.value) return;
  loading.value = true;
  try {
    const post = await getPostDetail(editId.value);
    content.value = post.content || "";
    images.value = (post.images || []).map((url) => resolveMediaUrl(url));
    selectedPetIds.value = (post.pets || []).map((pet) => pet.id);
    if (!selectedPetIds.value.length && post.pet_ids?.length) {
      selectedPetIds.value = [...post.pet_ids];
    }
    selectedCategory.value = post.category || null;
  } catch (error) {
    showRequestError(error, "加载动态失败");
    if (!isAuthRequiredError(error)) {
      setTimeout(() => uni.navigateBack(), 1500);
    }
  } finally {
    loading.value = false;
  }
};

const chooseImage = () => {
  const maxCount = 9 - images.value.length;
  uni.chooseImage({
    count: maxCount,
    sizeType: ["compressed"],
    sourceType: ["album", "camera"],
    success: (res) => {
      images.value = [...images.value, ...res.tempFilePaths];
    },
  });
};

const deleteImage = (index: number) => {
  uni.showModal({
    title: "提示",
    content: "确定要删除这张图片吗？",
    success: (res) => {
      if (res.confirm) {
        images.value.splice(index, 1);
      }
    },
  });
};

const handlePublish = async () => {
  if (!canPublish.value) {
    uni.showToast({
      title: "请填写内容或添加图片",
      icon: "none",
    });
    return;
  }

  loading.value = true;

  try {
    if (editId.value) {
      await updatePost(
        editId.value,
        content.value,
        images.value,
        selectedPetIds.value,
        selectedCategory.value || undefined,
      );
      uni.showToast({
        title: "保存成功",
        icon: "success",
      });
    } else {
      await createPost(
        content.value,
        images.value,
        selectedPetIds.value,
        selectedCategory.value || undefined,
      );
      saveLastSelectedPets();
      uni.showToast({
        title: "发布成功",
        icon: "success",
      });
    }

    if (editId.value) {
      saveLastSelectedPets();
    }

    uni.$emit("refreshPostList");

    setTimeout(() => {
      uni.navigateBack();
    }, 1500);
  } catch (error) {
    showRequestError(error, editId.value ? "保存失败" : "发布失败");
  } finally {
    loading.value = false;
  }
};
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.publish-content {
  padding: 24rpx 32rpx 32rpx;
  box-sizing: border-box;
}

.text-area {
  background: $color-bg-white;
  border-radius: $border-radius-large;
  padding: 32rpx;
  margin-bottom: 32rpx;
  box-shadow: 0 8rpx 32rpx rgba(168, 155, 157, 0.12);
  border: 1rpx solid rgba(113, 88, 92, 0.1);
  position: relative;
}

.content-input {
  width: 100%;
  min-height: 300rpx;
  font-size: $font-size-body;
  color: $color-gray-dark;
  line-height: 1.6;
  background: transparent;
  border: none;
}

.input-placeholder {
  color: $color-gray-medium;
}

.text-count {
  position: absolute;
  right: 32rpx;
  bottom: 32rpx;
  font-size: 24rpx;
  color: $color-gray-light;
}

.image-section {
  margin-bottom: 32rpx;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20rpx;
}

.image-item {
  position: relative;
  aspect-ratio: 1;
}

.image-preview {
  width: 100%;
  height: 100%;
  border-radius: $border-radius-medium;
  box-shadow: 0 8rpx 32rpx rgba(168, 155, 157, 0.12);
  background: #F5F5F5;
}

.image-delete {
  position: absolute;
  top: -12rpx;
  right: -12rpx;
  width: 40rpx;
  height: 40rpx;
  background: #ba1a1a;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

.delete-icon {
  width: 20rpx;
  height: 20rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23FFFFFF'%3E%3Cpath d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;
}

.upload-btn {
  aspect-ratio: 1;
  border: 2rpx dashed #D4C8C9;
  border-radius: $border-radius-medium;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
}

.upload-icon {
  width: 48rpx;
  height: 48rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23C4B5B5'%3E%3Cpath d='M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;
}

.upload-count {
  font-size: 22rpx;
  color: #9B9090;
}

.pet-section,
.category-section {
  background: $color-bg-white;
  border-radius: $border-radius-large;
  padding: 32rpx;
  box-shadow: 0 8rpx 32rpx rgba(168, 155, 157, 0.12);
  border: 1rpx solid rgba(113, 88, 92, 0.1);
}

.pet-section {
  margin-bottom: 32rpx;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 24rpx;
}

.section-icon {
  width: 40rpx;
  height: 40rpx;
  background: linear-gradient(135deg, #FFC1E9, #FFD4F0);
  border-radius: 12rpx;
  flex-shrink: 0;

  &.pet-icon {
    background: linear-gradient(135deg, #FFD4A8, #FFC1E9);
  }
}

.section-title-wrap {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.section-title {
  font-size: $font-size-title;
  font-weight: $font-weight-bold;
  color: $color-gray-dark;
}

.section-sub {
  font-size: 22rpx;
  color: $color-gray-medium;
}

.pet-scroll {
  width: 100%;
  white-space: nowrap;
}

.pet-list {
  display: inline-flex;
  gap: 20rpx;
  padding-bottom: 4rpx;
}

.pet-item {
  width: 168rpx;
  padding: 20rpx 16rpx;
  border-radius: 28rpx;
  background: #F8F5F5;
  border: 2rpx solid transparent;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.2s ease;

  &.active {
    background: linear-gradient(135deg, rgba(255, 182, 193, 0.18), rgba(255, 193, 233, 0.28));
    border-color: rgba(255, 182, 193, 0.85);
    box-shadow: 0 10rpx 24rpx rgba(255, 182, 193, 0.22);
  }
}

.pet-avatar-wrap {
  position: relative;
  margin-bottom: 12rpx;
}

.pet-avatar {
  width: 96rpx;
  height: 96rpx;
  border-radius: 32rpx;
  background: #F0E8E8;
}

.pet-avatar-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36rpx;
  font-weight: 700;
  color: #8B6D73;
}

.pet-check {
  position: absolute;
  right: -8rpx;
  bottom: -8rpx;
  width: 36rpx;
  height: 36rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #FFB6C1, #FFC1E9);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 22rpx;
  font-weight: 700;
  box-shadow: 0 4rpx 12rpx rgba(255, 182, 193, 0.45);
}

.pet-name {
  font-size: 26rpx;
  font-weight: 700;
  color: $color-gray-dark;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.pet-meta {
  margin-top: 4rpx;
  font-size: 22rpx;
  color: $color-gray-medium;
}

.pet-empty {
  padding: 40rpx 24rpx;
  border-radius: 24rpx;
  background: #F8F5F5;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16rpx;
}

.pet-empty-icon {
  width: 64rpx;
  height: 64rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23C4B5B5' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 11c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3Z'/%3E%3Cpath d='M7 21c0-2.76 2.24-5 5-5s5 2.24 5 5'/%3E%3Cpath d='M19 8v6'/%3E%3Cpath d='M22 11h-6'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;
}

.pet-empty-text {
  font-size: 26rpx;
  color: $color-gray-medium;
}

.category-section {
  margin-bottom: 32rpx;
}

.category-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}

.category-item {
  padding: 20rpx 36rpx;
  background: #F8F5F5;
  border-radius: 999rpx;
  font-size: 26rpx;
  color: #6B5B5D;
  transition: all 0.2s;

  &.active {
    background: linear-gradient(135deg, #FFB6C1, #FFC1E9);
    color: white;
    font-weight: 600;
  }
}

.action-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 24rpx 32rpx;
  padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
  background: $color-bg-white;
  border-top: 1rpx solid rgba(113, 88, 92, 0.1);
}

.publish-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
  height: 96rpx;
  background: #E8E8E8;
  border-radius: 48rpx;

  &.active {
    background: linear-gradient(135deg, #FFB6C1, #FFC1E9);
    box-shadow: 0 16rpx 40rpx rgba(255, 182, 193, 0.3);
  }
}

.publish-icon {
  width: 36rpx;
  height: 36rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23FFFFFF'%3E%3Cpath d='M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;
}

.publish-text {
  font-size: $font-size-body;
  font-weight: $font-weight-bold;
  color: white;
}
</style>
