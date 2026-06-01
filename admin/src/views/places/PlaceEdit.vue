<template>
  <div class="page-card">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px" style="max-width: 720px">
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="分类" prop="type">
        <el-select v-model="form.type" placeholder="选择分类" style="width: 100%">
          <el-option v-for="c in categories" :key="c.key" :label="c.label" :value="c.key" />
        </el-select>
      </el-form-item>
      <el-form-item label="地址" prop="address">
        <el-input v-model="form.address" />
      </el-form-item>
      <el-form-item label="纬度" prop="latitude">
        <el-input-number v-model="form.latitude" :precision="6" :step="0.001" style="width: 100%" />
      </el-form-item>
      <el-form-item label="经度" prop="longitude">
        <el-input-number v-model="form.longitude" :precision="6" :step="0.001" style="width: 100%" />
      </el-form-item>
      <el-form-item label="电话">
        <el-input v-model="form.phone" />
      </el-form-item>
      <el-form-item label="营业时间">
        <el-input v-model="form.business_hours" placeholder="如 09:00-21:00" />
      </el-form-item>
      <el-form-item label="宠物政策">
        <el-input v-model="form.pet_policy" type="textarea" :rows="2" />
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="form.description" type="textarea" :rows="4" />
      </el-form-item>
      <el-form-item label="配套设施">
        <el-select v-model="form.amenities" multiple filterable allow-create style="width: 100%">
          <el-option v-for="a in amenityOptions" :key="a" :label="a" :value="a" />
        </el-select>
      </el-form-item>
      <el-form-item label="评分">
        <el-rate v-model="form.rating" allow-half />
      </el-form-item>
      <el-form-item label="图片">
        <ImageListUpload v-model="form.images" />
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
import { placeApi, categoryApi } from '@/api'
import ImageListUpload from '@/components/ImageListUpload.vue'

const route = useRoute()
const router = useRouter()
const isNew = computed(() => route.path.endsWith('/new'))
const id = computed(() => (isNew.value ? 0 : Number(route.params.id)))

const formRef = ref<FormInstance>()
const saving = ref(false)
const categories = ref<{ key: string; label: string }[]>([])
const amenityOptions = ['停车位', '饮水', '宠物零食', '室内活动区', '户外草坪', 'WiFi']

const form = reactive({
  name: '',
  type: '',
  address: '',
  latitude: 39.916527,
  longitude: 116.397128,
  phone: '',
  business_hours: '',
  pet_policy: '',
  description: '',
  amenities: [] as string[],
  images: [] as string[],
  rating: 4.5,
  status: 1,
})

const rules: FormRules = {
  name: [{ required: true, message: '请输入名称' }],
  type: [{ required: true, message: '请选择分类' }],
  address: [{ required: true, message: '请输入地址' }],
  latitude: [{ required: true, message: '请输入纬度' }],
  longitude: [{ required: true, message: '请输入经度' }],
}

onMounted(async () => {
  const cats = await categoryApi.list('place-categories')
  categories.value = cats
    .filter((c) => c.status === 1)
    .map((c) => ({ key: String(c.key), label: String(c.label) }))

  if (!isNew.value && id.value) {
    const data = await placeApi.get(id.value)
    Object.assign(form, {
      name: data.name,
      type: data.type,
      address: data.address,
      latitude: Number(data.latitude),
      longitude: Number(data.longitude),
      phone: data.phone || '',
      business_hours: data.business_hours || '',
      pet_policy: data.pet_policy || '',
      description: data.description || '',
      amenities: (data.amenities as string[]) || [],
      images: (data.images as string[]) || [],
      rating: Number(data.rating) || 0,
      status: data.status ?? 1,
    })
  }
})

async function submit() {
  await formRef.value?.validate()
  saving.value = true
  try {
    const payload = { ...form }
    if (isNew.value) {
      await placeApi.create(payload)
      ElMessage.success('创建成功')
    } else {
      await placeApi.update(id.value, payload)
      ElMessage.success('保存成功')
    }
    router.push('/places')
  } finally {
    saving.value = false
  }
}
</script>
