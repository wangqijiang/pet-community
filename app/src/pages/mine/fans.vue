<template>
  <PageLayout refresher @refresh="onRefresh" @scrolltolower="loadMore">
    <template #navbar>
      <TopNavBar title="我的粉丝" :showBack="true" />
    </template>

    <view class="page-inner fans-inner">
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

      <view class="bottom-hint">
        <view class="hint-bg">
          <text class="hint-text">暂时只有这么多粉丝啦 (•⌄•)</text>
        </view>
      </view>
    </view>

    <Loading :visible="loading" />
  </PageLayout>
</template>

<script setup lang="ts">
import { showRequestError } from "@/utils/request";
import { ref, onMounted } from "vue";
import TopNavBar from "@/components/common/TopNavBar.vue";
import PageLayout from "@/components/common/PageLayout.vue";
import Loading from "@/components/common/Loading.vue";
import { getFollowersList } from "@/api/user";
import { resolveMediaUrl } from "@/utils/media";

const loading = ref(false);
const userList = ref<
  Array<{
    id: number;
    nickname: string;
    desc: string;
    avatar: string;
    isPetLover: boolean;
  }>
>([]);

const loadFansList = async () => {
  loading.value = true;
  try {
    const res = await getFollowersList(1, 50);
    userList.value = res.list.map((u) => ({
      id: u.id,
      nickname: u.username,
      desc: u.signature || "",
      avatar: resolveMediaUrl(u.avatar),
      isPetLover: true,
    }));
  } catch (error) {
    showRequestError(error, "加载失败");
  } finally {
    loading.value = false;
  }
};

const onRefresh = () => loadFansList();
const loadMore = () => {};

const goToUserProfile = (id: number) => {
  uni.navigateTo({ url: `/pages/mine/userProfile?id=${id}` });
};

onMounted(() => {
  loadFansList();
});
</script>

<style lang="scss" scoped>
@import "@/styles/layout.scss";

.fans-inner {
  padding-top: 0;
  background: #fff8f7;
  min-height: 100%;
}

.user-list {
  padding: 24rpx 0 0;
}

.user-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28rpx 0;
  border-bottom: 1rpx solid rgba(210, 195, 196, 0.25);
}

.user-left {
  display: flex;
  align-items: center;
  gap: 24rpx;
  flex: 1;
  min-width: 0;
}

.avatar-wrapper {
  position: relative;
  flex-shrink: 0;
}

.user-avatar {
  width: 96rpx;
  height: 96rpx;
  border-radius: 50%;
  border: 4rpx solid #ffdde2;
}

.pet-badge {
  position: absolute;
  right: -4rpx;
  bottom: -4rpx;
  width: 40rpx;
  height: 40rpx;
  background: #71585c;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3rpx solid #fff;
}

.pet-icon {
  width: 24rpx;
  height: 24rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M12 2l-2.5 5-5 .7 3.7 3.6-.9 5.1 4.7-2.5 4.7 2.5-.9-5.1 3.7-3.6-5-.7L12 2z'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;
}

.user-info {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-size: 32rpx;
  font-weight: 700;
  color: #71585c;
  display: block;
  margin-bottom: 8rpx;
}

.user-desc {
  font-size: 24rpx;
  color: #8a7f7f;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.bottom-hint {
  padding: 48rpx 0 32rpx;
  display: flex;
  justify-content: center;
}

.hint-bg {
  padding: 16rpx 32rpx;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 999rpx;
}

.hint-text {
  font-size: 24rpx;
  color: #b0a6a6;
}
</style>
