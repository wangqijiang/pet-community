const express = require('express')
const router = express.Router()
const { query } = require('../config/db')
const { hash, compare } = require('../utils/bcrypt')
const { sign } = require('../utils/jwt')
const { success, error } = require('../utils/response')
const { getPhoneByCode } = require('../utils/wechat')
const { auth } = require('../middleware/auth')

function formatAuthUser(user) {
  return {
    id: user.id,
    username: user.username,
    phone: user.phone,
    avatar: user.avatar,
    signature: user.signature,
  }
}

async function findOrCreateUserByPhone(phone) {
  let users = await query('SELECT * FROM users WHERE phone = ?', [phone])
  if (users.length > 0) {
    return users[0]
  }

  const username = `萌宠用户${phone.slice(-4)}`
  const hashedPassword = await hash(`${phone}_${Date.now()}`)
  const result = await query(
    'INSERT INTO users (username, phone, password, avatar, created_at) VALUES (?, ?, ?, ?, NOW())',
    [username, phone, hashedPassword, null]
  )
  users = await query('SELECT * FROM users WHERE id = ?', [result.insertId])
  return users[0]
}

async function verifySmsCode(phone, code) {
  const isProduction = process.env.NODE_ENV === 'production'
  const devCode = process.env.SMS_DEV_CODE || '1234'

  if (!isProduction && code === devCode) {
    return true
  }

  try {
    const codes = await query(
      'SELECT * FROM sms_codes WHERE phone = ? AND code = ? AND expires_at > NOW() ORDER BY id DESC LIMIT 1',
      [phone, code]
    )
    return codes.length > 0
  } catch (dbErr) {
    if (dbErr.code === 'ER_NO_SUCH_TABLE') {
      return !isProduction && code === devCode
    }
    throw dbErr
  }
}

/**
 * 用户注册
 */
router.post('/register', async (req, res) => {
  const { username, phone, password } = req.body

  // 参数验证
  if (!username || !phone || !password) {
    return res.status(400).json(error('请填写完整信息', 400))
  }

  if (username.length < 2 || username.length > 20) {
    return res.status(400).json(error('用户名长度应为2-20个字符', 400))
  }

  if (!/^1[3-9]\d{9}$/.test(phone)) {
    return res.status(400).json(error('手机号格式不正确', 400))
  }

  if (password.length < 6 || password.length > 20) {
    return res.status(400).json(error('密码长度应为6-20个字符', 400))
  }

  try {
    // 检查手机号是否已注册
    const existing = await query('SELECT id FROM users WHERE phone = ?', [phone])
    if (existing.length > 0) {
      return res.status(400).json(error('该手机号已注册', 400))
    }

    // 密码加密
    const hashedPassword = await hash(password)

    // 创建用户
    const result = await query(
      'INSERT INTO users (username, phone, password, created_at) VALUES (?, ?, ?, NOW())',
      [username, phone, hashedPassword]
    )

    // 生成token
    const token = sign({ id: result.insertId })

    res.json(success({
      token,
      user: {
        id: result.insertId,
        username,
        phone
      }
    }, '注册成功'))
  } catch (err) {
    console.error('注册失败:', err)
    res.status(500).json(error('注册失败', 500))
  }
})

/**
 * 用户登录
 */
router.post('/login', async (req, res) => {
  const { phone, password } = req.body

  // 参数验证
  if (!phone || !password) {
    return res.status(400).json(error('请填写手机号和密码', 400))
  }

  try {
    // 查找用户
    const users = await query('SELECT * FROM users WHERE phone = ?', [phone])
    if (users.length === 0) {
      return res.status(400).json(error('手机号或密码错误', 400))
    }

    const user = users[0]

    // 检查账号状态
    if (user.status !== 1) {
      return res.status(403).json(error('账号已被禁用', 403))
    }

    // 验证密码
    const isMatch = await compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json(error('手机号或密码错误', 400))
    }

    // 生成token
    const token = sign({ id: user.id })

    res.json(success({
      token,
      user: {
        id: user.id,
        username: user.username,
        phone: user.phone,
        avatar: user.avatar
      }
    }, '登录成功'))
  } catch (err) {
    console.error('登录失败:', err)
    res.status(500).json(error('登录失败', 500))
  }
})

/**
 * 检查token有效性
 */
router.get('/check', async (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '')
  
  if (!token) {
    return res.json(success({ valid: false }, '未登录'))
  }

  try {
    const { verify } = require('../utils/jwt')
    const decoded = verify(token)
    
    if (!decoded) {
      return res.json(success({ valid: false }, 'token无效'))
    }

    const users = await query('SELECT id, username, phone, avatar FROM users WHERE id = ? AND status = 1', [decoded.id])
    if (users.length === 0) {
      return res.json(success({ valid: false }, '用户不存在'))
    }

    res.json(success({ valid: true, user: users[0] }, 'token有效'))
  } catch (err) {
    res.json(success({ valid: false }, 'token验证失败'))
  }
})

/**
 * 修改密码（需登录）
 */
