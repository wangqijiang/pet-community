-- 将 users 表中的 posts_count / pets_count 与真实数据对齐（修复测试数据初始值偏差）
UPDATE users u
SET posts_count = (
  SELECT COUNT(*) FROM posts p WHERE p.user_id = u.id AND p.status = 1
);

UPDATE users u
SET pets_count = (
  SELECT COUNT(*) FROM pets p WHERE p.user_id = u.id AND p.status = 1
);
