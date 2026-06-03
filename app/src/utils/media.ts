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
  if (/^(https?|wxfile|file|blob):/.test(url) || url.startsWith("/static/")) {
    return url;
  }
  return resolveMediaUrl(url);
}
