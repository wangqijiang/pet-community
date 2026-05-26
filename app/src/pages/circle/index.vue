<template>
  <view class="circle-container">
    <TopNavBar title="萌宠朋友圈 🐾" :showBack="false" rightIcon="icon-ellipsis" />

    <view class="category-tabs">
      <scroll-view scroll-x class="tab-scroll">
        <view class="tab-list">
          <view
            v-for="(tab, index) in tabs"
            :key="index"
            class="tab-item"
            :class="{ active: currentTab === index }"
            @click="currentTab = index"
          >
            {{ tab.label }}
          </view>
        </view>
      </scroll-view>
    </view>

    <scroll-view scroll-y class="feed-list">
      <view
        v-for="(item, index) in filteredList"
        :key="index"
        class="feed-card"
        @click="goToDetail(item)"
      >
        <view class="card-header">
          <view class="user-row">
            <view class="user-left">
              <view class="user-avatar" @tap="goToUserProfile(item)">
                <view
                  class="avatar-bg"
                  :style="{ background: item.avatarColor }"
                ></view>
              </view>
              <view class="user-info">
                <view class="user-name-row">
                  <text class="user-name">{{ item.userName }}</text>
                  <text class="level">Lv.2</text>
                </view>
                <text class="user-meta">20分钟前 · 杭州</text>
              </view>
            </view>
            <view class="more-icon"></view>
          </view>
        </view>

        <text class="card-content">{{ item.content }}</text>

        <view class="card-images" v-if="item.images.length > 0">
          <view
            v-for="(img, imgIndex) in item.images"
            :key="imgIndex"
            class="image-item"
            :style="{ background: img.color }"
            @click.stop="previewImage(item, imgIndex)"
          ></view>
        </view>

        <view class="location" v-if="item.location">
          <view class="location-left">
            <view class="location-icon"></view>
            <text class="location-text">{{ item.location }}</text>
          </view>
          <text class="location-distance">{{ item.distance }}</text>
        </view>

        <view class="card-footer">
          <view class="footer-left">
            <view class="footer-item" @click.stop="handleLike(item)">
              <view class="footer-icon" :class="{ liked: item.liked }">
                <view class="like-icon"></view>
              </view>
              <text class="footer-count">{{ item.likes }}</text>
            </view>
            <view class="footer-item">
              <view class="footer-icon">
                <view class="comment-icon"></view>
              </view>
              <text class="footer-count">{{ item.comments }}</text>
            </view>
          </view>
          <view class="footer-item" @click.stop="handleShare">
            <view class="share-icon"></view>
          </view>
        </view>
      </view>
    </scroll-view>

    <view class="fab" @click="goToPublish">
      <view class="fab-icon"></view>
    </view>

    <TabBar :current="1" />
  </view>
</template>

<script setup lang="ts">
import TopNavBar from "@/components/common/TopNavBar.vue";
import TabBar from "@/components/common/TabBar.vue";
import { ref, computed } from "vue";

const currentTab = ref(0);

const goToUserProfile = (item: any) => {
  uni.navigateTo({
    url: `/pages/mine/userProfile?id=${item.id}&name=${encodeURIComponent(item.userName)}`,
  });
};

const tabs = [
  { label: "全部动态", key: "all" },
  { label: "修勾日常", key: "daily" },
  { label: "技能秀场", key: "skill" },
  { label: "寻宠启事", key: "lost" },
  { label: "遛狗搭子", key: "walk" },
  { label: "养宠种草", key: "share" },
];

const feedList = ref([
  {
    id: 1,
    userName: "布丁麻麻",
    avatarColor: "#FFC1E9",
    userTag: "柯基 · 2岁",
    content:
      "今天带布丁去公园撒欢啦！\n秋天的草地太舒服了，它开心得像个小疯子～🍂🐶",
    images: [
      { color: "#FFE4E1" },
      { color: "#FFD4F0" },
      { color: "#FFC1E9" },
      { color: "#FFB6C1" },
    ],
    location: "西湖边 · 太子湾公园",
    distance: "2.3km",
    category: "daily",
    likes: 96,
    comments: 18,
    liked: false,
  },
  {
    id: 2,
    userName: "喵星人领养中心",
    avatarColor: "#E8F5E9",
    userTag: "志愿者",
    content:
      "新来的小橘太粘人啦！一进门就开始蹭腿，求一个有缘的家庭带它回家～ 坐标上海。🍊",
    images: [{ color: "#FFF4D2" }],
    location: "上海市 · 徐汇区",
    distance: "5.6km",
    category: "lost",
    likes: 456,
    comments: 89,
    liked: true,
  },
  {
    id: 3,
    userName: "金毛铲屎官",
    avatarColor: "#FFD4F0",
    userTag: "金毛 · 3岁",
    content:
      "今天训练了新技能！握手、趴下、打滚一气呵成，奖励了超多零食～🐾",
    images: [{ color: "#FFE4E1" }, { color: "#FFC1E9" }],
    location: "北京 · 奥林匹克公园",
    distance: "1.2km",
    category: "skill",
    likes: 234,
    comments: 45,
    liked: false,
  },
  {
    id: 4,
    userName: "遛狗达人",
    avatarColor: "#FFB6C1",
    userTag: "哈士奇 · 1岁",
    content:
      "有没有住在朝阳区的小伙伴？每天晚上7点左右在望京公园遛狗，想找个搭子一起～",
    images: [{ color: "#FFD4F0" }],
    location: "北京 · 望京公园",
    distance: "3.8km",
    category: "walk",
    likes: 89,
    comments: 23,
    liked: false,
  },
  {
    id: 5,
    userName: "养宠新手",
    avatarColor: "#FFC0CB",
    userTag: "泰迪 · 6个月",
    content:
      "推荐这款狗粮！我家宝贝吃了三个月，毛发明显变亮了，而且消化也很好～",
    images: [{ color: "#E8F5E9" }, { color: "#FFF4D2" }, { color: "#FFE4E1" }],
    location: "广州 · 天河公园",
    distance: "0.8km",
    category: "share",
    likes: 156,
    comments: 38,
    liked: true,
  },
]);

