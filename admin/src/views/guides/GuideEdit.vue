<template>
  <div class="page-card">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px" style="max-width: 720px">
      <el-form-item label="标题" prop="title">
        <el-input v-model="form.title" />
      </el-form-item>
      <el-form-item label="宠物类型">
        <el-select v-model="form.pet_type" clearable placeholder="可选">
          <el-option label="狗狗" value="dog" />
          <el-option label="猫咪" value="cat" />
          <el-option label="通用" value="all" />
        </el-select>
      </el-form-item>
      <el-form-item label="分类">
        <el-input v-model="form.category" placeholder="如：饮食、健康、训练" />
      </el-form-item>
      <el-form-item label="封面">
        <ImageUpload v-model="form.cover" />
      </el-form-item>
      <el-form-item label="内容" prop="content">
        <el-input v-model="form.content" type="textarea" :rows="12" />
      </el-form-item>
      <el-form-item label="状态">
        <el-radio-group v-model="form.status">
          <el-radio :value="1">上架</el-radio>
          <el-radio :value="0">下架</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="saving" @click="submit">保存</el-button>
        <el-button @click="$router.back()">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { guideApi } from '@/api'
import ImageUpload from '@/components/ImageUpload.vue'

const route = useRoute()
const router = useRouter()
const isNew = computed(() => route.path.endsWith('/new'))
const id = computed(() => (isNew.value ? 0 : Number(route.params.id)))

const formRef = ref<FormInstance>()
const saving = ref(false)

const form = reactive({
  title: '',
  content: '',
  cover: '',
  pet_type: '',
  category: '',
  status: 1,
})

const rules: FormRules = {
  title: [{ required: true, message: '请输入标题' }],
  content: [{ required: true, message: '请输入内容' }],
}

onMounted(async () => {
  if (!isNew.value && id.value) {
    const data = await guideApi.get(id.value)
    Object.assign(form, {
      title: data.title,
      content: data.content,
      cover: data.cover || '',
      pet_type: data.pet_type || '',
      category: data.category || '',
      status: data.status ?? 1,
    })
  }
})

async function submit() {
  await formRef.value?.validate()
  saving.value = true
  try {
    if (isNew.value) {
      await guideApi.create({ ...form })
      ElMessage.success('创建成功')
    } else {
      await guideApi.update(id.value, { ...form })
      ElMessage.success('保存成功')
    }
    router.push('/guides')
  } finally {
    saving.value = false
  }
}
</script>
