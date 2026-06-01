<template>
  <PageLayout :footer-height="layoutFooterHeight">
    <template #navbar>
      <TopNavBar :title="isEdit ? '编辑宠物' : '添加宠物'" :showBack="true" />
    </template>

    <view class="page-inner add-pet-inner">
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
            <view class="item item-field" :class="{ 'has-error': errors.name }">
              <view class="left">
                <view class="icon"></view>
                <text class="label">宠物名字</text>
              </view>
              <view class="right-input">
                <input
                  class="input-field"
                  :class="{ 'input-error': errors.name }"
                  :value="formData.name"
                  @input="(e: any) => handleInput('name', e.detail.value)"
                  @blur="handleBlur('name')"
                  placeholder="请输入"
                  maxlength="20"
                />
                <text v-if="errors.name" class="error-text">{{ errors.name }}</text>
              </view>
            </view>

            <view class="item item-picker" :class="{ 'has-error': errors.type }" @tap="openModal('speciesModal')">
              <view class="left">
                <view class="icon"></view>
                <text class="label">宠物种类</text>
              </view>
              <view class="right-col">
                <view class="right">
                  <text class="value-text" :class="{ 'is-placeholder': !formData.type }">{{ formData.type || "请选择" }}</text>
                  <text class="arrow">›</text>
                </view>
                <text v-if="errors.type" class="error-text">{{ errors.type }}</text>
              </view>
            </view>

            <view class="item item-picker" :class="{ 'has-error': errors.breed }" @tap="openBreedModal">
              <view class="left">
                <view class="icon"></view>
                <text class="label">品种</text>
              </view>
              <view class="right-col">
                <view class="right">
                  <text class="value-text" :class="{ 'is-placeholder': !formData.breed }">{{ displayBreed }}</text>
                  <text class="arrow">›</text>
                </view>
                <text v-if="errors.breed" class="error-text">{{ errors.breed }}</text>
              </view>
            </view>

            <view class="item item-picker" :class="{ 'has-error': errors.gender }" @tap="openModal('genderModal')">
              <view class="left">
                <view class="icon"></view>
                <text class="label">性别</text>
              </view>
              <view class="right-col">
                <view class="right">
                  <text class="value-text" :class="{ 'is-placeholder': !formData.gender }">{{ displayGender }}</text>
                  <text class="arrow">›</text>
                </view>
                <text v-if="errors.gender" class="error-text">{{ errors.gender }}</text>
              </view>
            </view>

            <view class="item item-field" :class="{ 'has-error': errors.age }">
              <view class="left">
                <view class="icon"></view>
                <text class="label">年龄</text>
              </view>
              <view class="right-input">
                <input
                  id="age-input"
                  :key="ageInputKey"
                  class="input-field"
                  :class="{ 'input-error': errors.age }"
                  :value="formData.age"
                  @input="(e: any) => applyNumericInput('age', e.detail.value)"
                  @compositionend="(e: any) => applyNumericInput('age', e.detail.value)"
                  @blur="handleNumericBlur('age')"
                  type="digit"
                  placeholder="请输入月龄"
                  maxlength="3"
                />
                <text v-if="errors.age" class="error-text">{{ errors.age }}</text>
              </view>
            </view>
          </view>
        </view>

        <view class="section">
          <text class="section-title">外观特征</text>
          <view class="card">
            <view class="item item-field" :class="{ 'has-error': errors.color }">
              <view class="left">
                <view class="icon"></view>
                <text class="label">毛色</text>
              </view>
              <view class="right-input">
                <input
                  class="input-field"
                  :class="{ 'input-error': errors.color }"
                  :value="formData.color"
                  @input="(e: any) => handleInput('color', e.detail.value)"
                  @blur="handleBlur('color')"
                  placeholder="请输入"
                  maxlength="30"
                />
                <text v-if="errors.color" class="error-text">{{ errors.color }}</text>
              </view>
            </view>

            <view class="item item-field" :class="{ 'has-error': errors.weight }">
              <view class="left">
                <view class="icon"></view>
                <text class="label">体重 (kg)</text>
              </view>
              <view class="right-input">
                <input
                  id="weight-input"
                  :key="weightInputKey"
                  class="input-field"
                  :class="{ 'input-error': errors.weight }"
                  :value="formData.weight"
                  @input="(e: any) => applyNumericInput('weight', e.detail.value)"
                  @compositionend="(e: any) => applyNumericInput('weight', e.detail.value)"
                  @blur="handleNumericBlur('weight')"
                  type="digit"
                  placeholder="请输入"
                  maxlength="6"
                />
                <text v-if="errors.weight" class="error-text">{{ errors.weight }}</text>
              </view>
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
              :value="formData.habits"
              @input="(e: any) => handleHabitsInput(e.detail.value)"
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

        <!-- 底部留白，避免被固定「删除/保存」栏挡住 -->
        <view class="scroll-bottom-spacer" :style="bottomSpacerStyle" />
    </view>

    <template #fixed>
    <view class="footer" id="add-pet-footer">
      <view v-if="isEdit" class="btn delete-btn" @tap="handleDelete">
        删除宠物
      </view>
      <view class="btn save-btn" @tap="handleSave">
        保存
      </view>
    </view>
    </template>

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
          :class="{ active: isBreedOptionActive(item) }"
          @tap="selectBreed(item)"
        >
          {{ item }}
        </view>
      </view>
      <view v-if="showCustomBreedInput" class="custom-breed-box">
        <input
          class="custom-breed-input"
          :value="customBreedDraft"
          @input="(e: any) => (customBreedDraft = e.detail.value.slice(0, 50))"
          placeholder="请输入品种名称"
          maxlength="50"
        />
        <view class="custom-breed-actions">
          <view class="custom-breed-btn cancel" @tap="cancelCustomBreed">取消</view>
          <view class="custom-breed-btn confirm" @tap="confirmCustomBreed">确认</view>
        </view>
      </view>
    </BottomSheet>

    <Loading :visible="loading" />
  </PageLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import Loading from "@/components/common/Loading.vue";
