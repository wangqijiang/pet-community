-- =============================================================================
-- 城市养狗生活社区 · 数据库初始化脚本
-- =============================================================================
-- 用法（推荐，会重建库）:
--   mysql -u root -p < server/scripts/init.sql
--
-- 或导入到已有库（需先手动 CREATE DATABASE）:
--   mysql -u root -p pet_community < server/scripts/init.sql
--
-- 默认账号:
--   小程序测试用户  13800138001 ~ 13800138006  密码 123456
--   管理后台管理员  13800000000              密码 admin123
--   测试用户 13800138001 同时具有 admin 角色
-- =============================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

DROP DATABASE IF EXISTS `pet_community`;
CREATE DATABASE `pet_community`
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `pet_community`;

-- =============================================================================
-- 一、表结构
-- =============================================================================

CREATE TABLE `users` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `username` VARCHAR(50) NOT NULL COMMENT '用户名',
  `phone` VARCHAR(20) DEFAULT NULL COMMENT '手机号，微信用户未绑定时为空',
  `openid` VARCHAR(64) DEFAULT NULL COMMENT '微信openid',
  `password` VARCHAR(255) NOT NULL COMMENT '密码哈希',
  `avatar` VARCHAR(255) DEFAULT NULL COMMENT '头像URL',
  `signature` VARCHAR(200) DEFAULT NULL COMMENT '个性签名',
  `gender` ENUM('male', 'female', 'unknown') DEFAULT 'unknown' COMMENT '性别',
  `birthday` DATE DEFAULT NULL COMMENT '生日',
  `region` VARCHAR(100) DEFAULT NULL COMMENT '地区',
  `latitude` DECIMAL(10,7) DEFAULT NULL COMMENT '纬度',
  `longitude` DECIMAL(10,7) DEFAULT NULL COMMENT '经度',
  `followers_count` INT UNSIGNED DEFAULT 0 COMMENT '粉丝数',
  `following_count` INT UNSIGNED DEFAULT 0 COMMENT '关注数',
  `posts_count` INT UNSIGNED DEFAULT 0 COMMENT '动态数',
  `pets_count` INT UNSIGNED DEFAULT 0 COMMENT '宠物数',
  `status` TINYINT UNSIGNED DEFAULT 1 COMMENT '状态（1正常 0禁用）',
  `role` ENUM('user', 'admin') NOT NULL DEFAULT 'user' COMMENT '角色',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_phone` (`phone`),
  UNIQUE KEY `uk_openid` (`openid`),
  KEY `idx_username` (`username`),
  KEY `idx_status` (`status`),
  KEY `idx_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

