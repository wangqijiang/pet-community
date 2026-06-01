<template>
  <div class="page-card">
    <div class="toolbar">
      <el-input v-model="query.post_id" placeholder="动态 ID" clearable style="width: 120px" />
      <el-button type="primary" @click="load">查询</el-button>
    </div>
    <el-table v-loading="loading" :data="list" stripe>
      <el-table-column prop="id" label="ID" width="70" />
      <el-table-column prop="username" label="用户" width="100" />
      <el-table-column prop="post_id" label="动态ID" width="80" />
      <el-table-column label="评论" min-width="200">
        <template #default="{ row }">
          <span class="text-ellipsis">{{ row.content }}</span>
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
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { commentApi } from '@/api'

const loading = ref(false)
const list = ref<Record<string, unknown>[]>([])
const page = ref(1)
const total = ref(0)
const query = reactive({ post_id: '' })

async function load() {
  loading.value = true
  try {
    const res = await commentApi.list({ page: page.value, size: 20, ...query })
    list.value = res.list
    total.value = res.pagination.total
  } finally {
    loading.value = false
  }
}

async function remove(row: Record<string, unknown>) {
  await ElMessageBox.confirm('确定删除该评论？', '确认')
  await commentApi.remove(row.id as number)
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
