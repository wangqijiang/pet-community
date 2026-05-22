<template>
  <view class="circle-container">
    <TopNavBar title="萌宠朋友圈" :showBack="false" rightIcon="icon-bell" />

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
          <view class="user-avatar">
            <view
              class="avatar-bg"
              :style="{ background: item.avatarColor }"
            ></view>
          </view>
          <view class="user-info">
            <text class="user-name">{{ item.userName }}</text>
            <view class="user-tags">
              <text class="tag">{{ item.userTag }}</text>
            </view>
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
      "今天带布丁去公园草坪打滚啦！阳光超级好，它开心得像个200斤的孩子哈哈。这就是简单的幸福吧～✨",
    images: [
      { color: "#FFE4E1" },
      { color: "#FFD4F0" },
      { color: "#FFC1E9" },
      { color: "#FFB6C1" },
    ],
    category: "daily",
    likes: 128,
    comments: 32,
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
  min-height: 100vh;
  background: $color-bg-primary;
  display: flex;
  flex-direction: column;
}

.category-tabs {
  padding: 0 32rpx;
}

.tab-scroll {
  white-space: nowrap;
}

.tab-list {
  display: inline-flex;
  gap: 16rpx;
}

.tab-item {
  flex-shrink: 0;
  padding: 16rpx 32rpx;
  background: $color-bg-white;
  border: 2rpx solid rgba(113, 88, 92, 0.1);
  border-radius: 32rpx;
  font-size: $font-size-body;
  color: $color-gray-medium;
  transition: all $transition-base;
  box-shadow: 0 4rpx 12rpx rgba(168, 155, 157, 0.08);

  &.active {
    background: rgba(113, 88, 92, 0.1);
    color: $color-primary;
    border-color: $color-primary-light;
  }
}

.feed-list {
  flex: 1;
  padding: 32rpx;
  padding-bottom: calc(200rpx + env(safe-area-inset-bottom));
  padding-bottom: calc(200rpx + constant(safe-area-inset-bottom));
  box-sizing: border-box;
}

.feed-card {
  background: $color-bg-white;
  border-radius: $border-radius-large;
  padding: 32rpx;
  margin-bottom: 32rpx;
  border: 1rpx solid rgba(113, 88, 92, 0.1);
  box-shadow: 0 8rpx 24rpx rgba(168, 155, 157, 0.08);
  transition: transform $transition-base;

  &:active {
    transform: scale(1);
    box-shadow: 0 8rpx 24rpx rgba(168, 155, 157, 0.12);
  }
}

.card-header {
  display: flex;
  align-items: flex-start;
  margin-bottom: 24rpx;
}

.user-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  padding: 4rpx;
  border: 4rpx solid $color-primary-light;
  margin-right: 20rpx;
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
  gap: 8rpx;
}

.user-name {
  font-size: $font-size-body;
  font-weight: $font-weight-bold;
  color: $color-gray-dark;
}

.user-tags {
  display: flex;
  gap: 8rpx;
}

.tag {
  padding: 6rpx 16rpx;
  background: rgba(113, 88, 92, 0.08);
  color: $color-primary;
  font-size: $font-size-helper;
  font-weight: $font-weight-bold;
  border-radius: $border-radius-small;
}
.more-icon {
  width: 36rpx;
  height: 36rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23807476'%3E%3Cpath d='M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;
}

.card-content {
  font-size: $font-size-body;
  color: $color-gray-dark;
  line-height: 1.6;
  margin-bottom: 24rpx;
}

.card-images {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16rpx;
  margin-bottom: 24rpx;
}

.image-item {
  aspect-ratio: 1;
  border-radius: $border-radius-medium;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 24rpx;
  border-top: 1rpx solid rgba(113, 88, 92, 0.1);
}

.footer-left {
  display: flex;
  gap: 32rpx;
}

.footer-item {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.footer-icon {
  width: 36rpx;
  height: 36rpx;

  &.liked {
    .like-icon {
      background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2371585C'%3E%3Cpath d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/%3E%3C/svg%3E")
        no-repeat center;
      background-size: 100%;
    }
  }
}

.like-icon {
  width: 100%;
  height: 100%;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23807476'%3E%3Cpath d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;
}

.comment-icon {
  width: 100%;
  height: 100%;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23807476'%3E%3Cpath d='M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2z'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;
}

.share-icon {
  width: 36rpx;
  height: 36rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23807476'%3E%3Cpath d='M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;
}

.footer-count {
  font-size: $font-size-helper;
  font-weight: $font-weight-bold;
  color: $color-gray-medium;
}

.fab {
  position: fixed;
  bottom: 160rpx;
  right: 32rpx;
  width: 100rpx;
  height: 100rpx;
  background: $color-primary;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 24rpx rgba(113, 88, 92, 0.3);
  z-index: 9999;

  &:active {
    transform: scale(1);
    background: $color-primary-dark;
  }
}

.fab-icon {
  width: 48rpx;
  height: 48rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23FFFFFF'%3E%3Cpath d='M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;
}
</style>
