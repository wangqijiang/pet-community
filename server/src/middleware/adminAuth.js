const { verify } = require('../utils/jwt')
const { query } = require('../config/db')
const { error } = require('../utils/response')
const { isTokenBlacklisted } = require('../utils/tokenBlacklist')
const { logAdminAction } = require('./adminAudit')

const adminAuth = async (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) {
    return res.status(401).json(error('请先登录管理后台', 401))
  }

  const decoded = verify(token)
  if (!decoded?.id) {
    return res.status(401).json(error('登录已过期', 401))
  }

  if (decoded.jti && (await isTokenBlacklisted(decoded.jti))) {
    return res.status(401).json(error('登录已失效', 401))
  }

  try {
    const rows = await query(
      'SELECT id, username, phone, avatar, role, status FROM users WHERE id = ?',
      [decoded.id]
    )
    const user = rows[0]
    if (!user || user.role !== 'admin') {
      return res.status(403).json(error('无管理权限', 403))
    }
    if (user.status !== 1) {
      return res.status(403).json(error('管理员账号已禁用', 403))
    }
    req.admin = user

    if (!['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
      const originalJson = res.json.bind(res)
      res.json = (payload) => {
        if (payload && payload.success !== false) {
          void logAdminAction(
            req,
            `${req.method} ${req.originalUrl}`,
            'admin',
            req.params?.id,
            { path: req.path },
          )
        }
        return originalJson(payload)
      }
    }

    next()
  } catch (err) {
    console.error('adminAuth:', err)
    res.status(500).json(error('鉴权失败', 500))
  }
}

module.exports = { adminAuth }
