<template>
  <view class="login-page">
    <image class="page-bg" src="/static/login/bg.png" mode="aspectFill" />

    <view class="login-shell">
      <view class="mascot-wrap">
        <image class="mascot" src="/static/login/logo.png" mode="widthFix" />
      </view>

      <view class="login-card">
        <button
          class="wechat-btn"
          :loading="isLoading"
          :disabled="isLoading"
          @click="handleWechatLogin"
        >
          <view class="wechat-btn-inner">
            <view class="wechat-icon icon-heart"></view>
            <text class="wechat-text">{{
              isLoading ? "登录中..." : "微信快捷登录"
            }}</text>
          </view>
        </button>

        <view class="divider">
          <view class="divider-paw"></view>
          <view class="divider-line"></view>
          <text class="divider-text">或</text>
          <view class="divider-line"></view>
          <view class="divider-paw"></view>
        </view>

        <view class="phone-form">
          <input
            class="phone-input"
            v-model="phone"
            type="number"
            maxlength="11"
            placeholder="请输入手机号"
          />
          <view class="code-row">
            <input
              class="code-input"
              v-model="smsCode"
              type="number"
              maxlength="6"
              placeholder="验证码"
            />
            <view
              class="code-btn"
              :class="{ disabled: codeCooldown > 0 || sendingCode }"
              @click="handleSendCode"
            >
              <text>{{ codeBtnText }}</text>
            </view>
          </view>
          <view class="phone-login-btn" @click="handlePhoneLogin">
            <text>验证码登录</text>
          </view>
          <!-- <text v-if="showDevHint" class="dev-hint">开发环境验证码 {{ devCodeHint }}</text> -->
        </view>

        <view class="guest-btn" @click="handleGuestLogin">
          <text class="guest-text">游客体验</text>
        </view>

        <text class="agreement">
          登录即代表同意
          <text class="agreement-link" @click.stop="goAgreement"
            >《用户协议》</text
          >
          与
          <text class="agreement-link" @click.stop="goPrivacy"
            >《隐私政策》</text
          >
        </text>
      </view>
    </view>

    <GlobalOverlays />
    <GlobalToastLayer />
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { showToast } from "@/utils/toast";
import GlobalOverlays from "@/components/common/GlobalOverlays.vue";
import GlobalToastLayer from "@/components/common/GlobalToastLayer.vue";
import { onLoad, onShow } from "@dcloudio/uni-app";
import {
  loginWechatOpenid,
  loginByCode,
  sendCode,
  setUserInfo,
  isLoggedIn,
  enterGuestMode,
  type LoginResponse,
} from "../../api/auth";
import { PENDING_SHARE_ROUTE_KEY } from "@/utils/postShare";
import { connectRealtime } from "@/utils/realtime";
import { safeReLaunch } from "@/utils/navigation";

const isLoading = ref(false);
const sendingCode = ref(false);
const phone = ref("");
const smsCode = ref("");
const codeCooldown = ref(0);
const showDevHint = import.meta.env.DEV;
const devCodeHint = "1234";

const codeBtnText = computed(() => {
  if (sendingCode.value) return "发送中";
  if (codeCooldown.value > 0) return `${codeCooldown.value}s`;
  return "获取验证码";
});

let cooldownTimer: ReturnType<typeof setInterval> | null = null;

const startCooldown = (seconds = 60) => {
  codeCooldown.value = seconds;
  if (cooldownTimer) clearInterval(cooldownTimer);
  cooldownTimer = setInterval(() => {
    if (codeCooldown.value <= 1) {
      codeCooldown.value = 0;
      if (cooldownTimer) clearInterval(cooldownTimer);
      cooldownTimer = null;
    } else {
      codeCooldown.value -= 1;
    }
  }, 1000);
};

const navigateAfterLogin = () => {
  const pendingRoute = uni.getStorageSync(PENDING_SHARE_ROUTE_KEY);
  if (pendingRoute) {
    uni.removeStorageSync(PENDING_SHARE_ROUTE_KEY);
    safeReLaunch(pendingRoute);
    return;
  }
  safeReLaunch("/pages/home/index");
};

