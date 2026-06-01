<template>
  <div class="page-card">
    <div class="toolbar">
      <el-button type="primary" @click="openDialog()">新增分类</el-button>
    </div>
    <el-table v-loading="loading" :data="list" stripe>
      <el-table-column prop="id" label="ID" width="70" />
      <el-table-column prop="key" label="Key" width="120" />
      <el-table-column prop="label" label="展示名" width="140" />
      <el-table-column prop="sort_order" label="排序" width="80" />
      <el-table-column label="状态" width="90">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'info'">
            {{ row.status === 1 ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="openDialog(row)">编辑</el-button>
          <el-button link type="danger" @click="remove(row)">禁用</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="visible" :title="editing ? '编辑分类' : '新增分类'" width="440px">
      <el-form :model="form" label-width="80px">
        <el-form-item v-if="!editing" label="Key">
          <el-input v-model="form.key" placeholder="英文唯一标识，如 daily" />
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="form.label" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="form.sort_order" :min="0" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio :value="1">启用</el-radio>
            <el-radio :value="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="save">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { categoryApi } from '@/api'

const route = useRoute()
const apiType = computed(() =>
  route.meta.type === 'place' ? 'place-categories' : 'post-categories'
)

const loading = ref(false)
const list = ref<Record<string, unknown>[]>([])
const visible = ref(false)
const editing = ref<Record<string, unknown> | null>(null)
const form = reactive({ key: '', label: '', sort_order: 0, status: 1 })

async function load() {
  loading.value = true
  try {
    list.value = await categoryApi.list(apiType.value)
  } finally {
    loading.value = false
  }
}

function openDialog(row?: Record<string, unknown>) {
  editing.value = row || null
  form.key = row ? String(row.key) : ''
  form.label = row ? String(row.label) : ''
  form.sort_order = row ? Number(row.sort_order) : 0
  form.status = row ? Number(row.status) : 1
  visible.value = true
}

async function save() {
  if (editing.value) {
    await categoryApi.update(apiType.value, editing.value.id as number, {
      label: form.label,
      sort_order: form.sort_order,
      status: form.status,
    })
  } else {
    if (!form.key || !form.label) {
      ElMessage.warning('请填写 key 和名称')
      return
    }
    await categoryApi.create(apiType.value, { ...form })
  }
  ElMessage.success('已保存')
  visible.value = false
  load()
}

async function remove(row: Record<string, unknown>) {
  await ElMessageBox.confirm('确定禁用该分类？', '确认')
  await categoryApi.remove(apiType.value, row.id as number)
  ElMessage.success('已禁用')
  load()
}

onMounted(load)
</script>
