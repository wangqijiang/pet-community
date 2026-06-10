const express = require('express')
const router = express.Router()
const { query } = require('../config/db')
const { auth, optionalAuth } = require('../middleware/auth')
const { success, error, pagination } = require('../utils/response')
const {
  validateReviewContent,
  validateImagesArray,
} = require('../utils/validate')
const { requireUgcEligible } = require('../utils/newUserGuard')
const { reviewCreateLimiter } = require('../middleware/writeRateLimit')

const PLACE_COLUMNS = `
  p.*,
  pc.label AS category_label,
  (SELECT COUNT(*) FROM place_likes WHERE place_id = p.id) AS likes,
  (SELECT COUNT(*) FROM place_reviews WHERE place_id = p.id AND status = 1) AS reviews_count
`

const PLACE_FROM = `
  FROM places p
  LEFT JOIN place_categories pc ON p.type = pc.key AND pc.status = 1
`

function parseJson(val, fallback = null) {
  if (val == null) return fallback
  if (typeof val === 'object') return val
  try {
    return JSON.parse(val)
  } catch {
    return fallback
  }
}

function parsePlaceJsonFields(place) {
  place.images = parseJson(place.images, [])
  place.amenities = parseJson(place.amenities, [])
  return place
}

/**
 * 获取场所分类列表
 */
