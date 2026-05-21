# 从 uni.showActionSheet 迁移到新组件

## 📝 问题背景

当前项目大量使用了 `uni.showActionSheet` 和 `uni.showDatePicker` 等 API，这些 API 的样式难以定制，且在不同平台表现不一致。

## ✅ 迁移方案

### 1. uni.showActionSheet → ActionSheet 组件

**Before (使用 uni API):**
```typescript
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
```

**After (使用新组件):**
```vue
<template>
  <view class="page">
    <button @click="showSpeciesPicker">选择宠物种类</button>

    <!-- ActionSheet 组件 -->
    <ActionSheet
      v-model:visible="speciesPickerVisible"
      title="选择宠物种类"
      :actions="speciesActions"
      @select="onSpeciesSelect"
    />
  </view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ActionSheet } from '@/components/interactive'

const speciesPickerVisible = ref(false)

const speciesActions = reactive([
  { name: '狗狗', type: 'default' },
  { name: '猫咪', type: 'default' },
  { name: '其他', type: 'default' },
])

const showSpeciesPicker = () => {
  speciesPickerVisible.value = true
}

const onSpeciesSelect = (item, index) => {
  formData.value.species = item.name
  console.log('选择了:', item.name, '索引:', index)
}
</script>
```

### 2. uni.showDatePicker → DatePicker 组件

**Before (使用 uni API):**
```typescript
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
    },
  });
};
```

**After (使用新组件):**
```vue
<template>
  <view class="page">
    <button @click="showDatePicker">选择日期</button>

    <!-- DatePicker 组件 -->
    <DatePicker
      v-model:visible="datePickerVisible"
      title="选择宠物生日"
      :value="formData.birthday"
      start-date="2010-01-01"
      end-date="2025-12-31"
      @confirm="onDateConfirm"
    />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { DatePicker } from '@/components/interactive'

const datePickerVisible = ref(false)

const showDatePicker = () => {
  datePickerVisible.value = true
}

const onDateConfirm = (date) => {
  formData.value.birthday = date
  console.log('选择了日期:', date)
}
</script>
```

### 3. uni.showToast → useToast

**Before:**
```typescript
uni.showToast({
  title: "操作成功",
  icon: "success",
  duration: 2000,
});
```

**After:**
```typescript
import { useToast } from '@/composables/useComponents'

const toast = useToast()

toast.success('操作成功')
// 或
toast.success({
  title: '操作成功',
  duration: 3000,
})
```

### 4. uni.showModal → useDialog

**Before:**
```typescript
uni.showModal({
  title: "确认删除",
  content: "确定要删除吗？",
  confirmText: "删除",
  confirmColor: "#FF6B8A",
  success: (res) => {
    if (res.confirm) {
      // 删除操作
    }
  },
});
```

**After:**
```typescript
import { useDialog } from '@/composables/useComponents'

const dialog = useDialog()

dialog.confirm({
  title: '确认删除',
  content: '确定要删除吗？',
  confirmText: '删除',
  confirmColor: '#FF6B8A',
  success: () => {
    // 删除操作
  },
})
```

## 📦 addPet.vue 迁移示例

让我展示如何更新 addPet.vue 页面：

