<template>
  <view class="profile-page">
    <TopNavBar class="chat-nav" showBack title="个人资料编辑" />
    <!-- Main Content -->
    <scroll-view class="page-content" scroll-y>
      <!-- Avatar Upload Section -->
      <view class="avatar-section">
        <view class="avatar-wrapper" @tap="chooseAvatar">
          <view class="avatar-ring">
            <image class="avatar" :src="avatarUrl" mode="aspectFill" />
          </view>
          <view class="edit-btn">
            <view class="edit-icon"></view>
          </view>
        </view>
        <text class="avatar-tip">点击更换头像</text>
      </view>

      <!-- Form Section -->
      <view class="form-section">
        <!-- Nickname Field -->
        <view class="form-item">
          <text class="form-label">昵称</text>
          <view class="input-wrapper">
            <input
              class="form-input"
              v-model="nickname"
              placeholder="输入你的昵称"
            />
            <view class="input-icon icon-pets"></view>
          </view>
        </view>

        <!-- User ID Display -->
        <view class="form-item">
          <text class="form-label">用户 ID</text>
          <view class="id-wrapper">
            <text class="id-text">{{ userId }}</text>
            <view class="copy-btn" @tap="copyUserId">
              <view class="copy-icon"></view>
            </view>
          </view>
        </view>

        <!-- Bio Field -->
        <view class="form-item">
          <text class="form-label">个性签名</text>
          <textarea
            class="form-textarea"
            v-model="bio"
            placeholder="分享一下你和毛孩子的故事吧..."
            :maxlength="200"
          />
        </view>
      </view>

      <!-- Tips Card -->
      <view class="tips-card">
        <view class="tips-icon"></view>
        <text class="tips-text"
          >完善个人资料可以让更多的宠友认识你哦！别忘了上传一张最可爱的头像。</text
        >
      </view>
    </scroll-view>

    <!-- Bottom Action Button -->
    <view class="footer">
      <view class="save-btn" @tap="saveProfile">
        <text class="save-text">保存修改</text>
        <view class="save-icon"></view>
      </view>
    </view>

    <Loading :visible="loading" />
  </view>
</template>

<script setup lang="ts">
import TopNavBar from '@/components/common/TopNavBar.vue'
import { ref } from "vue";
import Loading from "@/components/common/Loading.vue";

const loading = ref(false);
const avatarUrl = ref(
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBLI_TiM-8WkRvWXF3zLl5insv5qwVJ4DP31d8Q83fyEoVhUn_p6EhyrL8P0oYHRYOG2C1EPGovSFDuRKtZEElf6Y3ekMCuXhCm6H8p7E-l9_uww9SEPQfSsuoH443tOg2AqsKTHZrtbleJrTmiyS4ihH0gnl-qs0p-HNYLLCj5ot5DckDWouuxn5prB2VnphtZOod7ht2zORDkmjR6121rLQSrVbmjT1rRu_5fuHxsf3EQVXzfFyXg3aya8R59XZAm0hfx9yP53yyg",
);
const nickname = ref("小柴汪汪");
const userId = ref("Waggle_882934");
const bio = ref("");

const goBack = () => {
  uni.vibrateShort({ type: "light" });
  uni.navigateBack();
};

const chooseAvatar = () => {
  uni.vibrateShort({ type: "light" });
  uni.showActionSheet({
    itemList: ["从相册选择", "拍照"],
    success: (res) => {
      const sourceType = res.tapIndex === 0 ? "album" : "camera";
      uni.chooseImage({
        count: 1,
        sizeType: ["compressed"],
        sourceType: [sourceType],
        success: (res) => {
          avatarUrl.value = res.tempFilePaths[0];
          uni.showToast({
            title: "头像上传成功",
            icon: "success",
          });
        },
      });
    },
  });
};

const copyUserId = () => {
  uni.vibrateShort({ type: "light" });
  uni.setClipboardData({
    data: userId.value,
    success: () => {
      uni.showToast({
        title: "已复制",
        icon: "success",
      });
    },
  });
};

const saveProfile = () => {
  uni.vibrateShort({ type: "medium" });
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
    uni.showToast({
      title: "保存成功",
      icon: "success",
    });
    setTimeout(() => {
      uni.navigateBack();
    }, 1500);
  }, 1000);
};
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.profile-page {
  min-height: 100vh;
  background: $color-bg-primary;
  display: flex;
  flex-direction: column;
}

/* Navigation Bar */
.nav-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: calc(var(--status-bar-height, 44px) + 96rpx);
  padding-top: var(--status-bar-height, 44px);
  background: rgba(255, 248, 247, 0.8);
  backdrop-filter: blur(20px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--status-bar-height, 44px) 40rpx 0;
  box-shadow: 0 8rpx 32rpx rgba(168, 155, 157, 0.12);
  z-index: $z-index-nav;
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 24rpx;
}

.back-btn {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;

  &:active {
    transform: scale(0.9);
  }
}

.back-icon {
  width: 40rpx;
  height: 40rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2371585C'%3E%3Cpath d='M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;
}