import TopNavBar from "@/components/common/TopNavBar.vue";
import PageLayout from "@/components/common/PageLayout.vue";
import BottomSheet from "@/components/common/BottomSheet.vue";
import {
  getPetDetail,
  addPet,
  updatePet,
  deletePet,
  type PetFormData,
} from "@/api/pet";
import {
  parseJsonArray,
  PET_GENDER_OPTIONS,
  normalizePetGender,
  formatPetGender,
} from "@/utils/format";
import { resolveMediaUrl } from "@/utils/media";
import { showRequestError } from "@/utils/request";
import { ensureUploaded, ensureUploadedList } from "@/utils/uploadMedia";
import { getLayoutMetrics, useFixedFooterHeight } from "@/composables/useLayout";

const layoutMetrics = getLayoutMetrics();
/** 单按钮：padding + btn + padding；双按钮再加 gap + delete */
const footerEstimateRpx = (edit: boolean) =>
  edit ? 32 + 112 + 24 + 112 + 32 : 32 + 112 + 32;

const { footerHeight, measureFooterHeight: measureFooter } = useFixedFooterHeight(
  "#add-pet-footer",
  footerEstimateRpx(false),
);

const syncFooterEstimate = () => {
  footerHeight.value =
    uni.upx2px(footerEstimateRpx(isEdit.value)) + layoutMetrics.safeBottom;
};

/** 滚动区高度扣减（取测量值与估算值较大者，并加缓冲） */
const layoutFooterHeight = computed(() => {
  const estimated =
    uni.upx2px(footerEstimateRpx(isEdit.value)) + layoutMetrics.safeBottom;
  return Math.max(footerHeight.value, estimated) + uni.upx2px(32);
});

/** 内容底部占位，滚到底时「宠物照片」在按钮上方完整可见 */
const bottomSpacerStyle = computed(() => ({
  height: `${layoutFooterHeight.value}px`,
}));

const loading = ref(false);
const isEdit = ref(false);
const petId = ref<number | null>(null);
const activeModal = ref<string | null>(null);
const breedSearch = ref("");
const showCustomBreedInput = ref(false);
const customBreedDraft = ref("");

const TYPE_TO_UI: Record<string, string> = {
  dog: "狗狗",
  cat: "猫咪",
  other: "其他",
  hamster: "其他",
  bird: "其他",
};

const UI_TO_TYPE: Record<string, string> = {
  狗狗: "dog",
  猫咪: "cat",
  其他: "other",
};

const SIZE_TO_UI: Record<string, string> = {
  small: "小型",
  medium: "中型",
  large: "大型",
};

const UI_TO_SIZE: Record<string, string> = {
  小型: "small",
  中型: "medium",
  大型: "large",
};

const genderOptions = PET_GENDER_OPTIONS;

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
  if (!formData.value.gender) return "请选择";
  return formatPetGender(formData.value.gender) || "请选择";
});

const displayBreed = computed(() => {
  return formData.value.breed || "请选择";
});

