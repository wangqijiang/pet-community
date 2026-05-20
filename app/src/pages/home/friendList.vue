<template>
  <view class="friend-list-container">
    <TopNavBar title="附近狗友" showBack="true" />

    <view class="search-bar">
      <view class="search-input">
        <view class="search-icon"></view>
        <input
          type="text"
          v-model="searchText"
          placeholder="搜索狗友昵称或宠物品种"
          placeholder-class="search-placeholder"
        />
        <view
          class="search-clear"
          v-if="searchText"
          @click="searchText = ''"
        ></view>
      </view>
    </view>

    <view class="friend-list">
      <view
        v-for="(friend, index) in friendList"
        :key="index"
        class="friend-item"
        @click="goToChat(friend)"
      >
        <view class="friend-avatar">
          <view class="avatar-bg" :style="{ background: friend.color }"></view>
        </view>
        <view class="friend-info">
          <view class="friend-header">
            <text class="friend-name">{{ friend.name }}</text>
            <view class="friend-breed" :class="friend.breed">{{
              friend.breed
            }}</view>
          </view>
          <text class="friend-pet">{{ friend.petName }}</text>
          <text class="friend-distance">{{ friend.distance }}</text>
        </view>
        <view class="friend-action">
          <view class="action-btn">
            <text class="action-text">打招呼</text>
          </view>
        </view>
      </view>
    </view>

    <view class="list-footer">
      <text class="footer-text">- 已显示全部狗友 -</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import TopNavBar from "@/components/common/TopNavBar.vue";
import { ref } from "vue";

const searchText = ref("");

const friendList = [
  {
    name: "小明",
    petName: "金毛犬 - 旺财",
    breed: "golden",
    distance: "100m",
    color: "#FFC1E9",
  },
  {
    name: "阿花",
    petName: "泰迪犬 - 球球",
    breed: "teddy",
    distance: "200m",
    color: "#FFD4F0",
  },
  {
    name: "旺财",
    petName: "哈士奇 - 二哈",
    breed: "husky",
    distance: "300m",
    color: "#FFB6C1",
  },
  {
    name: "球球",
    petName: "柯基犬 - 短腿",
    breed: "corgi",
    distance: "400m",
    color: "#FFC0CB",
  },
  {
    name: "豆豆",
    petName: "萨摩耶 - 小白",
    breed: "samoyed",
    distance: "500m",
    color: "#FFE4E1",
  },
  {
    name: "乐乐",
    petName: "柴犬 - 小柴",
    breed: "shiba",
    distance: "600m",
    color: "#FFB6C1",
  },
  {
    name: "小美",
    petName: "法斗 - 胖胖",
    breed: "french",
    distance: "700m",
    color: "#FFD4F0",
  },
  {
    name: "大壮",
    petName: "拉布拉多 - 大黑",
    breed: "labrador",
    distance: "800m",
    color: "#FFC1E9",
  },
];

const goToChat = (friend: any) => {
  uni.navigateTo({
    url: `/pages/message/chat?name=${friend.name}`,
  });
};
</script>

<style lang="scss" scoped>
.friend-list-container {
  min-height: 100vh;
  background: #fff9f9;
}

.search-bar {
  padding: 24rpx 32rpx;
}

.search-input {
  display: flex;
  align-items: center;
  background: #ffffff;
  border-radius: 24rpx;
  padding: 20rpx 24rpx;
  border: 2rpx solid #ffc1e9;
}

.search-icon {
  width: 36rpx;
  height: 36rpx;
  margin-right: 16rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23FFC1E9'%3E%3Cpath d='M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.77l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;
}

.search-placeholder {
  font-size: 26rpx;
  color: #999999;
  width: 100%;
}

.search-clear {
  width: 36rpx;
  height: 36rpx;
  margin-left: auto;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23999999'%3E%3Cpath d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;
}

.friend-list {
  padding: 0 32rpx;
}

.friend-item {
  display: flex;
  align-items: center;
  background: #ffffff;
  border-radius: 24rpx;
  padding: 24rpx;
  margin-bottom: 24rpx;
  border: 2rpx solid #ffc1e9;

  &:active {
    transform: scale(1);
  }
}

.friend-avatar {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  padding: 4rpx;
  background: #ffc1e9;
  margin-right: 24rpx;
}

.avatar-bg {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.friend-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.friend-header {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.friend-name {
  font-size: 30rpx;
  font-weight: 600;
  color: #333333;
}

.friend-breed {
  font-size: 22rpx;
  padding: 4rpx 12rpx;
  border-radius: 12rpx;

  &.golden {
    background: rgba(255, 215, 0, 0.3);
    color: #b8860b;
  }
  &.teddy {
    background: rgba(139, 69, 19, 0.3);
    color: #8b4513;
  }
  &.husky {
    background: rgba(100, 149, 237, 0.3);
    color: #4169e1;
  }
  &.corgi {
    background: rgba(255, 165, 0, 0.3);
    color: #d2691e;
  }
  &.samoyed {
    background: rgba(211, 211, 211, 0.3);
    color: #696969;
  }
  &.shiba {
    background: rgba(255, 140, 0, 0.3);
    color: #cd853f;
  }
  &.french {
    background: rgba(128, 128, 128, 0.3);
    color: #333333;
  }
  &.labrador {
    background: rgba(169, 169, 169, 0.3);
    color: #555555;
  }
}

.friend-pet {
  font-size: 26rpx;
  color: #999999;
}

.friend-distance {
  font-size: 24rpx;
  color: #ffc1e9;
}

.friend-action {
  margin-left: 24rpx;
}

.action-btn {
  padding: 16rpx 32rpx;
  background: #ffc1e9;
  border-radius: 24rpx;

  &:active {
    transform: scale(1);
  }
}

.action-text {
  font-size: 26rpx;
  color: #ffffff;
  font-weight: 600;
}

.list-footer {
  padding: 40rpx;
  text-align: center;
}

.footer-text {
  font-size: 24rpx;
  color: #e5e5e5;
}
</style>
