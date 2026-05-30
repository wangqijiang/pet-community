const express = require('express')
const router = express.Router()
const { query } = require('../config/db')
const { auth } = require('../middleware/auth')
const { success, error, pagination } = require('../utils/response')

/**
 * 获取攻略列表
 */
router.get('/', async (req, res) => {
  const { page = 1, size = 10, pet_type, category, keyword } = req.query
  const pageNum = parseInt(page)
  const sizeNum = parseInt(size)
  const offset = (pageNum - 1) * sizeNum

  try {
    let sql = `
      SELECT g.*, u.username as author_name, u.avatar as author_avatar
      FROM guides g
      LEFT JOIN users u ON g.author_id = u.id
      WHERE g.status = 1
    `
    const params = []

    if (pet_type) {
      sql += ' AND g.pet_type = ?'
      params.push(pet_type)
    }

    if (category) {
      sql += ' AND g.category = ?'
      params.push(category)
    }

    if (keyword) {
      sql += ' AND (g.title LIKE ? OR g.content LIKE ?)'
      params.push(`%${keyword}%`, `%${keyword}%`)
    }

    sql += ' ORDER BY g.created_at DESC LIMIT ? OFFSET ?'
    params.push(sizeNum, offset)

    const guides = await query(sql, params)

    let countSql = 'SELECT COUNT(*) as count FROM guides WHERE status = 1'
    const countParams = []
    if (pet_type) {
      countSql += ' AND pet_type = ?'
      countParams.push(pet_type)
    }
    if (category) {
      countSql += ' AND category = ?'
      countParams.push(category)
    }
    if (keyword) {
      countSql += ' AND (title LIKE ? OR content LIKE ?)'
      countParams.push(`%${keyword}%`, `%${keyword}%`)
    }
    const total = await query(countSql, countParams)

    res.json(pagination(guides, total[0].count, pageNum, sizeNum))
  } catch (err) {
    console.error('获取攻略列表失败:', err)
    res.status(500).json(error('获取失败', 500))
  }
})

/**
 * 获取攻略详情
 */
router.get('/:id', async (req, res) => {
  const { id } = req.params

  try {
    const guides = await query(`
      SELECT g.*, u.username as author_name, u.avatar as author_avatar
      FROM guides g
      LEFT JOIN users u ON g.author_id = u.id
      WHERE g.id = ? AND g.status = 1
    `, [id])

    if (guides.length === 0) {
      return res.status(404).json(error('攻略不存在', 404))
    }

    // 增加浏览数
    await query('UPDATE guides SET views_count = views_count + 1 WHERE id = ?', [id])

    res.json(success(guides[0], '获取成功'))
  } catch (err) {
    console.error('获取攻略详情失败:', err)
    res.status(500).json(error('获取失败', 500))
  }
})

/**
 * 点赞攻略
 */
router.post('/:id/like', auth, async (req, res) => {
  const { id } = req.params

  try {
    const guides = await query('SELECT id FROM guides WHERE id = ? AND status = 1', [id])
    if (guides.length === 0) {
      return res.status(404).json(error('攻略不存在', 404))
    }

    // 检查是否已点赞
    const existing = await query(
      'SELECT id FROM likes WHERE user_id = ? AND target_id = ? AND target_type = ?',
      [req.user.id, id, 'guide']
    )

    if (existing.length > 0) {
      await query('DELETE FROM likes WHERE id = ?', [existing[0].id])
      await query('UPDATE guides SET likes_count = GREATEST(likes_count - 1, 0) WHERE id = ?', [id])
      res.json(success({ liked: false }, '取消点赞'))
    } else {
      await query(
        'INSERT INTO likes (user_id, target_id, target_type, created_at) VALUES (?, ?, ?, NOW())',
        [req.user.id, id, 'guide']
      )
      await query('UPDATE guides SET likes_count = likes_count + 1 WHERE id = ?', [id])
      res.json(success({ liked: true }, '点赞成功'))
    }
  } catch (err) {
    console.error('点赞操作失败:', err)
    res.status(500).json(error('操作失败', 500))
  }
})

/**
 * 收藏攻略
 */
router.post('/:id/favorite', auth, async (req, res) => {
  const { id } = req.params

  try {
    const guides = await query('SELECT id FROM guides WHERE id = ? AND status = 1', [id])
    if (guides.length === 0) {
      return res.status(404).json(error('攻略不存在', 404))
    }

    const existing = await query(
      'SELECT id FROM favorites WHERE user_id = ? AND target_id = ? AND target_type = ?',
      [req.user.id, id, 'guide']
    )

    if (existing.length > 0) {
      await query('DELETE FROM favorites WHERE id = ?', [existing[0].id])
      await query('UPDATE guides SET favorites_count = GREATEST(favorites_count - 1, 0) WHERE id = ?', [id])
      res.json(success({ favorited: false }, '取消收藏'))
    } else {
      await query(
        'INSERT INTO favorites (user_id, target_id, target_type, created_at) VALUES (?, ?, ?, NOW())',
        [req.user.id, id, 'guide']
      )
      await query('UPDATE guides SET favorites_count = favorites_count + 1 WHERE id = ?', [id])
      res.json(success({ favorited: true }, '收藏成功'))
    }
  } catch (err) {
    console.error('收藏操作失败:', err)
    res.status(500).json(error('操作失败', 500))
  }
})

/**
 * 获取攻略分类
 */
router.get('/meta/categories', async (req, res) => {
  try {
    const categories = await query(
      'SELECT DISTINCT category FROM guides WHERE status = 1 AND category IS NOT NULL ORDER BY category'
    )

    res.json(success(categories.map(c => c.category), '获取成功'))
  } catch (err) {
    console.error('获取分类失败:', err)
    res.status(500).json(error('获取失败', 500))
  }
})

/**
 * 获取用户收藏的攻略列表
 */
router.get('/user/favorites', auth, async (req, res) => {
  const { page = 1, size = 10 } = req.query
  const offset = (page - 1) * size

  try {
    const guides = await query(`
      SELECT g.*, u.username as author_name, u.avatar as author_avatar
      FROM guides g
      JOIN favorites f ON g.id = f.target_id AND f.target_type = 'guide'
      LEFT JOIN users u ON g.author_id = u.id
      WHERE f.user_id = ? AND g.status = 1
      ORDER BY f.created_at DESC
      LIMIT ? OFFSET ?
    `, [req.user.id, parseInt(size), parseInt(offset)])

    const total = await query(
      'SELECT COUNT(*) as count FROM favorites WHERE user_id = ? AND target_type = ?',
      [req.user.id, 'guide']
    )

    res.json({
      success: true,
      message: '获取成功',
      data: {
        list: guides,
        pagination: {
          total: total[0].count,
          page: parseInt(page),
          size: parseInt(size),
          pages: Math.ceil(total[0].count / size)
        }
      }
    })
  } catch (err) {
    console.error('获取收藏列表失败:', err)
    res.status(500).json(error('获取失败', 500))
  }
})

module.exports = router
