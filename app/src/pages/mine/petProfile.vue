<template>
  <PageLayout>
    <template #navbar>
      <TopNavBar title="宠物主页" :showBack="true" />
    </template>

    <view class="page-inner pet-profile-inner">
        <!-- 宠物头部信息 -->
        <view class="pet-header">
          <image
            class="pet-avatar"
            :src="petAvatar"
            mode="aspectFill"
          ></image>
          <view class="pet-info">
            <text class="pet-name">{{ pet?.name || "宠物" }}</text>
            <text class="pet-badge">{{ petSubtitle }}</text>
            <view class="pet-tags" v-if="personalityTags.length">
              <view v-for="(tag, i) in personalityTags" :key="i" class="tag">{{ tag }}</view>
            </view>
          </view>
        </view>

        <!-- 快速操作 -->
        <!-- <view class="quick-actions">
          <view class="action-item" @tap="goToAlbum">
            <view class="action-icon album-icon"></view>
            <text class="action-label">相册</text>
          </view>
          <view class="action-item" @tap="goToMoments">
            <view class="action-icon moments-icon"></view>
            <text class="action-label">动态</text>
          </view>
          <view class="action-item" @tap="goToHealth">
            <view class="action-icon health-icon"></view>
            <text class="action-label">健康</text>
          </view>
          <view class="action-item" @tap="goToTimeline">
            <view class="action-icon timeline-icon"></view>
            <text class="action-label">成长</text>
          </view>
        </view> -->

        <!-- 宠物简介 -->
        <view class="section-card">
          <view class="section-title">
            <view class="title-icon"></view>
            <text class="title-text">宠物简介</text>
          </view>
          <view class="profile-detail">
            <view class="detail-row" v-if="pet?.breed">
              <text class="detail-label">品种</text>
              <text class="detail-value">{{ pet.breed }}</text>
            </view>
            <view class="detail-row" v-if="pet?.gender">
              <text class="detail-label">性别</text>
              <text class="detail-value">{{ genderLabel }}</text>
            </view>
            <view class="detail-row" v-if="pet?.age">
              <text class="detail-label">年龄</text>
              <text class="detail-value">{{ formatAge(pet.age) }}</text>
            </view>
            <view class="detail-row" v-if="pet?.weight">
              <text class="detail-label">体重</text>
              <text class="detail-value">{{ pet.weight }}kg</text>
            </view>
            <view class="detail-row" v-if="pet?.color">
              <text class="detail-label">毛色</text>
              <text class="detail-value">{{ pet.color }}</text>
            </view>
            <view class="detail-row full" v-if="pet?.description || pet?.personality">
              <text class="detail-label">性格特点</text>
              <text class="detail-value">{{ pet.description || pet.personality }}</text>
            </view>
          </view>
        </view>

        <!-- 最近动态
        <view class="section-card">
          <view class="section-title">
            <view class="title-icon"></view>
            <text class="title-text">最近动态</text>
            <text class="view-all" @tap="goToMoments">查看全部</text>
          </view>
          <view class="feed-list">
            <view class="feed-item" @tap="goToFeedDetail(1)">
              <image
                class="feed-cover"
                src="/static/images/post-default.png"
                mode="aspectFill"
              ></image>
              <view class="feed-content">
                <text class="feed-text">今天带奶酪去公园玩，它开心得不得了！</text>
                <view class="feed-meta">
                  <text class="feed-time">2小时前</text>
                  <view class="feed-stats">
                    <view class="stat-item">
                      <view class="like-icon"></view>
                      <text>128</text>
                    </view>
                    <view class="stat-item">
                      <view class="comment-icon"></view>
                      <text>23</text>
                    </view>
                  </view>
                </view>
              </view>
            </view>
            <view class="feed-item" @tap="goToFeedDetail(2)">
              <image
                class="feed-cover"
                src="/static/images/post-default.png"
                mode="aspectFill"
              ></image>
              <view class="feed-content">
                <text class="feed-text">学会握手啦！奶酪真棒~</text>
                <view class="feed-meta">
                  <text class="feed-time">1天前</text>
                  <view class="feed-stats">
                    <view class="stat-item">
                      <view class="like-icon filled"></view>
                      <text>256</text>
                    </view>
                    <view class="stat-item">
                      <view class="comment-icon"></view>
                      <text>45</text>
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>

        <!-- 宠物相册 -->
        <!-- <view class="section-card">
          <view class="section-title">
            <view class="title-icon"></view>
            <text class="title-text">萌宠相册</text>
            <text class="view-all" @tap="goToAlbum">查看全部</text>
          </view>
          <view class="album-grid">
            <view class="album-item" @tap="previewImage(0)">
              <image
                class="album-image"
                src="/static/images/post-default.png"
                mode="aspectFill"
              ></image>
            </view>
            <view class="album-item" @tap="previewImage(1)">
              <image
                class="album-image"
                src="/static/images/post-default.png"
                mode="aspectFill"
              ></image>
            </view>
            <view class="album-item" @tap="previewImage(2)">
              <image
                class="album-image"
                src="/static/images/post-default.png"
                mode="aspectFill"
              ></image>
            </view>
            <view class="album-item" @tap="previewImage(3)">
              <image
                class="album-image"
                src="/static/images/post-default.png"
                mode="aspectFill"
              ></image>
            </view>
            <view class="album-item" @tap="previewImage(4)">
              <image
                class="album-image"
                src="/static/images/post-default.png"
                mode="aspectFill"
              ></image>
            </view>
            <view class="album-item more">
              <view class="more-info">
                <text class="more-count">+12</text>
                <text class="more-label">更多</text>
              </view>
            </view>
          </view>
        </view> -->

        <!-- 成长里程碑 -->
        <!-- <view class="section-card">
          <view class="section-title">
            <view class="title-icon"></view>
            <text class="title-text">成长里程碑</text>
          </view>
          <view class="milestone-list">
            <view class="milestone-item">
              <view class="milestone-dot"></view>
              <view class="milestone-content">
                <text class="milestone-title">第一次学会握手</text>
                <text class="milestone-time">2024-10-01</text>
              </view>
            </view>
            <view class="milestone-item">
              <view class="milestone-dot"></view>
              <view class="milestone-content">
                <text class="milestone-title">完成疫苗接种</text>
                <text class="milestone-time">2024-09-15</text>
              </view>
            </view>
            <view class="milestone-item">
              <view class="milestone-dot"></view>
              <view class="milestone-content">
                <text class="milestone-title">第一次出门遛弯</text>
                <text class="milestone-time">2024-08-20</text>
              </view>
            </view>
            <view class="milestone-item">
              <view class="milestone-dot"></view>
              <view class="milestone-content">
                <text class="milestone-title">来到新家</text>
                <text class="milestone-time">2024-06-15</text>
              </view>
            </view>
          </view>
        </view>  -->
    </view>

    <Loading :visible="loading" />
  </PageLayout>
