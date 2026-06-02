const express = require('express')
const router = express.Router()
const { query } = require('../config/db')
const { success, error, pagination } = require('../utils/response')
const { auth } = require('../middleware/auth')
const { parseJsonArray } = require('../utils/parseJson')

/**
 * 宠物表单配置（种类 / 品种 / 性格标签）
 */
router.get('/config', async (req, res) => {
  try {
    const types = await query(
      'SELECT id, type_key, label FROM pet_types WHERE status = 1 ORDER BY sort_order ASC, id ASC'
    )
    const breeds = await query(
      'SELECT type_id, label FROM pet_breeds WHERE status = 1 ORDER BY sort_order ASC, id ASC'
    )
    const tags = await query(
      'SELECT tag_key, label FROM pet_personality_tags WHERE status = 1 ORDER BY sort_order ASC, id ASC'
    )

    const breedMap = {}
    for (const t of types) {
      breedMap[t.label] = breeds.filter((b) => b.type_id === t.id).map((b) => b.label)
    }

    res.json(success({
      types: types.map((t) => t.label),
      typeKeys: Object.fromEntries(types.map((t) => [t.label, t.type_key])),
      breeds: breedMap,
      personalityTags: tags.map((t) => ({ id: t.tag_key, label: t.label })),
    }, '获取成功'))
  } catch (err) {
    console.error('获取宠物配置失败:', err)
    res.status(500).json(error('获取失败', 500))
  }
})

/**
 * 获取用户的宠物列表
 */
router.get('/list', auth, async (req, res) => {
  try {
    const pets = await query(
      'SELECT * FROM pets WHERE user_id = ? AND status = 1 ORDER BY created_at DESC',
      [req.user.id]
    )
    
    // 解析JSON字段
    for (let pet of pets) {
      pet.photos = parseJsonArray(pet.photos)
    }
    
    res.json(success(pets, '获取成功'))
  } catch (err) {
    console.error('获取宠物列表失败:', err)
    res.status(500).json(error('获取失败', 500))
  }
})

/**
 * 公开宠物详情（无需是主人）
 */
router.get('/public/:id', async (req, res) => {
  const { id } = req.params

  try {
    const pets = await query(`
      SELECT p.*, u.username as owner_name, u.avatar as owner_avatar
      FROM pets p
      JOIN users u ON p.user_id = u.id
      WHERE p.id = ? AND p.status = 1
    `, [id])

    if (pets.length === 0) {
      return res.status(404).json(error('宠物不存在', 404))
    }

    const pet = pets[0]
    pet.photos = parseJsonArray(pet.photos)

    res.json(success(pet, '获取成功'))
  } catch (err) {
    console.error('获取宠物详情失败:', err)
    res.status(500).json(error('获取失败', 500))
  }
})

/**
 * 获取宠物详情
 */
router.get('/:id', auth, async (req, res) => {
  const { id } = req.params
  
  try {
    const pets = await query(
      'SELECT * FROM pets WHERE id = ? AND user_id = ? AND status = 1',
      [id, req.user.id]
    )
    
    if (pets.length === 0) {
      return res.status(404).json(error('宠物不存在', 404))
    }
    
    const pet = pets[0]
    pet.photos = parseJsonArray(pet.photos)
    
    res.json(success(pet, '获取成功'))
  } catch (err) {
    console.error('获取宠物详情失败:', err)
    res.status(500).json(error('获取失败', 500))
  }
})

/**
 * 添加宠物
 */
