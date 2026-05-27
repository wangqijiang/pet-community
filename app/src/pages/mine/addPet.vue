<template>
  <view class="page-container">
    <view class="header-safe"></view>
    <TopNavBar :title="isEdit ? '编辑宠物' : '添加宠物'" :showBack="true" />

    <view class="form-container">
      <scroll-view class="form-scroll" scroll-y>
        <view class="avatar-section">
          <view class="avatar-wrapper" @tap="chooseAvatar">
            <image
              v-if="formData.avatar"
              class="avatar"
              :src="getFullAvatarUrl(formData.avatar)"
              mode="aspectFill"
            />
            <view v-else class="avatar-placeholder"></view>
            <view class="upload-btn">
              <text class="upload-icon">+</text>
            </view>
          </view>
          <text class="avatar-tip">点击上传宠物头像</text>
        </view>

        <view class="section">
          <text class="section-title">基本信息</text>
          <view class="card">
            <view class="item">
              <view class="left">
                <view class="icon"></view>
                <text class="label">宠物名字</text>
              </view>
              <input
                class="input-field"
                v-model="formData.name"
                placeholder="请输入"
                maxlength="20"
              />
            </view>

            <view class="item" @tap="openModal('speciesModal')">
              <view class="left">
                <view class="icon"></view>
                <text class="label">宠物种类</text>
              </view>
              <view class="right">
                <text class="value-text">{{ formData.type || "请选择" }}</text>
                <text class="arrow">›</text>
              </view>
            </view>

            <view class="item" @tap="openModal('breedModal')">
              <view class="left">
                <view class="icon"></view>
                <text class="label">品种</text>
              </view>
              <view class="right">
                <text class="value-text">{{ formData.breed || "请选择" }}</text>
                <text class="arrow">›</text>
              </view>
            </view>

            <view class="item" @tap="openModal('genderModal')">
              <view class="left">
                <view class="icon"></view>
                <text class="label">性别</text>
              </view>
              <view class="right">
                <text class="value-text">{{ displayGender }}</text>
                <text class="arrow">›</text>
              </view>
            </view>

            <view class="item">
              <view class="left">
                <view class="icon"></view>
                <text class="label">年龄</text>
              </view>
              <input
                class="input-field"
                v-model="formData.age"
                placeholder="请输入"
                maxlength="10"
              />
            </view>
          </view>
        </view>

        <view class="section">
          <text class="section-title">外观特征</text>
          <view class="card">
            <view class="item">
              <view class="left">
                <view class="icon"></view>
                <text class="label">毛色</text>
              </view>
              <input
                class="input-field"
                v-model="formData.color"
                placeholder="请输入"
                maxlength="20"
              />
            </view>

            <view class="item">
              <view class="left">
                <view class="icon"></view>
                <text class="label">体重 (kg)</text>
              </view>
              <input
                class="input-field"
                v-model="formData.weight"
                type="digit"
                placeholder="请输入"
              />
            </view>

            <view class="item" @tap="openModal('sizeModal')">
              <view class="left">
                <view class="icon"></view>
                <text class="label">体型</text>
              </view>
              <view class="right">
                <text class="value-text">{{ formData.size || "请选择" }}</text>
                <text class="arrow">›</text>
              </view>
            </view>
          </view>
        </view>

        <view class="section">
          <text class="section-title">健康状况</text>
          <view class="card">
            <view class="item">
              <view class="left">
                <view class="icon"></view>
                <text class="label">已绝育</text>
              </view>
              <view class="switch" :class="{ active: formData.neutered }" @tap="toggleSwitch('neutered')"></view>
            </view>

            <view class="item">
              <view class="left">
                <view class="icon"></view>
                <text class="label">疫苗接种</text>
              </view>
              <view class="switch" :class="{ active: formData.vaccinated }" @tap="toggleSwitch('vaccinated')"></view>
            </view>

            <view class="item">
              <view class="left">
                <view class="icon"></view>
                <text class="label">有健康证明</text>
              </view>
              <view class="switch" :class="{ active: formData.healthCertificate }" @tap="toggleSwitch('healthCertificate')"></view>
            </view>
          </view>
        </view>

        <view class="section">
          <text class="section-title">性格特点（最多6个）</text>
          <view class="tags">
            <view
              v-for="(tag, index) in personalityTags"
              :key="index"
              class="tag"
              :class="{ active: formData.personality.includes(tag.id) }"
              @tap="togglePersonality(tag.id)"
            >
              {{ tag.label }}
            </view>
          </view>

          <view class="textarea-wrap">
            <textarea
              class="textarea-field"
              v-model="formData.habits"
              placeholder="描述一下宠物的特殊习惯或行为特点..."
              maxlength="200"
            />
            <text class="count">{{ formData.habits.length }}/200</text>
          </view>
        </view>

        <view class="section">
          <text class="section-title">宠物照片</text>
          <view class="photos">
            <view
              v-for="(photo, index) in formData.photos"
              :key="index"
              class="photo-item"
            >
              <image
                class="photo-img"
                :src="photo"
                mode="aspectFill"
                @tap="previewPhoto(index)"
              />
              <view class="delete" @tap.stop="deletePhoto(index)">×</view>
            </view>
            <view
              v-if="formData.photos.length < 9"
              class="add-photo"
              @tap="uploadPhotos"
            >
              <text class="add-icon">+</text>
              <text class="add-text">添加照片</text>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>

    <view class="footer">
      <view v-if="isEdit" class="btn delete-btn" @tap="handleDelete">
        删除宠物
      </view>
      <view class="btn save-btn" @tap="handleSave">
        保存
      </view>
    </view>

    <BottomSheet
      :visible="activeModal === 'speciesModal'"
      title="选择宠物种类"
      @update:visible="activeModal = $event ? 'speciesModal' : null"
    >
      <view class="option-grid">
        <view
          v-for="(item, index) in speciesList"
          :key="index"
          class="option"
          :class="{ active: formData.type === item }"
          @tap="selectOption('type', item)"
        >
          {{ item }}
        </view>
      </view>
    </BottomSheet>

    <BottomSheet
      :visible="activeModal === 'genderModal'"
      title="选择性别"
      @update:visible="activeModal = $event ? 'genderModal' : null"
    >
      <view class="option-grid">
        <view
          v-for="item in genderOptions"
          :key="item.value"
          class="option"
          :class="{ active: formData.gender === item.value }"
          @tap="selectOption('gender', item.value)"
        >
          {{ item.label }}
        </view>
      </view>
    </BottomSheet>

    <BottomSheet
      :visible="activeModal === 'sizeModal'"
      title="选择体型"
      @update:visible="activeModal = $event ? 'sizeModal' : null"
    >
      <view class="option-grid">
        <view
          v-for="(item, index) in sizeList"
          :key="index"
          class="option"
          :class="{ active: formData.size === item }"
          @tap="selectOption('size', item)"
        >
          {{ item }}
        </view>
      </view>
    </BottomSheet>

    <BottomSheet
      :visible="activeModal === 'breedModal'"
      title="选择品种"
      @update:visible="activeModal = $event ? 'breedModal' : null"
    >
      <view class="search-box">
        <input
          class="search-input"
          v-model="breedSearch"
          placeholder="搜索品种..."
          type="text"
        />
      </view>
      <view class="breed-list">
        <view
          v-for="(item, index) in filteredBreedList"
          :key="index"
          class="breed-item"
          :class="{ active: formData.breed === item }"
          @tap="selectBreed(item)"
        >
          {{ item }}
        </view>
      </view>
    </BottomSheet>

    <Loading :visible="loading" />
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import Loading from "@/components/common/Loading.vue";
import TopNavBar from "@/components/common/TopNavBar.vue";
import BottomSheet from "@/components/common/BottomSheet.vue";
import {
  getPetDetail,
  addPet,
  updatePet,
  deletePet,
  type PetFormData,
} from "@/api/pet";

