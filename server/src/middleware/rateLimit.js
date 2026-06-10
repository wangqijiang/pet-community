/**
 * 轻量内存 rate limit（单实例有效；多实例部署建议换 Redis 方案）
 */

const buckets = new Map()

function pruneBucket(bucket, windowMs) {
  const cutoff = Date.now() - windowMs
  bucket.timestamps = bucket.timestamps.filter((t) => t > cutoff)
}

function createRateLimiter({ windowMs = 60_000, max = 10, keyPrefix = 'rl' }) {
  return (req, res, next) => {
    const ip =
      req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
      req.ip ||
      req.socket?.remoteAddress ||
      'unknown'

    const bodyKey =
      req.body?.phone ||
      req.body?.loginCode ||
      req.params?.phone ||
      ''
    const key = `${keyPrefix}:${ip}:${bodyKey}`

    let bucket = buckets.get(key)
    if (!bucket) {
      bucket = { timestamps: [] }
      buckets.set(key, bucket)
    }

    pruneBucket(bucket, windowMs)

    if (bucket.timestamps.length >= max) {
      const retryAfterSec = Math.max(
        1,
        Math.ceil((bucket.timestamps[0] + windowMs - Date.now()) / 1000),
      )
      res.set('Retry-After', String(retryAfterSec))
      return res.status(429).json({
        success: false,
        message: `请求过于频繁，请${retryAfterSec}秒后再试`,
        code: 429,
      })
    }

    bucket.timestamps.push(Date.now())
    next()
  }
}

/** 登录 / 验证码：每 IP+手机号 5 次/分钟 */
const authLoginLimiter = createRateLimiter({
  windowMs: 60_000,
  max: 5,
  keyPrefix: 'auth-login',
})

/** 发送验证码：每 IP+手机号 3 次/分钟（与 DB 间隔限流叠加） */
const sendCodeLimiter = createRateLimiter({
  windowMs: 60_000,
  max: 3,
  keyPrefix: 'send-code',
})

/** 管理端登录：每 IP 10 次/15 分钟 */
const adminLoginLimiter = createRateLimiter({
  windowMs: 15 * 60_000,
  max: 10,
  keyPrefix: 'admin-login',
})

module.exports = {
  createRateLimiter,
  authLoginLimiter,
  sendCodeLimiter,
  adminLoginLimiter,
}
