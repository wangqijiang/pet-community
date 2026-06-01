import request, { unwrap, type PageResult } from './request'

export interface AdminUser {
  id: number
  username: string
  phone: string
  avatar?: string
}

export const authApi = {
  login: (phone: string, password: string) =>
    unwrap<{ token: string; admin: AdminUser }>(
      request.post('/auth/login', { phone, password })
    ),
  me: () => unwrap<AdminUser>(request.get('/auth/me')),
}

export const dashboardApi = {
  stats: () =>
    unwrap<{
      users: number
      posts: number
      pets: number
      places: number
      guides: number
      comments: number
      messages: number
      postsToday: number
    }>(request.get('/dashboard/stats')),
}

export const userApi = {
  list: (params: Record<string, unknown>) =>
    unwrap<PageResult<Record<string, unknown>>>(request.get('/users', { params })),
  setStatus: (id: number, status: number) =>
    unwrap(request.patch(`/users/${id}/status`, { status })),
  resetPassword: (id: number, password?: string) =>
    unwrap(request.post(`/users/${id}/reset-password`, { password })),
}

export const postApi = {
  list: (params: Record<string, unknown>) =>
    unwrap<PageResult<Record<string, unknown>>>(request.get('/posts', { params })),
  update: (id: number, data: { status?: number; is_top?: number }) =>
    unwrap(request.patch(`/posts/${id}`, data)),
  remove: (id: number) => unwrap(request.delete(`/posts/${id}`)),
}

export const commentApi = {
  list: (params: Record<string, unknown>) =>
    unwrap<PageResult<Record<string, unknown>>>(request.get('/comments', { params })),
  remove: (id: number) => unwrap(request.delete(`/comments/${id}`)),
}

export const petApi = {
  list: (params: Record<string, unknown>) =>
    unwrap<PageResult<Record<string, unknown>>>(request.get('/pets', { params })),
  setStatus: (id: number, status: number) =>
    unwrap(request.patch(`/pets/${id}/status`, { status })),
}

export const placeApi = {
  list: (params: Record<string, unknown>) =>
    unwrap<PageResult<Record<string, unknown>>>(request.get('/places', { params })),
  get: (id: number) => unwrap<Record<string, unknown>>(request.get(`/places/${id}`)),
  create: (data: Record<string, unknown>) => unwrap(request.post('/places', data)),
  update: (id: number, data: Record<string, unknown>) =>
    unwrap(request.put(`/places/${id}`, data)),
  remove: (id: number) => unwrap(request.delete(`/places/${id}`)),
}

export const placeReviewApi = {
  list: (params: Record<string, unknown>) =>
    unwrap<PageResult<Record<string, unknown>>>(request.get('/place-reviews', { params })),
  remove: (id: number) => unwrap(request.delete(`/place-reviews/${id}`)),
}

export const categoryApi = {
  list: (type: 'post-categories' | 'place-categories') =>
    unwrap<Record<string, unknown>[]>(request.get(`/${type}`)),
  create: (type: 'post-categories' | 'place-categories', data: Record<string, unknown>) =>
    unwrap(request.post(`/${type}`, data)),
  update: (type: 'post-categories' | 'place-categories', id: number, data: Record<string, unknown>) =>
    unwrap(request.put(`/${type}/${id}`, data)),
  remove: (type: 'post-categories' | 'place-categories', id: number) =>
    unwrap(request.delete(`/${type}/${id}`)),
}

export const guideApi = {
  list: (params: Record<string, unknown>) =>
    unwrap<PageResult<Record<string, unknown>>>(request.get('/guides', { params })),
  get: (id: number) => unwrap<Record<string, unknown>>(request.get(`/guides/${id}`)),
  create: (data: Record<string, unknown>) => unwrap(request.post('/guides', data)),
  update: (id: number, data: Record<string, unknown>) =>
    unwrap(request.put(`/guides/${id}`, data)),
  remove: (id: number) => unwrap(request.delete(`/guides/${id}`)),
}

export const notificationApi = {
  broadcast: (data: { title: string; content: string; user_ids?: number[] }) =>
    unwrap<{ count: number }>(request.post('/notifications/broadcast', data)),
}

export const aiApi = {
  list: (params: Record<string, unknown>) =>
    unwrap<PageResult<Record<string, unknown>>>(request.get('/ai-chats', { params })),
  remove: (id: number) => unwrap(request.delete(`/ai-chats/${id}`)),
}

export const uploadApi = {
  image: (file: File) => {
    const fd = new FormData()
    fd.append('file', file)
    fd.append('type', 'file')
    return unwrap<{ url: string }>(
      request.post('/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
    )
  },
}
