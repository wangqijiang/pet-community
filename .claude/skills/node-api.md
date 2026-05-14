---
skill: node-api
description: 创建 Node.js RESTful API（Express/Koa + MySQL + JWT）
tags: [nodejs, express, api, mysql, jwt]
---

# Node.js API 生成器

创建标准的 RESTful API 接口，包含路由、控制器、数据库操作和中间件。

## 使用方式

```
/node-api ResourceName [framework]
```

## 功能

1. 创建 RESTful 路由（GET, POST, PUT, DELETE）
2. 控制器层（业务逻辑）
3. MySQL 数据库操作
4. JWT 身份验证
5. 参数验证
6. 错误处理
7. 统一响应格式

## 示例

创建宠物管理 API：
```
/node-api pet express
```

生成的文件结构：

**routes/pet.js**
```javascript
const express = require('express')
const router = express.Router()
const petController = require('../controllers/petController')
const { authenticate } = require('../middleware/auth')
const { validatePet } = require('../middleware/validator')

// 获取宠物列表
router.get('/', petController.getList)

// 获取单个宠物
router.get('/:id', petController.getById)

// 创建宠物（需要认证）
router.post('/', authenticate, validatePet, petController.create)

// 更新宠物
router.put('/:id', authenticate, validatePet, petController.update)

// 删除宠物
router.delete('/:id', authenticate, petController.delete)

module.exports = router
```

**controllers/petController.js**
```javascript
const petService = require('../services/petService')
const { successResponse, errorResponse } = require('../utils/response')

class PetController {
  // 获取列表
  async getList(req, res) {
    try {
      const { page = 1, pageSize = 10, keyword } = req.query
      const result = await petService.getList({ page, pageSize, keyword })
      return successResponse(res, result)
    } catch (error) {
      return errorResponse(res, error.message)
    }
  }

  // 获取详情
  async getById(req, res) {
    try {
      const { id } = req.params
      const pet = await petService.getById(id)
      if (!pet) {
        return errorResponse(res, '宠物不存在', 404)
      }
      return successResponse(res, pet)
    } catch (error) {
      return errorResponse(res, error.message)
    }
  }

  // 创建
  async create(req, res) {
    try {
      const petData = req.body
      const userId = req.user.id
      const result = await petService.create({ ...petData, userId })
      return successResponse(res, result, '创建成功', 201)
    } catch (error) {
      return errorResponse(res, error.message)
    }
  }

  // 更新
  async update(req, res) {
    try {
      const { id } = req.params
      const petData = req.body
      const result = await petService.update(id, petData)
      return successResponse(res, result, '更新成功')
    } catch (error) {
      return errorResponse(res, error.message)
    }
  }

  // 删除
  async delete(req, res) {
    try {
      const { id } = req.params
      await petService.delete(id)
      return successResponse(res, null, '删除成功')
    } catch (error) {
      return errorResponse(res, error.message)
    }
  }
}

module.exports = new PetController()
```

**services/petService.js**
```javascript
const db = require('../config/database')

class PetService {
  async getList({ page, pageSize, keyword }) {
    const offset = (page - 1) * pageSize
    let sql = 'SELECT * FROM pets WHERE 1=1'
    const params = []

    if (keyword) {
      sql += ' AND (name LIKE ? OR description LIKE ?)'
      params.push(`%${keyword}%`, `%${keyword}%`)
    }

    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?'
    params.push(parseInt(pageSize), offset)

    const [rows] = await db.query(sql, params)
    const [countResult] = await db.query('SELECT COUNT(*) as total FROM pets')
    
    return {
      list: rows,
      total: countResult[0].total,
      page: parseInt(page),
      pageSize: parseInt(pageSize)
    }
  }

  async getById(id) {
    const [rows] = await db.query('SELECT * FROM pets WHERE id = ?', [id])
    return rows[0]
  }

  async create(data) {
    const { name, type, age, description, avatar, userId } = data
    const sql = 'INSERT INTO pets (name, type, age, description, avatar, user_id) VALUES (?, ?, ?, ?, ?, ?)'
    const [result] = await db.query(sql, [name, type, age, description, avatar, userId])
    return { id: result.insertId, ...data }
  }

  async update(id, data) {
    const { name, type, age, description, avatar } = data
    const sql = 'UPDATE pets SET name=?, type=?, age=?, description=?, avatar=? WHERE id=?'
    await db.query(sql, [name, type, age, description, avatar, id])
    return { id, ...data }
  }

  async delete(id) {
    await db.query('DELETE FROM pets WHERE id = ?', [id])
  }
}

module.exports = new PetService()
```
