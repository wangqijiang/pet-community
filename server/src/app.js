require('dotenv').config()

const express = require('express')
const cors = require('cors')
const path = require('path')

const app = express()
const PORT = process.env.PORT || 3000

// 中间件
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

// 路由
const authRouter = require('./routes/auth')
const userRouter = require('./routes/user')
const postRouter = require('./routes/post')
const messageRouter = require('./routes/message')
const placeRouter = require('./routes/place')

app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)
app.use('/api/post', postRouter)
app.use('/api/message', messageRouter)
app.use('/api/place', placeRouter)

// Swagger 文档
const { setupSwagger } = require('./config/swagger')
setupSwagger(app)

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() })
})

// 404 处理
app.use((req, res) => {
  res.status(404).json({ success: false, message: '接口不存在' })
})

// 错误处理
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ success: false, message: '服务器内部错误' })
})

// 启动服务
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
  console.log(`Swagger API docs available at http://localhost:${PORT}/api-docs`)
})

module.exports = app
