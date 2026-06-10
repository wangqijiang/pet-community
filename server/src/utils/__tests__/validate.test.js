const {
  validatePostContent,
  validateCommentContent,
  validateMessageContent,
  validateImagesArray,
} = require('../validate')

describe('validate utils', () => {
  test('validatePostContent rejects empty and too long', () => {
    expect(validatePostContent('')).toBe('请填写内容')
    expect(validatePostContent('   ')).toBe('请填写内容')
    expect(validatePostContent('a'.repeat(2001))).toMatch(/不能超过/)
    expect(validatePostContent('hello')).toBeNull()
  })

  test('validateCommentContent', () => {
    expect(validateCommentContent('')).toBe('请填写评论内容')
    expect(validateCommentContent('x'.repeat(501))).toMatch(/不能超过/)
    expect(validateCommentContent('nice')).toBeNull()
  })

  test('validateMessageContent', () => {
    expect(validateMessageContent('')).toBe('请填写完整信息')
    expect(validateMessageContent('m'.repeat(1001))).toMatch(/不能超过/)
    expect(validateMessageContent('hi')).toBeNull()
  })

  test('validateImagesArray', () => {
    expect(validateImagesArray(null)).toBeNull()
    expect(validateImagesArray([])).toBeNull()
    expect(validateImagesArray('bad')).toBe('图片格式不正确')
    expect(validateImagesArray(Array(10).fill('url'))).toBe('最多上传9张图片')
    expect(validateImagesArray(['https://example.com/a.jpg'])).toBeNull()
    expect(validateImagesArray(['javascript:alert(1)'])).toBe('图片地址格式不正确')
  })
})
