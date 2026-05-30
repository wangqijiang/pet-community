-- ============================================
-- 插入测试数据
-- ============================================

-- 清空现有数据（如果需要重新导入）
-- SET FOREIGN_KEY_CHECKS = 0;
-- TRUNCATE TABLE users;
-- TRUNCATE TABLE pets;
-- TRUNCATE TABLE posts;
-- TRUNCATE TABLE places;
-- TRUNCATE TABLE guides;
-- SET FOREIGN_KEY_CHECKS = 1;

-- 插入用户（密码为 123456 的 bcrypt 哈希值）
INSERT INTO `users` (`username`, `phone`, `password`, `avatar`, `signature`, `gender`, `region`, `followers_count`, `following_count`, `posts_count`, `pets_count`) VALUES
('铲屎官小明', '13800138001', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix', '爱猫人士，欢迎交流', 'male', '北京市 朝阳区', 15, 8, 2, 2),
('狗狗妈妈', '13800138002', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bella', '金毛控，每天遛狗', 'female', '上海市 浦东新区', 23, 12, 2, 2),
('宠物达人', '13800138003', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Max', '专业宠物训练师', 'male', '广州市 天河区', 56, 30, 1, 1),
('猫咪控', '13800138004', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mimi', '每天都要吸猫', 'female', '上海市 浦东新区', 18, 10, 1, 2),
('哈士奇主人', '13800138005', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Husky', '拆家小能手的铲屎官', 'male', '广州市 天河区', 12, 7, 1, 2),
('仓鼠达人', '13800138006', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hamster', '小仓鼠超级可爱', 'female', '深圳市 南山区', 8, 5, 1, 1);

-- 插入宠物
INSERT INTO `pets` (`user_id`, `name`, `type`, `breed`, `age`, `gender`, `color`, `weight`, `size`, `neutered`, `vaccinated`, `health_certificate`, `personality`, `habits`, `description`) VALUES
(1, '咪咪', 'cat', '英短蓝猫', 12, 'female', '灰色', 3.5, 'small', 1, '猫三联、狂犬', 1, '温顺粘人', '喜欢晒太阳', '温顺可爱的小猫咪'),
(1, '旺财', 'dog', '金毛', 24, 'male', '金色', 28.0, 'large', 1, '六联、狂犬', 1, '活泼友好', '喜欢玩球', '活泼的金毛犬'),
(2, '小白', 'dog', '萨摩耶', 18, 'female', '白色', 22.0, 'medium', 1, '六联、狂犬', 1, '温柔可爱', '喜欢撒娇', '微笑天使'),
(2, '大白', 'dog', '萨摩耶', 36, 'male', '白色', 28.0, 'large', 1, '六联、狂犬', 1, '稳重忠诚', '喜欢散步', '小白的爸爸'),
(3, '豆豆', 'cat', '布偶猫', 8, 'male', '双色', 4.0, 'medium', 0, '猫三联', 1, '粘人', '喜欢被抱', '粘人的小可爱'),
(4, '橘座', 'cat', '橘猫', 36, 'male', '橘色', 6.5, 'medium', 1, '猫三联、狂犬', 1, '懒散', '特别能吃', '胖胖的橘猫'),
(4, '小黑', 'cat', '黑猫', 12, 'female', '黑色', 3.2, 'small', 0, '猫三联', 0, '高冷', '喜欢躲猫猫', '神秘的小黑猫'),
(5, '二哈', 'dog', '哈士奇', 18, 'male', '黑白', 22.0, 'medium', 1, '六联、狂犬', 1, '调皮', '精力旺盛', '精力旺盛的拆家王'),
(5, '阿拉', 'dog', '阿拉斯加', 24, 'male', '黑白红', 35.0, 'large', 1, '六联、狂犬', 1, '温柔', '喜欢撒娇', '温柔的大个子'),
(6, '团子', 'hamster', '金丝熊', 6, 'female', '金色', 0.03, 'small', 0, NULL, 0, '活泼', '喜欢跑轮', '圆滚滚的小仓鼠');

-- 插入动态
INSERT INTO `posts` (`user_id`, `content`, `images`, `likes_count`, `comments_count`, `shares_count`) VALUES
(1, '今天带咪咪去打疫苗，超级乖！一点都不害怕，护士姐姐都夸她！🐱', '["https://picsum.photos/seed/cat1/400/400"]', 15, 3, 2),
(1, '旺财学会了新技能——握手！训练了两周终于成功了，太有成就感了！🐕', '["https://picsum.photos/seed/dog1/400/400"]', 28, 5, 4),
(2, '小白今天又露出了招牌微笑，治愈了一整天的疲惫😊', '["https://picsum.photos/seed/samoyed1/400/400", "https://picsum.photos/seed/samoyed2/400/400"]', 45, 8, 6),
(3, '训练豆豆使用猫抓板，终于成功了！分享一下训练心得：要有耐心+零食奖励', '["https://picsum.photos/seed/cat2/400/400"]', 12, 2, 1),
(4, '橘座今天又胖了，医生说要减肥...可是看它可怜巴巴的眼神，我好难啊😭', '["https://picsum.photos/seed/orange1/400/400"]', 35, 8, 5),
(5, '二哈又拆家了，沙发再见👋 但是看到它无辜的眼神，又气不起来了', '["https://picsum.photos/seed/husky1/400/400"]', 42, 12, 8),
(6, '团子在跑轮上玩得好开心，小短腿跑得飞快🐹', '["https://picsum.photos/seed/hamster1/400/400"]', 18, 4, 2),
(2, '今天带大白和小白去公园，父子俩玩得超开心！', '["https://picsum.photos/seed/samoyed3/400/400", "https://picsum.photos/seed/samoyed4/400/400"]', 38, 6, 3);

-- 插入关注关系
INSERT INTO `follows` (`user_id`, `follow_id`) VALUES
(1, 2), (1, 3), (1, 4),
(2, 1), (2, 3),
(3, 1), (3, 2),
(4, 1), (4, 2), (4, 5),
(5, 4), (5, 6),
(6, 4), (6, 5);

-- 插入点赞记录
INSERT INTO `likes` (`user_id`, `target_id`, `target_type`) VALUES
(2, 1, 'post'), (3, 1, 'post'), (4, 1, 'post'),
(1, 2, 'post'), (3, 2, 'post'), (4, 2, 'post'), (5, 2, 'post'),
(1, 3, 'post'), (3, 3, 'post'), (4, 3, 'post'),
(1, 4, 'post'), (2, 4, 'post'),
(2, 5, 'post'), (3, 5, 'post'), (5, 5, 'post'),
(1, 6, 'post'), (2, 6, 'post'), (4, 6, 'post'),
(1, 7, 'post'), (2, 7, 'post'),
(1, 8, 'post'), (4, 8, 'post'), (5, 8, 'post');

-- 插入评论
INSERT INTO `comments` (`post_id`, `user_id`, `content`, `likes_count`) VALUES
(1, 2, '咪咪真勇敢！👍', 3),
(1, 3, '英短都很乖的', 1),
(2, 1, '好聪明的狗狗！', 2),
(2, 2, '求训练教程！', 4),
(2, 3, '用零食奖励，很快就能学会', 5),
(3, 1, '小白的微笑太治愈了！', 3),
(3, 4, '萨摩耶真的超可爱', 2),
(5, 2, '橘猫都容易胖哈哈', 6),
(5, 3, '可以试试减肥粮', 3),
(6, 1, '二哈的破坏力真的惊人😂', 5),
(6, 4, '同款二哈，沙发已经换了三个了', 8);

-- 插入消息
INSERT INTO `messages` (`from_id`, `to_id`, `content`, `type`) VALUES
(1, 2, '你好！你的金毛好可爱', 'text'),
(2, 1, '谢谢！你的英短也很漂亮', 'text'),
(1, 2, '有空一起遛狗呀', 'text'),
(2, 1, '好呀好呀！周末怎么样？', 'text'),
(3, 1, '请问猫咪疫苗在哪里打的？', 'text'),
(1, 3, '在朝阳区的爱心宠物医院', 'text'),
(4, 5, '二哈真的每天都在拆家吗？', 'text'),
(5, 4, '差不多，每天都有新惊喜😂', 'text');

-- 插入地点
INSERT INTO `places` (`name`, `type`, `address`, `latitude`, `longitude`, `description`, `phone`, `rating`, `likes`, `likes_count`, `reviews_count`, `business_hours`, `pet_policy`, `amenities`) VALUES
('朝阳公园', 'park', '北京市朝阳区朝阳公园南路1号', 39.9342, 116.4739, '遛狗圣地，有专门的宠物活动区域，环境优美', '010-12345678', 4.5, 120, 89, 45, '06:00-22:00', '宠物可入内，需牵绳', '["停车场", "饮水处", "宠物便袋"]'),
('星巴克宠物友好店', 'cafe', '北京市朝阳区三里屯路19号', 39.9369, 116.4549, '宠物可以入内的咖啡店，有专门的宠物菜单', '010-87654321', 4.8, 256, 178, 89, '08:00-22:00', '宠物可入内，提供宠物水碗', '["WiFi", "空调", "宠物水碗", "宠物零食"]'),
('爱心宠物医院', 'hospital', '北京市朝阳区建国路88号', 39.9087, 116.4716, '24小时营业的宠物医院，设备先进，服务周到', '010-11111111', 4.6, 89, 67, 34, '24小时', '随时可就诊', '["急诊", "手术", "疫苗", "驱虫", "体检"]'),
('萌宠用品店', 'shop', '北京市朝阳区望京SOHO', 39.9969, 116.4805, '宠物用品一站式购物，品种齐全', '010-22222222', 4.3, 45, 34, 23, '10:00-21:00', '宠物可入内', '["停车场", "送货上门"]'),
('奥林匹克森林公园', 'park', '北京市朝阳区科荟路33号', 40.0165, 116.3972, '超大的公园，非常适合遛狗，有专门的宠物区域', '010-84900000', 4.5, 180, 145, 67, '06:00-21:00', '宠物可入内，需牵绳', '["停车场", "饮水处", "宠物便袋", "休息区"]'),
('宠物天堂咖啡', 'cafe', '上海市浦东新区陆家嘴环路1000号', 31.2397, 121.5016, '可以带宠物的网红咖啡店，环境超好', '021-12345678', 4.8, 320, 234, 112, '09:00-22:00', '宠物可入内，有宠物专属座位', '["WiFi", "空调", "宠物水碗", "宠物蛋糕"]'),
('宠物友好酒店', 'hotel', '成都市武侯区天府大道北段', 30.5728, 104.0668, '可以带宠物入住的酒店，服务贴心', '028-22222222', 4.4, 67, 45, 28, '入住14:00，退房12:00', '可携带宠物，需提前告知', '["停车场", "宠物床", "宠物餐"]');

-- 插入地点评价
INSERT INTO `place_reviews` (`place_id`, `user_id`, `rating`, `content`) VALUES
(1, 1, 5, '环境很好，有很多狗狗一起玩，狗狗玩得很开心'),
(1, 2, 4, '场地很大，但是周末人太多了'),
(1, 5, 5, '遛狗圣地！二哈玩疯了'),
(2, 4, 5, '咖啡很好喝，服务员对宠物很友好'),
(2, 1, 5, '猫咪很喜欢这里的环境'),
(3, 1, 5, '医生很专业，设备也很先进，24小时营业很方便'),
(3, 2, 4, '服务不错，就是价格有点贵'),
(4, 6, 4, '东西很全，价格也合理'),
(5, 2, 5, '遛狗好地方，场地大，狗狗可以放开跑'),
(6, 4, 5, '环境超好，宠物蛋糕很赞');

-- 插入地点点赞
INSERT INTO `place_likes` (`place_id`, `user_id`) VALUES
(1, 1), (1, 2), (1, 3), (1, 5),
(2, 1), (2, 4), (2, 5),
(3, 1), (3, 2),
(4, 6),
(5, 2), (5, 3), (5, 5),
(6, 4);

-- 插入通知
INSERT INTO `notifications` (`user_id`, `from_user_id`, `type`, `title`, `content`, `target_id`, `target_type`, `is_read`) VALUES
(1, 2, 'like', '点赞通知', '赞了你的动态', 1, 'post', 0),
(1, 3, 'comment', '评论通知', '评论了你的动态', 1, 'post', 0),
(1, 4, 'follow', '关注通知', '关注了你', 4, 'user', 1),
(2, 1, 'like', '点赞通知', '赞了你的动态', 3, 'post', 0),
(2, 3, 'comment', '评论通知', '评论了你的动态', 3, 'post', 1),
(3, 1, 'follow', '关注通知', '关注了你', 1, 'user', 0),
(4, 5, 'message', '新消息', '给你发送了一条消息', 5, 'user', 0);

-- 插入攻略
INSERT INTO `guides` (`title`, `content`, `cover`, `pet_type`, `category`, `views_count`, `likes_count`, `favorites_count`) VALUES
('新手养猫指南', '从选猫到日常护理的完整指南。\n\n1. 如何选择健康的猫咪\n2. 新猫到家准备\n3. 饮食注意事项\n4. 疫苗和驱虫\n5. 日常护理', 'https://picsum.photos/seed/guide1/400/300', 'cat', '新手入门', 1250, 89, 156),
('金毛犬训练技巧', '如何训练金毛犬的基本指令。\n\n1. 坐下训练\n2. 握手训练\n3. 召回训练\n4. 随行训练', 'https://picsum.photos/seed/guide2/400/300', 'dog', '训练技巧', 980, 67, 123),
('猫咪绝育全攻略', '详细讲解猫咪绝育的时机、注意事项和术后护理。\n\n1. 绝育的最佳时机\n2. 术前准备\n3. 术后护理\n4. 常见问题', 'https://picsum.photos/seed/guide3/400/300', 'cat', '健康护理', 2100, 156, 289),
('遛狗注意事项', '遛狗时需要注意的安全事项和礼仪。\n\n1. 牵绳的重要性\n2. 便便清理\n3. 与其他狗狗互动\n4. 安全注意事项', 'https://picsum.photos/seed/guide4/400/300', 'dog', '日常护理', 1560, 98, 167),
('猫咪行为解读', '通过猫咪的行为了解它的情绪和需求。\n\n1. 叫声含义\n2. 肢体语言\n3. 行为问题解决', 'https://picsum.photos/seed/guide5/400/300', 'cat', '行为训练', 1890, 134, 234),
('哈士奇饲养指南', '哈士奇是一种精力旺盛的犬种，需要特别的照顾。\n\n1. 运动需求\n2. 饮食建议\n3. 毛发护理\n4. 训练要点', 'https://picsum.photos/seed/guide6/400/300', 'dog', '新手入门', 890, 78, 112);

SELECT '测试数据插入完成！' as message;
