const express = require('express')
const router = express.Router()
const { query } = require('../config/db')
const { pushNotificationById } = require('../utils/realtime')
const { auth, optionalAuth } = require('../middleware/auth')
const { success, error, pagination } = require('../utils/response')
const { parseJsonArray } = require('../utils/parseJson')
const { parsePagination } = require('../utils/pagination')
const {
  validatePostContent,
  validateCommentContent,
  validateImagesArray,
} = require('../utils/validate')

async function syncPostLikesCount(postId) {
  const rows = await query(
    'SELECT COUNT(*) AS count FROM likes WHERE target_id = ? AND target_type = ?',
    [postId, 'post']
  )
  await query('UPDATE posts SET likes_count = ? WHERE id = ?', [rows[0].count, postId])
}

async function fetchPetsForPosts(postIds) {
  if (!postIds.length) return {}

  const placeholders = postIds.map(() => '?').join(',')
  const rows = await query(
    `SELECT pp.post_id, p.id, p.name, p.type, p.breed, p.avatar
     FROM post_pets pp
     JOIN pets p ON pp.pet_id = p.id
     WHERE pp.post_id IN (${placeholders}) AND p.status = 1
     ORDER BY pp.id ASC`,
    postIds
  )

  const map = {}
  for (const row of rows) {
    if (!map[row.post_id]) map[row.post_id] = []
    map[row.post_id].push({
      id: row.id,
      name: row.name,
      type: row.type,
      breed: row.breed,
      avatar: row.avatar,
    })
  }
  return map
}

async function attachPetsToPosts(posts) {
  if (!posts.length) return posts

  const petMap = await fetchPetsForPosts(posts.map((post) => post.id))
  for (const post of posts) {
    post.pets = petMap[post.id] || []
    post.pet_ids = post.pets.map((pet) => pet.id)
  }
  return posts
}

/** 批量附加当前用户是否已点赞（一次查询，避免 N+1） */
async function attachLikedStatus(posts, userId) {
  if (!posts.length) {
    return posts
  }

  if (!userId) {
    for (const post of posts) {
      post.liked = false
    }
    return posts
  }

  const postIds = posts.map((post) => post.id)
  const placeholders = postIds.map(() => '?').join(',')
  const rows = await query(
    `SELECT target_id FROM likes
     WHERE user_id = ? AND target_type = 'post' AND target_id IN (${placeholders})`,
    [userId, ...postIds]
  )
  const likedSet = new Set(rows.map((row) => row.target_id))

  for (const post of posts) {
    post.liked = likedSet.has(post.id)
  }
  return posts
}

async function isValidCategoryKey(category) {
  if (!category) return true
  const rows = await query(
    'SELECT `key` FROM post_categories WHERE status = 1 AND `key` = ?',
    [category]
  )
  return rows.length > 0
}

async function setPostPets(postId, userId, petIds) {
  await query('DELETE FROM post_pets WHERE post_id = ?', [postId])

  if (!Array.isArray(petIds) || petIds.length === 0) return

  const ids = [...new Set(petIds.map((id) => parseInt(id, 10)).filter((id) => id > 0))]
  if (!ids.length) return

  const placeholders = ids.map(() => '?').join(',')
  const ownedPets = await query(
    `SELECT id FROM pets WHERE user_id = ? AND status = 1 AND id IN (${placeholders})`,
    [userId, ...ids]
  )

  for (const pet of ownedPets) {
    await query(
      'INSERT INTO post_pets (post_id, pet_id, created_at) VALUES (?, ?, NOW())',
      [postId, pet.id]
    )
  }
}

/**
 * 创建动态
 */
