import { uploadFileToOss } from '@/api/file'

export function isRemoteUrl(path?: string | null): boolean {
  if (!path) return false
  return /^https?:\/\//i.test(path)
}

/** 本地临时路径则先上传 OSS，已是 http(s) 则原样返回 */
export async function ensureUploaded(path: string): Promise<string> {
  if (!path || isRemoteUrl(path)) return path
  return uploadFileToOss(path)
}

export async function ensureUploadedList(paths: string[]): Promise<string[]> {
  if (!paths?.length) return []
  return Promise.all(paths.map((p) => ensureUploaded(p)))
}
