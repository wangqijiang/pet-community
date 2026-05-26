<template>
  <view class="follow-page">
    <TopNavBar title="关注列表" :showBack="true" />

    <view class="page-content">
      <scroll-view
        class="content-scroll"
        scroll-y
        @scrolltolower="loadMore"
        refresher-enabled
        @refresherrefresh="onRefresh"
      >
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
      </scroll-view>
    </view>

    <Loading :visible="loading" />
  </view>
</template>

<script setup>
import { ref, onMounted } from "vue";
import TopNavBar from "@/components/common/TopNavBar.vue";
import Loading from "@/components/common/Loading.vue";

const loading = ref(false);
const searchText = ref("");

const userList = ref([
  {
    id: 1,
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop",
    nickname: "豆包妈",
    level: 8,
    levelClass: "level-green",
    desc: "家里有三只可爱的小柴～",
    isFollowed: true,
    isOnline: true,
  },
  {
    id: 2,
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop",
    nickname: "汪汪特工队",
    level: 5,
    levelClass: "level-yellow",
    desc: "专业训犬日常分享",
    isFollowed: true,
    isOnline: false,
  },
  {
    id: 3,
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop",
    nickname: "大金毛嘟嘟",
    level: 12,
    levelClass: "level-pink",
    desc: "一个温暖的大个子～",
    isFollowed: true,
    isOnline: false,
  },
  {
    id: 4,
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=400&auto=format&fit=crop",
    nickname: "法斗皮皮",
    level: 3,
    levelClass: "level-green",
    desc: "丑萌天花板代言人",
    isFollowed: true,
    isOnline: false,
  },
]);

onMounted(() => {
  loadFollowList();
});

const loadFollowList = () => {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
  }, 1000);
};

const onRefresh = () => {
  loadFollowList();
};

const loadMore = () => {
  console.log("Load more");
};

const handleUnfollow = (user) => {
  uni.vibrateShort({ type: "medium" });
  uni.showModal({
    title: "提示",
    content: `确定取消关注 ${user.nickname} 吗？`,
    success: (res) => {
      if (res.confirm) {
        const index = userList.value.findIndex((u) => u.id === user.id);
        if (index > -1) {
          userList.value.splice(index, 1);
        }
        uni.showToast({
          title: "已取消关注",
          icon: "success",
        });
      }
    },
  });
};

const goToUserProfile = (userId) => {
  uni.navigateTo({
    url: `/pages/mine/userProfile?id=${userId}`,
  });
};
</script>

<style lang="scss" scoped>
.follow-page {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(180deg, #fff8f5 0%, #fff6f2 100%);
}

.page-content {
  padding-bottom: calc(152rpx + env(safe-area-inset-bottom));
}

.content-scroll {
  width: 100%;
  box-sizing: border-box;
  height: calc(100vh - 200rpx);
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

.user-name {
  font-size: 40rpx;
  font-weight: 800;
  color: #3f3232;
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