router.post('/', auth, async (req, res) => {
  const { content, images, pet_ids: petIds, category } = req.body

  const contentErr = validatePostContent(content)
  if (contentErr) {
    return res.status(400).json(error(contentErr, 400))
  }

  const imagesErr = validateImagesArray(images)
  if (imagesErr) {
    return res.status(400).json(error(imagesErr, 400))
  }

  if (category && !(await isValidCategoryKey(category))) {
    return res.status(400).json(error('无效的分类', 400))
  }

  try {
    const result = await query(
      'INSERT INTO posts (user_id, content, images, category, created_at) VALUES (?, ?, ?, ?, NOW())',
      [req.user.id, content.trim(), JSON.stringify(images || []), category || null]
    )

    await setPostPets(result.insertId, req.user.id, petIds)

    // 更新用户动态数
    await query('UPDATE users SET posts_count = posts_count + 1 WHERE id = ?', [req.user.id])

    const post = await query(
      'SELECT p.*, u.username, u.avatar, u.signature FROM posts p JOIN users u ON p.user_id = u.id WHERE p.id = ?',
      [result.insertId]
    )

    const [postWithPets] = await attachPetsToPosts(post)

    res.json(success(postWithPets, '发布成功'))
  } catch (err) {
    console.error('发布动态失败:', err)
    res.status(500).json(error('发布失败', 500))
  }
})

/**
 * 获取动态列表
 */
router.get('/', optionalAuth, async (req, res) => {
  const { page: pageNum, size: sizeNum, offset } = parsePagination(req.query, {
    page: 1,
    size: 10,
    maxSize: 50,
  })
  const { user_id, keyword, category } = req.query

  try {
    let sql = `
      SELECT p.*, u.username, u.avatar, u.signature,
        (SELECT COUNT(*) FROM likes WHERE target_id = p.id AND target_type = 'post') as likes_count,
        (SELECT COUNT(*) FROM comments WHERE post_id = p.id AND status = 1) as comments_count
      FROM posts p 
      JOIN users u ON p.user_id = u.id 
      WHERE p.status = 1
    `
    const params = []

    if (user_id) {
      sql += ' AND p.user_id = ?'
      params.push(user_id)
    }

    if (keyword) {
      sql += ' AND p.content LIKE ?'
      params.push(`%${keyword}%`)
    }

    if (category && category !== 'all') {
      sql += ' AND p.category = ?'
      params.push(category)
    }

    sql += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?'
    params.push(sizeNum, offset)

    const posts = await query(sql, params)

    // 解析images字段
    for (let post of posts) {
      post.images = parseJsonArray(post.images)
    }

    await attachPetsToPosts(posts)
    await attachLikedStatus(posts, req.user?.id)

    let countSql = 'SELECT COUNT(*) as count FROM posts WHERE status = 1'
    const countParams = []
    if (user_id) {
      countSql += ' AND user_id = ?'
      countParams.push(user_id)
    }
    if (keyword) {
      countSql += ' AND content LIKE ?'
      countParams.push(`%${keyword}%`)
    }
    if (category && category !== 'all') {
      countSql += ' AND category = ?'
      countParams.push(category)
    }
    const total = await query(countSql, countParams)

    res.json(pagination(posts, total[0].count, pageNum, sizeNum))
  } catch (err) {
    console.error('获取动态列表失败:', err)
    res.status(500).json(error('获取失败', 500))
  }
})

/**
 * 获取动态分类列表
 */
router.get('/categories', async (req, res) => {
  try {
    const categories = await query(
      'SELECT `key`, label FROM post_categories WHERE status = 1 ORDER BY sort_order ASC, id ASC'
    )
    res.json(success(categories, '获取成功'))
  } catch (err) {
    console.error('获取动态分类失败:', err)
    res.status(500).json(error('获取失败', 500))
  }
})

/**
 * 检查当前用户是否已点赞
 */
router.get('/:id/liked', auth, async (req, res) => {
  const { id } = req.params
  try {
    const existing = await query(
      'SELECT id FROM likes WHERE user_id = ? AND target_id = ? AND target_type = ?',
      [req.user.id, id, 'post']
    )
    res.json(success({ liked: existing.length > 0 }, '获取成功'))
  } catch (err) {
    console.error('检查点赞状态失败:', err)
    res.status(500).json(error('获取失败', 500))
  }
})

