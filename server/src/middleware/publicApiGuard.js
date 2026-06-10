const { verify } = require('../utils/jwt')
const { unauthorized } = require('../utils/authError')
const { isPublicApi } = require('../../../shared/publicApiMatcher')

function hasValidToken(req) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) return false
  return !!verify(token)
}

/**
 * 后端第二层防护：未登录且不在白名单 → 401
 * 已登录（有效 token）或白名单接口 → 放行，具体权限由路由 auth / optionalAuth 负责
 */
function publicApiGuard(req, res, next) {
  if (req.method === 'OPTIONS') return next()

  const fullPath = req.originalUrl.split('?')[0].replace(/\/+$/, '') || '/'

  if (hasValidToken(req)) return next()
  if (isPublicApi(req.method, fullPath)) return next()

  return unauthorized(res, '请先登录')
}

module.exports = { publicApiGuard, hasValidToken }
