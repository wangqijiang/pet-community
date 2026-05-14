/**
 * Mock Data - User
 */

export const mockUserInfo = {
  id: 1001,
  nickname: '小柴的铲屎官',
  avatar: 'https://picsum.photos/200/200?random=1',
  gender: 1,
  bio: '养了一只可爱的柴犬🐕，喜欢带它到处玩耍',
  location: '北京市朝阳区',
  followCount: 128,
  fanCount: 256,
  postCount: 89,
  collectionCount: 45,
  pets: [
    {
      id: 2001,
      name: '小柴',
      type: '柴犬',
      gender: 1,
      age: 2,
      avatar: 'https://picsum.photos/200/200?random=10',
      birthday: '2022-03-15',
      weight: 10.5,
      description: '活泼可爱的小柴犬'
    }
  ]
}

export const mockNearbyUsers = [
  {
    id: 1002,
    nickname: '橘猫小姐姐',
    avatar: 'https://picsum.photos/200/200?random=2',
    distance: 0.5,
    petName: '橘子',
    petType: '橘猫',
    petAvatar: 'https://picsum.photos/200/200?random=11',
    latitude: 39.9042,
    longitude: 116.4074
  },
  {
    id: 1003,
    nickname: '金毛爸爸',
    avatar: 'https://picsum.photos/200/200?random=3',
    distance: 1.2,
    petName: '大金',
    petType: '金毛',
    petAvatar: 'https://picsum.photos/200/200?random=12',
    latitude: 39.9052,
    longitude: 116.4084
  },
  {
    id: 1004,
    nickname: '布偶妈妈',
    avatar: 'https://picsum.photos/200/200?random=4',
    distance: 2.3,
    petName: '雪球',
    petType: '布偶猫',
    petAvatar: 'https://picsum.photos/200/200?random=13',
    latitude: 39.9062,
    longitude: 116.4094
  }
]

export const mockFollowList = [
  {
    id: 1005,
    nickname: '哈士奇主人',
    avatar: 'https://picsum.photos/200/200?random=5',
    bio: '二哈的快乐你不懂',
    isFollowing: true
  },
  {
    id: 1006,
    nickname: '萨摩耶小可爱',
    avatar: 'https://picsum.photos/200/200?random=6',
    bio: '微笑天使',
    isFollowing: true
  }
]

export const mockFanList = [
  {
    id: 1007,
    nickname: '边牧聪明狗',
    avatar: 'https://picsum.photos/200/200?random=7',
    bio: '智商第一',
    isFollowing: false
  },
  {
    id: 1008,
    nickname: '泰迪小公主',
    avatar: 'https://picsum.photos/200/200?random=8',
    bio: '可爱泰迪',
    isFollowing: true
  }
]
