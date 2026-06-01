const express = require('express')
const router = express.Router()
const { query } = require('../../config/db')
const { compare, hash } = require('../../utils/bcrypt')
const { sign } = require('../../utils/jwt')
const { success, error, pagination } = require('../../utils/response')
const { adminAuth } = require('../../middleware/adminAuth')
const { upload, saveUploadedFile } = require('../../utils/upload')

function parsePage(q) {
  const page = Math.max(1, parseInt(q.page, 10) || 1)
  const size = Math.min(100, Math.max(1, parseInt(q.size, 10) || 20))
  return { page, size, offset: (page - 1) * size }
}

function parseJson(val) {
  if (!val) return null
  if (typeof val === 'object') return val
  try {
    return JSON.parse(val)
  } catch {
    return val
  }
}

// —— 登录 ——
router.post('/auth/login', async (req, res) => {
  const { phone, password } = req.body
  if (!phone || !password) {
    return res.status(400).json(error('请输入手机号和密码', 400))
  }
  try {
    const rows = await query(
      'SELECT * FROM users WHERE phone = ? AND role = ?',
      [phone, 'admin']
    )
    const user = rows[0]
    if (!user) {
      return res.status(401).json(error('管理员账号或密码错误', 401))
    }
    if (user.status !== 1) {
      return res.status(403).json(error('账号已禁用', 403))
    }
    const ok = await compare(password, user.password)
    if (!ok) {
      return res.status(401).json(error('管理员账号或密码错误', 401))
    }
    const token = sign({ id: user.id, role: 'admin' })
    res.json(
      success({
        token,
        admin: {
          id: user.id,
          username: user.username,
          phone: user.phone,
          avatar: user.avatar,
        },
      }, '登录成功')
    )
  } catch (err) {
    console.error('admin login:', err)
    res.status(500).json(error('登录失败', 500))
  }
})

router.get('/auth/me', adminAuth, async (req, res) => {
  res.json(success(req.admin))
})

// —— 仪表盘 ——
router.get('/dashboard/stats', adminAuth, async (req, res) => {
  try {
    const [[users], [posts], [pets], [places], [guides], [comments], [messages]] =
      await Promise.all([
        query('SELECT COUNT(*) AS c FROM users WHERE role = ?', ['user']),
        query('SELECT COUNT(*) AS c FROM posts WHERE status = 1'),
        query('SELECT COUNT(*) AS c FROM pets WHERE status > 0'),
        query('SELECT COUNT(*) AS c FROM places WHERE status = 1'),
        query('SELECT COUNT(*) AS c FROM guides WHERE status = 1'),
        query('SELECT COUNT(*) AS c FROM comments WHERE status = 1'),
        query('SELECT COUNT(*) AS c FROM messages'),
      ])
    const todayPosts = await query(
      'SELECT COUNT(*) AS c FROM posts WHERE DATE(created_at) = CURDATE()'
    )
    res.json(
      success({
        users: users.c,
        posts: posts.c,
        pets: pets.c,
        places: places.c,
        guides: guides.c,
        comments: comments.c,
        messages: messages.c,
        postsToday: todayPosts[0].c,
      })
    )
  } catch (err) {
    console.error('dashboard:', err)
    res.status(500).json(error('获取统计失败', 500))
  }
})

// —— 上传 ——
router.post('/upload', adminAuth, upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json(error('请选择图片', 400))
  }
  try {
    const sub = req.body.type === 'avatar' ? 'avatars' : 'files'
    const url = await saveUploadedFile(req.file, req, sub)
    res.json(success({ url }))
  } catch (err) {
    console.error('管理端上传失败:', err)
    res.status(500).json(error(err.message || '上传失败', 500))
  }
})

// —— 用户 ——
router.get('/users', adminAuth, async (req, res) => {
  const { page, size, offset } = parsePage(req.query)
  const { keyword, status } = req.query
  try {
    let where = "role = 'user'"
    const params = []
    if (keyword) {
      where += ' AND (username LIKE ? OR phone LIKE ?)'
      params.push(`%${keyword}%`, `%${keyword}%`)
    }
    if (status !== undefined && status !== '') {
      where += ' AND status = ?'
      params.push(parseInt(status, 10))
    }
    const list = await query(
      `SELECT id, username, phone, avatar, signature, gender, region,
              followers_count, following_count, posts_count, pets_count, status, created_at
       FROM users WHERE ${where} ORDER BY id DESC LIMIT ? OFFSET ?`,
      [...params, size, offset]
    )
    const total = await query(`SELECT COUNT(*) AS count FROM users WHERE ${where}`, params)
    res.json(pagination(list, total[0].count, page, size))
  } catch (err) {
    console.error('admin users:', err)
    res.status(500).json(error('获取用户失败', 500))
  }
})

