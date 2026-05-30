<template>
  <view class="user-profile-page">
    <TopNavBar title="用户主页" :showBack="true" />

    <view class="page-content">
      <scroll-view class="content-scroll" scroll-y>
        <!-- 个人资料头部 -->
        <view class="profile-header">
          <view class="avatar-wrapper">
            <image
              class="user-avatar"
              :src="avatarUrl"
              mode="aspectFill"
            ></image>
            <view class="pet-badge">
              <view class="pet-icon"></view>
            </view>
          </view>
          <view class="profile-info">
            <text class="user-name">{{ profile?.username || "用户" }}</text>
            <text class="user-desc">{{ profile?.signature || "这个人很懒，什么都没写" }}</text>
          </view>
        </view>

        <!-- 操作按钮 -->
        <view class="action-buttons">
          <view
            class="action-btn"
            :class="{ followed: isFollowing }"
            @tap="handleFollow"
          >
            <view v-if="isFollowing" class="check-icon"></view>
            <text class="btn-text">{{ isFollowing ? "已关注" : "关注" }}</text>
          </view>
          <view class="action-btn secondary" @tap="sendMessage">
            <view class="message-icon"></view>
            <text class="btn-text">发私信</text>
          </view>
        </view>

        <!-- 数据统计 -->
        <view class="stats-bar">
          <view class="stat-item">
            <text class="stat-number">{{ profile?.posts_count ?? 0 }}</text>
            <text class="stat-label">动态</text>
          </view>
          <view class="stat-divider"></view>
          <view class="stat-item">
            <text class="stat-number">{{ profile?.pets_count ?? 0 }}</text>
            <text class="stat-label">宠物</text>
          </view>
          <view class="stat-divider"></view>
          <view class="stat-item">
            <text class="stat-number">{{ profile?.followers_count ?? 0 }}</text>
            <text class="stat-label">粉丝</text>
          </view>
        </view>

        <!-- TA的宠物 -->
        <view class="pets-section">
          <view class="section-header">
            <text class="section-title">TA的宠物</text>
            <text class="view-all">查看全部</text>
          </view>
          <scroll-view class="pets-scroll" scroll-x v-if="pets.length">
            <view class="pets-list">
              <view
                v-for="pet in pets"
                :key="pet.id"
                class="pet-card"
                @tap="goToPetProfile(pet.id)"
              >
                <image
                  class="pet-cover"
                  :src="petAvatar(pet.avatar)"
                  mode="aspectFill"
                ></image>
                <view class="pet-info">
                  <text class="pet-name">{{ pet.name }}</text>
                  <text class="pet-detail">{{ pet.breed }} · {{ formatAge(pet.age) }}</text>
                </view>
                <view v-if="pet.personality" class="pet-tag">{{ pet.personality.split(/[,，]/)[0] }}</view>
              </view>
            </view>
          </scroll-view>
          <view v-else class="empty-pets">
            <text>暂无宠物</text>
          </view>
        </view>

        <!-- TA的萌宠日常 -->
        <view class="feed-section">
          <view class="section-header">
            <text class="section-title">TA的萌宠日常</text>
          </view>
          <view class="feed-grid" v-if="posts.length">
            <view
              v-for="(post, index) in posts"
              :key="post.id"
              class="feed-card"
              :class="{ tall: index === 0 }"
              @tap="goToFeedDetail(post.id)"
            >
              <image
                v-if="postCover(post)"
                class="feed-image"
                :src="postCover(post)"
                mode="aspectFill"
              ></image>
              <view class="feed-info">
                <text class="feed-content">{{ post.content }}</text>
                <view class="feed-stats">
                  <view class="feed-stat">
                    <view class="like-icon" :class="{ filled: post.liked }"></view>
                    <text class="stat-num">{{ post.likes ?? 0 }}</text>
                  </view>
                  <view class="feed-stat">
                    <view class="comment-icon"></view>
                    <text class="stat-num">{{ post.comments ?? 0 }}</text>
                  </view>
                </view>
              </view>
            </view>
          </view>
          <view v-else class="empty-pets">
            <text>暂无动态</text>
          </view>
        </view>
      </scroll-view>
    </view>

    <Loading :visible="loading" />
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import TopNavBar from "@/components/common/TopNavBar.vue";
import Loading from "@/components/common/Loading.vue";
import {
  getUserById,
  followUser,
  unfollowUser,
  isFollowing as checkFollowing,
  type UserInfo,
} from "@/api/user";
import { getUserPets, type Pet } from "@/api/pet";
import { getPostList, type Post } from "@/api/post";
import { resolveMediaUrl } from "@/utils/media";
import { formatPetAge, parseJsonArray } from "@/utils/format";

