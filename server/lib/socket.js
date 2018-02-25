const logger = require('./lib/logger')

const allClients = {}

module.exports = (db) => {
  const Users = require('./database/models/users')(db)
  const Rooms = require('./database/models/rooms')(db)

  return (socket) => {
    socket.on('authenticate', async (authTicket, done) => {
      const user = await Users.findOne({ where: { authTicket } })

      user.updateAttributes({
        online: true
      })

      socket.user = user
      allClients[user.id] = socket

      logger.info(`${user.username} has connected`)
      socket.broadcast.emit('user/login', user)
      
      done(user)
    })

    socket.on('disconnect', () => {
      delete allClients[socket.user.id]

      await Users.setOffline(socket.user.id)

      logger.info(`${socket.user.username} has disconnected`)
      socket.broadcast.emit('user/logout', socket.user)
    })

    socket.on('room/join', async (roomId, done) => {
      const room = await Rooms.findOne({ where: { id: roomId } })

      if (room.users_max > (room.users_now + 1)) {
        room.updateAttributes({
          users_now: room.users_now++
        })

        const user = await Users.update({
          in_room: roomId
        }, {
          where: {
            id: socket.user.id
          }
        })

        socket.join(`room/${roomId}`)

        done(room)
      } else {
        //logger.error(`User ${}`)
      }
    })

    /*socket.on('room/leave', async (roomId) => {
      const room = await Rooms.findOne({ where: { id: roomId } })

      socket.leave(roomId)

      room.updateAttributes({
        users_now: room.users_now--
      })

      const user = await Users.update({
        in_room: null
      }, {
        where: {
          id: socket.user.id
        }
      })
    })*/

    socket.on('error', (err) => logger.error(err))
    socket.on('debug', (data) => logger.debug(data))
    socket.on('info', (info) => logger.info(info))
  }
}
