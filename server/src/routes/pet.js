const express = require('express')
const router = express.Router()
const { query } = require('../config/db')
const { success, error } = require('../utils/response')
const { auth } = require('../middleware/auth')
const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads/pets'))
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    const filename = `pet_${Date.now()}${ext}`
    cb(null, filename)
  }
})

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg']
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('只允许上传图片文件'))
    }
  }
})

/**
 * @swagger
 * tags:
 *   name: 宠物管理
 *   description: 宠物相关接口
 */

/**
 * @swagger
 * /api/pet/list:
 *   get:
 *     summary: 获取用户的宠物列表
 *     description: 获取当前登录用户的所有宠物
 *     tags: [宠物管理]
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
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Pet'
 */
router.get('/list', auth, async (req, res) => {
  const pets = await query(
    'SELECT * FROM pets WHERE user_id = ? ORDER BY created_at DESC',
    [req.user.id]
  )
  
  res.json(success(pets, '获取成功'))
})

/**
 * @swagger
 * /api/pet/{id}:
 *   get:
 *     summary: 获取宠物详情
 *     description: 根据ID获取宠物详情
 *     tags: [宠物管理]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: 宠物ID
 *         schema:
 *           type: integer
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
 *                 data:
 *                   $ref: '#/components/schemas/Pet'
 *       404:
 *         description: 宠物不存在
 */
router.get('/:id', auth, async (req, res) => {
  const { id } = req.params
  
  const pets = await query(
    'SELECT * FROM pets WHERE id = ? AND user_id = ?',
    [id, req.user.id]
  )
  
  if (pets.length === 0) {
    return res.status(404).json(error('宠物不存在', 404))
  }
  
  res.json(success(pets[0], '获取成功'))
})

/**
 * @swagger
 * /api/pet:
 *   post:
 *     summary: 添加宠物
 *     description: 添加新宠物
 *     tags: [宠物管理]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: 宠物名字
 *               type:
 *                 type: string
 *                 description: 类型（dog/cat/etc）
 *               breed:
 *                 type: string
 *                 description: 品种
 *               age:
 *                 type: string
 *                 description: 年龄
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: 头像图片
 *     responses:
 *       200:
 *         description: 添加成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Pet'
 */
router.post('/', auth, async (req, res) => {
  const { name, type, breed, age, gender, color, weight, size, neutered, vaccinated, healthCertificate, personality, habits, avatar, photos } = req.body
  
  if (!name) {
    return res.status(400).json(error('请输入宠物名字', 400))
  }
  
  // 处理布尔值字段
  const neuteredValue = neutered === true || neutered === 'true' || neutered === 1 ? 1 : 0
  const healthCertValue = healthCertificate === true || healthCertificate === 'true' || healthCertificate === 1 ? 1 : 0
  
  const result = await query(
    'INSERT INTO pets (user_id, name, type, breed, age, gender, color, weight, size, neutered, vaccinated, health_certificate, personality, habits, avatar, photos) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [req.user.id, name, type || null, breed || null, age || null, gender || null, color || null, weight || null, size || null, neuteredValue, vaccinated || null, healthCertValue, personality || null, habits || null, avatar || null, photos || null]
  )
  
  const pet = await query(
    'SELECT * FROM pets WHERE id = ?',
    [result.insertId]
  )
  
  res.json(success(pet[0], '添加成功'))
})

router.post('/upload', auth, upload.single('avatar'), async (req, res) => {
  const { name, type, breed, age } = req.body
  const avatar = req.file ? `/uploads/pets/${req.file.filename}` : null
  
  if (!name) {
    return res.status(400).json(error('请输入宠物名字', 400))
  }
  
  const result = await query(
    'INSERT INTO pets (user_id, name, type, breed, age, avatar) VALUES (?, ?, ?, ?, ?, ?)',
    [req.user.id, name, type || null, breed || null, age || null, avatar]
  )
  
  const pet = await query(
    'SELECT * FROM pets WHERE id = ?',
    [result.insertId]
  )
  
  res.json(success(pet[0], '添加成功'))
})

