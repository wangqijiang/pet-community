const express = require('express')
const router = express.Router()
const { query } = require('../config/db')
const { pushNotificationById } = require('../utils/realtime')
const { auth } = require('../middleware/auth')
const { success, error, pagination } = require('../utils/response')
const { upload, saveUploadedFile } = require('../utils/upload')

/** 动态/宠物数以实际数据为准，避免与 users 表缓存字段不一致 */
const USER_COUNT_FIELDS = `
  followers_count, following_count,
  (SELECT COUNT(*) FROM posts WHERE user_id = users.id AND status = 1) AS posts_count,
  (SELECT COUNT(*) FROM pets WHERE user_id = users.id AND status = 1) AS pets_count
`

/**
 * 获取当前用户信息
 */
router.get('/info', auth, async (req, res) => {
  try {
    const users = await query(`
      SELECT id, username, phone, avatar, signature, gender, birthday, region,
        ${USER_COUNT_FIELDS}, created_at
      FROM users WHERE id = ?
    `, [req.user.id])
    
    if (users.length === 0) {
      return res.status(404).json(error('用户不存在', 404))
    }

    res.json(success(users[0], '获取成功'))
  } catch (err) {
    console.error('获取用户信息失败:', err)
    res.status(500).json(error('获取失败', 500))
  }
})

/**
 * 获取指定用户信息
 */
router.get('/info/:id', async (req, res) => {
  const { id } = req.params
  
  try {
    const users = await query(`
      SELECT id, username, avatar, signature, gender, region,
        ${USER_COUNT_FIELDS}, created_at
      FROM users WHERE id = ? AND status = 1
    `, [id])
    
    if (users.length === 0) {
      return res.status(404).json(error('用户不存在', 404))
    }

    res.json(success(users[0], '获取成功'))
  } catch (err) {
    console.error('获取用户信息失败:', err)
    res.status(500).json(error('获取失败', 500))
  }
})

/**
 * 更新用户信息
 */
router.put('/info', auth, async (req, res) => {
  const { username, avatar, signature, gender, birthday, region } = req.body
  
  try {
    let updateFields = []
    let params = []
    
    if (username !== undefined) {
      updateFields.push('username = ?')
      params.push(username)
    }
    if (avatar !== undefined) {
      updateFields.push('avatar = ?')
      params.push(avatar)
    }
    if (signature !== undefined) {
      updateFields.push('signature = ?')
      params.push(signature)
    }
    if (gender !== undefined) {
      updateFields.push('gender = ?')
      params.push(gender)
    }
    if (birthday !== undefined) {
      // 验证日期格式
      if (birthday && !/^\d{4}-\d{2}-\d{2}$/.test(birthday)) {
        return res.status(400).json(error('日期格式不正确，应为YYYY-MM-DD', 400))
      }
      updateFields.push('birthday = ?')
      params.push(birthday || null)
    }
    if (region !== undefined) {
      updateFields.push('region = ?')
      params.push(region)
    }
    
    if (updateFields.length === 0) {
      return res.status(400).json(error('没有需要更新的字段', 400))
    }
    
    updateFields.push('updated_at = NOW()')
    params.push(req.user.id)
    
    await query(
      `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`,
      params
    )
    
    const user = await query(`
      SELECT id, username, phone, avatar, signature, gender, birthday, region,
        ${USER_COUNT_FIELDS}, created_at
      FROM users WHERE id = ?
    `, [req.user.id])
    
    res.json(success(user[0], '更新成功'))
  } catch (err) {
    console.error('更新用户信息失败:', err)
    res.status(500).json(error('更新失败', 500))
  }
})

/**
 * 关注用户
 */
