/**
 * Mock Data - Circle (Social Feed)
 */

export const mockFeedList = [
  {
    id: 5001,
    userId: 1002,
    userName: '橘猫小姐姐',
    userAvatar: 'https://picsum.photos/200/200?random=2',
    content: '今天带橘子去公园玩啦🎉 天气真好，遇到了好多小伙伴！',
    images: [
      'https://picsum.photos/400/400?random=40',
      'https://picsum.photos/400/400?random=41',
      'https://picsum.photos/400/400?random=42'
    ],
    video: '',
    likeCount: 128,
    commentCount: 23,
    shareCount: 5,
    isLiked: false,
    isCollected: false,
    createTime: '2024-05-13 14:30',
    location: '朝阳公园'
  },
  {
    id: 5002,
    userId: 1003,
    userName: '金毛爸爸',
    userAvatar: 'https://picsum.photos/200/200?random=3',
    content: '大金今天学会新技能了！会握手啦👏',
    images: [],
    video: 'https://example.com/video1.mp4',
    likeCount: 256,
    commentCount: 45,
    shareCount: 12,
    isLiked: true,
    isCollected: false,
    createTime: '2024-05-13 10:15',
    location: '家里'
  },
  {
    id: 5003,
    userId: 1004,
    userName: '布偶妈妈',
    userAvatar: 'https://picsum.photos/200/200?random=4',
    content: '雪球的日常：睡觉、吃饭、再睡觉😴',
    images: [
      'https://picsum.photos/400/400?random=43'
    ],
    video: '',
    likeCount: 89,
    commentCount: 12,
    shareCount: 3,
    isLiked: false,
    isCollected: true,
    createTime: '2024-05-12 18:20',
    location: ''
  },
  {
    id: 5004,
    userId: 1005,
    userName: '哈士奇主人',
    userAvatar: 'https://picsum.photos/200/200?random=5',
    content: '二哈又拆家了...这次是沙发😭',
    images: [
      'https://picsum.photos/400/400?random=44',
      'https://picsum.photos/400/400?random=45'
    ],
    video: '',
    likeCount: 512,
    commentCount: 89,
    shareCount: 23,
    isLiked: true,
    isCollected: false,
    createTime: '2024-05-12 16:45',
    location: '家里'
  }
]

export const mockPostDetail = {
  id: 5001,
  userId: 1002,
  userName: '橘猫小姐姐',
  userAvatar: 'https://picsum.photos/200/200?random=2',
  content: '今天带橘子去公园玩啦🎉 天气真好，遇到了好多小伙伴！',
  images: [
    'https://picsum.photos/400/400?random=40',
    'https://picsum.photos/400/400?random=41',
    'https://picsum.photos/400/400?random=42'
  ],
  video: '',
  likeCount: 128,
  commentCount: 23,
  shareCount: 5,
  isLiked: false,
  isCollected: false,
  createTime: '2024-05-13 14:30',
  location: '朝阳公园',
  comments: [
    {
      id: 6001,
      userId: 1003,
      userName: '金毛爸爸',
      userAvatar: 'https://picsum.photos/200/200?random=3',
      content: '好可爱啊！',
      likeCount: 5,
      createTime: '2024-05-13 14:35',
      replies: [
        {
          id: 6002,
          userId: 1002,
          userName: '橘猫小姐姐',
          userAvatar: 'https://picsum.photos/200/200?random=2',
          content: '谢谢！',
          replyToUserId: 1003,
          replyToUserName: '金毛爸爸',
          createTime: '2024-05-13 14:40'
        }
      ]
    },
    {
      id: 6003,
      userId: 1004,
      userName: '布偶妈妈',
      userAvatar: 'https://picsum.photos/200/200?random=4',
      content: '橘子真活泼！',
      likeCount: 3,
      createTime: '2024-05-13 15:00',
      replies: []
    }
  ]
}

export const mockUserPosts = [
  {
    id: 5001,
    image: 'https://picsum.photos/400/400?random=40',
    likeCount: 128,
    commentCount: 23
  },
  {
    id: 5005,
    image: 'https://picsum.photos/400/400?random=46',
    likeCount: 89,
    commentCount: 15
  },
  {
    id: 5006,
    image: 'https://picsum.photos/400/400?random=47',
    likeCount: 156,
    commentCount: 28
  }
]

export const mockCollections = [
  {
    id: 5002,
    image: 'https://picsum.photos/400/400?random=48',
    likeCount: 256,
    commentCount: 45
  },
  {
    id: 5007,
    image: 'https://picsum.photos/400/400?random=49',
    likeCount: 178,
    commentCount: 32
  }
]