const loading = ref(false);
const isEdit = ref(false);
const petId = ref<number | null>(null);
const activeModal = ref<string | null>(null);
const breedSearch = ref('');

const genderMap: Record<string, string> = {
  male: "公",
  female: "母",
};

const genderOptions = [
  { label: "公", value: "male" },
  { label: "母", value: "female" }
];

const speciesList = ["狗狗", "猫咪", "其他"];
const sizeList = ["小型", "中型", "大型"];

const breedMap: Record<string, string[]> = {
  狗狗: ["金毛", "哈士奇", "泰迪", "柯基", "拉布拉多", "柴犬", "萨摩耶", "边牧", "阿拉斯加", "比熊", "德牧", "博美", "其他"],
  猫咪: ["英短", "美短", "布偶", "缅因猫", "其他"],
  其他: ["兔子", "仓鼠", "龙猫", "其他"],
};

const personalityTags = [
  { id: "active", label: "活泼" },
  { id: "gentle", label: "温顺" },
  { id: "clingy", label: "粘人" },
  { id: "independent", label: "独立" },
  { id: "smart", label: "聪明" },
  { id: "naughty", label: "调皮" },
  { id: "quiet", label: "安静" },
  { id: "friendly", label: "友好" },
];

const displayGender = computed(() => {
  return genderMap[formData.value.gender] || formData.value.gender || "请选择";
});

