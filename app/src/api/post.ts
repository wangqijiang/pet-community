import { request } from "@/utils/request";

export interface Post {
  id: number;
  user_id: number;
  username: string;
  avatar: string;
  content: string;
  images: string[];
  location?: string;
  likes: number;
  comments: number;
  created_at: string;
}

export interface Comment {
  id: number;
  post_id: number;
  user_id: number;
  username: string;
  avatar: string;
  content: string;
  reply_to_id?: number;
  reply_to_name?: string;
  created_at: string;
}

export interface PostListResponse {
  list: Post[];
  pagination: {
    total: number;
    page: number;
    size: number;
    pages: number;
  };
}

export interface CommentListResponse {
  list: Comment[];
  pagination: {
    total: number;
    page: number;
    size: number;
    pages: number;
  };
}

export const getPostList = async (
  page: number = 1,
  size: number = 10,
): Promise<PostListResponse> => {
  const response = await request({
    url: "/post",
    method: "GET",
    params: { page, size },
  });
  return response.data;
};

export const getPostDetail = async (id: number): Promise<Post> => {
  const response = await request({
    url: `/post/${id}`,
    method: "GET",
  });
  return response.data;
};

export const createPost = async (
  content: string,
  images: string[] = [],
): Promise<Post> => {
  const response = await request({
    url: "/post",
    method: "POST",
    data: { content, images },
  });
  return response.data;
};

export const deletePost = async (id: number): Promise<void> => {
  await request({
    url: `/post/${id}`,
    method: "DELETE",
  });
};

export const likePost = async (id: number): Promise<void> => {
  await request({
    url: `/post/${id}/like`,
    method: "POST",
  });
};

export const unlikePost = async (id: number): Promise<void> => {
  await request({
    url: `/post/${id}/unlike`,
    method: "POST",
  });
};

export const getComments = async (
  postId: number,
  page: number = 1,
  size: number = 10,
): Promise<CommentListResponse> => {
  const response = await request({
    url: `/post/${postId}/comments`,
    method: "GET",
    params: { page, size },
  });
  return response.data;
};

export const addComment = async (
  postId: number,
  content: string,
  replyToId?: number,
): Promise<Comment> => {
  const response = await request({
    url: `/post/${postId}/comment`,
    method: "POST",
    data: { content, reply_to_id: replyToId },
  });
  return response.data;
};

export const deleteComment = async (commentId: number): Promise<void> => {
  await request({
    url: `/post/comment/${commentId}`,
    method: "DELETE",
  });
};

export const checkLiked = async (
  postId: number,
): Promise<{ liked: boolean }> => {
  const response = await request({
    url: `/post/${postId}/liked`,
    method: "GET",
  });
  return response.data;
};
