import { get, post, del } from "@/utils/request";

export interface AiChatRecord {
  id: number;
  user_id: number;
  question: string;
  answer: string;
  pet_id?: number;
  created_at: string;
}

export async function sendAiChat(
  question: string,
  petId?: number,
): Promise<{ answer: string; id: number }> {
  const res = await post<{ answer: string; id: number }>("/ai/chat", {
    question,
    pet_id: petId,
  });
  return res.data;
}

export async function getAiHistory(
  page = 1,
  size = 20,
): Promise<{ list: AiChatRecord[]; pagination: { total: number; page: number; size: number; pages: number } }> {
  const res = await get<{
    list: AiChatRecord[];
    pagination: { total: number; page: number; size: number; pages: number };
  }>("/ai/history", { page, size });
  return (
    res.data || {
      list: [],
      pagination: { total: 0, page, size, pages: 0 },
    }
  );
}

export async function getQuickQuestions(): Promise<string[]> {
  const res = await get<Array<{ text: string; category?: string }>>(
    "/ai/quick-questions",
  );
  return (res.data || []).map((item) => item.text);
}

export async function clearAiHistory(): Promise<void> {
  await del("/ai/history");
}
