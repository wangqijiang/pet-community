const { getRedisClient } = require('../config/redis')

/** 内存 fallback（单实例） */
const memoryBuckets = new Map()

function pruneMemory(key, windowMs) {
  const bucket = memoryBuckets.get(key)
  if (!bucket) return { count: 0 }
  const cutoff = Date.now() - windowMs
  bucket.timestamps = bucket.timestamps.filter((t) => t > cutoff)
  memoryBuckets.set(key, bucket)
  return { count: bucket.timestamps.length }
}

async function incrementSliding(key, windowMs, max) {
  const windowSec = Math.ceil(windowMs / 1000)

  try {
    const redis = await getRedisClient()
    if (redis) {
      const count = await redis.incr(key)
      if (count === 1) {
        await redis.expire(key, windowSec)
      }
      const ttl = await redis.ttl(key)
      if (count > max) {
        return { allowed: false, retryAfterSec: Math.max(1, ttl) }
      }
      return { allowed: true, count }
    }
  } catch (err) {
    console.warn('rateLimitStore redis fallback:', err.message)
  }

  let bucket = memoryBuckets.get(key)
  if (!bucket) {
    bucket = { timestamps: [] }
    memoryBuckets.set(key, bucket)
  }
  pruneMemory(key, windowMs)
  if (bucket.timestamps.length >= max) {
    const retryAfterSec = Math.max(
      1,
      Math.ceil((bucket.timestamps[0] + windowMs - Date.now()) / 1000),
    )
    return { allowed: false, retryAfterSec }
  }
  bucket.timestamps.push(Date.now())
  return { allowed: true, count: bucket.timestamps.length }
}

function rejectRateLimit(res, retryAfterSec, message) {
  res.set('Retry-After', String(retryAfterSec))
  return res.status(429).json({
    success: false,
    message: message || `请求过于频繁，请${retryAfterSec}秒后再试`,
    code: 429,
  })
}

/**
 * @param {{ windowMs: number, max: number, keyPrefix: string, keyFn?: (req) => string }} opts
 */
function buildRateLimiter(opts) {
  const { windowMs, max, keyPrefix, keyFn } = opts
  return async (req, res, next) => {
    const ip =
      req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
      req.ip ||
      req.socket?.remoteAddress ||
      'unknown'
    const suffix = keyFn ? keyFn(req) : ''
    const key = `rl:${keyPrefix}:${ip}:${suffix}`

    try {
      const result = await incrementSliding(key, windowMs, max)
      if (!result.allowed) {
        return rejectRateLimit(res, result.retryAfterSec)
      }
      next()
    } catch (err) {
      console.error('rateLimiter error:', err)
      next()
    }
  }
}

module.exports = {
  incrementSliding,
  rejectRateLimit,
  buildRateLimiter,
}
