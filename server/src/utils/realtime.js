const { query } = require('../config/db')

/** @type {Map<number, Set<import('ws').WebSocket>>} */
const clients = new Map()

function addClient(userId, ws) {
  const uid = Number(userId)
  if (!clients.has(uid)) clients.set(uid, new Set())
  clients.get(uid).add(ws)
}

function removeClient(userId, ws) {
  const uid = Number(userId)
  const set = clients.get(uid)
  if (!set) return
  set.delete(ws)
  if (!set.size) clients.delete(uid)
}

function pushToUser(userId, payload) {
  const uid = Number(userId)
  const set = clients.get(uid)
  if (!set || !set.size) return

  const text = JSON.stringify(payload)
  for (const ws of set) {
    if (ws.readyState === 1) {
      ws.send(text)
    }
  }
}

async function pushNotificationById(notificationId) {
  const rows = await query(
    `SELECT n.*, u.username AS from_username, u.avatar AS from_avatar
     FROM notifications n
     LEFT JOIN users u ON n.from_user_id = u.id
     WHERE n.id = ?`,
    [notificationId],
  )
  if (!rows[0]) return
  pushToUser(rows[0].user_id, { type: 'notification', data: rows[0] })
}

module.exports = {
  addClient,
  removeClient,
  pushToUser,
  pushNotificationById,
}
