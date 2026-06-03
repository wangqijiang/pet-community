-- 双登录：微信 openid + 可空手机号
-- 执行：mysql -u root -p pet_community < server/scripts/migrate-auth-openid.sql

ALTER TABLE `users`
  ADD COLUMN `openid` VARCHAR(64) DEFAULT NULL COMMENT '微信openid' AFTER `phone`;

ALTER TABLE `users`
  MODIFY COLUMN `phone` VARCHAR(20) NULL COMMENT '手机号，微信用户未绑定时为空';

ALTER TABLE `users`
  ADD UNIQUE KEY `uk_openid` (`openid`);
