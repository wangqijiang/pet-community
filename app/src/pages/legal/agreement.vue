<template>
  <PageLayout>
    <template #navbar>
      <TopNavBar title="用户协议" :showBack="true" />
    </template>
    <scroll-view scroll-y class="legal-scroll">
      <view class="legal-inner">
        <text class="legal-title">萌宠朋友圈用户协议</text>
        <text class="legal-p">欢迎使用萌宠朋友圈。使用本服务即表示您同意以下条款：</text>
        <text class="legal-h">一、账号与安全</text>
        <text class="legal-p">您应使用真实信息注册并妥善保管账号。因个人原因导致的账号风险由您自行承担。</text>
        <text class="legal-h">二、内容规范</text>
        <text class="legal-p">您发布的内容须合法、真实，不得侵犯他人权益，不得发布违法、暴力、虚假广告等信息。</text>
        <text class="legal-h">三、宠物与线下活动</text>
        <text class="legal-p">平台展示的遛狗地点、附近用户等信息仅供参考，线下见面请自行注意安全。</text>
        <text class="legal-h">四、服务变更</text>
        <text class="legal-p">我们可能根据业务需要调整功能，并提前通过应用内公告等方式告知。</text>
        <text class="legal-updated">更新日期：2026年5月</text>
      </view>
    </scroll-view>
  </PageLayout>
</template>

<script setup lang="ts">
import TopNavBar from "@/components/common/TopNavBar.vue";
import PageLayout from "@/components/common/PageLayout.vue";
</script>

<style lang="scss" scoped>
.legal-scroll {
  height: 100%;
}

.legal-inner {
  padding: 32rpx 40rpx 80rpx;
}

.legal-title {
  display: block;
  font-size: 40rpx;
  font-weight: 700;
  color: #3d2f2f;
  margin-bottom: 32rpx;
}

.legal-h {
  display: block;
  font-size: 30rpx;
  font-weight: 700;
  color: #6b4e3d;
  margin: 28rpx 0 12rpx;
}

.legal-p {
  display: block;
  font-size: 28rpx;
  line-height: 1.75;
  color: #5c5252;
  margin-bottom: 16rpx;
}

.legal-updated {
  display: block;
  margin-top: 48rpx;
  font-size: 24rpx;
  color: #a39797;
}
</style>
