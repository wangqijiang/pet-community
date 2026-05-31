-- 动态分类表
CREATE TABLE IF NOT EXISTS `post_categories` (
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

INSERT INTO `post_categories` (`key`, `label`, `sort_order`) VALUES
('daily', '修勾日常', 1),
('skill', '技能秀场', 2),
('lost', '寻宠启事', 3),
('walk', '遛狗搭子', 4),
('share', '养宠种草', 5);

-- 动态表增加分类字段
ALTER TABLE `posts`
  ADD COLUMN `category` VARCHAR(50) DEFAULT NULL COMMENT '分类key' AFTER `images`,
  ADD KEY `idx_category` (`category`);
