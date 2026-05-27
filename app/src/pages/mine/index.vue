<template>
  <view class="page-container">
    <view class="topbar">
      <view class="action-group">
        <view class="action-btn">
          <view class="action-icon icon-ellipsis"></view>
        </view>
        <view class="action-btn" @click="goToSetting">
          <view class="action-icon icon-settings"></view>
        </view>
      </view>
    </view>

    <scroll-view scroll-y class="content">
      <view class="profile-card">
        <view class="user-row">
          <view class="user-left">
            <image
              class="avatar"
              :src="
                userInfo?.avatar ||
                'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop'
              "
              mode="aspectFill"
            />
            <view>
              <text class="name">{{ userInfo?.username || "Summer Lin" }}</text>
            </view>
          </view>
          <view class="edit-btn" @click="goToEditInfo">
            <view class="edit-icon"></view>
          </view>
        </view>

        <view class="stats">
          <view class="stat" @click="goToMyDynamic">
            <text class="num">{{ stats.posts }}</text>
            <text class="label">动态</text>
          </view>
          <view class="stat" @click="goToFollow">
            <text class="num">{{ stats.following }}</text>
            <text class="label">关注</text>
          </view>
          <view class="stat" @click="goToFans">
            <text class="num">{{ stats.followers }}</text>
            <text class="label">粉丝</text>
          </view>
        </view>
      </view>

      <view class="section">
        <view class="section-header">
          <text class="section-title">我的宠物</text>
          <text class="more" @click="goToPetInfo">查看全部</text>
        </view>
        <view class="pet-list">
          <view class="pet-card">
            <image
              class="pet-avatar"
              src="https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=400&auto=format&fit=crop"
              mode="aspectFill"
            />
            <text class="pet-name">芝士</text>
            <text class="pet-info">1岁 · 柴犬</text>
          </view>
          <view class="add-card" @click="goToPetInfo">
            <view class="add-icon">
              <view class="add-icon-inner"></view>
            </view>
            <text>添加宠物</text>
          </view>
        </view>
      </view>

      <view class="ai-card">
        <view class="ai-light"></view>
        <text class="ai-title">需要养宠建议吗？</text>
        <text class="ai-desc"
          >AI 为你生成今日遛狗推荐、天气提醒和宠物陪伴建议 ✨</text
        >
        <view class="ai-btn" @click="handleGenerateTips">
          <view class="ai-btn-icon"></view>
          <text>一键生成建议</text>
        </view>
      </view>

      <view
        class="logout-btn"
        @click="handleLogout"
        :class="{ loading: isLoggingOut }"
      >
        <text>{{ isLoggingOut ? "退出中..." : "退出登录" }}</text>
      </view>
    </scroll-view>

    <TabBar :current="3" />
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import TabBar from "@/components/common/TabBar.vue";
import { logout } from "@/api/auth";
import { getUserInfo } from "@/api/user";

const userInfo = ref(null);
const isLoggingOut = ref(false);

const stats = ref({
  posts: 24,
  following: 1200,
  followers: 856,
});

onMounted(async () => {
  try {
    const user = await getUserInfo();
    userInfo.value = user;
  } catch (error) {
    console.error("获取用户信息失败:", error);
  }
});

const goToSetting = () => {
  uni.navigateTo({
    url: "/pages/mine/setting",
  });
};

const goToEditInfo = () => {
  uni.navigateTo({
    url: "/pages/mine/editInfo",
  });
};

const goToPetInfo = () => {
  uni.navigateTo({
    url: "/pages/mine/myPets",
  });
};

const goToFollow = () => {
  uni.navigateTo({
    url: "/pages/mine/follow",
  });
};

const goToFans = () => {
  uni.navigateTo({
    url: "/pages/mine/fans",
  });
};

const goToMyDynamic = () => {
  uni.navigateTo({
    url: "/pages/mine/myDynamic",
  });
};

