<template>
  <view class="page-container">
    <view class="header-safe"></view>
    <TopNavBar :title="isEdit ? '编辑宠物' : '添加宠物'" :showBack="true" />

    <!-- Main Content -->
    <scroll-view class="page-content" scroll-y>
      <!-- Avatar Upload Section -->
      <view class="avatar-section">
        <view class="avatar-wrapper" @tap="chooseAvatar">
          <image
            v-if="formData.avatar"
            class="avatar"
            :src="formData.avatar"
            mode="aspectFill"
          />
          <view v-else class="avatar-placeholder">
            <view class="avatar-icon"></view>
          </view>
          <view class="upload-btn">
            <view class="upload-icon"></view>
          </view>
        </view>
        <text class="avatar-tip">点击上传宠物头像</text>
      </view>

      <!-- Basic Info Section -->
      <view class="form-section">
        <text class="section-title">基本信息</text>

        <!-- 宠物名字 -->
        <view class="form-item">
          <view class="item-label">
            <view class="label-icon icon-name"></view>
            <text class="label-text">宠物名字</text>
          </view>
          <input
            class="item-input"
            v-model="formData.name"
            placeholder="请输入宠物名字"
            maxlength="20"
          />
        </view>

        <!-- 宠物种类 -->
        <view class="form-item" @tap="showSpeciesPicker">
          <view class="item-label">
            <view class="label-icon icon-species"></view>
            <text class="label-text">宠物种类</text>
          </view>
          <view class="item-value">
            <text class="value-text">{{ formData.species || "请选择" }}</text>
            <view class="arrow-icon"></view>
          </view>
        </view>

        <!-- 品种 -->
        <view class="form-item" @tap="showBreedPicker">
          <view class="item-label">
            <view class="label-icon icon-breed"></view>
            <text class="label-text">品种</text>
          </view>
          <view class="item-value">
            <text class="value-text">{{ formData.breed || "请选择" }}</text>
            <view class="arrow-icon"></view>
          </view>
        </view>

        <!-- 性别 -->
        <view class="form-item" @tap="showGenderPicker">
          <view class="item-label">
            <view class="label-icon icon-gender"></view>
            <text class="label-text">性别</text>
          </view>
          <view class="item-value">
            <text class="value-text">{{ formData.gender || "请选择" }}</text>
            <view class="arrow-icon"></view>
          </view>
        </view>

        <!-- 生日 -->
        <view class="form-item" @tap="showDatePicker">
          <view class="item-label">
            <view class="label-icon icon-birthday"></view>
            <text class="label-text">生日</text>
          </view>
          <view class="item-value">
            <text class="value-text">{{ formData.birthday || "请选择" }}</text>
            <view class="arrow-icon"></view>
          </view>
        </view>
      </view>

      <!-- Appearance Section -->
      <view class="form-section">
        <text class="section-title">外观特征</text>

        <!-- 毛色 -->
        <view class="form-item">
          <view class="item-label">
            <view class="label-icon icon-color"></view>
            <text class="label-text">毛色</text>
          </view>
          <input
            class="item-input"
            v-model="formData.color"
            placeholder="例如：金色、白色"
            maxlength="20"
          />
        </view>

        <!-- 体重 -->
        <view class="form-item">
          <view class="item-label">
            <view class="label-icon icon-weight"></view>
            <text class="label-text">体重 (kg)</text>
          </view>
          <input
            class="item-input"
            v-model="formData.weight"
            type="digit"
            placeholder="请输入体重"
          />
        </view>

        <!-- 体型 -->
        <view class="form-item" @tap="showSizePicker">
          <view class="item-label">
            <view class="label-icon icon-size"></view>
            <text class="label-text">体型</text>
          </view>
          <view class="item-value">
            <text class="value-text">{{ formData.size || "请选择" }}</text>
            <view class="arrow-icon"></view>
          </view>
        </view>
      </view>

      <!-- Health Section -->
      <view class="form-section">
        <text class="section-title">健康状况</text>

        <!-- 绝育状态 -->
        <view class="form-item switch-item">
          <view class="item-label">
            <view class="label-icon icon-neutered"></view>
            <text class="label-text">已绝育</text>
          </view>
          <switch
            :checked="formData.neutered"
            @change="onNeuteredChange"
            color="#FFC1E9"
          />
        </view>

        <!-- 疫苗情况 -->
        <view class="form-item" @tap="showVaccinePicker">
          <view class="item-label">
            <view class="label-icon icon-vaccine"></view>
            <text class="label-text">疫苗接种</text>
          </view>
          <view class="item-value">
            <text class="value-text">{{
              formData.vaccinated || "请选择"
            }}</text>
            <view class="arrow-icon"></view>
          </view>
        </view>

        <!-- 健康证明 -->
        <view class="form-item switch-item">
          <view class="item-label">
            <view class="label-icon icon-health"></view>
            <text class="label-text">有健康证明</text>
          </view>
          <switch
            :checked="formData.healthCertificate"
            @change="onHealthCertificateChange"
            color="#FFC1E9"
          />
        </view>
      </view>

      <!-- Personality Section -->
      <view class="form-section">
        <text class="section-title">性格特点</text>

        <view class="tags-container">
          <view
            v-for="tag in personalityTags"
            :key="tag.id"
            class="tag-item"
            :class="{ active: formData.personality.includes(tag.id) }"
            @tap="togglePersonality(tag.id)"
          >
            <view class="tag-icon" :class="tag.icon"></view>
            <text class="tag-text">{{ tag.label }}</text>
          </view>
        </view>

        <!-- 特殊习惯 -->
        <view class="form-item textarea-item">
          <view class="item-label">
            <view class="label-icon icon-habits"></view>
            <text class="label-text">特殊习惯</text>
          </view>
          <textarea
            class="item-textarea"
            v-model="formData.habits"
            placeholder="描述一下宠物的特殊习惯或行为特点..."
            maxlength="200"
          />
          <text class="char-count">{{ formData.habits.length }}/200</text>
        </view>
      </view>

      <!-- Photos Section -->
      <view class="form-section">
        <text class="section-title">宠物照片</text>

        <view class="photos-grid">
          <view
            v-for="(photo, index) in formData.photos"
            :key="index"
            class="photo-item"
          >
            <image
              class="photo"
              :src="photo"
              mode="aspectFill"
              @tap="previewPhoto(index)"
            />
            <view class="delete-photo" @tap.stop="deletePhoto(index)">
              <view class="delete-icon"></view>
            </view>
          </view>
          <view
            v-if="formData.photos.length < 9"
            class="add-photo"
            @tap="uploadPhotos"
          >
            <view class="add-photo-icon"></view>
            <text class="add-photo-text">添加照片</text>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- Bottom Action Buttons -->
    <view class="footer">
      <view v-if="isEdit" class="delete-btn" @tap="handleDelete">
        <text class="delete-text">删除宠物</text>
      </view>
      <view class="save-btn" @tap="handleSave">
        <text class="save-text">保存</text>
        <view class="save-icon"></view>
      </view>
    </view>

    <Loading :visible="loading" />
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import Loading from "@/components/common/Loading.vue";
import TopNavBar from "@/components/common/TopNavBar.vue";