router.patch('/users/:id/status', adminAuth, async (req, res) => {
  const { status } = req.body
  if (![0, 1].includes(Number(status))) {
    return res.status(400).json(error('无效状态', 400))
  }
  try {
    await query('UPDATE users SET status = ? WHERE id = ? AND role = ?', [
      status,
      req.params.id,
      'user',
    ])
    res.json(success(null, '已更新'))
  } catch (err) {
    res.status(500).json(error('更新失败', 500))
  }
})

router.post('/users/:id/reset-password', adminAuth, async (req, res) => {
  const newPassword = req.body.password || '123456'
  try {
    const hashed = await hash(newPassword)
    await query('UPDATE users SET password = ? WHERE id = ? AND role = ?', [
      hashed,
      req.params.id,
      'user',
    ])
    res.json(success(null, '密码已重置'))
  } catch (err) {
    res.status(500).json(error('重置失败', 500))
  }
})

// —— 动态 ——
router.get('/posts', adminAuth, async (req, res) => {
  const { page, size, offset } = parsePage(req.query)
  const { keyword, category, status } = req.query
  try {
    let where = '1=1'
    const params = []
    if (keyword) {
      where += ' AND p.content LIKE ?'
      params.push(`%${keyword}%`)
    }
    if (category) {
      where += ' AND p.category = ?'
      params.push(category)
    }
    if (status !== undefined && status !== '') {
      where += ' AND p.status = ?'
      params.push(parseInt(status, 10))
    }
    const list = await query(
      `SELECT p.*, u.username, u.phone
       FROM posts p LEFT JOIN users u ON p.user_id = u.id
       WHERE ${where} ORDER BY p.is_top DESC, p.id DESC LIMIT ? OFFSET ?`,
      [...params, size, offset]
    )
    list.forEach((row) => {
      row.images = parseJson(row.images)
    })
    const total = await query(
      `SELECT COUNT(*) AS count FROM posts p WHERE ${where}`,
      params
    )
    res.json(pagination(list, total[0].count, page, size))
  } catch (err) {
    console.error('admin posts:', err)
    res.status(500).json(error('获取动态失败', 500))
  }
})

router.patch('/posts/:id', adminAuth, async (req, res) => {
  const { status, is_top } = req.body
  const fields = []
  const params = []
  if (status !== undefined) {
    fields.push('status = ?')
    params.push(status)
  }
  if (is_top !== undefined) {
    fields.push('is_top = ?')
    params.push(is_top ? 1 : 0)
  }
  if (!fields.length) {
    return res.status(400).json(error('无更新字段', 400))
  }
  try {
    params.push(req.params.id)
    await query(`UPDATE posts SET ${fields.join(', ')} WHERE id = ?`, params)
    res.json(success(null, '已更新'))
  } catch (err) {
    res.status(500).json(error('更新失败', 500))
  }
})

router.delete('/posts/:id', adminAuth, async (req, res) => {
  try {
    await query('UPDATE posts SET status = 0 WHERE id = ?', [req.params.id])
    res.json(success(null, '已删除'))
  } catch (err) {
    res.status(500).json(error('删除失败', 500))
  }
})

// —— 评论 ——
router.get('/comments', adminAuth, async (req, res) => {
  const { page, size, offset } = parsePage(req.query)
  const { post_id, status } = req.query
  try {
    let where = '1=1'
    const params = []
    if (post_id) {
      where += ' AND c.post_id = ?'
      params.push(post_id)
    }
    if (status !== undefined && status !== '') {
      where += ' AND c.status = ?'
      params.push(parseInt(status, 10))
    }
    const list = await query(
      `SELECT c.*, u.username, p.content AS post_content
       FROM comments c
       LEFT JOIN users u ON c.user_id = u.id
       LEFT JOIN posts p ON c.post_id = p.id
       WHERE ${where} ORDER BY c.id DESC LIMIT ? OFFSET ?`,
      [...params, size, offset]
    )
    const total = await query(`SELECT COUNT(*) AS count FROM comments c WHERE ${where}`, params)
    res.json(pagination(list, total[0].count, page, size))
  } catch (err) {
    res.status(500).json(error('获取评论失败', 500))
  }
})

