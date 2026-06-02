import {
  clearAuthOnly,
  clearSession,
  isLoggedIn,
  isGuestMode,
} from "./session";
import { showToast } from "./toast";

export const AUTH_REQUIRED_CODE = 401;
export const UNAUTHORIZED_MESSAGE = "用户未登录，请先登录";
export const UNAUTHORIZED_REDIRECT_DELAY = 1500;

export class AuthRequiredError extends Error {
  code = AUTH_REQUIRED_CODE;

  constructor(message = UNAUTHORIZED_MESSAGE) {
    super(message);
    this.name = "AuthRequiredError";
  }
}

let redirecting = false;

export function isAuthRequiredError(error: unknown): error is AuthRequiredError {
  return error instanceof AuthRequiredError;
}

export function isAuthRequiredResponse(payload: {
  statusCode?: number;
  code?: number;
  data?: { needLogin?: boolean } | unknown;
}): boolean {
  if (payload.statusCode === AUTH_REQUIRED_CODE) return true;
  if (payload.code === AUTH_REQUIRED_CODE) return true;
  const extra = payload.data as { needLogin?: boolean } | undefined;
  if (extra?.needLogin === true) return true;
  return false;
}

function isOnLoginPage(): boolean {
  const pages = getCurrentPages();
  const current = pages[pages.length - 1] as { route?: string } | undefined;
  return !!current?.route?.includes("login/index");
}

/** 游客：仅提示并打开登录页（保留游客态，返回后可继续浏览） */
function promptGuestLogin(message: string) {
  showToast({
    title: message,
    icon: "none",
    duration: 1200,
  });
  setTimeout(() => {
    if (!isOnLoginPage()) {
      uni.navigateTo({ url: "/pages/login/index" });
    }
  }, 600);
}

/** 操作前校验登录；未登录则提示并跳转登录页 */
export function promptLogin(message = UNAUTHORIZED_MESSAGE): boolean {
  if (isLoggedIn()) return true;
  if (isGuestMode()) {
    promptGuestLogin(message);
    return false;
  }
  handleUnauthorized(message);
  return false;
}

/** 未登录时清凭证并跳转登录；游客模式仅引导登录不清游客标记 */
export function handleUnauthorized(message = UNAUTHORIZED_MESSAGE) {
  if (redirecting) return;
  if (isOnLoginPage()) return;

  if (isGuestMode()) {
    promptGuestLogin(message);
    return;
  }

  redirecting = true;
  clearSession();

  showToast({
    title: message || UNAUTHORIZED_MESSAGE,
    icon: "none",
    duration: UNAUTHORIZED_REDIRECT_DELAY,
  });

  setTimeout(() => {
    uni.reLaunch({ url: "/pages/login/index" });
    setTimeout(() => {
      redirecting = false;
    }, 300);
  }, UNAUTHORIZED_REDIRECT_DELAY);
}

/** 写操作 401：游客保留 guestMode；已登录则清 token 后引导登录 */
export function handleWriteUnauthorized(message = UNAUTHORIZED_MESSAGE) {
  if (isGuestMode()) {
    promptGuestLogin(message);
    return;
  }
  if (isLoggedIn()) {
    clearAuthOnly();
  }
  handleUnauthorized(message);
}

export function showRequestError(error: unknown, fallback: string) {
  if (isAuthRequiredError(error)) return;
  showToast({
    title: error instanceof Error && error.message ? error.message : fallback,
    icon: "error",
  });
}
