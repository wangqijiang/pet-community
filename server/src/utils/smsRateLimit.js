const { query } = require("../config/db");
const { PnvsUserError } = require("./pnvsErrors");

const DEFAULT_INTERVAL_SEC = 60;

function getSendIntervalSec() {
  const n = Number(process.env.SMS_SEND_INTERVAL_SEC);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : DEFAULT_INTERVAL_SEC;
}

/**
 * 校验是否允许发送验证码（与前端 60s 冷却一致）
 * @throws {PnvsUserError} 429
 */
async function assertSmsSendAllowed(phone) {
  const intervalSec = getSendIntervalSec();

  try {
    const rows = await query(
      "SELECT last_sent_at FROM sms_send_records WHERE phone = ? LIMIT 1",
      [phone],
    );
    if (rows.length === 0) return;

    const lastSent = new Date(rows[0].last_sent_at).getTime();
    if (Number.isNaN(lastSent)) return;

    const elapsedMs = Date.now() - lastSent;
    const cooldownMs = intervalSec * 1000;
    if (elapsedMs < cooldownMs) {
      const waitSec = Math.max(1, Math.ceil((cooldownMs - elapsedMs) / 1000));
      throw new PnvsUserError(`发送过于频繁，请${waitSec}秒后再试`, 429);
    }
  } catch (err) {
    if (err instanceof PnvsUserError) throw err;
    if (err.code === "ER_NO_SUCH_TABLE") {
      const msg = "sms_send_records 表不存在，请执行 migrate-sms-rate-limit.sql";
      if (process.env.NODE_ENV === "production") {
        throw new PnvsUserError("短信服务暂不可用，请稍后再试", 503);
      }
      console.warn(msg);
      return;
    }
    throw err;
  }
}

/** 发送成功后记录时间 */
async function recordSmsSend(phone) {
  try {
    await query(
      `INSERT INTO sms_send_records (phone, last_sent_at) VALUES (?, NOW())
       ON DUPLICATE KEY UPDATE last_sent_at = NOW()`,
      [phone],
    );
  } catch (err) {
    if (err.code === "ER_NO_SUCH_TABLE") return;
    throw err;
  }
}

module.exports = {
  getSendIntervalSec,
  assertSmsSendAllowed,
  recordSmsSend,
};
