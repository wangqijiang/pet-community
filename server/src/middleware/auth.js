const { verify } = require('../utils/jwt')
const { error } = require('../utils/response')
const { query } = require('../config/db')

const auth = async (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '')
  
  if (!token) {
    return res.status(401).json(error('请先登录', 401))
  }

  const decoded = verify(token)
  if (!decoded) {
    return res.status(401).json(error('token无效或已过期', 401))
  }

  const user = await query('SELECT id, username, avatar, phone FROM users WHERE id = ?', [decoded.id])
  if (!user || user.length === 0) {
    return res.status(401).json(error('用户不存在', 401))
  }

  req.user = user[0]
  next()
}

module.exports = { auth }
