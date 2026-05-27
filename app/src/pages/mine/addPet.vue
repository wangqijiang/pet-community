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
            :src="getFullAvatarUrl(formData.avatar)"
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
            <text class="value-text">{{ formData.type || "请选择" }}</text>
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

        <!-- 年龄 -->
        <view class="form-item">
          <view class="item-label">
            <view class="label-icon icon-birthday"></view>
            <text class="label-text">年龄</text>
          </view>
          <input
            class="item-input"
            v-model="formData.age"
            placeholder="例如：2岁"
            maxlength="10"
          />
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
import { ref, onMounted } from "vue";
import Loading from "@/components/common/Loading.vue";
import TopNavBar from "@/components/common/TopNavBar.vue";
import {
  getPetDetail,
  addPet,
  updatePet,
  deletePet,
  type Pet,
} from "@/api/pet";

const loading = ref(false);
const isEdit = ref(false);
const petId = ref<number | null>(null);

const getFullAvatarUrl = (avatar: string) => {
  if (!avatar) return "";
  if (avatar.startsWith("http")) return avatar;
  return `${process.env.VUE_APP_API_BASE}${avatar}`;
};

// 页面加载时检查是否是编辑模式
onMounted(() => {
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1] as any;
  const options = currentPage.options;

  if (options && options.id) {
    petId.value = parseInt(options.id);
    isEdit.value = true;
    loadPetData();
  }
});

const loadPetData = async () => {
  loading.value = true;
  try {
    if (petId.value) {
      const data = await getPetDetail(petId.value);
      formData.value = {
        avatar: data.avatar || "",
        name: data.name || "",
        type: data.type || "",
        breed: data.breed || "",
        gender: "",
        age: data.age || "",
        color: "",
        weight: "",
        size: "",
        neutered: false,
        vaccinated: "",
        healthCertificate: false,
        personality: [],
        habits: "",
        photos: [],
      };
    }
  } catch (error) {
    console.error("获取宠物详情失败:", error);
    uni.showToast({
      title: "获取宠物详情失败",
      icon: "none",
    });
  } finally {
    loading.value = false;
  }
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
  type: "",
  breed: "",
  gender: "",
  age: "",
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
  console.log("showSpeciesPicker called");
  const speciesList = ["狗狗", "猫咪", "其他"];
  uni.showActionSheet({
    itemList: speciesList,
    success: function(res) {
      console.log("species selected:", speciesList[res.tapIndex]);
      formData.value.type = speciesList[res.tapIndex];
      console.log("formData.type set to:", formData.value.type);
    },
    fail: function(err) {
      console.log("showActionSheet fail:", err);
    }
  });
};