const filteredBreedList = computed(() => {
  const list = formData.value.type && breedMap[formData.value.type] 
    ? breedMap[formData.value.type] 
    : [];
  
  if (!breedSearch.value) return list;
  
  return list.filter(item => 
    item.toLowerCase().includes(breedSearch.value.toLowerCase())
  );
});

const getFullAvatarUrl = (avatar: string) => {
  if (!avatar) return "";
  if (avatar.startsWith("http")) return avatar;
  return `${import.meta.env.VITE_API_BASE_URL || "https://api.example.com"}${avatar}`;
};

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

      const neutered = Boolean(
        data.neutered !== undefined && data.neutered !== null
          ? data.neutered
          : (data as any).neutered,
      );

      const healthCertificate = Boolean(
        data.healthCertificate !== undefined && data.healthCertificate !== null
          ? data.healthCertificate
          : (data as any).health_certificate,
      );

      let vaccinated = false;
      if (typeof data.vaccinated === 'boolean') {
        vaccinated = data.vaccinated;
      } else if (typeof data.vaccinated === 'string') {
        vaccinated = data.vaccinated === "已接种";
      } else {
        vaccinated = Boolean(data.vaccinated);
      }

      formData.value = {
        avatar: data.avatar || "",
        name: data.name || "",
        type: data.type || "",
        breed: data.breed || "",
        gender: data.gender || "",
        age: data.age || "",
        color: data.color || "",
        weight:
          data.weight !== undefined && data.weight !== null
            ? String(data.weight)
            : "",
        size: data.size || "",
        neutered,
        vaccinated,
        healthCertificate,
        personality: data.personality ? data.personality.split(",") : [],
        habits: data.habits || "",
        photos: data.photos ? JSON.parse(data.photos) : [],
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
  vaccinated: false,
  healthCertificate: false,
  personality: [] as string[],
  habits: "",
  photos: [] as string[],
});

const openModal = (modalName: string) => {
  uni.vibrateShort({ type: "light" });
  activeModal.value = modalName;
};

const closeModal = () => {
  activeModal.value = null;
  breedSearch.value = "";
};

const toggleSwitch = (field: string) => {
  uni.vibrateShort({ type: "light" });
  (formData.value as any)[field] = !(formData.value as any)[field];
};

const selectOption = (field: string, value: any) => {
  uni.vibrateShort({ type: "light" });
  (formData.value as any)[field] = value;
  
  setTimeout(() => {
    closeModal();
  }, 180);
};

const selectBreed = (breed: string) => {
  uni.vibrateShort({ type: "light" });
  formData.value.breed = breed;
  
  setTimeout(() => {
    closeModal();
  }, 180);
};

const chooseAvatar = () => {
  uni.vibrateShort({ type: "light" });
  uni.chooseImage({
    count: 1,
    sizeType: ["compressed"],
    sourceType: ["album", "camera"],
    success: async (res) => {
      const tempPath = res.tempFilePaths[0];
      try {
        formData.value.avatar = tempPath;
        uni.showToast({
          title: "头像选择成功",
          icon: "success",
        });
      } catch (error) {
        uni.showToast({
          title: "头像上传失败",
          icon: "none",
        });
      }
    },
  });
};

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

const previewPhoto = (index: number) => {
  uni.vibrateShort({ type: "light" });
  uni.previewImage({
    urls: formData.value.photos,
    current: index,
  });
};

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

