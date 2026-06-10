const LIMITS = {
  postContent: 2000,
  commentContent: 500,
  messageContent: 1000,
  username: 20,
  signature: 200,
}

function trimStr(val) {
  return typeof val === 'string' ? val.trim() : val
}

function assertMaxLength(field, value, max, label) {
  if (value == null || value === '') return null
  const str = String(value)
  if (str.length > max) {
    return `${label || field}不能超过${max}个字符`
  }
  return null
}

function validatePostContent(content) {
  const trimmed = trimStr(content)
  if (!trimmed) return '请填写内容'
  return assertMaxLength('content', trimmed, LIMITS.postContent, '动态内容')
}

function validateCommentContent(content) {
  const trimmed = trimStr(content)
  if (!trimmed) return '请填写评论内容'
  return assertMaxLength('content', trimmed, LIMITS.commentContent, '评论内容')
}

function validateMessageContent(content) {
  const trimmed = trimStr(content)
  if (!trimmed) return '请填写完整信息'
  return assertMaxLength('content', trimmed, LIMITS.messageContent, '消息内容')
}

function validateImagesArray(images) {
  if (images == null) return null
  if (!Array.isArray(images)) return '图片格式不正确'
  if (images.length > 9) return '最多上传9张图片'
  for (const url of images) {
    const err = validateMediaUrl(url)
    if (err) return err
  }
  return null
}

function validateMediaUrl(url) {
  if (url == null || url === '') return null
  const str = String(url).trim()
  if (str.startsWith('/uploads/') || str.startsWith('/static/')) return null
  if (/^https?:\/\/.+/i.test(str)) return null
  return '图片地址格式不正确'
}

module.exports = {
  LIMITS,
  validatePostContent,
  validateCommentContent,
  validateMessageContent,
  validateImagesArray,
  validateMediaUrl,
}
