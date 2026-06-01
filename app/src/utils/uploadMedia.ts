import { uploadFileToOss } from "@/api/file";

/** 小程序本地临时文件（不能当作已上传的远程 URL） */
export function isLocalMediaPath(path?: string | null): boolean {
  if (!path) return false;
  if (/^(wxfile|file|blob):/i.test(path)) return true;
  // 微信小程序 chooseImage / uploadFile 临时路径
  if (/^https?:\/\/tmp[\/.]/i.test(path)) return true;
  if (/^https?:\/\/usr\//i.test(path)) return true;
  return false;
}

export function isRemoteUrl(path?: string | null): boolean {
  if (!path || isLocalMediaPath(path)) return false;
  if (/^https?:\/\//i.test(path)) return true;
  // 服务端已存储的相对路径（如 /uploads/...）
  if (path.startsWith("/") && !path.startsWith("/static/")) return true;
  return false;
}

/** 本地临时路径则先上传 OSS，已是公网/服务端 URL 则原样返回 */
export async function ensureUploaded(path: string): Promise<string> {
  if (!path || isRemoteUrl(path)) return path;
  const url = await uploadFileToOss(path);
  if (!isRemoteUrl(url)) {
    throw new Error("图片上传失败");
  }
  return url;
}

export async function ensureUploadedList(paths: string[]): Promise<string[]> {
  if (!paths?.length) return [];
  return Promise.all(paths.map((p) => ensureUploaded(p)));
}
