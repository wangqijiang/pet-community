<script setup>
import { ref, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import CustomNavbar from '@/components/CustomNavbar.vue'
import CustomTabbar from '@/components/CustomTabbar.vue'

onShow(() => {
  if (typeof uni.$emit === 'function') {
    uni.$emit('updateTabBar', 0)
  }
})

const currentLocation = ref({
  latitude: 30.2741,
  longitude: 120.1551
})

const markers = ref([
  {
    id: 1,
    latitude: 30.2751,
    longitude: 120.1561,
    iconPath: '/static/marker-user.png',
    width: 30,
    height: 30
  }
])

const tabs = ref([
  { name: '附近的TA', count: 12 },
  { name: '宠物友好', count: 8 }
])

const currentTab = ref(0)

const nearbyUsers = ref([
  {
    id: 1,
    nickname: '豆包妈',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCMfYL8-gjY-xxOVvP1y5TYS0lGRHSNjTKfr-5fVyZHe-NU1flkjci2XGLkaMugAG80TZWoa2M3rqy_LDJGMNchcK6237kKlqdex32hhOyuNb-VPRQM5QzlIuEheqni3TUdtVvJafcgo0bwk0CGIQ0AYD6cfloURJABQ-qLbBPJr-hzvYDn1DfL5XZX2w0Br2iyyIAnGa853Zw6lI5DK9jIw096Mzor_ch2cvx-384xol2IcViLd50Zad7eOu-fnTCFJ2SEprvKb6Dm',
    petName: '豆包',
    petType: '柴犬',
    petAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD-5mved-C9YPabd_2Z1nK9gnjE54qatOK78OU9Sj55xNL5KKvA6DHkoaDbLoFXozC4GxSgy_wv6ypYvJ5UU_aKxv-jUrjCkAR_GLlLA1pS9jU6ZCE-E2YKSzJOG8pP0llHFXMsQWWVZlZ6gX3-rsX9Bp9htkaYyYxk7t4YKaZU0gBS0YEoaos_PNXFQkITmKcEX-5I29ZSi6dB_SdmisJ1JGZjqT6U_7j5oyqxpll4G4CMLZsd5sw94WPfJg38S5UvR33QNyem7qM7',
    distance: 0.5,
    location: '西湖区 · 文三路片区'
  },
  {
    id: 2,
    nickname: '汪汪特工队',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDcROvBiAnlufyO5cfPaQY9mcv-yAsGEP9dXUnFbZGxCl42fv5RN3LQJNIpIv9sNV2ZXmOVdzfyjwT3PAt4gXu3MODPfEFH3NmiSjeO4p-fgWAWl9V_g7LhTGhMeoybvUj92PT6p7DNzlye9pTy68qY4Rg0IlMz1CAkg36HAlQcbrzpz27M4T83sUJBilrEPmqHEKZCo4-lP5AdeDiwDGXvlDwU0ZADAcUvTkXvepmkJepwdkRXWPEYpY7mRJZ9TUpDT4_XiuWFkKTU',
    petName: '大黄',
    petType: '金毛',
    petAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAANsaBJcSvFijrJYjk3WiHi-N3dPygzmsHAzlUi5KnqM9d9Raz9z8oiF-uj6S_B_ibX7n-YXkkOTr_7B7kApHP98BjswbGV8Bar6wTtOMkQtwv2F8Uc7xqj_gD1lSr-qIrYABO6-BQAWR1WQvVkzrLj5yq7tp6Y_H6GosFlhxKVNdCLewB62TnMkGI0czzfczVxJdIpyepqP_eBw4sUdVXMDrz1TEhPwuTKCqic4tm8_zQRpBFabXpw1gRLeRB4VlVUdmHSvo3AzoD',
    distance: 1.2,
    location: '西湖区 · 黄龙片区'
  }
])

const nearbyPlaces = ref([
  {
    id: 1,
    name: '萌宠乐园宠物店',
    type: '宠物店',
    address: '文三路123号',
    distance: 0.8,
    rating: 4.8,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAabqnN6bpgkBj2eWWNBk_NYMLaHemafD8mniMuRJLXUMbB97hU5yFMQNacMdfXBRrdScPbyM-z-meclEtFjBt9wbuOSXsqFxv_eu-MHafJ7YdnJ8LW0B3-6cZr3L_m6Lo7Jg-AvmE-spzlrHIrrejToOm8Gm7kKxNNovWYsv1UKHEZWQmVVnf5-NSnCDIThBYOUJ8jH1h-hqtNizlpr-Kcr0Yjy',
    tags: ['洗澡', '美容', '寄养']
  },
  {
    id: 2,
    name: '西湖公园',
    type: '公园',
    address: '西湖区北山街',
    distance: 1.5,
    rating: 4.9,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD-5mved-C9YPabd_2Z1nK9gnjE54qatOK78OU9Sj55xNL5KKvA6DHkoaDbLoFXozC4GxSgy_wv6ypYvJ5UU_aKxv-jUrjCkAR_GLlLA1pS9jU6ZCE-E2YKSzJOG8pP0llHFXMsQWWVZlZ6gX3-rsX9Bp9htkaYyYxk7t4YKaZU0gBS0YEoaos_PNXFQkITmKcEX-5I29ZSi6dB_SdmisJ1JGZjqT6U_7j5oyqxpll4G4CMLZsd5sw94WPfJg38S5UvR33QNyem7qM7',
    tags: ['遛狗', '草坪', '免费']
  }
])

const sheetHeight = ref('50vh')
const showUserDetail = ref(false)
const selectedUser = ref(null)

const switchTab = (index) => {
  currentTab.value = index
}

const handleLocation = () => {
  uni.getLocation({
    type: 'gcj02',
    success: (res) => {
      currentLocation.value = {
        latitude: res.latitude,
        longitude: res.longitude
      }
    }
  })
}

const handleFilter = () => {
  uni.showToast({ title: '筛选功能开发中', icon: 'none' })
}

const handleMarkerTap = (e) => {
  console.log('Marker tapped:', e)
}

const handleUserClick = (user) => {
  selectedUser.value = user
  showUserDetail.value = true
}

const closeUserDetail = () => {
  showUserDetail.value = false
}

const viewUserProfile = () => {
  uni.navigateTo({ url: `/pages/profile/user-detail?id=${selectedUser.value.id}` })
}

const sendMessage = () => {
  uni.navigateTo({ url: `/pages/message/chat?userId=${selectedUser.value.id}` })
}

const handlePlaceClick = (place) => {
  uni.navigateTo({ url: `/pages/home/store-detail?id=${place.id}` })
}

const handleSearch = () => {
  uni.navigateTo({ url: '/pages/home/search' })
}
</script>

<template>
  <view class="home-page">
    <!-- 顶部导航栏 -->
    <CustomNavbar title="WaggleWorld">
      <template #right>
        <view class="notification-btn" @tap="handleSearch">
          <text class="material-symbols-outlined">notifications</text>
        </view>
      </template>
    </CustomNavbar>

    <!-- 地图容器 -->
    <view class="map-container">
      <map
        id="petMap"
        :latitude="currentLocation.latitude"
        :longitude="currentLocation.longitude"
        :scale="15"
        :markers="markers"
        :show-location="true"
        @markertap="handleMarkerTap"
        class="map"
      >
        <cover-view class="map-controls">
          <cover-view class="control-btn bouncy-active" @tap="handleLocation">
            <cover-image src="/static/location-icon.png" class="control-icon" />
          </cover-view>
          <cover-view class="control-btn bouncy-active" @tap="handleFilter">
            <cover-image src="/static/filter-icon.png" class="control-icon" />
          </cover-view>
        </cover-view>
      </map>
    </view>

    <!-- 底部抽屉 -->
    <view class="bottom-sheet">
      <view class="sheet-handle">
        <view class="handle-bar"></view>
      </view>

      <view class="sheet-content">
        <!-- 标签栏 -->
        <view class="tabs-wrapper">
          <view
            v-for="(tab, index) in tabs"
            :key="index"
            class="tab-item bouncy-active"
            :class="{ active: currentTab === index }"
            @tap="switchTab(index)"
          >
            <text class="tab-text font-headline-md">{{ tab.name }}</text>
            <view v-if="currentTab === index" class="tab-badge">
              <text class="badge-text font-label-caps">{{ tab.count }}</text>
            </view>
          </view>
        </view>

        <!-- 附近的TA -->
        <scroll-view v-if="currentTab === 0" scroll-y class="scroll-content">
          <view
            v-for="user in nearbyUsers"
            :key="user.id"
            class="user-card bouncy-active"
            @tap="handleUserClick(user)"
          >
            <image :src="user.avatar" class="user-avatar" mode="aspectFill" />
            <view class="user-info">
              <text class="user-name font-headline-md">{{ user.nickname }}</text>
              <view class="pet-info">
                <text class="pet-icon">🐾</text>
                <text class="pet-text font-body-md">{{ user.petName }} · {{ user.petType }}</text>
              </view>
              <view class="location-info">
                <text class="location-icon">📍</text>
                <text class="location-text font-body-md">{{ user.distance }}km · {{ user.location }}</text>
              </view>
            </view>
            <image :src="user.petAvatar" class="pet-avatar" mode="aspectFill" />
          </view>
        </scroll-view>

        <!-- 宠物友好 -->
        <scroll-view v-if="currentTab === 1" scroll-y class="scroll-content">
          <view
            v-for="place in nearbyPlaces"
            :key="place.id"
            class="place-card bouncy-active"
            @tap="handlePlaceClick(place)"
          >
            <image :src="place.image" class="place-image" mode="aspectFill" />
            <view class="place-info">
              <text class="place-name font-headline-md">{{ place.name }}</text>
              <view class="place-meta">
                <text class="place-type font-body-md">{{ place.type }}</text>
                <text class="place-rating font-body-md">⭐ {{ place.rating }}</text>
              </view>
              <text class="place-address font-body-md">📍 {{ place.address }} · {{ place.distance }}km</text>
              <view class="place-tags">
                <text
                  v-for="(tag, index) in place.tags"
                  :key="index"
                  class="tag font-label-caps"
                >{{ tag }}</text>
              </view>
            </view>
          </view>
        </scroll-view>
      </view>
    </view>

    <!-- 用户详情弹窗 -->
    <view v-if="showUserDetail" class="user-detail-modal" @tap="closeUserDetail">
      <view class="modal-backdrop"></view>
      <view class="modal-content bouncy-active" @tap.stop>
        <view class="modal-header">
          <image :src="selectedUser.petAvatar" class="modal-avatar" mode="aspectFill" />
          <view class="close-btn bouncy-active" @tap="closeUserDetail">
            <text class="close-icon">✕</text>
          </view>
        </view>

        <view class="modal-body">
          <text class="modal-name font-display-title">{{ selectedUser.nickname }}</text>
          <view class="modal-pet-info">
            <text class="modal-pet-text font-body-lg">🐾 {{ selectedUser.petName }} · {{ selectedUser.petType }}</text>
          </view>
          <view class="modal-location">
            <text class="modal-location-icon">📍</text>
            <text class="modal-location-text font-body-md">{{ selectedUser.location }}</text>
          </view>
        </view>

        <view class="modal-actions">
          <view class="action-btn secondary bouncy-active" @tap="viewUserProfile">
            <text class="action-text font-headline-md">查看主页</text>
          </view>
          <view class="action-btn primary bouncy-active" @tap="sendMessage">
            <text class="action-text font-headline-md">发私信</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部TabBar -->
    <CustomTabbar :current="0" />
  </view>
</template>

<style lang="scss" scoped>
.home-page {
  width: 100%;
  height: 100vh;
  background-color: var(--surface);
  position: relative;
  padding-bottom: calc(144rpx + env(safe-area-inset-bottom));
}

.notification-btn {
  width: 88rpx;
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  transition: all 0.3s ease;

  &:active {
    transform: scale(0.9);
  }

  .material-symbols-outlined {
    font-size: 48rpx;
    color: var(--primary);
  }
}

}

