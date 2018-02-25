export default async ({ socket, clients, logger, models: { Users },  args: [authTicket, done] }) => {
  const user = await Users.findByAuthTicket(authTicket)

  user.updateAttributes({ online: true })
  socket.updateAttributes({ user })

  clients[user.id] = socket.session

  logger.info(`${user.username} has connected`)
  socket.broadcast.emit('user/login', user)

  done(user)
}