router.post('/', auth, async (req, res) => {
  const { 
    name, type, breed, age, gender, color, weight, size, 
    neutered, vaccinated, healthCertificate, personality, habits, 
    avatar, photos, description 
  } = req.body
  
  if (!name) {
    return res.status(400).json(error('请输入宠物名字', 400))
  }
  
  if (!type) {
    return res.status(400).json(error('请选择宠物类型', 400))
  }
  
  try {
    // 处理布尔值字段
    const neuteredValue = neutered === true || neutered === 'true' || neutered === 1 ? 1 : 0
    const healthCertValue = healthCertificate === true || healthCertificate === 'true' || healthCertificate === 1 ? 1 : 0
    
    const result = await query(
      `INSERT INTO pets (
        user_id, name, type, breed, age, gender, color, weight, size, 
        neutered, vaccinated, health_certificate, personality, habits, 
        avatar, photos, description, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        req.user.id, name, type, breed || null, age || null, gender || 'unknown',
        color || null, weight || null, size || 'medium',
        neuteredValue, vaccinated || null, healthCertValue,
        personality || null, habits || null,
        avatar || null, JSON.stringify(photos || []), description || null
      ]
    )
    
    // 更新用户宠物数
    await query('UPDATE users SET pets_count = pets_count + 1 WHERE id = ?', [req.user.id])
    
    const pet = await query('SELECT * FROM pets WHERE id = ?', [result.insertId])
    
    res.json(success(pet[0], '添加成功'))
  } catch (err) {
    console.error('添加宠物失败:', err)
    res.status(500).json(error('添加失败', 500))
  }
})

/**
 * 更新宠物信息
 */
router.put('/:id', auth, async (req, res) => {
  const { id } = req.params
  const { 
    name, type, breed, age, gender, color, weight, size, 
    neutered, vaccinated, healthCertificate, personality, habits, 
    avatar, photos, description 
  } = req.body
  
  try {
    const existPet = await query(
      'SELECT * FROM pets WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    )
    
    if (existPet.length === 0) {
      return res.status(404).json(error('宠物不存在', 404))
    }
    
    let updateFields = []
    let params = []
    
    if (name !== undefined) {
      updateFields.push('name = ?')
      params.push(name)
    }
    if (type !== undefined) {
      updateFields.push('type = ?')
      params.push(type)
    }
    if (breed !== undefined) {
      updateFields.push('breed = ?')
      params.push(breed || null)
    }
    if (age !== undefined) {
      updateFields.push('age = ?')
      params.push(age || null)
    }
    if (gender !== undefined) {
      updateFields.push('gender = ?')
      params.push(gender)
    }
    if (color !== undefined) {
      updateFields.push('color = ?')
      params.push(color || null)
    }
    if (weight !== undefined) {
      updateFields.push('weight = ?')
      params.push(weight || null)
    }
    if (size !== undefined) {
      updateFields.push('size = ?')
      params.push(size)
    }
    if (neutered !== undefined) {
      updateFields.push('neutered = ?')
      params.push(neutered ? 1 : 0)
    }
    if (vaccinated !== undefined) {
      updateFields.push('vaccinated = ?')
      params.push(vaccinated || null)
    }
    if (healthCertificate !== undefined) {
      updateFields.push('health_certificate = ?')
      params.push(healthCertificate ? 1 : 0)
    }
    if (personality !== undefined) {
      updateFields.push('personality = ?')
      params.push(personality || null)
    }
    if (habits !== undefined) {
      updateFields.push('habits = ?')
      params.push(habits || null)
    }
    if (avatar !== undefined) {
      updateFields.push('avatar = ?')
      params.push(avatar || null)
    }
    if (photos !== undefined) {
      updateFields.push('photos = ?')
      const photosValue = Array.isArray(photos)
        ? JSON.stringify(photos)
        : typeof photos === 'string'
          ? photos
          : JSON.stringify(photos || [])
      params.push(photosValue)
    }
    if (description !== undefined) {
      updateFields.push('description = ?')
      params.push(description || null)
    }
    
    if (updateFields.length === 0) {
      return res.status(400).json(error('没有需要更新的字段', 400))
    }
    
    updateFields.push('updated_at = NOW()')
    params.push(id)
    params.push(req.user.id)
    
    await query(
      `UPDATE pets SET ${updateFields.join(', ')} WHERE id = ? AND user_id = ?`,
      params
    )
    
    const pet = await query('SELECT * FROM pets WHERE id = ?', [id])
    
    res.json(success(pet[0], '更新成功'))
  } catch (err) {
    console.error('更新宠物失败:', err)
    res.status(500).json(error('更新失败', 500))
  }
})

/**
 * 删除宠物
 */
router.delete('/:id', auth, async (req, res) => {
  const { id } = req.params
  
  try {
    const existPet = await query(
      'SELECT * FROM pets WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    )
    
    if (existPet.length === 0) {
      return res.status(404).json(error('宠物不存在', 404))
    }
    
    await query('UPDATE pets SET status = 0 WHERE id = ? AND user_id = ?', [id, req.user.id])
    
    // 更新用户宠物数
    await query('UPDATE users SET pets_count = GREATEST(pets_count - 1, 0) WHERE id = ?', [req.user.id])
    
    res.json(success(null, '删除成功'))
  } catch (err) {
    console.error('删除宠物失败:', err)
    res.status(500).json(error('删除失败', 500))
  }
})

/**
 * 上传宠物头像
 */
router.post('/:id/avatar', auth, async (req, res) => {
  const { id } = req.params
  const { avatar } = req.body
  
  if (!avatar) {
    return res.status(400).json(error('请提供头像URL', 400))
  }
  
  try {
    const existPet = await query(
      'SELECT * FROM pets WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    )
    
    if (existPet.length === 0) {
      return res.status(404).json(error('宠物不存在', 404))
    }
    
    await query('UPDATE pets SET avatar = ?, updated_at = NOW() WHERE id = ?', [avatar, id])
    
    res.json(success({ avatar }, '上传成功'))
  } catch (err) {
    console.error('上传头像失败:', err)
    res.status(500).json(error('上传失败', 500))
  }
})

/**
 * 获取其他用户的宠物列表
 */
router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params
  const { page = 1, size = 10 } = req.query
  const offset = (page - 1) * size
  
  try {
    const pets = await query(
      'SELECT * FROM pets WHERE user_id = ? AND status = 1 ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [userId, parseInt(size), parseInt(offset)]
    )
    
    const total = await query(
      'SELECT COUNT(*) as count FROM pets WHERE user_id = ? AND status = 1',
      [userId]
    )
    
    res.json({
      success: true,
      message: '获取成功',
      data: {
        list: pets,
        pagination: {
          total: total[0].count,
          page: parseInt(page),
          size: parseInt(size),
          pages: Math.ceil(total[0].count / size)
        }
      }
    })
  } catch (err) {
    console.error('获取宠物列表失败:', err)
    res.status(500).json(error('获取失败', 500))
  }
})

module.exports = router
