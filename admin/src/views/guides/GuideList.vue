<template>
  <div class="page-card">
    <div class="toolbar">
      <el-input v-model="query.keyword" placeholder="标题/内容" clearable style="width: 180px" />
      <el-button type="primary" @click="load">查询</el-button>
      <el-button type="success" @click="$router.push('/guides/new')">新增攻略</el-button>
    </div>
    <el-table v-loading="loading" :data="list" stripe>
      <el-table-column prop="id" label="ID" width="70" />
      <el-table-column prop="title" label="标题" min-width="160" show-overflow-tooltip />
      <el-table-column prop="category" label="分类" width="100" />
      <el-table-column prop="pet_type" label="宠物类型" width="90" />
      <el-table-column prop="views_count" label="浏览" width="70" />
      <el-table-column label="状态" width="80">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'info'">
            {{ row.status === 1 ? '上架' : '下架' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="$router.push(`/guides/${row.id}`)">编辑</el-button>
          <el-button link type="danger" @click="remove(row)">下架</el-button>
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
import { guideApi } from '@/api'

const loading = ref(false)
const list = ref<Record<string, unknown>[]>([])
const page = ref(1)
const total = ref(0)
const query = reactive({ keyword: '' })

async function load() {
  loading.value = true
  try {
    const res = await guideApi.list({ page: page.value, size: 20, ...query })
    list.value = res.list
    total.value = res.pagination.total
  } finally {
    loading.value = false
  }
}

async function remove(row: Record<string, unknown>) {
  await ElMessageBox.confirm('确定下架该攻略？', '确认')
  await guideApi.remove(row.id as number)
  ElMessage.success('已下架')
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
