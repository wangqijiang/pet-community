import { authGet, authPost, authDel } from "@/utils/request";

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
  const res = await authGet<Conversation[]>("/message");
  return res.data || [];
}

export async function getChatMessages(
  userId: number,
  page = 1,
  size = 50,
): Promise<ChatMessage[]> {
  const res = await authGet<ChatMessage[]>(`/message/chat/${userId}`, {
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
  const res = await authPost<ChatMessage>("/message/send", {
    toId,
    content,
    type,
  });
  return res.data;
}

export async function getUnreadMessageCount(): Promise<number> {
  const res = await authGet<{ count: number }>("/message/unread/count");
  return res.data?.count ?? 0;
}

export async function markMessagesRead(fromId?: number): Promise<void> {
  await authPost("/message/read", fromId ? { fromId } : {});
}

export async function deleteConversation(userId: number): Promise<void> {
  await authDel(`/message/chat/${userId}`);
}