router.post('/follow', auth, async (req, res) => {
  const { followId } = req.body

  if (!followId) {
    return res.status(400).json(error('请提供用户ID', 400))
  }

  if (followId === req.user.id) {
    return res.status(400).json(error('不能关注自己', 400))
  }

  try {
    // 检查用户是否存在
    const users = await query('SELECT id FROM users WHERE id = ? AND status = 1', [followId])
    if (users.length === 0) {
      return res.status(404).json(error('用户不存在', 404))
    }

    // 检查是否已关注
    const existing = await query(
      'SELECT id FROM follows WHERE user_id = ? AND follow_id = ?',
      [req.user.id, followId]
    )

    if (existing.length > 0) {
      return res.status(400).json(error('已关注该用户', 400))
    }

    // 添加关注
    await query(
      'INSERT INTO follows (user_id, follow_id, created_at) VALUES (?, ?, NOW())',
      [req.user.id, followId]
    )

    // 更新关注数和粉丝数
    await query('UPDATE users SET following_count = following_count + 1 WHERE id = ?', [req.user.id])
    await query('UPDATE users SET followers_count = followers_count + 1 WHERE id = ?', [followId])

    // 创建通知
    const notifResult = await query(
      'INSERT INTO notifications (user_id, from_user_id, type, title, content, target_id, target_type) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [followId, req.user.id, 'follow', '关注通知', '关注了你', req.user.id, 'user']
    )
    await pushNotificationById(notifResult.insertId)

    res.json(success(null, '关注成功'))
  } catch (err) {
    console.error('关注失败:', err)
    res.status(500).json(error('关注失败', 500))
  }
})

/**
 * 取消关注
 */
router.post('/unfollow', auth, async (req, res) => {
  const { followId } = req.body

  if (!followId) {
    return res.status(400).json(error('请提供用户ID', 400))
  }

  try {
    const result = await query(
      'DELETE FROM follows WHERE user_id = ? AND follow_id = ?',
      [req.user.id, followId]
    )

    if (result.affectedRows === 0) {
      return res.status(400).json(error('未关注该用户', 400))
    }

    // 更新关注数和粉丝数
    await query('UPDATE users SET following_count = GREATEST(following_count - 1, 0) WHERE id = ?', [req.user.id])
    await query('UPDATE users SET followers_count = GREATEST(followers_count - 1, 0) WHERE id = ?', [followId])

    res.json(success(null, '取消关注成功'))
  } catch (err) {
    console.error('取消关注失败:', err)
    res.status(500).json(error('操作失败', 500))
  }
})

/**
 * 检查是否关注
 */
router.get('/is-following/:id', auth, async (req, res) => {
  const { id } = req.params

  try {
    const existing = await query(
      'SELECT id FROM follows WHERE user_id = ? AND follow_id = ?',
      [req.user.id, id]
    )

    res.json(success({ isFollowing: existing.length > 0 }, '获取成功'))
  } catch (err) {
    console.error('检查关注状态失败:', err)
    res.status(500).json(error('获取失败', 500))
  }
})

/**
 * 获取粉丝列表
 */
router.get('/followers', auth, async (req, res) => {
  const { page = 1, size = 10 } = req.query
  const offset = (page - 1) * size

  try {
    const followers = await query(`
      SELECT u.id, u.username, u.avatar, u.signature,
        EXISTS(SELECT 1 FROM follows WHERE user_id = ? AND follow_id = u.id) as is_following
      FROM follows f 
      JOIN users u ON f.user_id = u.id 
      WHERE f.follow_id = ? AND u.status = 1
      ORDER BY f.created_at DESC 
      LIMIT ? OFFSET ?
    `, [req.user.id, req.user.id, parseInt(size), parseInt(offset)])

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
          page: parseInt(page),
          size: parseInt(size),
          pages: Math.ceil(total[0].count / size)
        }
      }
    })
  } catch (err) {
    console.error('获取粉丝列表失败:', err)
    res.status(500).json(error('获取失败', 500))
  }
})

/**
 * 获取关注列表
 */
router.get('/following', auth, async (req, res) => {
  const { page = 1, size = 10 } = req.query
  const offset = (page - 1) * size

  try {
    const following = await query(`
      SELECT u.id, u.username, u.avatar, u.signature, 1 as is_following
      FROM follows f 
      JOIN users u ON f.follow_id = u.id 
      WHERE f.user_id = ? AND u.status = 1
      ORDER BY f.created_at DESC 
      LIMIT ? OFFSET ?
    `, [req.user.id, parseInt(size), parseInt(offset)])

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
          page: parseInt(page),
          size: parseInt(size),
          pages: Math.ceil(total[0].count / size)
        }
      }
    })
  } catch (err) {
    console.error('获取关注列表失败:', err)
    res.status(500).json(error('获取失败', 500))
  }
})

/**
 * 获取指定用户的粉丝列表
 */
