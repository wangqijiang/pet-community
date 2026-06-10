const { query } = require('../config/db')

async function logAdminAction(req, action, targetType, targetId, detail) {
  if (!req.admin?.id) return
  const ip =
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.ip ||
    null

  try {
    await query(
      `INSERT INTO admin_audit_logs (admin_id, action, target_type, target_id, detail, ip)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        req.admin.id,
        action,
        targetType || null,
        targetId != null ? String(targetId) : null,
        detail ? JSON.stringify(detail) : null,
        ip,
      ],
    )
  } catch (err) {
    if (err.code !== 'ER_NO_SUCH_TABLE') {
      console.error('adminAudit log failed:', err.message)
    }
  }
}

/** 包装 mutating 路由 handler，自动记审计 */
function withAdminAudit(action, targetType, handler) {
  return async (req, res, next) => {
    try {
      await handler(req, res, next)
      if (res.headersSent && res.statusCode < 400) {
        const targetId = req.params?.id || req.body?.id
        await logAdminAction(req, action, targetType, targetId, {
          method: req.method,
          path: req.originalUrl,
        })
      }
    } catch (err) {
      next(err)
    }
  }
}

module.exports = { logAdminAction, withAdminAudit }
