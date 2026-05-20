<template>
  <view class="my-pets-page">
    <TopNavBar class="chat-nav" :showBack="true" title="我的宠物" />
    <!-- Main Content -->
    <scroll-view class="page-content" scroll-y>
      <!-- Welcome Section -->
      <view class="welcome-section">
        <text class="welcome-title">宠爱乐园</text>
        <text class="welcome-desc">在这里记录宝贝们成长的每一个瞬间</text>
      </view>

      <!-- Pet List -->
      <view class="pet-list">
        <view
          v-for="(pet, index) in pets"
          :key="index"
          class="pet-card"
          @tap="goToPetDetail(pet)"
        >
          <view class="pet-avatar-wrapper">
            <image
              v-if="pet.avatar"
              class="pet-avatar"
              :src="pet.avatar"
              mode="aspectFill"
            />
            <view v-else class="pet-avatar-placeholder">
              <view class="placeholder-icon"></view>
            </view>
            <view class="gender-badge" :class="pet.gender">
              <view class="gender-icon" :class="pet.gender"></view>
            </view>
          </view>
          <view class="pet-info">
            <view class="pet-header">
              <text class="pet-name">{{ pet.name }}</text>
              <view class="edit-btn" @tap.stop="editPet(pet)">
                <view class="edit-icon"></view>
              </view>
            </view>
            <view class="pet-tags">
              <text class="tag breed-tag">{{ pet.breed }}</text>
              <text class="tag age-tag">{{ pet.age }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- Empty State -->
      <view class="empty-state">
        <view class="empty-icon"></view>
        <text class="empty-text">共有 {{ pets.length }} 位毛孩子</text>
      </view>
    </scroll-view>

    <!-- Floating Action Button -->
    <view class="fab-container">
      <view class="fab-btn" @tap="goToAddPet">
        <view class="fab-icon"></view>
        <text class="fab-text">新增爱宠</text>
      </view>
    </view>

    <Loading :visible="loading" />
  </view>
</template>

<script setup lang="ts">
import TopNavBar from "@/components/common/TopNavBar.vue";
import { ref } from "vue";
import Loading from "@/components/common/Loading.vue";

const loading = ref(false);

const pets = ref([
  {
    id: 1,
    name: "糯米 (Nuomi)",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDMmXcenD7Vy5QjV1G_Xfi06jc81Yj88lORiEZbjjGYJpxAvIDZsNW6yqbtuORO1WkdL7Su7uobXV36nRKLAStG4Ml5z-LtZydoX6eRrV0LcTbxh3abh4oaJ88f-c78qkSB5pPbpp9hhDXOBHdCXiYr2gH96E6Hlk-PlzDv10lu3eAjH4NTqwsUN5CA7Xsf3kJw-g5mZW62CP2uF0ACl0weoZfPfUY_j3eo0S07Ajnb4nWbfxy_9_dFiwqtcTP1sj9CfZ5ZEDdJXxmR",
    breed: "柯基",
    age: "2岁",
    gender: "male",
  },
  {
    id: 2,
    name: "棉花糖 (Mallow)",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDneJ5mqf9sduF26KfmBBTFnkg1XZoVEZwlUCqoWXsFn70dCuRmk0qEi03LWyqVA1PjrIYmb1LPLQEizRWDCspGqCHlmpiTewZQSNRz07XEXKZG2PZw68kWWsq9kfCR5FjpA5om26l1eRxh0hT2q8ylq6USyz_dV3m665vHCHADPSng-NFwk3HLWUx3qNV4Hgaq4GvXLz4OLolOpTzMHMyvO591eRYXkr87ikyAXLDkntBu4KNQbzHVtPSI9BauMMSPg3TnROk4m_GD",
    breed: "波斯猫",
    age: "1.5岁",
    gender: "female",
  },
  {
    id: 3,
    name: "大金 (Golden)",
    avatar: "",
    breed: "金毛寻回犬",
    age: "3岁",
    gender: "male",
  },
]);

const goBack = () => {
  uni.vibrateShort({ type: "light" });
  uni.navigateBack();
};

const goToAddPet = () => {
  uni.vibrateShort({ type: "light" });
  uni.navigateTo({
    url: "/pages/mine/addPet",
  });
};

const goToPetDetail = (pet) => {
  uni.vibrateShort({ type: "light" });
  uni.navigateTo({
    url: `/pages/mine/addPet?id=${pet.id}`,
  });
};

const editPet = (pet) => {
  uni.vibrateShort({ type: "light" });
  uni.navigateTo({
    url: `/pages/mine/addPet?id=${pet.id}`,
  });
};
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";

.my-pets-page {
  min-height: 100vh;
  background: $color-bg-primary;
}

/* Page Content */
.page-content {
  height: 100vh;
  box-sizing: border-box;
  padding: 40rpx 40rpx 200rpx;
}

/* Welcome Section */
.welcome-section {
  margin-bottom: 40rpx;
}

.welcome-title {
  display: block;
  font-size: $font-size-title;
  font-weight: $font-weight-bold;
  color: $color-gray-dark;
  margin-bottom: 8rpx;
}

.welcome-desc {
  font-size: $font-size-body;
  color: $color-gray-medium;
  opacity: 0.7;
}

/* Pet List */
.pet-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.pet-card {
  display: flex;
  align-items: center;
  gap: 24rpx;
  padding: 32rpx;
  background: $color-bg-white;
  border-radius: $border-radius-large;
  box-shadow: 0 8rpx 32rpx rgba(168, 155, 157, 0.12);
  border: 2rpx solid rgba(113, 88, 92, 0.1);
  transition: transform 0.2s ease;

  &:active {
    transform: scale(1);
  }
}

.pet-avatar-wrapper {
  position: relative;
}

.pet-avatar {
  width: 160rpx;
  height: 160rpx;
  border-radius: 32rpx;
  object-fit: cover;
}

.pet-avatar-placeholder {
  width: 160rpx;
  height: 160rpx;
  border-radius: $border-radius-large;
  background: rgba(113, 88, 92, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-icon {
  width: 80rpx;
  height: 80rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2371585C'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.03-1.99 1.27-5.62 3.72-.53.36-1.01.54-1.44.53-.47-.01-1.38-.27-2.06-.49-.83-.27-1.49-.42-1.43-.88.03-.24.37-.49 1.02-.74 3.99-1.74 6.65-2.89 7.99-3.45 3.81-1.6 4.6-1.88 5.12-1.89.11 0 .37.03.53.18.14.12.18.28.2.45-.01.06.01.24 0 .38z'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;
}

.gender-badge {
  position: absolute;
  bottom: -8rpx;
  right: -8rpx;
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4rpx solid #ffffff;

  &.male {
    background: rgba(218, 234, 216, 0.8);
  }

  &.female {
    background: rgba(255, 221, 226, 0.8);
  }
}

.gender-icon {
  width: 28rpx;
  height: 28rpx;

  &.male {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23546254'%3E%3Cpath d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'/%3E%3C/svg%3E")
      no-repeat center;
    background-size: 100%;
  }

  &.female {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2371585C'%3E%3Cpath d='M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16zm3-7a1 1 0 11-2 0 1 1 0 012 0zm-3 3a1 1 0 01-1-1v-3a1 1 0 012 0v3a1 1 0 01-1 1z'/%3E%3C/svg%3E")
      no-repeat center;
    background-size: 100%;
  }
}

.pet-info {
  flex: 1;
}

.pet-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12rpx;
}

.pet-name {
  font-size: $font-size-title;
  font-weight: $font-weight-bold;
  color: $color-primary;
}

.edit-btn {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.4;
  transition: opacity 0.2s ease;

  &:active {
    opacity: 1;
  }
}

.edit-icon {
  width: 32rpx;
  height: 32rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23807476'%3E%3Cpath d='M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;
}

.pet-tags {
  display: flex;
  gap: 12rpx;
}

.tag {
  padding: 8rpx 20rpx;
  border-radius: $border-radius-small;
  font-size: $font-size-helper;
  font-weight: $font-weight-bold;
  letter-spacing: 0.05em;

  &.breed-tag {
    background: rgba(113, 88, 92, 0.08);
    color: $color-primary;
  }

  &.age-tag {
    background: rgba(113, 88, 92, 0.05);
    color: $color-gray-medium;
    opacity: 0.7;
  }
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80rpx 0;
  opacity: 0.4;
}

.empty-icon {
  width: 120rpx;
  height: 120rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2371585C'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.03-1.99 1.27-5.62 3.72-.53.36-1.01.54-1.44.53-.47-.01-1.38-.27-2.06-.49-.83-.27-1.49-.42-1.43-.88.03-.24.37-.49 1.02-.74 3.99-1.74 6.65-2.89 7.99-3.45 3.81-1.6 4.6-1.88 5.12-1.89.11 0 .37.03.53.18.14.12.18.28.2.45-.01.06.01.24 0 .38z'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;
  margin-bottom: 16rpx;
}

.empty-text {
  font-size: $font-size-body;
  color: $color-gray-medium;
}

/* Floating Action Button */
.fab-container {
  position: fixed;
  bottom: calc(120rpx + env(safe-area-inset-bottom));
  left: 50%;
  transform: translateX(-50%);
  z-index: 90;
}

.fab-btn {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 28rpx 56rpx;
  background: #71585c;
  border-radius: 100rpx;
  box-shadow: 0 12rpx 24rpx rgba(113, 88, 92, 0.3);
  transition: transform 0.2s ease;

  &:active {
    transform: scale(1);
  }
}

.fab-icon {
  width: 40rpx;
  height: 40rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23FFFFFF'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;
}

.fab-text {
  font-size: 32rpx;
  font-weight: 600;
  color: #ffffff;
}
</style>
