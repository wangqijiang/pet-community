const WebSocket = require('ws')
const { verify } = require('../utils/jwt')
const { query } = require('../config/db')
const { addClient, removeClient } = require('../utils/realtime')

function initWebSocket(server) {
  const wss = new WebSocket.Server({ server, path: '/ws' })

  wss.on('connection', async (ws, req) => {
    try {
      const url = new URL(req.url || '', 'http://localhost')
      const token = url.searchParams.get('token')
      const decoded = verify(token)

      if (!decoded?.id) {
        ws.close(4001, 'Unauthorized')
        return
      }

      const users = await query(
        'SELECT id FROM users WHERE id = ? AND status = 1',
        [decoded.id],
      )
      if (!users.length) {
        ws.close(4001, 'Unauthorized')
        return
      }

      const userId = users[0].id
      addClient(userId, ws)
      ws.send(JSON.stringify({ type: 'connected', data: { userId } }))

      ws.isAlive = true
      ws.on('pong', () => {
        ws.isAlive = true
      })

      ws.on('close', () => removeClient(userId, ws))
      ws.on('error', () => removeClient(userId, ws))
    } catch (err) {
      console.error('WebSocket connection error:', err)
      ws.close(1011, 'Internal error')
    }
  })

  const heartbeat = setInterval(() => {
    wss.clients.forEach((ws) => {
      if (ws.isAlive === false) {
        ws.terminate()
        return
      }
      ws.isAlive = false
      ws.ping()
    })
  }, 30000)

  wss.on('close', () => clearInterval(heartbeat))

  console.log('WebSocket server ready at /ws')
}

module.exports = { initWebSocket }
