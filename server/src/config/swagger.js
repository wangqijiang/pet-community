const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '宠物社区 API',
      version: '1.0.0',
      description: '宠物社区后端服务 API 文档',
      contact: {
        name: 'API Support',
        email: 'support@example.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: '开发服务器'
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            username: { type: 'string', example: '铲屎官小明' },
            phone: { type: 'string', example: '13800138000' },
            avatar: { type: 'string', nullable: true, example: 'https://example.com/avatar.jpg' },
            signature: { type: 'string', nullable: true, example: '爱狗人士' },
            created_at: { type: 'string', format: 'date-time', example: '2024-01-01T12:00:00Z' }
          }
        },
        Post: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            user_id: { type: 'integer', example: 1 },
            content: { type: 'string', example: '今天带狗狗去公园玩啦' },
            images: { type: 'string', example: '["https://example.com/img1.jpg"]' },
            likes: { type: 'integer', example: 10 },
            comments: { type: 'integer', example: 5 },
            username: { type: 'string', example: '铲屎官小明' },
            avatar: { type: 'string', example: 'https://example.com/avatar.jpg' },
            created_at: { type: 'string', format: 'date-time', example: '2024-01-01T12:00:00Z' }
          }
        },
        Message: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            from_id: { type: 'integer', example: 1 },
            to_id: { type: 'integer', example: 2 },
            content: { type: 'string', example: '你好呀' },
            read_at: { type: 'string', format: 'date-time', nullable: true },
            created_at: { type: 'string', format: 'date-time', example: '2024-01-01T12:00:00Z' },
            username: { type: 'string', example: '好友小红' },
            avatar: { type: 'string', example: 'https://example.com/avatar.jpg' }
          }
        },
        Place: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: '中央公园' },
            address: { type: 'string', example: '北京市朝阳区中央公园路88号' },
            latitude: { type: 'number', example: 39.916527 },
            longitude: { type: 'number', example: 116.397128 },
            type: { type: 'string', example: 'park' },
            description: { type: 'string', example: '城市中心的绿肺，宠物友好公园' },
            images: { type: 'string', example: '["https://example.com/img1.jpg"]' },
            phone: { type: 'string', example: '010-88888888' },
            open_time: { type: 'string', example: '6:00-22:00' },
            created_at: { type: 'string', format: 'date-time', example: '2024-01-01T12:00:00Z' }
          }
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: '操作成功' },
            data: { type: 'object' },
            timestamp: { type: 'integer', example: 1704067200000 }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: '操作失败' },
            code: { type: 'integer', example: -1 },
            timestamp: { type: 'integer', example: 1704067200000 }
          }
        }
      }
    }
  },
  apis: [
    './src/routes/auth.js',
    './src/routes/user.js',
    './src/routes/post.js',
    './src/routes/message.js',
    './src/routes/place.js'
  ]
}

const specs = swaggerJsdoc(options)

const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    explorer: true,
    customSiteTitle: '宠物社区 API 文档'
  }))
}

module.exports = { setupSwagger, specs }