const getPresetBreeds = (type = formData.value.type) => {
  if (!type || !breedMap[type]) return [];
  return breedMap[type];
};

const isCustomBreedValue = (breed: string, type = formData.value.type) => {
  if (!breed) return false;
  const presets = getPresetBreeds(type).filter((item) => item !== "其他");
  return !presets.includes(breed);
};

const isBreedOptionActive = (item: string) => {
  if (item === "其他") {
    return isCustomBreedValue(formData.value.breed) || showCustomBreedInput.value;
  }
  return formData.value.breed === item;
};

const mapTypeToUi = (type?: string) => {
  if (!type) return "";
  if (speciesList.includes(type)) return type;
  return TYPE_TO_UI[type] || "其他";
};

const mapTypeToDb = (type?: string) => {
  if (!type) return "";
  return UI_TO_TYPE[type] || type;
};

const mapSizeToUi = (size?: string) => {
  if (!size) return "";
  if (sizeList.includes(size)) return size;
  return SIZE_TO_UI[size] || "";
};

const mapSizeToDb = (size?: string) => {
  if (!size) return "";
  return UI_TO_SIZE[size] || size;
};

const parsePersonality = (value?: string) => {
  if (!value) return [];
  const result: string[] = [];
  for (const part of value.split(",")) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    const byId = personalityTags.find((tag) => tag.id === trimmed);
    if (byId) {
      if (!result.includes(byId.id)) result.push(byId.id);
      continue;
    }
    const byLabel = personalityTags.find((tag) => tag.label === trimmed);
    if (byLabel) {
      if (!result.includes(byLabel.id)) result.push(byLabel.id);
      continue;
    }
    for (const tag of personalityTags) {
      if (trimmed.includes(tag.label) && !result.includes(tag.id)) {
        result.push(tag.id);
      }
    }
  }
  return result;
};

const normalizePhotos = (photos: unknown) => {
  return parseJsonArray<string>(photos).map((url) => resolveMediaUrl(url));
};

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

watch(isEdit, () => {
  syncFooterEstimate();
  measureFooter();
});

onLoad((options) => {
  if (options?.id) {
    petId.value = parseInt(String(options.id), 10);
    isEdit.value = true;
    syncFooterEstimate();
    loadPetData();
  }
});