/**
 * 获取单条动态
 */
router.get('/:id', optionalAuth, async (req, res) => {
  const { id } = req.params

  try {
    const posts = await query(`
      SELECT p.*, u.username, u.avatar, u.signature,
        (SELECT COUNT(*) FROM likes WHERE target_id = p.id AND target_type = 'post') as likes_count,
        (SELECT COUNT(*) FROM comments WHERE post_id = p.id AND status = 1) as comments_count
      FROM posts p 
      JOIN users u ON p.user_id = u.id 
      WHERE p.id = ? AND p.status = 1
    `, [id])

    if (posts.length === 0) {
      return res.status(404).json(error('动态不存在', 404))
    }

    const post = posts[0]
    post.images = parseJsonArray(post.images)

    await attachPetsToPosts([post])
    await attachLikedStatus([post], req.user?.id)

    res.json(success(post, '获取成功'))
  } catch (err) {
    console.error('获取动态详情失败:', err)
    res.status(500).json(error('获取失败', 500))
  }
})

/**
 * 更新动态
 */
router.put('/:id', auth, async (req, res) => {
  const { id } = req.params
  const { content, images, pet_ids: petIds, category } = req.body

  try {
    const posts = await query('SELECT * FROM posts WHERE id = ? AND user_id = ?', [id, req.user.id])
    if (posts.length === 0) {
      return res.status(404).json(error('动态不存在或无权修改', 404))
    }

    if (category !== undefined && category && !(await isValidCategoryKey(category))) {
      return res.status(400).json(error('无效的分类', 400))
    }

    const nextCategory = category !== undefined ? (category || null) : posts[0].category

    await query(
      'UPDATE posts SET content = ?, images = ?, category = ?, updated_at = NOW() WHERE id = ?',
      [
        content || posts[0].content,
        JSON.stringify(images ?? parseJsonArray(posts[0].images)),
        nextCategory,
        id,
      ]
    )

    if (petIds !== undefined) {
      await setPostPets(id, req.user.id, petIds)
    }

    const updatedPost = await query(
      'SELECT p.*, u.username, u.avatar FROM posts p JOIN users u ON p.user_id = u.id WHERE p.id = ?',
      [id]
    )

    const [postWithPets] = await attachPetsToPosts(updatedPost)

    res.json(success(postWithPets, '更新成功'))
  } catch (err) {
    console.error('更新动态失败:', err)
    res.status(500).json(error('更新失败', 500))
  }
})

/**
 * 删除动态
 */
router.delete('/:id', auth, async (req, res) => {
  const { id } = req.params

  try {
    const posts = await query('SELECT * FROM posts WHERE id = ? AND user_id = ?', [id, req.user.id])
    if (posts.length === 0) {
      return res.status(404).json(error('动态不存在或无权删除', 404))
    }

    await query('UPDATE posts SET status = 0 WHERE id = ?', [id])
    
    // 更新用户动态数
    await query('UPDATE users SET posts_count = GREATEST(posts_count - 1, 0) WHERE id = ?', [req.user.id])

    res.json(success(null, '删除成功'))
  } catch (err) {
    console.error('删除动态失败:', err)
    res.status(500).json(error('删除失败', 500))
  }
})

/**
 * 点赞动态
 */
