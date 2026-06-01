<template>
  <div class="page-card">
    <div class="toolbar">
      <el-input v-model="query.keyword" placeholder="内容关键词" clearable style="width: 180px" />
      <el-input v-model="query.category" placeholder="分类 key" clearable style="width: 120px" />
      <el-select v-model="query.status" placeholder="状态" clearable style="width: 100px">
        <el-option label="正常" :value="1" />
        <el-option label="已删" :value="0" />
      </el-select>
      <el-button type="primary" @click="load">查询</el-button>
    </div>
    <el-table v-loading="loading" :data="list" stripe>
      <el-table-column prop="id" label="ID" width="70" />
      <el-table-column prop="username" label="用户" width="100" />
      <el-table-column prop="category" label="分类" width="90" />
      <el-table-column label="内容" min-width="200">
        <template #default="{ row }">
          <span class="text-ellipsis">{{ row.content }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="likes_count" label="赞" width="60" />
      <el-table-column label="置顶" width="80">
        <template #default="{ row }">
          <el-switch
            :model-value="row.is_top === 1"
            @change="(v: boolean) => setTop(row, v)"
          />
        </template>
      </el-table-column>
      <el-table-column label="状态" width="80">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'info'">
            {{ row.status === 1 ? '正常' : '删除' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="时间" width="170" />
      <el-table-column label="操作" width="100" fixed="right">
        <template #default="{ row }">
          <el-button v-if="row.status === 1" link type="danger" @click="remove(row)">删除</el-button>
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
import { postApi } from '@/api'

const loading = ref(false)
const list = ref<Record<string, unknown>[]>([])
const page = ref(1)
const size = ref(20)
const total = ref(0)
const query = reactive({ keyword: '', category: '', status: undefined as number | undefined })

async function load() {
  loading.value = true
  try {
    const res = await postApi.list({ page: page.value, size: size.value, ...query })
    list.value = res.list
    total.value = res.pagination.total
  } finally {
    loading.value = false
  }
}

async function setTop(row: Record<string, unknown>, v: boolean) {
  await postApi.update(row.id as number, { is_top: v ? 1 : 0 })
  ElMessage.success('已更新')
  load()
}

async function remove(row: Record<string, unknown>) {
  await ElMessageBox.confirm('确定删除该动态？', '确认')
  await postApi.remove(row.id as number)
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
