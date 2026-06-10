const { parsePagination } = require('../pagination')

describe('parsePagination', () => {
  test('caps size at maxSize', () => {
    const result = parsePagination({ page: '2', size: '999' }, { maxSize: 50 })
    expect(result).toEqual({ page: 2, size: 50, offset: 50 })
  })

  test('uses defaults for invalid input', () => {
    const result = parsePagination({}, { page: 1, size: 20, maxSize: 100 })
    expect(result).toEqual({ page: 1, size: 20, offset: 0 })
  })
})
