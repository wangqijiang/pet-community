<template>
  <div class="page-card">
    <div class="toolbar">
      <el-input v-model="query.keyword" placeholder="宠物名/用户名" clearable style="width: 180px" />
      <el-select v-model="query.status" placeholder="状态" clearable style="width: 120px">
        <el-option label="正常" :value="1" />
        <el-option label="已删除" :value="0" />
        <el-option label="已领养" :value="2" />
        <el-option label="已丢失" :value="3" />
      </el-select>
      <el-button type="primary" @click="load">查询</el-button>
    </div>
    <el-table v-loading="loading" :data="list" stripe>
      <el-table-column prop="id" label="ID" width="70" />
      <el-table-column prop="name" label="名字" width="100" />
      <el-table-column prop="type" label="类型" width="80" />
      <el-table-column prop="breed" label="品种" width="100" />
      <el-table-column prop="username" label="主人" width="100" />
      <el-table-column label="状态" width="90">
        <template #default="{ row }">
          <el-tag>{{ statusLabel(row.status) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="创建时间" width="170" />
      <el-table-column label="操作" width="160" fixed="right">
        <template #default="{ row }">
          <el-dropdown @command="(s: number) => setStatus(row, s)">
            <el-button link type="primary">改状态</el-button>
            <template #dropdown>
              <el-dropdown-item :command="1">正常</el-dropdown-item>
              <el-dropdown-item :command="2">已领养</el-dropdown-item>
              <el-dropdown-item :command="3">已丢失</el-dropdown-item>
              <el-dropdown-item :command="0">已删除</el-dropdown-item>
            </template>
          </el-dropdown>
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
import { ElMessage } from 'element-plus'
import { petApi } from '@/api'

const loading = ref(false)
const list = ref<Record<string, unknown>[]>([])
const page = ref(1)
const total = ref(0)
const query = reactive({ keyword: '', status: undefined as number | undefined })

function statusLabel(s: number) {
  const m: Record<number, string> = { 0: '已删除', 1: '正常', 2: '已领养', 3: '已丢失' }
  return m[s] ?? String(s)
}

async function load() {
  loading.value = true
  try {
    const res = await petApi.list({ page: page.value, size: 20, ...query })
    list.value = res.list
    total.value = res.pagination.total
  } finally {
    loading.value = false
  }
}

async function setStatus(row: Record<string, unknown>, status: number) {
  await petApi.setStatus(row.id as number, status)
  ElMessage.success('已更新')
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