onMounted(() => {
  syncFooterEstimate();
  measureFooter();
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
        avatar: data.avatar ? resolveMediaUrl(data.avatar) : "",
        name: data.name || "",
        type: mapTypeToUi(data.type),
        breed: data.breed || "",
        gender: normalizePetGender(data.gender) || "",
        age:
          data.age !== undefined && data.age !== null ? String(data.age) : "",
        color: data.color || "",
        weight:
          data.weight !== undefined && data.weight !== null
            ? String(data.weight)
            : "",
        size: mapSizeToUi(data.size),
        neutered,
        vaccinated,
        healthCertificate,
        personality: parsePersonality(data.personality),
        habits: data.habits || "",
        photos: normalizePhotos(data.photos),
      };
      ageInputRaw.value = formData.value.age;
      weightInputRaw.value = formData.value.weight;
    }
  } catch (error) {
    showRequestError(error, "获取宠物详情失败");
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

const errors = ref<Record<string, string>>({});
const ageInputKey = ref(0);
const weightInputKey = ref(0);
const ageInputRaw = ref("");
const weightInputRaw = ref("");

type FieldRule = {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  message: string;
  isNumber?: boolean;
  integer?: boolean;
};

const fieldRules: Record<string, FieldRule> = {
  name: {
    required: true,
    minLength: 1,
    maxLength: 20,
    message: "请输入宠物名字",
  },
  type: {
    required: true,
    message: "请选择宠物种类",
  },
  breed: {
    required: true,
    message: "请选择或填写品种",
  },
  gender: {
    required: true,
    message: "请选择性别",
  },
  color: {
    maxLength: 30,
    message: "毛色长度不能超过30个字符",
  },
};

const getAgeError = (value: string, required = false): string | null => {
  const trimmed = (value ?? "").trim();
  if (!trimmed) {
    return required ? "请输入年龄" : null;
  }
  if (!/^\d+$/.test(trimmed)) return "年龄只能输入数字";
  const num = parseInt(trimmed, 10);
  if (num < 1) return "年龄至少为1个月";
  if (num > 360) return "年龄不能超过360个月";
  return null;
};

const getWeightError = (value: string): string | null => {
  const trimmed = (value ?? "").trim();
  if (!trimmed) return null;
  if (!/^\d+(\.\d+)?$/.test(trimmed) || trimmed.endsWith(".")) {
    return "体重格式不正确，请输入有效数字";
  }
  const num = parseFloat(trimmed);
  if (Number.isNaN(num)) return "体重格式不正确，请输入有效数字";
  if (num < 0.01) return "体重至少为0.01kg";
  if (num > 999.99) return "体重不能超过999.99kg";
  return null;
};

const getFieldError = (field: string, value: string): string | null => {
  if (field === "age") return getAgeError(value, true);
  if (field === "weight") return getWeightError(value);

  const rule = fieldRules[field];
  if (!rule) return null;

  const trimmed = (value ?? "").trim();

  if (!trimmed) {
    if (rule.required) {
      return rule.message;
    }
    return null;
  }

  if (
    rule.minLength !== undefined &&
    (trimmed.length < rule.minLength || trimmed.length > (rule.maxLength ?? Infinity))
  ) {
    return rule.message;
  }

  if (rule.maxLength !== undefined && trimmed.length > rule.maxLength) {
    return rule.message;
  }

  return null;
};

const setFieldError = (field: string, message: string | null) => {
  if (message) {
    errors.value[field] = message;
    return false;
  }
  delete errors.value[field];
  return true;
};

const validateField = (field: string, value: string): boolean => {
  return setFieldError(field, getFieldError(field, value));
};

const syncNumericInputsFromDom = (): Promise<void> => {
  return new Promise((resolve) => {
    if (!instance) {
      resolve();
      return;
    }

    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      resolve();
    };

    let pending = 2;
    const done = () => {
      pending -= 1;
      if (pending <= 0) finish();
    };

    setTimeout(finish, 300);

    uni
      .createSelectorQuery()
      .in(instance)
      .select("#age-input")
      .fields({ properties: ["value"] }, (res) => {
        const val = (res as { value?: string } | null)?.value;
        if (val !== undefined && val !== null) {
          ageInputRaw.value = String(val);
        }
        done();
      })
      .select("#weight-input")
      .fields({ properties: ["value"] }, (res) => {
        const val = (res as { value?: string } | null)?.value;
        if (val !== undefined && val !== null) {
          weightInputRaw.value = String(val);
        }
        done();
      })
      .exec();
  });
};

const validateNumericFieldOnSave = (field: "age" | "weight", raw: string): boolean => {
  const trimmed = (raw ?? "").trim();
  const sanitized = sanitizeInput(field, trimmed);
  (formData.value as Record<string, string>)[field] = sanitized;

  if (!trimmed) {
    if (field === "age") {
      ageInputRaw.value = "";
      return setFieldError(field, "请输入年龄");
    }
    if (field === "weight") {
      weightInputRaw.value = "";
      return setFieldError(field, null);
    }
    return setFieldError(field, null);
  }

  if (field === "age") {
    if (!/^\d+$/.test(trimmed)) {
      ageInputKey.value += 1;
      ageInputRaw.value = sanitized;
      return setFieldError(field, "年龄只能输入数字");
    }
    ageInputRaw.value = sanitized;
    return setFieldError(field, getAgeError(sanitized, true));
  }

  if (!/^\d+(\.\d+)?$/.test(trimmed) || trimmed.endsWith(".")) {
    weightInputKey.value += 1;
    weightInputRaw.value = sanitized;
    return setFieldError(field, "体重格式不正确，请输入有效数字");
  }

  weightInputRaw.value = sanitized;
  return setFieldError(field, getWeightError(sanitized));
};

const validateForm = async (): Promise<boolean> => {
  await syncNumericInputsFromDom();

  let valid = true;

  if (!validateField("name", formData.value.name.trim())) {
    valid = false;
  }

  if (!validateField("type", formData.value.type)) {
    valid = false;
  }

  if (!validateField("breed", formData.value.breed)) {
    valid = false;
  }

  if (!validateField("gender", formData.value.gender)) {
    valid = false;
  }

  if (!validateNumericFieldOnSave("age", ageInputRaw.value || formData.value.age)) {
    valid = false;
  }

  if (
    !validateNumericFieldOnSave("weight", weightInputRaw.value || formData.value.weight)
  ) {
    valid = false;
  }

  if (!validateField("color", formData.value.color)) {
    valid = false;
  }

  return valid;
};

