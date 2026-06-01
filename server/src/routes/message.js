const express = require('express')
const router = express.Router()
const { query } = require('../config/db')
const { auth } = require('../middleware/auth')
const { success, error } = require('../utils/response')
const { pushToUser, pushNotificationById } = require('../utils/realtime')

/**
 * 获取会话列表
 */
router.get('/', auth, async (req, res) => {
  try {
    const conversations = await query(`
      SELECT
        t.other_id AS user_id,
        u.username,
        u.avatar,
        m.content AS last_message,
        m.type AS last_message_type,
        m.created_at AS last_time,
        (SELECT COUNT(*) FROM messages
          WHERE from_id = t.other_id AND to_id = ? AND read_at IS NULL) AS unread_count
      FROM (
        SELECT
          CASE WHEN from_id = ? THEN to_id ELSE from_id END AS other_id,
          MAX(id) AS max_id
        FROM messages
        WHERE from_id = ? OR to_id = ?
        GROUP BY other_id
      ) t
      JOIN messages m ON m.id = t.max_id
      JOIN users u ON u.id = t.other_id AND u.status = 1
      ORDER BY m.created_at DESC
    `, [req.user.id, req.user.id, req.user.id, req.user.id])

    res.json(success(conversations, '获取成功'))
  } catch (err) {
    console.error('获取会话列表失败:', err)
    res.status(500).json(error('获取失败', 500))
  }
})

/**
 * 获取与指定用户的聊天记录
 */
router.get('/chat/:userId', auth, async (req, res) => {
  const { userId } = req.params
  const { page = 1, size = 20 } = req.query
  const offset = (page - 1) * size

  try {
    const messages = await query(`
      SELECT m.*, 
        u_from.username as from_username, u_from.avatar as from_avatar,
        u_to.username as to_username, u_to.avatar as to_avatar
      FROM messages m
      JOIN users u_from ON m.from_id = u_from.id
      JOIN users u_to ON m.to_id = u_to.id
      WHERE (m.from_id = ? AND m.to_id = ?) OR (m.from_id = ? AND m.to_id = ?)
      ORDER BY m.created_at DESC
      LIMIT ? OFFSET ?
    `, [req.user.id, userId, userId, req.user.id, parseInt(size), parseInt(offset)])

    // 标记消息为已读
    await query(`
      UPDATE messages SET read_at = NOW() 
      WHERE from_id = ? AND to_id = ? AND read_at IS NULL
    `, [userId, req.user.id])

    // 同步标记对应私信系统通知为已读
    await query(`
      UPDATE notifications SET is_read = 1
      WHERE user_id = ? AND from_user_id = ? AND type = 'message' AND is_read = 0
    `, [req.user.id, userId])

    res.json(success(messages.reverse(), '获取成功'))
  } catch (err) {
    console.error('获取聊天记录失败:', err)
    res.status(500).json(error('获取失败', 500))
  }
})

/**
 * 发送消息
 */
router.post('/send', auth, async (req, res) => {
  const { toId, content, type = 'text' } = req.body

  if (!toId || !content) {
    return res.status(400).json(error('请填写完整信息', 400))
  }

  if (toId === req.user.id) {
    return res.status(400).json(error('不能给自己发送消息', 400))
  }

  try {
    // 检查接收者是否存在
    const users = await query('SELECT id FROM users WHERE id = ? AND status = 1', [toId])
    if (users.length === 0) {
      return res.status(404).json(error('用户不存在', 404))
    }

    // 插入消息
    const result = await query(
      'INSERT INTO messages (from_id, to_id, content, type, created_at) VALUES (?, ?, ?, ?, NOW())',
      [req.user.id, toId, content, type]
    )

    // 获取完整消息
    const message = await query(`
      SELECT m.*, 
        u_from.username as from_username, u_from.avatar as from_avatar,
        u_to.username as to_username, u_to.avatar as to_avatar
      FROM messages m
      JOIN users u_from ON m.from_id = u_from.id
      JOIN users u_to ON m.to_id = u_to.id
      WHERE m.id = ?
    `, [result.insertId])

    const notifResult = await query(
      'INSERT INTO notifications (user_id, from_user_id, type, title, content, target_id, target_type) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [toId, req.user.id, 'message', '新消息', `${req.user.username}给你发送了一条消息`, req.user.id, 'user']
    )

    const payload = message[0]
    pushToUser(toId, { type: 'message', data: payload })
    pushToUser(req.user.id, { type: 'message', data: payload })
    await pushNotificationById(notifResult.insertId)

    res.json(success(payload, '发送成功'))
  } catch (err) {
    console.error('发送消息失败:', err)
    res.status(500).json(error('发送失败', 500))
  }
})

/**
 * 获取未读消息数
 */
router.get('/unread/count', auth, async (req, res) => {
  try {
    const result = await query(
      'SELECT COUNT(*) as count FROM messages WHERE to_id = ? AND read_at IS NULL',
      [req.user.id]
    )

    res.json(success({ count: result[0].count }, '获取成功'))
  } catch (err) {
    console.error('获取未读消息数失败:', err)
    res.status(500).json(error('获取失败', 500))
  }
})

/**
 * 标记消息已读
 */
router.post('/read', auth, async (req, res) => {
  const { fromId } = req.body

  try {
    if (fromId) {
      // 标记来自指定用户的消息为已读
      await query(
        'UPDATE messages SET read_at = NOW() WHERE from_id = ? AND to_id = ? AND read_at IS NULL',
        [fromId, req.user.id]
      )
      await query(
        `UPDATE notifications SET is_read = 1
         WHERE user_id = ? AND from_user_id = ? AND type = 'message' AND is_read = 0`,
        [req.user.id, fromId]
      )
    } else {
      // 标记所有消息为已读
      await query(
        'UPDATE messages SET read_at = NOW() WHERE to_id = ? AND read_at IS NULL',
        [req.user.id]
      )
    }

    res.json(success(null, '已标记为已读'))
  } catch (err) {
    console.error('标记已读失败:', err)
    res.status(500).json(error('操作失败', 500))
  }
})

/**
 * 删除会话
 */
router.delete('/chat/:userId', auth, async (req, res) => {
  const { userId } = req.params

  try {
    // 删除双方的聊天记录
    await query(
      'DELETE FROM messages WHERE (from_id = ? AND to_id = ?) OR (from_id = ? AND to_id = ?)',
      [req.user.id, userId, userId, req.user.id]
    )

    res.json(success(null, '删除成功'))
  } catch (err) {
    console.error('删除会话失败:', err)
    res.status(500).json(error('删除失败', 500))
  }
})

/**
 * 删除单条消息
 */
router.delete('/:messageId', auth, async (req, res) => {
  const { messageId } = req.params

  try {
    const message = await query(
      'SELECT * FROM messages WHERE id = ? AND (from_id = ? OR to_id = ?)',
      [messageId, req.user.id, req.user.id]
    )

    if (message.length === 0) {
      return res.status(404).json(error('消息不存在', 404))
    }

    await query('DELETE FROM messages WHERE id = ?', [messageId])

    res.json(success(null, '删除成功'))
  } catch (err) {
    console.error('删除消息失败:', err)
    res.status(500).json(error('删除失败', 500))
  }
})

module.exports = router
