const express = require('express')
const router = express.Router()
const { query } = require('../config/db')
const { auth } = require('../middleware/auth')
const { success, error, pagination } = require('../utils/response')

/**
 * 获取地点列表
 */
router.get('/', async (req, res) => {
  const { page = 1, size = 10, type = '', keyword = '', lat, lng, radius = 10 } = req.query
  const pageNum = parseInt(page)
  const sizeNum = parseInt(size)
  const offset = (pageNum - 1) * sizeNum

  try {
    let sql = `
      SELECT p.*, 
        (SELECT COUNT(*) FROM place_likes WHERE place_id = p.id) as likes,
        (SELECT COUNT(*) FROM place_reviews WHERE place_id = p.id AND status = 1) as reviews_count
      FROM places p 
      WHERE p.status = 1
    `
    const params = []

    if (type) {
      sql += ' AND p.type = ?'
      params.push(type)
    }

    if (keyword) {
      sql += ' AND (p.name LIKE ? OR p.address LIKE ? OR p.description LIKE ?)'
      params.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`)
    }

    // 如果提供了经纬度，按距离排序
    if (lat && lng) {
      sql = `
        SELECT p.*, 
          (SELECT COUNT(*) FROM place_likes WHERE place_id = p.id) as likes,
          (SELECT COUNT(*) FROM place_reviews WHERE place_id = p.id AND status = 1) as reviews_count,
          (6371 * ACOS(COS(RADIANS(?)) * COS(RADIANS(p.latitude)) * COS(RADIANS(p.longitude) - RADIANS(?)) + SIN(RADIANS(?)) * SIN(RADIANS(p.latitude)))) AS distance
        FROM places p 
        WHERE p.status = 1
      `
      params.unshift(parseFloat(lat), parseFloat(lng), parseFloat(lat))
      
      if (type) {
        sql += ' AND p.type = ?'
        params.push(type)
      }
      if (keyword) {
        sql += ' AND (p.name LIKE ? OR p.address LIKE ? OR p.description LIKE ?)'
        params.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`)
      }
      
      sql += ' HAVING distance <= ? ORDER BY distance ASC'
      params.push(parseFloat(radius))
    } else {
      sql += ' ORDER BY p.rating DESC, p.likes DESC'
    }

    sql += ' LIMIT ? OFFSET ?'
    params.push(sizeNum, offset)

    const places = await query(sql, params)

    // 解析JSON字段
    for (let place of places) {
      if (typeof place.images === 'string') {
        place.images = JSON.parse(place.images)
      }
      if (typeof place.amenities === 'string') {
        place.amenities = JSON.parse(place.amenities)
      }
    }

    let countSql = 'SELECT COUNT(*) as count FROM places WHERE status = 1'
    const countParams = []
    if (type) {
      countSql += ' AND type = ?'
      countParams.push(type)
    }
    if (keyword) {
      countSql += ' AND (name LIKE ? OR address LIKE ? OR description LIKE ?)'
      countParams.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`)
    }
    const total = await query(countSql, countParams)

    res.json(pagination(places, total[0].count, pageNum, sizeNum))
  } catch (err) {
    console.error('获取地点列表失败:', err)
    res.status(500).json(error('获取失败', 500))
  }
})

/**
 * 获取地点详情
 */
router.get('/:id', async (req, res) => {
  const { id } = req.params

  try {
    const places = await query(`
      SELECT p.*, 
        (SELECT COUNT(*) FROM place_likes WHERE place_id = p.id) as likes,
        (SELECT COUNT(*) FROM place_reviews WHERE place_id = p.id AND status = 1) as reviews_count
      FROM places p 
      WHERE p.id = ? AND p.status = 1
    `, [id])

    if (places.length === 0) {
      return res.status(404).json(error('地点不存在', 404))
    }

    const place = places[0]
    if (typeof place.images === 'string') {
      place.images = JSON.parse(place.images)
    }
    if (typeof place.amenities === 'string') {
      place.amenities = JSON.parse(place.amenities)
    }

    // 获取评价列表
    const reviews = await query(`
      SELECT r.*, u.username, u.avatar 
      FROM place_reviews r 
      JOIN users u ON r.user_id = u.id 
      WHERE r.place_id = ? AND r.status = 1 
      ORDER BY r.created_at DESC 
      LIMIT 10
    `, [id])

    place.reviews = reviews

    res.json(success(place, '获取成功'))
  } catch (err) {
    console.error('获取地点详情失败:', err)
    res.status(500).json(error('获取失败', 500))
  }
})

/**
 * 点赞/收藏地点
 */
router.post('/:id/like', auth, async (req, res) => {
  const { id } = req.params

  try {
    const places = await query('SELECT * FROM places WHERE id = ? AND status = 1', [id])
    if (places.length === 0) {
      return res.status(404).json(error('地点不存在', 404))
    }

    const existing = await query(
      'SELECT id FROM place_likes WHERE user_id = ? AND place_id = ?',
      [req.user.id, id]
    )

    if (existing.length > 0) {
      await query('DELETE FROM place_likes WHERE id = ?', [existing[0].id])
      await query('UPDATE places SET likes_count = GREATEST(likes_count - 1, 0) WHERE id = ?', [id])
      res.json(success({ liked: false }, '取消收藏'))
    } else {
      await query(
        'INSERT INTO place_likes (user_id, place_id, created_at) VALUES (?, ?, NOW())',
        [req.user.id, id]
      )
      await query('UPDATE places SET likes_count = likes_count + 1 WHERE id = ?', [id])
      res.json(success({ liked: true }, '收藏成功'))
    }
  } catch (err) {
    console.error('收藏操作失败:', err)
    res.status(500).json(error('操作失败', 500))
  }
})

/**
 * 发表评价
 */
router.post('/:id/reviews', auth, async (req, res) => {
  const { id } = req.params
  const { rating, content, images } = req.body

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json(error('请提供有效评分(1-5)', 400))
  }

  try {
    const places = await query('SELECT * FROM places WHERE id = ? AND status = 1', [id])
    if (places.length === 0) {
      return res.status(404).json(error('地点不存在', 404))
    }

    // 检查是否已评价
    const existing = await query(
      'SELECT id FROM place_reviews WHERE user_id = ? AND place_id = ?',
      [req.user.id, id]
    )

    if (existing.length > 0) {
      // 更新评价
      await query(
        'UPDATE place_reviews SET rating = ?, content = ?, images = ?, updated_at = NOW() WHERE id = ?',
        [rating, content, JSON.stringify(images || []), existing[0].id]
      )
    } else {
      // 新增评价
      await query(
        'INSERT INTO place_reviews (place_id, user_id, rating, content, images, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
        [id, req.user.id, rating, content, JSON.stringify(images || [])]
      )
      await query('UPDATE places SET reviews_count = reviews_count + 1 WHERE id = ?', [id])
    }

    // 更新地点评分
    const avgRating = await query(
      'SELECT AVG(rating) as avg_rating FROM place_reviews WHERE place_id = ? AND status = 1',
      [id]
    )
    await query('UPDATE places SET rating = ? WHERE id = ?', [avgRating[0].avg_rating || 0, id])

    res.json(success(null, '评价成功'))
  } catch (err) {
    console.error('发表评价失败:', err)
    res.status(500).json(error('评价失败', 500))
  }
})

/**
 * 获取地点评价列表
 */
router.get('/:id/reviews', async (req, res) => {
  const { id } = req.params
  const { page = 1, size = 10 } = req.query
  const offset = (page - 1) * size

  try {
    const reviews = await query(`
      SELECT r.*, u.username, u.avatar 
      FROM place_reviews r 
      JOIN users u ON r.user_id = u.id 
      WHERE r.place_id = ? AND r.status = 1 
      ORDER BY r.created_at DESC 
      LIMIT ? OFFSET ?
    `, [id, parseInt(size), parseInt(offset)])

    // 解析JSON字段
    for (let review of reviews) {
      if (typeof review.images === 'string') {
        review.images = JSON.parse(review.images)
      }
    }

    const total = await query(
      'SELECT COUNT(*) as count FROM place_reviews WHERE place_id = ? AND status = 1',
      [id]
    )

    res.json({
      success: true,
      message: '获取成功',
      data: {
        list: reviews,
        pagination: {
          total: total[0].count,
          page: parseInt(page),
          size: parseInt(size),
          pages: Math.ceil(total[0].count / size)
        }
      }
    })
  } catch (err) {
    console.error('获取评价列表失败:', err)
    res.status(500).json(error('获取失败', 500))
  }
})

/**
 * 获取用户收藏的地点列表
 */
router.get('/user/favorites', auth, async (req, res) => {
  const { page = 1, size = 10 } = req.query
  const offset = (page - 1) * size

  try {
    const places = await query(`
      SELECT p.*, 
        (SELECT COUNT(*) FROM place_likes WHERE place_id = p.id) as likes,
        (SELECT COUNT(*) FROM place_reviews WHERE place_id = p.id AND status = 1) as reviews_count
      FROM places p
      JOIN place_likes pl ON p.id = pl.place_id
      WHERE pl.user_id = ? AND p.status = 1
      ORDER BY pl.created_at DESC
      LIMIT ? OFFSET ?
    `, [req.user.id, parseInt(size), parseInt(offset)])

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

/**
 * 获取地点类型统计
 */
router.get('/types/stats', async (req, res) => {
  try {
    const stats = await query(`
      SELECT type, COUNT(*) as count 
      FROM places 
      WHERE status = 1 
      GROUP BY type
    `)

    res.json(success(stats, '获取成功'))
  } catch (err) {
    console.error('获取类型统计失败:', err)
    res.status(500).json(error('获取失败', 500))
  }
})

module.exports = router
