<template>
  <view class="pet-info-page">
    <TopNavBar title="宠物信息" :showBack="true" />

    <view class="page-content">
      <scroll-view class="form-scroll" scroll-y>
        <!-- 宠物头像 -->
        <view class="avatar-section">
          <image
            class="pet-avatar"
            :src="formData.avatar"
            mode="aspectFill"
            @tap="chooseAvatar"
          ></image>
          <text class="avatar-tip">点击更换头像</text>
        </view>

        <!-- 宠物名字 -->
        <view class="form-item">
          <text class="item-label">宠物名字</text>
          <input
            class="item-input"
            v-model="formData.name"
            placeholder="请输入宠物名字"
            maxlength="10"
          />
        </view>

        <!-- 品种 -->
        <view class="form-item" @tap="showBreedPicker">
          <text class="item-label">品种</text>
          <view class="item-value">
            <text class="value-text">{{ formData.breed || "请选择" }}</text>
            <image
              class="arrow-icon"
              src="/static/images/icon-arrow-right.png"
              mode="aspectFit"
            ></image>
          </view>
        </view>

        <!-- 性别 -->
        <view class="form-item" @tap="showGenderPicker">
          <text class="item-label">性别</text>
          <view class="item-value">
            <text class="value-text">{{ formData.gender || "请选择" }}</text>
            <image
              class="arrow-icon"
              src="/static/images/icon-arrow-right.png"
              mode="aspectFit"
            ></image>
          </view>
        </view>

        <!-- 生日 -->
        <view class="form-item" @tap="showDatePicker">
          <text class="item-label">生日</text>
          <view class="item-value">
            <text class="value-text">{{ formData.birthday || "请选择" }}</text>
            <image
              class="arrow-icon"
              src="/static/images/icon-arrow-right.png"
              mode="aspectFit"
            ></image>
          </view>
        </view>

        <!-- 体重 -->
        <view class="form-item">
          <text class="item-label">体重(kg)</text>
          <input
            class="item-input"
            v-model="formData.weight"
            type="digit"
            placeholder="请输入体重"
          />
        </view>

        <!-- 性格标签 -->
        <view class="form-item tags-item">
          <text class="item-label">性格标签</text>
          <view class="tags-container">
            <view
              v-for="tag in characterTags"
              :key="tag"
              class="tag-item"
              :class="{ active: formData.character.includes(tag) }"
              @tap="toggleTag(tag)"
            >
              <text class="tag-text">{{ tag }}</text>
            </view>
          </view>
        </view>

        <!-- 简介 -->
        <view class="form-item textarea-item">
          <text class="item-label">简介</text>
          <textarea
            class="item-textarea"
            v-model="formData.bio"
            placeholder="介绍一下你的宠物吧"
            maxlength="100"
          ></textarea>
          <text class="char-count">{{ formData.bio.length }}/100</text>
        </view>

        <!-- 删除按钮 -->
        <view v-if="isEdit" class="delete-btn" @tap="handleDelete">
          <text class="btn-text">删除宠物</text>
        </view>
      </scroll-view>

      <!-- 保存按钮 -->
      <view class="save-btn" @tap="handleSave">
        <text class="btn-text">保存</text>
      </view>
    </view>

    <Loading :visible="loading" />
  </view>
</template>

<script setup>
import { ref } from "vue";
import TopNavBar from "@/components/common/TopNavBar.vue";
import Loading from "@/components/common/Loading.vue";

const loading = ref(false);
const isEdit = ref(true);

const characterTags = [
  "活泼",
  "温顺",
  "粘人",
  "独立",
  "聪明",
  "调皮",
  "安静",
  "友好",
];

const formData = ref({
  avatar: "/static/images/avatar-default.png",
  name: "旺财",
  breed: "金毛",
  gender: "公",
  birthday: "2020-01-01",
  weight: "30",
  character: ["活泼", "聪明", "友好"],
  bio: "一只可爱的金毛",
});

const chooseAvatar = () => {
  uni.vibrateShort({ type: "light" });
  uni.chooseImage({
    count: 1,
    sizeType: ["compressed"],
    sourceType: ["album", "camera"],
    success: (res) => {
      formData.value.avatar = res.tempFilePaths[0];
    },
  });
};

