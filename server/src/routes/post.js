const express = require('express')
const router = express.Router()
const { query } = require('../config/db')
const { auth } = require('../middleware/auth')
const { success, error } = require('../utils/response')

/**
 * @swagger
 * /api/post:
 *   post:
 *     summary: 创建动态
 *     description: 发布新的动态
 *     tags: [动态]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: 动态内容
 *                 example: 今天带狗狗去公园玩啦，天气真好！
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: 图片 URL 数组
 *                 example: ["https://example.com/img1.jpg", "https://example.com/img2.jpg"]
 *     responses:
 *       200:
 *         description: 发布成功
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
 *                   example: 发布成功
 *                 data:
 *                   $ref: '#/components/schemas/Post'
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
router.post('/', auth, async (req, res) => {
  const { content, images } = req.body

  if (!content) {
    return res.status(400).json(error('请填写内容', 400))
  }

  const result = await query(
    'INSERT INTO posts (user_id, content, images, created_at) VALUES (?, ?, ?, NOW())',
    [req.user.id, content, JSON.stringify(images || [])]
  )

  const post = await query(
    'SELECT p.*, u.username, u.avatar FROM posts p JOIN users u ON p.user_id = u.id WHERE p.id = ?',
    [result.insertId]
  )

  res.json(success(post[0], '发布成功'))
})

/**
 * @swagger
 * /api/post:
 *   get:
 *     summary: 获取动态列表
 *     description: 获取所有动态列表，支持分页
 *     tags: [动态]
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
 */
router.get('/', async (req, res) => {
  const { page = 1, size = 10 } = req.query
  const pageNum = parseInt(page)
  const sizeNum = parseInt(size)
  const offset = (pageNum - 1) * sizeNum

  const posts = await query(
    'SELECT p.*, u.username, u.avatar FROM posts p JOIN users u ON p.user_id = u.id ORDER BY p.created_at DESC LIMIT ? OFFSET ?',
    [sizeNum, offset]
  )

  const total = await query('SELECT COUNT(*) as count FROM posts')

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
 * /api/post/{id}:
 *   get:
 *     summary: 获取单条动态
 *     description: 根据动态 ID 获取详细信息
 *     tags: [动态]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: integer
 *         description: 动态 ID
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
 *                   $ref: '#/components/schemas/Post'
 *       404:
 *         description: 动态不存在
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id', async (req, res) => {
  const { id } = req.params

  const post = await query(
    'SELECT p.*, u.username, u.avatar FROM posts p JOIN users u ON p.user_id = u.id WHERE p.id = ?',
    [id]
  )

  if (post.length === 0) {
    return res.status(404).json(error('动态不存在', 404))
  }

  res.json(success(post[0], '获取成功'))
})

