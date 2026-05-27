const express = require('express')
const router = express.Router()
const { query } = require('../config/db')
const { auth } = require('../middleware/auth')
const { success, error } = require('../utils/response')

/**
 * @swagger
 * /api/message:
 *   get:
 *     summary: 获取消息列表
 *     description: 获取当前登录用户的消息列表（会话列表）
 *     tags: [消息]
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
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       from_id:
 *                         type: integer
 *                         example: 2
 *                       username:
 *                         type: string
 *                         example: 好友小红
 *                       avatar:
 *                         type: string
 *                         example: https://example.com/avatar.jpg
 *                       last_message:
 *                         type: string
 *                         example: 你好呀
 *                       unread_count:
 *                         type: integer
 *                         example: 3
 *       401:
 *         description: 未登录或 token 无效
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', auth, async (req, res) => {
  const messages = await query(`
    SELECT 
      m.*,
      u.id as from_user_id, u.username, u.avatar,
      (SELECT content FROM messages WHERE (from_id = m.from_id AND to_id = m.to_id) OR (from_id = m.to_id AND to_id = m.from_id) ORDER BY created_at DESC LIMIT 1) as last_message,
      (SELECT COUNT(*) FROM messages WHERE (from_id = m.from_id AND to_id = m.to_id AND read_at IS NULL) OR (from_id = m.to_id AND to_id = m.from_id AND read_at IS NULL)) as unread_count
    FROM messages m
    JOIN users u ON m.from_id = u.id
    WHERE m.to_id = ?
    GROUP BY m.from_id
    ORDER BY MAX(m.created_at) DESC
  `, [req.user.id])

  res.json(success(messages, '获取成功'))
})

/**
 * @swagger
 * /api/message/chat/{userId}:
 *   get:
 *     summary: 获取聊天记录
 *     description: 获取与指定用户的聊天记录
 *     tags: [消息]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         type: integer
 *         description: 对方用户 ID
 *       - name: page
 *         in: query
 *         type: integer
 *         description: 页码
 *         default: 1
 *       - name: size
 *         in: query
 *         type: integer
 *         description: 每页数量
 *         default: 20
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
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Message'
 *       401:
 *         description: 未登录或 token 无效
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/chat/:userId', auth, async (req, res) => {
  const { userId } = req.params
  const { page = 1, size = 20 } = req.query
  const offset = (page - 1) * size

  const messages = await query(`
    SELECT m.*, u.username, u.avatar 
    FROM messages m
    JOIN users u ON m.from_id = u.id
    WHERE (m.from_id = ? AND m.to_id = ?) OR (m.from_id = ? AND m.to_id = ?)
    ORDER BY m.created_at DESC
    LIMIT ? OFFSET ?
  `, [req.user.id, userId, userId, req.user.id, size, offset])

  await query(`
    UPDATE messages SET read_at = NOW() 
    WHERE from_id = ? AND to_id = ? AND read_at IS NULL
  `, [userId, req.user.id])

  res.json(success(messages.reverse(), '获取成功'))
})

/**
 * @swagger
 * /api/message/send:
 *   post:
 *     summary: 发送消息
 *     description: 向指定用户发送消息
 *     tags: [消息]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               toId:
 *                 type: integer
 *                 description: 接收者用户 ID
 *                 example: 2
 *               content:
 *                 type: string
 *                 description: 消息内容
 *                 example: 你好呀
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
 *                   example: 发送成功
 *                 data:
 *                   $ref: '#/components/schemas/Message'
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
router.post('/send', auth, async (req, res) => {
  const { toId, content } = req.body

  if (!toId || !content) {
    return res.status(400).json(error('参数错误', 400))
  }

  const result = await query(
    'INSERT INTO messages (from_id, to_id, content, created_at) VALUES (?, ?, ?, NOW())',
    [req.user.id, toId, content]
  )

  const message = await query(
    'SELECT m.*, u.username, u.avatar FROM messages m JOIN users u ON m.from_id = u.id WHERE m.id = ?',
    [result.insertId]
  )

  res.json(success(message[0], '发送成功'))
})

/**
 * @swagger
 * /api/message/unread/count:
 *   get:
 *     summary: 获取未读消息数量
 *     description: 获取当前登录用户的未读消息总数
 *     tags: [消息]
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
 *                   type: object
 *                   properties:
 *                     count:
 *                       type: integer
 *                       example: 5
 *       401:
 *         description: 未登录或 token 无效
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/unread/count', auth, async (req, res) => {
  const count = await query(
    'SELECT COUNT(*) as count FROM messages WHERE to_id = ? AND read_at IS NULL',
    [req.user.id]
  )

  res.json(success({ count: count[0].count }, '获取成功'))
})

/**
 * @swagger
 * /api/message/read:
 *   post:
 *     summary: 标记消息已读
 *     description: 标记来自指定用户的消息为已读
 *     tags: [消息]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fromId:
 *                 type: integer
 *                 description: 发送者用户 ID
 *                 example: 2
 *     responses:
 *       200:
 *         description: 操作成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: 未登录或 token 无效
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/read', auth, async (req, res) => {
  const { fromId } = req.body

  await query(
    'UPDATE messages SET read_at = NOW() WHERE from_id = ? AND to_id = ? AND read_at IS NULL',
    [fromId, req.user.id]
  )

  res.json(success(null, '已标记为已读'))
})

module.exports = router
