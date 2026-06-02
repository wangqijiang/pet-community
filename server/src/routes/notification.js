const express = require('express')
const router = express.Router()
const { query } = require('../config/db')
const { auth } = require('../middleware/auth')
const { success, error } = require('../utils/response')

/** 标记私信通知已读时，同步 messages 表 */
async function syncMessagesReadForNotifications(userId, ids) {
  if (!ids?.length) return

  const rows = await query(
    `SELECT DISTINCT from_user_id FROM notifications
     WHERE id IN (?) AND user_id = ? AND type = 'message' AND from_user_id IS NOT NULL`,
    [ids, userId]
  )

  for (const row of rows) {
    await query(
      'UPDATE messages SET read_at = NOW() WHERE from_id = ? AND to_id = ? AND read_at IS NULL',
      [row.from_user_id, userId]
    )
  }
}

/** 标记全部私信通知已读时，同步所有未读私信 */
async function syncAllMessagesRead(userId) {
  await query(
    'UPDATE messages SET read_at = NOW() WHERE to_id = ? AND read_at IS NULL',
    [userId]
  )
}

/**
 * 获取通知列表
 */
router.get('/', auth, async (req, res) => {
  const { page = 1, size = 20, type } = req.query
  const offset = (page - 1) * size

  try {
    let sql = `
      SELECT n.*, u.username as from_username, u.avatar as from_avatar
      FROM notifications n
      LEFT JOIN users u ON n.from_user_id = u.id
      WHERE n.user_id = ?
    `
    const params = [req.user.id]

    if (type) {
      sql += ' AND n.type = ?'
      params.push(type)
    }

    sql += ' ORDER BY n.created_at DESC LIMIT ? OFFSET ?'
    params.push(parseInt(size), parseInt(offset))

    const notifications = await query(sql, params)

    let countSql = 'SELECT COUNT(*) as count FROM notifications WHERE user_id = ?'
    const countParams = [req.user.id]
    if (type) {
      countSql += ' AND type = ?'
      countParams.push(type)
    }
    const total = await query(countSql, countParams)

    res.json({
      success: true,
      message: '获取成功',
      data: {
        list: notifications,
        pagination: {
          total: total[0].count,
          page: parseInt(page),
          size: parseInt(size),
          pages: Math.ceil(total[0].count / size)
        }
      }
    })
  } catch (err) {
    console.error('获取通知列表失败:', err)
    res.status(500).json(error('获取失败', 500))
  }
})

/**
 * 获取未读通知数量
 * query: exclude_type — 排除某类型（如 message，避免与私信未读重复计数）
 */
router.get('/unread/count', auth, async (req, res) => {
  const { exclude_type: excludeType } = req.query

  try {
    let sql = 'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = 0'
    const params = [req.user.id]
    if (excludeType) {
      sql += ' AND type != ?'
      params.push(excludeType)
    }

    const result = await query(sql, params)

    res.json(success({ count: result[0].count }, '获取成功'))
  } catch (err) {
    console.error('获取未读通知数失败:', err)
    res.status(500).json(error('获取失败', 500))
  }
})

/**
 * 按类型汇总未读通知数
 */
router.get('/unread/summary', auth, async (req, res) => {
  try {
    const rows = await query(
      `SELECT type, COUNT(*) AS count FROM notifications
       WHERE user_id = ? AND is_read = 0
       GROUP BY type`,
      [req.user.id]
    )

    const summary = { like: 0, comment: 0, follow: 0, message: 0, system: 0 }
    for (const row of rows) {
      if (Object.prototype.hasOwnProperty.call(summary, row.type)) {
        summary[row.type] = row.count
      }
    }

    res.json(success(summary, '获取成功'))
  } catch (err) {
    console.error('获取未读通知汇总失败:', err)
    res.status(500).json(error('获取失败', 500))
  }
})

/**
 * 获取通知详情
 */
router.get('/:id', auth, async (req, res) => {
  const { id } = req.params

  try {
    const rows = await query(`
      SELECT n.*, u.username as from_username, u.avatar as from_avatar
      FROM notifications n
      LEFT JOIN users u ON n.from_user_id = u.id
      WHERE n.id = ? AND n.user_id = ?
    `, [id, req.user.id])

    if (rows.length === 0) {
      return res.status(404).json(error('通知不存在', 404))
    }

    if (!rows[0].is_read) {
      await query('UPDATE notifications SET is_read = 1 WHERE id = ?', [id])
      rows[0].is_read = 1
    }

    res.json(success(rows[0], '获取成功'))
  } catch (err) {
    console.error('获取通知详情失败:', err)
    res.status(500).json(error('获取失败', 500))
  }
})

/**
 * 标记通知已读
 */
router.post('/read', auth, async (req, res) => {
  const { ids } = req.body

  try {
    if (ids && ids.length > 0) {
      await query(
        'UPDATE notifications SET is_read = 1 WHERE id IN (?) AND user_id = ?',
        [ids, req.user.id]
      )
      await syncMessagesReadForNotifications(req.user.id, ids)
    } else {
      await query(
        'UPDATE notifications SET is_read = 1 WHERE user_id = ?',
        [req.user.id]
      )
      await syncAllMessagesRead(req.user.id)
    }

    res.json(success(null, '已标记为已读'))
  } catch (err) {
    console.error('标记已读失败:', err)
    res.status(500).json(error('操作失败', 500))
  }
})

/**
 * 删除通知
 */
router.delete('/:id', auth, async (req, res) => {
  const { id } = req.params

  try {
    const result = await query(
      'DELETE FROM notifications WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    )

    if (result.affectedRows === 0) {
      return res.status(404).json(error('通知不存在', 404))
    }

    res.json(success(null, '删除成功'))
  } catch (err) {
    console.error('删除通知失败:', err)
    res.status(500).json(error('删除失败', 500))
  }
})

/**
 * 清空所有通知
 */
router.delete('/', auth, async (req, res) => {
  try {
    await query('DELETE FROM notifications WHERE user_id = ?', [req.user.id])

    res.json(success(null, '清空成功'))
  } catch (err) {
    console.error('清空通知失败:', err)
    res.status(500).json(error('清空失败', 500))
  }
})

module.exports = router