router.post('/:id/like', auth, async (req, res) => {
  const { id } = req.params

  try {
    // 检查动态是否存在
    const posts = await query('SELECT * FROM posts WHERE id = ? AND status = 1', [id])
    if (posts.length === 0) {
      return res.status(404).json(error('动态不存在', 404))
    }

    // 检查是否已点赞
    const existing = await query(
      'SELECT id FROM likes WHERE user_id = ? AND target_id = ? AND target_type = ?',
      [req.user.id, id, 'post']
    )

    if (existing.length > 0) {
      // 取消点赞
      await query('DELETE FROM likes WHERE id = ?', [existing[0].id])
      await syncPostLikesCount(id)
      res.json(success({ liked: false }, '取消点赞'))
    } else {
      // 点赞
      await query(
        'INSERT INTO likes (user_id, target_id, target_type, created_at) VALUES (?, ?, ?, NOW())',
        [req.user.id, id, 'post']
      )
      await syncPostLikesCount(id)
      
      // 创建通知（同一用户对同一动态仅首次点赞通知）
      if (posts[0].user_id !== req.user.id) {
        const priorNotif = await query(
          `SELECT id FROM notifications
           WHERE user_id = ? AND from_user_id = ? AND type = 'like'
             AND target_id = ? AND target_type = 'post' LIMIT 1`,
          [posts[0].user_id, req.user.id, id]
        )
        if (priorNotif.length === 0) {
          const notifResult = await query(
            'INSERT INTO notifications (user_id, from_user_id, type, title, content, target_id, target_type) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [posts[0].user_id, req.user.id, 'like', '点赞通知', `赞了你的动态`, id, 'post']
          )
          await pushNotificationById(notifResult.insertId)
        }
      }
      
      res.json(success({ liked: true }, '点赞成功'))
    }
  } catch (err) {
    console.error('点赞操作失败:', err)
    res.status(500).json(error('操作失败', 500))
  }
})

/**
 * 收藏动态
 */
router.post('/:id/favorite', auth, async (req, res) => {
  const { id } = req.params

  try {
    const posts = await query('SELECT * FROM posts WHERE id = ? AND status = 1', [id])
    if (posts.length === 0) {
      return res.status(404).json(error('动态不存在', 404))
    }

    const existing = await query(
      'SELECT id FROM favorites WHERE user_id = ? AND target_id = ? AND target_type = ?',
      [req.user.id, id, 'post']
    )

    if (existing.length > 0) {
      await query('DELETE FROM favorites WHERE id = ?', [existing[0].id])
      res.json(success({ favorited: false }, '取消收藏'))
    } else {
      await query(
        'INSERT INTO favorites (user_id, target_id, target_type, created_at) VALUES (?, ?, ?, NOW())',
        [req.user.id, id, 'post']
      )
      res.json(success({ favorited: true }, '收藏成功'))
    }
  } catch (err) {
    console.error('收藏操作失败:', err)
    res.status(500).json(error('操作失败', 500))
  }
})

/**
 * 获取评论列表
 */
router.get('/:id/comments', async (req, res) => {
  const { id } = req.params
  const { page = 1, size = 20 } = req.query
  const offset = (page - 1) * size

  try {
    const comments = await query(`
      SELECT c.*, u.username, u.avatar,
        ru.username as reply_to_username
      FROM comments c
      JOIN users u ON c.user_id = u.id
      LEFT JOIN users ru ON c.reply_to_user_id = ru.id
      WHERE c.post_id = ? AND c.status = 1
      ORDER BY c.created_at DESC
      LIMIT ? OFFSET ?
    `, [id, parseInt(size), parseInt(offset)])

    const total = await query(
      'SELECT COUNT(*) as count FROM comments WHERE post_id = ? AND status = 1',
      [id]
    )

    res.json({
      success: true,
      message: '获取成功',
      data: {
        list: comments,
        pagination: {
          total: total[0].count,
          page: parseInt(page),
          size: parseInt(size),
          pages: Math.ceil(total[0].count / size)
        }
      }
    })
  } catch (err) {
    console.error('获取评论失败:', err)
    res.status(500).json(error('获取失败', 500))
  }
})

/**
 * 发表评论
 */
