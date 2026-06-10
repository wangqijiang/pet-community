#!/usr/bin/env node
/**
 * 校验白名单与路由声明是否明显不一致（开发期辅助）
 */
const fs = require('fs')
const path = require('path')
const { listPublicRoutes, isPublicApi } = require('../../shared/publicApiMatcher')

const routesDir = path.join(__dirname, '../src/routes')
const routeFiles = fs
  .readdirSync(routesDir, { recursive: true })
  .filter((f) => typeof f === 'string' && f.endsWith('.js'))

let errors = 0

console.log('=== 公开 API 白名单 ===')
listPublicRoutes().forEach((r) => {
  console.log(`  ${r.method.padEnd(6)} ${r.pattern}${r.note ? `  # ${r.note}` : ''}`)
})

console.log('\n=== 抽样匹配 ===')
const samples = [
  ['GET', '/api/health', true],
  ['GET', '/api/post', true],
  ['GET', '/api/post/1', true],
  ['GET', '/api/user/info', false],
  ['GET', '/api/user/info/5', true],
  ['GET', '/api/message/unread/count', false],
  ['GET', '/api/pet/list', false],
  ['POST', '/api/post/1/like', false],
]
samples.forEach(([method, p, expected]) => {
  const ok = isPublicApi(method, p) === expected
  if (!ok) {
    console.error(`FAIL ${method} ${p} expected ${expected}`)
    errors += 1
  } else {
    console.log(`OK   ${method} ${p} → ${expected ? 'public' : 'auth'}`)
  }
})

if (errors > 0) {
  process.exit(1)
}
console.log('\n白名单校验通过')
