const { buildRateLimiter } = require('../utils/rateLimitStore')
const { query } = require('../config/db')
const { PnvsUserError } = require('../utils/pnvsErrors')

const authLoginLimiter = buildRateLimiter({
  windowMs: 60_000,
  max: 5,
  keyPrefix: 'auth-login',
  keyFn: (req) => req.body?.phone || req.body?.loginCode || '',
})

const sendCodeLimiter = buildRateLimiter({
  windowMs: 60_000,
  max: 3,
  keyPrefix: 'send-code',
  keyFn: (req) => req.body?.phone || '',
})

const adminLoginLimiter = buildRateLimiter({
  windowMs: 15 * 60_000,
  max: 10,
  keyPrefix: 'admin-login',
})

const userSearchLimiter = buildRateLimiter({
  windowMs: 60_000,
  max: 20,
  keyPrefix: 'user-search',
  keyFn: (req) => String(req.user?.id || 'anon'),
})

function getIpDailyMax() {
  const n = Number(process.env.SMS_IP_DAILY_MAX)
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 20
}

function todayKey() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}${m}${day}`
}

/** 每 IP 每日发码上限（DB 持久化） */
async function sendCodeIpDailyLimiter(req, res, next) {
  const ip =
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.ip ||
    req.socket?.remoteAddress ||
    'unknown'
  const dayKey = todayKey()
  const max = getIpDailyMax()

  try {
    const rows = await query(
      'SELECT send_count FROM sms_ip_daily WHERE ip = ? AND day_key = ? LIMIT 1',
      [ip, dayKey],
    )
    const count = rows[0]?.send_count || 0
    if (count >= max) {
      return res.status(429).json({
        success: false,
        message: '今日发送次数已达上限，请明天再试',
        code: 429,
      })
    }
    req._smsIpDaily = { ip, dayKey }
    next()
  } catch (err) {
    if (err.code === 'ER_NO_SUCH_TABLE') {
      return next()
    }
    console.error('sendCodeIpDailyLimiter:', err)
    next()
  }
}

async function recordSendCodeIpDaily(req) {
  const meta = req._smsIpDaily
  if (!meta) return
  try {
    await query(
      `INSERT INTO sms_ip_daily (ip, day_key, send_count) VALUES (?, ?, 1)
       ON DUPLICATE KEY UPDATE send_count = send_count + 1`,
      [meta.ip, meta.dayKey],
    )
  } catch (err) {
    if (err.code !== 'ER_NO_SUCH_TABLE') console.warn('recordSendCodeIpDaily:', err.message)
  }
}

module.exports = {
  authLoginLimiter,
  sendCodeLimiter,
  adminLoginLimiter,
  userSearchLimiter,
  sendCodeIpDailyLimiter,
  recordSendCodeIpDaily,
}