const loading = ref(false);
const isEdit = ref(false);
const petId = ref<number | null>(null);

// 页面加载时检查是否是编辑模式
onMounted(() => {
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1] as any;
  const options = currentPage.options;

  if (options && options.id) {
    petId.value = parseInt(options.id);
    isEdit.value = true;
    // 模拟加载宠物数据
    loadPetData();
  }
});

const loadPetData = () => {
  loading.value = true;
  // 模拟加载数据
  setTimeout(() => {
    loading.value = false;
    // 这里应该从 API 加载数据，现在填充示例数据
    formData.value = {
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDMmXcenD7Vy5QjV1G_Xfi06jc81Yj88lORiEZbjjGYJpxAvIDZsNW6yqbtuORO1WkdL7Su7uobXV36nRKLAStG4Ml5z-LtZydoX6eRrV0LcTbxh3abh4oaJ88f-c78qkSB5pPbpp9hhDXOBHdCXiYr2gH96E6Hlk-PlzDv10lu3eAjH4NTqwsUN5CA7Xsf3kJw-g5mZW62CP2uF0ACl0weoZfPfUY_j3eo0S07Ajnb4nWbfxy_9_dFiwqtcTP1sj9CfZ5ZEDdJXxmR",
      name: "糯米 (Nuomi)",
      species: "狗狗",
      breed: "柯基",
      gender: "公",
      birthday: "2022-01-15",
      color: "金色",
      weight: "12.5",
      size: "小型",
      neutered: false,
      vaccinated: "已接种",
      healthCertificate: true,
      personality: ["active", "smart", "friendly"],
      habits: "喜欢玩球，每天傍晚特别活跃",
      photos: [],
    };
  }, 1000);
};

