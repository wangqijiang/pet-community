<template>
  <div class="page-card">
    <el-tabs v-model="activeTab">
      <el-tab-pane label="宠物种类" name="types">
        <div class="toolbar">
          <el-button type="primary" @click="openTypeDialog()">新增种类</el-button>
        </div>
        <el-table v-loading="loadingTypes" :data="types" stripe>
          <el-table-column prop="id" label="ID" width="70" />
          <el-table-column prop="type_key" label="Key" width="100" />
          <el-table-column prop="label" label="名称" />
          <el-table-column prop="sort_order" label="排序" width="80" />
          <el-table-column label="状态" width="90">
            <template #default="{ row }">
              <el-tag :type="row.status === 1 ? 'success' : 'info'">
                {{ row.status === 1 ? '启用' : '禁用' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120">
            <template #default="{ row }">
              <el-button link type="primary" @click="openTypeDialog(row)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <el-tab-pane label="品种" name="breeds">
        <div class="toolbar">
          <el-select v-model="breedTypeFilter" placeholder="筛选种类" clearable style="width: 160px; margin-right: 12px">
            <el-option v-for="t in types" :key="t.id" :label="t.label" :value="t.id" />
          </el-select>
          <el-button type="primary" @click="openBreedDialog()">新增品种</el-button>
        </div>
        <el-table v-loading="loadingBreeds" :data="filteredBreeds" stripe>
          <el-table-column prop="id" label="ID" width="70" />
          <el-table-column prop="type_label" label="种类" width="100" />
          <el-table-column prop="label" label="品种" />
          <el-table-column prop="sort_order" label="排序" width="80" />
          <el-table-column label="状态" width="90">
            <template #default="{ row }">
              <el-tag :type="row.status === 1 ? 'success' : 'info'">
                {{ row.status === 1 ? '启用' : '禁用' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="160">
            <template #default="{ row }">
              <el-button link type="primary" @click="openBreedDialog(row)">编辑</el-button>
              <el-button link type="danger" @click="removeBreed(row)">禁用</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <el-tab-pane label="性格标签" name="tags">
        <div class="toolbar">
          <el-button type="primary" @click="openTagDialog()">新增标签</el-button>
        </div>
        <el-table v-loading="loadingTags" :data="tags" stripe>
          <el-table-column prop="id" label="ID" width="70" />
          <el-table-column prop="key" label="Key" width="120" />
          <el-table-column prop="label" label="名称" />
          <el-table-column prop="sort_order" label="排序" width="80" />
          <el-table-column label="状态" width="90">
            <template #default="{ row }">
              <el-tag :type="row.status === 1 ? 'success' : 'info'">
                {{ row.status === 1 ? '启用' : '禁用' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="160">
            <template #default="{ row }">
              <el-button link type="primary" @click="openTagDialog(row)">编辑</el-button>
              <el-button link type="danger" @click="removeTag(row)">禁用</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <el-dialog v-model="typeVisible" :title="typeEditing ? '编辑种类' : '新增种类'" width="440px">
      <el-form :model="typeForm" label-width="80px">
        <el-form-item v-if="!typeEditing" label="Key">
          <el-input v-model="typeForm.type_key" placeholder="dog / cat / other" />
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="typeForm.label" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="typeForm.sort_order" :min="0" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="typeForm.status">
            <el-radio :value="1">启用</el-radio>
            <el-radio :value="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="typeVisible = false">取消</el-button>
        <el-button type="primary" @click="saveType">保存</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="breedVisible" :title="breedEditing ? '编辑品种' : '新增品种'" width="440px">
      <el-form :model="breedForm" label-width="80px">
        <el-form-item label="种类">
          <el-select v-model="breedForm.type_id" style="width: 100%">
            <el-option v-for="t in types" :key="t.id" :label="t.label" :value="t.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="品种">
          <el-input v-model="breedForm.label" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="breedForm.sort_order" :min="0" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="breedForm.status">
            <el-radio :value="1">启用</el-radio>
            <el-radio :value="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="breedVisible = false">取消</el-button>
        <el-button type="primary" @click="saveBreed">保存</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="tagVisible" :title="tagEditing ? '编辑标签' : '新增标签'" width="440px">
      <el-form :model="tagForm" label-width="80px">
        <el-form-item v-if="!tagEditing" label="Key">
          <el-input v-model="tagForm.key" />
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="tagForm.label" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="tagForm.sort_order" :min="0" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="tagForm.status">
            <el-radio :value="1">启用</el-radio>
            <el-radio :value="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="tagVisible = false">取消</el-button>
        <el-button type="primary" @click="saveTag">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { petOptionsApi } from '@/api'

const activeTab = ref('types')
const types = ref<Record<string, unknown>[]>([])
const breeds = ref<Record<string, unknown>[]>([])
const tags = ref<Record<string, unknown>[]>([])
const loadingTypes = ref(false)
const loadingBreeds = ref(false)
const loadingTags = ref(false)
const breedTypeFilter = ref<number | ''>('')

const typeVisible = ref(false)
const typeEditing = ref<Record<string, unknown> | null>(null)
const typeForm = reactive({ type_key: '', label: '', sort_order: 0, status: 1 })

const breedVisible = ref(false)
const breedEditing = ref<Record<string, unknown> | null>(null)
const breedForm = reactive({ type_id: undefined as number | undefined, label: '', sort_order: 0, status: 1 })

const tagVisible = ref(false)
const tagEditing = ref<Record<string, unknown> | null>(null)
const tagForm = reactive({ key: '', label: '', sort_order: 0, status: 1 })

const filteredBreeds = computed(() => {
  if (!breedTypeFilter.value) return breeds.value
  return breeds.value.filter((b) => b.type_id === breedTypeFilter.value)
})

async function loadAll() {
  loadingTypes.value = true
  loadingBreeds.value = true
  loadingTags.value = true
  try {
    ;[types.value, breeds.value, tags.value] = await Promise.all([
      petOptionsApi.listTypes(),
      petOptionsApi.listBreeds(),
      petOptionsApi.listTags(),
    ])
  } finally {
    loadingTypes.value = false
    loadingBreeds.value = false
    loadingTags.value = false
  }
}

function openTypeDialog(row?: Record<string, unknown>) {
  typeEditing.value = row || null
  typeForm.type_key = row ? String(row.type_key) : ''
  typeForm.label = row ? String(row.label) : ''
  typeForm.sort_order = row ? Number(row.sort_order) : 0
  typeForm.status = row ? Number(row.status) : 1
  typeVisible.value = true
}

async function saveType() {
  if (typeEditing.value) {
    await petOptionsApi.updateType(typeEditing.value.id as number, {
      label: typeForm.label,
      sort_order: typeForm.sort_order,
      status: typeForm.status,
    })
  } else {
    if (!typeForm.type_key || !typeForm.label) {
      ElMessage.warning('请填写 key 和名称')
      return
    }
    await petOptionsApi.createType({ ...typeForm })
  }
  ElMessage.success('已保存')
  typeVisible.value = false
  loadAll()
}

function openBreedDialog(row?: Record<string, unknown>) {
  breedEditing.value = row || null
  breedForm.type_id = row ? Number(row.type_id) : types.value[0]?.id as number
  breedForm.label = row ? String(row.label) : ''
  breedForm.sort_order = row ? Number(row.sort_order) : 0
  breedForm.status = row ? Number(row.status) : 1
  breedVisible.value = true
}

async function saveBreed() {
  if (!breedForm.type_id || !breedForm.label) {
    ElMessage.warning('请填写完整信息')
    return
  }
  if (breedEditing.value) {
    await petOptionsApi.updateBreed(breedEditing.value.id as number, {
      label: breedForm.label,
      sort_order: breedForm.sort_order,
      status: breedForm.status,
    })
  } else {
    await petOptionsApi.createBreed({ ...breedForm })
  }
  ElMessage.success('已保存')
  breedVisible.value = false
  loadAll()
}

async function removeBreed(row: Record<string, unknown>) {
  await ElMessageBox.confirm('确定禁用该品种？', '确认')
  await petOptionsApi.removeBreed(row.id as number)
  ElMessage.success('已禁用')
  loadAll()
}

function openTagDialog(row?: Record<string, unknown>) {
  tagEditing.value = row || null
  tagForm.key = row ? String(row.key) : ''
  tagForm.label = row ? String(row.label) : ''
  tagForm.sort_order = row ? Number(row.sort_order) : 0
  tagForm.status = row ? Number(row.status) : 1
  tagVisible.value = true
}

async function saveTag() {
  if (tagEditing.value) {
    await petOptionsApi.updateTag(tagEditing.value.id as number, {
      label: tagForm.label,
      sort_order: tagForm.sort_order,
      status: tagForm.status,
    })
  } else {
    if (!tagForm.key || !tagForm.label) {
      ElMessage.warning('请填写 key 和名称')
      return
    }
    await petOptionsApi.createTag({ ...tagForm })
  }
  ElMessage.success('已保存')
  tagVisible.value = false
  loadAll()
}

async function removeTag(row: Record<string, unknown>) {
  await ElMessageBox.confirm('确定禁用该标签？', '确认')
  await petOptionsApi.removeTag(row.id as number)
  ElMessage.success('已禁用')
  loadAll()
}

onMounted(loadAll)
</script>

<style scoped>
.toolbar {
  margin-bottom: 16px;
}
</style>
