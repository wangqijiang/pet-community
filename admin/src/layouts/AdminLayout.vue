<template>
  <el-container class="admin-layout">
    <el-aside width="220px" class="aside">
      <div class="logo">
        <span class="logo-icon">🐾</span>
        <span>萌宠管理后台</span>
      </div>
      <el-menu
        :default-active="activeMenu"
        router
        background-color="#1f2937"
        text-color="#d1d5db"
        active-text-color="#f4a259"
      >
        <el-menu-item index="/dashboard">
          <el-icon><Odometer /></el-icon>
          <span>仪表盘</span>
        </el-menu-item>
        <el-sub-menu index="content">
          <template #title>
            <el-icon><Document /></el-icon>
            <span>内容运营</span>
          </template>
          <el-menu-item index="/posts">动态管理</el-menu-item>
          <el-menu-item index="/comments">评论管理</el-menu-item>
          <el-menu-item index="/guides">攻略管理</el-menu-item>
          <el-menu-item index="/notifications">系统通知</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="place">
          <template #title>
            <el-icon><Location /></el-icon>
            <span>场所</span>
          </template>
          <el-menu-item index="/places">场所列表</el-menu-item>
          <el-menu-item index="/place-reviews">场所评价</el-menu-item>
          <el-menu-item index="/place-categories">场所分类</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="config">
          <template #title>
            <el-icon><Setting /></el-icon>
            <span>配置</span>
          </template>
          <el-menu-item index="/post-categories">动态分类</el-menu-item>
        </el-sub-menu>
        <el-menu-item index="/users">
          <el-icon><User /></el-icon>
          <span>用户管理</span>
        </el-menu-item>
        <el-menu-item index="/pets">
          <el-icon><Orange /></el-icon>
          <span>宠物管理</span>
        </el-menu-item>
        <el-menu-item index="/ai-chats">
          <el-icon><ChatDotRound /></el-icon>
          <span>AI 对话</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header class="header">
        <span class="page-title">{{ pageTitle }}</span>
        <div class="header-right">
          <span class="admin-name">{{ auth.admin?.username }}</span>
          <el-button type="danger" link @click="onLogout">退出</el-button>
        </div>
      </el-header>
      <el-main class="main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const activeMenu = computed(() => {
  const p = route.path
  if (p.startsWith('/places/')) return '/places'
  if (p.startsWith('/guides/')) return '/guides'
  return p
})

const pageTitle = computed(() => (route.meta.title as string) || '管理后台')

function onLogout() {
  auth.logout()
  router.push('/login')
}
</script>

<style scoped lang="scss">
.admin-layout {
  height: 100vh;
}

.aside {
  background: #1f2937;
  overflow-x: hidden;

  .logo {
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    color: #fff;
    font-weight: 700;
    font-size: 15px;
    border-bottom: 1px solid #374151;

    .logo-icon {
      font-size: 22px;
    }
  }

  .el-menu {
    border-right: none;
  }
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  border-bottom: 1px solid #eee;
  height: 56px;
  padding: 0 24px;

  .page-title {
    font-size: 18px;
    font-weight: 600;
    color: #333;
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 16px;

    .admin-name {
      color: #666;
      font-size: 14px;
    }
  }
}

.main {
  background: #f5f6f8;
  padding: 20px;
  overflow: auto;
}
</style>
