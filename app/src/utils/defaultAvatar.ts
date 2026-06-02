import { resolveMediaUrl } from "@/utils/media";

/** 与 server / 小程序 static 目录一致 */
export const PROFILE_DEFAULT_AVATARS = [
  "/static/images/profile-picture/1.png",
  "/static/images/profile-picture/2.png",
  "/static/images/profile-picture/3.png",
] as const;

export function pickRandomDefaultAvatar(): string {
  const index = Math.floor(Math.random() * PROFILE_DEFAULT_AVATARS.length);
  return PROFILE_DEFAULT_AVATARS[index];
}

/** 无头像时按用户 id 稳定展示同一张默认图 */
export function pickDefaultAvatarByUserId(userId?: number | null): string {
  const id = Number(userId) || 0;
  return PROFILE_DEFAULT_AVATARS[Math.abs(id) % PROFILE_DEFAULT_AVATARS.length];
}

export function resolveUserAvatarUrl(
  avatar?: string | null,
  userId?: number | null,
): string {
  if (!avatar) return pickDefaultAvatarByUserId(userId);
  if (avatar.startsWith("/static/")) return avatar;
  const resolved = resolveMediaUrl(avatar);
  return resolved || pickDefaultAvatarByUserId(userId);
}

export const DEFAULT_USER_AVATAR = PROFILE_DEFAULT_AVATARS[0];

/** 与 resolveUserAvatarUrl 相同，供各页面统一使用 */
export const resolveAvatarUrl = resolveUserAvatarUrl;
