<template>
  <div class="image-upload">
    <div v-if="modelValue" class="preview">
      <el-image :src="modelValue" fit="cover" class="img" />
      <el-button type="danger" size="small" circle class="remove" @click="emit('update:modelValue', '')">
        <el-icon><Close /></el-icon>
      </el-button>
    </div>
    <el-upload
      v-else
      :show-file-list="false"
      accept="image/*"
      :http-request="onUpload"
    >
      <el-button type="primary" plain :loading="loading">上传图片</el-button>
    </el-upload>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { uploadApi } from '@/api'

defineProps<{ modelValue: string }>()
const emit = defineEmits<{ 'update:modelValue': [string] }>()

const loading = ref(false)

async function onUpload(options: { file: File }) {
  loading.value = true
  try {
    const { url } = await uploadApi.image(options.file)
    emit('update:modelValue', url)
    ElMessage.success('上传成功')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
.image-upload {
  .preview {
    position: relative;
    width: 120px;
    height: 120px;

    .img {
      width: 100%;
      height: 100%;
      border-radius: 8px;
    }

    .remove {
      position: absolute;
      top: -8px;
      right: -8px;
    }
  }
}
</style>
