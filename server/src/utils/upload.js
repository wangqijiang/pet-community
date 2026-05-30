const multer = require('multer')
const path = require('path')
const fs = require('fs')

const uploadDir = path.join(__dirname, '../../uploads')
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const sub = file.fieldname === 'avatar' ? 'avatars' : 'files'
    const dir = path.join(uploadDir, sub)
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    cb(null, dir)
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg'
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`)
  }
})

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (/^image\//.test(file.mimetype)) cb(null, true)
    else cb(new Error('仅支持图片上传'))
  }
})

const toPublicUrl = (req, filename, sub = 'avatars') => {
  const base = process.env.PUBLIC_BASE_URL || `${req.protocol}://${req.get('host')}`
  return `${base}/uploads/${sub}/${filename}`
}

module.exports = { upload, toPublicUrl, uploadDir }
