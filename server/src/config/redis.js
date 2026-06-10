const redis = require('redis')

let client = null
let connected = false

function isRedisConfigured() {
  return !!(process.env.REDIS_HOST || process.env.REDIS_URL)
}

async function getRedisClient() {
  if (!isRedisConfigured()) return null
  if (client && connected) return client

  if (!client) {
    const url = process.env.REDIS_URL
    client = url
      ? redis.createClient({ url })
      : redis.createClient({
          socket: {
            host: process.env.REDIS_HOST || '127.0.0.1',
            port: Number(process.env.REDIS_PORT) || 6379,
          },
          password: process.env.REDIS_PASSWORD || undefined,
        })

    client.on('error', (err) => {
      console.error('Redis error:', err.message)
      connected = false
    })
  }

  if (!connected) {
    await client.connect()
    connected = true
    console.log('Redis connected')
  }

  return client
}

async function closeRedis() {
  if (client && connected) {
    await client.quit()
    connected = false
    client = null
  }
}

module.exports = { getRedisClient, isRedisConfigured, closeRedis }
