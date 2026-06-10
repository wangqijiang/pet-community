const { isAllowedMediaUrl, validateMediaUrlPolicy } = require('../mediaUrlPolicy')

describe('mediaUrlPolicy', () => {
  const prev = process.env.STRICT_MEDIA_URLS

  afterEach(() => {
    process.env.STRICT_MEDIA_URLS = prev
    delete process.env.OSS_BUCKET_NAME
    delete process.env.OSS_ENDPOINT
  })

  test('allows local paths in dev', () => {
    process.env.STRICT_MEDIA_URLS = '0'
    expect(isAllowedMediaUrl('/uploads/a.jpg')).toBe(true)
  })

  test('strict mode requires allowed host', () => {
    process.env.STRICT_MEDIA_URLS = '1'
    process.env.OSS_BUCKET_NAME = 'pet-community'
    process.env.OSS_ENDPOINT = 'oss-cn-beijing.aliyuncs.com'
    expect(isAllowedMediaUrl('https://pet-community.oss-cn-beijing.aliyuncs.com/a.jpg')).toBe(true)
    expect(validateMediaUrlPolicy('https://evil.com/a.jpg')).toMatch(/允许的域名/)
  })
})
