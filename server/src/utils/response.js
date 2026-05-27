const success = (data = null, message = '操作成功') => {
  return {
    success: true,
    message,
    data,
    timestamp: Date.now()
  }
}

const error = (message = '操作失败', code = -1) => {
  return {
    success: false,
    message,
    code,
    timestamp: Date.now()
  }
}

const pagination = (data = [], total = 0, page = 1, size = 10) => {
  return {
    success: true,
    message: '操作成功',
    data: {
      list: data,
      pagination: {
        total,
        page,
        size,
        pages: Math.ceil(total / size)
      }
    },
    timestamp: Date.now()
  }
}

module.exports = { success, error, pagination }
