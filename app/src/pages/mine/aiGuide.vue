<template>
  <view class="ai-guide-page">
    <TopNavBar title="专属养宠攻略" showBack />

    <view class="page-content">
      <scroll-view class="content-scroll" scroll-y>
        <!-- AI Banner -->
        <view class="ai-banner">
          <view class="ai-content">
            <view class="ai-tag">
              <text class="tag-text">AI-POWERED INSIGHTS</text>
            </view>
            <text class="ai-title">汪汪！您的定制成长秘籍已生成</text>
            <text class="ai-desc">基于毛孩子的年龄、品种与生活习性深度定制</text>
          </view>
          <view class="ai-decoration decoration-1"></view>
          <view class="ai-decoration decoration-2"></view>
        </view>

        <!-- 攻略详情卡片 -->
        <view class="guide-card">
          <!-- 顶部图片 -->
          <view class="guide-header">
            <image
              class="guide-cover"
              src="/static/images/post-default.png"
              mode="aspectFill"
            ></image>
            <view class="gradient-overlay"></view>
          </view>

          <!-- 攻略内容 -->
          <view class="guide-content">
            <!-- 健康膳食建议 -->
            <view class="guide-section">
              <view class="section-header">
                <view class="section-icon-wrapper tertiary">
                  <view class="section-icon restaurant"></view>
                </view>
                <text class="section-title">健康膳食建议</text>
              </view>
              <view class="section-body">
                <text class="section-text">
                  幼犬期需要高蛋白易消化的食物。建议每日3-4餐，以温水泡软的干粮为主，配合适量益生菌维护肠胃健康。
                </text>
                <view class="food-tags">
                  <view class="food-tag">
                    <view class="tag-check"></view>
                    <text class="tag-text">鸡肉/三文鱼</text>
                  </view>
                  <view class="food-tag">
                    <view class="tag-check"></view>
                    <text class="tag-text">蛋黄</text>
                  </view>
                </view>
              </view>
            </view>

            <!-- 运动活力指南 -->
            <view class="guide-section">
              <view class="section-header">
                <view class="section-icon-wrapper secondary">
                  <view class="section-icon run"></view>
                </view>
                <text class="section-title">运动活力指南</text>
              </view>
              <view class="section-body">
                <text class="section-text">
                  每日室内互动时间不低于45分钟。推荐使用漏食玩具训练智力。户外遛狗避开烈日，保护脆弱的肉垫。
                </text>
                <view class="sport-info">
                  <text class="info-item">建议时长: 45min+</text>
                  <text class="info-item">推荐指数: ★★★★★</text>
                </view>
              </view>
            </view>

            <!-- 心情治愈贴士 -->
            <view class="guide-section">
              <view class="section-header">
                <view class="section-icon-wrapper primary">
                  <view class="section-icon heart"></view>
                </view>
                <text class="section-title">心情治愈贴士</text>
              </view>
              <view class="section-body">
                <text class="section-text">
                  狗狗也非常敏感，主人的陪伴是最好的安慰。当它出现低头、叹气或寻找角落躲避时，请温柔安抚并给予零食奖励。
                </text>
              </view>
            </view>

            <!-- 进度指示器 -->
            <view class="progress-indicator">
              <view class="progress-dot"></view>
              <view class="progress-bar"></view>
              <view class="progress-dot"></view>
            </view>
          </view>
        </view>

        <!-- 小贴士 -->
        <view class="tips-card">
          <view class="tips-icon"></view>
          <view class="tips-content">
            <text class="tips-title">小贴士</text>
            <text class="tips-text">点击下方按钮可一键生成海报，保存这份心动攻略哦～</text>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 底部操作栏 -->
    <view class="bottom-actions">
      <view class="action-btn secondary" @tap="saveImage">
        <view class="btn-icon download"></view>
        <text class="btn-text">保存图片</text>
      </view>
      <view class="action-btn primary" @tap="shareToCircle">
        <view class="btn-icon share"></view>
        <text class="btn-text">分享到萌宠圈</text>
      </view>
    </view>

    <Loading :visible="loading" />
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import TopNavBar from '@/components/common/TopNavBar.vue'
import Loading from '@/components/common/Loading.vue'

const loading = ref(false)

onMounted(() => {
  loadGuide()
})

const loadGuide = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 1000)
}

const saveImage = () => {
  uni.vibrateShort({ type: 'light' })
  uni.showToast({
    title: '保存成功',
    icon: 'success'
  })
}

