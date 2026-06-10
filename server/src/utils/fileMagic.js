const JPEG = Buffer.from([0xff, 0xd8, 0xff])
const PNG = Buffer.from([0x89, 0x50, 0x4e, 0x47])
const GIF = Buffer.from([0x47, 0x49, 0x46])
const WEBP_RIFF = Buffer.from([0x52, 0x49, 0x46, 0x46])

function startsWith(buf, sig) {
  return buf.length >= sig.length && buf.subarray(0, sig.length).equals(sig)
}

function isLikelyImageBuffer(buffer) {
  if (!buffer || buffer.length < 12) return false
  if (startsWith(buffer, JPEG)) return true
  if (startsWith(buffer, PNG)) return true
  if (startsWith(buffer, GIF)) return true
  if (startsWith(buffer, WEBP_RIFF) && buffer.toString('ascii', 8, 12) === 'WEBP') {
    return true
  }
  return false
}

module.exports = { isLikelyImageBuffer }
