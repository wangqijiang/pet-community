const { transaction } = require("../config/db");

/**
 * 账号合并：source → target（target 为当前操作绑定的主账号）
 *
 * 合并后 source 账号禁用；业务数据迁入 target，并对关注/消息/通知等做去重。
 */
async function mergeUsers(targetUserId, sourceUserId) {
  if (!targetUserId || !sourceUserId) return;
  if (targetUserId === sourceUserId) return;

  await transaction(async (conn) => {
    // 1) 迁移业务数据归属
    await conn.query("UPDATE pets SET user_id = ? WHERE user_id = ?", [
      targetUserId,
      sourceUserId,
    ]);
    await conn.query("UPDATE posts SET user_id = ? WHERE user_id = ?", [
      targetUserId,
      sourceUserId,
    ]);
    await conn.query("UPDATE comments SET user_id = ? WHERE user_id = ?", [
      targetUserId,
      sourceUserId,
    ]);
    await conn.query(
      "UPDATE comments SET reply_to_user_id = ? WHERE reply_to_user_id = ?",
      [targetUserId, sourceUserId],
    );

    await conn.query("UPDATE likes SET user_id = ? WHERE user_id = ?", [
      targetUserId,
      sourceUserId,
    ]);
    await conn.query(
      "UPDATE place_reviews SET user_id = ? WHERE user_id = ?",
      [targetUserId, sourceUserId],
    );
    await conn.query(
      "UPDATE place_likes SET user_id = ? WHERE user_id = ?",
      [targetUserId, sourceUserId],
    );
    await conn.query(
      "UPDATE favorites SET user_id = ? WHERE user_id = ?",
      [targetUserId, sourceUserId],
    );

    await conn.query("UPDATE follows SET user_id = ? WHERE user_id = ?", [
      targetUserId,
      sourceUserId,
    ]);
    await conn.query("UPDATE follows SET follow_id = ? WHERE follow_id = ?", [
      targetUserId,
      sourceUserId,
    ]);

    await conn.query(
      "UPDATE notifications SET user_id = ? WHERE user_id = ?",
      [targetUserId, sourceUserId],
    );
    await conn.query(
      "UPDATE notifications SET from_user_id = ? WHERE from_user_id = ?",
      [targetUserId, sourceUserId],
    );
    await conn.query(
      "UPDATE messages SET from_id = ? WHERE from_id = ?",
      [targetUserId, sourceUserId],
    );
    await conn.query("UPDATE messages SET to_id = ? WHERE to_id = ?", [
      targetUserId,
      sourceUserId,
    ]);

    await conn.query("UPDATE ai_chats SET user_id = ? WHERE user_id = ?", [
      targetUserId,
      sourceUserId,
    ]);
    await conn.query("UPDATE guides SET author_id = ? WHERE author_id = ?", [
      targetUserId,
      sourceUserId,
    ]);

    // 2) 去重与清理
    await dedupeMergeData(conn, targetUserId);

    // 3) 重算主账号统计字段（避免关注/粉丝数缓存不准）
    await recalcUserStats(conn, targetUserId);

    // 4) 禁用 source，避免再次登录
    await conn.query(
      "UPDATE users SET phone = NULL, openid = NULL, status = 0, updated_at = NOW() WHERE id = ?",
      [sourceUserId],
    );
  });
}

/** 合并后去重：关注、点赞、收藏、消息、通知等 */
async function dedupeMergeData(conn, userId) {
  // 自己关注自己（合并两账号互关/自指后产生）
  await conn.query(
    "DELETE FROM follows WHERE user_id = ? AND follow_id = ?",
    [userId, userId],
  );

  // likes: uk_user_target
  await conn.query(
    `DELETE l1 FROM likes l1
     INNER JOIN likes l2
       ON l1.user_id = l2.user_id
      AND l1.target_id = l2.target_id
      AND l1.target_type = l2.target_type
      AND l1.id > l2.id
     WHERE l1.user_id = ?`,
    [userId],
  );

  // favorites: uk_user_target
  await conn.query(
    `DELETE f1 FROM favorites f1
     INNER JOIN favorites f2
       ON f1.user_id = f2.user_id
      AND f1.target_id = f2.target_id
      AND f1.target_type = f2.target_type
      AND f1.id > f2.id
     WHERE f1.user_id = ?`,
    [userId],
  );

  // place_likes: uk_place_user
  await conn.query(
    `DELETE pl1 FROM place_likes pl1
     INNER JOIN place_likes pl2
       ON pl1.place_id = pl2.place_id
      AND pl1.user_id = pl2.user_id
      AND pl1.id > pl2.id
     WHERE pl1.user_id = ?`,
    [userId],
  );

  // follows: uk_follow（我关注的 / 关注我的 两侧更新后都可能重复）
  await conn.query(
    `DELETE fo1 FROM follows fo1
     INNER JOIN follows fo2
       ON fo1.user_id = fo2.user_id
      AND fo1.follow_id = fo2.follow_id
      AND fo1.id > fo2.id
     WHERE fo1.user_id = ? OR fo1.follow_id = ?`,
    [userId, userId],
  );

  // place_reviews: 同地点重复评价，保留较新一条
  await conn.query(
    `DELETE pr1 FROM place_reviews pr1
     INNER JOIN place_reviews pr2
       ON pr1.place_id = pr2.place_id
      AND pr1.user_id = pr2.user_id
      AND pr1.id < pr2.id
     WHERE pr1.user_id = ?`,
    [userId],
  );

  // 两账号互聊记录合并后会产生「自己给自己发消息」
  await conn.query(
    "DELETE FROM messages WHERE from_id = ? AND to_id = ?",
    [userId, userId],
  );

  // 通知去重：同接收人 + 类型 + 来源 + 目标 视为重复，保留较早一条
  await conn.query(
    `DELETE n1 FROM notifications n1
     INNER JOIN notifications n2
       ON n1.user_id = n2.user_id
      AND n1.type = n2.type
      AND COALESCE(n1.from_user_id, 0) = COALESCE(n2.from_user_id, 0)
      AND COALESCE(n1.target_id, 0) = COALESCE(n2.target_id, 0)
      AND COALESCE(n1.target_type, '') = COALESCE(n2.target_type, '')
      AND n1.id > n2.id
     WHERE n1.user_id = ?`,
    [userId],
  );
}

/** 按实际数据重算 users 表缓存计数 */
async function recalcUserStats(conn, userId) {
  await conn.query(
    `UPDATE users SET
      posts_count = (SELECT COUNT(*) FROM posts WHERE user_id = ? AND status = 1),
      pets_count = (SELECT COUNT(*) FROM pets WHERE user_id = ? AND status = 1),
      following_count = (SELECT COUNT(*) FROM follows WHERE user_id = ?),
      followers_count = (SELECT COUNT(*) FROM follows WHERE follow_id = ?),
      updated_at = NOW()
     WHERE id = ?`,
    [userId, userId, userId, userId, userId],
  );
}

module.exports = {
  mergeUsers,
};
