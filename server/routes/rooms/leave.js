import moment from 'moment'

export default async ({ socket, models: { Rooms, UserRoomVisits } }) => {
	const roomId = socket.getRoomId()

	await Rooms.updateUsersNow(id)

	await UserRoomVisits.update({
		exit_timestamp: moment().unix()
	}, {
		where: { id: roomId }
	})


	socket.updateAttributes({ room: null })
	socket.broadcast.to(`room/${roomId}`).emit('rooms/leave', socket.session.user)
	socket.leave(`room/${roomId}`)
}
