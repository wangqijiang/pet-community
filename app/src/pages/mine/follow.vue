<template>
  <PageLayout refresher @refresh="onRefresh" @scrolltolower="loadMore">
    <template #navbar>
      <TopNavBar title="关注列表" :showBack="true" />
    </template>

    <view class="page-inner follow-inner">
        <!-- 搜索框 -->
        <view class="search-bar">
          <view class="search-icon"></view>
          <input
            class="search-input"
            placeholder="搜索关注的人..."
            placeholder-class="search-placeholder"
            v-model="searchText"
          />
        </view>

        <!-- 用户列表 -->
        <view class="user-list">
          <view
            v-for="user in userList"
            :key="user.id"
            class="user-card"
            @tap="goToUserProfile(user.id)"
          >
            <view class="user-left">
              <view class="avatar-wrapper">
                <image
                  class="user-avatar"
                  :src="user.avatar"
                  mode="aspectFill"
                ></image>
                <view v-if="user.isOnline" class="online-dot"></view>
              </view>
              <view class="user-info">
                <view class="user-name-row">
                  <text class="user-name">{{ user.nickname }}</text>
                </view>
                <text class="user-desc">{{ user.desc }}</text>
              </view>
            </view>
            <view
              class="action-btn"
              :class="{ unfollow: user.isFollowed }"
              @tap.stop="handleUnfollow(user)"
            >
              <text class="btn-text">{{
                user.isFollowed ? "已关注" : "关注"
              }}</text>
            </view>
          </view>
        </view>

        <!-- 空状态 -->
        <view class="empty-state">
          <view class="empty-icon"></view>
          <text class="empty-text">去发现更多可爱的 TA 吧</text>
        </view>
    </view>

    <Loading :visible="loading" />
  </PageLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import TopNavBar from "@/components/common/TopNavBar.vue";
import PageLayout from "@/components/common/PageLayout.vue";
import Loading from "@/components/common/Loading.vue";
import { getFollowingList, unfollowUser } from "@/api/user";
import { resolveMediaUrl } from "@/utils/media";

const loading = ref(false);
const searchText = ref("");

const userList = ref<
  Array<{
    id: number;
    avatar: string;
    nickname: string;
    desc: string;
    isFollowed: boolean;
    isOnline: boolean;
  }>
>([]);

const loadFollowList = async () => {
  loading.value = true;
  try {
    const res = await getFollowingList(1, 50);
    let list = res.list.map((u) => ({
      id: u.id,
      avatar: resolveMediaUrl(u.avatar),
      nickname: u.username,
      desc: u.signature || "",
      isFollowed: true,
      isOnline: false,
    }));
    if (searchText.value) {
      const kw = searchText.value.toLowerCase();
      list = list.filter(
        (u) =>
          u.nickname.toLowerCase().includes(kw) ||
          u.desc.toLowerCase().includes(kw),
      );
    }
    userList.value = list;
  } catch {
    uni.showToast({ title: "加载失败", icon: "none" });
  } finally {
    loading.value = false;
  }
};

onMounted(loadFollowList);

const onRefresh = () => loadFollowList();
const loadMore = () => {};

const goToUserProfile = (id: number) => {
  uni.navigateTo({ url: `/pages/mine/userProfile?id=${id}` });
};

const handleUnfollow = (user: { id: number; nickname: string }) => {
  uni.showModal({
    title: "提示",
    content: `确定取消关注 ${user.nickname} 吗？`,
    success: async (res) => {
      if (!res.confirm) return;
      try {
        await unfollowUser(user.id);
        userList.value = userList.value.filter((u) => u.id !== user.id);
        uni.showToast({ title: "已取消关注", icon: "success" });
      } catch {
        uni.showToast({ title: "操作失败", icon: "none" });
      }
    },
  });
};
</script>

<style lang="scss" scoped>
@import "@/styles/layout.scss";

