const crypto = require('crypto')
const { query } = require('../config/db')
const { getRedisClient } = require('../config/redis')

const memoryBlacklist = new Map()

function newJti() {
  return crypto.randomUUID?.() || crypto.randomBytes(16).toString('hex')
}

async function blacklistToken(jti, expiresAt) {
  if (!jti) return
  const exp = expiresAt instanceof Date ? expiresAt : new Date(expiresAt)

  memoryBlacklist.set(jti, exp.getTime())

  try {
    await query(
      'INSERT INTO token_blacklist (jti, expires_at) VALUES (?, ?)',
      [jti, exp],
    )
  } catch (err) {
    if (err.code !== 'ER_NO_SUCH_TABLE') throw err
  }

  try {
    const redis = await getRedisClient()
    if (redis) {
      const ttlSec = Math.max(1, Math.ceil((exp.getTime() - Date.now()) / 1000))
      await redis.setEx(`jwt:blacklist:${jti}`, ttlSec, '1')
    }
  } catch {
    /* ignore */
  }
}

async function isTokenBlacklisted(jti) {
  if (!jti) return false

  const memExp = memoryBlacklist.get(jti)
  if (memExp) {
    if (memExp > Date.now()) return true
    memoryBlacklist.delete(jti)
  }

  try {
    const redis = await getRedisClient()
    if (redis) {
      const hit = await redis.get(`jwt:blacklist:${jti}`)
      if (hit) return true
    }
  } catch {
    /* ignore */
  }

  try {
    const rows = await query(
      'SELECT jti FROM token_blacklist WHERE jti = ? AND expires_at > NOW() LIMIT 1',
      [jti],
    )
    return rows.length > 0
  } catch (err) {
    if (err.code === 'ER_NO_SUCH_TABLE') return false
    throw err
  }
}

/** 定期清理过期记录（启动时调用一次） */
async function purgeExpiredBlacklist() {
  try {
    await query('DELETE FROM token_blacklist WHERE expires_at <= NOW()')
  } catch (err) {
    if (err.code !== 'ER_NO_SUCH_TABLE') console.warn('purge blacklist:', err.message)
  }
}

module.exports = {
  newJti,
  blacklistToken,
  isTokenBlacklisted,
  purgeExpiredBlacklist,
}
