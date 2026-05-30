const express = require('express')
const router = express.Router()
const { query } = require('../config/db')
const { auth } = require('../middleware/auth')
const { success, error } = require('../utils/response')

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
 */
router.get('/unread/count', auth, async (req, res) => {
  try {
    const result = await query(
      'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = 0',
      [req.user.id]
    )

    res.json(success({ count: result[0].count }, '获取成功'))
  } catch (err) {
    console.error('获取未读通知数失败:', err)
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
      // 标记指定通知为已读
      await query(
        'UPDATE notifications SET is_read = 1 WHERE id IN (?) AND user_id = ?',
        [ids, req.user.id]
      )
    } else {
      // 标记所有通知为已读
      await query(
        'UPDATE notifications SET is_read = 1 WHERE user_id = ?',
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
