/**
 * 与 shared/publicApiMatcher.js 逻辑一致，读取同一份 public-api-whitelist.json
 */
import whitelist from "../../../shared/public-api-whitelist.json";

export type PublicApiRoute = {
  method: string;
  pattern: string;
  note?: string;
};

const sortedRoutes = [...whitelist.routes].sort(
  (a, b) => b.pattern.split("/").length - a.pattern.split("/").length,
);

function splitPath(urlPath: string): string[] {
  return urlPath
    .split("?")[0]
    .replace(/\/+$/, "")
    .split("/")
    .filter(Boolean);
}

function matchPattern(pattern: string, urlPath: string): boolean {
  const patternParts = splitPath(pattern);
  const pathParts = splitPath(urlPath);
  if (patternParts.length !== pathParts.length) return false;
  for (let i = 0; i < patternParts.length; i += 1) {
    const seg = patternParts[i];
    if (seg.startsWith(":")) continue;
    if (seg !== pathParts[i]) return false;
  }
  return true;
}

export function isPublicApi(method: string, apiPath: string): boolean {
  const normalizedMethod = (method || "GET").toUpperCase();
  const normalizedPath = apiPath.split("?")[0].replace(/\/+$/, "") || "/";
  return sortedRoutes.some(
    (route) =>
      route.method.toUpperCase() === normalizedMethod &&
      matchPattern(route.pattern, normalizedPath),
  );
}

/** 客户端 API 相对路径 → /api/... */
export function normalizeClientApiPath(urlPath: string): string {
  const p = urlPath.split("?")[0];
  if (p.startsWith("/api/")) return p.replace(/\/+$/, "") || "/api";
  return (`/api${p.startsWith("/") ? "" : "/"}${p}`).replace(/\/+$/, "") || "/api";
}

export function listPublicRoutes(): PublicApiRoute[] {
  return whitelist.routes as PublicApiRoute[];
}

export { whitelist };
