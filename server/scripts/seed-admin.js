/**
 * 创建或更新管理员账号
 * 用法: node scripts/seed-admin.js
 * 环境变量: ADMIN_PHONE ADMIN_PASSWORD（默认 13800000000 / admin123）
 */
require('dotenv').config({ path: require('path').join(__dirname, '../.env') })
const { query } = require('../src/config/db')
const { hash } = require('../src/utils/bcrypt')

async function main() {
  const phone = process.env.ADMIN_PHONE || '13800000000'
  const password = process.env.ADMIN_PASSWORD || 'admin123'
  const username = process.env.ADMIN_USERNAME || '系统管理员'
  const hashed = await hash(password)

  const existing = await query('SELECT id FROM users WHERE phone = ?', [phone])
  if (existing.length) {
    await query(
      'UPDATE users SET username = ?, password = ?, role = ?, status = 1 WHERE phone = ?',
      [username, hashed, 'admin', phone]
    )
    console.log(`管理员已更新: ${phone}`)
  } else {
    await query(
      'INSERT INTO users (username, phone, password, role, status) VALUES (?, ?, ?, ?, 1)',
      [username, phone, hashed, 'admin']
    )
    console.log(`管理员已创建: ${phone}`)
  }
  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