const finishLogin = (result: LoginResponse) => {
  setUserInfo(result.user, result.token);
  connectRealtime();
  showToast({
    title: "登录成功",
    icon: "success",
  });
  setTimeout(navigateAfterLogin, 800);
};

const handleGuestLogin = () => {
  enterGuestMode();
  navigateAfterLogin();
};

const handleSendCode = async () => {
  if (sendingCode.value || codeCooldown.value > 0) return;
  if (!/^1[3-9]\d{9}$/.test(phone.value)) {
    showToast({ title: "请输入正确手机号", icon: "none" });
    return;
  }
  sendingCode.value = true;
  try {
    const res = await sendCode(phone.value, "login");
    if (res.code) {
      showToast({ title: `测试验证码：${res.code}`, icon: "none" });
    } else {
      showToast({ title: "验证码已发送", icon: "success" });
    }
    startCooldown();
  } catch (error) {
    showToast({
      title: error instanceof Error ? error.message : "发送失败",
      icon: "none",
    });
  } finally {
    sendingCode.value = false;
  }
};

const handlePhoneLogin = async () => {
  if (isLoading.value) return;
  if (!/^1[3-9]\d{9}$/.test(phone.value) || !smsCode.value) {
    showToast({ title: "请填写手机号和验证码", icon: "none" });
    return;
  }
  isLoading.value = true;
  try {
    const result = await loginByCode(phone.value, smsCode.value);
    finishLogin(result);
  } catch (error) {
    showToast({
      title: error instanceof Error ? error.message : "登录失败",
      icon: "none",
    });
  } finally {
    isLoading.value = false;
  }
};

const handleWechatLogin = async () => {
  if (isLoading.value) return;
  isLoading.value = true;
  try {
    const loginRes = await new Promise<UniApp.LoginRes>((resolve, reject) => {
      uni.login({
        provider: "weixin",
        success: resolve,
        fail: reject,
      });
    });
    if (!loginRes.code) {
      showToast({ title: "微信登录失败，请重试", icon: "none" });
      return;
    }
    const result = await loginWechatOpenid(loginRes.code);
    finishLogin(result);
  } catch (error) {
    showToast({
      title: error instanceof Error ? error.message : "登录失败",
      icon: "none",
    });
  } finally {
    isLoading.value = false;
  }
};

const goAgreement = () => {
  uni.navigateTo({ url: "/pages/legal/agreement" });
};

const goPrivacy = () => {
  uni.navigateTo({ url: "/pages/legal/privacy" });
};

/** 已登录（含曾微信/手机号登录）则不再展示登录页，直接进首页 */
const redirectIfAlreadyLoggedIn = () => {
  if (!isLoggedIn()) return;
  connectRealtime();
  navigateAfterLogin();
};

onLoad(redirectIfAlreadyLoggedIn);
onShow(redirectIfAlreadyLoggedIn);
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";

.login-page {
  width: 100%;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  background: $color-bg-primary;
}