const handleGenerateTips = () => {
  uni.showToast({
    title: "正在生成攻略...",
    icon: "loading",
  });
};

const handleLogout = () => {
  uni.showModal({
    title: "提示",
    content: "确定要退出登录吗？",
    confirmColor: "#E26D6D",
    success: async (res) => {
      if (res.confirm) {
        isLoggingOut.value = true;

        try {
          await logout();

          uni.showToast({
            title: "已退出登录",
            icon: "success",
          });

          setTimeout(() => {
            uni.reLaunch({
              url: "/pages/login/index",
            });
          }, 1500);
        } catch (error) {
          uni.showToast({
            title: error instanceof Error ? error.message : "退出失败",
            icon: "error",
          });
        } finally {
          isLoggingOut.value = false;
        }
      }
    },
  });
};
</script>

<style lang="scss" scoped>
.page-container {
  width: 100%;
  min-height: 100vh;
  background: #fff7f1;
  position: relative;
}

.topbar {
  height: 184rpx;
  padding: 104rpx 20rpx 0;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  background: rgba(255, 247, 241, 0.88);
  backdrop-filter: blur(20px);
  position: relative;
  z-index: 5;
}

.action-group {
  display: flex;
  gap: 20rpx;
}

.action-btn {
  width: 80rpx;
  height: 80rpx;
  border-radius: 999rpx;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 24rpx rgba(107, 78, 61, 0.08);
}

.action-icon {
  width: 32rpx;
  height: 32rpx;

  &.icon-ellipsis {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%236B5B5B'%3E%3Cpath d='M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z'/%3E%3C/svg%3E")
      no-repeat center;
    background-size: 100%;
  }

  &.icon-settings {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%236B5B5B'%3E%3Cpath d='M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.39-1.08-.7-1.66-.94l-.38-2.65c-.03-.24-.24-.42-.48-.42h-4c-.24 0-.45.18-.48.42l-.38 2.65c-.58.24-1.14.55-1.66.94l-2.49-1c-.22-.08-.49 0-.61.22l-2 3.46c-.12.22-.07.49.12.64l2.11 1.65c-.04.32-.07.64-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.39 1.08.7 1.66.94l.38 2.65c.03.24.24.42.48.42h4c.24 0 .45-.18.48-.42l.38-2.65c.58-.24 1.14-.55 1.66-.94l2.49 1c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zm-7.43 2.52c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z'/%3E%3C/svg%3E")
      no-repeat center;
    background-size: 100%;
  }
}

.content {
  height: calc(100% - 184rpx);
  overflow-y: auto;
  box-sizing: border-box;
  padding: 0 32rpx 240rpx;
}

.profile-card {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.92),
    rgba(255, 250, 246, 0.92)
  );
  border-radius: 64rpx;
  padding: 48rpx;
  box-shadow: 0 24rpx 64rpx rgba(107, 78, 61, 0.06);
}

.user-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.user-left {
  display: flex;
  align-items: center;
  gap: 32rpx;
}

.avatar {
  width: 164rpx;
  height: 164rpx;
  border-radius: 56rpx;
  object-fit: cover;
  border: 8rpx solid rgba(255, 255, 255, 0.8);
}

.name {
  font-size: 56rpx;
  font-weight: 700;
  color: #3d2f2f;
  display: block;
}

.desc {
  margin-top: 16rpx;
  color: #8a7f7f;
  font-size: 28rpx;
  display: block;
}

.edit-btn {
  width: 84rpx;
  height: 84rpx;
  border-radius: 32rpx;
  background: #fff0e0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.edit-icon {
  width: 40rpx;
  height: 40rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23F4A259'%3E%3Cpath d='M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;
}

.stats {
  margin-top: 48rpx;
  background: #ffffff;
  border-radius: 48rpx;
  padding: 40rpx 20rpx;
  display: flex;
  justify-content: space-around;
  box-shadow: 0 16rpx 48rpx rgba(107, 78, 61, 0.04);
}