const showBreedPicker = () => {
  uni.vibrateShort({ type: "light" });
  uni.showActionSheet({
    itemList: [
      "金毛",
      "哈士奇",
      "泰迪",
      "柯基",
      "萨摩耶",
      "边牧",
      "拉布拉多",
      "其他",
    ],
    success: (res) => {
      const breeds = [
        "金毛",
        "哈士奇",
        "泰迪",
        "柯基",
        "萨摩耶",
        "边牧",
        "拉布拉多",
        "其他",
      ];
      formData.value.breed = breeds[res.tapIndex];
    },
  });
};

const showGenderPicker = () => {
  uni.vibrateShort({ type: "light" });
  uni.showActionSheet({
    itemList: ["公", "母"],
    success: (res) => {
      const genders = ["公", "母"];
      formData.value.gender = genders[res.tapIndex];
    },
  });
};

const showDatePicker = () => {
  uni.vibrateShort({ type: "light" });
  uni.showToast({
    title: "日期选择功能开发中",
    icon: "none",
  });
};

const toggleTag = (tag) => {
  uni.vibrateShort({ type: "light" });
  const index = formData.value.character.indexOf(tag);
  if (index > -1) {
    formData.value.character.splice(index, 1);
  } else {
    if (formData.value.character.length < 5) {
      formData.value.character.push(tag);
    } else {
      uni.showToast({
        title: "最多选择5个标签",
        icon: "none",
      });
    }
  }
};

const handleSave = () => {
  if (!formData.value.name.trim()) {
    uni.showToast({
      title: "请输入宠物名字",
      icon: "none",
    });
    return;
  }

  uni.vibrateShort({ type: "medium" });
  loading.value = true;

  setTimeout(() => {
    loading.value = false;
    uni.showToast({
      title: "保存成功",
      icon: "success",
    });
    setTimeout(() => {
      uni.navigateBack();
    }, 1500);
  }, 1500);
};

const handleDelete = () => {
  uni.vibrateShort({ type: "medium" });
  uni.showModal({
    title: "提示",
    content: "确定要删除这个宠物信息吗？",
    success: (res) => {
      if (res.confirm) {
        uni.showToast({
          title: "删除成功",
          icon: "success",
        });
        setTimeout(() => {
          uni.navigateBack();
        }, 1500);
      }
    },
  });
};
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";

.pet-info-page {
  width: 100%;
  min-height: 100vh;
  background: $color-bg-primary;
}

.page-content {
  padding-top: $nav-bar-height;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.form-scroll {
  flex: 1;
  box-sizing: border-box;
  padding: $spacing-page-horizontal;
  padding-bottom: calc(120rpx + env(safe-area-inset-bottom));
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-item;
  padding: $spacing-component 0;
  margin-bottom: $spacing-component;

  .pet-avatar {
    width: 200rpx;
    height: 200rpx;
    border-radius: $border-radius-circle;
    border: 4rpx solid $color-primary;
  }

  .avatar-tip {
    font-size: $font-size-body;
    color: $color-gray-lighter;
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

  &.tags-item,
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

    .value-text {
      font-size: $font-size-body;
      color: $color-gray-medium;
    }

    .arrow-icon {
      width: 32rpx;
      height: 32rpx;
    }
  }

  .tags-container {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-small;
    margin-top: $spacing-item;

    .tag-item {
      padding: 12rpx 24rpx;
      background: $color-bg-primary;
      border-radius: $border-radius-base;
      border: 2rpx solid transparent;
      transition: all $transition-base ease;

      &.active {
        background: linear-gradient(135deg, $color-primary 0%, #ffd4f0 100%);
        border-color: $color-primary;

        .tag-text {
          color: $color-bg-white;
          font-weight: $font-weight-bold;
        }
      }

      .tag-text {
        font-size: $font-size-body;
        color: $color-gray-medium;
      }
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

.delete-btn {
  margin-top: $spacing-component;
  height: $button-height-large;
  background: $color-bg-white;
  border: $border-width solid #ff4d4f;
  border-radius: $border-radius-base;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform $transition-base ease;

  &:active {
    transform: scale($scale-press);
  }

  .btn-text {
    font-size: $font-size-button;
    font-weight: $font-weight-bold;
    color: #ff4d4f;
  }
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
