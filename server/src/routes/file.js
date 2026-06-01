const express = require('express')
const router = express.Router()
const { auth } = require('../middleware/auth')
const { upload, saveUploadedFile } = require('../utils/upload')
const { success, error } = require('../utils/response')

/**
 * OSS 保存文件（对齐 logistics MiniController.updateFileOss）
 * POST multipart field: file
 * 返回 data 为图片公网 URL 字符串
 */
router.post('/updateFileOss', auth, upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json(error('请选择文件', 400))
  }

  try {
    const resultURL = await saveUploadedFile(req.file, req, 'files')
    res.json(success(resultURL, '上传成功'))
  } catch (err) {
    console.error('OSS 上传失败:', err)
    res.status(500).json(error(err.message || '上传失败', 500))
  }
})

module.exports = router