// 性格标签选项
const personalityTags = ref([
  { id: "active", label: "活泼", icon: "icon-active" },
  { id: "gentle", label: "温顺", icon: "icon-gentle" },
  { id: "clingy", label: "粘人", icon: "icon-clingy" },
  { id: "independent", label: "独立", icon: "icon-independent" },
  { id: "smart", label: "聪明", icon: "icon-smart" },
  { id: "naughty", label: "调皮", icon: "icon-naughty" },
  { id: "quiet", label: "安静", icon: "icon-quiet" },
  { id: "friendly", label: "友好", icon: "icon-friendly" },
]);

// 表单数据
const formData = ref({
  avatar: "",
  name: "",
  species: "",
  breed: "",
  gender: "",
  birthday: "",
  color: "",
  weight: "",
  size: "",
  neutered: false,
  vaccinated: "",
  healthCertificate: false,
  personality: [] as string[],
  habits: "",
  photos: [] as string[],
});

// 计算年龄
const calculateAge = (birthday: string) => {
  if (!birthday) return "";
  const birth = new Date(birthday);
  const now = new Date();
  const months =
    (now.getFullYear() - birth.getFullYear()) * 12 +
    now.getMonth() -
    birth.getMonth();

  if (months < 12) {
    return `${months}个月`;
  } else {
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    return remainingMonths > 0
      ? `${years}岁${remainingMonths}个月`
      : `${years}岁`;
  }
};

const goBack = () => {
  uni.vibrateShort({ type: "light" });
  uni.navigateBack();
};

// 上传头像
const chooseAvatar = () => {
  uni.vibrateShort({ type: "light" });
  uni.chooseImage({
    count: 1,
    sizeType: ["compressed"],
    sourceType: ["album", "camera"],
    success: (res) => {
      formData.value.avatar = res.tempFilePaths[0];
      uni.showToast({
        title: "头像上传成功",
        icon: "success",
      });
    },
  });
};

// 上传多张照片
const uploadPhotos = () => {
  uni.vibrateShort({ type: "light" });
  const maxCount = 9 - formData.value.photos.length;
  uni.chooseImage({
    count: maxCount,
    sizeType: ["compressed"],
    sourceType: ["album", "camera"],
    success: (res) => {
      formData.value.photos = [...formData.value.photos, ...res.tempFilePaths];
      uni.showToast({
        title: "照片上传成功",
        icon: "success",
      });
    },
  });
};

// 预览照片
const previewPhoto = (index: number) => {
  uni.vibrateShort({ type: "light" });
  uni.previewImage({
    urls: formData.value.photos,
    current: index,
  });
};

// 删除照片
const deletePhoto = (index: number) => {
  uni.vibrateShort({ type: "light" });
  uni.showModal({
    title: "提示",
    content: "确定要删除这张照片吗？",
    success: (res) => {
      if (res.confirm) {
        formData.value.photos.splice(index, 1);
        uni.showToast({
          title: "删除成功",
          icon: "success",
        });
      }
    },
  });
};

// 种类选择器
const showSpeciesPicker = () => {
  uni.vibrateShort({ type: "light" });
  const speciesList = ["狗狗", "猫咪", "其他"];
  uni.showActionSheet({
    itemList: speciesList,
    success: (res) => {
      formData.value.species = speciesList[res.tapIndex];
    },
  });
};