router.delete('/comments/:id', adminAuth, async (req, res) => {
  try {
    await query('UPDATE comments SET status = 0 WHERE id = ?', [req.params.id])
    res.json(success(null, '已删除'))
  } catch (err) {
    res.status(500).json(error('删除失败', 500))
  }
})

// —— 宠物 ——
router.get('/pets', adminAuth, async (req, res) => {
  const { page, size, offset } = parsePage(req.query)
  const { keyword, status, type } = req.query
  try {
    let where = '1=1'
    const params = []
    if (keyword) {
      where += ' AND (p.name LIKE ? OR u.username LIKE ?)'
      params.push(`%${keyword}%`, `%${keyword}%`)
    }
    if (status !== undefined && status !== '') {
      where += ' AND p.status = ?'
      params.push(parseInt(status, 10))
    }
    if (type) {
      where += ' AND p.type = ?'
      params.push(type)
    }
    const list = await query(
      `SELECT p.*, u.username, u.phone
       FROM pets p LEFT JOIN users u ON p.user_id = u.id
       WHERE ${where} ORDER BY p.id DESC LIMIT ? OFFSET ?`,
      [...params, size, offset]
    )
    list.forEach((row) => {
      row.photos = parseJson(row.photos)
    })
    const total = await query(
      `SELECT COUNT(*) AS count FROM pets p WHERE ${where}`,
      params
    )
    res.json(pagination(list, total[0].count, page, size))
  } catch (err) {
    res.status(500).json(error('获取宠物失败', 500))
  }
})

router.patch('/pets/:id/status', adminAuth, async (req, res) => {
  const { status } = req.body
  try {
    await query('UPDATE pets SET status = ? WHERE id = ?', [status, req.params.id])
    res.json(success(null, '已更新'))
  } catch (err) {
    res.status(500).json(error('更新失败', 500))
  }
})

// —— 场所 ——
router.get('/places', adminAuth, async (req, res) => {
  const { page, size, offset } = parsePage(req.query)
  const { keyword, type, status } = req.query
  try {
    let where = '1=1'
    const params = []
    if (keyword) {
      where += ' AND (p.name LIKE ? OR p.address LIKE ?)'
      params.push(`%${keyword}%`, `%${keyword}%`)
    }
    if (type) {
      where += ' AND p.type = ?'
      params.push(type)
    }
    if (status !== undefined && status !== '') {
      where += ' AND p.status = ?'
      params.push(parseInt(status, 10))
    }
    const list = await query(
      `SELECT p.*, pc.label AS category_label
       FROM places p
       LEFT JOIN place_categories pc ON pc.key = p.type AND pc.status = 1
       WHERE ${where} ORDER BY p.id DESC LIMIT ? OFFSET ?`,
      [...params, size, offset]
    )
    list.forEach((row) => {
      row.images = parseJson(row.images)
      row.amenities = parseJson(row.amenities)
    })
    const total = await query(`SELECT COUNT(*) AS count FROM places p WHERE ${where}`, params)
    res.json(pagination(list, total[0].count, page, size))
  } catch (err) {
    res.status(500).json(error('获取场所失败', 500))
  }
})

router.get('/places/:id', adminAuth, async (req, res) => {
  try {
    const rows = await query('SELECT * FROM places WHERE id = ?', [req.params.id])
    if (!rows[0]) return res.status(404).json(error('场所不存在', 404))
    const place = rows[0]
    place.images = parseJson(place.images)
    place.amenities = parseJson(place.amenities)
    res.json(success(place))
  } catch (err) {
    res.status(500).json(error('获取失败', 500))
  }
})

