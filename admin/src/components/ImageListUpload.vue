<template>
  <div class="image-list">
    <div v-for="(url, i) in list" :key="i" class="item">
      <el-image :src="url" fit="cover" class="img" />
      <el-button type="danger" size="small" circle class="remove" @click="remove(i)">
        <el-icon><Close /></el-icon>
      </el-button>
    </div>
    <el-upload
      v-if="list.length < limit"
      :show-file-list="false"
      accept="image/*"
      :http-request="onUpload"
    >
      <div class="add-box">
        <el-icon><Plus /></el-icon>
      </div>
    </el-upload>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ElMessage } from 'element-plus'
import { uploadApi } from '@/api'

const props = withDefaults(
  defineProps<{ modelValue: string[]; limit?: number }>(),
  { limit: 9 }
)
const emit = defineEmits<{ 'update:modelValue': [string[]] }>()

const list = computed({
  get: () => props.modelValue || [],
  set: (v) => emit('update:modelValue', v),
})

async function onUpload(options: { file: File }) {
  const { url } = await uploadApi.image(options.file)
  list.value = [...list.value, url]
  ElMessage.success('已添加')
}

function remove(i: number) {
  const next = [...list.value]
  next.splice(i, 1)
  list.value = next
}
</script>

<style scoped lang="scss">
.image-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;

  .item,
  .add-box {
    width: 88px;
    height: 88px;
    border-radius: 8px;
    position: relative;
  }

  .img {
    width: 100%;
    height: 100%;
    border-radius: 8px;
  }

  .remove {
    position: absolute;
    top: -6px;
    right: -6px;
  }

  .add-box {
    border: 1px dashed #dcdfe6;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #999;

    &:hover {
      border-color: #f4a259;
      color: #f4a259;
    }
  }
}
</style>
