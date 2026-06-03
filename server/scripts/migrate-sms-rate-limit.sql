-- 短信发送频率限制（按手机号冷却）
CREATE TABLE IF NOT EXISTS `sms_send_records` (
  `phone` VARCHAR(20) NOT NULL COMMENT '手机号',
  `last_sent_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '上次发送时间',
  PRIMARY KEY (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='短信发送冷却记录';
