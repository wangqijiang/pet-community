<template>
  <view class="circle-page">
    <TopNavBar title="萌宠圈" :show-back="false">
      <template #right>
        <image
          class="camera-icon"
          src="/static/images/icon-camera.png"
          mode="aspectFit"
          @tap="goToPublish"
        ></image>
      </template>
    </TopNavBar>

    <view class="page-content">
      <!-- 顶部筛选 -->
      <view class="filter-tabs">
        <view
          v-for="tab in tabs"
          :key="tab.value"
          class="tab-item"
          :class="{ 'active': currentTab === tab.value }"
          @tap="switchTab(tab.value)"
        >
          <text class="tab-text">{{ tab.label }}</text>
        </view>
      </view>

      <!-- 动态列表 -->
      <scroll-view
        class="dynamic-list"
        scroll-y
        @scrolltolower="loadMore"
        refresher-enabled
        @refresherrefresh="onRefresh"
      >
        <view
          v-for="item in dynamicList"
          :key="item.id"
          class="dynamic-card"
          @tap="goToDetail(item.id)"
        >
          <view class="card-header">
            <image class="user-avatar" :src="item.avatar" mode="aspectFill"></image>
            <view class="user-info">
              <text class="user-name">{{ item.nickname }}</text>
              <text class="post-time">{{ item.time }}</text>
            </view>
            <image class="more-icon" src="/static/images/icon-more.png" mode="aspectFit"></image>
          </view>

          <text class="post-content">{{ item.content }}</text>

          <view v-if="item.images && item.images.length > 0" class="post-images">
            <image
              v-for="(img, index) in item.images"
              :key="index"
              class="post-image"
              :class="{ 'single': item.images.length === 1, 'double': item.images.length === 2 }"
              :src="img"
              mode="aspectFill"
            ></image>
          </view>

          <view class="card-footer">
            <view class="action-item" @tap.stop="toggleLike(item)">
              <image
                class="action-icon"
                :src="item.isLiked ? '/static/images/icon-like-filled.png' : '/static/images/icon-like.png'"
                mode="aspectFit"
              ></image>
              <text class="action-text">{{ item.likeCount }}</text>
            </view>
            <view class="action-item">
              <image class="action-icon" src="/static/images/icon-comment.png" mode="aspectFit"></image>
              <text class="action-text">{{ item.commentCount }}</text>
            </view>
            <view class="action-item" @tap.stop="toggleCollect(item)">
              <image
                class="action-icon"
                :src="item.isCollected ? '/static/images/icon-star-filled.png' : '/static/images/icon-star-gray.png'"
                mode="aspectFit"
              ></image>
            </view>
          </view>
        </view>

        <Empty v-if="dynamicList.length === 0 && !loading" type="noData" text="暂无动态" />
      </scroll-view>

      <!-- 发布按钮 -->
      <view class="publish-btn" @tap="goToPublish">
        <image class="publish-icon" src="/static/images/icon-add.png" mode="aspectFit"></image>
      </view>
    </view>

    <TabBar :current="1" />
    <Loading :visible="loading" />
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import TopNavBar from '@/components/common/TopNavBar.vue'
import TabBar from '@/components/common/TabBar.vue'
import Empty from '@/components/common/Empty.vue'
import Loading from '@/components/common/Loading.vue'

const loading = ref(false)
const currentTab = ref('all')

const tabs = [
  { label: '全部', value: 'all' },
  { label: '关注', value: 'follow' },
  { label: '推荐', value: 'recommend' }
]

const dynamicList = ref([
  {
    id: 1,
    avatar: '/static/images/avatar-default.png',
    nickname: '铲屎官小王',
    time: '2小时前',
    content: '今天带旺财去公园玩，遇到了好多小伙伴！',
    images: [
      '/static/images/post-default.png',
      '/static/images/post-default.png',
      '/static/images/post-default.png'
    ],
    likeCount: 128,
    commentCount: 32,
    isLiked: false,
    isCollected: false
  },
  {
    id: 2,
    avatar: '/static/images/avatar-default.png',
    nickname: '爱狗人士',
    time: '5小时前',
    content: '分享一下我家狗狗的日常～',
    images: [
      '/static/images/post-default.png'
    ],
    likeCount: 256,
    commentCount: 48,
    isLiked: true,
    isCollected: true
  }
])

onMounted(() => {
  loadDynamicList()
})

