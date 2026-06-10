import { get, authGet, authPost, authPut, authDel } from "@/utils/request";
import { parseJsonArray } from "@/utils/format";

export interface PostPet {
  id: number;
  name: string;
  type: string;
  breed?: string;
  avatar?: string;
}

export interface Post {
  id: number;
  user_id: number;
  username: string;
  avatar: string;
  content: string;
  images: string[] | string;
  category?: string | null;
  likes_count?: number;
  comments_count?: number;
  likes?: number;
  comments?: number;
  created_at: string;
  liked?: boolean;
  pet_ids?: number[];
  pets?: PostPet[];
}

export interface PostCategory {
  key: string;
  label: string;
}

export interface Comment {
  id: number;
  post_id: number;
  user_id: number;
  username: string;
  avatar: string;
  content: string;
  reply_to_id?: number;
  reply_to_username?: string;
  parent_id?: number;
  created_at: string;
}

export interface Pagination {
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface PostListResponse {
  list: Post[];
  pagination: Pagination;
}

function normalizePost(post: Post): Post {
  return {
    ...post,
    images: parseJsonArray<string>(post.images),
    likes: post.likes_count ?? post.likes ?? 0,
    comments: post.comments_count ?? post.comments ?? 0,
    liked: !!post.liked,
  };
}

export async function getPostCategories(): Promise<PostCategory[]> {
  const res = await get<PostCategory[]>("/post/categories");
  return res.data || [];
}

export async function getPostList(
  page = 1,
  size = 10,
  userId?: number,
  keyword?: string,
  category?: string,
): Promise<PostListResponse> {
  const res = await get<PostListResponse>("/post", {
    page,
    size,
    user_id: userId,
    keyword,
    category,
  });
  return {
    list: (res.data?.list || []).map(normalizePost),
    pagination: res.data?.pagination || {
      total: 0,
      page,
      size,
      pages: 0,
    },
  };
}

export async function getPostDetail(id: number): Promise<Post> {
  const res = await get<Post>(`/post/${id}`);
  return normalizePost(res.data);
}

export async function createPost(
  content: string,
  images: string[] = [],
  petIds: number[] = [],
  category?: string,
): Promise<Post> {
  const res = await authPost<Post>("/post", {
    content,
    images,
    pet_ids: petIds,
    category,
  });
  return normalizePost(res.data);
}

export async function updatePost(
  id: number,
  content: string,
  images: string[] = [],
  petIds?: number[],
  category?: string,
): Promise<Post> {
  const payload: Record<string, unknown> = { content, images };
  if (petIds !== undefined) {
    payload.pet_ids = petIds;
  }
  if (category !== undefined) {
    payload.category = category;
  }
  const res = await authPut<Post>(`/post/${id}`, payload);
  return normalizePost(res.data);
}

export async function deletePost(id: number): Promise<void> {
  await authDel(`/post/${id}`);
}

export async function toggleLikePost(
  id: number,
): Promise<{ liked: boolean }> {
  const res = await authPost<{ liked: boolean }>(`/post/${id}/like`);
  return res.data;
}

export async function toggleFavoritePost(
  id: number,
): Promise<{ favorited: boolean }> {
  const res = await authPost<{ favorited: boolean }>(`/post/${id}/favorite`);
  return res.data;
}

export async function getLikedPosts(
  page = 1,
  size = 10,
): Promise<PostListResponse> {
  const res = await authGet<PostListResponse>("/post/user/likes", {
    page,
    size,
  });
  return {
    list: (res.data?.list || []).map(normalizePost),
    pagination: res.data?.pagination || {
      total: 0,
      page,
      size,
      pages: 0,
    },
  };
}

export async function getFavoritePosts(
  page = 1,
  size = 10,
): Promise<PostListResponse> {
  const res = await authGet<PostListResponse>("/post/user/favorites", {
    page,
    size,
  });
  return {
    list: (res.data?.list || []).map(normalizePost),
    pagination: res.data?.pagination || {
      total: 0,
      page,
      size,
      pages: 0,
    },
  };
}

export async function getComments(
  postId: number,
  page = 1,
  size = 20,
): Promise<{ list: Comment[]; pagination: Pagination }> {
  const res = await get<{ list: Comment[]; pagination: Pagination }>(
    `/post/${postId}/comments`,
    { page, size },
  );
  return res.data || { list: [], pagination: { total: 0, page, size, pages: 0 } };
}

export async function addComment(
  postId: number,
  content: string,
  replyTo?: { id: number; userId: number },
): Promise<Comment> {
  const res = await authPost<Comment>(`/post/${postId}/comment`, {
    content,
    reply_to_id: replyTo?.id,
    reply_to_user_id: replyTo?.userId,
  });
  return res.data;
}

export async function deleteComment(commentId: number): Promise<void> {
  await authDel(`/post/comment/${commentId}`);
}

export async function checkLiked(postId: number): Promise<{ liked: boolean }> {
  const res = await authGet<{ liked: boolean }>(`/post/${postId}/liked`);
  return res.data;
}

/** @deprecated 使用 toggleLikePost */
export const likePost = toggleLikePost;
/** @deprecated 使用 toggleLikePost */
export const unlikePost = toggleLikePost;
