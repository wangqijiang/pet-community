import { getToken, isLoggedIn } from '@/utils/session'
import { getApiOrigin } from '@/utils/media'
import { AuthRequiredError, UNAUTHORIZED_MESSAGE } from '@/utils/authRedirect'

const baseURL = `${getApiOrigin()}/api`

/**
 * 上传文件到 OSS（对齐 logistics POST /updateFileOss）
 * @returns 图片公网 URL
 */
export function uploadFileToOss(filePath: string): Promise<string> {
  if (!isLoggedIn()) {
    return Promise.reject(new AuthRequiredError(UNAUTHORIZED_MESSAGE));
  }
  return new Promise((resolve, reject) => {
    const token = getToken()
    uni.uploadFile({
      url: `${baseURL}/file/updateFileOss`,
      filePath,
      name: 'file',
      header: token ? { Authorization: `Bearer ${token}` } : {},
      success: (res) => {
        try {
          const result = JSON.parse(res.data as string)
          if (result.success && result.data) {
            resolve(String(result.data))
            return
          }
          reject(new Error(result.message || '上传失败'))
        } catch (e) {
          reject(e instanceof Error ? e : new Error('上传失败'))
        }
      },
      fail: (err) => reject(new Error(err.errMsg || '上传失败')),
    })
  })
}