// 品种选择器
const showBreedPicker = () => {
  uni.vibrateShort({ type: "light" });
  const breedMap: Record<string, string[]> = {
    狗狗: [
      "金毛",
      "哈士奇",
      "泰迪",
      "柯基",
      "萨摩耶",
      "边牧",
      "拉布拉多",
      "柴犬",
      "博美",
      "其他",
    ],
    猫咪: ["英短", "美短", "布偶", "波斯猫", "暹罗猫", "缅因猫", "其他"],
    其他: ["兔子", "仓鼠", "龙猫", "其他"],
  };

  const breeds = formData.value.species
    ? breedMap[formData.value.species]
    : ["请先选择种类"];
  uni.showActionSheet({
    itemList: breeds,
    success: (res) => {
      formData.value.breed = breeds[res.tapIndex];
    },
  });
};

// 性别选择器
const showGenderPicker = () => {
  uni.vibrateShort({ type: "light" });
  const genders = ["公", "母"];
  uni.showActionSheet({
    itemList: genders,
    success: (res) => {
      formData.value.gender = genders[res.tapIndex];
    },
  });
};

// 日期选择器
const showDatePicker = () => {
  uni.vibrateShort({ type: "light" });
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  const currentDay = currentDate.getDate();

  uni.showDatePicker({
    startDate: "2010-01-01",
    endDate: `${currentYear}-${currentMonth}-${currentDay}`,
    success: (res) => {
      formData.value.birthday = res.dateString;
      // 自动计算并提示年龄
      const age = calculateAge(res.dateString);
      uni.showToast({
        title: `已选择 ${res.dateString}，约${age}`,
        icon: "none",
        duration: 2000,
      });
    },
  });
};

// 体型选择器
const showSizePicker = () => {
  uni.vibrateShort({ type: "light" });
  const sizes = ["小型", "中型", "大型"];
  uni.showActionSheet({
    itemList: sizes,
    success: (res) => {
      formData.value.size = sizes[res.tapIndex];
    },
  });
};

// 疫苗选择器
const showVaccinePicker = () => {
  uni.vibrateShort({ type: "light" });
  const vaccines = ["已接种", "未接种", "接种中"];
  uni.showActionSheet({
    itemList: vaccines,
    success: (res) => {
      formData.value.vaccinated = vaccines[res.tapIndex];
    },
  });
};

// 绝育状态切换
const onNeuteredChange = (e: any) => {
  uni.vibrateShort({ type: "light" });
  formData.value.neutered = e.detail.value;
};

// 健康证明切换
const onHealthCertificateChange = (e: any) => {
  uni.vibrateShort({ type: "light" });
  formData.value.healthCertificate = e.detail.value;
};

// 性格标签切换
const togglePersonality = (tagId: string) => {
  uni.vibrateShort({ type: "light" });
  const index = formData.value.personality.indexOf(tagId);
  if (index > -1) {
    formData.value.personality.splice(index, 1);
  } else {
    if (formData.value.personality.length < 5) {
      formData.value.personality.push(tagId);
    } else {
      uni.showToast({
        title: "最多选择 5 个性格标签",
        icon: "none",
      });
    }
  }
};

// 保存
const handleSave = () => {
  if (!formData.value.name.trim()) {
    uni.showToast({
      title: "请输入宠物名字",
      icon: "none",
    });
    return;
  }

  if (!formData.value.species) {
    uni.showToast({
      title: "请选择宠物种类",
      icon: "none",
    });
    return;
  }

  uni.vibrateShort({ type: "medium" });
  loading.value = true;

  // 模拟保存
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

// 删除
const handleDelete = () => {
  uni.vibrateShort({ type: "medium" });
  uni.showModal({
    title: "提示",
    content: "确定要删除这个宠物信息吗？此操作不可恢复",
    confirmColor: "#ba1a1a",
    success: (res) => {
      if (res.confirm) {
        loading.value = true;
        setTimeout(() => {
          loading.value = false;
          uni.showToast({
            title: "删除成功",
            icon: "success",
          });
          setTimeout(() => {
            uni.navigateBack();
          }, 1500);
        }, 1000);
      }
    },
  });
};
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";

.add-pet-page {
  min-height: 100vh;
  background: $color-bg-primary;
  display: flex;
  flex-direction: column;
}

/* Page Content */
.page-content {
  box-sizing: border-box;
  flex: 1;
  padding: 40rpx 40rpx 200rpx;
}

/* Avatar Section */
.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 48rpx;
}

