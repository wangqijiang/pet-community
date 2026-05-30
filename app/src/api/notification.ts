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
): Promise<NotificationListResponse> {
  const res = await get<NotificationListResponse>("/notification", {
    page,
    size,
  });
  return (
    res.data || {
      list: [],
      pagination: { total: 0, page, size, pages: 0 },
    }
  );
}

export async function getUnreadNotificationCount(): Promise<number> {
  const res = await get<{ count: number }>("/notification/unread/count");
  return res.data?.count ?? 0;
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
