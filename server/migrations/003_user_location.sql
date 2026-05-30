-- 用户地理位置（同城狗友地图）
ALTER TABLE `users`
  ADD COLUMN `latitude` DECIMAL(10,7) DEFAULT NULL COMMENT '纬度' AFTER `region`,
  ADD COLUMN `longitude` DECIMAL(10,7) DEFAULT NULL COMMENT '经度' AFTER `latitude`;

-- 验证码表（开发/生产可切换为 Redis）
CREATE TABLE IF NOT EXISTS `sms_codes` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `phone` VARCHAR(20) NOT NULL,
  `code` VARCHAR(10) NOT NULL,
  `expires_at` TIMESTAMP NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_phone` (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='短信验证码';

-- 测试用户坐标（北京朝阳附近）
UPDATE `users` SET `latitude` = 39.916527, `longitude` = 116.397128 WHERE `id` = 1;
UPDATE `users` SET `latitude` = 39.926527, `longitude` = 116.407128 WHERE `id` = 2;
UPDATE `users` SET `latitude` = 39.906527, `longitude` = 116.417128 WHERE `id` = 3;
UPDATE `users` SET `latitude` = 39.936527, `longitude` = 116.387128 WHERE `id` = 4;
UPDATE `users` SET `latitude` = 39.896527, `longitude` = 116.427128 WHERE `id` = 5;
UPDATE `users` SET `latitude` = 39.946527, `longitude` = 116.377128 WHERE `id` = 6;