router.post('/places', adminAuth, async (req, res) => {
  const b = req.body
  if (!b.name || !b.type || !b.address || b.latitude == null || b.longitude == null) {
    return res.status(400).json(error('请填写名称、分类、地址与坐标', 400))
  }
  try {
    const result = await query(
      `INSERT INTO places (name, type, address, latitude, longitude, description, images, phone,
        rating, business_hours, pet_policy, amenities, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        b.name,
        b.type,
        b.address,
        b.latitude,
        b.longitude,
        b.description || null,
        JSON.stringify(b.images || []),
        b.phone || null,
        b.rating ?? 0,
        b.business_hours || null,
        b.pet_policy || null,
        JSON.stringify(b.amenities || []),
        b.status ?? 1,
      ]
    )
    res.json(success({ id: result.insertId }, '创建成功'))
  } catch (err) {
    console.error('create place:', err)
    res.status(500).json(error('创建失败', 500))
  }
})

router.put('/places/:id', adminAuth, async (req, res) => {
  const b = req.body
  try {
    await query(
      `UPDATE places SET name=?, type=?, address=?, latitude=?, longitude=?, description=?,
        images=?, phone=?, rating=?, business_hours=?, pet_policy=?, amenities=?, status=?
       WHERE id=?`,
      [
        b.name,
        b.type,
        b.address,
        b.latitude,
        b.longitude,
        b.description || null,
        JSON.stringify(b.images || []),
        b.phone || null,
        b.rating ?? 0,
        b.business_hours || null,
        b.pet_policy || null,
        JSON.stringify(b.amenities || []),
        b.status ?? 1,
        req.params.id,
      ]
    )
    res.json(success(null, '已保存'))
  } catch (err) {
    res.status(500).json(error('保存失败', 500))
  }
})

router.delete('/places/:id', adminAuth, async (req, res) => {
  try {
    await query('UPDATE places SET status = 0 WHERE id = ?', [req.params.id])
    res.json(success(null, '已下架'))
  } catch (err) {
    res.status(500).json(error('操作失败', 500))
  }
})

// —— 场所评价 ——
router.get('/place-reviews', adminAuth, async (req, res) => {
  const { page, size, offset } = parsePage(req.query)
  const { place_id } = req.query
  try {
    let where = '1=1'
    const params = []
    if (place_id) {
      where += ' AND r.place_id = ?'
      params.push(place_id)
    }
    const list = await query(
      `SELECT r.*, u.username, pl.name AS place_name
       FROM place_reviews r
       LEFT JOIN users u ON r.user_id = u.id
       LEFT JOIN places pl ON r.place_id = pl.id
       WHERE ${where} ORDER BY r.id DESC LIMIT ? OFFSET ?`,
      [...params, size, offset]
    )
    const total = await query(
      `SELECT COUNT(*) AS count FROM place_reviews r WHERE ${where}`,
      params
    )
    res.json(pagination(list, total[0].count, page, size))
  } catch (err) {
    res.status(500).json(error('获取评价失败', 500))
  }
})

router.delete('/place-reviews/:id', adminAuth, async (req, res) => {
  try {
    await query('UPDATE place_reviews SET status = 0 WHERE id = ?', [req.params.id])
    res.json(success(null, '已删除'))
  } catch (err) {
    res.status(500).json(error('删除失败', 500))
  }
})

// —— 分类 CRUD（routePath 为 URL，tableName 为数据库表） ——
const categoryCrud = (routePath, tableName) => {
  router.get(`/${routePath}`, adminAuth, async (req, res) => {
    try {
      const list = await query(
        `SELECT * FROM ${tableName} ORDER BY sort_order ASC, id ASC`
      )
      res.json(success(list))
    } catch (err) {
      res.status(500).json(error('获取失败', 500))
    }
  })

  router.post(`/${routePath}`, adminAuth, async (req, res) => {
    const { key, label, sort_order, status } = req.body
    if (!key || !label) {
      return res.status(400).json(error('key 与 label 必填', 400))
    }
    try {
      const result = await query(
        `INSERT INTO ${tableName} (\`key\`, label, sort_order, status) VALUES (?, ?, ?, ?)`,
        [key, label, sort_order ?? 0, status ?? 1]
      )
      res.json(success({ id: result.insertId }, '已创建'))
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json(error('key 已存在', 400))
      }
      res.status(500).json(error('创建失败', 500))
    }
  })

  router.put(`/${routePath}/:id`, adminAuth, async (req, res) => {
    const { label, sort_order, status } = req.body
    try {
      await query(
        `UPDATE ${tableName} SET label=?, sort_order=?, status=? WHERE id=?`,
        [label, sort_order ?? 0, status ?? 1, req.params.id]
      )
      res.json(success(null, '已更新'))
    } catch (err) {
      res.status(500).json(error('更新失败', 500))
    }
  })

  router.delete(`/${routePath}/:id`, adminAuth, async (req, res) => {
    try {
      await query(`UPDATE ${tableName} SET status = 0 WHERE id = ?`, [req.params.id])
      res.json(success(null, '已禁用'))
    } catch (err) {
      res.status(500).json(error('操作失败', 500))
    }
  })
}

categoryCrud('post-categories', 'post_categories')
categoryCrud('place-categories', 'place_categories')

