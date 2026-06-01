import { post } from '../utils/request'
import { disconnectRealtime } from '@/utils/realtime'
import {
  getToken,
  isLoggedIn,
  isGuestMode,
  canAccessApp,
  enterGuestMode,
  setStoredUser,
  getStoredUser,
  clearSession,
  type StoredUserInfo,
} from '@/utils/session'

export type UserInfo = StoredUserInfo

export interface LoginResponse {
  user: UserInfo
  token: string
}

export async function loginByCode(phone: string, code: string): Promise<LoginResponse> {
  const result = await post<LoginResponse>('/auth/loginByCode', { phone, code })
  return result.data
}

export async function loginWechat(phoneCode: string): Promise<LoginResponse> {
  const result = await post<LoginResponse>('/auth/wechatLogin', { phoneCode })
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
    disconnectRealtime()
    clearSession()
  }
}

export function setUserInfo(user: UserInfo, token: string): void {
  setStoredUser(user, token)
}

export function getUserInfo(): UserInfo | null {
  return getStoredUser()
}

export { getToken, isLoggedIn, isGuestMode, canAccessApp, enterGuestMode } from '@/utils/session'
export { promptLogin } from '@/utils/authRedirect'