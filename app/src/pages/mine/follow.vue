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
              </view>
              <view class="user-info">
                <view class="user-name-row">
                  <text class="user-name">{{ user.nickname }}</text>
                  <view class="level-badge" :class="user.levelClass">
                    <text class="level-text">LV.{{ user.level }}</text>
                  </view>
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

        <!-- 底部提示 -->
        <view class="bottom-hint">
          <view class="hint-icon"></view>
          <text class="hint-text">到底啦，去发现更多可爱的TA吧</text>
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
    avatar: "/static/images/avatar-default.png",
    nickname: "豆包妈",
    level: 8,
    levelClass: "level-tertiary",
    desc: "家里有三只可爱的小柴~",
    isFollowed: true,
  },
  {
    id: 2,
    avatar: "/static/images/avatar-default.png",
    nickname: "汪汪特工队",
    level: 5,
    levelClass: "level-secondary",
    desc: "专业训犬日常分享",
    isFollowed: true,
  },
  {
    id: 3,
    avatar: "/static/images/avatar-default.png",
    nickname: "大金毛嘟嘟",
    level: 12,
    levelClass: "level-primary",
    desc: "一个温暖的大个子~",
    isFollowed: true,
  },
  {
    id: 4,
    avatar: "/static/images/avatar-default.png",
    nickname: "法斗皮皮",
    level: 3,
    levelClass: "level-tertiary",
    desc: "丑萌天花板代言人",
    isFollowed: true,
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
  background: #fff8f7;
}

.page-content {
  padding-bottom: calc(152rpx + env(safe-area-inset-bottom));
}

.content-scroll {
  width: 100%;
  box-sizing: border-box;
  height: calc(100vh - 200rpx);
  padding: 0 40rpx;
  padding-top: 16rpx;
}

/* 搜索框 */
.search-bar {
  display: flex;
  align-items: center;
  background: #ffffff;
  border-radius: 48rpx;
  padding: 20rpx 32rpx;
  margin-bottom: 32rpx;
  box-shadow: 0 4rpx 16rpx rgba(168, 155, 157, 0.08);
  border: 2rpx solid rgba(255, 221, 226, 0.2);
}

.search-icon {
  width: 40rpx;
  height: 40rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2371585c'%3E%3Cpath d='M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;
  opacity: 0.6;
}

.search-input {
  flex: 1;
  font-size: 28rpx;
  margin-left: 16rpx;
  color: #1e1b1b;
}

.search-placeholder {
  color: #807476;
  opacity: 0.5;
  width: 100%;
}

/* 用户列表 */
.user-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.user-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #ffffff;
  border-radius: 48rpx;
  padding: 32rpx;
  box-shadow: 0 8rpx 32rpx rgba(168, 155, 157, 0.12);
  border: 2rpx solid rgba(255, 221, 226, 0.3);
  transition: transform 0.2s ease;

  &:active {
    transform: scale(1);
  }
}

.user-left {
  display: flex;
  align-items: center;
  gap: 24rpx;
}

.avatar-wrapper {
  width: 112rpx;
  height: 112rpx;
  border-radius: 50%;
  border: 4rpx solid #ffdde2;
  overflow: hidden;
  padding: 4rpx;
  background: #ffffff;
}

.user-avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.user-name-row {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.user-name {
  font-size: 32rpx;
  font-weight: 600;
  color: #1e1b1b;
}

.level-badge {
  padding: 4rpx 12rpx;
  border-radius: 20rpx;

  &.level-primary {
    background: #ffdde2;
    .level-text {
      color: #795f64;
    }
  }

  &.level-secondary {
    background: #eadfbd;
    .level-text {
      color: #6a6347;
    }
  }

  &.level-tertiary {
    background: #daead8;
    .level-text {
      color: #5b6a5c;
    }
  }
}

.level-text {
  font-size: 20rpx;
  font-weight: 700;
  letter-spacing: 0.05em;
}

.user-desc {
  font-size: 24rpx;
  color: #4f4446;
  opacity: 0.7;
}

.action-btn {
  padding: 16rpx 32rpx;
  background: linear-gradient(135deg, #71585c 0%, #9a7a7e 100%);
  border-radius: 100rpx;
  transition: transform 0.2s ease;

  &:active {
    transform: scale(1);
  }

  &.unfollow {
    background: #fcdadf;
    border: 2rpx solid #ffdde2;

    .btn-text {
      color: #584145;
    }
  }
}

.btn-text {
  font-size: 24rpx;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 0.05em;
}

.bottom-hint {
  padding: 48rpx 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
  opacity: 0.3;
}

.hint-icon {
  width: 64rpx;
  height: 64rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2371585c'%3E%3Cpath d='M12 2l-2.5 5-5 .7 3.7 3.6-.9 5.1 4.7-2.5 4.7 2.5-.9-5.1 3.7-3.6-5-.7L12 2z'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;
}

.hint-text {
  font-size: 22rpx;
  color: #4f4446;
}
</style>