CREATE TABLE `sms_codes` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `phone` VARCHAR(20) NOT NULL,
  `code` VARCHAR(10) NOT NULL,
  `expires_at` TIMESTAMP NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_phone` (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='短信验证码';

CREATE TABLE `sms_send_records` (
  `phone` VARCHAR(20) NOT NULL COMMENT '手机号',
  `last_sent_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '上次发送时间',
  PRIMARY KEY (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='短信发送冷却记录';

CREATE TABLE `sms_verify_failures` (
  `phone` VARCHAR(20) NOT NULL,
  `fail_count` INT UNSIGNED NOT NULL DEFAULT 0,
  `locked_until` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='短信验证失败计数';

CREATE TABLE `sms_ip_daily` (
  `ip` VARCHAR(64) NOT NULL,
  `day_key` CHAR(8) NOT NULL COMMENT 'YYYYMMDD',
  `send_count` INT UNSIGNED NOT NULL DEFAULT 0,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`ip`, `day_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='按 IP 每日发码计数';

CREATE TABLE `token_blacklist` (
  `jti` VARCHAR(64) NOT NULL,
  `expires_at` TIMESTAMP NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`jti`),
  KEY `idx_expires_at` (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='JWT 吊销列表';

CREATE TABLE `admin_audit_logs` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `admin_id` BIGINT UNSIGNED NOT NULL,
  `action` VARCHAR(64) NOT NULL,
  `target_type` VARCHAR(32) DEFAULT NULL,
  `target_id` VARCHAR(64) DEFAULT NULL,
  `detail` JSON DEFAULT NULL,
  `ip` VARCHAR(64) DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_admin_id` (`admin_id`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='管理端操作审计';

CREATE TABLE `pet_types` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `type_key` VARCHAR(20) NOT NULL COMMENT '存储key：dog/cat/other',
  `label` VARCHAR(50) NOT NULL COMMENT '展示名称',
  `sort_order` INT UNSIGNED DEFAULT 0 COMMENT '排序',
  `status` TINYINT UNSIGNED DEFAULT 1 COMMENT '1启用 0禁用',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_type_key` (`type_key`),
  KEY `idx_status_sort` (`status`, `sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='宠物种类';

CREATE TABLE `pet_breeds` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `type_id` BIGINT UNSIGNED NOT NULL COMMENT '种类ID',
  `label` VARCHAR(50) NOT NULL COMMENT '品种名称',
  `sort_order` INT UNSIGNED DEFAULT 0 COMMENT '排序',
  `status` TINYINT UNSIGNED DEFAULT 1 COMMENT '1启用 0禁用',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_type_status` (`type_id`, `status`, `sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='宠物品种';

CREATE TABLE `pet_personality_tags` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `tag_key` VARCHAR(30) NOT NULL COMMENT '唯一key',
  `label` VARCHAR(30) NOT NULL COMMENT '展示名称',
  `sort_order` INT UNSIGNED DEFAULT 0 COMMENT '排序',
  `status` TINYINT UNSIGNED DEFAULT 1 COMMENT '1启用 0禁用',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_tag_key` (`tag_key`),
  KEY `idx_status_sort` (`status`, `sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='宠物性格标签';

CREATE TABLE `post_categories` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '分类ID',
  `key` VARCHAR(50) NOT NULL COMMENT '分类枚举key',
  `label` VARCHAR(50) NOT NULL COMMENT '展示名称',
  `sort_order` INT UNSIGNED DEFAULT 0 COMMENT '排序（越小越靠前）',
  `status` TINYINT UNSIGNED DEFAULT 1 COMMENT '状态（1启用 0禁用）',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_key` (`key`),
  KEY `idx_status_sort` (`status`, `sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='动态分类表';

CREATE TABLE `place_categories` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '分类ID',
  `key` VARCHAR(50) NOT NULL COMMENT '分类key',
  `label` VARCHAR(50) NOT NULL COMMENT '展示名称',
  `sort_order` INT UNSIGNED DEFAULT 0 COMMENT '排序（越小越靠前）',
  `status` TINYINT UNSIGNED DEFAULT 1 COMMENT '状态（1启用 0禁用）',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_key` (`key`),
  KEY `idx_status_sort` (`status`, `sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='场所分类表';

CREATE TABLE `pets` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '宠物ID',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '主人用户ID',
  `name` VARCHAR(50) NOT NULL COMMENT '宠物名称',
  `type` VARCHAR(20) NOT NULL COMMENT '宠物类型（dog/cat/other）',
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

CREATE TABLE `posts` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '动态ID',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '发布者用户ID',
  `content` TEXT NOT NULL COMMENT '动态内容',
  `images` JSON DEFAULT NULL COMMENT '图片URL数组',
  `category` VARCHAR(50) DEFAULT NULL COMMENT '分类key',
  `likes_count` INT UNSIGNED DEFAULT 0 COMMENT '点赞数',
  `comments_count` INT UNSIGNED DEFAULT 0 COMMENT '评论数',
  `shares_count` INT UNSIGNED DEFAULT 0 COMMENT '分享数',
  `is_top` TINYINT UNSIGNED DEFAULT 0 COMMENT '是否置顶',
  `status` TINYINT UNSIGNED DEFAULT 1 COMMENT '状态（1正常 0删除）',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_category` (`category`),
  KEY `idx_created_at` (`created_at`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='动态表';

CREATE TABLE `post_pets` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '关联ID',
  `post_id` BIGINT UNSIGNED NOT NULL COMMENT '动态ID',
  `pet_id` BIGINT UNSIGNED NOT NULL COMMENT '宠物ID',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_post_pet` (`post_id`, `pet_id`),
  KEY `idx_post_id` (`post_id`),
  KEY `idx_pet_id` (`pet_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='动态关联宠物表';

CREATE TABLE `comments` (
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

CREATE TABLE `likes` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '点赞ID',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
  `target_id` BIGINT UNSIGNED NOT NULL COMMENT '目标ID（动态或评论）',
  `target_type` ENUM('post', 'comment') NOT NULL COMMENT '目标类型',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_target` (`user_id`, `target_id`, `target_type`),
  KEY `idx_target` (`target_id`, `target_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='点赞表';

CREATE TABLE `follows` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '关注ID',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '关注者用户ID',
  `follow_id` BIGINT UNSIGNED NOT NULL COMMENT '被关注者用户ID',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_follow` (`user_id`, `follow_id`),
  KEY `idx_follow_id` (`follow_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='关注表';

CREATE TABLE `messages` (
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

CREATE TABLE `places` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '地点ID',
  `name` VARCHAR(100) NOT NULL COMMENT '地点名称',
  `type` VARCHAR(50) NOT NULL COMMENT '场所分类key',
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

CREATE TABLE `place_reviews` (
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

CREATE TABLE `place_likes` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '点赞ID',
  `place_id` BIGINT UNSIGNED NOT NULL COMMENT '地点ID',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_place_user` (`place_id`, `user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='地点点赞表';

CREATE TABLE `notifications` (
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

CREATE TABLE `ai_chats` (
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

CREATE TABLE `guides` (
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

CREATE TABLE `favorites` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '收藏ID',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
  `target_id` BIGINT UNSIGNED NOT NULL COMMENT '目标ID',
  `target_type` ENUM('post', 'guide', 'place') NOT NULL COMMENT '目标类型',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_target` (`user_id`, `target_id`, `target_type`),
  KEY `idx_target` (`target_id`, `target_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='收藏表';

-- =============================================================================
-- 二、基础配置数据（分类 / 标签 / 选项）
-- =============================================================================

INSERT INTO `post_categories` (`key`, `label`, `sort_order`) VALUES
('daily', '修勾日常', 1),
('skill', '技能秀场', 2),
('lost', '寻宠启事', 3),
('walk', '遛狗搭子', 4),
('share', '养宠种草', 5);

INSERT INTO `place_categories` (`key`, `label`, `sort_order`) VALUES
('park', '公园绿地', 1),
('trail', '步道滨河', 2),
('cafe', '宠物餐厅', 3),
('shop', '宠物店', 4),
('hospital', '宠物医院', 5),
('groom', '洗护美容', 6),
('hotel', '宠物住宿', 7),
('playground', '宠物乐园', 8),
('other', '其他', 99);

INSERT INTO `pet_types` (`type_key`, `label`, `sort_order`) VALUES
('dog', '狗狗', 1),
('cat', '猫咪', 2),
('other', '其他', 3);

INSERT INTO `pet_breeds` (`type_id`, `label`, `sort_order`)
SELECT t.id, b.label, b.sort_order FROM (
  SELECT 'dog' AS type_key, '金毛' AS label, 1 AS sort_order UNION ALL
  SELECT 'dog', '哈士奇', 2 UNION ALL SELECT 'dog', '泰迪', 3 UNION ALL
  SELECT 'dog', '柯基', 4 UNION ALL SELECT 'dog', '拉布拉多', 5 UNION ALL
  SELECT 'dog', '柴犬', 6 UNION ALL SELECT 'dog', '萨摩耶', 7 UNION ALL
  SELECT 'dog', '边牧', 8 UNION ALL SELECT 'dog', '阿拉斯加', 9 UNION ALL
  SELECT 'dog', '比熊', 10 UNION ALL SELECT 'dog', '德牧', 11 UNION ALL
  SELECT 'dog', '博美', 12 UNION ALL SELECT 'dog', '英短蓝猫', 13 UNION ALL
  SELECT 'dog', '其他', 99 UNION ALL
  SELECT 'cat', '英短', 1 UNION ALL SELECT 'cat', '美短', 2 UNION ALL
  SELECT 'cat', '布偶', 3 UNION ALL SELECT 'cat', '缅因猫', 4 UNION ALL
  SELECT 'cat', '橘猫', 5 UNION ALL SELECT 'cat', '黑猫', 6 UNION ALL
  SELECT 'cat', '其他', 99 UNION ALL
  SELECT 'other', '兔子', 1 UNION ALL SELECT 'other', '仓鼠', 2 UNION ALL
  SELECT 'other', '龙猫', 3 UNION ALL SELECT 'other', '金丝熊', 4 UNION ALL
  SELECT 'other', '其他', 99
) b
JOIN `pet_types` t ON t.type_key = b.type_key;

INSERT INTO `pet_personality_tags` (`tag_key`, `label`, `sort_order`) VALUES
('active', '活泼', 1),
('gentle', '温顺', 2),
('clingy', '粘人', 3),
('independent', '独立', 4),
('smart', '聪明', 5),
('naughty', '调皮', 6),
('quiet', '安静', 7),
('friendly', '友好', 8);

-- =============================================================================
-- 三、演示数据（用户 / 宠物 / 内容）
-- =============================================================================

-- 密码: 123456
SET @pwd_user = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy';
-- 密码: admin123
SET @pwd_admin = '$2a$10$HhX0b6nlMAA99aJ1GBWOJugn4Weu05nGfR6bOSeksc99BFli79dc2';

INSERT INTO `users` (
  `username`, `phone`, `password`, `avatar`, `signature`, `gender`, `region`,
  `latitude`, `longitude`, `followers_count`, `following_count`, `posts_count`, `pets_count`, `role`
) VALUES
('铲屎官小明', '13800138001', @pwd_user, 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix', '爱猫人士，欢迎交流', 'male', '北京市 朝阳区', 39.916527, 116.397128, 0, 0, 0, 0, 'admin'),
('狗狗妈妈', '13800138002', @pwd_user, 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bella', '金毛控，每天遛狗', 'female', '上海市 浦东新区', 39.926527, 116.407128, 0, 0, 0, 0, 'user'),
('宠物达人', '13800138003', @pwd_user, 'https://api.dicebear.com/7.x/avataaars/svg?seed=Max', '专业宠物训练师', 'male', '广州市 天河区', 39.906527, 116.417128, 0, 0, 0, 0, 'user'),
('猫咪控', '13800138004', @pwd_user, 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mimi', '每天都要吸猫', 'female', '上海市 浦东新区', 39.936527, 116.387128, 0, 0, 0, 0, 'user'),
('哈士奇主人', '13800138005', @pwd_user, 'https://api.dicebear.com/7.x/avataaars/svg?seed=Husky', '拆家小能手的铲屎官', 'male', '广州市 天河区', 39.896527, 116.427128, 0, 0, 0, 0, 'user'),
('仓鼠达人', '13800138006', @pwd_user, 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hamster', '小仓鼠超级可爱', 'female', '深圳市 南山区', 39.946527, 116.377128, 0, 0, 0, 0, 'user'),
('系统管理员', '13800000000', @pwd_admin, NULL, '管理后台专用账号', 'unknown', '北京市', NULL, NULL, 0, 0, 0, 0, 'admin');

INSERT INTO `pets` (
  `user_id`, `name`, `type`, `breed`, `age`, `gender`, `color`, `weight`, `size`,
  `neutered`, `vaccinated`, `health_certificate`, `personality`, `habits`, `description`
) VALUES
(1, '咪咪', 'cat', '英短蓝猫', 12, 'female', '灰色', 3.50, 'small', 1, '猫三联、狂犬', 1, 'gentle,clingy', '喜欢晒太阳', '温顺可爱的小猫咪'),
(1, '旺财', 'dog', '金毛', 24, 'male', '金色', 28.00, 'large', 1, '六联、狂犬', 1, 'active,friendly', '喜欢玩球', '活泼的金毛犬'),
(2, '小白', 'dog', '萨摩耶', 18, 'female', '白色', 22.00, 'medium', 1, '六联、狂犬', 1, 'gentle,friendly', '喜欢撒娇', '微笑天使'),
(2, '大白', 'dog', '萨摩耶', 36, 'male', '白色', 28.00, 'large', 1, '六联、狂犬', 1, 'gentle,quiet', '喜欢散步', '小白的爸爸'),
(3, '豆豆', 'cat', '布偶', 8, 'male', '双色', 4.00, 'medium', 0, '猫三联', 1, 'clingy,smart', '喜欢被抱', '粘人的小可爱'),
(4, '橘座', 'cat', '橘猫', 36, 'male', '橘色', 6.50, 'medium', 1, '猫三联、狂犬', 1, 'quiet,gentle', '特别能吃', '胖胖的橘猫'),
(4, '小黑', 'cat', '黑猫', 12, 'female', '黑色', 3.20, 'small', 0, '猫三联', 0, 'independent,quiet', '喜欢躲猫猫', '神秘的小黑猫'),
(5, '二哈', 'dog', '哈士奇', 18, 'male', '黑白', 22.00, 'medium', 1, '六联、狂犬', 1, 'active,naughty', '精力旺盛', '精力旺盛的拆家王'),
(5, '阿拉', 'dog', '阿拉斯加', 24, 'male', '黑白红', 35.00, 'large', 1, '六联、狂犬', 1, 'gentle,friendly', '喜欢撒娇', '温柔的大个子'),
(6, '团子', 'other', '金丝熊', 6, 'female', '金色', 0.03, 'small', 0, NULL, 0, 'active,friendly', '喜欢跑轮', '圆滚滚的小仓鼠');

INSERT INTO `posts` (`user_id`, `content`, `images`, `category`, `likes_count`, `comments_count`, `shares_count`) VALUES
(1, '今天带咪咪去打疫苗，超级乖！一点都不害怕，护士姐姐都夸她！🐱', '["https://picsum.photos/seed/cat1/400/400"]', 'daily', 3, 2, 2),
(1, '旺财学会了新技能——握手！训练了两周终于成功了，太有成就感了！🐕', '["https://picsum.photos/seed/dog1/400/400"]', 'skill', 4, 3, 4),
(2, '小白今天又露出了招牌微笑，治愈了一整天的疲惫😊', '["https://picsum.photos/seed/samoyed1/400/400", "https://picsum.photos/seed/samoyed2/400/400"]', 'daily', 3, 2, 6),
(3, '训练豆豆使用猫抓板，终于成功了！分享一下训练心得：要有耐心+零食奖励', '["https://picsum.photos/seed/cat2/400/400"]', 'share', 2, 1, 1),
(4, '橘座今天又胖了，医生说要减肥...可是看它可怜巴巴的眼神，我好难啊😭', '["https://picsum.photos/seed/orange1/400/400"]', 'daily', 3, 2, 5),
(5, '二哈又拆家了，沙发再见👋 但是看到它无辜的眼神，又气不起来了', '["https://picsum.photos/seed/husky1/400/400"]', 'daily', 3, 2, 8),
(6, '团子在跑轮上玩得好开心，小短腿跑得飞快🐹', '["https://picsum.photos/seed/hamster1/400/400"]', 'daily', 2, 0, 2),
(2, '今天带大白和小白去公园，父子俩玩得超开心！', '["https://picsum.photos/seed/samoyed3/400/400", "https://picsum.photos/seed/samoyed4/400/400"]', 'walk', 3, 0, 3);

INSERT INTO `post_pets` (`post_id`, `pet_id`) VALUES
(1, 1), (2, 2), (3, 3), (4, 5), (5, 6), (6, 8), (7, 10), (8, 3), (8, 4);

INSERT INTO `follows` (`user_id`, `follow_id`) VALUES
(1, 2), (1, 3), (1, 4),
(2, 1), (2, 3),
(3, 1), (3, 2),
(4, 1), (4, 2), (4, 5),
(5, 4), (5, 6),
(6, 4), (6, 5);

INSERT INTO `likes` (`user_id`, `target_id`, `target_type`) VALUES
(2, 1, 'post'), (3, 1, 'post'), (4, 1, 'post'),
(1, 2, 'post'), (3, 2, 'post'), (4, 2, 'post'), (5, 2, 'post'),
(1, 3, 'post'), (3, 3, 'post'), (4, 3, 'post'),
(1, 4, 'post'), (2, 4, 'post'),
(2, 5, 'post'), (3, 5, 'post'), (5, 5, 'post'),
(1, 6, 'post'), (2, 6, 'post'), (4, 6, 'post'),
(1, 7, 'post'), (2, 7, 'post'),
(1, 8, 'post'), (4, 8, 'post'), (5, 8, 'post');

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

INSERT INTO `messages` (`from_id`, `to_id`, `content`, `type`) VALUES
(1, 2, '你好！你的金毛好可爱', 'text'),
(2, 1, '谢谢！你的英短也很漂亮', 'text'),
(1, 2, '有空一起遛狗呀', 'text'),
(2, 1, '好呀好呀！周末怎么样？', 'text'),
(3, 1, '请问猫咪疫苗在哪里打的？', 'text'),
(1, 3, '在朝阳区的爱心宠物医院', 'text'),
(4, 5, '二哈真的每天都在拆家吗？', 'text'),
(5, 4, '差不多，每天都有新惊喜😂', 'text');

INSERT INTO `places` (
  `name`, `type`, `address`, `latitude`, `longitude`, `description`, `phone`,
  `rating`, `likes`, `likes_count`, `reviews_count`, `business_hours`, `pet_policy`, `amenities`
) VALUES
('朝阳公园', 'park', '北京市朝阳区朝阳公园南路1号', 39.9342000, 116.4739000, '遛狗圣地，有专门的宠物活动区域，环境优美', '010-12345678', 4.5, 120, 89, 45, '06:00-22:00', '宠物可入内，需牵绳', '["停车场", "饮水处", "宠物便袋"]'),
('星巴克宠物友好店', 'cafe', '北京市朝阳区三里屯路19号', 39.9369000, 116.4549000, '宠物可以入内的咖啡店，有专门的宠物菜单', '010-87654321', 4.8, 256, 178, 89, '08:00-22:00', '宠物可入内，提供宠物水碗', '["WiFi", "空调", "宠物水碗", "宠物零食"]'),
('爱心宠物医院', 'hospital', '北京市朝阳区建国路88号', 39.9087000, 116.4716000, '24小时营业的宠物医院，设备先进，服务周到', '010-11111111', 4.6, 89, 67, 34, '24小时', '随时可就诊', '["急诊", "手术", "疫苗", "驱虫", "体检"]'),
('萌宠用品店', 'shop', '北京市朝阳区望京SOHO', 39.9969000, 116.4805000, '宠物用品一站式购物，品种齐全', '010-22222222', 4.3, 45, 34, 23, '10:00-21:00', '宠物可入内', '["停车场", "送货上门"]'),
('奥林匹克森林公园', 'park', '北京市朝阳区科荟路33号', 40.0165000, 116.3972000, '超大的公园，非常适合遛狗，有专门的宠物区域', '010-84900000', 4.5, 180, 145, 67, '06:00-21:00', '宠物可入内，需牵绳', '["停车场", "饮水处", "宠物便袋", "休息区"]'),
('宠物天堂咖啡', 'cafe', '上海市浦东新区陆家嘴环路1000号', 31.2397000, 121.5016000, '可以带宠物的网红咖啡店，环境超好', '021-12345678', 4.8, 320, 234, 112, '09:00-22:00', '宠物可入内，有宠物专属座位', '["WiFi", "空调", "宠物水碗", "宠物蛋糕"]'),
('宠物友好酒店', 'hotel', '成都市武侯区天府大道北段', 30.5728000, 104.0668000, '可以带宠物入住的酒店，服务贴心', '028-22222222', 4.4, 67, 45, 28, '入住14:00，退房12:00', '可携带宠物，需提前告知', '["停车场", "宠物床", "宠物餐"]');

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

INSERT INTO `place_likes` (`place_id`, `user_id`) VALUES
(1, 1), (1, 2), (1, 3), (1, 5),
(2, 1), (2, 4), (2, 5),
(3, 1), (3, 2),
(4, 6),
(5, 2), (5, 3), (5, 5),
(6, 4);

INSERT INTO `notifications` (`user_id`, `from_user_id`, `type`, `title`, `content`, `target_id`, `target_type`, `is_read`) VALUES
(1, 2, 'like', '点赞通知', '赞了你的动态', 1, 'post', 0),
(1, 3, 'comment', '评论通知', '评论了你的动态', 1, 'post', 0),
(1, 4, 'follow', '关注通知', '关注了你', 4, 'user', 1),
(2, 1, 'like', '点赞通知', '赞了你的动态', 3, 'post', 0),
(2, 3, 'comment', '评论通知', '评论了你的动态', 3, 'post', 1),
(3, 1, 'follow', '关注通知', '关注了你', 1, 'user', 0),
(4, 5, 'message', '新消息', '给你发送了一条消息', 5, 'user', 0);

INSERT INTO `guides` (`title`, `content`, `cover`, `pet_type`, `category`, `views_count`, `likes_count`, `favorites_count`) VALUES
('新手养猫指南', '从选猫到日常护理的完整指南。\n\n1. 如何选择健康的猫咪\n2. 新猫到家准备\n3. 饮食注意事项\n4. 疫苗和驱虫\n5. 日常护理', 'https://picsum.photos/seed/guide1/400/300', 'cat', '新手入门', 1250, 89, 156),
('金毛犬训练技巧', '如何训练金毛犬的基本指令。\n\n1. 坐下训练\n2. 握手训练\n3. 召回训练\n4. 随行训练', 'https://picsum.photos/seed/guide2/400/300', 'dog', '训练技巧', 980, 67, 123),
('猫咪绝育全攻略', '详细讲解猫咪绝育的时机、注意事项和术后护理。\n\n1. 绝育的最佳时机\n2. 术前准备\n3. 术后护理\n4. 常见问题', 'https://picsum.photos/seed/guide3/400/300', 'cat', '健康护理', 2100, 156, 289),
('遛狗注意事项', '遛狗时需要注意的安全事项和礼仪。\n\n1. 牵绳的重要性\n2. 便便清理\n3. 与其他狗狗互动\n4. 安全注意事项', 'https://picsum.photos/seed/guide4/400/300', 'dog', '日常护理', 1560, 98, 167),
('猫咪行为解读', '通过猫咪的行为了解它的情绪和需求。\n\n1. 叫声含义\n2. 肢体语言\n3. 行为问题解决', 'https://picsum.photos/seed/guide5/400/300', 'cat', '行为训练', 1890, 134, 234),
('哈士奇饲养指南', '哈士奇是一种精力旺盛的犬种，需要特别的照顾。\n\n1. 运动需求\n2. 饮食建议\n3. 毛发护理\n4. 训练要点', 'https://picsum.photos/seed/guide6/400/300', 'dog', '新手入门', 890, 78, 112);

-- =============================================================================
-- 四、统计字段对齐
-- =============================================================================

UPDATE `users` u SET
  `posts_count` = (SELECT COUNT(*) FROM `posts` p WHERE p.user_id = u.id AND p.status = 1),
  `pets_count` = (SELECT COUNT(*) FROM `pets` p WHERE p.user_id = u.id AND p.status = 1),
  `following_count` = (SELECT COUNT(*) FROM `follows` f WHERE f.user_id = u.id),
  `followers_count` = (SELECT COUNT(*) FROM `follows` f WHERE f.follow_id = u.id);

UPDATE `posts` p SET
  `likes_count` = (SELECT COUNT(*) FROM `likes` l WHERE l.target_id = p.id AND l.target_type = 'post'),
  `comments_count` = (SELECT COUNT(*) FROM `comments` c WHERE c.post_id = p.id AND c.status = 1);

SET FOREIGN_KEY_CHECKS = 1;

SELECT 'pet_community 初始化完成' AS message;
