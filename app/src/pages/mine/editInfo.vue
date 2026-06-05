<template>
  <PageLayout>
    <template #navbar>
      <TopNavBar title="编辑资料" :showBack="true" />
    </template>

    <view class="page-inner edit-info-inner">
      <!-- 手机号登录：补绑定微信 openid -->
      <view v-if="userLoaded && phoneBound && !openidBound" class="bind-card">
        <view class="bind-card-text">
          <text class="bind-card-title">绑定微信</text>
          <text class="bind-card-desc">完成后即可与手机号联合登录与找回</text>
        </view>
        <view class="bind-card-btn" @tap="handleBindOpenid">
          <text>{{ openidBinding ? "绑定中..." : "一键绑定" }}</text>
        </view>
      </view>

      <!-- openid 登录（未绑定手机号）：限制此处操作 -->
      <view v-else-if="userLoaded && !phoneBound" class="bind-card">
        <view class="bind-card-text">
          <text class="bind-card-title">绑定手机号</text>
          <text class="bind-card-desc"
            >为保障账号安全与找回能力，请先完成手机号绑定</text
          >
        </view>
        <view class="bind-card-btn" @tap="openBindSheet">
          <text>立即绑定</text>
        </view>
      </view>

      <!-- 两者都已绑定：不展示“绑定卡片”，仅展示手机号信息 -->
      <view v-else-if="userLoaded" class="form-item">
        <text class="item-label">手机号</text>
        <view class="item-value">
          <text class="value-text">{{ maskedPhone }}</text>
        </view>
      </view>

      <!-- 头像 -->
      <view class="form-item" @tap="chooseAvatar">
        <text class="item-label">头像</text>
        <view class="item-value">
          <image
            class="avatar-preview"
            :src="resolveLocalOrMediaUrl(formData.avatar)"
            mode="aspectFill"
          ></image>
          <image
            class="arrow-icon"
            src="/static/images/icon-arrow-right.png"
            mode="aspectFit"
          ></image>
        </view>
      </view>

      <!-- 昵称 -->
      <view class="form-item">
        <text class="item-label">昵称</text>
        <input
          class="item-input"
          v-model="formData.username"
          placeholder="请输入昵称"
          maxlength="8"
        />
      </view>

      <!-- 性别 -->
      <view class="form-item" @tap="showGenderPicker">
        <text class="item-label">性别</text>
        <view class="item-value">
          <text class="value-text">{{ displayGender }}</text>
          <image
            class="arrow-icon"
            src="/static/images/icon-arrow-right.png"
            mode="aspectFit"
          ></image>
        </view>
      </view>

      <!-- 生日 -->
      <picker
        class="form-item"
        mode="date"
        :value="formData.birthday"
        @change="onDateChange"
        :start="'1900-01-01'"
        :end="today"
      >
        <view class="picker-content">
          <text class="item-label">生日</text>
          <view class="item-value">
            <text class="value-text">{{ displayBirthday }}</text>
            <image
              class="arrow-icon"
              src="/static/images/icon-arrow-right.png"
              mode="aspectFit"
            ></image>
          </view>
        </view>
      </picker>

      <!-- 地区 -->
      <picker
        class="form-item"
        mode="region"
        :value="regionArray"
        @change="onRegionChange"
      >
        <view class="picker-content">
          <text class="item-label">地区</text>
          <view class="item-value">
            <text class="value-text">{{ formData.region || "请选择" }}</text>
            <image
              class="arrow-icon"
              src="/static/images/icon-arrow-right.png"
              mode="aspectFit"
            ></image>
          </view>
        </view>
      </picker>

      <!-- 简介 -->
      <view class="form-item textarea-item">
        <text class="item-label">简介</text>
        <textarea
          class="item-textarea"
          v-model="formData.signature"
          placeholder="介绍一下自己吧"
          maxlength="50"
        ></textarea>
        <text class="char-count">{{ formData.signature.length }}/50</text>
      </view>

      <view class="save-btn" @tap="handleSave">
        <text class="btn-text">保存</text>
      </view>
    </view>

    <template #fixed>
      <BottomSheet
        :visible="bindSheetVisible"
        title="绑定手机号"
        @update:visible="bindSheetVisible = $event"
      >
        <view class="bind-sheet">
          <input
            class="bind-input"
            v-model="bindPhoneInput"
            type="number"
            maxlength="11"
            placeholder="请输入手机号"
          />
          <view class="bind-code-row">
            <input
              class="bind-input bind-code-input"
              v-model="bindCode"
              type="number"
              maxlength="6"
              placeholder="验证码"
            />
            <view
              class="bind-code-btn"
              :class="{ disabled: bindCooldown > 0 || bindSending }"
              @tap="handleBindSendCode"
            >
              <text>{{ bindCodeBtnText }}</text>
            </view>
          </view>
          <view class="bind-submit" @tap="handleBindPhone">
            <text>确认绑定</text>
          </view>
        </view>
      </BottomSheet>
    </template>

    <Loading :visible="loading" />
  </PageLayout>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import TopNavBar from "@/components/common/TopNavBar.vue";