.avatar-wrapper {
  position: relative;
  margin-bottom: 32rpx;
}

.avatar {
  width: 256rpx;
  height: 256rpx;
  border-radius: 50%;
  object-fit: cover;
  border: 8rpx solid #ffffff;
  box-shadow: 0 8rpx 32rpx rgba(168, 155, 157, 0.12);
}

.avatar-placeholder {
  width: 256rpx;
  height: 256rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #ffdde2 0%, #ede2c0 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 8rpx solid #ffffff;
  box-shadow: 0 8rpx 32rpx rgba(168, 155, 157, 0.12);
}

.avatar-icon {
  width: 128rpx;
  height: 128rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2371585C'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.03-1.99 1.27-5.62 3.72-.53.36-1.01.54-1.44.53-.47-.01-1.38-.27-2.06-.49-.83-.27-1.49-.42-1.43-.88.03-.24.37-.49 1.02-.74 3.99-1.74 6.65-2.89 7.99-3.45 3.81-1.6 4.6-1.88 5.12-1.89.11 0 .37.03.53.18.14.12.18.28.2.45-.01.06.01.24 0 .38z'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;
  opacity: 0.5;
}

.upload-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background: #71585c;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 8rpx solid #ffffff;
  box-shadow: 0 4rpx 16rpx rgba(113, 88, 92, 0.3);
  transition: transform 0.2s ease;

  &:active {
    transform: scale(1);
  }
}

.upload-icon {
  width: 40rpx;
  height: 40rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23FFFFFF'%3E%3Cpath d='M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;
}

.avatar-tip {
  font-size: 24rpx;
  font-weight: 700;
  color: #4f4446;
  letter-spacing: 0.05em;
  opacity: 0.7;
}

/* Form Section */
.form-section {
  margin-bottom: 48rpx;
}

.section-title {
  display: block;
  font-size: 24rpx;
  font-weight: 700;
  color: #71585c;
  letter-spacing: 0.05em;
  padding: 0 16rpx 24rpx;
}

.form-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32rpx;
  background: #ffffff;
  border-radius: 32rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 8rpx 32rpx rgba(168, 155, 157, 0.12);
  transition: background 0.2s ease;

  &:active {
    background: rgba(255, 221, 226, 0.1);
  }

  &.switch-item {
    justify-content: space-between;
  }

  &.textarea-item {
    flex-direction: column;
    align-items: stretch;
  }
}

.item-label {
  display: flex;
  align-items: center;
  gap: 20rpx;
  flex: 1;
}

