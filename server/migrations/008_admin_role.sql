-- 管理后台：用户角色
ALTER TABLE `users`
  ADD COLUMN `role` ENUM('user', 'admin') NOT NULL DEFAULT 'user' COMMENT '角色' AFTER `status`;

-- 将首个测试账号设为管理员（密码仍为迁移数据中的 123456）
UPDATE `users` SET `role` = 'admin' WHERE `phone` = '13800138001' LIMIT 1;
