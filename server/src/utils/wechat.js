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
async function getPhoneByCode(phoneCode) {
  const appId = process.env.WECHAT_APPID
  const appSecret = process.env.WECHAT_APPSECRET
  const devMode =
    process.env.WECHAT_DEV_MODE === '1' ||
    process.env.NODE_ENV !== 'production' ||
    !appId ||
    !appSecret

  if (devMode) {
    if (typeof phoneCode === 'string' && phoneCode.startsWith('dev:')) {
      return phoneCode.slice(4)
    }
    return process.env.WECHAT_DEV_PHONE || '13800138001'
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
  return phoneInfo.purePhoneNumber || phoneInfo.phoneNumber || ''
}

module.exports = {
  getPhoneByCode,
}
