<template>
  <div class="login-page">
    <el-card class="login-card" shadow="hover">
      <div class="brand">
        <span class="icon">🐾</span>
        <h1>萌宠朋友圈</h1>
        <p>运营管理后台</p>
      </div>
      <el-form :model="form" @submit.prevent="onSubmit">
        <el-form-item>
          <el-input v-model="form.phone" placeholder="管理员手机号" maxlength="11" />
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="form.password"
            type="password"
            placeholder="密码"
            show-password
            @keyup.enter="onSubmit"
          />
        </el-form-item>
        <el-button type="primary" class="submit-btn" :loading="loading" @click="onSubmit">
          登录
        </el-button>
      </el-form>
      <p class="hint">请使用管理员账号登录</p>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()
const loading = ref(false)
const form = reactive({ phone: '', password: '' })

async function onSubmit() {
  if (!form.phone || !form.password) {
    ElMessage.warning('请输入手机号和密码')
    return
  }
  loading.value = true
  try {
    await auth.login(form.phone, form.password)
    ElMessage.success('登录成功')
    router.push('/dashboard')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #fff7f1 0%, #ffe8d6 50%, #ffd4c4 100%);
}

.login-card {
  width: 400px;
  padding: 24px;

  .brand {
    text-align: center;
    margin-bottom: 32px;

    .icon {
      font-size: 48px;
    }

    h1 {
      margin: 12px 0 4px;
      font-size: 24px;
      color: #333;
    }

    p {
      margin: 0;
      color: #888;
      font-size: 14px;
    }
  }

  .submit-btn {
    width: 100%;
  }

  .hint {
    margin-top: 16px;
    font-size: 12px;
    color: #999;
    text-align: center;
  }
}
</style>