// 品种选择器
const showBreedPicker = () => {
  uni.vibrateShort({ type: "light" });
  console.log("showBreedPicker called, type:", formData.value.type);
  
  const breedMap: Record<string, string[]> = {
    "狗狗": [
      "金毛",
      "哈士奇",
      "泰迪",
      "柯基",
      "其他",
    ],
    "猫咪": ["英短", "美短", "布偶", "缅因猫", "其他"],
    "其他": ["兔子", "仓鼠", "龙猫", "其他"],
  };

  let breeds = ["请先选择种类"];
  if (formData.value.type && breedMap[formData.value.type]) {
    breeds = breedMap[formData.value.type];
  }
  
  console.log("breeds:", breeds);
  
  uni.showActionSheet({
    itemList: breeds,
    success: function(res) {
      console.log("success callback called, tapIndex:", res.tapIndex);
      formData.value.breed = breeds[res.tapIndex];
      console.log("breed set to:", formData.value.breed);
    },
    fail: function(err) {
      console.log("showActionSheet fail:", err);
    },
    complete: function() {
      console.log("showActionSheet complete");
    }
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

  uni.vibrateShort({ type: "medium" });
  loading.value = true;

  // 创建表单数据（保存所有填写的字段）
  const data: Record<string, any> = {
    name: formData.value.name,
    type: formData.value.type || null,
    breed: formData.value.breed || null,
    age: formData.value.age || null,
    gender: formData.value.gender || null,
    color: formData.value.color || null,
    weight: formData.value.weight || null,
    size: formData.value.size || null,
    neutered: formData.value.neutered,
    vaccinated: formData.value.vaccinated || null,
    healthCertificate: formData.value.healthCertificate,
    personality: formData.value.personality.length > 0 ? formData.value.personality.join(',') : null,
    habits: formData.value.habits || null,
    avatar: formData.value.avatar || null,
    photos: formData.value.photos.length > 0 ? JSON.stringify(formData.value.photos) : null,
  };

  if (isEdit.value && petId.value) {
    // 更新宠物
    updatePet(petId.value, data)
      .then(() => {
        uni.showToast({
          title: "更新成功",
          icon: "success",
        });
        setTimeout(() => {
          uni.navigateBack({
            delta: 1,
            success: () => {
              // 通知上一页刷新数据
              uni.$emit('refreshPetList');
            }
          });
        }, 1500);
      })
      .catch((error) => {
        console.error("更新宠物失败:", error);
        uni.showToast({
          title: "更新失败",
          icon: "none",
        });
      })
      .finally(() => {
        loading.value = false;
      });
  } else {
    // 添加宠物
    addPet(data)
      .then(() => {
        uni.showToast({
          title: "添加成功",
          icon: "success",
        });
        setTimeout(() => {
          uni.navigateBack({
            delta: 1,
            success: () => {
              // 通知上一页刷新数据
              uni.$emit('refreshPetList');
            }
          });
        }, 1500);
      })
      .catch((error) => {
        console.error("添加宠物失败:", error);
        uni.showToast({
          title: "添加失败",
          icon: "none",
        });
      })
      .finally(() => {
        loading.value = false;
      });
  }
};

// 删除
const handleDelete = () => {
  uni.vibrateShort({ type: "medium" });
  uni.showModal({
    title: "提示",
    content: "确定要删除这个宠物信息吗？此操作不可恢复",
    confirmColor: "#ba1a1a",
    success: (res) => {
      if (res.confirm && petId.value) {
        loading.value = true;
        deletePet(petId.value)
          .then(() => {
            uni.showToast({
              title: "删除成功",
              icon: "success",
            });
            setTimeout(() => {
              uni.navigateBack();
            }, 1500);
          })
          .catch((error) => {
            console.error("删除宠物失败:", error);
            uni.showToast({
              title: "删除失败",
              icon: "none",
            });
          })
          .finally(() => {
            loading.value = false;
          });
      }
    },
  });
};
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";
/* =========================
   Add Pet Page - 2026 Premium UI
   UniApp + rpx
   治愈系奶油宠物社区风格
========================= */

.add-pet-page {
  min-height: 100vh;
  background:
    radial-gradient(circle at top left, #fff4ef 0%, transparent 40%),
    radial-gradient(circle at bottom right, #f7f2ff 0%, transparent 35%),
    linear-gradient(180deg, #fffaf7 0%, #fffdfb 100%);
  display: flex;
  flex-direction: column;
}

/* =========================
   Scroll
========================= */

.page-content {
  flex: 1;
  box-sizing: border-box;
  padding:
    32rpx
    32rpx
    calc(220rpx + env(safe-area-inset-bottom));
}

/* =========================
   Avatar Area
========================= */

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 56rpx;
  padding-top: 12rpx;
}

.avatar-wrapper {
  position: relative;
}

.avatar,
.avatar-placeholder {
  width: 240rpx;
  height: 240rpx;
  border-radius: 50%;
}

.avatar {
  object-fit: cover;

  border: 8rpx solid rgba(255,255,255,.95);

  box-shadow:
    0 12rpx 40rpx rgba(255, 192, 203, 0.18),
    0 2rpx 10rpx rgba(0,0,0,.05);
}

.avatar-placeholder {
  background:
    linear-gradient(
      135deg,
      #ffe6eb 0%,
      #fff0dc 100%
    );

  display: flex;
  align-items: center;
  justify-content: center;

  border: 8rpx solid rgba(255,255,255,.95);

  box-shadow:
    0 12rpx 40rpx rgba(255, 192, 203, 0.18),
    0 2rpx 10rpx rgba(0,0,0,.05);
}

.avatar-icon {
  width: 96rpx;
  height: 96rpx;
  opacity: .5;
}

.upload-btn {
  position: absolute;
  right: 8rpx;
  bottom: 8rpx;

  width: 72rpx;
  height: 72rpx;

  border-radius: 50%;

  background: linear-gradient(
    135deg,
    #ffb8c8 0%,
    #ff9db5 100%
  );

  display: flex;
  align-items: center;
  justify-content: center;

  border: 6rpx solid #fff;

  box-shadow:
    0 8rpx 20rpx rgba(255, 157, 181, .35);

  transition: .2s;
}

.upload-btn:active {
  transform: scale(.95);
}

.avatar-tip {
  margin-top: 28rpx;

  font-size: 24rpx;
  color: #8d7b7d;

  letter-spacing: 1rpx;
}

/* =========================
   Section
========================= */

.form-section {
  margin-bottom: 44rpx;
}

.section-title {
  padding-left: 10rpx;
  margin-bottom: 24rpx;

  font-size: 26rpx;
  font-weight: 700;

  color: #7c6769;

  letter-spacing: 1rpx;
}

/* =========================
   Card
========================= */

.form-item {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 30rpx;

  margin-bottom: 22rpx;

  border-radius: 32rpx;

  background: rgba(255,255,255,.75);

  backdrop-filter: blur(30rpx);

  box-shadow:
    0 10rpx 30rpx rgba(255, 209, 220, 0.14),
    inset 0 1rpx 0 rgba(255,255,255,.8);

  transition: .2s;
}

.form-item:active {
  transform: scale(.99);
}

.form-item::before {
  content: "";

  position: absolute;
  inset: 0;

  border-radius: inherit;

  border: 1rpx solid rgba(255,255,255,.65);

  pointer-events: none;
}

/* =========================
   Label
========================= */

.item-label {
  display: flex;
  align-items: center;
  gap: 18rpx;

  flex-shrink: 0;
}

.label-icon {
  width: 52rpx;
  height: 52rpx;

  border-radius: 18rpx;

  background: linear-gradient(
    135deg,
    #ffe5ec 0%,
    #fff2d8 100%
  );

  box-shadow:
    inset 0 1rpx 2rpx rgba(255,255,255,.9),
    0 4rpx 10rpx rgba(255, 205, 220, .18);

  display: flex;
  align-items: center;
  justify-content: center;
}

.label-text {
  font-size: 30rpx;
  font-weight: 600;

  color: #473c3d;
}

/* =========================
   Input
========================= */

.item-input {
  flex: 1;

  text-align: right;

  font-size: 30rpx;
  font-weight: 500;

  color: #4f4446;
}

.item-input::placeholder {
  color: #b5a8aa;
}

/* =========================
   Value
========================= */

.item-value {
  display: flex;
  align-items: center;
  gap: 10rpx;
}

.value-text {
  font-size: 30rpx;
  color: #887b7d;
}

.arrow-icon {
  width: 28rpx;
  height: 28rpx;

  opacity: .45;
}

/* =========================
   Switch
========================= */

.switch-item {
  min-height: 112rpx;
}

/* =========================
   Textarea
========================= */

.textarea-item {
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.item-textarea {
  width: 100%;
  min-height: 220rpx;

  margin-top: 24rpx;

  padding: 24rpx;

  box-sizing: border-box;

  border-radius: 28rpx;

  background:
    linear-gradient(
      180deg,
      rgba(255,255,255,.9),
      rgba(255,248,248,.8)
    );

  font-size: 28rpx;
  line-height: 1.7;

  color: #4f4446;
}

.char-count {
  margin-top: 14rpx;

  text-align: right;

  font-size: 22rpx;
  color: #b0a5a7;
}

/* =========================
   Tags
========================= */

.tags-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);

  gap: 18rpx;
}

.tag-item {
  padding: 24rpx 12rpx;

  border-radius: 28rpx;

  background: rgba(255,255,255,.8);

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  gap: 14rpx;

  transition: .22s;

  box-shadow:
    0 6rpx 20rpx rgba(255, 215, 224, .12);
}

.tag-item:active {
  transform: scale(.96);
}

.tag-item.active {
  background:
    linear-gradient(
      135deg,
      #ffc7d5 0%,
      #ffdca8 100%
    );

  box-shadow:
    0 12rpx 28rpx rgba(255, 182, 193, .28);
}

.tag-item.active .tag-text {
  color: #fff;
}

.tag-icon {
  width: 48rpx;
  height: 48rpx;

  opacity: .75;
}

.tag-text {
  font-size: 24rpx;
  font-weight: 600;

  color: #66595b;
}

/* =========================
   Photos
========================= */

.photos-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);

  gap: 18rpx;
}

.photo-item {
  position: relative;

  aspect-ratio: 1;

  overflow: hidden;

  border-radius: 26rpx;

  background: #fff;

  box-shadow:
    0 8rpx 24rpx rgba(255, 210, 220, .16);
}

.photo {
  width: 100%;
  height: 100%;

  object-fit: cover;
}

.delete-photo {
  position: absolute;

  top: 10rpx;
  right: 10rpx;

  width: 46rpx;
  height: 46rpx;

  border-radius: 50%;

  background: rgba(255,255,255,.88);

  backdrop-filter: blur(12rpx);

  display: flex;
  align-items: center;
  justify-content: center;
}

.delete-icon {
  width: 24rpx;
  height: 24rpx;
}

.add-photo {
  aspect-ratio: 1;

  border-radius: 26rpx;

  border: 3rpx dashed rgba(255, 192, 203, .55);

  background:
    linear-gradient(
      180deg,
      rgba(255,255,255,.8),
      rgba(255,244,244,.75)
    );

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  gap: 14rpx;

  transition: .2s;
}

.add-photo:active {
  transform: scale(.97);
}

.add-photo-icon {
  width: 52rpx;
  height: 52rpx;

  opacity: .5;
}

.add-photo-text {
  font-size: 24rpx;
  color: #8d7b7d;
}

/* =========================
   Footer
========================= */

.footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;

  padding:
    24rpx
    32rpx
    calc(24rpx + env(safe-area-inset-bottom));

  background:
    linear-gradient(
      180deg,
      rgba(255,255,255,0),
      rgba(255,250,248,.96) 30%
    );

  backdrop-filter: blur(40rpx);

  display: flex;
  flex-direction: column;

  gap: 18rpx;
}

