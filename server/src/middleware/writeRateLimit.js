const { buildRateLimiter } = require('../utils/rateLimitStore')

/** 按用户 ID 限流写操作 */
function userWriteLimiter(keyPrefix, max, windowMs) {
  return buildRateLimiter({
    windowMs,
    max,
    keyPrefix,
    keyFn: (req) => String(req.user?.id || 'anon'),
  })
}

const postCreateLimiter = userWriteLimiter('write:post', 10, 60 * 60 * 1000)
const commentCreateLimiter = userWriteLimiter('write:comment', 30, 60 * 60 * 1000)
const messageSendLimiter = userWriteLimiter('write:message', 60, 60 * 60 * 1000)
const petCreateLimiter = userWriteLimiter('write:pet', 5, 60 * 60 * 1000)
const reviewCreateLimiter = userWriteLimiter('write:review', 10, 60 * 60 * 1000)
const aiChatLimiter = userWriteLimiter('write:ai', 30, 60 * 60 * 1000)
const followActionLimiter = userWriteLimiter('write:follow', 30, 60 * 60 * 1000)

module.exports = {
  userWriteLimiter,
  postCreateLimiter,
  commentCreateLimiter,
  messageSendLimiter,
  petCreateLimiter,
  reviewCreateLimiter,
  aiChatLimiter,
  followActionLimiter,
}
