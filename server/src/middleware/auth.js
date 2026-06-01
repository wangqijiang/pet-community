const { verify } = require('../utils/jwt')
const { query } = require('../config/db')
const { unauthorized } = require('../utils/authError')

const auth = async (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '')
  
  if (!token) {
    return unauthorized(res, '请先登录')
  }

  const decoded = verify(token)
  if (!decoded) {
    return unauthorized(res, '登录已过期，请重新登录')
  }

  const user = await query('SELECT id, username, avatar, phone FROM users WHERE id = ?', [decoded.id])
  if (!user || user.length === 0) {
    return unauthorized(res, '用户不存在，请重新登录')
  }

  req.user = user[0]
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

  try {
    const user = await query('SELECT id, username, avatar, phone FROM users WHERE id = ?', [decoded.id])
    req.user = user?.[0] || null
  } catch {
    req.user = null
  }
  next()
}

module.exports = { auth, optionalAuth }
