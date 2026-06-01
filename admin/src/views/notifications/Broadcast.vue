<template>
  <div class="page-card" style="max-width: 560px">
    <el-alert
      type="info"
      :closable="false"
      title="将向所有正常用户发送系统通知（type=system），显示在小程序「消息 - 系统通知」中。"
      style="margin-bottom: 20px"
    />
    <el-form :model="form" label-width="80px">
      <el-form-item label="标题">
        <el-input v-model="form.title" maxlength="100" show-word-limit />
      </el-form-item>
      <el-form-item label="内容">
        <el-input v-model="form.content" type="textarea" :rows="6" maxlength="500" show-word-limit />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="loading" @click="submit">发送给全部用户</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { notificationApi } from '@/api'

const loading = ref(false)
const form = reactive({ title: '', content: '' })

async function submit() {
  if (!form.title || !form.content) {
    ElMessage.warning('请填写标题和内容')
    return
  }
  await ElMessageBox.confirm('确定向全部用户发送？', '确认')
  loading.value = true
  try {
    const res = await notificationApi.broadcast({ ...form })
    ElMessage.success(`已发送给 ${res.count} 位用户`)
    form.title = ''
    form.content = ''
  } finally {
    loading.value = false
  }
}
</script>
