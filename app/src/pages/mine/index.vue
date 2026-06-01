<template>
  <PageLayout :tab-bar="true">
    <template #navbar>
      <TopNavBar
        title="我的"
        :showBack="false"
        rightIcon="icon-setting"
        @rightClick="goToSetting"
      />
    </template>

    <view class="mine-content">
      <view class="profile-card">
        <view class="user-row">
          <view class="user-left">
            <image
              class="avatar"
              :src="userInfo?.avatar ? getFullAvatarUrl(userInfo.avatar) : defaultAvatar"
              mode="aspectFill"
            />
            <view class="user-info">
              <text class="name">{{ userInfo?.username || "未登录" }}</text>
              <text class="desc" v-if="userInfo?.signature">{{ userInfo.signature }}</text>
              <text class="desc guest-hint" v-else-if="!isLoggedIn()">登录后可同步个人资料与宠物信息</text>
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
        <view class="pet-list" v-if="pets.length > 0">
          <view
            v-for="pet in pets"
            :key="pet.id"
            class="pet-card"
            @click="goToEditPet(pet)"
          >
            <view class="pet-cover">
              <image
                v-if="pet.avatar"
                class="pet-avatar"
                :src="getFullAvatarUrl(pet.avatar)"
                mode="aspectFill"
              />
              <view v-else class="pet-avatar-placeholder">
                <view class="placeholder-icon"></view>
              </view>
            </view>
            <view class="pet-meta">
              <text class="pet-name">{{ pet.name }}</text>
              <text class="pet-info">{{ formatPetAge(pet.age) || "—" }} · {{ pet.breed || "—" }}</text>
            </view>
          </view>
          <view class="add-card" @click.stop="goToAddPet">
            <view class="add-icon">
              <view class="add-icon-inner"></view>
            </view>
            <text>添加宠物</text>
          </view>
        </view>
        <view v-else class="empty-pet-list" @click="goToAddPet">
          <text class="empty-text">还没有宠物</text>
          <text class="empty-hint">点击添加你的宠物</text>
        </view>
      </view>

      <view class="menu-section">
        <view class="menu-item" @click="goToLikedPosts">
          <text class="menu-label">我的点赞</text>
          <view class="menu-arrow"></view>
        </view>
        <view class="menu-item" @click="goToAiGuide">
          <text class="menu-label">AI 养宠助手</text>
          <view class="menu-arrow"></view>
        </view>
      </view>

      <view class="ai-card">
        <view class="ai-light"></view>
        <text class="ai-title">需要养宠建议吗？</text>
        <text class="ai-desc">AI 为你生成遛狗推荐、天气提醒和陪伴建议</text>
        <view class="ai-btn" @click="goToAiGuide">
          <view class="ai-btn-icon"></view>
          <text>一键生成建议</text>
        </view>
      </view>

      <view
        v-if="isLoggedIn()"
        class="logout-btn"
        @click="handleLogout"
        :class="{ loading: isLoggingOut }"
      >
        <text>{{ isLoggingOut ? "退出中..." : "退出登录" }}</text>
      </view>
      <view v-else class="login-btn" @click="goToLogin">
        <text>去登录</text>
      </view>
    </view>

    <template #tabbar>
      <TabBar :current="3" />
    </template>
  </PageLayout>
</template>

<script setup lang="ts">
import { showRequestError } from "@/utils/request";
import { ref, onMounted, onUnmounted } from "vue";
import { onShow } from "@dcloudio/uni-app";
import TopNavBar from "@/components/common/TopNavBar.vue";
import TabBar from "@/components/common/TabBar.vue";
import PageLayout from "@/components/common/PageLayout.vue";
import { logout, isLoggedIn, promptLogin } from "@/api/auth";
import { getUserInfo } from "@/api/user";
import { getPetList, type Pet } from "@/api/pet";
import { resolveMediaUrl } from "@/utils/media";
import { formatPetAge } from "@/utils/format";

const userInfo = ref<any>(null);
const isLoggingOut = ref(false);
const pets = ref<Pet[]>([]);
const isLoadingPets = ref(false);
const MAX_DISPLAY_PETS = 3; // 首页最多显示的宠物数量

const stats = ref({
  posts: 0,
  following: 0,
  followers: 0,
});

onMounted(async () => {
  uni.$on("refreshPetList", loadPets);
  uni.$on("refreshUserInfo", loadUserInfo);
});

onShow(() => {
  if (isLoggedIn()) {
    loadUserInfo();
    loadPets();
  } else {
    userInfo.value = null;
    pets.value = [];
    stats.value = { posts: 0, following: 0, followers: 0 };
  }
});

onUnmounted(() => {
  uni.$off("refreshPetList", loadPets);
  uni.$off("refreshUserInfo", loadUserInfo);
});

const loadUserInfo = async () => {
  try {
    const user = await getUserInfo();
    userInfo.value = user;
    stats.value = {
      posts: user.posts_count || 0,
      following: user.following_count || 0,
      followers: user.followers_count || 0,
    };
  } catch (error) {
    console.error("获取用户信息失败:", error);
  }
};

const loadPets = async () => {
  if (!isLoggedIn()) return;
  isLoadingPets.value = true;
  try {
    const data = await getPetList();
    pets.value = data.slice(0, MAX_DISPLAY_PETS);
  } catch (error) {
    showRequestError(error, "获取宠物列表失败");
  } finally {
    isLoadingPets.value = false;
  }
};

const getFullAvatarUrl = (avatar: string) => resolveMediaUrl(avatar);

