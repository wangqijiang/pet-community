/**
 * API Service
 * Handles API requests with mock/real mode toggle
 */

import { isMockMode, API_ENDPOINTS } from '../config/api.config.js'
import * as mockUser from '../mock/user.js'
import * as mockHome from '../mock/home.js'
import * as mockCircle from '../mock/circle.js'
import * as mockMessage from '../mock/message.js'

/**
 * Simulate network delay
 */
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Mock API Response
 */
const mockResponse = (data) => {
  return {
    code: 200,
    message: 'success',
    data
  }
}

/**
 * Request wrapper
 */
const request = async (url, options = {}) => {
  if (isMockMode()) {
    // Mock mode - return mock data
    await delay(300)
    return getMockData(url, options)
  } else {
    // Real mode - make actual API call
    return new Promise((resolve, reject) => {
      uni.request({
        url,
        method: options.method || 'GET',
        data: options.data || {},
        header: {
          'Content-Type': 'application/json',
          ...options.header
        },
        success: (res) => {
          if (res.statusCode === 200) {
            resolve(res.data)
          } else {
            reject(res)
          }
        },
        fail: (err) => {
          reject(err)
        }
      })
    })
  }
}

/**
 * Get mock data based on endpoint
 */
const getMockData = (url, options) => {
  const { data } = options

  // User APIs
  if (url.includes(API_ENDPOINTS.USER_INFO)) {
    return mockResponse(mockUser.mockUserInfo)
  }
  if (url.includes(API_ENDPOINTS.FOLLOW_LIST)) {
    return mockResponse(mockUser.mockFollowList)
  }
  if (url.includes(API_ENDPOINTS.FAN_LIST)) {
    return mockResponse(mockUser.mockFanList)
  }

  // Home APIs
  if (url.includes(API_ENDPOINTS.NEARBY_USERS)) {
    return mockResponse(mockUser.mockNearbyUsers)
  }
  if (url.includes(API_ENDPOINTS.NEARBY_PLACES)) {
    return mockResponse(mockHome.mockNearbyPlaces)
  }
  if (url.includes(API_ENDPOINTS.PLACE_DETAIL)) {
    return mockResponse(mockHome.mockPlaceDetail)
  }

  // Circle APIs
  if (url.includes(API_ENDPOINTS.FEED_LIST)) {
    return mockResponse(mockCircle.mockFeedList)
  }
  if (url.includes(API_ENDPOINTS.POST_DETAIL)) {
    return mockResponse(mockCircle.mockPostDetail)
  }
  if (url.includes(API_ENDPOINTS.USER_POSTS)) {
    return mockResponse(mockCircle.mockUserPosts)
  }
  if (url.includes(API_ENDPOINTS.USER_COLLECTIONS)) {
    return mockResponse(mockCircle.mockCollections)
  }
  if (url.includes(API_ENDPOINTS.LIKE_POST)) {
    return mockResponse({ success: true })
  }
  if (url.includes(API_ENDPOINTS.PUBLISH_POST)) {
    return mockResponse({ postId: 5999 })
  }

  // Message APIs
  if (url.includes(API_ENDPOINTS.MESSAGE_LIST)) {
    return mockResponse(mockMessage.mockMessageList)
  }
  if (url.includes(API_ENDPOINTS.CHAT_HISTORY)) {
    return mockResponse(mockMessage.mockChatHistory)
  }
  if (url.includes(API_ENDPOINTS.SEND_MESSAGE)) {
    return mockResponse({ messageId: 8999 })
  }

  // Follow APIs
  if (url.includes(API_ENDPOINTS.FOLLOW_USER)) {
    return mockResponse({ success: true })
  }
  if (url.includes(API_ENDPOINTS.UNFOLLOW_USER)) {
    return mockResponse({ success: true })
  }

  // Pet APIs
  if (url.includes(API_ENDPOINTS.PET_INFO)) {
    return mockResponse(mockUser.mockUserInfo.pets[0])
  }

  // Default
  return mockResponse(null)
}

/**
 * API Methods
 */
export default {
  // User
  getUserInfo: () => request(API_ENDPOINTS.USER_INFO),
  updateUser: (data) => request(API_ENDPOINTS.UPDATE_USER, { method: 'POST', data }),

  // Home
  getNearbyUsers: (data) => request(API_ENDPOINTS.NEARBY_USERS, { method: 'POST', data }),
  getNearbyPlaces: (data) => request(API_ENDPOINTS.NEARBY_PLACES, { method: 'POST', data }),
  getPlaceDetail: (id) => request(`${API_ENDPOINTS.PLACE_DETAIL}?id=${id}`),

  // Circle
  getFeedList: (page = 1) => request(`${API_ENDPOINTS.FEED_LIST}?page=${page}`),
  getPostDetail: (id) => request(`${API_ENDPOINTS.POST_DETAIL}?id=${id}`),
  publishPost: (data) => request(API_ENDPOINTS.PUBLISH_POST, { method: 'POST', data }),
  likePost: (postId) => request(API_ENDPOINTS.LIKE_POST, { method: 'POST', data: { postId } }),
  commentPost: (data) => request(API_ENDPOINTS.COMMENT_POST, { method: 'POST', data }),

  // Message
  getMessageList: () => request(API_ENDPOINTS.MESSAGE_LIST),
  getChatHistory: (userId) => request(`${API_ENDPOINTS.CHAT_HISTORY}?userId=${userId}`),
  sendMessage: (data) => request(API_ENDPOINTS.SEND_MESSAGE, { method: 'POST', data }),

  // Follow
  followUser: (userId) => request(API_ENDPOINTS.FOLLOW_USER, { method: 'POST', data: { userId } }),
  unfollowUser: (userId) => request(API_ENDPOINTS.UNFOLLOW_USER, { method: 'POST', data: { userId } }),
  getFollowList: () => request(API_ENDPOINTS.FOLLOW_LIST),
  getFanList: () => request(API_ENDPOINTS.FAN_LIST),

  // Pet
  getPetInfo: () => request(API_ENDPOINTS.PET_INFO),
  updatePet: (data) => request(API_ENDPOINTS.UPDATE_PET, { method: 'POST', data }),

  // User Posts & Collections
  getUserPosts: (userId) => request(`${API_ENDPOINTS.USER_POSTS}?userId=${userId}`),
  getUserCollections: () => request(API_ENDPOINTS.USER_COLLECTIONS)
}
