const { query } = require('../config/db')
const { PnvsUserError } = require('./pnvsErrors')

const DEFAULT_MAX_FAIL = 5
const DEFAULT_LOCK_MIN = 30

function getMaxFail() {
  const n = Number(process.env.SMS_VERIFY_MAX_FAIL)
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : DEFAULT_MAX_FAIL
}

function getLockMinutes() {
  const n = Number(process.env.SMS_VERIFY_LOCK_MIN)
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : DEFAULT_LOCK_MIN
}

async function assertSmsNotLocked(phone) {
  try {
    const rows = await query(
      'SELECT fail_count, locked_until FROM sms_verify_failures WHERE phone = ? LIMIT 1',
      [phone],
    )
    if (!rows.length) return

    const row = rows[0]
    if (row.locked_until && new Date(row.locked_until).getTime() > Date.now()) {
      const waitMin = Math.ceil(
        (new Date(row.locked_until).getTime() - Date.now()) / 60000,
      )
      throw new PnvsUserError(
        `验证失败次数过多，请${Math.max(1, waitMin)}分钟后再试`,
        429,
      )
    }
  } catch (err) {
    if (err instanceof PnvsUserError) throw err
    if (err.code === 'ER_NO_SUCH_TABLE') return
    throw err
  }
}

async function recordSmsVerifyFailure(phone) {
  const maxFail = getMaxFail()
  const lockMin = getLockMinutes()
  try {
    const rows = await query(
      'SELECT fail_count, locked_until FROM sms_verify_failures WHERE phone = ? LIMIT 1',
      [phone],
    )
    let failCount = (rows[0]?.fail_count || 0) + 1
    let lockedUntil = null

    if (failCount >= maxFail) {
      lockedUntil = new Date(Date.now() + lockMin * 60 * 1000)
      failCount = 0
    }

    await query(
      `INSERT INTO sms_verify_failures (phone, fail_count, locked_until)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE fail_count = ?, locked_until = ?, updated_at = NOW()`,
      [phone, failCount, lockedUntil, failCount, lockedUntil],
    )

    if (lockedUntil) {
      throw new PnvsUserError(
        `验证失败次数过多，请${lockMin}分钟后再试`,
        429,
      )
    }
  } catch (err) {
    if (err instanceof PnvsUserError) throw err
    if (err.code === 'ER_NO_SUCH_TABLE') return
    throw err
  }
}

async function clearSmsVerifyFailures(phone) {
  try {
    await query('DELETE FROM sms_verify_failures WHERE phone = ?', [phone])
  } catch (err) {
    if (err.code === 'ER_NO_SUCH_TABLE') return
    throw err
  }
}

/** 验证成功后作废本地验证码记录 */
async function consumeLocalSmsCode(phone) {
  try {
    await query('DELETE FROM sms_codes WHERE phone = ?', [phone])
  } catch (err) {
    if (err.code === 'ER_NO_SUCH_TABLE') return
    throw err
  }
}

module.exports = {
  assertSmsNotLocked,
  recordSmsVerifyFailure,
  clearSmsVerifyFailures,
  consumeLocalSmsCode,
}