.follow-inner {
  padding-top: 0;
  background: linear-gradient(180deg, #fff8f5 0%, #fff6f2 100%);
  min-height: 100%;
}

.search-bar {
  margin: 44rpx 36rpx 0;
  height: 116rpx;
  border-radius: 999rpx;
  background: white;
  display: flex;
  align-items: center;
  padding: 0 36rpx;
  box-shadow: 0 20rpx 48rpx rgba(107, 78, 61, 0.04);
}

.search-icon {
  width: 40rpx;
  height: 40rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23C3B8B8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='11' cy='11' r='8'/%3E%3Cline x1='21' y1='21' x2='16.65' y2='16.65'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;
}

.search-input {
  flex: 1;
  font-size: 32rpx;
  margin-left: 24rpx;
  color: #5e4b4b;
}

.search-placeholder {
  color: #c3b8b8;
}

.user-list {
  padding: 44rpx 36rpx 60rpx;
}

.user-card {
  background: white;
  border-radius: 68rpx;
  padding: 36rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 36rpx;
  box-shadow: 0 24rpx 60rpx rgba(107, 78, 61, 0.05);
  transition: all 0.2s ease;

  &:active {
    transform: translateY(-4rpx);
  }
}

.user-left {
  display: flex;
  align-items: center;
  gap: 32rpx;
}

.avatar-wrapper {
  position: relative;
}

.user-avatar {
  width: 144rpx;
  height: 144rpx;
  border-radius: 56rpx;
  object-fit: cover;
  border: 6rpx solid #ffe7ef;
}

.online-dot {
  position: absolute;
  right: 4rpx;
  bottom: 4rpx;
  width: 32rpx;
  height: 32rpx;
  border-radius: 999rpx;
  background: #8ed39b;
  border: 6rpx solid white;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name-row {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.user-info {
  flex: 1;
  min-width: 0;
  overflow: hidden;
}

.user-name {
  font-size: 40rpx;
  font-weight: 800;
  color: #3f3232;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
  display: block;
}

.level-badge {
  height: 60rpx;
  padding: 0 24rpx;
  border-radius: 999rpx;
  display: flex;
  align-items: center;
  justify-content: center;

  &.level-green {
    background: #e7f4e5;
    .level-text {
      color: #6e9d68;
    }
  }

  &.level-yellow {
    background: #f5eed7;
    .level-text {
      color: #a38b47;
    }
  }

  &.level-pink {
    background: #ffe7ef;
    .level-text {
      color: #c27895;
    }
  }
}

.level-text {
  font-size: 26rpx;
  font-weight: 800;
}

.user-desc {
  margin-top: 20rpx;
  font-size: 28rpx;
  color: #a89b9b;
  line-height: 1.8;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
}

.action-btn {
  min-width: 188rpx;
  height: 96rpx;
  border: none;
  border-radius: 36rpx;
  background: linear-gradient(135deg, #ffd9e5, #ffc9da);
  box-shadow: 0 16rpx 40rpx rgba(255, 201, 218, 0.28);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:active {
    transform: scale(1.03);
  }

  &.unfollow {
    background: white;
    border: 4rpx solid #ffd9e5;

    .btn-text {
      color: #7a5c62;
    }
  }
}

.btn-text {
  font-size: 30rpx;
  font-weight: 800;
  color: #7a5c62;
}

.bottom-hint {
  display: none;
}

.empty-state {
  margin-top: 68rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.empty-icon {
  width: 144rpx;
  height: 144rpx;
  border-radius: 999rpx;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 20rpx 48rpx rgba(107, 78, 61, 0.04);
}

.empty-icon::after {
  content: "";
  width: 48rpx;
  height: 48rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23E5D7D7' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 2l-2.5 5-5 .7 3.7 3.6-.9 5.1 4.7-2.5 4.7 2.5-.9-5.1 3.7-3.6-5-.7L12 2z'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;
}

.empty-text {
  margin-top: 36rpx;
  font-size: 30rpx;
  font-weight: 600;
  color: #c7bdbd;
}
</style>
