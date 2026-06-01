<template>
  <div class="page-card">
    <div class="toolbar">
      <el-input v-model="query.keyword" placeholder="用户名/手机号" clearable style="width: 200px" @clear="load" />
      <el-select v-model="query.status" placeholder="状态" clearable style="width: 120px" @change="load">
        <el-option label="正常" :value="1" />
        <el-option label="禁用" :value="0" />
      </el-select>
      <el-button type="primary" @click="load">查询</el-button>
    </div>
    <el-table v-loading="loading" :data="list" stripe>
      <el-table-column prop="id" label="ID" width="70" />
      <el-table-column prop="username" label="用户名" width="120" />
      <el-table-column prop="phone" label="手机号" width="130" />
      <el-table-column prop="posts_count" label="动态" width="70" />
      <el-table-column prop="pets_count" label="宠物" width="70" />
      <el-table-column label="状态" width="90">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'danger'">
            {{ row.status === 1 ? '正常' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="注册时间" width="170" />
      <el-table-column label="操作" fixed="right" width="200">
        <template #default="{ row }">
          <el-button
            link
            :type="row.status === 1 ? 'danger' : 'success'"
            @click="toggleStatus(row)"
          >
            {{ row.status === 1 ? '禁用' : '启用' }}
          </el-button>
          <el-button link type="warning" @click="resetPwd(row)">重置密码</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:current-page="page"
      v-model:page-size="size"
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
import { userApi } from '@/api'

const loading = ref(false)
const list = ref<Record<string, unknown>[]>([])
const page = ref(1)
const size = ref(20)
const total = ref(0)
const query = reactive({ keyword: '', status: undefined as number | undefined })

async function load() {
  loading.value = true
  try {
    const res = await userApi.list({ page: page.value, size: size.value, ...query })
    list.value = res.list
    total.value = res.pagination.total
  } finally {
    loading.value = false
  }
}

async function toggleStatus(row: Record<string, unknown>) {
  const next = row.status === 1 ? 0 : 1
  await userApi.setStatus(row.id as number, next)
  ElMessage.success('已更新')
  load()
}

async function resetPwd(row: Record<string, unknown>) {
  await ElMessageBox.confirm(`重置用户 ${row.username} 的密码为 123456？`, '确认')
  await userApi.resetPassword(row.id as number, '123456')
  ElMessage.success('密码已重置为 123456')
}

onMounted(load)
</script>

<style scoped>
.pager {
  margin-top: 16px;
  justify-content: flex-end;
}
</style>