router.post('/:id/comment', auth, async (req, res) => {
  const { id } = req.params
  const { content, reply_to_id, reply_to_user_id } = req.body

  const contentErr = validateCommentContent(content)
  if (contentErr) {
    return res.status(400).json(error(contentErr, 400))
  }

  try {
    // 检查动态是否存在
    const posts = await query('SELECT * FROM posts WHERE id = ? AND status = 1', [id])
    if (posts.length === 0) {
      return res.status(404).json(error('动态不存在', 404))
    }

    let parentId = null
    let replyToUserId = reply_to_user_id || null

    if (reply_to_id) {
      const parentRows = await query(
        'SELECT id, parent_id, user_id FROM comments WHERE id = ? AND status = 1',
        [reply_to_id]
      )
      if (parentRows.length > 0) {
        parentId = parentRows[0].parent_id || reply_to_id
        if (!replyToUserId) {
          replyToUserId = parentRows[0].user_id
        }
      }
    }

    const result = await query(
      'INSERT INTO comments (post_id, user_id, content, parent_id, reply_to_id, reply_to_user_id, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
      [id, req.user.id, content.trim(), parentId, reply_to_id || null, replyToUserId]
    )

    // 更新动态评论数
    await query('UPDATE posts SET comments_count = comments_count + 1 WHERE id = ?', [id])

    const comment = await query(`
      SELECT c.*, u.username, u.avatar,
        ru.username as reply_to_username
      FROM comments c
      JOIN users u ON c.user_id = u.id
      LEFT JOIN users ru ON c.reply_to_user_id = ru.id
      WHERE c.id = ?
    `, [result.insertId])

    // 创建通知
    const postAuthorId = posts[0].user_id
    const commentSnippet = (content || '').trim().slice(0, 80)
    const commentBody = commentSnippet
      ? `评论了你的动态：${commentSnippet}`
      : '评论了你的动态'

    // 仅顶级评论通知动态作者
    if (!reply_to_id && postAuthorId !== req.user.id) {
      const notifResult = await query(
        'INSERT INTO notifications (user_id, from_user_id, type, title, content, target_id, target_type) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [postAuthorId, req.user.id, 'comment', '评论通知', commentBody, id, 'post']
      )
      await pushNotificationById(notifResult.insertId)
    }

    // 回复评论时通知被回复者
    if (replyToUserId && replyToUserId !== req.user.id) {
      const replyBody = commentSnippet
        ? `回复了你的评论：${commentSnippet}`
        : '回复了你的评论'
      const replyNotifResult = await query(
        'INSERT INTO notifications (user_id, from_user_id, type, title, content, target_id, target_type) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [replyToUserId, req.user.id, 'comment', '回复通知', replyBody, id, 'post']
      )
      await pushNotificationById(replyNotifResult.insertId)
    }

    res.json(success(comment[0], '评论成功'))
  } catch (err) {
    console.error('发表评论失败:', err)
    res.status(500).json(error('评论失败', 500))
  }
})

/**
 * 删除评论
 */
router.delete('/comment/:commentId', auth, async (req, res) => {
  const { commentId } = req.params

  try {
    const comment = await query(
      'SELECT c.*, p.user_id as post_user_id FROM comments c JOIN posts p ON c.post_id = p.id WHERE c.id = ?',
      [commentId]
    )

    if (comment.length === 0) {
      return res.status(404).json(error('评论不存在', 404))
    }

    if (comment[0].user_id !== req.user.id && comment[0].post_user_id !== req.user.id) {
      return res.status(403).json(error('无权删除', 403))
    }

    const postId = comment[0].post_id

    // 删除本条及其子回复
    await query(
      'UPDATE comments SET status = 0 WHERE (id = ? OR parent_id = ?) AND post_id = ?',
      [commentId, commentId, postId]
    )

    // 更新动态评论数
    const countResult = await query('SELECT COUNT(*) as count FROM comments WHERE post_id = ? AND status = 1', [postId])
    await query('UPDATE posts SET comments_count = ? WHERE id = ?', [countResult[0].count, postId])

    res.json(success(null, '删除成功'))
  } catch (err) {
    console.error('删除评论失败:', err)
    res.status(500).json(error('删除失败', 500))
  }
})

/**
 * 点赞评论
 */
