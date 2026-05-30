-- ============================================
-- WaggleWorld 宠物社交小程序数据库结构 - 完整版
-- ============================================

-- 用户表
CREATE TABLE IF NOT EXISTS `users` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `username` VARCHAR(50) NOT NULL COMMENT '用户名',
  `phone` VARCHAR(20) NOT NULL COMMENT '手机号',
  `password` VARCHAR(255) NOT NULL COMMENT '密码哈希',
  `avatar` VARCHAR(255) DEFAULT NULL COMMENT '头像URL',
  `signature` VARCHAR(200) DEFAULT NULL COMMENT '个性签名',
  `gender` ENUM('male', 'female', 'unknown') DEFAULT 'unknown' COMMENT '性别',
  `birthday` DATE DEFAULT NULL COMMENT '生日',
  `region` VARCHAR(100) DEFAULT NULL COMMENT '地区',
  `followers_count` INT UNSIGNED DEFAULT 0 COMMENT '粉丝数',
  `following_count` INT UNSIGNED DEFAULT 0 COMMENT '关注数',
  `posts_count` INT UNSIGNED DEFAULT 0 COMMENT '动态数',
  `pets_count` INT UNSIGNED DEFAULT 0 COMMENT '宠物数',
  `status` TINYINT UNSIGNED DEFAULT 1 COMMENT '状态（1正常 0禁用）',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_phone` (`phone`),
  KEY `idx_username` (`username`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- 宠物表
CREATE TABLE IF NOT EXISTS `pets` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '宠物ID',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '主人用户ID',
  `name` VARCHAR(50) NOT NULL COMMENT '宠物名称',
  `type` VARCHAR(20) NOT NULL COMMENT '宠物类型（dog/cat/bird等）',
  `breed` VARCHAR(50) DEFAULT NULL COMMENT '品种',
  `age` INT UNSIGNED DEFAULT 0 COMMENT '年龄（月）',
  `gender` ENUM('male', 'female', 'unknown') DEFAULT 'unknown' COMMENT '性别',
  `color` VARCHAR(30) DEFAULT NULL COMMENT '颜色',
  `weight` DECIMAL(5,2) DEFAULT NULL COMMENT '体重（kg）',
  `size` ENUM('small', 'medium', 'large') DEFAULT 'medium' COMMENT '体型',
  `neutered` TINYINT UNSIGNED DEFAULT 0 COMMENT '是否绝育（0否 1是）',
  `vaccinated` VARCHAR(100) DEFAULT NULL COMMENT '疫苗情况',
  `health_certificate` TINYINT UNSIGNED DEFAULT 0 COMMENT '健康证明（0无 1有）',
  `personality` VARCHAR(200) DEFAULT NULL COMMENT '性格特点',
  `habits` VARCHAR(200) DEFAULT NULL COMMENT '生活习惯',
  `avatar` VARCHAR(255) DEFAULT NULL COMMENT '头像URL',
  `photos` JSON DEFAULT NULL COMMENT '照片URL数组',
  `description` TEXT COMMENT '描述',
  `status` TINYINT UNSIGNED DEFAULT 1 COMMENT '状态（1正常 2已领养 3已丢失 0已删除）',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_type` (`type`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='宠物信息表';

-- 动态表
CREATE TABLE IF NOT EXISTS `posts` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '动态ID',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '发布者用户ID',
  `content` TEXT NOT NULL COMMENT '动态内容',
  `images` JSON DEFAULT NULL COMMENT '图片URL数组',
  `likes_count` INT UNSIGNED DEFAULT 0 COMMENT '点赞数',
  `comments_count` INT UNSIGNED DEFAULT 0 COMMENT '评论数',
  `shares_count` INT UNSIGNED DEFAULT 0 COMMENT '分享数',
  `is_top` TINYINT UNSIGNED DEFAULT 0 COMMENT '是否置顶',
  `status` TINYINT UNSIGNED DEFAULT 1 COMMENT '状态（1正常 0删除）',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_created_at` (`created_at`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='动态表';

-- 评论表
CREATE TABLE IF NOT EXISTS `comments` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '评论ID',
  `post_id` BIGINT UNSIGNED NOT NULL COMMENT '动态ID',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '评论者用户ID',
  `parent_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '父评论ID（回复）',
  `reply_to_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '回复的评论ID',
  `reply_to_user_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '回复的用户ID',
  `content` TEXT NOT NULL COMMENT '评论内容',
  `likes_count` INT UNSIGNED DEFAULT 0 COMMENT '点赞数',
  `status` TINYINT UNSIGNED DEFAULT 1 COMMENT '状态（1正常 0删除）',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_post_id` (`post_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_parent_id` (`parent_id`),
  KEY `idx_reply_to_id` (`reply_to_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='评论表';

-- 点赞表
CREATE TABLE IF NOT EXISTS `likes` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '点赞ID',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
  `target_id` BIGINT UNSIGNED NOT NULL COMMENT '目标ID（动态或评论）',
  `target_type` ENUM('post', 'comment') NOT NULL COMMENT '目标类型',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_target` (`user_id`, `target_id`, `target_type`),
  KEY `idx_target` (`target_id`, `target_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='点赞表';

-- 关注表
CREATE TABLE IF NOT EXISTS `follows` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '关注ID',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '关注者用户ID',
  `follow_id` BIGINT UNSIGNED NOT NULL COMMENT '被关注者用户ID',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_follow` (`user_id`, `follow_id`),
  KEY `idx_follow_id` (`follow_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='关注表';

-- 消息表
CREATE TABLE IF NOT EXISTS `messages` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '消息ID',
  `from_id` BIGINT UNSIGNED NOT NULL COMMENT '发送者用户ID',
  `to_id` BIGINT UNSIGNED NOT NULL COMMENT '接收者用户ID',
  `content` TEXT NOT NULL COMMENT '消息内容',
  `type` ENUM('text', 'image', 'system') DEFAULT 'text' COMMENT '消息类型',
  `read_at` TIMESTAMP NULL DEFAULT NULL COMMENT '已读时间',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_from_id` (`from_id`),
  KEY `idx_to_id` (`to_id`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='消息表';

-- 地点表
CREATE TABLE IF NOT EXISTS `places` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '地点ID',
  `name` VARCHAR(100) NOT NULL COMMENT '地点名称',
  `type` ENUM('park', 'cafe', 'shop', 'hotel', 'hospital', 'other') NOT NULL COMMENT '地点类型',
  `address` VARCHAR(255) NOT NULL COMMENT '地址',
  `latitude` DECIMAL(10,7) NOT NULL COMMENT '纬度',
  `longitude` DECIMAL(10,7) NOT NULL COMMENT '经度',
  `description` TEXT COMMENT '描述',
  `images` JSON DEFAULT NULL COMMENT '图片URL数组',
  `phone` VARCHAR(20) DEFAULT NULL COMMENT '联系电话',
  `rating` DECIMAL(2,1) DEFAULT 0.0 COMMENT '评分',
  `likes` INT UNSIGNED DEFAULT 0 COMMENT '点赞数',
  `likes_count` INT UNSIGNED DEFAULT 0 COMMENT '收藏数',
  `reviews_count` INT UNSIGNED DEFAULT 0 COMMENT '评价数',
  `business_hours` VARCHAR(100) DEFAULT NULL COMMENT '营业时间',
  `pet_policy` VARCHAR(200) DEFAULT NULL COMMENT '宠物政策',
  `amenities` JSON DEFAULT NULL COMMENT '配套设施',
  `status` TINYINT UNSIGNED DEFAULT 1 COMMENT '状态（1正常 0关闭）',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_type` (`type`),
  KEY `idx_location` (`latitude`, `longitude`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='地点表';

-- 地点评价表
CREATE TABLE IF NOT EXISTS `place_reviews` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '评价ID',
  `place_id` BIGINT UNSIGNED NOT NULL COMMENT '地点ID',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
  `rating` TINYINT UNSIGNED NOT NULL COMMENT '评分（1-5）',
  `content` TEXT COMMENT '评价内容',
  `images` JSON DEFAULT NULL COMMENT '图片URL数组',
  `status` TINYINT UNSIGNED DEFAULT 1 COMMENT '状态（1正常 0删除）',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_place_id` (`place_id`),
  KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='地点评价表';

-- 地点点赞表
CREATE TABLE IF NOT EXISTS `place_likes` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '点赞ID',
  `place_id` BIGINT UNSIGNED NOT NULL COMMENT '地点ID',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_place_user` (`place_id`, `user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='地点点赞表';

-- 通知表
CREATE TABLE IF NOT EXISTS `notifications` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '通知ID',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '接收者用户ID',
  `from_user_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '发送者用户ID',
  `type` ENUM('like', 'comment', 'follow', 'system', 'message') NOT NULL COMMENT '通知类型',
  `title` VARCHAR(100) NOT NULL COMMENT '通知标题',
  `content` TEXT COMMENT '通知内容',
  `target_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '相关目标ID',
  `target_type` VARCHAR(20) DEFAULT NULL COMMENT '相关目标类型',
  `is_read` TINYINT UNSIGNED DEFAULT 0 COMMENT '是否已读（0未读 1已读）',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_from_user_id` (`from_user_id`),
  KEY `idx_is_read` (`is_read`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='通知表';

-- AI对话记录表
CREATE TABLE IF NOT EXISTS `ai_chats` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '对话ID',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
  `question` TEXT NOT NULL COMMENT '用户问题',
  `answer` TEXT NOT NULL COMMENT 'AI回答',
  `pet_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '关联宠物ID',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_pet_id` (`pet_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='AI对话记录表';

-- 攻略表
CREATE TABLE IF NOT EXISTS `guides` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '攻略ID',
  `title` VARCHAR(100) NOT NULL COMMENT '标题',
  `content` TEXT NOT NULL COMMENT '内容',
  `cover` VARCHAR(255) DEFAULT NULL COMMENT '封面图URL',
  `pet_type` VARCHAR(20) DEFAULT NULL COMMENT '宠物类型',
  `category` VARCHAR(50) DEFAULT NULL COMMENT '分类',
  `views_count` INT UNSIGNED DEFAULT 0 COMMENT '浏览数',
  `likes_count` INT UNSIGNED DEFAULT 0 COMMENT '点赞数',
  `favorites_count` INT UNSIGNED DEFAULT 0 COMMENT '收藏数',
  `author_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '作者ID',
  `status` TINYINT UNSIGNED DEFAULT 1 COMMENT '状态（1正常 0下架）',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_pet_type` (`pet_type`),
  KEY `idx_category` (`category`),
  KEY `idx_status` (`status`),
  KEY `idx_author_id` (`author_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='攻略表';

-- 收藏表（用于收藏动态和攻略）
CREATE TABLE IF NOT EXISTS `favorites` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '收藏ID',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
  `target_id` BIGINT UNSIGNED NOT NULL COMMENT '目标ID',
  `target_type` ENUM('post', 'guide', 'place') NOT NULL COMMENT '目标类型',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_target` (`user_id`, `target_id`, `target_type`),
  KEY `idx_target` (`target_id`, `target_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='收藏表';
