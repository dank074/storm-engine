'use strict'

const Logger = use('Logger')
const Users = use('App/Models/Users')
const Channel = use('Channel')

module.exports = class Auth extends Channel {

  async login(authTicket, done) {
    try {
      const user = await Users.findBy('auth_ticket', authTicket)

      user.merge({ online: true })
      this.updateAttributes({ user })

      Logger.info(`${user.username} has connected`)
      this.broadcast.emit('user/login', user)

      done(user)
    } catch (e) {
      Logger.error(e)
      done(e)
    }
  }

}