</template>

<script setup lang="ts">
import { showRequestError, showToast } from "@/utils/request";
import { ref, computed } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import TopNavBar from "@/components/common/TopNavBar.vue";
import PageLayout from "@/components/common/PageLayout.vue";
import Loading from "@/components/common/Loading.vue";
import { getPublicPetDetail, type Pet } from "@/api/pet";
import { resolveMediaUrl } from "@/utils/media";
import { formatPetAge, formatPetGender } from "@/utils/format";

const loading = ref(false);
const petId = ref(0);
const pet = ref<Pet | null>(null);

const formatAge = formatPetAge;

const petAvatar = computed(() =>
  pet.value?.avatar
    ? resolveMediaUrl(pet.value.avatar)
    : "/static/images/post-default.png",
);

const genderLabel = computed(() => formatPetGender(pet.value?.gender));

const petSubtitle = computed(() => {
  if (!pet.value) return "";
  const parts = [
    pet.value.breed,
    formatAge(pet.value.age),
    genderLabel.value,
  ].filter(Boolean);
  return parts.join(" · ");
});

const personalityTags = computed(() => {
  const text = pet.value?.personality || "";
  return text
    .split(/[,，、]/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 4);
});

onLoad((options) => {
  petId.value = Number(options?.id || 0);
  if (petId.value) loadPetProfile();
});

