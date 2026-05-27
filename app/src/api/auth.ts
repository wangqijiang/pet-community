import { post } from '../utils/request'

export interface UserInfo {
  id: number
  username: string
  phone: string
  avatar?: string
  signature?: string
  created_at?: string
}

export interface LoginResponse {
  user: UserInfo
  token: string
}

export async function loginByCode(phone: string, code: string): Promise<LoginResponse> {
  const result = await post<LoginResponse>('/auth/loginByCode', { phone, code })
  return result.data
}

export async function sendCode(phone: string): Promise<{ code: string }> {
  const result = await post<{ code: string }>('/auth/sendCode', { phone })
  return result.data
}

export async function login(phone: string, password: string): Promise<LoginResponse> {
  const result = await post<LoginResponse>('/auth/login', { phone, password })
  return result.data
}

export async function register(username: string, phone: string, password: string): Promise<LoginResponse> {
  const result = await post<LoginResponse>('/auth/register', { username, phone, password })
  return result.data
}

export async function logout(): Promise<void> {
  try {
    await post('/auth/logout')
  } catch (error) {
    console.error('退出登录失败:', error)
  } finally {
    uni.removeStorageSync('token')
    uni.removeStorageSync('user')
  }
}

export function setUserInfo(user: UserInfo, token: string): void {
  uni.setStorageSync('token', token)
  uni.setStorageSync('user', JSON.stringify(user))
}

export function getUserInfo(): UserInfo | null {
  const userStr = uni.getStorageSync('user')
  return userStr ? JSON.parse(userStr) : null
}

export function getToken(): string | null {
  return uni.getStorageSync('token') || null
}

export function isLoggedIn(): boolean {
  return !!uni.getStorageSync('token')
}