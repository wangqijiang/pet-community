const redis = require('redis')

const client = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD || undefined
})

client.on('error', (err) => {
  console.error('Redis error:', err)
})

client.on('connect', () => {
  console.log('Redis connected')
})

const connect = async () => {
  await client.connect()
}

const set = async (key, value, options = {}) => {
  if (options.expire) {
    await client.setEx(key, options.expire, JSON.stringify(value))
  } else {
    await client.set(key, JSON.stringify(value))
  }
}

const get = async (key) => {
  const result = await client.get(key)
  return result ? JSON.parse(result) : null
}

const del = async (key) => {
  await client.del(key)
}

const exists = async (key) => {
  const result = await client.exists(key)
  return result === 1
}

module.exports = {
  client,
  connect,
  set,
  get,
  del,
  exists
}