/* 地图容器 */
.map-container {
  width: 100%;
  height: 50vh;
  position: relative;
  margin-top: 120rpx;
}

.map {
  width: 100%;
  height: 100%;
}

.map-controls {
  position: absolute;
  right: 32rpx;
  bottom: 32rpx;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.control-btn {
  width: 88rpx;
  height: 88rpx;
  background-color: var(--surface-container-lowest);
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 24rpx rgba(168, 155, 157, 0.15);
}

.control-icon {
  width: 48rpx;
  height: 48rpx;
}

/* 底部抽屉 */
.bottom-sheet {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50vh;
  background-color: var(--surface);
  border-top-left-radius: 48rpx;
  border-top-right-radius: 48rpx;
  box-shadow: 0 -8rpx 32rpx rgba(168, 155, 157, 0.12);
  z-index: 50;
}

.sheet-handle {
  display: flex;
  justify-content: center;
  padding: 24rpx 0;
}

.handle-bar {
  width: 80rpx;
  height: 8rpx;
  background-color: var(--outline-variant);
  border-radius: var(--radius-full);
  opacity: 0.5;
}

.sheet-content {
  height: calc(100% - 56rpx);
  display: flex;
  flex-direction: column;
}

/* 标签栏 */
.tabs-wrapper {
  display: flex;
  align-items: center;
  gap: 48rpx;
  padding: 0 32rpx 24rpx;
  border-bottom: 2rpx solid var(--outline-variant);
}

.tab-item {
  display: flex;
  align-items: center;
  gap: 12rpx;
  padding-bottom: 16rpx;
  position: relative;
}

.tab-text {
  color: var(--on-surface-variant);
  transition: all 0.3s ease;

  .active & {
    color: var(--primary);
    font-weight: 700;
  }
}

.tab-badge {
  padding: 4rpx 12rpx;
  background-color: var(--primary-container);
  border-radius: var(--radius-full);
}

.badge-text {
  color: var(--on-primary-container);
  font-size: 20rpx;
}

/* 滚动内容 */
.scroll-content {
  flex: 1;
  padding: 32rpx;
}

/* 用户卡片 */
.user-card {
  display: flex;
  align-items: center;
  gap: 24rpx;
  background-color: var(--surface-container-lowest);
  border-radius: 48rpx;
  padding: 24rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 8rpx 32rpx rgba(168, 155, 157, 0.12);
}

.user-avatar {
  width: 96rpx;
  height: 96rpx;
  border-radius: var(--radius-full);
  border: 4rpx solid var(--primary-container);
}

.user-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.user-name {
  color: var(--on-surface);
}

.pet-info,
.location-info {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.pet-icon,
.location-icon {
  font-size: 28rpx;
}

.pet-text,
.location-text {
  color: var(--on-surface-variant);
  font-size: 24rpx;
}

.pet-avatar {
  width: 112rpx;
  height: 112rpx;
  border-radius: 24rpx;
  border: 4rpx solid var(--secondary-container);
}

/* 地点卡片 */
.place-card {
  display: flex;
  gap: 24rpx;
  background-color: var(--surface-container-lowest);
  border-radius: 48rpx;
  padding: 24rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 8rpx 32rpx rgba(168, 155, 157, 0.12);
}

.place-image {
  width: 160rpx;
  height: 160rpx;
  border-radius: 24rpx;
}

.place-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.place-name {
  color: var(--on-surface);
}

.place-meta {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.place-type,
.place-rating,
.place-address {
  color: var(--on-surface-variant);
  font-size: 24rpx;
}

.place-tags {
  display: flex;
  gap: 12rpx;
  flex-wrap: wrap;
}

.tag {
  padding: 4rpx 16rpx;
  background-color: var(--tertiary-container);
  color: var(--on-tertiary-container);
  border-radius: var(--radius-full);
  font-size: 20rpx;
}

/* 用户详情弹窗 */
.user-detail-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32rpx;
}

.modal-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(223, 216, 216, 0.4);
  backdrop-filter: blur(16rpx);
  -webkit-backdrop-filter: blur(16rpx);
}

.modal-content {
  position: relative;
  width: 100%;
  max-width: 640rpx;
  background-color: rgba(255, 252, 251, 1);
  border: 3rpx solid rgba(252, 218, 223, 0.3);
  border-radius: 48rpx;
  padding: 48rpx;
  box-shadow: 0 12rpx 40rpx rgba(168, 155, 157, 0.15);
  animation: bounceIn 0.5s ease-out;
}

@keyframes bounceIn {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.modal-header {
  position: relative;
  display: flex;
  justify-content: center;
  margin-bottom: 32rpx;
}

.modal-avatar {
  width: 192rpx;
  height: 192rpx;
  border-radius: var(--radius-full);
  border: 12rpx solid rgba(252, 218, 223, 0.5);
}

.close-btn {
  position: absolute;
  top: -24rpx;
  right: -24rpx;
  width: 64rpx;
  height: 64rpx;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(16rpx);
  -webkit-backdrop-filter: blur(16rpx);
}

.close-icon {
  color: #ffffff;
  font-size: 36rpx;
}

.modal-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 32rpx;
}

.modal-name {
  color: var(--primary);
}

.modal-pet-info {
  display: flex;
  align-items: center;
}

.modal-pet-text {
  color: var(--on-surface);
}

.modal-location {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.modal-location-icon {
  font-size: 32rpx;
}

.modal-location-text {
  color: var(--on-surface-variant);
}

.modal-actions {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24rpx;
}

.action-btn {
  height: 96rpx;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;

  &.secondary {
    background-color: var(--secondary-fixed);
  }

  &.primary {
    background-color: var(--primary-fixed);
  }
}

.action-text {
  color: var(--primary);
}
</style>
