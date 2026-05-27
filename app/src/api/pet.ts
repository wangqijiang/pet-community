import { post, get, put, del } from '@/utils/request'

export interface Pet {
  id: number
  user_id: number
  name: string
  type: string
  breed: string
  age: string
  avatar: string
  created_at: string
}

export async function getPetList(): Promise<Pet[]> {
  const res = await get('/pet/list')
  return res.data
}

export async function getPetDetail(id: number): Promise<Pet> {
  const res = await get(`/pet/${id}`)
  return res.data
}

export async function addPet(data: {
  name: string
  type?: string
  breed?: string
  age?: string
  avatar?: string
}): Promise<Pet> {
  const res = await post('/pet', data)
  return res.data
}

export async function updatePet(id: number, data: {
  name?: string
  type?: string
  breed?: string
  age?: string
  avatar?: string
}): Promise<Pet> {
  const res = await put(`/pet/${id}`, data)
  return res.data
}

export async function deletePet(id: number): Promise<void> {
  await del(`/pet/${id}`)
}

export async function uploadPetAvatar(filePath: string): Promise<{ url: string }> {
  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: `${process.env.VUE_APP_API_BASE}/api/pet`,
      filePath,
      name: 'avatar',
      header: {
        Authorization: `Bearer ${uni.getStorageSync('token')}`
      },
      success: (res) => {
        try {
          const result = JSON.parse(res.data)
          if (result.success) {
            resolve({ url: result.data.avatar })
          } else {
            reject(new Error(result.message))
          }
        } catch (e) {
          reject(e)
        }
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}
