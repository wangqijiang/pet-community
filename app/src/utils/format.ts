import dayjs from "dayjs";
import { isLocalMediaPath, isRemoteUrl } from "@/utils/uploadMedia";

/** 会话列表最后一条消息预览文案 */
export function formatChatPreview(content: string, type?: string): string {
  if (type === "image" || isImageLikeMessage(content, type)) return "图片";
  return content || "";
}

function isImageLikeMessage(content: string, type?: string): boolean {
  if (type === "image") return true;
  if (!content) return false;
  if (isLocalMediaPath(content)) return true;
  if (!isRemoteUrl(content)) return false;
  if (/\.(jpe?g|png|gif|webp|bmp|svg)(\?|#|$)/i.test(content)) return true;
  if (/\/files?\//i.test(content) || /\/upload/i.test(content)) return true;
  return false;
}

export function formatRelativeTime(dateStr?: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "刚刚";
  if (minutes < 60) return `${minutes}分钟前`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}小时前`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}天前`;
  return date.toLocaleDateString("zh-CN");
}

export function formatTime(dateStr?: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return `${date.getHours().toString().padStart(2, "0")}:${date
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;
}

export function formatPetAge(age: number | string | undefined): string {
  const months = Number(age);
  if (!months || Number.isNaN(months)) return "";
  if (months >= 12) {
    const years = Math.floor(months / 12);
    const rest = months % 12;
    return rest > 0 ? `${years}岁${rest}个月` : `${years}岁`;
  }
  return `${months}个月`;
}

/** 宠物性别（与数据库 ENUM 一致） */
export const PetGender = {
  Male: "male",
  Female: "female",
  Unknown: "unknown",
} as const;

export type PetGenderValue = (typeof PetGender)[keyof typeof PetGender];

export const PET_GENDER_OPTIONS = [
  { label: "公", value: PetGender.Male },
  { label: "母", value: PetGender.Female },
] as const;

export function normalizePetGender(gender?: string | null): PetGenderValue | "" {
  if (!gender) return "";
  const value = String(gender).trim().toLowerCase();
  if (value === PetGender.Male || value === "公") return PetGender.Male;
  if (value === PetGender.Female || value === "母") return PetGender.Female;
  if (value === PetGender.Unknown || value === "未知") return PetGender.Unknown;
  return "";
}

export function formatPetGender(gender?: string | null): string {
  const normalized = normalizePetGender(gender);
  if (normalized === PetGender.Male) return "公";
  if (normalized === PetGender.Female) return "母";
  if (normalized === PetGender.Unknown) return "未知";
  return "";
}

/** 用户性别（与数据库 ENUM 一致） */
export const UserGender = {
  Male: "male",
  Female: "female",
  Unknown: "unknown",
} as const;

export type UserGenderValue = (typeof UserGender)[keyof typeof UserGender];

export const USER_GENDER_OPTIONS = [
  { label: "男", value: UserGender.Male },
  { label: "女", value: UserGender.Female },
  { label: "保密", value: UserGender.Unknown },
] as const;

export function normalizeUserGender(gender?: string | null): UserGenderValue | "" {
  if (!gender) return "";
  const value = String(gender).trim().toLowerCase();
  if (value === UserGender.Male || value === "男") return UserGender.Male;
  if (value === UserGender.Female || value === "女") return UserGender.Female;
  if (value === UserGender.Unknown || value === "保密") return UserGender.Unknown;
  return "";
}

export function formatUserGender(gender?: string | null): string {
  const normalized = normalizeUserGender(gender);
  if (normalized === UserGender.Male) return "男";
  if (normalized === UserGender.Female) return "女";
  if (normalized === UserGender.Unknown) return "保密";
  return "";
}

/** 格式化为 YYYY-MM-DD，无效日期返回空字符串 */
export function formatDateYMD(dateStr?: string | null): string {
  if (!dateStr) return "";
  const parsed = dayjs(dateStr);
  return parsed.isValid() ? parsed.format("YYYY-MM-DD") : "";
}

export function parseJsonArray<T = string>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[];
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

export const PLACE_TYPE_LABEL: Record<string, string> = {
  park: "公园",
  cafe: "咖啡厅",
  shop: "宠物店",
  hotel: "酒店",
  hospital: "医院",
  other: "其他",
};
