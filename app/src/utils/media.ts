export function getApiOrigin(): string {
  const envBase = import.meta.env.VITE_API_BASE_URL as string | undefined;
  if (envBase) {
    return envBase.replace(/\/api\/?$/, "");
  }
  const port = "3000";
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return `http://127.0.0.1:${port}`;
    }
    return `http://${hostname}:${port}`;
  }
  return `http://127.0.0.1:${port}`;
}

export function resolveMediaUrl(url?: string | null): string {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  const origin = getApiOrigin();
  return url.startsWith("/") ? `${origin}${url}` : `${origin}/${url}`;
}

/** 本地临时路径 / 静态资源 / 远程 URL 统一解析 */
export function resolveLocalOrMediaUrl(url?: string | null): string {
  if (!url) return "";
  if (
    /^(https?|wxfile|file|blob):/.test(url) ||
    url.startsWith("/static/")
  ) {
    return url;
  }
  return resolveMediaUrl(url);
}

/** 与用户主页一致的用户头像默认图 */
export const DEFAULT_USER_AVATAR = "/static/images/avatar-default.png";

/** 解析用户头像 URL，空值时使用默认头像 */
export function resolveAvatarUrl(url?: string | null): string {
  if (!url) return DEFAULT_USER_AVATAR;
  return resolveMediaUrl(url) || DEFAULT_USER_AVATAR;
}