.nav-title {
  font-size: $font-size-title;
  font-weight: $font-weight-bold;
  color: $color-primary;
}

.nav-right {
  width: 80rpx;
}

/* Page Content */
.page-content {
  flex: 1;
  box-sizing: border-box;
  padding: calc(var(--status-bar-height, 44px) + 120rpx) 40rpx 180rpx;
}

/* Avatar Section */
.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 48rpx;
}

.avatar-wrapper {
  position: relative;
  margin-bottom: 32rpx;
}

.avatar-ring {
  width: 256rpx;
  height: 256rpx;
  border-radius: 50%;
  padding: 8rpx;
  background: linear-gradient(135deg, #ffdde2 0%, #ede2c0 100%);
  box-shadow: 0 8rpx 32rpx rgba(168, 155, 157, 0.12);
}

.avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 8rpx solid #ffffff;
}

.edit-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background: #71585c;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 8rpx solid #ffffff;
  box-shadow: 0 4rpx 16rpx rgba(113, 88, 92, 0.3);
  transition: transform 0.2s ease;

  &:active {
    transform: scale(0.9);
  }
}

.edit-icon {
  width: 40rpx;
  height: 40rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23FFFFFF'%3E%3Cpath d='M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;
}

.avatar-tip {
  font-size: 24rpx;
  font-weight: 700;
  color: #4f4446;
  letter-spacing: 0.05em;
  opacity: 0.7;
}

/* Form Section */
.form-section {
  display: flex;
  flex-direction: column;
  gap: 40rpx;
  margin-bottom: 48rpx;
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.form-label {
  font-size: 24rpx;
  font-weight: 700;
  color: #71585c;
  letter-spacing: 0.05em;
  padding-left: 16rpx;
}

.input-wrapper {
  position: relative;
}

.form-input {
  width: 100%;
  height: 96rpx;
  padding: 0 120rpx 0 48rpx;
  background: #ffffff;
  border-radius: 48rpx;
  font-size: 32rpx;
  color: #1e1b1b;
  box-shadow: 0 8rpx 32rpx rgba(168, 155, 157, 0.12);
  box-sizing: border-box;
}

.input-icon {
  position: absolute;
  right: 48rpx;
  top: 50%;
  transform: translateY(-50%);
  width: 48rpx;
  height: 48rpx;
  opacity: 0.4;

  &.icon-pets {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2371585C'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.03-1.99 1.27-5.62 3.72-.53.36-1.01.54-1.44.53-.47-.01-1.38-.27-2.06-.49-.83-.27-1.49-.42-1.43-.88.03-.24.37-.49 1.02-.74 3.99-1.74 6.65-2.89 7.99-3.45 3.81-1.6 4.6-1.88 5.12-1.89.11 0 .37.03.53.18.14.12.18.28.2.45-.01.06.01.24 0 .38z'/%3E%3C/svg%3E")
      no-repeat center;
    background-size: 100%;
  }
}

.id-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 96rpx;
  padding: 0 48rpx;
  background: rgba(243, 236, 236, 0.5);
  border-radius: 48rpx;
  border: 2rpx solid rgba(210, 195, 196, 0.3);
  box-sizing: border-box;
}

.id-text {
  font-size: 32rpx;
  color: #4f4446;
  opacity: 0.7;
}

.copy-btn {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  background: rgba(113, 88, 92, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease;

  &:active {
    background: rgba(113, 88, 92, 0.1);
  }
}

.copy-icon {
  width: 36rpx;
  height: 36rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2371585C'%3E%3Cpath d='M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;
}

.form-textarea {
  width: 100%;
  min-height: 160rpx;
  padding: 32rpx 48rpx;
  background: #ffffff;
  border-radius: 48rpx;
  font-size: 28rpx;
  color: #1e1b1b;
  box-shadow: 0 8rpx 32rpx rgba(168, 155, 157, 0.12);
  box-sizing: border-box;
  resize: none;
}

/* Tips Card */
.tips-card {
  display: flex;
  align-items: flex-start;
  gap: 24rpx;
  padding: 40rpx;
  background: rgba(218, 234, 216, 0.3);
  border-radius: 48rpx;
  border: 2rpx solid rgba(218, 234, 216, 0.5);
}

.tips-icon {
  width: 48rpx;
  height: 48rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23546254'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;
  flex-shrink: 0;
}

.tips-text {
  font-size: 28rpx;
  color: #3c4a3d;
  line-height: 1.6;
}

/* Footer */
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 32rpx 40rpx calc(32rpx + env(safe-area-inset-bottom));
  background: #fff8f7;
}

.save-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
  height: 96rpx;
  background: #71585c;
  border-radius: 48rpx;
  box-shadow: 0 8rpx 32rpx rgba(113, 88, 92, 0.2);
  transition: transform 0.2s ease;

  &:active {
    transform: scale(0.98);
  }
}

.save-text {
  font-size: 32rpx;
  font-weight: 600;
  color: #ffffff;
}

.save-icon {
  width: 40rpx;
  height: 40rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23FFFFFF'%3E%3Cpath d='M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;
}
</style>
