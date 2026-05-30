const { verify } = require('../utils/jwt')
const { error } = require('../utils/response')
const { query } = require('../config/db')

const auth = async (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '')
  
  if (!token) {
    return res.status(401).json(error('请先登录', 401))
  }

  const decoded = verify(token)
  if (!decoded) {
    return res.status(401).json(error('token无效或已过期', 401))
  }

  const user = await query('SELECT id, username, avatar, phone FROM users WHERE id = ?', [decoded.id])
  if (!user || user.length === 0) {
    return res.status(401).json(error('用户不存在', 401))
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
