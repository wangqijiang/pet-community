<template>
	<view class="content">
        <image class="logo" src="../../static/logo.png"></image>
		<view>
            <text class="title">{{title}}</text>
        </view>
		<view class="test-button" @tap="goToNotificationDetail">
			<text class="button-text">查看通知详情页</text>
		</view>
	</view>
</template>

<script lang="ts">
  import Vue from 'vue';

	export default Vue.extend({
		data() {
			return {
				title: 'Hello'
			}
		},
		onLoad() {

		},
		methods: {
			goToNotificationDetail() {
				uni.navigateTo({
					url: '/pages/notification-detail/notification-detail'
				});
			}
		}
	});
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin: 200rpx auto 50rpx auto;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}

	.test-button {
		margin-top: 50rpx;
		padding: 20rpx 40rpx;
		background: linear-gradient(135deg, #FFC1E9 0%, #FFD4F0 100%);
		border-radius: 24rpx;
		box-shadow: 0 8rpx 24rpx rgba(255, 193, 233, 0.4);
	}

	.button-text {
		font-size: 32rpx;
		color: #FFFFFF;
		font-weight: 600;
	}
</style>
