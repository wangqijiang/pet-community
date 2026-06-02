require('dotenv').config()

const express = require('express')
const http = require('http')
const cors = require('cors')
const path = require('path')
const { initWebSocket } = require('./ws')

const app = express()
const PORT = process.env.PORT || 3000

// 中间件
const corsOrigin = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim())
  : '*'

app.use(cors({
  origin: corsOrigin,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

// 请求日志
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`)
  next()
})

// 路由
const authRouter = require('./routes/auth')
const userRouter = require('./routes/user')
const postRouter = require('./routes/post')
const messageRouter = require('./routes/message')
const placeRouter = require('./routes/place')
const petRouter = require('./routes/pet')
const notificationRouter = require('./routes/notification')
const guideRouter = require('./routes/guide')
const aiRouter = require('./routes/ai')
const adminRouter = require('./routes/admin')
const fileRouter = require('./routes/file')

app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)
app.use('/api/post', postRouter)
app.use('/api/message', messageRouter)
app.use('/api/place', placeRouter)
app.use('/api/pet', petRouter)
app.use('/api/notification', notificationRouter)
app.use('/api/guide', guideRouter)
app.use('/api/ai', aiRouter)
app.use('/api/admin', adminRouter)
app.use('/api/file', fileRouter)

// Swagger 文档（如果存在）
try {
  const { setupSwagger } = require('./config/swagger')
  setupSwagger(app)
} catch (err) {
  console.log('Swagger not configured, skipping...')
}

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: Date.now(),
    version: '1.0.0'
  })
})

// API 路由列表
app.get('/api', (req, res) => {
  res.json({
    message: '萌宠朋友圈 API Server',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth (POST /register, POST /login)',
      user: '/api/user (GET /info, PUT /info, POST /follow, POST /unfollow)',
      post: '/api/post (GET /, POST /, GET /:id, POST /:id/like, POST /:id/comment)',
      message: '/api/message (GET /, POST /send, GET /chat/:userId)',
      place: '/api/place (GET /, GET /:id, POST /:id/like)',
      pet: '/api/pet (GET /list, POST /, PUT /:id, DELETE /:id)',
      notification: '/api/notification (GET /, POST /read, DELETE /:id)',
      guide: '/api/guide (GET /, GET /:id, POST /:id/like)',
      ai: '/api/ai (POST /chat, GET /history)'
    }
  })
})

// 404 处理
app.use((req, res) => {
  res.status(404).json({ success: false, message: '接口不存在' })
})

// 错误处理
app.use((err, req, res, next) => {
  console.error('Error:', err.stack)
  res.status(500).json({ success: false, message: '服务器内部错误' })
})

// 启动服务
const server = http.createServer(app)
initWebSocket(server)

server.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════╗
║     萌宠朋友圈 - 后端服务                      ║
╠════════════════════════════════════════════════╣
║  Server running on: http://localhost:${PORT}     ║
║  WebSocket:         ws://localhost:${PORT}/ws    ║
║  API docs:          http://localhost:${PORT}/api ║
╚════════════════════════════════════════════════╝
  `)
})

module.exports = app
