import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi, type AdminUser } from '@/api'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('admin_token') || '')
  const admin = ref<AdminUser | null>(
    JSON.parse(localStorage.getItem('admin_info') || 'null')
  )

  const isLoggedIn = computed(() => !!token.value)

  function setSession(t: string, a: AdminUser) {
    token.value = t
    admin.value = a
    localStorage.setItem('admin_token', t)
    localStorage.setItem('admin_info', JSON.stringify(a))
  }

  function logout() {
    token.value = ''
    admin.value = null
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_info')
  }

  async function login(phone: string, password: string) {
    const res = await authApi.login(phone, password)
    setSession(res.token, res.admin)
    return res
  }

  async function fetchMe() {
    if (!token.value) return
    try {
      admin.value = await authApi.me()
      localStorage.setItem('admin_info', JSON.stringify(admin.value))
    } catch {
      logout()
    }
  }

  return { token, admin, isLoggedIn, login, logout, fetchMe }
})
