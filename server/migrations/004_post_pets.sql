-- 动态与宠物关联表（多对多，一条动态可关联多只主角宠物）
CREATE TABLE IF NOT EXISTS `post_pets` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '关联ID',
  `post_id` BIGINT UNSIGNED NOT NULL COMMENT '动态ID',
  `pet_id` BIGINT UNSIGNED NOT NULL COMMENT '宠物ID',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_post_pet` (`post_id`, `pet_id`),
  KEY `idx_post_id` (`post_id`),
  KEY `idx_pet_id` (`pet_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='动态关联宠物表';
