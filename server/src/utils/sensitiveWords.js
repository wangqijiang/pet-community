/** 内置敏感词（可通过环境变量 SENSITIVE_WORDS 追加，逗号分隔） */
const BUILTIN = [
  '赌博',
  '色情',
  '裸聊',
  '刷单',
  '代开发票',
  '加微信',
  '私聊领取',
  '点击链接',
  'vpn',
  '翻墙',
]

function getWordList() {
  const extra = process.env.SENSITIVE_WORDS || ''
  const fromEnv = extra
    .split(',')
    .map((w) => w.trim())
    .filter(Boolean)
  return [...new Set([...BUILTIN, ...fromEnv])]
}

function findSensitiveWord(text) {
  if (!text || process.env.CONTENT_MODERATION === 'off') return null
  const lower = String(text).toLowerCase()
  for (const word of getWordList()) {
    if (lower.includes(String(word).toLowerCase())) return word
  }
  return null
}

function assertContentSafe(text, label = '内容') {
  const hit = findSensitiveWord(text)
  if (hit) {
    return `${label}包含不当信息，请修改后重试`
  }
  return null
}

module.exports = { findSensitiveWord, assertContentSafe, getWordList }