const loadDynamicList = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 1000)
}

const onRefresh = () => {
  loadDynamicList()
}

const loadMore = () => {
  console.log('Load more')
}

const switchTab = (tab) => {
  currentTab.value = tab
  uni.vibrateShort({ type: 'light' })
  loadDynamicList()
}

const toggleLike = (item) => {
  item.isLiked = !item.isLiked
  item.likeCount += item.isLiked ? 1 : -1
  uni.vibrateShort({ type: 'light' })
}

const toggleCollect = (item) => {
  item.isCollected = !item.isCollected
  uni.vibrateShort({ type: 'light' })
}

const goToDetail = (id) => {
  uni.navigateTo({
    url: `/pages/circle/detail?id=${id}`
  })
}

const goToPublish = () => {
  uni.vibrateShort({ type: 'medium' })
  uni.navigateTo({
    url: '/pages/circle/publish'
  })
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.circle-page {
  width: 100%;
  min-height: 100vh;
  background: $color-bg-primary;
}

.page-content {
  padding-top: $nav-bar-height;
  padding-bottom: $tab-bar-height;
}

.filter-tabs {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $spacing-component;
  padding: $spacing-component 0;
  background: $color-bg-white;
  margin-bottom: $spacing-component;

  .tab-item {
    padding: 12rpx 32rpx;
    border-radius: $border-radius-base;
    transition: all $transition-base ease;

    &.active {
      background: linear-gradient(135deg, $color-primary 0%, #FFD4F0 100%);
      box-shadow: $shadow-pink;

      .tab-text {
        color: $color-bg-white;
        font-weight: $font-weight-bold;
      }
    }

    .tab-text {
      font-size: $font-size-button;
      color: $color-gray-medium;
    }
  }
}

.dynamic-list {
  height: calc(100vh - #{$nav-bar-height} - #{$tab-bar-height} - 120rpx);
  padding: 0 $spacing-page-horizontal;
}

.dynamic-card {
  background: $color-bg-white;
  border-radius: $border-radius-base;
  padding: $spacing-component;
  margin-bottom: $spacing-component;
  box-shadow: $shadow-light;

  .card-header {
    display: flex;
    align-items: center;
    gap: $spacing-small;
    margin-bottom: $spacing-item;

    .user-avatar {
      width: $avatar-size-small;
      height: $avatar-size-small;
      border-radius: $border-radius-circle;
    }

    .user-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 4rpx;

      .user-name {
        font-size: $font-size-button;
        font-weight: $font-weight-bold;
        color: $color-gray-dark;
      }

      .post-time {
        font-size: $font-size-helper;
        color: $color-gray-lighter;
      }
    }

    .more-icon {
      width: 32rpx;
      height: 32rpx;
    }
  }

  .post-content {
    font-size: $font-size-body;
    color: $color-gray-dark;
    line-height: 1.6;
    margin-bottom: $spacing-item;
  }

  .post-images {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-small;
    margin-bottom: $spacing-item;

    .post-image {
      width: calc((100% - #{$spacing-small} * 2) / 3);
      height: 200rpx;
      border-radius: $border-radius-base;

      &.single {
        width: 100%;
        height: 400rpx;
      }

      &.double {
        width: calc((100% - #{$spacing-small}) / 2);
        height: 300rpx;
      }
    }
  }

  .card-footer {
    display: flex;
    align-items: center;
    gap: $spacing-component;
    padding-top: $spacing-item;
    border-top: $border-width solid $border-color;

    .action-item {
      display: flex;
      align-items: center;
      gap: 8rpx;

      .action-icon {
        width: 32rpx;
        height: 32rpx;
      }

      .action-text {
        font-size: $font-size-body;
        color: $color-gray-medium;
      }
    }
  }
}

.publish-btn {
  position: fixed;
  right: $spacing-page-horizontal;
  bottom: calc(#{$tab-bar-height} + 40rpx);
  width: 112rpx;
  height: 112rpx;
  background: linear-gradient(135deg, $color-primary 0%, #FFD4F0 100%);
  border-radius: $border-radius-circle;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: $shadow-pink;
  transition: transform $transition-base ease;

  &:active {
    transform: scale($scale-press);
  }

  .publish-icon {
    width: 48rpx;
    height: 48rpx;
  }
}

.camera-icon {
  width: $icon-size-medium;
  height: $icon-size-medium;
}
</style>
