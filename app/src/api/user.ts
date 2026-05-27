import { post, get, put } from '@/utils/request'

export interface UserInfo {
  id: number
  username: string
  phone?: string
  avatar?: string
  signature?: string
  gender?: string
  birthday?: string
  region?: string
  created_at?: string
}

export interface UpdateUserInfoParams {
  username?: string
  avatar?: string
  signature?: string
  gender?: string
  birthday?: string
  region?: string
}

export async function getUserInfo(): Promise<UserInfo> {
  const response = await get('/user/info')
  return response.data
}

export async function updateUserInfo(params: UpdateUserInfoParams): Promise<UserInfo> {
  const response = await put('/user/info', params)
  return response.data
}

export async function uploadAvatar(filePath: string): Promise<{ url: string }> {
  const response = await post('/user/avatar', {}, {
    filePath,
    name: 'avatar'
  })
  return response.data
}