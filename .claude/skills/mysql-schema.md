---
skill: mysql-schema
description: 生成 MySQL 数据库表结构和迁移脚本
tags: [mysql, database, schema, migration]
---

# MySQL 数据库设计器

生成规范的 MySQL 表结构、索引和迁移脚本。

## 使用方式

```
/mysql-schema TableName [fields]
```

## 功能

1. 创建表结构 SQL
2. 添加索引和外键
3. 生成迁移脚本（up/down）
4. 包含常用字段（id, created_at, updated_at）
5. 字段类型优化
6. 注释完整

## 示例

创建宠物表：
```
/mysql-schema pets
```

生成的迁移文件：

**migrations/20260513_create_pets_table.sql**
```sql
-- ============================================
-- 宠物表
-- ============================================

-- 创建表
CREATE TABLE IF NOT EXISTS `pets` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
  `name` VARCHAR(50) NOT NULL COMMENT '宠物名称',
  `type` VARCHAR(20) NOT NULL COMMENT '宠物类型（dog/cat/bird等）',
  `breed` VARCHAR(50) DEFAULT NULL COMMENT '品种',
  `age` INT UNSIGNED DEFAULT 0 COMMENT '年龄（月）',
  `gender` ENUM('male', 'female', 'unknown') DEFAULT 'unknown' COMMENT '性别',
  `avatar` VARCHAR(255) DEFAULT NULL COMMENT '头像URL',
  `description` TEXT COMMENT '描述',
  `weight` DECIMAL(5,2) DEFAULT NULL COMMENT '体重（kg）',
  `status` TINYINT UNSIGNED DEFAULT 1 COMMENT '状态（1正常 2已领养 3已丢失 0已删除）',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_type` (`type`),
  KEY `idx_status` (`status`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='宠物信息表';

-- 创建宠物照片表
CREATE TABLE IF NOT EXISTS `pet_photos` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `pet_id` BIGINT UNSIGNED NOT NULL COMMENT '宠物ID',
  `photo_url` VARCHAR(255) NOT NULL COMMENT '照片URL',
  `is_cover` TINYINT UNSIGNED DEFAULT 0 COMMENT '是否封面（1是 0否）',
  `sort_order` INT UNSIGNED DEFAULT 0 COMMENT '排序',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_pet_id` (`pet_id`),
  CONSTRAINT `fk_pet_photos_pet_id` FOREIGN KEY (`pet_id`) REFERENCES `pets` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='宠物照片表';

-- 插入测试数据
INSERT INTO `pets` (`user_id`, `name`, `type`, `breed`, `age`, `gender`, `description`) VALUES
(1, '旺财', 'dog', '金毛', 24, 'male', '活泼可爱的金毛犬'),
(1, '咪咪', 'cat', '英短', 12, 'female', '温顺的小猫咪');
```

**migrations/rollback/20260513_drop_pets_table.sql**
```sql
-- 回滚：删除宠物相关表
DROP TABLE IF EXISTS `pet_photos`;
DROP TABLE IF EXISTS `pets`;
```

**models/Pet.js** (Sequelize ORM 模型)
```javascript
const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Pet = sequelize.define('Pet', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    field: 'user_id'
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  type: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  breed: {
    type: DataTypes.STRING(50)
  },
  age: {
    type: DataTypes.INTEGER.UNSIGNED,
    defaultValue: 0
  },
  gender: {
    type: DataTypes.ENUM('male', 'female', 'unknown'),
    defaultValue: 'unknown'
  },
  avatar: {
    type: DataTypes.STRING(255)
  },
  description: {
    type: DataTypes.TEXT
  },
  weight: {
    type: DataTypes.DECIMAL(5, 2)
  },
  status: {
    type: DataTypes.TINYINT.UNSIGNED,
    defaultValue: 1
  }
}, {
  tableName: 'pets',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
})

module.exports = Pet
```
