import { Op } from 'sequelize'

export default async ({ socket, logger, clients, models: { Users, Rooms, UserRoomVisits } }) => {
  if (socket.session.user) {
    const userId = socket.getUserId()
    const roomId = socket.getRoomId()

  	delete clients[userId]

	  if (socket.session.room && socket.session.userRoomVisits) {
		  const currentTimestamp = require('moment')().unix()

		  const success = await UserRoomVisits.update({
		  	exit_timestamp: currentTimestamp
		  }, {
		  	where: {
		  		room_id: roomId,
		  		user_id: userId,
		  		exit_timestamp: {
		  			[Op.ne]: null
		  		},
		  		/*entry_timestamp: {
		  			[Op.between]: [
		  				socket.userRoomVisits.entry_timestamp,
		  				currentTimestamp
		  			]
		  		}*/
		  	}
		  })

		  if (success) {
		  	await Rooms.decrementUsersNow(roomId)
		  }
	  }

	  await Users.setOffline(userId)

	  logger.info(`${socket.session.user.username} has disconnected`)
	  socket.broadcast.emit('user/logout', socket.session.user)
  }

  // socket.leave(`room/${socket.room.id}`)
  // socket.room = null
}