const loadPetProfile = async () => {
  loading.value = true;
  try {
    pet.value = await getPublicPetDetail(petId.value);
  } catch (error) {
    showRequestError(error, "加载失败");
  } finally {
    loading.value = false;
  }
};

const goToAlbum = () => {
  uni.vibrateShort({ type: "light" });
  showToast({
    title: "相册功能开发中",
    icon: "none",
  });
};

const goToMoments = () => {
  uni.vibrateShort({ type: "light" });
  showToast({
    title: "动态功能开发中",
    icon: "none",
  });
};

const goToHealth = () => {
  uni.vibrateShort({ type: "light" });
  showToast({
    title: "健康功能开发中",
    icon: "none",
  });
};

const goToTimeline = () => {
  uni.vibrateShort({ type: "light" });
  showToast({
    title: "成长功能开发中",
    icon: "none",
  });
};

const goToFeedDetail = (feedId) => {
  uni.vibrateShort({ type: "light" });
  uni.navigateTo({
    url: `/pages/circle/detail?id=${feedId}`,
  });
};

const previewImage = (index) => {
  uni.vibrateShort({ type: "light" });
  const imageUrls = [
    "/static/images/post-default.png",
    "/static/images/post-default.png",
    "/static/images/post-default.png",
    "/static/images/post-default.png",
    "/static/images/post-default.png",
  ];
  uni.previewImage({
    urls: imageUrls,
    current: index,
  });
};
</script>

<style lang="scss" scoped>
@import "@/styles/layout.scss";

.pet-profile-inner {
  padding-top: 0;
  background: #fff8f7;
  min-height: 100%;
}

/* 宠物头部 */
.pet-header {
  display: flex;
  align-items: center;
  gap: 32rpx;
  padding: 40rpx 0;
}

.pet-avatar {
  width: 200rpx;
  height: 200rpx;
  border-radius: 50%;
  border: 8rpx solid #ffdde2;
  padding: 6rpx;
  background: #ffffff;
}

.pet-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.pet-name {
  font-size: 44rpx;
  font-weight: 700;
  color: #71585c;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}

.pet-badge {
  font-size: 26rpx;
  color: #4f4446;
  opacity: 0.8;
}

.pet-tags {
  display: flex;
  gap: 12rpx;
}

.tag {
  padding: 10rpx 20rpx;
  background: #daead8;
  border-radius: 20rpx;
  font-size: 22rpx;
  font-weight: 600;
  color: #5b6a5c;
}

/* 快速操作 */
.quick-actions {
  display: flex;
  justify-content: space-around;
  padding: 32rpx;
  margin-bottom: 32rpx;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 48rpx;
  box-shadow: 0 8rpx 32rpx rgba(168, 155, 157, 0.12);
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
  transition: transform 0.2s ease;

  &:active {
    transform: scale(0.95);
  }
}

.action-icon {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3ecec;

  &.album-icon {
    width: 48rpx;
    height: 48rpx;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2371585c'%3E%3Cpath d='M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z'/%3E%3C/svg%3E")
      no-repeat center;
    background-size: 100%;
  }

  &.moments-icon {
    width: 48rpx;
    height: 48rpx;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2371585c'%3E%3Cpath d='M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z'/%3E%3C/svg%3E")
      no-repeat center;
    background-size: 100%;
  }

  &.health-icon {
    width: 48rpx;
    height: 48rpx;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2371585c'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z'/%3E%3C/svg%3E")
      no-repeat center;
    background-size: 100%;
  }

  &.timeline-icon {
    width: 48rpx;
    height: 48rpx;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2371585c'%3E%3Cpath d='M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z'/%3E%3C/svg%3E")
      no-repeat center;
    background-size: 100%;
  }
}

.action-label {
  font-size: 24rpx;
  font-weight: 600;
  color: #4f4446;
}

/* 通用卡片 */
.section-card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 32rpx;
  padding: 32rpx;
  margin-bottom: 32rpx;
  box-shadow: 0 8rpx 32rpx rgba(168, 155, 157, 0.08);
}

