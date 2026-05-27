const express = require('express')
const router = express.Router()
const { query } = require('../config/db')
const { auth } = require('../middleware/auth')
const { success, error } = require('../utils/response')

/**
 * @swagger
 * /api/place:
 *   get:
 *     summary: 获取地点列表
 *     description: 获取宠物友好地点列表，支持筛选和分页
 *     tags: [地点]
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
 *       - name: type
 *         in: query
 *         type: string
 *         description: 地点类型（park/cafe/shop/hotel）
 *       - name: keyword
 *         in: query
 *         type: string
 *         description: 搜索关键词
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
 *                         $ref: '#/components/schemas/Place'
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
 */
router.get('/', async (req, res) => {
  const { page = 1, size = 10, type = '', keyword = '' } = req.query
  const offset = (page - 1) * size

  let sql = 'SELECT p.*, (SELECT COUNT(*) FROM place_likes WHERE place_id = p.id) as likes FROM places p WHERE 1=1'
  const params = []

  if (type) {
    sql += ' AND type = ?'
    params.push(type)
  }

  if (keyword) {
    sql += ' AND (name LIKE ? OR address LIKE ?)'
    params.push(`%${keyword}%`, `%${keyword}%`)
  }

  sql += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?'
  params.push(size, offset)

  const places = await query(sql, params)

  const countSql = 'SELECT COUNT(*) as count FROM places WHERE 1=1'
  const countParams = []
  
  if (type) {
    countSql += ' AND type = ?'
    countParams.push(type)
  }
  
  if (keyword) {
    countSql += ' AND (name LIKE ? OR address LIKE ?)'
    countParams.push(`%${keyword}%`, `%${keyword}%`)
  }

  const total = await query(countSql, countParams)

  res.json({
    success: true,
    message: '获取成功',
    data: {
      list: places,
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
 * /api/place/{id}:
 *   get:
 *     summary: 获取地点详情
 *     description: 根据地点 ID 获取详细信息
 *     tags: [地点]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: integer
 *         description: 地点 ID
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
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: 中央公园
 *                     address:
 *                       type: string
 *                       example: 北京市朝阳区中央公园路88号
 *                     latitude:
 *                       type: number
 *                       example: 39.916527
 *                     longitude:
 *                       type: number
 *                       example: 116.397128
 *                     type:
 *                       type: string
 *                       example: park
 *                     description:
 *                       type: string
 *                       example: 城市中心的绿肺，宠物友好公园
 *                     images:
 *                       type: string
 *                       example: '["https://example.com/img1.jpg"]'
 *                     phone:
 *                       type: string
 *                       example: '010-88888888'
 *                     open_time:
 *                       type: string
 *                       example: '6:00-22:00'
 *                     likes:
 *                       type: integer
 *                       example: 100
 *                     reviews:
 *                       type: integer
 *                       example: 20
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       example: '2024-01-01T12:00:00Z'
 *       404:
 *         description: 地点不存在
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id', async (req, res) => {
  const { id } = req.params

  const place = await query(`
    SELECT 
      p.*,
      (SELECT COUNT(*) FROM place_likes WHERE place_id = p.id) as likes,
      (SELECT COUNT(*) FROM place_reviews WHERE place_id = p.id) as reviews
    FROM places p WHERE p.id = ?
  `, [id])

  if (place.length === 0) {
    return res.status(404).json(error('地点不存在', 404))
  }

  res.json(success(place[0], '获取成功'))
})

/**
 * @swagger
 * /api/place/{id}/reviews:
 *   get:
 *     summary: 获取地点评论
 *     description: 获取指定地点的评论列表
 *     tags: [地点]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: integer
 *         description: 地点 ID
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
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           place_id:
 *                             type: integer
 *                             example: 1
 *                           user_id:
 *                             type: integer
 *                             example: 1
 *                           content:
 *                             type: string
 *                             example: 很好的宠物友好公园！
 *                           rating:
 *                             type: integer
 *                             example: 5
 *                           username:
 *                             type: string
 *                             example: 用户小明
 *                           avatar:
 *                             type: string
 *                             example: https://example.com/avatar.jpg
 *                           created_at:
 *                             type: string
 *                             format: date-time
 *                             example: '2024-01-01T12:00:00Z'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: integer
 *                           example: 20
 *                         page:
 *                           type: integer
 *                           example: 1
 *                         size:
 *                           type: integer
 *                           example: 10
 *                         pages:
 *                           type: integer
 *                           example: 2
 */
router.get('/:id/reviews', async (req, res) => {
  const { id } = req.params
  const { page = 1, size = 10 } = req.query
  const offset = (page - 1) * size

  const reviews = await query(`
    SELECT r.*, u.username, u.avatar 
    FROM place_reviews r
    JOIN users u ON r.user_id = u.id
    WHERE r.place_id = ?
    ORDER BY r.created_at DESC
    LIMIT ? OFFSET ?
  `, [id, size, offset])

  const total = await query('SELECT COUNT(*) as count FROM place_reviews WHERE place_id = ?', [id])

  res.json({
    success: true,
    message: '获取成功',
    data: {
      list: reviews,
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
 * /api/place/{id}/review:
 *   post:
 *     summary: 添加评论
 *     description: 给指定地点添加评论
 *     tags: [地点]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: integer
 *         description: 地点 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: 评论内容
 *                 example: 很好的宠物友好公园！
 *               rating:
 *                 type: integer
 *                 description: 评分（1-5）
 *                 example: 5
 *                 default: 5
 *     responses:
 *       200:
 *         description: 评论成功
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
 *                   example: 评论成功
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     place_id:
 *                       type: integer
 *                       example: 1
 *                     user_id:
 *                       type: integer
 *                       example: 1
 *                     content:
 *                       type: string
 *                       example: 很好的宠物友好公园！
 *                     rating:
 *                       type: integer
 *                       example: 5
 *                     username:
 *                       type: string
 *                       example: 用户小明
 *                     avatar:
 *                       type: string
 *                       example: https://example.com/avatar.jpg
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       example: '2024-01-01T12:00:00Z'
 *       400:
 *         description: 参数错误
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
router.post('/:id/review', auth, async (req, res) => {
  const { id } = req.params
  const { content, rating } = req.body

  if (!content) {
    return res.status(400).json(error('请填写评论内容', 400))
  }

  const result = await query(
    'INSERT INTO place_reviews (place_id, user_id, content, rating, created_at) VALUES (?, ?, ?, ?, NOW())',
    [id, req.user.id, content, rating || 5]
  )

  const review = await query(
    'SELECT r.*, u.username, u.avatar FROM place_reviews r JOIN users u ON r.user_id = u.id WHERE r.id = ?',
    [result.insertId]
  )

  res.json(success(review[0], '评论成功'))
})

/**
 * @swagger
 * /api/place/{id}/like:
 *   post:
 *     summary: 收藏地点
 *     description: 收藏指定地点
 *     tags: [地点]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: integer
 *         description: 地点 ID
 *     responses:
 *       200:
 *         description: 收藏成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: 已收藏
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
router.post('/:id/like', auth, async (req, res) => {
  const { id } = req.params

  const existing = await query(
    'SELECT id FROM place_likes WHERE user_id = ? AND place_id = ?',
    [req.user.id, id]
  )

  if (existing.length > 0) {
    return res.status(400).json(error('已收藏', 400))
  }

  await query(
    'INSERT INTO place_likes (user_id, place_id, created_at) VALUES (?, ?, NOW())',
    [req.user.id, id]
  )

  res.json(success(null, '收藏成功'))
})

/**
 * @swagger
 * /api/place/{id}/unlike:
 *   post:
 *     summary: 取消收藏
 *     description: 取消收藏指定地点
 *     tags: [地点]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: integer
 *         description: 地点 ID
 *     responses:
 *       200:
 *         description: 取消收藏成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: 未收藏
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
router.post('/:id/unlike', auth, async (req, res) => {
  const { id } = req.params

  const result = await query(
    'DELETE FROM place_likes WHERE user_id = ? AND place_id = ?',
    [req.user.id, id]
  )

  if (result.affectedRows === 0) {
    return res.status(400).json(error('未收藏', 400))
  }

  res.json(success(null, '取消收藏成功'))
})

/**
 * @swagger
 * /api/place/user/favorites:
 *   get:
 *     summary: 获取收藏列表
 *     description: 获取当前登录用户收藏的地点列表
 *     tags: [地点]
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
 *                         $ref: '#/components/schemas/Place'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: integer
 *                           example: 10
 *                         page:
 *                           type: integer
 *                           example: 1
 *                         size:
 *                           type: integer
 *                           example: 10
 *                         pages:
 *                           type: integer
 *                           example: 1
 *       401:
 *         description: 未登录或 token 无效
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/user/favorites', auth, async (req, res) => {
  const { page = 1, size = 10 } = req.query
  const offset = (page - 1) * size

  const places = await query(`
    SELECT p.* FROM places p
    JOIN place_likes pl ON p.id = pl.place_id
    WHERE pl.user_id = ?
    ORDER BY pl.created_at DESC
    LIMIT ? OFFSET ?
  `, [req.user.id, size, offset])

  const total = await query(
    'SELECT COUNT(*) as count FROM place_likes WHERE user_id = ?',
    [req.user.id]
  )

  res.json({
    success: true,
    message: '获取成功',
    data: {
      list: places,
      pagination: {
        total: total[0].count,
        page,
        size,
        pages: Math.ceil(total[0].count / size)
      }
    }
  })
})

module.exports = router
