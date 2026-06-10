const { buildRateLimiter } = require('../../utils/rateLimitStore')

function mockRes() {
  const res = {
    statusCode: 200,
    headers: {},
    body: null,
    set(key, val) {
      this.headers[key] = val
      return this
    },
    status(code) {
      this.statusCode = code
      return this
    },
    json(payload) {
      this.body = payload
      return this
    },
  }
  return res
}

describe('rateLimit middleware', () => {
  test('allows requests under limit', async () => {
    const limiter = buildRateLimiter({
      windowMs: 60_000,
      max: 2,
      keyPrefix: 't',
    })
    const req = { ip: '1.1.1.1', body: {}, headers: {} }
    const next = jest.fn()

    await limiter(req, mockRes(), next)
    await limiter(req, mockRes(), next)

    expect(next).toHaveBeenCalledTimes(2)
  })

  test('blocks requests over limit with 429', async () => {
    const limiter = buildRateLimiter({
      windowMs: 60_000,
      max: 2,
      keyPrefix: 't2',
      keyFn: (req) => req.body?.phone || '',
    })
    const req = { ip: '2.2.2.2', body: { phone: '13800138000' }, headers: {} }
    const next = jest.fn()

    await limiter(req, mockRes(), next)
    await limiter(req, mockRes(), next)
    const res = mockRes()
    await limiter(req, res, next)

    expect(next).toHaveBeenCalledTimes(2)
    expect(res.statusCode).toBe(429)
    expect(res.body.success).toBe(false)
  })
})