router.get('/:id/followers', async (req, res) => {
  const { id } = req.params
  const { page = 1, size = 10 } = req.query
  const offset = (page - 1) * size

  try {
    const followers = await query(`
      SELECT u.id, u.username, u.avatar, u.signature
      FROM follows f 
      JOIN users u ON f.user_id = u.id 
      WHERE f.follow_id = ? AND u.status = 1
      ORDER BY f.created_at DESC 
      LIMIT ? OFFSET ?
    `, [id, parseInt(size), parseInt(offset)])

    const total = await query(
      'SELECT COUNT(*) as count FROM follows WHERE follow_id = ?',
      [id]
    )

    res.json({
      success: true,
      message: '获取成功',
      data: {
        list: followers,
        pagination: {
          total: total[0].count,
          page: parseInt(page),
          size: parseInt(size),
          pages: Math.ceil(total[0].count / size)
        }
      }
    })
  } catch (err) {
    console.error('获取粉丝列表失败:', err)
    res.status(500).json(error('获取失败', 500))
  }
})

/**
 * 获取指定用户的关注列表
 */
router.get('/:id/following', async (req, res) => {
  const { id } = req.params
  const { page = 1, size = 10 } = req.query
  const offset = (page - 1) * size

  try {
    const following = await query(`
      SELECT u.id, u.username, u.avatar, u.signature
      FROM follows f 
      JOIN users u ON f.follow_id = u.id 
      WHERE f.user_id = ? AND u.status = 1
      ORDER BY f.created_at DESC 
      LIMIT ? OFFSET ?
    `, [id, parseInt(size), parseInt(offset)])

    const total = await query(
      'SELECT COUNT(*) as count FROM follows WHERE user_id = ?',
      [id]
    )

    res.json({
      success: true,
      message: '获取成功',
      data: {
        list: following,
        pagination: {
          total: total[0].count,
          page: parseInt(page),
          size: parseInt(size),
          pages: Math.ceil(total[0].count / size)
        }
      }
    })
  } catch (err) {
    console.error('获取关注列表失败:', err)
    res.status(500).json(error('获取失败', 500))
  }
})

/**
 * 上传用户头像
 */
router.post('/avatar', auth, upload.single('avatar'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json(error('请选择图片', 400))
  }

  try {
    const url = await saveUploadedFile(req.file, req, 'avatars')
    await query('UPDATE users SET avatar = ?, updated_at = NOW() WHERE id = ?', [url, req.user.id])
    res.json(success({ url }, '上传成功'))
  } catch (err) {
    console.error('上传头像失败:', err)
    res.status(500).json(error('上传失败', 500))
  }
})

/**
 * 同城附近狗友
 */
router.get('/nearby', auth, async (req, res) => {
  const { lat, lng, keyword = '', breed = '', radius = 10 } = req.query

  try {
    let sql = `
      SELECT u.id, u.username, u.avatar, u.region, u.latitude, u.longitude,
        p.id as pet_id, p.name as pet_name, p.breed, p.type as pet_type, p.gender as pet_gender
      FROM users u
      LEFT JOIN (
        SELECT user_id, MIN(id) as min_pet_id FROM pets WHERE status = 1 GROUP BY user_id
      ) fp ON fp.user_id = u.id
      LEFT JOIN pets p ON p.id = fp.min_pet_id
      WHERE u.status = 1 AND u.id != ?
    `
    const params = [req.user.id]

    if (keyword) {
      sql += ' AND (u.username LIKE ? OR p.name LIKE ? OR p.breed LIKE ?)'
      params.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`)
    }
    if (breed) {
      sql += ' AND p.breed LIKE ?'
      params.push(`%${breed}%`)
    }

    if (lat && lng) {
      sql = `
        SELECT u.id, u.username, u.avatar, u.region, u.latitude, u.longitude,
          p.id as pet_id, p.name as pet_name, p.breed, p.type as pet_type, p.gender as pet_gender,
          (6371 * ACOS(
            COS(RADIANS(?)) * COS(RADIANS(u.latitude)) * COS(RADIANS(u.longitude) - RADIANS(?))
            + SIN(RADIANS(?)) * SIN(RADIANS(u.latitude))
          )) AS distance_km
        FROM users u
        LEFT JOIN (
          SELECT user_id, MIN(id) as min_pet_id FROM pets WHERE status = 1 GROUP BY user_id
        ) fp ON fp.user_id = u.id
        LEFT JOIN pets p ON p.id = fp.min_pet_id
        WHERE u.status = 1 AND u.id != ? AND u.latitude IS NOT NULL AND u.longitude IS NOT NULL
      `
      const latNum = parseFloat(lat)
      const lngNum = parseFloat(lng)
      params.length = 0
      params.push(latNum, lngNum, latNum, req.user.id)
      if (keyword) {
        sql += ' AND (u.username LIKE ? OR p.name LIKE ? OR p.breed LIKE ?)'
        params.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`)
      }
      if (breed) {
        sql += ' AND p.breed LIKE ?'
        params.push(`%${breed}%`)
      }
      sql += ' HAVING distance_km <= ? ORDER BY distance_km ASC'
      params.push(parseFloat(radius))
    } else {
      sql += ' ORDER BY u.followers_count DESC LIMIT 50'
    }

    const users = await query(sql, params)
    const list = users.map((u) => ({
      ...u,
      distance: u.distance_km != null
        ? (u.distance_km < 1 ? `${Math.round(u.distance_km * 1000)}m` : `${u.distance_km.toFixed(1)}km`)
        : null,
      petLabel: u.pet_name && u.breed ? `${u.breed} - ${u.pet_name}` : (u.pet_name || '暂无宠物')
    }))

    res.json(success(list, '获取成功'))
  } catch (err) {
    console.error('获取附近狗友失败:', err)
    res.status(500).json(error('获取失败', 500))
  }
})

