const express = require('express')
const router = express.Router()
const { query } = require('../config/db')
const { hash, compare } = require('../utils/bcrypt')
const { sign } = require('../utils/jwt')
const { success, error } = require('../utils/response')

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: 用户注册
 *     description: 新用户注册账号
 *     tags: [认证]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: 用户名
 *                 example: 铲屎官小明
 *               phone:
 *                 type: string
 *                 description: 手机号
 *                 example: '13800138000'
 *               password:
 *                 type: string
 *                 description: 密码
 *                 example: '123456'
 *     responses:
 *       200:
 *         description: 注册成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: 注册成功
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *                     token:
 *                       type: string
 *                       example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
 *       400:
 *         description: 参数错误或手机号已被注册
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/register', async (req, res) => {
  const { username, phone, password } = req.body
  
  if (!username || !phone || !password) {
    return res.status(400).json(error('请填写完整信息', 400))
  }

  const existing = await query('SELECT id FROM users WHERE phone = ?', [phone])
  if (existing.length > 0) {
    return res.status(400).json(error('该手机号已被注册', 400))
  }

  const hashedPassword = await hash(password)
  const result = await query(
    'INSERT INTO users (username, phone, password, created_at) VALUES (?, ?, ?, NOW())',
    [username, phone, hashedPassword]
  )

  const user = await query('SELECT id, username, phone, avatar FROM users WHERE id = ?', [result.insertId])
  
  const token = sign({ id: user[0].id })
  
  res.json(success({ user: user[0], token }, '注册成功'))
})

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: 密码登录
 *     description: 使用手机号和密码登录
 *     tags: [认证]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *                 description: 手机号
 *                 example: '13800138000'
 *               password:
 *                 type: string
 *                 description: 密码
 *                 example: '123456'
 *     responses:
 *       200:
 *         description: 登录成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: 登录成功
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *                     token:
 *                       type: string
 *                       example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
 *       400:
 *         description: 参数错误、用户不存在或密码错误
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/login', async (req, res) => {
  const { phone, password } = req.body
  
  if (!phone || !password) {
    return res.status(400).json(error('请填写手机号和密码', 400))
  }

  const user = await query('SELECT id, username, phone, password, avatar FROM users WHERE phone = ?', [phone])
  
  if (user.length === 0) {
    return res.status(400).json(error('用户不存在', 400))
  }

  const isMatch = await compare(password, user[0].password)
  if (!isMatch) {
    return res.status(400).json(error('密码错误', 400))
  }

  const token = sign({ id: user[0].id })
  
  const userData = {
    id: user[0].id,
    username: user[0].username,
    phone: user[0].phone,
    avatar: user[0].avatar
  }
  
  res.json(success({ user: userData, token }, '登录成功'))
})

/**
 * @swagger
 * /api/auth/loginByCode:
 *   post:
 *     summary: 验证码登录
 *     description: 使用手机号和验证码登录，用户不存在时自动注册
 *     tags: [认证]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *                 description: 手机号
 *                 example: '13800138000'
 *               code:
 *                 type: string
 *                 description: 验证码（测试环境固定为 1234）
 *                 example: '1234'
 *     responses:
 *       200:
 *         description: 登录成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: 登录成功
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *                     token:
 *                       type: string
 *                       example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
 *       400:
 *         description: 参数错误或验证码错误
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/loginByCode', async (req, res) => {
  const { phone, code } = req.body
  
  if (!phone || !code) {
    return res.status(400).json(error('请填写手机号和验证码', 400))
  }

  if (code !== '1234') {
    return res.status(400).json(error('验证码错误', 400))
  }

  let user = await query('SELECT id, username, phone, avatar FROM users WHERE phone = ?', [phone])
  
  if (user.length === 0) {
    const result = await query(
      'INSERT INTO users (username, phone, created_at) VALUES (?, ?, NOW())',
      [`用户${phone.slice(-4)}`, phone]
    )
    user = await query('SELECT id, username, phone, avatar FROM users WHERE id = ?', [result.insertId])
  }

  const token = sign({ id: user[0].id })
  
  res.json(success({ user: user[0], token }, '登录成功'))
})

/**
 * @swagger
 * /api/auth/sendCode:
 *   post:
 *     summary: 发送验证码
 *     description: 向指定手机号发送验证码（测试环境固定返回 1234）
 *     tags: [认证]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *                 description: 手机号
 *                 example: '13800138000'
 *     responses:
 *       200:
 *         description: 发送成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: 验证码已发送
 *                 data:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                       example: '1234'
 *       400:
 *         description: 参数错误
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/sendCode', async (req, res) => {
  const { phone } = req.body
  
  if (!phone) {
    return res.status(400).json(error('请填写手机号', 400))
  }

  res.json(success({ code: '1234' }, '验证码已发送'))
})

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: 退出登录
 *     description: 用户退出登录，清除本地 token
 *     tags: [认证]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: 退出成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: 退出成功
 *       401:
 *         description: 未授权
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/logout', async (req, res) => {
  res.json(success({}, '退出成功'))
})

module.exports = router