const sanitizeInput = (field: string, value: string): string => {
  if (field === "age") {
    return String(value ?? "")
      .replace(/[^\d]/g, "")
      .slice(0, 3);
  }

  if (field === "weight") {
    let cleaned = String(value ?? "").replace(/[^\d.]/g, "");
    const dotIndex = cleaned.indexOf(".");
    if (dotIndex !== -1) {
      cleaned =
        cleaned.slice(0, dotIndex + 1) +
        cleaned.slice(dotIndex + 1).replace(/\./g, "");
    }
    const parts = cleaned.split(".");
    if (parts.length === 2) {
      cleaned = `${parts[0]}.${parts[1].slice(0, 2)}`;
    }
    if (cleaned && Number(cleaned) > 999.99) {
      cleaned = "999.99";
    }
    return cleaned.slice(0, 6);
  }

  if (field === "name") {
    return value.slice(0, 20);
  }

  if (field === "color") {
    return value.slice(0, 30);
  }

  return value;
};

const handleInput = (field: string, value: string) => {
  const sanitized = sanitizeInput(field, value);
  (formData.value as any)[field] = sanitized;
  if (errors.value[field]) {
    validateField(field, sanitized);
  }
};

const applyNumericInput = (field: "age" | "weight", value: string) => {
  if (field === "age") {
    ageInputRaw.value = value;
  } else {
    weightInputRaw.value = value;
  }

  const sanitized = sanitizeInput(field, value);
  (formData.value as any)[field] = sanitized;
  if (sanitized !== value) {
    nextTick(() => {
      if (field === "age") ageInputKey.value += 1;
      else weightInputKey.value += 1;
    });
  }
  if (errors.value[field]) {
    validateField(field, sanitized);
  }
};

const handleNumericBlur = (field: "age" | "weight") => {
  const raw = field === "age" ? ageInputRaw.value : weightInputRaw.value;
  applyNumericInput(field, raw ?? "");
  validateNumericFieldOnSave(field, raw ?? "");
};

const handleHabitsInput = (value: string) => {
  formData.value.habits = value.slice(0, 200);
};

const handleBlur = (field: string) => {
  validateField(field, (formData.value as any)[field] ?? "");
};

const openModal = (modalName: string) => {
  uni.vibrateShort({ type: "light" });
  activeModal.value = modalName;
};

const openBreedModal = () => {
  if (!formData.value.type) {
    uni.showToast({
      title: "请先选择宠物种类",
      icon: "none",
    });
    return;
  }

  if (isCustomBreedValue(formData.value.breed)) {
    showCustomBreedInput.value = true;
    customBreedDraft.value = formData.value.breed;
  } else {
    showCustomBreedInput.value = false;
    customBreedDraft.value = "";
  }

  openModal("breedModal");
};

const closeModal = () => {
  activeModal.value = null;
  breedSearch.value = "";
  showCustomBreedInput.value = false;
  customBreedDraft.value = "";
};

const toggleSwitch = (field: string) => {
  uni.vibrateShort({ type: "light" });
  (formData.value as any)[field] = !(formData.value as any)[field];
};

const selectOption = (field: string, value: any) => {
  uni.vibrateShort({ type: "light" });

  if (field === "type" && value !== formData.value.type) {
    formData.value.breed = "";
    showCustomBreedInput.value = false;
    customBreedDraft.value = "";
  }

  (formData.value as any)[field] = value;

  if (["type", "gender", "breed", "name"].includes(field)) {
    validateField(field, String(value ?? ""));
  }

  setTimeout(() => {
    closeModal();
  }, 180);
};

const selectBreed = (breed: string) => {
  uni.vibrateShort({ type: "light" });

  if (breed === "其他") {
    showCustomBreedInput.value = true;
    customBreedDraft.value = isCustomBreedValue(formData.value.breed)
      ? formData.value.breed
      : "";
    return;
  }

  showCustomBreedInput.value = false;
  customBreedDraft.value = "";
  formData.value.breed = breed;

  setTimeout(() => {
    closeModal();
    validateField("breed", breed);
  }, 180);
};

const cancelCustomBreed = () => {
  showCustomBreedInput.value = false;
  customBreedDraft.value = "";
};

