function validateProductionEnv() {
  const isProduction = process.env.NODE_ENV === 'production'
  if (!isProduction) return { ok: true, warnings: [] }

  const errors = []
  const warnings = []

  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 16) {
    errors.push('JWT_SECRET 未设置或过短（至少 16 字符）')
  }
  if (process.env.JWT_SECRET === 'change-me-to-a-long-random-string') {
    errors.push('JWT_SECRET 仍为默认值')
  }
  if (!process.env.CORS_ORIGIN) {
    errors.push('生产环境必须设置 CORS_ORIGIN')
  }
  if (process.env.PNVS_ENABLED !== '1') {
    warnings.push('PNVS_ENABLED 未开启，短信验证码可能不安全')
  }
  if (process.env.WECHAT_DEV_MODE === '1') {
    errors.push('生产环境不得开启 WECHAT_DEV_MODE')
  }
  if (process.env.STRICT_MEDIA_URLS !== '1') {
    warnings.push('建议生产环境设置 STRICT_MEDIA_URLS=1')
  }

  return { ok: errors.length === 0, errors, warnings }
}

function runStartupSecurityCheck() {
  const result = validateProductionEnv()
  for (const w of result.warnings) {
    console.warn(`[security] ${w}`)
  }
  if (!result.ok) {
    for (const e of result.errors) {
      console.error(`[security] ${e}`)
    }
    if (process.env.SECURITY_STRICT_STARTUP === '1') {
      throw new Error('生产环境安全配置未通过，拒绝启动')
    }
  }
  return result
}

module.exports = { validateProductionEnv, runStartupSecurityCheck }
