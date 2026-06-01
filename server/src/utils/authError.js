const { error } = require('../utils/response')

/** 未登录 / 登录失效的统一业务码 */
const AUTH_REQUIRED_CODE = 401

function unauthorized(res, message = '请先登录') {
  return res.status(401).json(
    error(message, AUTH_REQUIRED_CODE, { needLogin: true })
  )
}

module.exports = { AUTH_REQUIRED_CODE, unauthorized }
