const { query } = require('../config/db')
const { error } = require('./response')

function getUgcCooldownHours() {
  const n = Number(process.env.NEW_USER_UGC_HOURS)
  return Number.isFinite(n) && n >= 0 ? n : 24
}

function isUgcCooldownEnabled() {
  return getUgcCooldownHours() > 0
}

async function loadUserCreatedAt(userId) {
  const rows = await query(
    'SELECT created_at, phone FROM users WHERE id = ? AND status = 1',
    [userId],
  )
  return rows[0] || null
}

async function assertUgcAllowed(user) {
  if (!user?.id) {
    return { ok: false, status: 401, message: '请先登录' }
  }

  if (process.env.REQUIRE_PHONE_FOR_UGC === '1' && !user.phone) {
    return { ok: false, status: 403, message: '发布内容需先绑定手机号' }
  }

  if (!isUgcCooldownEnabled()) {
    return { ok: true }
  }

  const row = await loadUserCreatedAt(user.id)
  if (!row) {
    return { ok: false, status: 403, message: '账号不可用' }
  }

  const hours = getUgcCooldownHours()
  const created = new Date(row.created_at).getTime()
  const elapsedH = (Date.now() - created) / 3600000
  if (elapsedH < hours) {
    const remain = Math.ceil(hours - elapsedH)
    return {
      ok: false,
      status: 403,
      message: `新账号需等待约${remain}小时后再发布内容`,
    }
  }

  return { ok: true }
}

/** Express 中间件：限制新号 UGC */
function requireUgcEligible(req, res, next) {
  assertUgcAllowed(req.user)
    .then((result) => {
      if (!result.ok) {
        return res.status(result.status).json(error(result.message, result.status))
      }
      next()
    })
    .catch((err) => {
      console.error('requireUgcEligible:', err)
      res.status(500).json(error('校验失败', 500))
    })
}

module.exports = {
  assertUgcAllowed,
  requireUgcEligible,
  getUgcCooldownHours,
}