/**
 * @swagger
 * /api/post/{id}:
 *   delete:
 *     summary: 删除动态
 *     description: 删除指定的动态（仅作者可删除）
 *     tags: [动态]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: integer
 *         description: 动态 ID
 *     responses:
 *       200:
 *         description: 删除成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       403:
 *         description: 无权删除
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: 动态不存在
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
router.delete('/:id', auth, async (req, res) => {
  const { id } = req.params

  const post = await query('SELECT user_id FROM posts WHERE id = ?', [id])
  
  if (post.length === 0) {
    return res.status(404).json(error('动态不存在', 404))
  }

  if (post[0].user_id !== req.user.id) {
    return res.status(403).json(error('无权删除', 403))
  }

  await query('DELETE FROM posts WHERE id = ?', [id])

  res.json(success(null, '删除成功'))
})

/**
 * @swagger
 * /api/post/{id}/like:
 *   post:
 *     summary: 点赞动态
 *     description: 给指定动态点赞
 *     tags: [动态]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: integer
 *         description: 动态 ID
 *     responses:
 *       200:
 *         description: 点赞成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: 已点赞
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
    'SELECT id FROM likes WHERE user_id = ? AND post_id = ?',
    [req.user.id, id]
  )

  if (existing.length > 0) {
    return res.status(400).json(error('已点赞', 400))
  }

  await query(
    'INSERT INTO likes (user_id, post_id, created_at) VALUES (?, ?, NOW())',
    [req.user.id, id]
  )

  await query('UPDATE posts SET likes = likes + 1 WHERE id = ?', [id])

  res.json(success(null, '点赞成功'))
})

/**
 * @swagger
 * /api/post/{id}/unlike:
 *   post:
 *     summary: 取消点赞
 *     description: 取消对指定动态的点赞
 *     tags: [动态]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: integer
 *         description: 动态 ID
 *     responses:
 *       200:
 *         description: 取消点赞成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: 未点赞
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
    'DELETE FROM likes WHERE user_id = ? AND post_id = ?',
    [req.user.id, id]
  )

  if (result.affectedRows === 0) {
    return res.status(400).json(error('未点赞', 400))
  }

  await query('UPDATE posts SET likes = likes - 1 WHERE id = ?', [id])

  res.json(success(null, '取消点赞成功'))
})

/**
 * @swagger
 * /api/post/{id}/comments:
 *   get:
 *     summary: 获取评论列表
 *     description: 获取指定动态的评论列表
 *     tags: [动态]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: integer
 *         description: 动态 ID
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
 *                           post_id:
 *                             type: integer
 *                             example: 1
 *                           user_id:
 *                             type: integer
 *                             example: 1
 *                           content:
 *                             type: string
 *                             example: 好可爱的狗狗！
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
router.get('/:id/liked', auth, async (req, res) => {
  const { id } = req.params

  const result = await query(
    'SELECT id FROM likes WHERE user_id = ? AND post_id = ?',
    [req.user.id, id]
  )

  res.json(success({ liked: result.length > 0 }, '获取成功'))
})

router.get('/:id/comments', async (req, res) => {
  const { id } = req.params
  const { page = 1, size = 10 } = req.query
  const pageNum = parseInt(page)
  const sizeNum = parseInt(size)
  const offset = (pageNum - 1) * sizeNum

  const comments = await query(
    'SELECT c.*, u.username, u.avatar, rc.user_id as reply_to_user_id, ru.username as reply_to_name FROM comments c JOIN users u ON c.user_id = u.id LEFT JOIN comments rc ON c.reply_to_id = rc.id LEFT JOIN users ru ON rc.user_id = ru.id WHERE c.post_id = ? ORDER BY c.created_at DESC LIMIT ? OFFSET ?',
    [id, sizeNum, offset]
  )

  const total = await query('SELECT COUNT(*) as count FROM comments WHERE post_id = ?', [id])

  res.json({
    success: true,
    message: '获取成功',
    data: {
      list: comments,
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
 * /api/post/{id}/comment:
 *   post:
 *     summary: 添加评论
 *     description: 给指定动态添加评论
 *     tags: [动态]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: integer
 *         description: 动态 ID
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
 *                 example: 好可爱的狗狗！
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
 *                     post_id:
 *                       type: integer
 *                       example: 1
 *                     user_id:
 *                       type: integer
 *                       example: 1
 *                     content:
 *                       type: string
 *                       example: 好可爱的狗狗！
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
router.post('/:id/comment', auth, async (req, res) => {
  const { id } = req.params
  const { content, reply_to_id } = req.body

  if (!content) {
    return res.status(400).json(error('请填写评论内容', 400))
  }

  const result = await query(
    'INSERT INTO comments (post_id, user_id, content, reply_to_id, created_at) VALUES (?, ?, ?, ?, NOW())',
    [id, req.user.id, content, reply_to_id || null]
  )

  await query('UPDATE posts SET comments = comments + 1 WHERE id = ?', [id])

  const comment = await query(
    'SELECT c.*, u.username, u.avatar, rc.user_id as reply_to_user_id, ru.username as reply_to_name FROM comments c JOIN users u ON c.user_id = u.id LEFT JOIN comments rc ON c.reply_to_id = rc.id LEFT JOIN users ru ON rc.user_id = ru.id WHERE c.id = ?',
    [result.insertId]
  )

  res.json(success(comment[0], '评论成功'))
})

router.delete('/comment/:commentId', auth, async (req, res) => {
  const { commentId } = req.params
  const startTime = Date.now()

  console.log(`[DELETE COMMENT] 开始删除评论, commentId: ${commentId}, userId: ${req.user.id}`)

  const comment = await query(
    'SELECT c.*, p.user_id as post_user_id FROM comments c JOIN posts p ON c.post_id = p.id WHERE c.id = ?',
    [commentId]
  )

  if (comment.length === 0) {
    console.log(`[DELETE COMMENT] 评论不存在, commentId: ${commentId}`)
    return res.status(404).json(error('评论不存在', 404))
  }

  if (comment[0].user_id !== req.user.id && comment[0].post_user_id !== req.user.id) {
    console.log(`[DELETE COMMENT] 无权删除, commentId: ${commentId}, commentUserId: ${comment[0].user_id}, postUserId: ${comment[0].post_user_id}, currentUserId: ${req.user.id}`)
    return res.status(403).json(error('无权删除', 403))
  }

  const postId = comment[0].post_id
  
  const beforeCountResult = await query('SELECT COUNT(*) as count FROM comments WHERE post_id = ?', [postId])
  const beforeCount = beforeCountResult[0].count || 0
  console.log(`[DELETE COMMENT] 删除前, postId: ${postId}, 评论总数: ${beforeCount}`)

  const deleteResult = await query('DELETE FROM comments WHERE id = ? OR reply_to_id = ?', [commentId, commentId])
  console.log(`[DELETE COMMENT] 删除成功, 删除记录数: ${deleteResult.affectedRows}`)

  const afterCountResult = await query('SELECT COUNT(*) as count FROM comments WHERE post_id = ?', [postId])
  const afterCount = afterCountResult[0].count || 0
  console.log(`[DELETE COMMENT] 删除后, postId: ${postId}, 评论总数: ${afterCount}, 减少数量: ${beforeCount - afterCount}`)

  await query('UPDATE posts SET comments = ? WHERE id = ?', [afterCount, postId])

  const endTime = Date.now()
  console.log(`[DELETE COMMENT] 删除完成, commentId: ${commentId}, postId: ${postId}, 耗时: ${endTime - startTime}ms`)

  res.json(success(null, '删除成功'))
})

module.exports = router