import PageLayout from "@/components/common/PageLayout.vue";
import BottomSheet from "@/components/common/BottomSheet.vue";
import Loading from "@/components/common/Loading.vue";
import { getUserInfo, updateUserInfo, uploadAvatar } from "@/api/user";
import {
  bindPhone,
  bindOpenid,
  sendCode,
  setUserInfo,
  getUserInfo as getStoredUser,
} from "@/api/auth";
import { getToken } from "@/utils/session";
import {
  USER_GENDER_OPTIONS,
  normalizeUserGender,
  formatUserGender,
  formatDateYMD,
} from "@/utils/format";
import dayjs from "dayjs";
import { resolveLocalOrMediaUrl, resolveMediaUrl } from "@/utils/media";
import { resolveUserAvatarUrl } from "@/utils/defaultAvatar";
import { showRequestError, showToast } from "@/utils/request";
import { useChooseImage } from "@/composables/useChooseImage";
import { useActionSheet } from "@/composables/useComponents";

const actionSheet = useActionSheet();

const loading = ref(false);
const isUploading = ref(false);
const phoneBound = ref(false);
const openidBound = ref(false);
const userPhone = ref("");
const openidBinding = ref(false);
const userLoaded = ref(false);
const bindSheetVisible = ref(false);
const bindPhoneInput = ref("");
const bindCode = ref("");
const bindSending = ref(false);
const bindCooldown = ref(0);
const { chooseSingle } = useChooseImage();

let bindCooldownTimer = null;

const maskedPhone = computed(() => {
  const p = userPhone.value;
  if (!p || p.length < 11) return p || "";
  return `${p.slice(0, 3)}****${p.slice(-4)}`;
});

const bindCodeBtnText = computed(() => {
  if (bindSending.value) return "发送中";
  if (bindCooldown.value > 0) return `${bindCooldown.value}s`;
  return "获取验证码";
});

const startBindCooldown = (seconds = 60) => {
  bindCooldown.value = seconds;
  if (bindCooldownTimer) clearInterval(bindCooldownTimer);
  bindCooldownTimer = setInterval(() => {
    if (bindCooldown.value <= 1) {
      bindCooldown.value = 0;
      if (bindCooldownTimer) clearInterval(bindCooldownTimer);
      bindCooldownTimer = null;
    } else {
      bindCooldown.value -= 1;
    }
  }, 1000);
};

const openBindSheet = () => {
  bindPhoneInput.value = "";
  bindCode.value = "";
  bindSheetVisible.value = true;
};

