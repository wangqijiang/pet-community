<template>
  <div class="page-card">
    <div class="toolbar">
      <el-input v-model="query.keyword" placeholder="名称/地址" clearable style="width: 180px" />
      <el-input v-model="query.type" placeholder="分类 key" clearable style="width: 120px" />
      <el-button type="primary" @click="load">查询</el-button>
      <el-button type="success" @click="$router.push('/places/new')">新增场所</el-button>
    </div>
    <el-table v-loading="loading" :data="list" stripe>
      <el-table-column prop="id" label="ID" width="70" />
      <el-table-column prop="name" label="名称" width="140" />
      <el-table-column prop="category_label" label="分类" width="100" />
      <el-table-column prop="address" label="地址" min-width="180" show-overflow-tooltip />
      <el-table-column prop="rating" label="评分" width="70" />
      <el-table-column label="状态" width="80">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'info'">
            {{ row.status === 1 ? '上架' : '下架' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="$router.push(`/places/${row.id}`)">编辑</el-button>
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
import { placeApi } from '@/api'

const loading = ref(false)
const list = ref<Record<string, unknown>[]>([])
const page = ref(1)
const total = ref(0)
const query = reactive({ keyword: '', type: '' })

async function load() {
  loading.value = true
  try {
    const res = await placeApi.list({ page: page.value, size: 20, ...query })
    list.value = res.list
    total.value = res.pagination.total
  } finally {
    loading.value = false
  }
}

async function remove(row: Record<string, unknown>) {
  await ElMessageBox.confirm('确定下架该场所？', '确认')
  await placeApi.remove(row.id as number)
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
