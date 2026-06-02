import { get, post, del } from "@/utils/request";

export interface Notification {
  id: number;
  user_id: number;
  from_user_id?: number;
  from_username?: string;
  from_avatar?: string;
  type: "like" | "comment" | "follow" | "system" | "message";
  title: string;
  content: string;
  target_id?: number;
  target_type?: string;
  is_read: number;
  created_at: string;
}

export interface NotificationListResponse {
  list: Notification[];
  pagination: {
    total: number;
    page: number;
    size: number;
    pages: number;
  };
}

export async function getNotifications(
  page = 1,
  size = 20,
  type?: Notification["type"],
): Promise<NotificationListResponse> {
  const res = await get<NotificationListResponse>("/notification", {
    page,
    size,
    type,
  });
  return (
    res.data || {
      list: [],
      pagination: { total: 0, page, size, pages: 0 },
    }
  );
}

export async function getUnreadNotificationCount(
  excludeType?: Notification["type"],
): Promise<number> {
  const params: Record<string, unknown> = {};
  if (excludeType) params.exclude_type = excludeType;
  const res = await get<{ count: number }>("/notification/unread/count", params);
  return res.data?.count ?? 0;
}

export type NotificationUnreadSummary = Record<
  "like" | "comment" | "follow" | "message" | "system",
  number
>;

export async function getUnreadNotificationSummary(): Promise<NotificationUnreadSummary> {
  const res = await get<NotificationUnreadSummary>("/notification/unread/summary");
  return (
    res.data || {
      like: 0,
      comment: 0,
      follow: 0,
      message: 0,
      system: 0,
    }
  );
}

export async function markNotificationsRead(ids?: number[]): Promise<void> {
  await post("/notification/read", ids ? { ids } : {});
}

export async function deleteNotification(id: number): Promise<void> {
  await del(`/notification/${id}`);
}

export async function getNotificationDetail(
  id: number,
): Promise<Notification> {
  const res = await get<Notification>(`/notification/${id}`);
  return res.data;
}
