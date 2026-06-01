import { clearSession, isLoggedIn } from "./session";

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

/** 操作前校验登录；未登录则提示并跳转登录页 */
export function promptLogin(message = UNAUTHORIZED_MESSAGE): boolean {
  if (isLoggedIn()) return true;
  handleUnauthorized(message);
  return false;
}

/** 未登录时清本地态、提示用户，并在延迟后跳转登录页（仅用于写操作/主动触发的登录引导） */
export function handleUnauthorized(message = UNAUTHORIZED_MESSAGE) {
  if (redirecting) return;

  const pages = getCurrentPages();
  const current = pages[pages.length - 1] as { route?: string } | undefined;
  if (current?.route?.includes("login/index")) return;

  redirecting = true;
  clearSession();

  uni.showToast({
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

/** 统一处理接口错误；未登录的读请求静默失败，写操作已在 request 层引导登录 */
export function showRequestError(error: unknown, fallback: string) {
  if (isAuthRequiredError(error)) return;
  uni.showToast({
    title: error instanceof Error && error.message ? error.message : fallback,
    icon: "none",
  });
}