const handleBindOpenid = async () => {
  if (openidBinding.value) return;
  openidBinding.value = true;
  try {
    const loginRes = await new Promise((resolve, reject) => {
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

    await bindOpenid(loginRes.code);
    showToast({ title: "绑定成功", icon: "success" });
    await loadUserInfo();
  } catch (error) {
    showRequestError(error, "绑定微信失败");
  } finally {
    openidBinding.value = false;
  }
};

const formData = ref({
  avatar: "/static/images/profile-picture/1.png",
  username: "",
  gender: "",
  birthday: "",
  region: "",
  signature: "",
});

const today = computed(() => dayjs().format("YYYY-MM-DD"));

const regionArray = computed(() => {
  if (!formData.value.region) return [];
  return formData.value.region.split(" ").filter(Boolean);
});

const displayGender = computed(() => {
  if (!formData.value.gender) return "请选择";
  return formatUserGender(formData.value.gender) || "请选择";
});

const displayBirthday = computed(() => {
  if (!formData.value.birthday) return "请选择";
  return formatDateYMD(formData.value.birthday) || "请选择";
});

onMounted(() => {
  loadUserInfo();
});

const loadUserInfo = async () => {
  try {
    const user = await getUserInfo();
    userPhone.value = user.phone || "";
    phoneBound.value = !!user.phone;
    openidBound.value = !!user.openid;

    formData.value = {
      avatar: resolveUserAvatarUrl(user.avatar, user.id),
      username: user.username || "",
      gender: normalizeUserGender(user.gender) || "",
      birthday: formatDateYMD(user.birthday),
      region: user.region || "",
      signature: user.signature || "",
    };
    userLoaded.value = true;
  } catch (error) {
    console.error("获取用户信息失败:", error);
    userLoaded.value = false;
  }
};

const chooseAvatar = () => {
  chooseSingle((tempFilePath) => {
    formData.value.avatar = tempFilePath;
    uploadAvatarFile(tempFilePath);
  });
};

const uploadAvatarFile = async (filePath) => {
  if (isUploading.value) return;

  isUploading.value = true;
  try {
    const result = await uploadAvatar(filePath);
    formData.value.avatar = result.url;
    showToast({
      title: "头像上传成功",
      icon: "success",
    });
  } catch (error) {
    showRequestError(error, "上传头像失败");
  } finally {
    isUploading.value = false;
  }
};

const showGenderPicker = () => {
  uni.vibrateShort({ type: "light" });
  actionSheet.show({
    title: "选择性别",
    itemList: USER_GENDER_OPTIONS.map((item) => item.label),
    success: (res) => {
      formData.value.gender = USER_GENDER_OPTIONS[res.tapIndex].value;
    },
  });
};

const onDateChange = (e) => {
  formData.value.birthday = formatDateYMD(e.detail.value);
};

const onRegionChange = (e) => {
  const region = e.detail.value;
  formData.value.region = region.filter(Boolean).join(" ");
};

const handleBindSendCode = async () => {
  if (bindSending.value || bindCooldown.value > 0) return;
  if (!/^1[3-9]\d{9}$/.test(bindPhoneInput.value)) {
    showToast({ title: "请输入正确手机号", icon: "none" });
    return;
  }
  bindSending.value = true;
  try {
    const res = await sendCode(bindPhoneInput.value, "bind");
    if (res.code) {
      showToast({ title: `测试验证码：${res.code}`, icon: "none" });
    } else {
      showToast({ title: "验证码已发送", icon: "success" });
    }
    startBindCooldown();
  } catch (error) {
    showRequestError(error, "发送失败");
  } finally {
    bindSending.value = false;
  }
};

const handleBindPhone = async () => {
  if (!/^1[3-9]\d{9}$/.test(bindPhoneInput.value) || !bindCode.value) {
    showToast({ title: "请填写手机号和验证码", icon: "none" });
    return;
  }
  loading.value = true;
  try {
    const user = await bindPhone(bindPhoneInput.value, bindCode.value);
    userPhone.value = user.phone || bindPhoneInput.value;
    phoneBound.value = true;
    openidBound.value = user.openidBound ?? !!user.openid;
    bindSheetVisible.value = false;

    const token = getToken();
    const stored = getStoredUser();
    if (token && stored) {
      setUserInfo({ ...stored, ...user, phoneBound: true }, token);
    }

    showToast({ title: "绑定成功", icon: "success" });
    uni.$emit("refreshUserInfo");
  } catch (error) {
    showRequestError(error, "绑定失败");
  } finally {
    loading.value = false;
  }
};

const handleSave = async () => {
  if (!formData.value.username.trim()) {
    showToast({
      title: "请输入昵称",
      icon: "none",
    });
    return;
  }

  uni.vibrateShort({ type: "medium" });
  loading.value = true;

  try {
    await updateUserInfo({
      username: formData.value.username,
      avatar: formData.value.avatar,
      signature: formData.value.signature,
      gender: formData.value.gender || undefined,
      birthday: formData.value.birthday,
      region: formData.value.region,
    });

    showToast({
      title: "保存成功",
      icon: "success",
    });

    uni.$emit("refreshUserInfo");

    setTimeout(() => {
      uni.navigateBack();
    }, 1500);
  } catch (error) {
    showRequestError(error, "保存失败");
  } finally {
    loading.value = false;
  }
};
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";
@import "@/styles/layout.scss";

.edit-info-inner {
  padding-top: 0;
}

.bind-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24rpx;
  padding: 32rpx;
  margin-bottom: $spacing-component;
  border-radius: $border-radius-base;
  background: linear-gradient(135deg, #fff7f1 0%, #ffe2c2 100%);
  box-shadow: $shadow-light;
}

.bind-card-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.bind-card-title {
  font-size: $font-size-button;
  font-weight: $font-weight-bold;
  color: $color-gray-dark;
}

.bind-card-desc {
  font-size: $font-size-helper;
  color: $color-gray-medium;
  line-height: 1.5;
}

.bind-card-btn {
  flex-shrink: 0;
  padding: 16rpx 32rpx;
  border-radius: 999rpx;
  background: $color-primary;

  text {
    font-size: 26rpx;
    font-weight: $font-weight-bold;
    color: $color-bg-white;
  }

  &:active {
    transform: scale($scale-press);
  }
}

.bind-sheet {
  padding: 8rpx 8rpx 24rpx;
}

.bind-input {
  width: 100%;
  height: 88rpx;
  padding: 0 28rpx;
  border-radius: 24rpx;
  background: $color-bg-primary;
  font-size: $font-size-body;
  color: $color-gray-dark;
  box-sizing: border-box;
}

.bind-code-row {
  margin-top: 20rpx;
  display: flex;
  gap: 16rpx;
}

.bind-code-input {
  flex: 1;
}

.bind-code-btn {
  flex-shrink: 0;
  min-width: 200rpx;
  height: 88rpx;
  padding: 0 24rpx;
  border-radius: 24rpx;
  background: #ffe2c2;
  display: flex;
  align-items: center;
  justify-content: center;

  text {
    font-size: 26rpx;
    font-weight: 600;
    color: #d97d2f;
  }

  &.disabled {
    opacity: 0.55;
  }
}

.bind-submit {
  margin-top: 32rpx;
  height: 96rpx;
  border-radius: 999rpx;
  background: linear-gradient(135deg, $color-primary 0%, #ffd4f0 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: $shadow-pink;

  text {
    font-size: $font-size-button;
    font-weight: $font-weight-bold;
    color: $color-bg-white;
  }

  &:active {
    transform: scale($scale-press);
  }
}

.form-item {
  background: $color-bg-white;
  border-radius: $border-radius-base;
  padding: $spacing-component;
  margin-bottom: $spacing-component;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: $shadow-light;

  &.textarea-item {
    flex-direction: column;
    align-items: stretch;
  }

  .item-label {
    font-size: $font-size-button;
    color: $color-gray-dark;
    font-weight: $font-weight-bold;
    min-width: 120rpx;
  }

  .item-input {
    flex: 1;
    font-size: $font-size-body;
    color: $color-gray-dark;
    text-align: right;
  }

  .item-value {
    display: flex;
    align-items: center;
    gap: $spacing-small;

    .avatar-preview {
      width: $avatar-size-medium;
      height: $avatar-size-medium;
      border-radius: $border-radius-circle;
    }

    .value-text {
      font-size: $font-size-body;
      color: $color-gray-medium;
    }

    .arrow-icon {
      width: 32rpx;
      height: 32rpx;
    }
  }

  .item-textarea {
    width: 100%;
    min-height: 200rpx;
    margin-top: $spacing-item;
    padding: $spacing-component;
    background: $color-bg-primary;
    border-radius: $border-radius-base;
    font-size: $font-size-body;
    color: $color-gray-dark;
    line-height: 1.6;
  }

  .char-count {
    text-align: right;
    margin-top: $spacing-small;
    font-size: $font-size-helper;
    color: $color-gray-lighter;
  }
}

.picker-content {
  width: 650rpx;
  display: flex;
  justify-content: space-between;
}

.save-btn {
  margin: $spacing-page-horizontal;
  height: $button-height-large;
  background: linear-gradient(135deg, $color-primary 0%, #ffd4f0 100%);
  border-radius: $border-radius-base;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: $shadow-pink;
  transition: transform $transition-base ease;

  &:active {
    transform: scale($scale-press);
  }

  .btn-text {
    font-size: $font-size-button;
    font-weight: $font-weight-bold;
    color: $color-bg-white;
  }
}
</style>
