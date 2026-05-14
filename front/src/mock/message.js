/**
 * Mock Data - Message
 */

export const mockMessageList = [
  {
    id: 7001,
    type: 'user',
    userId: 1002,
    userName: '橘猫小姐姐',
    userAvatar: 'https://picsum.photos/200/200?random=2',
    lastMessage: '好的，明天见！',
    lastMessageTime: '2024-05-13 16:30',
    unreadCount: 2
  },
  {
    id: 7002,
    type: 'user',
    userId: 1003,
    userName: '金毛爸爸',
    userAvatar: 'https://picsum.photos/200/200?random=3',
    lastMessage: '周末一起去公园吗？',
    lastMessageTime: '2024-05-13 15:20',
    unreadCount: 0
  },
  {
    id: 7003,
    type: 'system',
    userId: 0,
    userName: '系统通知',
    userAvatar: '',
    lastMessage: '您有新的粉丝关注',
    lastMessageTime: '2024-05-13 14:10',
    unreadCount: 1
  },
  {
    id: 7004,
    type: 'user',
    userId: 1004,
    userName: '布偶妈妈',
    userAvatar: 'https://picsum.photos/200/200?random=4',
    lastMessage: '你家小柴好可爱',
    lastMessageTime: '2024-05-12 18:45',
    unreadCount: 0
  }
]

export const mockChatHistory = [
  {
    id: 8001,
    fromUserId: 1002,
    toUserId: 1001,
    type: 'text',
    content: '你好呀！',
    createTime: '2024-05-13 16:20',
    isSelf: false
  },
  {
    id: 8002,
    fromUserId: 1001,
    toUserId: 1002,
    type: 'text',
    content: '你好！',
    createTime: '2024-05-13 16:21',
    isSelf: true
  },
  {
    id: 8003,
    fromUserId: 1002,
    toUserId: 1001,
    type: 'text',
    content: '明天有空一起遛狗吗？',
    createTime: '2024-05-13 16:25',
    isSelf: false
  },
  {
    id: 8004,
    fromUserId: 1001,
    toUserId: 1002,
    type: 'text',
    content: '好的，明天见！',
    createTime: '2024-05-13 16:30',
    isSelf: true
  },
  {
    id: 8005,
    fromUserId: 1002,
    toUserId: 1001,
    type: 'image',
    content: 'https://picsum.photos/400/400?random=50',
    createTime: '2024-05-13 16:31',
    isSelf: false
  }
]

export const mockSystemNotifications = [
  {
    id: 9001,
    type: 'follow',
    title: '新粉丝',
    content: '边牧聪明狗 关注了你',
    avatar: 'https://picsum.photos/200/200?random=7',
    createTime: '2024-05-13 14:10',
    isRead: false
  },
  {
    id: 9002,
    type: 'like',
    title: '点赞',
    content: '泰迪小公主 赞了你的动态',
    avatar: 'https://picsum.photos/200/200?random=8',
    createTime: '2024-05-13 12:30',
    isRead: false
  },
  {
    id: 9003,
    type: 'comment',
    title: '评论',
    content: '金毛爸爸 评论了你的动态：好可爱啊！',
    avatar: 'https://picsum.photos/200/200?random=3',
    createTime: '2024-05-13 10:15',
    isRead: true
  },
  {
    id: 9004,
    type: 'system',
    title: '系统消息',
    content: '您的账号已通过实名认证',
    avatar: '',
    createTime: '2024-05-12 16:00',
    isRead: true
  }
]
