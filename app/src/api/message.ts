import { get, post, del } from "@/utils/request";

export interface Conversation {
  user_id: number;
  username: string;
  avatar: string;
  last_message: string;
  last_message_type?: string;
  last_time: string;
  unread_count: number;
}

export interface ChatMessage {
  id: number;
  from_id: number;
  to_id: number;
  content: string;
  type: string;
  created_at: string;
  from_username?: string;
  from_avatar?: string;
  to_username?: string;
  to_avatar?: string;
}

export async function getConversations(): Promise<Conversation[]> {
  const res = await get<Conversation[]>("/message");
  return res.data || [];
}

export async function getChatMessages(
  userId: number,
  page = 1,
  size = 50,
): Promise<ChatMessage[]> {
  const res = await get<ChatMessage[]>(`/message/chat/${userId}`, {
    page,
    size,
  });
  return res.data || [];
}

export async function sendMessage(
  toId: number,
  content: string,
  type = "text",
): Promise<ChatMessage> {
  const res = await post<ChatMessage>("/message/send", {
    toId,
    content,
    type,
  });
  return res.data;
}

export async function getUnreadMessageCount(): Promise<number> {
  const res = await get<{ count: number }>("/message/unread/count");
  return res.data?.count ?? 0;
}

export async function markMessagesRead(fromId?: number): Promise<void> {
  await post("/message/read", fromId ? { fromId } : {});
}

export async function deleteConversation(userId: number): Promise<void> {
  await del(`/message/chat/${userId}`);
}