router.get('/categories', async (req, res) => {
  try {
    const categories = await query(
      'SELECT `key`, label FROM place_categories WHERE status = 1 ORDER BY sort_order ASC, id ASC'
    )
    res.json(success(categories, '获取成功'))
  } catch (err) {
    console.error('获取场所分类失败:', err)
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
      SELECT ${PLACE_COLUMNS}
      ${PLACE_FROM}
      JOIN place_likes pl ON p.id = pl.place_id
      WHERE pl.user_id = ? AND p.status = 1
      ORDER BY pl.created_at DESC
      LIMIT ? OFFSET ?
    `, [req.user.id, parseInt(size), parseInt(offset)])

    places.forEach(parsePlaceJsonFields)

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

/**
 * 获取地点列表
 */
router.get('/', async (req, res) => {
  const {
    page = 1,
    size = 10,
    type = '',
    category = '',
    keyword = '',
    lat,
    lng,
    radius = 50,
  } = req.query
  const pageNum = parseInt(page)
  const sizeNum = parseInt(size)
  const offset = (pageNum - 1) * sizeNum
  const categoryFilter = category || type

  try {
    const filters = ['p.status = 1']
    const params = []

    if (lat && lng) {
      filters.push('p.latitude IS NOT NULL', 'p.longitude IS NOT NULL', 'p.latitude != 0', 'p.longitude != 0')
    }

    if (categoryFilter) {
      filters.push('p.type = ?')
      params.push(categoryFilter)
    }

    if (keyword) {
      filters.push('(p.name LIKE ? OR p.address LIKE ? OR p.description LIKE ?)')
      params.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`)
    }

    const whereClause = filters.join(' AND ')
    let sql
    let listParams

    if (lat && lng) {
      const latNum = parseFloat(lat)
      const lngNum = parseFloat(lng)
      sql = `
        SELECT ${PLACE_COLUMNS},
          (6371 * ACOS(
            COS(RADIANS(?)) * COS(RADIANS(p.latitude)) *
            COS(RADIANS(p.longitude) - RADIANS(?)) +
            SIN(RADIANS(?)) * SIN(RADIANS(p.latitude))
          )) AS distance
        ${PLACE_FROM}
        WHERE ${whereClause}
        HAVING distance <= ?
        ORDER BY distance ASC
        LIMIT ? OFFSET ?
      `
      listParams = [latNum, lngNum, latNum, ...params, parseFloat(radius), sizeNum, offset]
    } else {
      sql = `
        SELECT ${PLACE_COLUMNS}
        ${PLACE_FROM}
        WHERE ${whereClause}
        ORDER BY p.rating DESC, p.likes DESC
        LIMIT ? OFFSET ?
      `
      listParams = [...params, sizeNum, offset]
    }

    const places = await query(sql, listParams)
    places.forEach(parsePlaceJsonFields)

    let countSql = `SELECT COUNT(*) as count FROM places p WHERE ${whereClause}`
    const countParams = [...params]
    if (lat && lng) {
      countSql = `
        SELECT COUNT(*) as count FROM (
          SELECT p.id,
            (6371 * ACOS(
              COS(RADIANS(?)) * COS(RADIANS(p.latitude)) *
              COS(RADIANS(p.longitude) - RADIANS(?)) +
              SIN(RADIANS(?)) * SIN(RADIANS(p.latitude))
            )) AS distance
          FROM places p
          WHERE ${whereClause}
          HAVING distance <= ?
        ) t
      `
      countParams.unshift(parseFloat(lat), parseFloat(lng), parseFloat(lat))
      countParams.push(parseFloat(radius))
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
router.get('/:id/liked', auth, async (req, res) => {
  const { id } = req.params
  try {
    const rows = await query(
      'SELECT id FROM place_likes WHERE user_id = ? AND place_id = ?',
      [req.user.id, id]
    )
    res.json(success({ liked: rows.length > 0 }, '获取成功'))
  } catch (err) {
    console.error('查询地点点赞状态失败:', err)
    res.status(500).json(error('获取失败', 500))
  }
})

router.get('/:id', optionalAuth, async (req, res) => {
  const { id } = req.params

  try {
    const places = await query(`
      SELECT ${PLACE_COLUMNS}
      ${PLACE_FROM}
      WHERE p.id = ? AND p.status = 1
    `, [id])

    if (places.length === 0) {
      return res.status(404).json(error('地点不存在', 404))
    }

    const place = parsePlaceJsonFields(places[0])

    if (req.user?.id) {
      const liked = await query(
        'SELECT id FROM place_likes WHERE user_id = ? AND place_id = ?',
        [req.user.id, id]
      )
      place.liked = liked.length > 0
    } else {
      place.liked = false
    }

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
      res.json(success({ liked: false }, '已取消点赞'))
    } else {
      await query(
        'INSERT INTO place_likes (user_id, place_id, created_at) VALUES (?, ?, NOW())',
        [req.user.id, id]
      )
      await query('UPDATE places SET likes_count = likes_count + 1 WHERE id = ?', [id])
      res.json(success({ liked: true }, '点赞成功'))
    }
  } catch (err) {
    console.error('地点点赞操作失败:', err)
    res.status(500).json(error('操作失败', 500))
  }
})

/**
 * 发表评价
 */
router.post('/:id/reviews', auth, requireUgcEligible, reviewCreateLimiter, async (req, res) => {
  const { id } = req.params
  const { rating, content, images } = req.body

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json(error('请提供有效评分(1-5)', 400))
  }

  const contentErr = validateReviewContent(content)
  if (contentErr) {
    return res.status(400).json(error(contentErr, 400))
  }

  const imagesErr = validateImagesArray(images)
  if (imagesErr) {
    return res.status(400).json(error(imagesErr, 400))
  }

  try {
    const places = await query('SELECT * FROM places WHERE id = ? AND status = 1', [id])
    if (places.length === 0) {
      return res.status(404).json(error('地点不存在', 404))
    }

    const existing = await query(
      'SELECT id FROM place_reviews WHERE user_id = ? AND place_id = ?',
      [req.user.id, id]
    )

    if (existing.length > 0) {
      await query(
        'UPDATE place_reviews SET rating = ?, content = ?, images = ?, updated_at = NOW() WHERE id = ?',
        [rating, content, JSON.stringify(images || []), existing[0].id]
      )
    } else {
      await query(
        'INSERT INTO place_reviews (place_id, user_id, rating, content, images, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
        [id, req.user.id, rating, content, JSON.stringify(images || [])]
      )
      await query('UPDATE places SET reviews_count = reviews_count + 1 WHERE id = ?', [id])
    }

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

    for (const review of reviews) {
      review.images = parseJson(review.images, [])
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

module.exports = router