.label-icon {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  background: rgba(255, 221, 226, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;

  &.icon-name {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2371585C'%3E%3Cpath d='M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z'/%3E%3C/svg%3E")
      no-repeat center;
    background-size: 60%;
    background-color: rgba(255, 221, 226, 0.5);
  }

  &.icon-species,
  &.icon-breed {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2371585C'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.03-1.99 1.27-5.62 3.72-.53.36-1.01.54-1.44.53-.47-.01-1.38-.27-2.06-.49-.83-.27-1.49-.42-1.43-.88.03-.24.37-.49 1.02-.74 3.99-1.74 6.65-2.89 7.99-3.45 3.81-1.6 4.6-1.88 5.12-1.89.11 0 .37.03.53.18.14.12.18.28.2.45-.01.06.01.24 0 .38z'/%3E%3C/svg%3E")
      no-repeat center;
    background-size: 60%;
    background-color: rgba(218, 234, 216, 0.5);
  }

  &.icon-gender {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2371585C'%3E%3Cpath d='M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16zm3-7a1 1 0 11-2 0 1 1 0 012 0zm-3 3a1 1 0 01-1-1v-3a1 1 0 012 0v3a1 1 0 01-1 1z'/%3E%3C/svg%3E")
      no-repeat center;
    background-size: 60%;
    background-color: rgba(255, 221, 226, 0.5);
  }

  &.icon-birthday {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2371585C'%3E%3Cpath d='M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z'/%3E%3C/svg%3E")
      no-repeat center;
    background-size: 60%;
    background-color: rgba(234, 223, 189, 0.5);
  }

  &.icon-color {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2371585C'%3E%3Cpath d='M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z'/%3E%3C/svg%3E")
      no-repeat center;
    background-size: 60%;
    background-color: rgba(224, 247, 255, 0.5);
  }

  &.icon-weight {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2371585C'%3E%3Cpath d='M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8z'/%3E%3C/svg%3E")
      no-repeat center;
    background-size: 60%;
    background-color: rgba(255, 235, 205, 0.5);
  }

  &.icon-size {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2371585C'%3E%3Cpath d='M3 17h18v-2H3v2zm0 3h18v-1H3v1zm0-7h18v-3H3v3zm0-9v4h18V4H3z'/%3E%3C/svg%3E")
      no-repeat center;
    background-size: 60%;
    background-color: rgba(218, 234, 216, 0.5);
  }

  &.icon-neutered {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2371585C'%3E%3Cpath d='M9 16l2.24-2.24c.39-.39.39-1.02 0-1.41L9 10.17 4.83 14.34c-.39.39-.39 1.02 0 1.41l4.17 4.17c.39.39 1.02.39 1.41 0L14.83 16H9zm10.12-3.41l-3.71-3.71c-.39-.39-1.02-.39-1.41 0L12.59 10.29c-.39.39-.39 1.02 0 1.41l3.71 3.71c.39.39 1.02.39 1.41 0l1.41-1.41c.39-.39.39-1.03 0-1.42z'/%3E%3C/svg%3E")
      no-repeat center;
    background-size: 60%;
    background-color: rgba(255, 218, 214, 0.5);
  }

  &.icon-vaccine {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2371585C'%3E%3Cpath d='M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14h-2v-4h2v4zm0-6h-2V7h2v4z'/%3E%3C/svg%3E")
      no-repeat center;
    background-size: 60%;
    background-color: rgba(224, 247, 255, 0.5);
  }

  &.icon-health {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2371585C'%3E%3Cpath d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/%3E%3C/svg%3E")
      no-repeat center;
    background-size: 60%;
    background-color: rgba(255, 182, 193, 0.5);
  }

  &.icon-habits {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2371585C'%3E%3Cpath d='M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z'/%3E%3C/svg%3E")
      no-repeat center;
    background-size: 60%;
    background-color: rgba(234, 223, 189, 0.5);
  }
}

.label-text {
  font-size: 32rpx;
  font-weight: 500;
  color: #1e1b1b;
}

.item-input {
  flex: 1;
  font-size: 32rpx;
  color: #1e1b1b;
  text-align: right;
}

.item-value {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.value-text {
  font-size: 32rpx;
  color: #807476;
}

.arrow-icon {
  width: 32rpx;
  height: 32rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23807476'%3E%3Cpath d='M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;
  opacity: 0.5;
}

.item-textarea {
  width: 100%;
  min-height: 200rpx;
  background: rgba(243, 236, 236, 0.5);
  border-radius: 24rpx;
  font-size: 28rpx;
  color: #1e1b1b;
  line-height: 1.6;
  margin-top: 16rpx;
}

.char-count {
  text-align: right;
  margin-top: 16rpx;
  font-size: 24rpx;
  color: #807476;
  opacity: 0.6;
}

/* Tags Container */
.tags-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20rpx;
  padding: 0 16rpx 24rpx;
}

.tag-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
  padding: 24rpx 16rpx;
  background: #ffffff;
  border-radius: 32rpx;
  box-shadow: 0 4rpx 16rpx rgba(168, 155, 157, 0.08);
  transition: all 0.2s ease;

  &:active {
    transform: scale(1);
  }

  &.active {
    background: linear-gradient(135deg, #ffdde2 0%, #ede2c0 100%);
    box-shadow: 0 8rpx 24rpx rgba(113, 88, 92, 0.2);

    .tag-text {
      color: #ffffff;
      font-weight: 700;
    }

    .tag-icon {
      opacity: 1;
    }
  }
}

.tag-icon {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  background: rgba(255, 221, 226, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.5;
  transition: opacity 0.2s ease;

  &.icon-active {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2371585C'%3E%3Cpath d='M13 10V3L4 14h7v7l9-11h-7z'/%3E%3C/svg%3E")
      no-repeat center;
    background-size: 60%;
  }

  &.icon-gentle {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2371585C'%3E%3Cpath d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/%3E%3C/svg%3E")
      no-repeat center;
    background-size: 60%;
  }

  &.icon-clingy {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2371585C'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z'/%3E%3C/svg%3E")
      no-repeat center;
    background-size: 60%;
  }

  &.icon-independent {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2371585C'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z'/%3E%3C/svg%3E")
      no-repeat center;
    background-size: 60%;
  }

  &.icon-smart {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2371585C'%3E%3Cpath d='M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z'/%3E%3C/svg%3E")
      no-repeat center;
    background-size: 60%;
  }

  &.icon-naughty {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2371585C'%3E%3Cpath d='M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z'/%3E%3C/svg%3E")
      no-repeat center;
    background-size: 60%;
  }

  &.icon-quiet {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2371585C'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z'/%3E%3C/svg%3E")
      no-repeat center;
    background-size: 60%;
  }

  &.icon-friendly {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2371585C'%3E%3Cpath d='M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z'/%3E%3C/svg%3E")
      no-repeat center;
    background-size: 60%;
  }
}

.tag-text {
  font-size: 24rpx;
  color: #4f4446;
  font-weight: 500;
}

/* Photos Grid */
.photos-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20rpx;
  padding: 0 16rpx;
}

.photo-item {
  position: relative;
  aspect-ratio: 1;
  border-radius: 24rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 16rpx rgba(168, 155, 157, 0.12);
}

.photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.delete-photo {
  position: absolute;
  top: 8rpx;
  right: 8rpx;
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
  transition: transform 0.2s ease;

  &:active {
    transform: scale(1);
  }
}

.delete-icon {
  width: 32rpx;
  height: 32rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ba1a1a'%3E%3Cpath d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;
}

.add-photo {
  aspect-ratio: 1;
  border-radius: 24rpx;
  border: 4rpx dashed rgba(113, 88, 92, 0.3);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
  background: rgba(255, 221, 226, 0.1);
  transition: all 0.2s ease;

  &:active {
    background: rgba(255, 221, 226, 0.2);
    transform: scale(1);
  }
}

.add-photo-icon {
  width: 64rpx;
  height: 64rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2371585C'%3E%3Cpath d='M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;
  opacity: 0.5;
}

.add-photo-text {
  font-size: 24rpx;
  color: #71585c;
  opacity: 0.7;
}

/* Footer */
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 32rpx 40rpx calc(32rpx + env(safe-area-inset-bottom));
  background: #fff8f7;
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.delete-btn {
  height: 96rpx;
  background: #ffffff;
  border: 4rpx solid #ba1a1a;
  border-radius: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 32rpx rgba(168, 155, 157, 0.12);
  transition: transform 0.2s ease;

  &:active {
    transform: scale(1);
  }
}

.delete-text {
  font-size: 32rpx;
  font-weight: 600;
  color: #ba1a1a;
}

.save-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
  height: 96rpx;
  background: #71585c;
  border-radius: 48rpx;
  box-shadow: 0 8rpx 32rpx rgba(113, 88, 92, 0.2);
  transition: transform 0.2s ease;

  &:active {
    transform: scale(1);
  }
}

.save-text {
  font-size: 32rpx;
  font-weight: 600;
  color: #ffffff;
}

.save-icon {
  width: 40rpx;
  height: 40rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23FFFFFF'%3E%3Cpath d='M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;
}
</style>
