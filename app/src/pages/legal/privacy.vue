<template>
  <PageLayout>
    <template #navbar>
      <TopNavBar title="隐私政策" :showBack="true" />
    </template>
    <scroll-view scroll-y class="legal-scroll">
      <view class="legal-inner">
        <text class="legal-title">萌宠朋友圈隐私政策</text>
        <text class="legal-p">我们重视您的隐私，本政策说明我们如何收集、使用与保护您的个人信息。</text>
        <text class="legal-h">一、收集的信息</text>
        <text class="legal-p">可能包括：手机号（用于登录）、昵称与头像、宠物资料、位置信息（用于附近功能）、您主动发布的内容与消息。</text>
        <text class="legal-h">二、信息用途</text>
        <text class="legal-p">用于账号登录、内容展示、附近狗友与场所推荐、消息通知及产品改进，不会出售您的个人信息。</text>
        <text class="legal-h">三、位置信息</text>
        <text class="legal-p">仅在您授权后获取，用于地图、附近用户与场所列表；您可在系统设置中关闭授权。</text>
        <text class="legal-h">四、您的权利</text>
        <text class="legal-p">您可编辑或删除个人资料、宠物信息，并可联系我们处理账号注销相关请求。</text>
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
