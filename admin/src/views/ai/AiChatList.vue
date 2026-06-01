<template>
  <div class="page-card">
    <el-table v-loading="loading" :data="list" stripe>
      <el-table-column prop="id" label="ID" width="70" />
      <el-table-column prop="username" label="用户" width="100" />
      <el-table-column prop="phone" label="手机" width="120" />
      <el-table-column label="问题" min-width="160">
        <template #default="{ row }">
          <span class="text-ellipsis">{{ row.question }}</span>
        </template>
      </el-table-column>
      <el-table-column label="回答" min-width="200">
        <template #default="{ row }">
          <span class="text-ellipsis">{{ row.answer }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="时间" width="170" />
      <el-table-column label="操作" width="90" fixed="right">
        <template #default="{ row }">
          <el-button link type="danger" @click="remove(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:current-page="page"
      class="pager"
      layout="total, prev, pager, next"
      :total="total"
      @current-change="load"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { aiApi } from '@/api'

const loading = ref(false)
const list = ref<Record<string, unknown>[]>([])
const page = ref(1)
const total = ref(0)

async function load() {
  loading.value = true
  try {
    const res = await aiApi.list({ page: page.value, size: 20 })
    list.value = res.list
    total.value = res.pagination.total
  } finally {
    loading.value = false
  }
}

async function remove(row: Record<string, unknown>) {
  await ElMessageBox.confirm('确定删除该记录？', '确认')
  await aiApi.remove(row.id as number)
  ElMessage.success('已删除')
  load()
}

onMounted(load)
</script>

<style scoped>
.pager {
  margin-top: 16px;
  justify-content: flex-end;
}
</style>
