'use strict'

const Database = use('Database')
const Rooms = use('App/Models/Rooms')
const Channel = use('Channel')
const Logger = use('Logger')

module.exports = class extends Channel {

  async join(id, done) {
    const room = await Rooms.findOrFail(id)

    if (room.state === 'locked') {
      done('locked')
    } else if(room.state === 'password') {
      done('password')
    } else if (room.usersMax < (room.usersNow + 1)) {
      done('full')
    } else {
      const roomId = `room/${room.id}`
      room.merge({ usersNow: ++room.usersNow })

      const furni = await Database
        .select('*')
        .from('furniture')
        .innerJoin('room_items', 'furniture.id', 'room_items.itemId')
        .where('room_items.roomId', room.id)

      this.io.sockets.in(roomId).clients((err, users) => {
        if (err) return Logger.error(err)

        this.broadcast.to(roomId).emit('rooms/join', this.session.user)
        this.join(roomId)

        done({
          users,
          furni,
          ...room.toJSON()
        })
      })
    }
  }

  leave() {
  	//socket.updateAttributes({ room: null })
  	this.broadcast.to(`room/${roomId}`).emit('rooms/leave', this.session.user)
  	this.leave(`room/${roomId}`)
  }

}