// —— 攻略 ——
router.get('/guides', adminAuth, async (req, res) => {
  const { page, size, offset } = parsePage(req.query)
  const { keyword, category, pet_type, status } = req.query
  try {
    let where = '1=1'
    const params = []
    if (keyword) {
      where += ' AND (title LIKE ? OR content LIKE ?)'
      params.push(`%${keyword}%`, `%${keyword}%`)
    }
    if (category) {
      where += ' AND category = ?'
      params.push(category)
    }
    if (pet_type) {
      where += ' AND pet_type = ?'
      params.push(pet_type)
    }
    if (status !== undefined && status !== '') {
      where += ' AND status = ?'
      params.push(parseInt(status, 10))
    }
    const list = await query(
      `SELECT g.*, u.username AS author_name FROM guides g
       LEFT JOIN users u ON g.author_id = u.id
       WHERE ${where} ORDER BY g.id DESC LIMIT ? OFFSET ?`,
      [...params, size, offset]
    )
    const total = await query(`SELECT COUNT(*) AS count FROM guides WHERE ${where}`, params)
    res.json(pagination(list, total[0].count, page, size))
  } catch (err) {
    res.status(500).json(error('获取攻略失败', 500))
  }
})

router.get('/guides/:id', adminAuth, async (req, res) => {
  const rows = await query('SELECT * FROM guides WHERE id = ?', [req.params.id])
  if (!rows[0]) return res.status(404).json(error('不存在', 404))
  res.json(success(rows[0]))
})

router.post('/guides', adminAuth, async (req, res) => {
  const b = req.body
  if (!b.title || !b.content) {
    return res.status(400).json(error('标题与内容必填', 400))
  }
  try {
    const result = await query(
      `INSERT INTO guides (title, content, cover, pet_type, category, author_id, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        b.title,
        b.content,
        b.cover || null,
        b.pet_type || null,
        b.category || null,
        b.author_id || req.admin.id,
        b.status ?? 1,
      ]
    )
    res.json(success({ id: result.insertId }, '已创建'))
  } catch (err) {
    res.status(500).json(error('创建失败', 500))
  }
})

router.put('/guides/:id', adminAuth, async (req, res) => {
  const b = req.body
  try {
    await query(
      `UPDATE guides SET title=?, content=?, cover=?, pet_type=?, category=?, status=? WHERE id=?`,
      [
        b.title,
        b.content,
        b.cover || null,
        b.pet_type || null,
        b.category || null,
        b.status ?? 1,
        req.params.id,
      ]
    )
    res.json(success(null, '已保存'))
  } catch (err) {
    res.status(500).json(error('保存失败', 500))
  }
})

router.delete('/guides/:id', adminAuth, async (req, res) => {
  try {
    await query('UPDATE guides SET status = 0 WHERE id = ?', [req.params.id])
    res.json(success(null, '已下架'))
  } catch (err) {
    res.status(500).json(error('操作失败', 500))
  }
})

// —— 系统通知广播 ——
router.post('/notifications/broadcast', adminAuth, async (req, res) => {
  const { title, content, user_ids } = req.body
  if (!title || !content) {
    return res.status(400).json(error('标题与内容必填', 400))
  }
  try {
    let targets = user_ids
    if (!targets?.length) {
      const rows = await query("SELECT id FROM users WHERE role = 'user' AND status = 1")
      targets = rows.map((r) => r.id)
    }
    for (const uid of targets) {
      await query(
        `INSERT INTO notifications (user_id, from_user_id, type, title, content, target_type, is_read)
         VALUES (?, ?, 'system', ?, ?, 'system', 0)`,
        [uid, req.admin.id, title, content]
      )
    }
    res.json(success({ count: targets.length }, '已发送'))
  } catch (err) {
    console.error('broadcast:', err)
    res.status(500).json(error('发送失败', 500))
  }
})

// —— AI 对话记录 ——
router.get('/ai-chats', adminAuth, async (req, res) => {
  const { page, size, offset } = parsePage(req.query)
  try {
    const list = await query(
      `SELECT a.*, u.username, u.phone FROM ai_chats a
       LEFT JOIN users u ON a.user_id = u.id
       ORDER BY a.id DESC LIMIT ? OFFSET ?`,
      [size, offset]
    )
    const total = await query('SELECT COUNT(*) AS count FROM ai_chats')
    res.json(pagination(list, total[0].count, page, size))
  } catch (err) {
    res.status(500).json(error('获取失败', 500))
  }
})

router.delete('/ai-chats/:id', adminAuth, async (req, res) => {
  try {
    await query('DELETE FROM ai_chats WHERE id = ?', [req.params.id])
    res.json(success(null, '已删除'))
  } catch (err) {
    res.status(500).json(error('删除失败', 500))
  }
})

module.exports = router