const confirmCustomBreed = () => {
  const value = customBreedDraft.value.trim();
  if (!value) {
    uni.showToast({
      title: "请输入品种名称",
      icon: "none",
    });
    return;
  }

  formData.value.breed = value.slice(0, 50);
  showCustomBreedInput.value = false;
  customBreedDraft.value = "";
  validateField("breed", formData.value.breed);
  closeModal();
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

const handleSave = async () => {
  if (!(await validateForm())) {
    return;
  }

  uni.vibrateShort({ type: "medium" });
  loading.value = true;

  try {
    const [avatarUrl, photoUrls] = await Promise.all([
      formData.value.avatar ? ensureUploaded(formData.value.avatar) : Promise.resolve(""),
      ensureUploadedList(formData.value.photos),
    ]);

    const data: PetFormData = {
      name: formData.value.name,
      type: mapTypeToDb(formData.value.type) || undefined,
      breed: formData.value.breed || undefined,
      age: formData.value.age ? Number(formData.value.age) : undefined,
      gender: formData.value.gender || undefined,
      color: formData.value.color || undefined,
      weight: formData.value.weight ? Number(formData.value.weight) : undefined,
      size: mapSizeToDb(formData.value.size) || undefined,
      neutered: formData.value.neutered,
      vaccinated: formData.value.vaccinated ? "已接种" : "未接种",
      healthCertificate: formData.value.healthCertificate,
      personality:
        formData.value.personality.length > 0
          ? formData.value.personality.join(",")
          : undefined,
      habits: formData.value.habits || undefined,
      avatar: avatarUrl || undefined,
      photos: photoUrls,
    };

    if (isEdit.value && petId.value) {
      await updatePet(petId.value, data);
      uni.showToast({ title: "更新成功", icon: "success" });
      uni.$emit("refreshPetList");
      setTimeout(() => uni.navigateBack({ delta: 1 }), 1500);
    } else {
      await addPet(data);
      uni.showToast({ title: "添加成功", icon: "success" });
      uni.$emit("refreshPetList");
      setTimeout(() => uni.navigateBack({ delta: 1 }), 1500);
    }
  } catch (error) {
    showRequestError(error, isEdit.value ? "更新失败" : "添加失败");
  } finally {
    loading.value = false;
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
            uni.$emit("refreshPetList");
            setTimeout(() => {
              uni.navigateBack();
            }, 1500);
          })
          .catch((error) => {
            showRequestError(error, "删除失败");
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
@import "@/styles/layout.scss";

.add-pet-inner {
  background: rgb(255, 247, 241);
  color: #4b3d3f;
  box-sizing: border-box;
  min-height: 100%;
}

.scroll-bottom-spacer {
  flex-shrink: 0;
  width: 100%;
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

.section:last-of-type {
  margin-bottom: 24rpx;
}

.item-field {
  align-items: flex-start;
  padding: 28rpx 36rpx;
  min-height: auto;
}

.item-field .left {
  padding-top: 8rpx;
}

.item-picker {
  align-items: flex-start;
  padding: 28rpx 36rpx;
  min-height: auto;
}

.item-picker .left {
  padding-top: 8rpx;
}

.item-picker.has-error .value-text {
  color: #ff6b6b;
}

.right-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  min-width: 0;
}

.right-col .error-text {
  align-self: stretch;
  text-align: right;
}

.value-text.is-placeholder {
  color: #b7a9ab;
}

.item-field.has-error .input-field {
  color: #ff6b6b;
}

.input-field.input-error {
  color: #ff6b6b;
}

.right-input {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.error-text {
  align-self: stretch;
  text-align: right;
  font-size: 22rpx;
  color: #ff6b6b;
  margin-top: 8rpx;
  line-height: 1.4;
  animation: shake 0.3s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4rpx); }
  75% { transform: translateX(4rpx); }
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
  z-index: 20;
  padding: 32rpx;
  padding-bottom: calc(32rpx + env(safe-area-inset-bottom));
  background: linear-gradient(to top, #fff7f1 72%, rgba(255, 247, 241, 0.92));
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  box-sizing: border-box;
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

.custom-breed-box {
  margin-top: 32rpx;
  padding-top: 32rpx;
  border-top: 1rpx solid rgba(0, 0, 0, 0.06);
}

.custom-breed-input {
  width: 100%;
  height: 96rpx;
  background: #f7f4f4;
  border-radius: 32rpx;
  padding: 0 32rpx;
  font-size: 28rpx;
  box-sizing: border-box;
}

.custom-breed-actions {
  display: flex;
  gap: 24rpx;
  margin-top: 24rpx;
}

.custom-breed-btn {
  flex: 1;
  height: 88rpx;
  border-radius: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30rpx;
  font-weight: 600;
}

.custom-breed-btn.cancel {
  background: #f7f4f4;
  color: #68595b;
}

.custom-breed-btn.confirm {
  background: linear-gradient(135deg, #f6a9c0, #f7c39d);
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