/* =========================
   Delete Button
========================= */

.delete-btn {
  height: 92rpx;

  border-radius: 999rpx;

  background: rgba(255,255,255,.92);

  border: 2rpx solid rgba(255,120,120,.18);

  display: flex;
  align-items: center;
  justify-content: center;

  box-shadow:
    0 8rpx 20rpx rgba(255,120,120,.08);
}

.delete-text {
  font-size: 30rpx;
  font-weight: 700;

  color: #d96c6c;
}

/* =========================
   Save Button
========================= */

.save-btn {
  height: 100rpx;

  border-radius: 999rpx;

  background:
    linear-gradient(
      135deg,
      #ffb7c9 0%,
      #ffc89f 100%
    );

  display: flex;
  align-items: center;
  justify-content: center;

  gap: 14rpx;

  box-shadow:
    0 14rpx 34rpx rgba(255, 183, 201, .28);

  transition: .2s;
}

.save-btn:active {
  transform: scale(.98);
}

.save-text {
  font-size: 32rpx;
  font-weight: 700;

  color: #fff;
}

.save-icon {
  width: 34rpx;
  height: 34rpx;
}

/* =========================
   Safe Area
========================= */

.header-safe {
  height: env(safe-area-inset-top);
}

/* =========================
   Animation
========================= */

.form-item,
.tag-item,
.photo-item,
.save-btn,
.delete-btn {
  will-change: transform;
}
</style>