.page-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.login-shell {
  position: relative;
  z-index: 1;
  min-height: 100vh;
  padding: 0 32rpx;
  padding-top: calc(env(safe-area-inset-top) + 280rpx);
  padding-bottom: calc(env(safe-area-inset-bottom) + 48rpx);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.mascot-wrap {
  position: relative;
  z-index: 3;
  display: flex;
  justify-content: center;
  margin-bottom: -72rpx;
  pointer-events: none;
}

.mascot {
  width: 520rpx;
  height: auto;
}

.login-card {
  position: relative;
  z-index: 2;
  width: 100%;
  padding: 96rpx 40rpx 40rpx;
  border-radius: 56rpx;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 8rpx 32rpx rgba(107, 78, 61, 0.08);
  box-sizing: border-box;
}

.wechat-btn {
  width: 100%;
  height: 96rpx;
  padding: 0;
  margin: 0;
  border: none;
  border-radius: 999rpx;
  background: $color-primary;
  box-shadow: 0 16rpx 40rpx rgba(255, 179, 107, 0.28);
  overflow: hidden;

  &::after {
    border: none;
  }

  &[disabled] {
    opacity: 0.7;
  }
}

.wechat-btn-inner {
  width: 100%;
  height: 96rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
}

.wechat-icon {
  width: 36rpx;
  height: 36rpx;

  &.icon-heart {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23FFFFFF'%3E%3Cpath d='M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z'/%3E%3C/svg%3E")
      no-repeat center;
    background-size: 100%;
  }
}

.wechat-text {
  font-size: 32rpx;
  font-weight: 700;
  color: #ffffff;
}

.divider {
  margin: 32rpx 0 28rpx;
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.divider-line {
  flex: 1;
  height: 1rpx;
  background: $border-color;
}

.divider-text {
  font-size: 24rpx;
  color: $color-gray-lighter;
  flex-shrink: 0;
}

.divider-paw {
  width: 24rpx;
  height: 24rpx;
  flex-shrink: 0;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23FFE2C2'%3E%3Cpath d='M8.5 14.5A2.5 2.5 0 0 1 6 12a2.5 2.5 0 0 1 2.5-2.5 2.5 2.5 0 0 1 2.5 2.5 2.5 2.5 0 0 1-2.5 2.5zm7 0A2.5 2.5 0 0 1 13 12a2.5 2.5 0 0 1 2.5-2.5 2.5 2.5 0 0 1 2.5 2.5 2.5 2.5 0 0 1-2.5 2.5zM12 10.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm-4.5 3a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm9 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;
}

.phone-form {
  padding: 32rpx;
  border-radius: 32rpx;
  background: $color-bg-primary;
}

.phone-input {
  width: 100%;
  height: 88rpx;
  padding: 0 28rpx;
  border-radius: 24rpx;
  background: #ffffff;
  font-size: 28rpx;
  color: $color-gray-dark;
  box-sizing: border-box;
}

.code-row {
  margin-top: 20rpx;
  display: flex;
  gap: 16rpx;
}

.code-input {
  flex: 1;
  height: 88rpx;
  padding: 0 28rpx;
  border-radius: 24rpx;
  background: #ffffff;
  font-size: 28rpx;
  color: $color-gray-dark;
  box-sizing: border-box;
}

.code-btn {
  flex-shrink: 0;
  min-width: 200rpx;
  height: 88rpx;
  padding: 0 24rpx;
  border-radius: 24rpx;
  background: $color-primary-light;
  display: flex;
  align-items: center;
  justify-content: center;

  text {
    font-size: 26rpx;
    font-weight: 600;
    color: $color-primary;
  }

  &.disabled {
    opacity: 0.55;
  }
}

.phone-login-btn {
  margin-top: 24rpx;
  height: 88rpx;
  border-radius: 999rpx;
  background: #ffffff;
  border: 2rpx solid rgba(255, 179, 107, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;

  text {
    font-size: 30rpx;
    font-weight: 600;
    color: $color-primary;
  }

  &:active {
    opacity: 0.85;
    transform: scale(0.98);
  }
}

.dev-hint {
  display: block;
  margin-top: 16rpx;
  font-size: 22rpx;
  color: $color-gray-lighter;
  text-align: center;
}

.guest-btn {
  margin-top: 24rpx;
  width: 100%;
  height: 88rpx;
  border-radius: 999rpx;
  border: 2rpx solid rgba(255, 179, 107, 0.55);
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;

  &:active {
    opacity: 0.85;
    transform: scale(0.98);
  }
}

.guest-text {
  font-size: 30rpx;
  font-weight: 600;
  color: $color-primary;
}

.agreement {
  margin-top: 28rpx;
  text-align: center;
  font-size: 22rpx;
  line-height: 1.8;
  color: $color-gray-lighter;
  width: 100%;
  display: block;
}

.agreement-link {
  color: $color-primary;
}
</style>
