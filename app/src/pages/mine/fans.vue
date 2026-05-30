<template>
  <view class="fans-page">
    <TopNavBar title="我的粉丝" :showBack="true" />
    <view class="page-content">
      <scroll-view
        class="content-scroll"
        scroll-y
        @scrolltolower="loadMore"
        refresher-enabled
        @refresherrefresh="onRefresh"
      >
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
                <view v-if="user.isPetLover" class="pet-badge">
                  <view class="pet-icon"></view>
                </view>
              </view>
              <view class="user-info">
                <text class="user-name">{{ user.nickname }}</text>
                <text class="user-desc">{{ user.desc }}</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 底部提示 -->
        <view class="bottom-hint">
          <view class="hint-bg">
            <text class="hint-text">暂时只有这么多粉丝啦 (•⌄•)</text>
          </view>
        </view>
      </scroll-view>
    </view>
    <Loading :visible="loading" />
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import TopNavBar from "@/components/common/TopNavBar.vue";
import Loading from "@/components/common/Loading.vue";
import { getFollowersList } from "@/api/user";
import { resolveMediaUrl } from "@/utils/media";

const loading = ref(false);

const userList = ref<
  Array<{
    id: number;
    avatar: string;
    nickname: string;
    desc: string;
    isPetLover: boolean;
  }>
>([]);

const loadFansList = async () => {
  loading.value = true;
  try {
    const res = await getFollowersList(1, 50);
    userList.value = res.list.map((u) => ({
      id: u.id,
      avatar: resolveMediaUrl(u.avatar),
      nickname: u.username,
      desc: u.signature || "",
      isPetLover: true,
    }));
  } catch {
    uni.showToast({ title: "加载失败", icon: "none" });
  } finally {
    loading.value = false;
  }
};

onMounted(loadFansList);
const onRefresh = () => loadFansList();
const loadMore = () => {};
const goToUserProfile = (userId: number) => {
  uni.navigateTo({ url: `/pages/mine/userProfile?id=${userId}` });
};
</script>

<style lang="scss" scoped>
.fans-page {
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
  border: 2rpx solid rgba(255, 221, 226, 0.4);
  transition: transform 0.2s ease;

  &:active {
    transform: scale(1);
  }
}

.user-left {
  display: flex;
  align-items: center;
  gap: 28rpx;
  flex: 1;
}

.avatar-wrapper {
  position: relative;
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

.pet-badge {
  position: absolute;
  right: -8rpx;
  bottom: -8rpx;
  width: 40rpx;
  height: 40rpx;
  background: #71585c;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4rpx solid #ffffff;
}

.pet-icon {
  width: 24rpx;
  height: 24rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M12 2l-2.5 5-5 .7 3.7 3.6-.9 5.1 4.7-2.5 4.7 2.5-.9-5.1 3.7-3.6-5-.7L12 2z'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  flex: 1;
  min-width: 0;
  overflow: hidden;
}

.user-name {
  font-size: 32rpx;
  font-weight: 600;
  color: #1e1b1b;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-desc {
  font-size: 24rpx;
  color: #4f4446;
  opacity: 0.7;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.bottom-hint {
  padding: 64rpx 0;
  display: flex;
  justify-content: center;
}

.hint-bg {
  padding: 20rpx 40rpx;
  background: rgba(234, 223, 189, 0.3);
  border-radius: 100rpx;
}

.hint-text {
  font-size: 24rpx;
  color: #6a6347;
  opacity: 0.6;
  font-weight: 700;
  letter-spacing: 0.05em;
}
</style>