router.post('/comment/:commentId/like', auth, async (req, res) => {
  const { commentId } = req.params

  try {
    const comments = await query('SELECT * FROM comments WHERE id = ? AND status = 1', [commentId])
    if (comments.length === 0) {
      return res.status(404).json(error('评论不存在', 404))
    }

    const existing = await query(
      'SELECT id FROM likes WHERE user_id = ? AND target_id = ? AND target_type = ?',
      [req.user.id, commentId, 'comment']
    )

    if (existing.length > 0) {
      await query('DELETE FROM likes WHERE id = ?', [existing[0].id])
      await query('UPDATE comments SET likes_count = GREATEST(likes_count - 1, 0) WHERE id = ?', [commentId])
      res.json(success({ liked: false }, '取消点赞'))
    } else {
      await query(
        'INSERT INTO likes (user_id, target_id, target_type, created_at) VALUES (?, ?, ?, NOW())',
        [req.user.id, commentId, 'comment']
      )
      await query('UPDATE comments SET likes_count = likes_count + 1 WHERE id = ?', [commentId])
      res.json(success({ liked: true }, '点赞成功'))
    }
  } catch (err) {
    console.error('点赞评论失败:', err)
    res.status(500).json(error('操作失败', 500))
  }
})

/**
 * 获取用户点赞的动态列表
 */
router.get('/user/likes', auth, async (req, res) => {
  const { page = 1, size = 10 } = req.query
  const offset = (page - 1) * size

  try {
    const posts = await query(`
      SELECT p.*, u.username, u.avatar,
        (SELECT COUNT(*) FROM likes WHERE target_id = p.id AND target_type = 'post') as likes_count,
        (SELECT COUNT(*) FROM comments WHERE post_id = p.id AND status = 1) as comments_count
      FROM posts p
      JOIN likes l ON p.id = l.target_id AND l.target_type = 'post'
      JOIN users u ON p.user_id = u.id
      WHERE l.user_id = ? AND p.status = 1
      ORDER BY l.created_at DESC
      LIMIT ? OFFSET ?
    `, [req.user.id, parseInt(size), parseInt(offset)])

    await attachPetsToPosts(posts)
    await attachLikedStatus(posts, req.user.id)

    for (const post of posts) {
      post.images = parseJsonArray(post.images)
    }

    const total = await query(
      'SELECT COUNT(*) as count FROM likes WHERE user_id = ? AND target_type = ?',
      [req.user.id, 'post']
    )

    res.json({
      success: true,
      message: '获取成功',
      data: {
        list: posts,
        pagination: {
          total: total[0].count,
          page: parseInt(page),
          size: parseInt(size),
          pages: Math.ceil(total[0].count / size)
        }
      }
    })
  } catch (err) {
    console.error('获取点赞列表失败:', err)
    res.status(500).json(error('获取失败', 500))
  }
})

/**
 * 获取用户收藏的动态列表
 */
router.get('/user/favorites', auth, async (req, res) => {
  const { page = 1, size = 10 } = req.query
  const offset = (page - 1) * size

  try {
    const posts = await query(`
      SELECT p.*, u.username, u.avatar,
        (SELECT COUNT(*) FROM likes WHERE target_id = p.id AND target_type = 'post') as likes_count,
        (SELECT COUNT(*) FROM comments WHERE post_id = p.id AND status = 1) as comments_count
      FROM posts p
      JOIN favorites f ON p.id = f.target_id AND f.target_type = 'post'
      JOIN users u ON p.user_id = u.id
      WHERE f.user_id = ? AND p.status = 1
      ORDER BY f.created_at DESC
      LIMIT ? OFFSET ?
    `, [req.user.id, parseInt(size), parseInt(offset)])

    await attachPetsToPosts(posts)
    await attachLikedStatus(posts, req.user.id)

    for (const post of posts) {
      post.images = parseJsonArray(post.images)
    }

    const total = await query(
      'SELECT COUNT(*) as count FROM favorites WHERE user_id = ? AND target_type = ?',
      [req.user.id, 'post']
    )

    res.json({
      success: true,
      message: '获取成功',
      data: {
        list: posts,
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
