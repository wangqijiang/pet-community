-- 宠物种类
CREATE TABLE IF NOT EXISTS `pet_types` (
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

-- 宠物品种
CREATE TABLE IF NOT EXISTS `pet_breeds` (
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

-- 性格标签
CREATE TABLE IF NOT EXISTS `pet_personality_tags` (
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
  SELECT 'dog', '博美', 12 UNION ALL SELECT 'dog', '其他', 99 UNION ALL
  SELECT 'cat', '英短', 1 UNION ALL SELECT 'cat', '美短', 2 UNION ALL
  SELECT 'cat', '布偶', 3 UNION ALL SELECT 'cat', '缅因猫', 4 UNION ALL
  SELECT 'cat', '其他', 99 UNION ALL
  SELECT 'other', '兔子', 1 UNION ALL SELECT 'other', '仓鼠', 2 UNION ALL
  SELECT 'other', '龙猫', 3 UNION ALL SELECT 'other', '其他', 99
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
