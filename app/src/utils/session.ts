/** 本地登录态读写（独立模块，避免 auth ↔ realtime 循环依赖） */

const GUEST_MODE_KEY = "guestMode";

export function getToken(): string | null {
  return uni.getStorageSync("token") || null;
}

export function isLoggedIn(): boolean {
  if (isGuestMode()) return false;
  return !!getToken();
}

export function isGuestMode(): boolean {
  return uni.getStorageSync(GUEST_MODE_KEY) === true;
}

export function canAccessApp(): boolean {
  return isLoggedIn() || isGuestMode();
}

export function enterGuestMode(): void {
  clearAuthOnly();
  uni.setStorageSync(GUEST_MODE_KEY, true);
}

export function clearGuestMode(): void {
  uni.removeStorageSync(GUEST_MODE_KEY);
}

export interface StoredUserInfo {
  id: number;
  username: string;
  phone?: string | null;
  phoneBound?: boolean;
  openid?: string | null;
  openidBound?: boolean;
  avatar?: string;
  signature?: string;
  created_at?: string;
}

export function setStoredUser(user: StoredUserInfo, token: string): void {
  clearGuestMode();
  uni.setStorageSync("token", token);
  uni.setStorageSync("user", JSON.stringify(user));
}

export function getStoredUser(): StoredUserInfo | null {
  const userStr = uni.getStorageSync("user");
  return userStr ? JSON.parse(userStr) : null;
}

/** 仅清除登录凭证，保留游客模式 */
export function clearAuthOnly(): void {
  uni.removeStorageSync("token");
  uni.removeStorageSync("user");
}

export function clearSession(): void {
  clearAuthOnly();
  clearGuestMode();
}