const togglePersonality = (tagId: string) => {
  uni.vibrateShort({ type: "light" });
  const index = formData.value.personality.indexOf(tagId);
  if (index > -1) {
    formData.value.personality.splice(index, 1);
  } else {
    if (formData.value.personality.length < 6) {
      formData.value.personality.push(tagId);
    } else {
      uni.showToast({
        title: "最多只能选择6个性格标签",
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

  const data: PetFormData = {
    name: formData.value.name,
    type: formData.value.type || undefined,
    breed: formData.value.breed || undefined,
    age: formData.value.age || undefined,
    gender: formData.value.gender || undefined,
    color: formData.value.color || undefined,
    weight: formData.value.weight || undefined,
    size: formData.value.size || undefined,
    neutered: formData.value.neutered,
    vaccinated: formData.value.vaccinated ? "已接种" : "未接种",
    healthCertificate: formData.value.healthCertificate,
    personality:
      formData.value.personality.length > 0
        ? formData.value.personality.join(",")
        : undefined,
    habits: formData.value.habits || undefined,
    avatar: formData.value.avatar || undefined,
    photos:
      formData.value.photos.length > 0
        ? JSON.stringify(formData.value.photos)
        : undefined,
  };

  if (isEdit.value && petId.value) {
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
              uni.$emit("refreshPetList");
            },
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
              uni.$emit("refreshPetList");
            },
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

const handleDelete = () => {
  uni.vibrateShort({ type: "medium" });
  uni.showModal({
    title: "提示",
    content: "确定要删除这个宠物信息吗？此操作不可恢复",
    confirmColor: "#ff7d8f",
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
              uni.navigateBack({
                success: () => {
                  uni.$emit("refreshPetList");
                },
              });
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

.page-container {
  min-height: 100vh;
  background: rgb(255, 247, 241);
  color: #4b3d3f;
}

.form-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.form-scroll {
  flex: 1;
  height: 0;
  box-sizing: border-box;
  padding: 32rpx 32rpx calc(280rpx + env(safe-area-inset-bottom));
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12rpx 20rpx 60rpx;
}

.avatar-wrapper {
  position: relative;
  width: 236rpx;
  height: 236rpx;
}

.avatar,
.avatar-placeholder {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 10rpx solid rgba(255, 255, 255, 0.9);
  box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.06);
}

.avatar-placeholder {
  background: linear-gradient(135deg, #ffe6eb 0%, #fff0dc 100%);
}

.upload-btn {
  position: absolute;
  right: 4rpx;
  bottom: 4rpx;
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #ffb6c8, #ffcfaa);
  border: 6rpx solid white;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 40rpx;
  font-weight: 300;
}

.upload-icon {
  line-height: 1;
}

.avatar-tip {
  margin-top: 28rpx;
  font-size: 26rpx;
  color: #9b8a8c;
}

.section {
  padding: 0 32rpx;
  margin-bottom: 56rpx;
}

.section-title {
  font-size: 30rpx;
  font-weight: 700;
  color: #755d61;
  margin-bottom: 28rpx;
  padding-left: 8rpx;
}

.card {
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(10px);
  border-radius: 48rpx;
  overflow: hidden;
  box-shadow: 0 20rpx 60rpx rgba(157, 125, 132, 0.05),
              inset 0 2rpx 0 rgba(255, 255, 255, 0.7);
}

.item {
  min-height: 144rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 36rpx;
  border-bottom: 2rpx solid rgba(230, 220, 220, 0.6);
  transition: 0.2s;
}

.item:last-child {
  border-bottom: none;
}

.item:active {
  background: rgba(255, 245, 246, 0.8);
}

.left {
  display: flex;
  align-items: center;
  gap: 28rpx;
  flex: 1;
}

.icon {
  width: 56rpx;
  height: 56rpx;
  border-radius: 20rpx;
  background: linear-gradient(135deg, #ffd6e0, #ffe7c7);
  flex-shrink: 0;
}

.label {
  font-size: 32rpx;
  font-weight: 600;
  color: #4e4144;
}

.right {
  display: flex;
  align-items: center;
  gap: 20rpx;
  color: #8d7d7f;
  font-size: 30rpx;
}

.input-field {
  border: none;
  background: transparent;
  text-align: right;
  font-size: 30rpx;
  color: #4e4144;
  outline: none;
  flex: 1;
}

.value-text {
  font-size: 30rpx;
  color: #8d7d7f;
}

.arrow {
  font-size: 52rpx;
  color: #b7a9ab;
  line-height: 1;
}

.switch {
  width: 104rpx;
  height: 64rpx;
  background: #e6dede;
  border-radius: 60rpx;
  position: relative;
  transition: 0.25s;
}

.switch::after {
  content: "";
  position: absolute;
  width: 52rpx;
  height: 52rpx;
  border-radius: 50%;
  background: white;
  top: 6rpx;
  left: 6rpx;
  transition: 0.25s;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.12);
}

.switch.active {
  background: linear-gradient(135deg, #ffb7cb, #ffd39d);
}

.switch.active::after {
  left: 46rpx;
}

.tags {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24rpx;
  margin-top: 12rpx;
}

.tag {
  height: 128rpx;
  border-radius: 36rpx;
  background: rgba(255, 255, 255, 0.72);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30rpx;
  font-weight: 600;
  color: #645456;
  transition: 0.2s;
  box-shadow: 0 12rpx 36rpx rgba(0, 0, 0, 0.04);
}

.tag:active {
  transform: scale(0.96);
}

.tag.active {
  background: linear-gradient(135deg, #ffb7cb, #ffd39d);
  color: white;
  transform: translateY(-4rpx);
  box-shadow: 0 20rpx 40rpx rgba(255, 184, 197, 0.3);
}

.textarea-wrap {
  margin-top: 32rpx;
  background: rgba(255, 255, 255, 0.72);
  border-radius: 48rpx;
  padding: 36rpx;
}

.textarea-field {
  width: 100%;
  min-height: 260rpx;
  border: none;
  background: transparent;
  resize: none;
  outline: none;
  font-size: 30rpx;
  line-height: 1.7;
  color: #4e4144;
}

.count {
  text-align: right;
  font-size: 24rpx;
  color: #af9ea0;
  margin-top: 16rpx;
}

.photos {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24rpx;
}

.photo-item {
  aspect-ratio: 1;
  border-radius: 40rpx;
  overflow: hidden;
  background: white;
  position: relative;
}

.photo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.delete {
  position: absolute;
  right: 16rpx;
  top: 16rpx;
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 56rpx;
  color: #ff6f88;
  line-height: 1;
}

.add-photo {
  aspect-ratio: 1;
  border-radius: 40rpx;
  border: 3rpx dashed #f1c2cb;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
  color: #b39298;
  background: rgba(255, 255, 255, 0.45);
}

.add-photo:active {
  transform: scale(0.97);
  transition: 0.2s;
}

.add-icon {
  font-size: 60rpx;
  font-weight: 300;
}

.add-text {
  font-size: 24rpx;
}

.footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 32rpx;
  background: linear-gradient(to top, #f6efef 60%, transparent);
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.btn {
  height: 112rpx;
  border-radius: 36rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 34rpx;
  font-weight: 700;
}

.delete-btn {
  background: white;
  border: 2rpx solid #ffd0d7;
  color: #ff7d8f;
}

.save-btn {
  background: linear-gradient(135deg, #f6a9c0, #f7c39d);
  color: white;
  box-shadow: 0 24rpx 50rpx rgba(245, 175, 185, 0.3);
}

.search-box {
  height: 96rpx;
  background: #f7f4f4;
  border-radius: 32rpx;
  padding: 0 32rpx;
  display: flex;
  align-items: center;
  margin-bottom: 36rpx;
}

.search-input {
  text-align: left;
  width: 100%;
  font-size: 28rpx;
}

.breed-list {
  display: flex;
  flex-wrap: wrap;
  gap: 24rpx;
}

.breed-item {
  padding: 24rpx 36rpx;
  border-radius: 32rpx;
  background: #f8f4f4;
  font-size: 28rpx;
  color: #68595b;
  transition: 0.2s;
}

.breed-item.active {
  background: linear-gradient(135deg, #ffb7cb, #ffd39d);
  color: white;
}

.header-safe {
  height: env(safe-area-inset-top);
}

.option-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24rpx;
}

.option {
  height: 104rpx;
  border-radius: 32rpx;
  background: #f8f4f4;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30rpx;
  font-weight: 600;
  color: #6c5d5f;
  transition: 0.2s;
}

.option.active {
  background: linear-gradient(135deg, #ffb7cb, #ffd39d);
  color: white;
}
</style>
