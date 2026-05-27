const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const { query } = require('../config/db')
const { auth } = require('../middleware/auth')
const { success, error } = require('../utils/response')

// 确保上传目录存在
const uploadDir = path.join(__dirname, '../../uploads')
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

// 文件上传配置
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    const filename = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}${ext}`
    cb(null, filename)
  }
})

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif']
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('只支持图片格式'))
    }
  }
})

/**
 * @swagger
 * /api/user/info:
 *   get:
 *     summary: 获取用户信息
 *     description: 获取当前登录用户的详细信息
 *     tags: [用户]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: 获取成功
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
 *                   example: 获取成功
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: 未登录或 token 无效
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/info', auth, async (req, res) => {
  const user = await query(
    'SELECT id, username, phone, avatar, signature, gender, birthday, region, created_at FROM users WHERE id = ?',
    [req.user.id]
  )
  
  if (user.length === 0) {
    return res.status(404).json(error('用户不存在', 404))
  }

  res.json(success(user[0], '获取成功'))
})

/**
 * @swagger
 * /api/user/info:
 *   put:
 *     summary: 更新用户信息
 *     description: 更新当前登录用户的信息
 *     tags: [用户]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: 用户名/昵称
 *                 example: 铲屎官小红
 *               avatar:
 *                 type: string
 *                 description: 头像 URL
 *                 example: https://example.com/avatar.jpg
 *               signature:
 *                 type: string
 *                 description: 个性签名/简介
 *                 example: 爱猫人士
 *               gender:
 *                 type: string
 *                 description: 性别（男/女/保密）
 *                 example: 男
 *               birthday:
 *                 type: string
 *                 description: 生日（YYYY-MM-DD）
 *                 example: 1990-01-01
 *               region:
 *                 type: string
 *                 description: 地区
 *                 example: 北京市 朝阳区
 *     responses:
 *       200:
 *         description: 更新成功
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
 *                   example: 更新成功
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: 未登录或 token 无效
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/info', auth, async (req, res) => {
  const { username, avatar, signature, gender, birthday, region } = req.body
  
  let birthdayValue = null
  if (birthday && birthday.trim()) {
    const date = new Date(birthday)
    if (!isNaN(date.getTime())) {
      birthdayValue = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    }
  }
  
  const result = await query(
    'UPDATE users SET username = COALESCE(?, username), avatar = COALESCE(?, avatar), signature = COALESCE(?, signature), gender = COALESCE(?, gender), birthday = COALESCE(?, birthday), region = COALESCE(?, region) WHERE id = ?',
    [username, avatar, signature, gender, birthdayValue, region, req.user.id]
  )

  if (result.affectedRows === 0) {
    return res.status(500).json(error('更新失败', 500))
  }

  const user = await query(
    'SELECT id, username, phone, avatar, signature, gender, birthday, region FROM users WHERE id = ?',
    [req.user.id]
  )

  res.json(success(user[0], '更新成功'))
})

/**
 * @swagger
 * /api/user/avatar:
 *   post:
 *     summary: 上传头像
 *     description: 上传用户头像图片
 *     tags: [用户]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: 头像图片文件
 *     responses:
 *       200:
 *         description: 上传成功
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
 *                   example: 上传成功
 *                 data:
 *                   type: object
 *                   properties:
 *                     url:
 *                       type: string
 *                       example: http://localhost:3000/uploads/1234567890-abc.jpg
 *       401:
 *         description: 未登录或 token 无效
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: 上传失败
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/avatar', auth, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json(error('请选择图片文件', 400))
    }

    const avatarUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
    
    await query(
      'UPDATE users SET avatar = ? WHERE id = ?',
      [avatarUrl, req.user.id]
    )

    res.json(success({ url: avatarUrl }, '上传成功'))
  } catch (err) {
    res.status(500).json(error(err.message || '上传失败', 500))
  }
})

/**
 * @swagger
 * /api/user/posts:
 *   get:
 *     summary: 获取用户动态列表
 *     description: 获取当前登录用户发布的动态列表
 *     tags: [用户]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         type: integer
 *         description: 页码
 *         default: 1
 *       - name: size
 *         in: query
 *         type: integer
 *         description: 每页数量
 *         default: 10
 *     responses:
 *       200:
 *         description: 获取成功
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
 *                   example: 获取成功
 *                 data:
 *                   type: object
 *                   properties:
 *                     list:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Post'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: integer
 *                           example: 100
 *                         page:
 *                           type: integer
 *                           example: 1
 *                         size:
 *                           type: integer
 *                           example: 10
 *                         pages:
 *                           type: integer
 *                           example: 10
 *       401:
 *         description: 未登录或 token 无效
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/posts', auth, async (req, res) => {
  const { page = 1, size = 10 } = req.query
  const offset = (page - 1) * size

  const posts = await query(
    'SELECT p.*, u.username, u.avatar FROM posts p JOIN users u ON p.user_id = u.id WHERE p.user_id = ? ORDER BY p.created_at DESC LIMIT ? OFFSET ?',
    [req.user.id, size, offset]
  )

  const total = await query(
    'SELECT COUNT(*) as count FROM posts WHERE user_id = ?',
    [req.user.id]
  )

  res.json({
    success: true,
    message: '获取成功',
    data: {
      list: posts,
      pagination: {
        total: total[0].count,
        page,
        size,
        pages: Math.ceil(total[0].count / size)
      }
    }
  })
})

/**
 * @swagger
 * /api/user/following:
 *   get:
 *     summary: 获取关注列表
 *     description: 获取当前登录用户关注的用户列表
 *     tags: [用户]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         type: integer
 *         description: 页码
 *         default: 1
 *       - name: size
 *         in: query
 *         type: integer
 *         description: 每页数量
 *         default: 10
 *     responses:
 *       200:
 *         description: 获取成功
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
 *                   example: 获取成功
 *                 data:
 *                   type: object
 *                   properties:
 *                     list:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/User'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: integer
 *                           example: 50
 *                         page:
 *                           type: integer
 *                           example: 1
 *                         size:
 *                           type: integer
 *                           example: 10
 *                         pages:
 *                           type: integer
 *                           example: 5
 *       401:
 *         description: 未登录或 token 无效
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/following', auth, async (req, res) => {
  const { page = 1, size = 10 } = req.query
  const offset = (page - 1) * size

  const following = await query(
    'SELECT u.id, u.username, u.avatar FROM follows f JOIN users u ON f.follow_id = u.id WHERE f.user_id = ? ORDER BY f.created_at DESC LIMIT ? OFFSET ?',
    [req.user.id, size, offset]
  )

  const total = await query(
    'SELECT COUNT(*) as count FROM follows WHERE user_id = ?',
    [req.user.id]
  )

  res.json({
    success: true,
    message: '获取成功',
    data: {
      list: following,
      pagination: {
        total: total[0].count,
        page,
        size,
        pages: Math.ceil(total[0].count / size)
      }
    }
  })
})

/**
 * @swagger
 * /api/user/followers:
 *   get:
 *     summary: 获取粉丝列表
 *     description: 获取当前登录用户的粉丝列表
 *     tags: [用户]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         type: integer
 *         description: 页码
 *         default: 1
 *       - name: size
 *         in: query
 *         type: integer
 *         description: 每页数量
 *         default: 10
 *     responses:
 *       200:
 *         description: 获取成功
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
 *                   example: 获取成功
 *                 data:
 *                   type: object
 *                   properties:
 *                     list:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/User'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: integer
 *                           example: 100
 *                         page:
 *                           type: integer
 *                           example: 1
 *                         size:
 *                           type: integer
 *                           example: 10
 *                         pages:
 *                           type: integer
 *                           example: 10
 *       401:
 *         description: 未登录或 token 无效
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/followers', auth, async (req, res) => {
  const { page = 1, size = 10 } = req.query
  const offset = (page - 1) * size

  const followers = await query(
    'SELECT u.id, u.username, u.avatar FROM follows f JOIN users u ON f.user_id = u.id WHERE f.follow_id = ? ORDER BY f.created_at DESC LIMIT ? OFFSET ?',
    [req.user.id, size, offset]
  )

  const total = await query(
    'SELECT COUNT(*) as count FROM follows WHERE follow_id = ?',
    [req.user.id]
  )

  res.json({
    success: true,
    message: '获取成功',
    data: {
      list: followers,
      pagination: {
        total: total[0].count,
        page,
        size,
        pages: Math.ceil(total[0].count / size)
      }
    }
  })
})

/**
 * @swagger
 * /api/user/follow:
 *   post:
 *     summary: 关注用户
 *     description: 关注指定用户
 *     tags: [用户]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               followId:
 *                 type: integer
 *                 description: 要关注的用户 ID
 *                 example: 2
 *     responses:
 *       200:
 *         description: 关注成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: 参数错误或已关注
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: 未登录或 token 无效
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/follow', auth, async (req, res) => {
  const { followId } = req.body

  if (!followId || followId === req.user.id) {
    return res.status(400).json(error('参数错误', 400))
  }

  const existing = await query(
    'SELECT id FROM follows WHERE user_id = ? AND follow_id = ?',
    [req.user.id, followId]
  )

  if (existing.length > 0) {
    return res.status(400).json(error('已关注', 400))
  }

  await query(
    'INSERT INTO follows (user_id, follow_id, created_at) VALUES (?, ?, NOW())',
    [req.user.id, followId]
  )

  res.json(success(null, '关注成功'))
})

/**
 * @swagger
 * /api/user/unfollow:
 *   post:
 *     summary: 取消关注
 *     description: 取消关注指定用户
 *     tags: [用户]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               followId:
 *                 type: integer
 *                 description: 要取消关注的用户 ID
 *                 example: 2
 *     responses:
 *       200:
 *         description: 取消关注成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: 参数错误或未关注
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: 未登录或 token 无效
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/unfollow', auth, async (req, res) => {
  const { followId } = req.body

  if (!followId) {
    return res.status(400).json(error('参数错误', 400))
  }

  const result = await query(
    'DELETE FROM follows WHERE user_id = ? AND follow_id = ?',
    [req.user.id, followId]
  )

  if (result.affectedRows === 0) {
    return res.status(400).json(error('未关注', 400))
  }

  res.json(success(null, '取消关注成功'))
})

module.exports = router