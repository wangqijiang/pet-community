/**
 * Mock Data - Home
 */

export const mockNearbyPlaces = [
  {
    id: 3001,
    name: '宠物乐园咖啡厅',
    type: 'cafe',
    address: '朝阳区三里屯路11号',
    distance: 0.8,
    rating: 4.8,
    reviewCount: 256,
    image: 'https://picsum.photos/400/300?random=20',
    tags: ['宠物友好', '咖啡', '下午茶'],
    openTime: '10:00-22:00',
    phone: '010-12345678',
    latitude: 39.9042,
    longitude: 116.4074,
    petCount: 12
  },
  {
    id: 3002,
    name: '萌宠公园',
    type: 'park',
    address: '朝阳区朝阳公园南路8号',
    distance: 1.5,
    rating: 4.9,
    reviewCount: 512,
    image: 'https://picsum.photos/400/300?random=21',
    tags: ['公园', '遛狗', '免费'],
    openTime: '06:00-21:00',
    phone: '',
    latitude: 39.9052,
    longitude: 116.4084,
    petCount: 28
  },
  {
    id: 3003,
    name: '宠物医院',
    type: 'hospital',
    address: '朝阳区建国路88号',
    distance: 2.1,
    rating: 4.7,
    reviewCount: 189,
    image: 'https://picsum.photos/400/300?random=22',
    tags: ['医疗', '24小时', '专业'],
    openTime: '24小时营业',
    phone: '010-87654321',
    latitude: 39.9062,
    longitude: 116.4094,
    petCount: 5
  },
  {
    id: 3004,
    name: '宠物美容店',
    type: 'grooming',
    address: '朝阳区工体北路15号',
    distance: 3.2,
    rating: 4.6,
    reviewCount: 145,
    image: 'https://picsum.photos/400/300?random=23',
    tags: ['美容', '洗澡', '造型'],
    openTime: '09:00-20:00',
    phone: '010-11223344',
    latitude: 39.9072,
    longitude: 116.4104,
    petCount: 8
  }
]

export const mockPlaceDetail = {
  id: 3001,
  name: '宠物乐园咖啡厅',
  type: 'cafe',
  address: '朝阳区三里屯路11号',
  distance: 0.8,
  rating: 4.8,
  reviewCount: 256,
  images: [
    'https://picsum.photos/400/300?random=20',
    'https://picsum.photos/400/300?random=24',
    'https://picsum.photos/400/300?random=25'
  ],
  tags: ['宠物友好', '咖啡', '下午茶'],
  openTime: '10:00-22:00',
  phone: '010-12345678',
  latitude: 39.9042,
  longitude: 116.4074,
  description: '一家温馨的宠物友好咖啡厅，提供专业的宠物餐食和人类美食。店内设有宠物活动区域，让您的爱宠可以自由玩耍。',
  facilities: ['WiFi', '停车场', '宠物用品', '户外座位'],
  reviews: [
    {
      id: 4001,
      userId: 1002,
      userName: '橘猫小姐姐',
      userAvatar: 'https://picsum.photos/200/200?random=2',
      rating: 5,
      content: '环境很好，店员对宠物很友善，咖啡也很好喝！',
      images: ['https://picsum.photos/300/300?random=30'],
      createTime: '2024-05-10 15:30'
    },
    {
      id: 4002,
      userId: 1003,
      userName: '金毛爸爸',
      userAvatar: 'https://picsum.photos/200/200?random=3',
      rating: 4,
      content: '不错的地方，大金很喜欢这里',
      images: [],
      createTime: '2024-05-09 12:20'
    }
  ]
}
