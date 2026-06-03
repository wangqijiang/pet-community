import { isLoggedIn, isGuestMode } from "@/utils/session";
import {
  PENDING_SHARE_ROUTE_KEY,
  resolveSharedPostRoute,
} from "@/utils/postShare";

export const HOME_ROUTE = "/pages/home/index";
export const LOGIN_ROUTE = "/pages/login/index";

export function isOnLoginPage(): boolean {
  const pages = getCurrentPages();
  const current = pages[pages.length - 1] as { route?: string } | undefined;
  return !!current?.route?.includes("login/index");
}

/**
 * 冷启动时应跳转的页面：已登录/游客 → 首页；未登录 → 登录页
 */
export function resolveAppLaunchRedirect(
  query?: Record<string, string | undefined>,
): string {
  const sharedRoute = resolveSharedPostRoute(query);

  if (isLoggedIn() || isGuestMode()) {
    return sharedRoute || HOME_ROUTE;
  }

  if (sharedRoute) {
    uni.setStorageSync(PENDING_SHARE_ROUTE_KEY, sharedRoute);
  }
  return LOGIN_ROUTE;
}

/** 从后台回到前台时：已登录却在登录页 → 回首页；未登录却在业务页 → 去登录 */
export function resolveAppResumeRedirect(): string | null {
  if (isLoggedIn() || isGuestMode()) {
    return isOnLoginPage() ? HOME_ROUTE : null;
  }
  return isOnLoginPage() ? null : LOGIN_ROUTE;
}
