/**
 * API 集成测试（需 MySQL 已迁移并插入测试数据）
 * 运行: node scripts/test-api.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '../.env') })

const BASE = `http://127.0.0.1:${process.env.PORT || 3000}/api`

async function req(method, path, body, token) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  })
  const data = await res.json()
  return { status: res.status, data }
}

async function run() {
  const results = []
  const ok = (name) => results.push({ name, pass: true })
  const fail = (name, err) => results.push({ name, pass: false, err: String(err) })

  try {
    let r = await req('GET', '/health')
    if (r.data.status !== 'ok') throw new Error('health')
    ok('health')

    r = await req('POST', '/auth/loginByCode', { phone: '13800138001', code: '1234' })
    if (!r.data.success || !r.data.data.token) throw new Error(JSON.stringify(r.data))
    const token = r.data.data.token
    ok('loginByCode')

    r = await req('GET', '/user/info', null, token)
    if (!r.data.success) throw new Error('user/info')
    ok('user/info')

    r = await req('GET', '/post?page=1&size=5', null, token)
    if (!r.data.success || !r.data.data.list) throw new Error('post list')
    ok('post list')

    r = await req('GET', '/pet/list', null, token)
    if (!r.data.success) throw new Error('pet list')
    ok('pet list')

    r = await req('GET', '/place?page=1&size=5', null, token)
    if (!r.data.success) throw new Error('place list')
    ok('place list')

    r = await req('GET', '/message', null, token)
    if (!r.data.success) throw new Error('message list')
    ok('message list')

    r = await req('GET', '/notification?page=1&size=5', null, token)
    if (!r.data.success) throw new Error('notification list')
    ok('notification list')

    r = await req('GET', '/guide?page=1&size=5', null, token)
    if (!r.data.success) throw new Error('guide list')
    ok('guide list')

    r = await req('GET', '/user/map/markers?lat=39.91&lng=116.39', null, token)
    if (!r.data.success) throw new Error('map markers')
    ok('map markers')

    r = await req('GET', '/user/nearby?lat=39.91&lng=116.39', null, token)
    if (!r.data.success) throw new Error('nearby users')
    ok('nearby users')

    if (r.data.data && r.data.data.length >= 0) ok('nearby data shape')

    r = await req('POST', '/ai/chat', { question: '猫咪吃什么' }, token)
    if (!r.data.success) throw new Error('ai chat')
    ok('ai chat')
  } catch (e) {
    fail('suite', e)
  }

  const passed = results.filter((x) => x.pass).length
  const failed = results.filter((x) => !x.pass)
  console.log('\n=== API Test Results ===')
  results.forEach((x) => console.log(x.pass ? '✓' : '✗', x.name, x.err || ''))
  console.log(`\n${passed}/${results.length} passed`)
  if (failed.length) process.exit(1)
}

run()
