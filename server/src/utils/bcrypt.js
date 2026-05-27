const bcrypt = require('bcryptjs')

const hash = async (password) => {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

const compare = async (password, hash) => {
  return bcrypt.compare(password, hash)
}

module.exports = { hash, compare }