const loading = ref(false);
const userId = ref(0);
const profile = ref<UserInfo | null>(null);
const pets = ref<Pet[]>([]);
const posts = ref<Post[]>([]);
const isFollowing = ref(false);
const defaultAvatar = "/static/images/avatar-default.png";

const avatarUrl = computed(() =>
  profile.value?.avatar
    ? resolveMediaUrl(profile.value.avatar)
    : defaultAvatar,
);

const formatAge = formatPetAge;
const petAvatar = (url?: string) =>
  url ? resolveMediaUrl(url) : "/static/images/post-default.png";

const postCover = (post: Post) => {
  const imgs = parseJsonArray<string>(post.images);
  return imgs[0] ? resolveMediaUrl(imgs[0]) : "";
};

onLoad((options) => {
  userId.value = Number(options?.id || 0);
  if (userId.value) loadUserProfile();
});

const loadUserProfile = async () => {
  loading.value = true;
  try {
    const [user, petRes, postRes, following] = await Promise.all([
      getUserById(userId.value),
      getUserPets(userId.value, 1, 10),
      getPostList(1, 10, userId.value),
      checkFollowing(userId.value).catch(() => false),
    ]);
    profile.value = user;
    pets.value = petRes.list;
    posts.value = postRes.list;
    isFollowing.value = following;
  } catch {
    uni.showToast({ title: "加载失败", icon: "none" });
  } finally {
    loading.value = false;
  }
};

const handleFollow = async () => {
  uni.vibrateShort({ type: "light" });
  try {
    if (isFollowing.value) {
      await unfollowUser(userId.value);
      isFollowing.value = false;
      if (profile.value) {
        profile.value.followers_count = Math.max(
          0,
          (profile.value.followers_count || 0) - 1,
        );
      }
      uni.showToast({ title: "已取消关注", icon: "success" });
    } else {
      await followUser(userId.value);
      isFollowing.value = true;
      if (profile.value) {
        profile.value.followers_count =
          (profile.value.followers_count || 0) + 1;
      }
      uni.showToast({ title: "关注成功", icon: "success" });
    }
  } catch {
    uni.showToast({ title: "操作失败", icon: "none" });
  }
};

const sendMessage = () => {
  uni.vibrateShort({ type: "light" });
  const name = encodeURIComponent(profile.value?.username || "用户");
  uni.navigateTo({
    url: `/pages/message/chat?userId=${userId.value}&name=${name}`,
  });
};

const goToPetProfile = (petId: number) => {
  uni.navigateTo({ url: `/pages/mine/petProfile?id=${petId}` });
};

const goToFeedDetail = (feedId: number) => {
  uni.navigateTo({ url: `/pages/circle/detail?id=${feedId}` });
};
</script>

<style lang="scss" scoped>
.user-profile-page {
  width: 100%;
  min-height: 100vh;
  background: #fff8f7;
}

.page-content {
  padding-bottom: calc(152rpx + env(safe-area-inset-bottom));
  padding-bottom: calc(152rpx + env(safe-area-inset-bottom));
}

.content-scroll {
  width: 100%;
  box-sizing: border-box;
  height: calc(100vh - 200rpx);
  padding: 0 40rpx;
  padding-top: 16rpx;
}

/* 个人资料头部 */
.profile-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 40rpx 0;
  gap: 24rpx;
}

.avatar-wrapper {
  position: relative;
}

.user-avatar {
  width: 192rpx;
  height: 192rpx;
  border-radius: 50%;
  border: 8rpx solid #ffdde2;
  padding: 6rpx;
  background: #ffffff;
}

.pet-badge {
  position: absolute;
  right: 8rpx;
  bottom: 8rpx;
  width: 56rpx;
  height: 56rpx;
  background: #71585c;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4rpx solid #ffffff;
}

.pet-icon {
  width: 32rpx;
  height: 32rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M12 2l-2.5 5-5 .7 3.7 3.6-.9 5.1 4.7-2.5 4.7 2.5-.9-5.1 3.7-3.6-5-.7L12 2z'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;
}

.profile-info {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
  flex: 1;
  min-width: 0;
  overflow: hidden;
}

.empty-pets {
  padding: 48rpx;
  text-align: center;
  color: #8a7f7f;
  font-size: 28rpx;
}

.user-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
  font-size: 40rpx;
  font-weight: 700;
  color: #71585c;
}

.user-desc {
  font-size: 26rpx;
  color: #4f4446;
  opacity: 0.8;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  word-break: break-all;
}