.section-title {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 24rpx;
}

.title-icon {
  width: 8rpx;
  height: 32rpx;
  background: #71585c;
  border-radius: 4rpx;
}

.title-text {
  font-size: 32rpx;
  font-weight: 600;
  color: #1e1b1b;
}

.view-all {
  margin-left: auto;
  font-size: 24rpx;
  font-weight: 600;
  color: #71585c;
}

/* 宠物简介 */
.profile-detail {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12rpx 0;
  border-bottom: 1rpx solid rgba(210, 195, 196, 0.2);

  &.full {
    flex-direction: column;
    align-items: flex-start;
    gap: 8rpx;

    .detail-value {
      text-align: left;
    }
  }
}

.detail-label {
  font-size: 26rpx;
  color: #4f4446;
  opacity: 0.7;
}

.detail-value {
  font-size: 26rpx;
  font-weight: 600;
  color: #71585c;
}

/* 最近动态 */
.feed-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.feed-item {
  display: flex;
  gap: 20rpx;
  padding: 20rpx;
  background: #fff8f7;
  border-radius: 24rpx;
  transition: transform 0.2s ease;

  &:active {
    transform: scale(1);
  }
}

.feed-cover {
  width: 160rpx;
  height: 160rpx;
  border-radius: 16rpx;
  flex-shrink: 0;
}

.feed-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.feed-text {
  font-size: 26rpx;
  color: #1e1b1b;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.feed-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.feed-time {
  font-size: 22rpx;
  color: #4f4446;
  opacity: 0.6;
}

.feed-stats {
  display: flex;
  gap: 20rpx;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6rpx;

  text {
    font-size: 22rpx;
    color: #4f4446;
    opacity: 0.8;
  }
}

.like-icon {
  width: 28rpx;
  height: 28rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23807476'%3E%3Cpath d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;

  &.filled {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23FF6B8A'%3E%3Cpath d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/%3E%3C/svg%3E")
      no-repeat center;
    background-size: 100%;
  }
}

.comment-icon {
  width: 28rpx;
  height: 28rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23807476'%3E%3Cpath d='M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2z'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;
}

/* 相册 */
.album-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16rpx;
}

.album-item {
  aspect-ratio: 1;
  border-radius: 20rpx;
  overflow: hidden;
  position: relative;

  &.more {
    background: #f3ecec;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.album-image {
  width: 100%;
  height: 100%;
}

.more-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
}

.more-count {
  font-size: 32rpx;
  font-weight: 700;
  color: #71585c;
}

.more-label {
  font-size: 22rpx;
  color: #4f4446;
  opacity: 0.8;
}

/* 成长里程碑 */
.milestone-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  padding-left: 16rpx;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    left: 7rpx;
    top: 20rpx;
    bottom: 20rpx;
    width: 2rpx;
    background: linear-gradient(180deg, #71585c 0%, rgba(113, 88, 92, 0.2) 100%);
  }
}

.milestone-item {
  display: flex;
  gap: 20rpx;
  position: relative;
}

.milestone-dot {
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
  background: #71585c;
  flex-shrink: 0;
  margin-top: 6rpx;
  z-index: 1;
}

.milestone-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.milestone-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #71585c;
}

.milestone-time {
  font-size: 22rpx;
  color: #4f4446;
  opacity: 0.7;
}
</style>