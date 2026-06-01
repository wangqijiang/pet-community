const OSS = require('ali-oss')
const crypto = require('crypto')
const path = require('path')

function getOssConfig() {
  const endpoint = process.env.OSS_ENDPOINT
  const accessKeyId = process.env.OSS_ACCESS_KEY_ID
  const accessKeySecret = process.env.OSS_ACCESS_KEY_SECRET
  const bucketName = process.env.OSS_BUCKET_NAME
  const region = process.env.OSS_REGION

  const hasCredentials =
    !!endpoint && !!accessKeyId && !!accessKeySecret && !!bucketName && !!region
  const forceOff =
    process.env.OSS_ENABLED === '0' || process.env.OSS_ENABLED === 'false'
  const enabled = !forceOff && hasCredentials

  return { enabled, endpoint, accessKeyId, accessKeySecret, bucketName, region }
}

function buildObjectName(originalFilename) {
  const prefix = (process.env.OSS_KEY_PREFIX || 'pet-community/')
    .replace(/^\/?/, '')
    .replace(/\/?$/, '/')
  const ext = path.extname(originalFilename || '') || '.jpg'
  const uuid = typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.round(Math.random() * 1e9)}`
  return `${prefix}${uuid}${ext}`
}

function buildPublicUrl(objectName) {
  const { bucketName, endpoint } = getOssConfig()
  const host = endpoint.startsWith('http') ? endpoint : `https://${bucketName}.${endpoint}`
  const base = host.replace(/\/$/, '')
  return `${base}/${objectName.replace(/^\//, '')}`
}

/**
 * 上传字节到 OSS（与 logistics AliOssUtil.upload 一致）
 * @param {Buffer} bytes
 * @param {string} objectName
 * @returns {Promise<string>} 公网访问 URL
 */
async function upload(bytes, objectName) {
  const cfg = getOssConfig()
  if (!cfg.enabled) {
    throw new Error('OSS 未配置')
  }

  const client = new OSS({
    region: cfg.region,
    accessKeyId: cfg.accessKeyId,
    accessKeySecret: cfg.accessKeySecret,
    bucket: cfg.bucketName,
    endpoint: cfg.endpoint,
  })

  await client.put(objectName, bytes)
  return buildPublicUrl(objectName)
}

function isOssEnabled() {
  return getOssConfig().enabled
}

module.exports = {
  upload,
  buildObjectName,
  buildPublicUrl,
  isOssEnabled,
  getOssConfig,
}