```vue
<template>
  <view class="page-container">
    <view class="header-safe"></view>
    <TopNavBar :title="isEdit ? '编辑宠物' : '添加宠物'" :showBack="true" />

    <scroll-view class="page-content" scroll-y>
      <!-- 宠物种类选择 -->
      <view class="form-item" @tap="showSpeciesPicker">
        <text>宠物种类</text>
        <text>{{ formData.species || '请选择' }}</text>
      </view>

      <!-- 其他表单项... -->
    </scroll-view>

    <!-- 种类选择器 -->
    <ActionSheet
      v-model:visible="speciesPickerVisible"
      title="选择宠物种类"
      :actions="speciesActions"
      @select="onSpeciesSelect"
    />

    <!-- 性别选择器 -->
    <ActionSheet
      v-model:visible="genderPickerVisible"
      title="选择性别"
      :actions="genderActions"
      @select="onGenderSelect"
    />

    <!-- 生日选择器 -->
    <DatePicker
      v-model:visible="birthdayPickerVisible"
      title="选择宠物生日"
      :value="formData.birthday"
      start-date="2010-01-01"
      end-date="2025-12-31"
      @confirm="onBirthdayConfirm"
    />

    <Loading :visible="loading" />
  </view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ActionSheet, DatePicker } from '@/components/interactive'
import { useToast } from '@/composables/useComponents'
import TopNavBar from '@/components/common/TopNavBar.vue'
import Loading from '@/components/common/Loading.vue'

const toast = useToast()
const loading = ref(false)

// 表单数据
const formData = reactive({
  species: '',
  gender: '',
  birthday: '',
})

// 种类选择器
const speciesPickerVisible = ref(false)
const speciesActions = reactive([
  { name: '狗狗', type: 'default' },
  { name: '猫咪', type: 'default' },
  { name: '其他', type: 'default' },
])

const showSpeciesPicker = () => {
  speciesPickerVisible.value = true
}

const onSpeciesSelect = (item) => {
  formData.species = item.name
  toast.success(`已选择: ${item.name}`)
}

// 性别选择器
const genderPickerVisible = ref(false)
const genderActions = reactive([
  { name: '公', type: 'default' },
  { name: '母', type: 'default' },
])

const showGenderPicker = () => {
  genderPickerVisible.value = true
}

const onGenderSelect = (item) => {
  formData.gender = item.name
  toast.success(`已选择: ${item.name}`)
}

// 生日选择器
const birthdayPickerVisible = ref(false)

const showBirthdayPicker = () => {
  birthdayPickerVisible.value = true
}

const onBirthdayConfirm = (date) => {
  formData.birthday = date
  toast.success(`已选择: ${date}`)
}
</script>
```

## 🎯 迁移步骤

### 第一步：识别需要迁移的代码

在项目中搜索以下 API：
```bash
grep -r "uni.showActionSheet" src/
grep -r "uni.showDatePicker" src/
grep -r "uni.showToast" src/
grep -r "uni.showModal" src/
```

### 第二步：导入新组件

在需要使用组件的页面中导入：
```typescript
import { ActionSheet, DatePicker } from '@/components/interactive'
import { useToast, useDialog } from '@/composables/useComponents'
```

### 第三步：替换现有代码

按照上面的示例，将 `uni.showActionSheet` 替换为 `ActionSheet` 组件，`uni.showDatePicker` 替换为 `DatePicker` 组件。

### 第四步：测试验证

确保功能正常，样式一致。

## ✅ 优势对比

| 特性 | uni API | 新组件 |
|------|---------|--------|
| 样式定制 | ❌ 受限 | ✅ 完全可控 |
| 动画效果 | ⚠️ 一般 | ✅ 流畅自然 |
| 平台一致性 | ⚠️ 略有差异 | ✅ 完全一致 |
| 类型提示 | ❌ 无 | ✅ TypeScript 支持 |
| 组件复用 | ❌ 无 | ✅ 可复用 |
| 主题适配 | ⚠️ 困难 | ✅ 简单 |

## 📝 注意事项

1. **向后兼容**：新组件会保持与 uni API 相同的基本接口，便于迁移
2. **性能优化**：组件内部做了性能优化，避免不必要的重绘
3. **无障碍支持**：所有组件都支持触觉反馈和屏幕阅读器
4. **响应式适配**：自动适配不同屏幕尺寸

## 🚀 快速开始

```typescript
// 1. 导入 composable
import { useToast, useDialog, usePicker } from '@/composables/useComponents'

// 2. 使用
const toast = useToast()
toast.success('Hello World!')

const dialog = useDialog()
dialog.confirm({
  content: 'Are you sure?',
  success: () => console.log('Confirmed')
})

const picker = usePicker()
picker.show({
  title: 'Select',
  data: [['Option 1', 'Option 2']],
  success: (result) => console.log(result)
})
```

## 📞 遇到问题？

如果迁移过程中遇到任何问题，请参考：
- [组件设计文档](../docs/交互组件系统设计文档.md)
- [组件使用指南](../docs/组件使用指南.md)
- 或者联系开发者支持
