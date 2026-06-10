const { verify } = require('../utils/jwt')
const { query } = require('../config/db')
const { unauthorized } = require('../utils/authError')
const { isTokenBlacklisted } = require('../utils/tokenBlacklist')

async function rejectIfBlacklisted(decoded, res) {
  if (!decoded?.jti) return false
  const blocked = await isTokenBlacklisted(decoded.jti)
  if (blocked) {
    unauthorized(res, '登录已失效，请重新登录')
    return true
  }
  return false
}

const auth = async (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '')

  if (!token) {
    return unauthorized(res, '请先登录')
  }

  const decoded = verify(token)
  if (!decoded) {
    return unauthorized(res, '登录已过期，请重新登录')
  }

  if (await rejectIfBlacklisted(decoded, res)) return

  const user = await query(
    'SELECT id, username, avatar, phone, created_at FROM users WHERE id = ? AND status = 1',
    [decoded.id],
  )
  if (!user || user.length === 0) {
    return unauthorized(res, '用户不存在或已被禁用，请重新登录')
  }

  req.user = user[0]
  req.tokenJti = decoded.jti
  next()
}

/** 有 token 则解析用户，无 token 不拦截（用于列表附带点赞状态等） */
const optionalAuth = async (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '')

  if (!token) {
    req.user = null
    return next()
  }

  const decoded = verify(token)
  if (!decoded) {
    req.user = null
    return next()
  }

  if (decoded.jti && (await isTokenBlacklisted(decoded.jti))) {
    req.user = null
    return next()
  }

  try {
    const user = await query(
      'SELECT id, username, avatar, phone, created_at FROM users WHERE id = ? AND status = 1',
      [decoded.id],
    )
    req.user = user?.[0] || null
    if (req.user) req.tokenJti = decoded.jti
  } catch {
    req.user = null
  }
  next()
}

module.exports = { auth, optionalAuth }
