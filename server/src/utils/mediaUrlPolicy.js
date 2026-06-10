const { buildPublicUrl } = require('./aliOss')

function getAllowedMediaHosts() {
  const hosts = new Set()

  const extra = process.env.MEDIA_ALLOWED_HOSTS
  if (extra) {
    extra.split(',').forEach((h) => {
      const t = h.trim().toLowerCase()
      if (t) hosts.add(t)
    })
  }

  const publicBase = process.env.PUBLIC_BASE_URL
  if (publicBase) {
    try {
      hosts.add(new URL(publicBase).host.toLowerCase())
    } catch {
      /* ignore */
    }
  }

  const bucket = process.env.OSS_BUCKET_NAME
  const endpoint = process.env.OSS_ENDPOINT
  if (bucket && endpoint) {
    const ep = endpoint.replace(/^https?:\/\//, '').replace(/\/$/, '')
    hosts.add(`${bucket}.${ep}`.toLowerCase())
    hosts.add(ep.toLowerCase())
  }

  return hosts
}

function isAllowedMediaUrl(url) {
  if (url == null || url === '') return true
  const str = String(url).trim()

  if (str.startsWith('/uploads/') || str.startsWith('/static/')) {
    return process.env.NODE_ENV !== 'production' || process.env.ALLOW_LOCAL_MEDIA_URLS === '1'
  }

  if (!/^https?:\/\/.+/i.test(str)) return false

  if (process.env.STRICT_MEDIA_URLS !== '1') {
    return true
  }

  try {
    const host = new URL(str).host.toLowerCase()
    const allowed = getAllowedMediaHosts()
    if (allowed.size === 0) return false
    return allowed.has(host)
  } catch {
    return false
  }
}

function validateMediaUrlPolicy(url) {
  if (isAllowedMediaUrl(url)) return null
  if (process.env.STRICT_MEDIA_URLS === '1') {
    return '图片地址不在允许的域名内'
  }
  return '图片地址格式不正确'
}

module.exports = {
  getAllowedMediaHosts,
  isAllowedMediaUrl,
  validateMediaUrlPolicy,
}
