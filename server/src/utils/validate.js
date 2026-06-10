const LIMITS = {
  postContent: 2000,
  commentContent: 500,
  messageContent: 1000,
  username: 20,
  signature: 200,
  aiQuestion: 500,
  reviewContent: 1000,
}

const { validateMediaUrlPolicy } = require('./mediaUrlPolicy')
const { assertContentSafe } = require('./sensitiveWords')

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
  const lenErr = assertMaxLength('content', trimmed, LIMITS.postContent, '动态内容')
  if (lenErr) return lenErr
  return assertContentSafe(trimmed, '动态内容')
}

function validateCommentContent(content) {
  const trimmed = trimStr(content)
  if (!trimmed) return '请填写评论内容'
  const lenErr = assertMaxLength('content', trimmed, LIMITS.commentContent, '评论内容')
  if (lenErr) return lenErr
  return assertContentSafe(trimmed, '评论内容')
}

function validateMessageContent(content) {
  const trimmed = trimStr(content)
  if (!trimmed) return '请填写完整信息'
  const lenErr = assertMaxLength('content', trimmed, LIMITS.messageContent, '消息内容')
  if (lenErr) return lenErr
  return assertContentSafe(trimmed, '消息内容')
}

function validateReviewContent(content) {
  if (content == null || content === '') return null
  const trimmed = trimStr(content)
  const lenErr = assertMaxLength('content', trimmed, LIMITS.reviewContent, '评价内容')
  if (lenErr) return lenErr
  return assertContentSafe(trimmed, '评价内容')
}

function validateAiQuestion(question) {
  const trimmed = trimStr(question)
  if (!trimmed) return '请输入问题'
  const lenErr = assertMaxLength('question', trimmed, LIMITS.aiQuestion, '问题')
  if (lenErr) return lenErr
  return assertContentSafe(trimmed, '问题')
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
  return validateMediaUrlPolicy(url)
}

module.exports = {
  LIMITS,
  validatePostContent,
  validateCommentContent,
  validateMessageContent,
  validateReviewContent,
  validateAiQuestion,
  validateImagesArray,
  validateMediaUrl,
}