.stat {
  flex: 1;
  text-align: center;
  position: relative;

  &:not(:last-child)::after {
    content: "";
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 2rpx;
    height: 84rpx;
    background: #f2e7e0;
  }
}

.num {
  font-size: 48rpx;
  font-weight: 700;
  color: #6b4e3d;
  display: block;
}

.label {
  margin-top: 12rpx;
  font-size: 24rpx;
  color: #9b9090;
  display: block;
}

.section {
  margin-top: 56rpx;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32rpx;
}

.section-title {
  font-size: 52rpx;
  font-weight: 700;
  color: #3d2f2f;
}

.more {
  font-size: 26rpx;
  color: #a49797;
}

.pet-list {
  display: flex;
  gap: 28rpx;
  padding-bottom: 8rpx;
  flex-wrap: nowrap;
  overflow-x: auto;
}

.pet-card {
  min-width: 300rpx;
  background: #ffffff;
  border-radius: 56rpx;
  padding: 36rpx;
  box-shadow: 0 20rpx 56rpx rgba(107, 78, 61, 0.05);
}

.pet-avatar {
  width: 144rpx;
  height: 144rpx;
  border-radius: 48rpx;
  object-fit: cover;
}

.pet-name {
  margin-top: 32rpx;
  font-size: 36rpx;
  font-weight: 700;
  color: #3d2f2f;
  display: block;
}

.pet-info {
  margin-top: 12rpx;
  font-size: 26rpx;
  color: #9b9090;
  display: block;
}

.add-card {
  min-width: 300rpx;
  border-radius: 56rpx;
  border: 4rpx dashed #f2d7c3;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 36rpx;
  color: #b8a7a7;
  background: rgba(255, 255, 255, 0.4);
}

.add-icon {
  width: 108rpx;
  height: 108rpx;
  border-radius: 40rpx;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 16rpx 40rpx rgba(107, 78, 61, 0.05);
  margin-bottom: 28rpx;
}

.add-icon-inner {
  width: 48rpx;
  height: 48rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23B8A7A7'%3E%3Cpath d='M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;
}

.ai-card {
  margin-top: 48rpx;
  border-radius: 64rpx;
  padding: 48rpx;
  background: linear-gradient(135deg, #ffefe4, #fff9e9);
  position: relative;
  overflow: hidden;
}

.ai-light {
  position: absolute;
  width: 360rpx;
  height: 360rpx;
  border-radius: 999rpx;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.45) 0%,
    rgba(255, 255, 255, 0) 70%
  );
  top: -160rpx;
  right: -120rpx;
}

.ai-title {
  font-size: 48rpx;
  font-weight: 700;
  color: #5e4636;
  display: block;
  position: relative;
  z-index: 2;
}

.ai-desc {
  margin-top: 20rpx;
  line-height: 1.8;
  color: #8a7f7f;
  font-size: 28rpx;
  display: block;
  position: relative;
  z-index: 2;
}

.ai-btn {
  margin-top: 44rpx;
  width: 100%;
  height: 104rpx;
  border-radius: 999rpx;
  background: #8b6d73;
  color: #ffffff;
  font-size: 30rpx;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
  box-shadow: 0 20rpx 48rpx rgba(139, 109, 115, 0.2);
  position: relative;
  z-index: 2;
  transition: all 0.2s ease;

  &:active {
    transform: scale(1.02);
  }
}

.ai-btn-icon {
  width: 36rpx;
  height: 36rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M13 3L4 14h7v7l9-11h-7V3z'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;
}

.logout-btn {
  margin-top: 60rpx;
  width: 100%;
  height: 112rpx;
  border-radius: 999rpx;
  background: #ffffff;
  color: #e26d6d;
  font-size: 32rpx;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 16rpx 48rpx rgba(107, 78, 61, 0.05);
  transition: all 0.2s ease;

  &:active {
    transform: scale(0.98);
    opacity: 0.9;
  }

  &.loading {
    opacity: 0.6;
  }
}
</style>
