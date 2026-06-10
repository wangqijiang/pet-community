import { get, authGet, authPost } from "@/utils/request";
import { parseJsonArray } from "@/utils/format";

export interface PlaceCategory {
  key: string;
  label: string;
}

export interface Place {
  id: number;
  name: string;
  type: string;
  category_label?: string;
  address: string;
  latitude: number;
  longitude: number;
  description?: string;
  images?: string[] | string;
  phone?: string;
  rating: number;
  likes?: number;
  reviews_count?: number;
  business_hours?: string;
  pet_policy?: string;
  amenities?: string[] | string;
  distance_km?: number;
  distance?: string | number;
  liked?: boolean;
}

export interface PlaceReview {
  id: number;
  place_id: number;
  user_id: number;
  username: string;
  avatar: string;
  rating: number;
  content: string;
  created_at: string;
}

export interface PlaceListResponse {
  list: Place[];
  pagination: {
    total: number;
    page: number;
    size: number;
    pages: number;
  };
}

function normalizePlace(place: Place): Place {
  const distanceKm =
    place.distance_km ??
    (typeof place.distance === "number" ? place.distance : undefined);

  return {
    ...place,
    images: parseJsonArray<string>(place.images),
    amenities: parseJsonArray<string>(place.amenities),
    distance:
      typeof place.distance === "string"
        ? place.distance
        : distanceKm != null
          ? distanceKm < 1
            ? `${Math.round(distanceKm * 1000)}m`
            : `${distanceKm.toFixed(1)}km`
          : undefined,
  };
}

export async function getPlaceCategories(): Promise<PlaceCategory[]> {
  const res = await get<PlaceCategory[]>("/place/categories");
  return res.data || [];
}

export async function getPlaceList(params: {
  page?: number;
  size?: number;
  type?: string;
  category?: string;
  keyword?: string;
  lat?: number;
  lng?: number;
  radius?: number;
} = {}): Promise<PlaceListResponse> {
  const queryParams: Record<string, unknown> = { ...params };
  const category = params.category || params.type;
  if (category) {
    queryParams.category = category;
  }
  delete queryParams.type;

  const res = await get<PlaceListResponse>("/place", queryParams);
  return {
    list: (res.data?.list || []).map(normalizePlace),
    pagination: res.data?.pagination || {
      total: 0,
      page: params.page || 1,
      size: params.size || 10,
      pages: 0,
    },
  };
}

export async function getPlaceDetail(id: number): Promise<Place> {
  const res = await get<Place>(`/place/${id}`);
  return normalizePlace(res.data);
}

export async function getPlaceReviews(
  placeId: number,
  page = 1,
  size = 10,
): Promise<{ list: PlaceReview[]; pagination: PlaceListResponse["pagination"] }> {
  const res = await get<{ list: PlaceReview[]; pagination: PlaceListResponse["pagination"] }>(
    `/place/${placeId}/reviews`,
    { page, size },
  );
  return res.data || { list: [], pagination: { total: 0, page, size, pages: 0 } };
}

export async function togglePlaceLike(
  placeId: number,
): Promise<{ liked: boolean }> {
  const res = await authPost<{ liked: boolean }>(`/place/${placeId}/like`);
  return res.data;
}

export async function checkPlaceLiked(placeId: number): Promise<boolean> {
  try {
    const res = await authGet<{ liked: boolean }>(`/place/${placeId}/liked`);
    return !!res.data?.liked;
  } catch {
    return false;
  }
}

export async function addPlaceReview(
  placeId: number,
  rating: number,
  content: string,
): Promise<PlaceReview> {
  const res = await authPost<PlaceReview>(`/place/${placeId}/reviews`, {
    rating,
    content,
  });
  return res.data;
}

export async function getFavoritePlaces(
  page = 1,
  size = 10,
): Promise<PlaceListResponse> {
  const res = await authGet<PlaceListResponse>("/place/user/favorites", {
    page,
    size,
  });
  return {
    list: (res.data?.list || []).map(normalizePlace),
    pagination: res.data?.pagination || { total: 0, page, size, pages: 0 },
  };
}
