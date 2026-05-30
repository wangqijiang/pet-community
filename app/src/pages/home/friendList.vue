<template>
  <view class="friend-list-container">
    <TopNavBar title="附近狗友" :showBack="true" />

    <view class="search-bar">
      <view class="search-input">
        <view class="search-icon"></view>
        <input
          type="text"
          v-model="searchText"
          placeholder="搜索狗友昵称或宠物品种"
          placeholder-class="search-placeholder"
          @confirm="loadFriends"
        />
        <view
          class="search-clear"
          v-if="searchText"
          @click="clearSearch"
        ></view>
      </view>
    </view>

    <view class="friend-list">
      <view
        v-for="friend in friendList"
        :key="friend.id"
        class="friend-item"
        @click="goToProfile(friend)"
      >
        <view class="friend-avatar">
          <image
            v-if="friend.avatar"
            class="avatar-img"
            :src="avatarUrl(friend.avatar)"
            mode="aspectFill"
          />
          <view v-else class="avatar-bg"></view>
        </view>
        <view class="friend-info">
          <view class="friend-header">
            <text class="friend-name">{{ friend.username }}</text>
            <view class="friend-breed" v-if="friend.breed">{{ friend.breed }}</view>
          </view>
          <text class="friend-pet">{{ friend.petLabel }}</text>
          <text class="friend-distance" v-if="friend.distance">{{ friend.distance }}</text>
        </view>
        <view class="friend-action" @click.stop="goToChat(friend)">
          <view class="action-btn">
            <text class="action-text">打招呼</text>
          </view>
        </view>
      </view>
      <view v-if="!loading && friendList.length === 0" class="list-footer">
        <text class="footer-text">暂无附近狗友</text>
      </view>
    </view>

    <view v-if="friendList.length > 0" class="list-footer">
      <text class="footer-text">- 已显示全部狗友 -</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import TopNavBar from "@/components/common/TopNavBar.vue";
import { ref, onMounted } from "vue";
import { getNearbyUsers, type NearbyUser } from "@/api/user";
import { resolveMediaUrl } from "@/utils/media";

const searchText = ref("");
const friendList = ref<NearbyUser[]>([]);
const loading = ref(false);
const lat = ref<number | undefined>();
const lng = ref<number | undefined>();

const avatarUrl = (url: string) => resolveMediaUrl(url);

const loadFriends = async () => {
  loading.value = true;
  try {
    friendList.value = await getNearbyUsers({
      lat: lat.value,
      lng: lng.value,
      keyword: searchText.value || undefined,
    });
  } catch (e) {
    uni.showToast({ title: "加载失败", icon: "none" });
  } finally {
    loading.value = false;
  }
};

const clearSearch = () => {
  searchText.value = "";
  loadFriends();
};

const goToChat = (friend: NearbyUser) => {
  uni.navigateTo({
    url: `/pages/message/chat?userId=${friend.id}&name=${encodeURIComponent(friend.username)}`,
  });
};

const goToProfile = (friend: NearbyUser) => {
  uni.navigateTo({
    url: `/pages/mine/userProfile?id=${friend.id}&name=${encodeURIComponent(friend.username)}`,
  });
};

onMounted(() => {
  uni.getLocation({
    type: "gcj02",
    success: (res) => {
      lat.value = res.latitude;
      lng.value = res.longitude;
      loadFriends();
    },
    fail: () => loadFriends(),
  });
});
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";

.friend-list-container {
  min-height: 100vh;
  background: $color-bg-primary;
}

.search-bar {
  padding: 24rpx 40rpx;
}

.search-input {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 999rpx;
  padding: 20rpx 32rpx;
  gap: 16rpx;
}

.search-icon {
  width: 32rpx;
  height: 32rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%238A7F7F'%3E%3Cpath d='M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;
}

input {
  flex: 1;
  font-size: 28rpx;
}

.friend-list {
  padding: 0 40rpx;
}

.friend-item {
  display: flex;
  align-items: center;
  padding: 32rpx 0;
  border-bottom: 1rpx solid rgba(210, 195, 196, 0.3);
}

.friend-avatar {
  width: 100rpx;
  height: 100rpx;
  margin-right: 24rpx;
}

.avatar-img,
.avatar-bg {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.avatar-bg {
  background: #ffc1e9;
}

.friend-info {
  flex: 1;
}

.friend-name {
  font-size: 32rpx;
  font-weight: 600;
  color: $color-gray-dark;
}

.friend-breed {
  font-size: 22rpx;
  padding: 4rpx 12rpx;
  background: #fff0e0;
  color: #f4a259;
  border-radius: 8rpx;
  margin-left: 12rpx;
}

.friend-header {
  display: flex;
  align-items: center;
}

.friend-pet,
.friend-distance {
  display: block;
  font-size: 24rpx;
  color: $color-gray-medium;
  margin-top: 8rpx;
}

.action-btn {
  padding: 16rpx 28rpx;
  background: $color-primary;
  border-radius: 999rpx;
}

.action-text {
  color: #fff;
  font-size: 24rpx;
}

.list-footer {
  padding: 40rpx;
  text-align: center;
}

.footer-text {
  font-size: 24rpx;
  color: $color-gray-lighter;
}
</style>
