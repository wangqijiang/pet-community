import { get, put, post } from "@/utils/request";
import { baseURL } from "@/utils/request";

export interface UserInfo {
  id: number;
  username: string;
  phone?: string;
  avatar?: string;
  signature?: string;
  gender?: string;
  birthday?: string;
  region?: string;
  followers_count?: number;
  following_count?: number;
  posts_count?: number;
  pets_count?: number;
  created_at?: string;
}

export interface NearbyUser {
  id: number;
  username: string;
  avatar: string;
  region?: string;
  latitude?: number;
  longitude?: number;
  pet_id?: number;
  pet_name?: string;
  breed?: string;
  pet_type?: string;
  distance?: string;
  petLabel?: string;
}

export interface MapMarkers {
  places: Array<{
    id: number;
    name: string;
    type: string;
    latitude: number;
    longitude: number;
    rating: number;
  }>;
  users: Array<{
    id: number;
    username: string;
    avatar: string;
    latitude: number;
    longitude: number;
    pet_name?: string;
    breed?: string;
  }>;
}

export interface UpdateUserInfoParams {
  username?: string;
  avatar?: string;
  signature?: string;
  gender?: string;
  birthday?: string;
  region?: string;
}

export async function getUserInfo(): Promise<UserInfo> {
  const res = await get<UserInfo>("/user/info");
  return res.data;
}

export async function getUserById(id: number): Promise<UserInfo> {
  const res = await get<UserInfo>(`/user/info/${id}`);
  return res.data;
}

export async function updateUserInfo(
  params: UpdateUserInfoParams,
): Promise<UserInfo> {
  const res = await put<UserInfo>("/user/info", params);
  return res.data;
}

export async function uploadAvatar(filePath: string): Promise<{ url: string }> {
  const res = await post<{ url: string }>(
    "/user/avatar",
    {},
    { filePath, name: "avatar" },
  );
  return res.data;
}

export async function followUser(followId: number): Promise<void> {
  await post("/user/follow", { followId });
}

export async function unfollowUser(followId: number): Promise<void> {
  await post("/user/unfollow", { followId });
}

export async function isFollowing(userId: number): Promise<boolean> {
  const res = await get<{ isFollowing: boolean }>(`/user/is-following/${userId}`);
  return !!res.data?.isFollowing;
}

export async function getFollowingList(
  page = 1,
  size = 20,
): Promise<{ list: UserInfo[]; pagination: { total: number; page: number; size: number; pages: number } }> {
  const res = await get<{
    list: UserInfo[];
    pagination: { total: number; page: number; size: number; pages: number };
  }>("/user/following", { page, size });
  return res.data || { list: [], pagination: { total: 0, page, size, pages: 0 } };
}

export async function getFollowersList(
  page = 1,
  size = 20,
): Promise<{ list: UserInfo[]; pagination: { total: number; page: number; size: number; pages: number } }> {
  const res = await get<{
    list: UserInfo[];
    pagination: { total: number; page: number; size: number; pages: number };
  }>("/user/followers", { page, size });
  return res.data || { list: [], pagination: { total: 0, page, size, pages: 0 } };
}

export async function getNearbyUsers(params: {
  lat?: number;
  lng?: number;
  keyword?: string;
  breed?: string;
}): Promise<NearbyUser[]> {
  const res = await get<NearbyUser[]>("/user/nearby", params as Record<string, unknown>);
  return res.data || [];
}

export async function getMapMarkers(
  lat: number,
  lng: number,
): Promise<MapMarkers> {
  const res = await get<MapMarkers>("/user/map/markers", { lat, lng });
  return res.data || { places: [], users: [] };
}

export async function searchUsers(
  keyword: string,
  page = 1,
  size = 20,
): Promise<{ list: UserInfo[]; pagination: { total: number; page: number; size: number; pages: number } }> {
  const res = await get<{
    list: UserInfo[];
    pagination: { total: number; page: number; size: number; pages: number };
  }>("/user/search", { keyword, page, size });
  return res.data || { list: [], pagination: { total: 0, page, size, pages: 0 } };
}

export { baseURL };
