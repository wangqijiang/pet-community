import { get, post, del } from "@/utils/request";
import { parseJsonArray } from "@/utils/format";

export interface Post {
  id: number;
  user_id: number;
  username: string;
  avatar: string;
  content: string;
  images: string[] | string;
  likes_count?: number;
  comments_count?: number;
  likes?: number;
  comments?: number;
  created_at: string;
  liked?: boolean;
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
  };
}

export async function getPostList(
  page = 1,
  size = 10,
  userId?: number,
  keyword?: string,
): Promise<PostListResponse> {
  const res = await get<PostListResponse>("/post", {
    page,
    size,
    user_id: userId,
    keyword,
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
): Promise<Post> {
  const res = await post<Post>("/post", { content, images });
  return normalizePost(res.data);
}

export async function deletePost(id: number): Promise<void> {
  await del(`/post/${id}`);
}

export async function toggleLikePost(
  id: number,
): Promise<{ liked: boolean }> {
  const res = await post<{ liked: boolean }>(`/post/${id}/like`);
  return res.data;
}

export async function toggleFavoritePost(
  id: number,
): Promise<{ favorited: boolean }> {
  const res = await post<{ favorited: boolean }>(`/post/${id}/favorite`);
  return res.data;
}

export async function getFavoritePosts(
  page = 1,
  size = 10,
): Promise<PostListResponse> {
  const res = await get<PostListResponse>("/post/user/favorites", {
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
  replyToId?: number,
): Promise<Comment> {
  const res = await post<Comment>(`/post/${postId}/comment`, {
    content,
    reply_to_id: replyToId,
  });
  return res.data;
}

export async function deleteComment(commentId: number): Promise<void> {
  await del(`/post/comment/${commentId}`);
}

export async function checkLiked(postId: number): Promise<{ liked: boolean }> {
  const res = await get<{ liked: boolean }>(`/post/${postId}/liked`);
  return res.data;
}

/** @deprecated 使用 toggleLikePost */
export const likePost = toggleLikePost;
/** @deprecated 使用 toggleLikePost */
export const unlikePost = toggleLikePost;