const filteredList = computed(() => {
  if (currentTab.value === 0) return feedList.value;
  const categoryKey = tabs[currentTab.value].key;
  return feedList.value.filter((item) => item.category === categoryKey);
});

const goToPublish = () => {
  uni.navigateTo({
    url: "/pages/circle/publish",
  });
};

const goToDetail = (item: any) => {
  uni.navigateTo({
    url: "/pages/circle/detail?id=" + item.id,
  });
};

const handleLike = (item: any) => {
  if (!item.liked) {
    item.liked = true;
    item.likes += 1;
    uni.vibrateShort({ type: "light" });
  }
};

const handleShare = () => {
  uni.showShareMenu({
    withShareTicket: true,
  });
};

const previewImage = (item: any, index: number) => {
  const imageUrls = item.images.map((img: any) => {
    return `https://via.placeholder.com/400x400/${img.color.replace("#", "")}`;
  });
  uni.previewImage({
    urls: imageUrls,
    current: index,
  });
};


</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";

.circle-container {
  height: 100vh;
  background: $color-bg-primary;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.category-tabs {
  padding: 24rpx 32rpx;
  flex-shrink: 0;
}

.tab-scroll {
  white-space: nowrap;
}

.tab-list {
  display: inline-flex;
  gap: 20rpx;
}

.tab-item {
  flex-shrink: 0;
  padding: 20rpx 32rpx;
  background: $color-bg-white;
  border-radius: 999rpx;
  font-size: 26rpx;
  color: #7A6E6E;
  transition: all $transition-base;

  &.active {
    background: #FFE2C2;
    color: #D97D2F;
    font-weight: 600;
  }
}

.feed-list {
  flex: 1;
  padding: 0 32rpx;
  padding-bottom: calc(240rpx + env(safe-area-inset-bottom));
  padding-bottom: calc(240rpx + constant(safe-area-inset-bottom));
  box-sizing: border-box;
}

.feed-card {
  background: $color-bg-white;
  border-radius: 24rpx;
  padding: 32rpx;
  margin-bottom: 36rpx;
  box-shadow: 0 12rpx 40rpx rgba(107, 78, 61, 0.06);
}

.card-header {
  margin-bottom: 28rpx;
}

.user-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-left {
  display: flex;
  gap: 24rpx;
  align-items: center;
}

.user-avatar {
  width: 96rpx;
  height: 96rpx;
  border-radius: 50%;
}

.avatar-bg {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.user-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.user-name-row {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.user-name {
  font-size: 32rpx;
  font-weight: 700;
  color: #3D2F2F;
}

.level {
  background: #FFF0D9;
  color: #E49743;
  font-size: 22rpx;
  padding: 6rpx 16rpx;
  border-radius: 999rpx;
  font-weight: 600;
}

.user-meta {
  font-size: 24rpx;
  color: #9B9090;
}

.more-icon {
  width: 40rpx;
  height: 40rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%237A6E6E'%3E%3Cpath d='M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;
}

.card-content {
  font-size: 30rpx;
  color: #4D3E3E;
  line-height: 1.8;
  margin-bottom: 28rpx;
}

.card-images {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16rpx;
  margin-bottom: 28rpx;
}

.image-item {
  aspect-ratio: 1;
  border-radius: 16rpx;
}

.location {
  background: #FFF5EA;
  border-radius: 16rpx;
  padding: 24rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32rpx;
}

.location-left {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.location-icon {
  width: 32rpx;
  height: 32rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%237B5B45'%3E%3Cpath d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;
}

.location-text {
  font-size: 28rpx;
  color: #7B5B45;
}

.location-distance {
  font-size: 28rpx;
  color: #7B5B45;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 32rpx;
}

.footer-left {
  display: flex;
  gap: 36rpx;
}

.footer-item {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.footer-icon {
  width: 36rpx;
  height: 36rpx;

  &.liked {
    .like-icon {
      background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23FF4757'%3E%3Cpath d='M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z'/%3E%3C/svg%3E")
        no-repeat center;
      background-size: 100%;
    }
  }
}

.like-icon {
  width: 100%;
  height: 100%;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%237A6E6E' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;
}

.comment-icon {
  width: 100%;
  height: 100%;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%237A6E6E' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;
}

.share-icon {
  width: 36rpx;
  height: 36rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%237A6E6E' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;
}

.footer-count {
  font-size: 28rpx;
  color: #7A6E6E;
}

.fab {
  position: fixed;
  bottom: 220rpx;
  right: 40rpx;
  width: 116rpx;
  height: 116rpx;
  background: linear-gradient(135deg, #FFB36B, #FFA552);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 20rpx 48rpx rgba(255, 179, 107, 0.4);
  z-index: 9999;
}

.fab-icon {
  width: 48rpx;
  height: 48rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23FFFFFF' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 5v14M5 12h14'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;
}
</style>
