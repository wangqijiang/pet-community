import { get, post } from "@/utils/request";

export interface Guide {
  id: number;
  title: string;
  content: string;
  cover?: string;
  pet_type?: string;
  category?: string;
  views_count?: number;
  likes_count?: number;
  favorites_count?: number;
  author_name?: string;
  author_avatar?: string;
}

export interface GuideListResponse {
  list: Guide[];
  pagination: {
    total: number;
    page: number;
    size: number;
    pages: number;
  };
}

export async function getGuideList(params: {
  page?: number;
  size?: number;
  pet_type?: string;
  category?: string;
  keyword?: string;
} = {}): Promise<GuideListResponse> {
  const res = await get<GuideListResponse>("/guide", params as Record<string, unknown>);
  return (
    res.data || {
      list: [],
      pagination: { total: 0, page: 1, size: 10, pages: 0 },
    }
  );
}

export async function getGuideDetail(id: number): Promise<Guide> {
  const res = await get<Guide>(`/guide/${id}`);
  return res.data;
}

export async function toggleGuideFavorite(
  id: number,
): Promise<{ favorited: boolean }> {
  const res = await post<{ favorited: boolean }>(`/guide/${id}/favorite`);
  return res.data;
}

export async function getGuideCategories(): Promise<string[]> {
  const res = await get<{ categories: string[] }>("/guide/meta/categories");
  return res.data?.categories || [];
}

export async function getFavoriteGuides(
  page = 1,
  size = 10,
): Promise<GuideListResponse> {
  const res = await get<GuideListResponse>("/guide/user/favorites", {
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
