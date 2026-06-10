const path = require('path')
const whitelist = require('./public-api-whitelist.json')

/** 按路径段数从长到短，避免 /api/post 误匹配 /api/post/categories */
const sortedRoutes = [...whitelist.routes].sort(
  (a, b) => b.pattern.split('/').length - a.pattern.split('/').length,
)

function splitPath(urlPath) {
  return urlPath.split('?')[0].replace(/\/+$/, '').split('/').filter(Boolean)
}

function matchPattern(pattern, urlPath) {
  const patternParts = splitPath(pattern)
  const pathParts = splitPath(urlPath)
  if (patternParts.length !== pathParts.length) return false
  for (let i = 0; i < patternParts.length; i += 1) {
    const seg = patternParts[i]
    if (seg.startsWith(':')) continue
    if (seg !== pathParts[i]) return false
  }
  return true
}

/**
 * @param {string} method HTTP 方法
 * @param {string} apiPath 完整路径，如 /api/post/12
 */
function isPublicApi(method, apiPath) {
  const normalizedMethod = (method || 'GET').toUpperCase()
  const normalizedPath = apiPath.split('?')[0].replace(/\/+$/, '') || '/'
  return sortedRoutes.some(
    (route) =>
      route.method.toUpperCase() === normalizedMethod &&
      matchPattern(route.pattern, normalizedPath),
  )
}

/** 小程序 request url 为 /post/1 → 规范为 /api/post/1 */
function normalizeClientApiPath(urlPath) {
  const p = urlPath.split('?')[0]
  if (p.startsWith('/api/')) return p.replace(/\/+$/, '') || '/api'
  return (`/api${p.startsWith('/') ? '' : '/'}${p}`).replace(/\/+$/, '') || '/api'
}

function listPublicRoutes() {
  return whitelist.routes
}

module.exports = {
  whitelist,
  isPublicApi,
  normalizeClientApiPath,
  matchPattern,
  listPublicRoutes,
}