router.post('/change-password', auth, async (req, res) => {
  const { oldPassword, newPassword } = req.body

  if (!oldPassword || !newPassword) {
    return res.status(400).json(error('请填写完整信息', 400))
  }

  if (newPassword.length < 6 || newPassword.length > 20) {
    return res.status(400).json(error('新密码长度应为6-20个字符', 400))
  }

  try {
    const users = await query('SELECT * FROM users WHERE id = ? AND status = 1', [req.user.id])
    if (users.length === 0) {
      return res.status(404).json(error('用户不存在', 404))
    }

    const user = users[0]
    const isMatch = await compare(oldPassword, user.password)
    if (!isMatch) {
      return res.status(400).json(error('原密码错误', 400))
    }

    const hashedPassword = await hash(newPassword)
    await query('UPDATE users SET password = ?, updated_at = NOW() WHERE id = ?', [hashedPassword, user.id])

    res.json(success(null, '密码修改成功'))
  } catch (err) {
    console.error('修改密码失败:', err)
    res.status(500).json(error('修改失败', 500))
  }
})

/**
 * 重置密码（需短信验证码）
 */
router.post('/reset-password', async (req, res) => {
  const { phone, code, newPassword } = req.body

  if (!phone || !code || !newPassword) {
    return res.status(400).json(error('请填写完整信息', 400))
  }

  if (!/^1[3-9]\d{9}$/.test(phone)) {
    return res.status(400).json(error('手机号格式不正确', 400))
  }

  if (newPassword.length < 6 || newPassword.length > 20) {
    return res.status(400).json(error('密码长度应为6-20个字符', 400))
  }

  try {
    const codeValid = await verifySmsCode(phone, code)
    if (!codeValid) {
      return res.status(400).json(error('验证码错误或已过期', 400))
    }

    const users = await query('SELECT id FROM users WHERE phone = ? AND status = 1', [phone])
    if (users.length === 0) {
      return res.status(400).json(error('手机号未注册', 400))
    }

    const hashedPassword = await hash(newPassword)
    await query('UPDATE users SET password = ?, updated_at = NOW() WHERE id = ?', [hashedPassword, users[0].id])

    res.json(success(null, '密码重置成功'))
  } catch (err) {
    console.error('重置密码失败:', err)
    res.status(500).json(error('重置失败', 500))
  }
})

/**
 * 发送验证码（开发环境返回固定码）
 */
router.post('/sendCode', async (req, res) => {
  const { phone } = req.body
  if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
    return res.status(400).json(error('手机号格式不正确', 400))
  }

  const code = process.env.SMS_DEV_CODE || '1234'

  try {
    await query('DELETE FROM sms_codes WHERE phone = ?', [phone])
    await query(
      'INSERT INTO sms_codes (phone, code, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 10 MINUTE))',
      [phone, code]
    )
    const payload = process.env.NODE_ENV === 'production' ? {} : { code }
    res.json(success(payload, '验证码已发送'))
  } catch (err) {
    console.error('发送验证码失败:', err)
    res.status(500).json(error('发送失败', 500))
  }
})

/**
 * 验证码登录（用户不存在则自动注册）
 */
router.post('/loginByCode', async (req, res) => {
  const { phone, code } = req.body

  if (!phone || !code) {
    return res.status(400).json(error('请填写手机号和验证码', 400))
  }

  if (!/^1[3-9]\d{9}$/.test(phone)) {
    return res.status(400).json(error('手机号格式不正确', 400))
  }

  try {
    const codeValid = await verifySmsCode(phone, code)
    if (!codeValid) {
      return res.status(400).json(error('验证码错误或已过期', 400))
    }

    const user = await findOrCreateUserByPhone(phone)
    if (user.status !== 1) {
      return res.status(403).json(error('账号已被禁用', 403))
    }

    const token = sign({ id: user.id })
    res.json(success({
      token,
      user: formatAuthUser(user),
    }, '登录成功'))
  } catch (err) {
    console.error('验证码登录失败:', err)
    res.status(500).json(error('登录失败', 500))
  }
})

/**
 * 微信一键登录（getPhoneNumber code）
 */
router.post('/wechatLogin', async (req, res) => {
  const { phoneCode } = req.body

  if (!phoneCode) {
    return res.status(400).json(error('缺少手机号授权码', 400))
  }

  try {
    const phone = await getPhoneByCode(phoneCode)
    if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
      return res.status(400).json(error('获取手机号失败', 400))
    }

    const user = await findOrCreateUserByPhone(phone)
    if (user.status !== 1) {
      return res.status(403).json(error('账号已被禁用', 403))
    }

    const token = sign({ id: user.id })
    res.json(success({
      token,
      user: formatAuthUser(user),
    }, '登录成功'))
  } catch (err) {
    console.error('微信登录失败:', err)
    res.status(500).json(error(err.message || '登录失败', 500))
  }
})

/**
 * 退出登录
 */
router.post('/logout', async (req, res) => {
  res.json(success(null, '已退出登录'))
})

module.exports = router
