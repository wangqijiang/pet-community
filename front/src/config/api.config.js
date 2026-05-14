/**
 * API Configuration
 * Toggle between mock data and real backend
 */

// API Mode: 'mock' or 'real'
const API_MODE = 'mock'

// Base URLs
const BASE_URL = {
  mock: '',
  real: 'https://api.waggleworld.com'
}

// Get current base URL
export const getBaseUrl = () => {
  return BASE_URL[API_MODE]
}

// Check if using mock mode
export const isMockMode = () => {
  return API_MODE === 'mock'
}

// API Endpoints
export const API_ENDPOINTS = {
  // User
  LOGIN: '/api/user/login',
  REGISTER: '/api/user/register',
  USER_INFO: '/api/user/info',
  UPDATE_USER: '/api/user/update',
  USER_POSTS: '/api/user/posts',
  USER_COLLECTIONS: '/api/user/collections',

  // Home
  NEARBY_USERS: '/api/home/nearby-users',
  NEARBY_PLACES: '/api/home/nearby-places',
  PLACE_DETAIL: '/api/home/place-detail',

  // Circle
  FEED_LIST: '/api/circle/feed',
  POST_DETAIL: '/api/circle/post-detail',
  PUBLISH_POST: '/api/circle/publish',
  LIKE_POST: '/api/circle/like',
  COMMENT_POST: '/api/circle/comment',

  // Message
  MESSAGE_LIST: '/api/message/list',
  CHAT_HISTORY: '/api/message/chat-history',
  SEND_MESSAGE: '/api/message/send',

  // Follow
  FOLLOW_USER: '/api/follow/follow',
  UNFOLLOW_USER: '/api/follow/unfollow',
  FOLLOW_LIST: '/api/follow/list',
  FAN_LIST: '/api/follow/fans',

  // Pet
  PET_INFO: '/api/pet/info',
  UPDATE_PET: '/api/pet/update'
}

export default {
  getBaseUrl,
  isMockMode,
  API_ENDPOINTS
}