const shareToCircle = () => {
  uni.vibrateShort({ type: 'medium' })
  uni.showToast({
    title: '分享成功',
    icon: 'success'
  })
}
</script>

<style lang="scss" scoped>
.ai-guide-page {
  width: 100%;
  min-height: 100vh;
  background: #fff8f7;
}

.page-content {
  padding-bottom: calc(200rpx + env(safe-area-inset-bottom));
}

.content-scroll {
  width: 100%;
  box-sizing: border-box;
  height: calc(100vh - 200rpx);
  padding: 0 40rpx;
  padding-top: 16rpx;
}

/* AI Banner */
.ai-banner {
  position: relative;
  background: #ffdde2;
  border-radius: 48rpx;
  padding: 48rpx;
  margin-bottom: 32rpx;
  box-shadow: 0 8rpx 32rpx rgba(168, 155, 157, 0.15);
  border: 4rpx solid rgba(255, 255, 255, 0.4);
  overflow: hidden;
}

.ai-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 16rpx;
}

.ai-tag {
  background: rgba(255, 255, 255, 0.6);
  padding: 8rpx 24rpx;
  border-radius: 100rpx;
  backdrop-filter: blur(10px);
}

.tag-text {
  font-size: 20rpx;
  font-weight: 700;
  color: #795f64;
  letter-spacing: 0.05em;
}

.ai-title {
  font-size: 36rpx;
  font-weight: 700;
  color: #795f64;
}

.ai-desc {
  font-size: 26rpx;
  color: #584145;
  opacity: 0.8;
}

.ai-decoration {
  position: absolute;
  width: 192rpx;
  height: 192rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2371585c'%3E%3Cpath d='M12 2l-2.5 5-5 .7 3.7 3.6-.9 5.1 4.7-2.5 4.7 2.5-.9-5.1 3.7-3.6-5-.7L12 2z'/%3E%3C/svg%3E") no-repeat center;
  background-size: 100%;
  opacity: 0.15;

  &.decoration-1 {
    right: -32rpx;
    bottom: -32rpx;
  }

  &.decoration-2 {
    left: -48rpx;
    top: -48rpx;
    opacity: 0.1;
    transform: scale(0.8);
  }
}

/* 攻略详情卡片 */
.guide-card {
  background: #ffffff;
  border-radius: 48rpx;
  overflow: hidden;
  box-shadow: 0 8rpx 32rpx rgba(168, 155, 157, 0.12);
  border: 2rpx solid rgba(210, 195, 196, 0.2);
  margin-bottom: 32rpx;
}

.guide-header {
  position: relative;
  height: 320rpx;
}

.guide-cover {
  width: 100%;
  height: 100%;
}

.gradient-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 120rpx;
  background: linear-gradient(to top, #ffffff, transparent);
}

.guide-content {
  padding: 48rpx;
}

.guide-section {
  margin-bottom: 48rpx;

  &:last-of-type {
    margin-bottom: 32rpx;
  }
}

.section-header {
  display: flex;
  align-items: center;
  gap: 20rpx;
  margin-bottom: 20rpx;
}

.section-icon-wrapper {
  width: 80rpx;
  height: 80rpx;
  border-radius: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;

  &.primary {
    background: #ffdde2;
  }

  &.secondary {
    background: #eadfbd;
  }

  &.tertiary {
    background: #daead8;
  }
}

.section-icon {
  width: 48rpx;
  height: 48rpx;
  background-size: 100%;
  background-repeat: no-repeat;
  background-position: center;

  &.restaurant {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%235b6a5c'%3E%3Cpath d='M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z'/%3E%3C/svg%3E");
  }

  &.run {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%236a6347'%3E%3Cpath d='M13 2l3.05 7.26L22 9.27l-5 4.87 1.17 6.88L13 17.77l-6.18 3.25L8 14.14 3 9.27l6.95-2.01L13 2z'/%3E%3C/svg%3E");
  }

  &.heart {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23795f64'%3E%3Cpath d='M12 2l-2.5 5-5 .7 3.7 3.6-.9 5.1 4.7-2.5 4.7 2.5-.9-5.1 3.7-3.6-5-.7L12 2z'/%3E%3C/svg%3E");
  }
}

.section-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #71585c;
}

.section-body {
  padding: 24rpx;
  background: #f9f2f2;
  border-radius: 32rpx;
  border-left: 8rpx solid #71585c;
}{"file_path": "/Users/mac/Desktop/code/pet-community/app/src/pages/mine/aiTips.vue", "content": 