const goToSetting = () => {
  if (!promptLogin()) return;
  uni.navigateTo({
    url: "/pages/mine/setting",
  });
};

const goToEditInfo = () => {
  if (!promptLogin()) return;
  uni.navigateTo({
    url: "/pages/mine/editInfo",
  });
};

const goToPetInfo = () => {
  if (!promptLogin()) return;
  uni.navigateTo({
    url: "/pages/mine/myPets",
  });
};

const defaultAvatar =
  "https://api.dicebear.com/7.x/avataaars/svg?seed=pet";

const goToAddPet = () => {
  if (!promptLogin()) return;
  uni.vibrateShort({ type: "light" });
  uni.navigateTo({
    url: "/pages/mine/addPet",
  });
};

const goToEditPet = (pet: Pet) => {
  if (!promptLogin()) return;
  uni.vibrateShort({ type: "light" });
  uni.navigateTo({
    url: `/pages/mine/addPet?id=${pet.id}`,
  });
};

const goToLikedPosts = () => {
  if (!promptLogin()) return;
  uni.navigateTo({ url: "/pages/mine/collection" });
};

const goToAiGuide = () => {
  if (!promptLogin()) return;
  uni.navigateTo({ url: "/pages/mine/aiGuide" });
};

const goToFollow = () => {
  if (!promptLogin()) return;
  uni.navigateTo({
    url: "/pages/mine/follow",
  });
};

const goToFans = () => {
  if (!promptLogin()) return;
  uni.navigateTo({
    url: "/pages/mine/fans",
  });
};

const goToMyDynamic = () => {
  if (!promptLogin()) return;
  uni.navigateTo({
    url: "/pages/mine/myDynamic",
  });
};

const goToLogin = () => {
  uni.reLaunch({ url: "/pages/login/index" });
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
.mine-content {
  padding: 0 32rpx 32rpx;
  box-sizing: border-box;
}

.menu-section {
  margin-top: 24rpx;
  background: #fff;
  border-radius: 32rpx;
  overflow: hidden;
  box-shadow: 0 12rpx 40rpx rgba(107, 78, 61, 0.06);
}

.menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32rpx 36rpx;
  border-bottom: 1rpx solid rgba(210, 195, 196, 0.25);

  &:last-child {
    border-bottom: none;
  }
}

.menu-label {
  font-size: 30rpx;
  color: #3d2f2f;
  font-weight: 600;
}

.menu-arrow {
  width: 28rpx;
  height: 28rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%238A7F7F'%3E%3Cpath d='M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;
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
  flex: 1;
  min-width: 0;
}

.user-info {
  flex: 1;
  min-width: 0;
  overflow: hidden;
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
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}

.desc {
  margin-top: 16rpx;
  color: #8a7f7f;
  font-size: 28rpx;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  word-break: break-all;
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
  flex-shrink: 0;
  width: 280rpx;
  background: #ffffff;
  border-radius: 56rpx;
  overflow: hidden;
  padding: 0;
  box-shadow: 0 20rpx 56rpx rgba(107, 78, 61, 0.05);
  display: flex;
  flex-direction: column;
}

.pet-cover {
  width: 100%;
  height: 280rpx;
  overflow: hidden;
}

.pet-avatar {
  width: 100%;
  height: 100%;
  display: block;
}

.pet-meta {
  padding: 0 20rpx 32rpx;
  margin-top: 24rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.pet-name {
  width: 100%;
  font-size: 36rpx;
  font-weight: 700;
  color: #3d2f2f;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.pet-info {
  margin-top: 12rpx;
  width: 100%;
  font-size: 26rpx;
  color: #9b9090;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.pet-avatar-placeholder {
  width: 100%;
  height: 100%;
  background: rgba(107, 78, 61, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-icon {
  width: 72rpx;
  height: 72rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2371585C'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.03-1.99 1.27-5.62 3.72-.53.36-1.01.54-1.44.53-.47-.01-1.38-.27-2.06-.49-.83-.27-1.49-.42-1.43-.88.03-.24.37-.49 1.02-.74 3.99-1.74 6.65-2.89 7.99-3.45 3.81-1.6 4.6-1.88 5.12-1.89.11 0 .37.03.53.18.14.12.18.28.2.45-.01.06.01.24 0 .38z'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;
}

.empty-pet-list {
  min-height: 216rpx;
  border-radius: 56rpx;
  border: 4rpx dashed #f2d7c3;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.4);
}

.empty-text {
  font-size: 32rpx;
  font-weight: 600;
  color: #b8a7a7;
  margin-bottom: 8rpx;
}

.empty-hint {
  font-size: 24rpx;
  color: #d4c4c4;
}

.add-card {
  flex-shrink: 0;
  width: 280rpx;
  border-radius: 56rpx;
  border: 4rpx dashed #f2d7c3;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 36rpx 20rpx;
  color: #b8a7a7;
  background: rgba(255, 255, 255, 0.4);
  box-sizing: border-box;

  text {
    text-align: center;
  }
}

.add-icon {
  width: 108rpx;
  height: 108rpx;
  border-radius: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
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

.guest-hint {
  color: #9b9090;
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

.login-btn {
  margin-top: 60rpx;
  width: 100%;
  height: 112rpx;
  border-radius: 999rpx;
  background: linear-gradient(135deg, #ffb36b, #ffa95d);
  color: #ffffff;
  font-size: 32rpx;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 16rpx 48rpx rgba(255, 179, 107, 0.28);

  &:active {
    transform: scale(0.98);
    opacity: 0.9;
  }
}
</style>