/**
 * 地图标记（地点 + 附近用户）
 */
router.get('/map/markers', auth, async (req, res) => {
  const { lat = 39.916527, lng = 116.397128, radius = 15 } = req.query

  try {
    const places = await query(`
      SELECT id, name, type, latitude, longitude, rating,
        (6371 * ACOS(
          COS(RADIANS(?)) * COS(RADIANS(latitude)) * COS(RADIANS(longitude) - RADIANS(?))
          + SIN(RADIANS(?)) * SIN(RADIANS(latitude))
        )) AS distance_km
      FROM places
      WHERE status = 1
      HAVING distance_km <= ?
      ORDER BY distance_km ASC
      LIMIT 30
    `, [parseFloat(lat), parseFloat(lng), parseFloat(lat), parseFloat(radius)])

    const users = await query(`
      SELECT u.id, u.username, u.avatar, u.latitude, u.longitude,
        p.name as pet_name, p.breed,
        (6371 * ACOS(
          COS(RADIANS(?)) * COS(RADIANS(u.latitude)) * COS(RADIANS(u.longitude) - RADIANS(?))
          + SIN(RADIANS(?)) * SIN(RADIANS(u.latitude))
        )) AS distance_km
      FROM users u
      LEFT JOIN (
        SELECT user_id, MIN(id) as min_pet_id FROM pets WHERE status = 1 GROUP BY user_id
      ) fp ON fp.user_id = u.id
      LEFT JOIN pets p ON p.id = fp.min_pet_id
      WHERE u.status = 1 AND u.id != ? AND u.latitude IS NOT NULL
      HAVING distance_km <= ?
      ORDER BY distance_km ASC
      LIMIT 20
    `, [parseFloat(lat), parseFloat(lng), parseFloat(lat), req.user.id, parseFloat(radius)])

    res.json(success({ places, users }, '获取成功'))
  } catch (err) {
    console.error('获取地图标记失败:', err)
    res.status(500).json(error('获取失败', 500))
  }
})

/**
 * 搜索用户
 */
router.get('/search', async (req, res) => {
  const { keyword, page = 1, size = 10 } = req.query
  
  if (!keyword) {
    return res.status(400).json(error('请提供搜索关键词', 400))
  }

  const offset = (page - 1) * size

  try {
    const users = await query(`
      SELECT id, username, avatar, signature, followers_count
      FROM users 
      WHERE status = 1 AND (username LIKE ? OR signature LIKE ?)
      ORDER BY followers_count DESC
      LIMIT ? OFFSET ?
    `, [`%${keyword}%`, `%${keyword}%`, parseInt(size), parseInt(offset)])

    const total = await query(
      'SELECT COUNT(*) as count FROM users WHERE status = 1 AND (username LIKE ? OR signature LIKE ?)',
      [`%${keyword}%`, `%${keyword}%`]
    )

    res.json({
      success: true,
      message: '获取成功',
      data: {
        list: users,
        pagination: {
          total: total[0].count,
          page: parseInt(page),
          size: parseInt(size),
          pages: Math.ceil(total[0].count / size)
        }
      }
    })
  } catch (err) {
    console.error('搜索用户失败:', err)
    res.status(500).json(error('搜索失败', 500))
  }
})

module.exports = router
