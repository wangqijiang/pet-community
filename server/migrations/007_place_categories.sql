-- 场所分类表
CREATE TABLE IF NOT EXISTS `place_categories` (
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

-- 放宽 type 字段，改为与分类表 key 对应
ALTER TABLE `places`
  MODIFY COLUMN `type` VARCHAR(50) NOT NULL COMMENT '场所分类key';

-- 确保现有数据分类正确（测试数据已匹配 park/cafe/hospital/shop/hotel）
UPDATE `places` SET `type` = 'park' WHERE `name` IN ('朝阳公园', '奥林匹克森林公园');
UPDATE `places` SET `type` = 'cafe' WHERE `name` IN ('星巴克宠物友好店', '宠物天堂咖啡');
UPDATE `places` SET `type` = 'hospital' WHERE `name` = '爱心宠物医院';
UPDATE `places` SET `type` = 'shop' WHERE `name` = '萌宠用品店';
UPDATE `places` SET `type` = 'hotel' WHERE `name` = '宠物友好酒店';