/**
 * @swagger
 * /api/pet/{id}:
 *   put:
 *     summary: 更新宠物信息
 *     description: 更新宠物信息
 *     tags: [宠物管理]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: 宠物ID
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: 宠物名字
 *               type:
 *                 type: string
 *                 description: 类型
 *               breed:
 *                 type: string
 *                 description: 品种
 *               age:
 *                 type: string
 *                 description: 年龄
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: 头像图片
 *     responses:
 *       200:
 *         description: 更新成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Pet'
 *       404:
 *         description: 宠物不存在
 */
router.put('/:id', auth, async (req, res) => {
  const { id } = req.params
  const { name, type, breed, age, gender, color, weight, size, neutered, vaccinated, healthCertificate, personality, habits, avatar, photos } = req.body
  
  const existPet = await query(
    'SELECT * FROM pets WHERE id = ? AND user_id = ?',
    [id, req.user.id]
  )
  
  if (existPet.length === 0) {
    return res.status(404).json(error('宠物不存在', 404))
  }
  
  let updateFields = []
  let params = []
  
  if (name) {
    updateFields.push('name = ?')
    params.push(name)
  }
  if (type !== undefined) {
    updateFields.push('type = COALESCE(?, type)')
    params.push(type || null)
  }
  if (breed !== undefined) {
    updateFields.push('breed = COALESCE(?, breed)')
    params.push(breed || null)
  }
  if (age !== undefined) {
    updateFields.push('age = COALESCE(?, age)')
    params.push(age || null)
  }
  if (gender !== undefined) {
    updateFields.push('gender = COALESCE(?, gender)')
    params.push(gender || null)
  }
  if (color !== undefined) {
    updateFields.push('color = COALESCE(?, color)')
    params.push(color || null)
  }
  if (weight !== undefined) {
    updateFields.push('weight = COALESCE(?, weight)')
    params.push(weight || null)
  }
  if (size !== undefined) {
    updateFields.push('size = COALESCE(?, size)')
    params.push(size || null)
  }
  if (neutered !== undefined) {
    updateFields.push('neutered = ?')
    params.push(neutered ? 1 : 0)
  }
  if (vaccinated !== undefined) {
    updateFields.push('vaccinated = COALESCE(?, vaccinated)')
    params.push(vaccinated || null)
  }
  if (healthCertificate !== undefined) {
    updateFields.push('health_certificate = ?')
    params.push(healthCertificate ? 1 : 0)
  }
  if (personality !== undefined) {
    updateFields.push('personality = COALESCE(?, personality)')
    params.push(personality || null)
  }
  if (habits !== undefined) {
    updateFields.push('habits = COALESCE(?, habits)')
    params.push(habits || null)
  }
  if (avatar !== undefined) {
    updateFields.push('avatar = ?')
    params.push(avatar || null)
  }
  if (photos !== undefined) {
    updateFields.push('photos = ?')
    params.push(photos || null)
  }
  
  if (updateFields.length === 0) {
    return res.status(400).json(error('没有需要更新的字段', 400))
  }
  
  params.push(id)
  params.push(req.user.id)
  
  await query(
    `UPDATE pets SET ${updateFields.join(', ')} WHERE id = ? AND user_id = ?`,
    params
  )
  
  const pet = await query(
    'SELECT * FROM pets WHERE id = ?',
    [id]
  )
  
  res.json(success(pet[0], '更新成功'))
})

/**
 * @swagger
 * /api/pet/{id}:
 *   delete:
 *     summary: 删除宠物
 *     description: 删除指定宠物
 *     tags: [宠物管理]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: 宠物ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 删除成功
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
 *                   example: 删除成功
 *       404:
 *         description: 宠物不存在
 */
router.delete('/:id', auth, async (req, res) => {
  const { id } = req.params
  
  const existPet = await query(
    'SELECT * FROM pets WHERE id = ? AND user_id = ?',
    [id, req.user.id]
  )
  
  if (existPet.length === 0) {
    return res.status(404).json(error('宠物不存在', 404))
  }
  
  await query(
    'DELETE FROM pets WHERE id = ? AND user_id = ?',
    [id, req.user.id]
  )
  
  res.json(success({}, '删除成功'))
})

module.exports = router
