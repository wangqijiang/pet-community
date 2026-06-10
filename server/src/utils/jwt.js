const jwt = require('jsonwebtoken')
const { newJti } = require('./tokenBlacklist')

const sign = (payload, options = {}) => {
  const expiresIn = options.expiresIn || process.env.JWT_EXPIRES_IN || '3d'
  const jti = newJti()
  return jwt.sign({ ...payload, jti }, process.env.JWT_SECRET, { expiresIn })
}

const verify = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET)
  } catch (error) {
    return null
  }
}

const decode = (token) => {
  try {
    return jwt.decode(token)
  } catch (error) {
    return null
  }
}

module.exports = { sign, verify, decode }
