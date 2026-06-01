const multer = require('multer')
const path = require('path')
const fs = require('fs')
const { upload: uploadToOss, buildObjectName, isOssEnabled } = require('./aliOss')

const uploadDir = path.join(__dirname, '../../uploads')
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

/** 内存存储，便于直传 OSS（与 Java MultipartFile.getBytes 一致） */
const storage = multer.memoryStorage()

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (/^image\//.test(file.mimetype)) cb(null, true)
    else cb(new Error('仅支持图片上传'))
  },
})

/**
 * 将 multer 文件上传并返回公网 URL（优先 OSS，未配置则落盘）
 * @param {Express.Multer.File} file
 * @param {import('express').Request} [req]
 * @param {string} [sub] 本地落盘子目录 avatars | files
 */
async function saveUploadedFile(file, req, sub = 'files') {
  if (!file || !file.buffer) {
    throw new Error('无效的上传文件')
  }

  if (isOssEnabled()) {
    const objectName = buildObjectName(file.originalname || 'image.jpg')
    return uploadToOss(file.buffer, objectName)
  }

  const dir = path.join(uploadDir, sub)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  const ext = path.extname(file.originalname || '') || '.jpg'
  const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`
  const filepath = path.join(dir, filename)
  fs.writeFileSync(filepath, file.buffer)
  return toPublicUrl(req, filename, sub)
}

/** @deprecated 仅本地模式使用 */
const toPublicUrl = (req, filename, sub = 'avatars') => {
  const base = process.env.PUBLIC_BASE_URL || `${req.protocol}://${req.get('host')}`
  return `${base}/uploads/${sub}/${filename}`
}

module.exports = {
  upload,
  saveUploadedFile,
  toPublicUrl,
  uploadDir,
  isOssEnabled,
}
