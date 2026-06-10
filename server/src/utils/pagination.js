/** 统一分页参数解析，防止超大 size 拖垮 DB */
function parsePagination(query, defaults = { page: 1, size: 20, maxSize: 100 }) {
  const page = Math.max(1, parseInt(query.page, 10) || defaults.page)
  const rawSize = parseInt(query.size, 10) || defaults.size
  const maxSize = defaults.maxSize ?? 100
  const size = Math.min(maxSize, Math.max(1, rawSize))
  const offset = (page - 1) * size
  return { page, size, offset }
}

module.exports = { parsePagination }
