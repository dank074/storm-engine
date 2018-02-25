import moment from 'moment'

export default async ({ socket, io, clients, models: { Rooms, UserRoomVisits }, args: [id, done] }) => {
  const room = await Rooms.findOne({ where: { id } })
  const roomId = `room/${room.id}`

  if (room.state === 'locked') {
    done('locked')
  } else if(room.state === 'password') {
    done('password')
  } else if (room.usersMax < (room.usersNow + 1)) {
    done('full')
  } else {
    const user_id = socket.getUserId()

    room.updateAttributes({
      usersNow: room.usersNow + 1
    })

    let userRoomVisits = await UserRoomVisits.findOne({
      where: { user_id }
    })

    if (!userRoomVisits) {
      userRoomVisits = await UserRoomVisits.create({
        user_id,
        room_id: room.id
      })
    } else {
      userRoomVisits.updateAttributes({
        room_id: room.id,
        entry_timestamp: moment().unix(),
        exit_timestamp: null
      })
    }

    io.sockets.in(roomId).clients((err, clients) => {
      if (err) return logger.error(err)

      room.users = clients

      socket.broadcast.to(roomId).emit('rooms/join', socket.session.user)
      socket.join(roomId)

      socket.updateAttributes({ room, userRoomVisits })

      done(room)
    })
  }

}
