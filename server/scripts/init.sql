CREATE DATABASE IF NOT EXISTS pet_community CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE pet_community;

-- 用户表
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT COMMENT '用户ID',
  username VARCHAR(50) NOT NULL COMMENT '用户名/昵称',
  phone VARCHAR(20) UNIQUE COMMENT '手机号',
  password VARCHAR(255) COMMENT '密码',
  avatar VARCHAR(255) COMMENT '头像',
  signature VARCHAR(200) COMMENT '个性签名/简介',
  gender VARCHAR(10) COMMENT '性别：男/女/保密',
  birthday DATE COMMENT '生日',
  region VARCHAR(100) COMMENT '地区',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  INDEX idx_users_username (username),
  INDEX idx_users_phone (phone)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- 动态表
CREATE TABLE IF NOT EXISTS posts (
  id INT PRIMARY KEY AUTO_INCREMENT COMMENT '动态ID',
  user_id INT NOT NULL COMMENT '用户ID',
  content TEXT COMMENT '内容',
  images TEXT COMMENT '图片JSON数组',
  likes INT DEFAULT 0 COMMENT '点赞数',
  comments INT DEFAULT 0 COMMENT '评论数',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_posts_user_id (user_id),
  INDEX idx_posts_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='动态表';

-- 点赞表
CREATE TABLE IF NOT EXISTS likes (
  id INT PRIMARY KEY AUTO_INCREMENT COMMENT '点赞ID',
  user_id INT NOT NULL COMMENT '用户ID',
  post_id INT NOT NULL COMMENT '动态ID',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  UNIQUE KEY idx_user_post (user_id, post_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='点赞表';

-- 评论表
CREATE TABLE IF NOT EXISTS comments (
  id INT PRIMARY KEY AUTO_INCREMENT COMMENT '评论ID',
  post_id INT NOT NULL COMMENT '动态ID',
  user_id INT NOT NULL COMMENT '用户ID',
  content TEXT NOT NULL COMMENT '评论内容',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  INDEX idx_comments_post_id (post_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='评论表';

-- 关注表
CREATE TABLE IF NOT EXISTS follows (
  id INT PRIMARY KEY AUTO_INCREMENT COMMENT '关注ID',
  user_id INT NOT NULL COMMENT '用户ID',
  follow_id INT NOT NULL COMMENT '关注的用户ID',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (follow_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY idx_user_follow (user_id, follow_id),
  INDEX idx_follows_follow_id (follow_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='关注表';

-- 消息表
CREATE TABLE IF NOT EXISTS messages (
  id INT PRIMARY KEY AUTO_INCREMENT COMMENT '消息ID',
  from_id INT NOT NULL COMMENT '发送者ID',
  to_id INT NOT NULL COMMENT '接收者ID',
  content TEXT NOT NULL COMMENT '消息内容',
  read_at DATETIME COMMENT '已读时间',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  FOREIGN KEY (from_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (to_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_messages_from_id (from_id),
  INDEX idx_messages_to_id (to_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='消息表';

-- 地点表
CREATE TABLE IF NOT EXISTS places (
  id INT PRIMARY KEY AUTO_INCREMENT COMMENT '地点ID',
  name VARCHAR(100) NOT NULL COMMENT '地点名称',
  address VARCHAR(255) COMMENT '地址',
  latitude DECIMAL(10,7) NOT NULL COMMENT '纬度',
  longitude DECIMAL(10,7) NOT NULL COMMENT '经度',
  type VARCHAR(20) COMMENT '类型：park/cafe/shop/hotel/etc',
  description TEXT COMMENT '描述',
  images TEXT COMMENT '图片JSON数组',
  phone VARCHAR(20) COMMENT '联系电话',
  open_time VARCHAR(50) COMMENT '营业时间',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  INDEX idx_places_type (type),
  INDEX idx_places_location (latitude, longitude)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='地点表';

-- 地点收藏表
CREATE TABLE IF NOT EXISTS place_likes (
  id INT PRIMARY KEY AUTO_INCREMENT COMMENT '收藏ID',
  user_id INT NOT NULL COMMENT '用户ID',
  place_id INT NOT NULL COMMENT '地点ID',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (place_id) REFERENCES places(id) ON DELETE CASCADE,
  UNIQUE KEY idx_user_place (user_id, place_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='地点收藏表';

-- 地点评论表
CREATE TABLE IF NOT EXISTS place_reviews (
  id INT PRIMARY KEY AUTO_INCREMENT COMMENT '评论ID',
  place_id INT NOT NULL COMMENT '地点ID',
  user_id INT NOT NULL COMMENT '用户ID',
  content TEXT NOT NULL COMMENT '评论内容',
  rating INT DEFAULT 5 COMMENT '评分(1-5)',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (place_id) REFERENCES places(id) ON DELETE CASCADE,
  INDEX idx_place_reviews_place_id (place_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='地点评论表';

-- 宠物表
CREATE TABLE IF NOT EXISTS pets (
  id INT PRIMARY KEY AUTO_INCREMENT COMMENT '宠物ID',
  user_id INT NOT NULL COMMENT '用户ID',
  name VARCHAR(50) NOT NULL COMMENT '宠物名字',
  type VARCHAR(20) COMMENT '类型：dog/cat/etc',
  breed VARCHAR(50) COMMENT '品种',
  age VARCHAR(20) COMMENT '年龄',
  avatar VARCHAR(255) COMMENT '头像',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_pets_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='宠物表';

-- 插入初始数据（仅在表为空时插入）
INSERT IGNORE INTO places (name, address, latitude, longitude, type, description, phone, open_time) VALUES
('中央公园', '北京市朝阳区中央公园路88号', 39.916527, 116.397128, 'park', '城市中心的绿肺，宠物友好公园', '010-88888888', '6:00-22:00'),
('萌宠咖啡馆', '北京市西城区西单北大街120号', 39.914325, 116.377316, 'cafe', '可以带宠物一起喝咖啡的温馨小店', '010-66666666', '10:00-22:00'),
('汪汪宠物店', '北京市海淀区中关村大街1号', 39.984210, 116.307630, 'shop', '专业宠物用品店，品种齐全', '010-55555555', '9:00-21:00');