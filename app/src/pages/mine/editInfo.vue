<template>
  <PageLayout>
    <template #navbar>
      <TopNavBar title="编辑资料" :showBack="true" />
    </template>

    <view class="page-inner edit-info-inner">
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

    <Loading :visible="loading" />
  </PageLayout>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import TopNavBar from "@/components/common/TopNavBar.vue";
import PageLayout from "@/components/common/PageLayout.vue";
import Loading from "@/components/common/Loading.vue";
import { getUserInfo, updateUserInfo, uploadAvatar } from "@/api/user";
import {
  USER_GENDER_OPTIONS,
  normalizeUserGender,
  formatUserGender,
  formatDateYMD,
} from "@/utils/format";
import dayjs from "dayjs";
import { resolveLocalOrMediaUrl, resolveMediaUrl } from "@/utils/media";
import { showRequestError } from "@/utils/request";
import { useChooseImage } from "@/composables/useChooseImage";

const loading = ref(false);
const isUploading = ref(false);
const { chooseSingle } = useChooseImage();

const formData = ref({
  avatar: "/static/images/avatar-default.png",
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
    formData.value = {
      avatar: user.avatar ? resolveMediaUrl(user.avatar) : "/static/images/avatar-default.png",
      username: user.username || "",
      gender: normalizeUserGender(user.gender) || "",
      birthday: formatDateYMD(user.birthday),
      region: user.region || "",
      signature: user.signature || "",
    };
  } catch (error) {
    console.error("获取用户信息失败:", error);
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
    uni.showToast({
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
  uni.showActionSheet({
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

const handleSave = async () => {
  if (!formData.value.username.trim()) {
    uni.showToast({
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

    uni.showToast({
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
