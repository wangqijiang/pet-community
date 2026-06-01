<template>
  <div class="dashboard">
    <el-row :gutter="16">
      <el-col v-for="item in cards" :key="item.label" :xs="12" :sm="8" :md="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-value">{{ item.value }}</div>
          <div class="stat-label">{{ item.label }}</div>
        </el-card>
      </el-col>
    </el-row>
    <el-card class="page-card" style="margin-top: 20px">
      <template #header>快捷入口</template>
      <el-space wrap>
        <el-button @click="$router.push('/places/new')">新增场所</el-button>
        <el-button @click="$router.push('/guides/new')">新增攻略</el-button>
        <el-button @click="$router.push('/post-categories')">动态分类</el-button>
        <el-button @click="$router.push('/place-categories')">场所分类</el-button>
        <el-button @click="$router.push('/notifications')">发送系统通知</el-button>
      </el-space>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { dashboardApi } from '@/api'

const stats = ref({
  users: 0,
  posts: 0,
  pets: 0,
  places: 0,
  guides: 0,
  comments: 0,
  messages: 0,
  postsToday: 0,
})

const cards = computed(() => [
  { label: '注册用户', value: stats.value.users },
  { label: '动态', value: stats.value.posts },
  { label: '今日新发', value: stats.value.postsToday },
  { label: '宠物', value: stats.value.pets },
  { label: '场所', value: stats.value.places },
  { label: '攻略', value: stats.value.guides },
  { label: '评论', value: stats.value.comments },
  { label: '私信', value: stats.value.messages },
])

onMounted(async () => {
  stats.value = await dashboardApi.stats()
})
</script>

<style scoped lang="scss">
.stat-card {
  text-align: center;
  margin-bottom: 16px;

  .stat-value {
    font-size: 32px;
    font-weight: 700;
    color: #f4a259;
  }

  .stat-label {
    margin-top: 8px;
    color: #666;
    font-size: 14px;
  }
}
</style>