/* 操作按钮 */
.action-buttons {
  display: flex;
  gap: 24rpx;
  margin-bottom: 32rpx;
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  padding: 24rpx;
  border-radius: 48rpx;
  transition: transform 0.2s ease;

  &:active {
    transform: scale(1);
  }

  &.followed {
    background: #f3ecec;

    .btn-text {
      color: #4f4446;
    }
  }

  &.secondary {
    background: #eadfbd;

    .btn-text {
      color: #6a6347;
    }
  }
}

.btn-text {
  font-size: 30rpx;
  font-weight: 600;
}

.check-icon {
  width: 32rpx;
  height: 32rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2371585c'%3E%3Cpath d='M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;
}

.message-icon {
  width: 32rpx;
  height: 32rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%236a6347'%3E%3Cpath d='M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2z'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;
}

/* 数据统计 */
.stats-bar {
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 32rpx 0;
  margin-bottom: 32rpx;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 48rpx;
  box-shadow: 0 8rpx 32rpx rgba(168, 155, 157, 0.12);
  border: 2rpx solid #ffffff;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
}

.stat-number {
  font-size: 40rpx;
  font-weight: 700;
  color: #71585c;
}

.stat-label {
  font-size: 22rpx;
  font-weight: 700;
  color: #4f4446;
  letter-spacing: 0.05em;
}

.stat-divider {
  width: 2rpx;
  height: 60rpx;
  background: rgba(210, 195, 196, 0.3);
}

/* TA的宠物 */
.pets-section {
  margin-bottom: 32rpx;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24rpx;
}

.section-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #1e1b1b;
}

.view-all {
  font-size: 24rpx;
  font-weight: 700;
  color: #71585c;
}

.pets-scroll {
  white-space: nowrap;
  margin: 0 -8rpx;
  padding: 0 8rpx;
}

.pets-list {
  display: inline-flex;
  gap: 24rpx;
}

.pet-card {
  position: relative;
  width: 280rpx;
  background: #ffffff;
  border-radius: 48rpx;
  padding: 24rpx;
  box-shadow: 0 8rpx 32rpx rgba(168, 155, 157, 0.12);
  border: 2rpx solid rgba(255, 221, 226, 0.1);
  transition: transform 0.2s ease;

  &:active {
    transform: scale(1);
  }
}

.pet-cover {
  width: 100%;
  height: 200rpx;
  border-radius: 24rpx;
  margin-bottom: 20rpx;
}

.pet-info {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.pet-name {
  font-size: 30rpx;
  font-weight: 700;
  color: #71585c;
}

.pet-detail {
  font-size: 22rpx;
  color: #4f4446;
  opacity: 0.7;
}

.pet-tag {
  position: absolute;
  top: 24rpx;
  right: 24rpx;
  padding: 8rpx 16rpx;
  background: #daead8;
  border-radius: 20rpx;
  font-size: 20rpx;
  font-weight: 700;
  color: #5b6a5c;

  &.secondary {
    background: #eadfbd;
    color: #6a6347;
  }
}

/* TA的萌宠日常 */
.feed-section {
  margin-bottom: 40rpx;
}

.feed-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24rpx;
}

.feed-card {
  background: #ffffff;
  border-radius: 32rpx;
  overflow: hidden;
  box-shadow: 0 8rpx 32rpx rgba(168, 155, 157, 0.12);
  transition: transform 0.2s ease;

  &:active {
    transform: scale(1);
  }

  &.tall {
    grid-row: span 2;

    .feed-image {
      height: 360rpx;
    }
  }
}

.feed-image {
  width: 100%;
  height: 200rpx;
}

.feed-info {
  padding: 20rpx;
}

.feed-content {
  font-size: 24rpx;
  color: #1e1b1b;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 16rpx;
}

.feed-stats {
  display: flex;
  justify-content: space-between;
}

.feed-stat {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.like-icon {
  width: 32rpx;
  height: 32rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2371585c'%3E%3Cpath d='M12 2l-2.5 5-5 .7 3.7 3.6-.9 5.1 4.7-2.5 4.7 2.5-.9-5.1 3.7-3.6-5-.7L12 2z'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;

  &.filled {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23FF6B8A'%3E%3Cpath d='M12 2l-2.5 5-5 .7 3.7 3.6-.9 5.1 4.7-2.5 4.7 2.5-.9-5.1 3.7-3.6-5-.7L12 2z'/%3E%3C/svg%3E")
      no-repeat center;
    background-size: 100%;
  }
}

.comment-icon {
  width: 32rpx;
  height: 32rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23807476'%3E%3Cpath d='M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2z'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;
}

.stat-num {
  font-size: 22rpx;
  color: #4f4446;
}
</style>
