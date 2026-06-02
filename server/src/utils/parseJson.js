function parseJson(val, fallback = null) {
  if (val == null) return fallback
  if (typeof val === 'object') return val
  try {
    return JSON.parse(val)
  } catch {
    return fallback
  }
}

function parseJsonArray(val) {
  const parsed = parseJson(val, [])
  return Array.isArray(parsed) ? parsed : []
}

module.exports = { parseJson, parseJsonArray }
