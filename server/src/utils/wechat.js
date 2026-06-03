const https = require('https')

let cachedAccessToken = null
let tokenExpiresAt = 0

function httpsRequest(url, method = 'GET', body) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url)
    const payload = body ? JSON.stringify(body) : null
    const req = https.request(
      {
        hostname: parsed.hostname,
        path: `${parsed.pathname}${parsed.search}`,
        method,
        headers: payload
          ? {
              'Content-Type': 'application/json',
              'Content-Length': Buffer.byteLength(payload),
            }
          : undefined,
      },
      (res) => {
        let data = ''
        res.on('data', (chunk) => {
          data += chunk
        })
        res.on('end', () => {
          try {
            resolve(JSON.parse(data))
          } catch (err) {
            reject(err)
          }
        })
      }
    )
    req.on('error', reject)
    if (payload) req.write(payload)
    req.end()
  })
}

async function getAccessToken(appId, appSecret) {
  if (cachedAccessToken && Date.now() < tokenExpiresAt) {
    return cachedAccessToken
  }

  const result = await httpsRequest(
    `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${appSecret}`
  )

  if (!result.access_token) {
    throw new Error(result.errmsg || '获取微信 access_token 失败')
  }

  cachedAccessToken = result.access_token
  tokenExpiresAt = Date.now() + Math.max((result.expires_in || 7200) - 300, 60) * 1000
  return cachedAccessToken
}

/**
 * 通过微信 getPhoneNumber 返回的 code 换取手机号
 */
function normalizeMainlandPhone(raw) {
  if (!raw) return ''
  const digits = String(raw).replace(/\D/g, '')
  if (/^1[3-9]\d{9}$/.test(digits)) return digits
  if (digits.startsWith('86') && /^861[3-9]\d{9}$/.test(digits)) {
    return digits.slice(2)
  }
  return digits
}

async function getPhoneByCode(phoneCode) {
  const appId = process.env.WECHAT_APPID
  const appSecret = process.env.WECHAT_APPSECRET

  if (typeof phoneCode === 'string' && phoneCode.startsWith('dev:')) {
    return normalizeMainlandPhone(phoneCode.slice(4))
  }

  if (!appId || !appSecret) {
    if (process.env.WECHAT_DEV_MODE === '1') {
      return normalizeMainlandPhone(
        process.env.WECHAT_DEV_PHONE || '13800138001'
      )
    }
    throw new Error('未配置微信小程序 AppID / AppSecret')
  }

  const accessToken = await getAccessToken(appId, appSecret)
  const result = await httpsRequest(
    `https://api.weixin.qq.com/wxa/business/getuserphonenumber?access_token=${accessToken}`,
    'POST',
    { code: phoneCode }
  )

  if (result.errcode !== 0) {
    throw new Error(result.errmsg || '获取手机号失败')
  }

  const phoneInfo = result.phone_info || {}
  const phone = normalizeMainlandPhone(
    phoneInfo.purePhoneNumber || phoneInfo.phoneNumber || ''
  )
  if (!phone) {
    throw new Error('微信未返回有效手机号')
  }
  return phone
}

/**
 * 通过微信 wx.login 的 code 换取 openid
 */
async function getOpenidByLoginCode(loginCode) {
  const appId = process.env.WECHAT_APPID
  const appSecret = process.env.WECHAT_APPSECRET

  if (typeof loginCode === 'string' && loginCode.startsWith('dev:')) {
    return loginCode.slice(4) || process.env.WECHAT_DEV_OPENID || 'dev_openid_001'
  }

  if (!appId || !appSecret) {
    if (process.env.WECHAT_DEV_MODE === '1') {
      return process.env.WECHAT_DEV_OPENID || 'dev_openid_001'
    }
    throw new Error('未配置微信小程序 AppID / AppSecret')
  }

  const result = await httpsRequest(
    `https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${appSecret}&js_code=${encodeURIComponent(loginCode)}&grant_type=authorization_code`
  )

  if (result.errcode) {
    throw new Error(result.errmsg || '微信登录失败')
  }
  if (!result.openid) {
    throw new Error('微信未返回 openid')
  }
  return result.openid
}

module.exports = {
  getPhoneByCode,
  getOpenidByLoginCode,
}
