const { mergeUsers, dedupeMergeData, recalcUserStats } = require('../userMerge')
const { transaction } = require('../../config/db')

jest.mock('../../config/db', () => ({
  transaction: jest.fn(),
}))

function createMockConn() {
  const queries = []
  return {
    queries,
    query(sql, params) {
      queries.push({ sql: sql.replace(/\s+/g, ' ').trim(), params })
      return Promise.resolve([])
    },
  }
}

describe('userMerge', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('mergeUsers skips when ids missing or equal', async () => {
    await mergeUsers(null, 2)
    await mergeUsers(1, null)
    await mergeUsers(1, 1)
    expect(transaction).not.toHaveBeenCalled()
  })

  test('mergeUsers migrates data and disables source user', async () => {
    const conn = createMockConn()
    transaction.mockImplementation(async (cb) => cb(conn))

    await mergeUsers(10, 20)

    expect(transaction).toHaveBeenCalledTimes(1)
    const sqls = conn.queries.map((q) => q.sql)

    expect(sqls.some((s) => s.includes('UPDATE pets SET user_id = ? WHERE user_id = ?'))).toBe(true)
    expect(sqls.some((s) => s.includes('UPDATE posts SET user_id = ? WHERE user_id = ?'))).toBe(true)
    expect(sqls.some((s) => s.includes('UPDATE follows SET user_id = ? WHERE user_id = ?'))).toBe(true)
    expect(sqls.some((s) => s.includes('UPDATE messages SET from_id = ? WHERE from_id = ?'))).toBe(true)

    const disableQuery = conn.queries.find((q) =>
      q.sql.includes('UPDATE users SET phone = NULL, openid = NULL, status = 0'),
    )
    expect(disableQuery?.params).toEqual([20])
  })

  test('dedupeMergeData removes self-follow and duplicate likes', async () => {
    const conn = createMockConn()
    await dedupeMergeData(conn, 5)

    expect(conn.queries.some((q) => q.sql.includes('DELETE FROM follows WHERE user_id = ? AND follow_id = ?'))).toBe(true)
    expect(conn.queries.some((q) => q.sql.includes('DELETE l1 FROM likes l1'))).toBe(true)
    expect(conn.queries.some((q) => q.sql.includes('DELETE FROM messages WHERE from_id = ? AND to_id = ?'))).toBe(true)
  })

  test('recalcUserStats updates cached counts', async () => {
    const conn = createMockConn()
    await recalcUserStats(conn, 7)

    expect(conn.queries).toHaveLength(1)
    expect(conn.queries[0].sql).toContain('posts_count = (SELECT COUNT(*) FROM posts')
    expect(conn.queries[0].params.filter((p) => p === 7).length).toBeGreaterThanOrEqual(4)
  })
})
