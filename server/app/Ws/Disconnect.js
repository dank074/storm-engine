'use strict'

const Channel = use('Channel')
const Logger = use('Logger')

module.exports = class Disconnect extends Channel {

  __invoke() {
    if (this.session && this.session.user) {
      const { user } = this.session
      //const roomId = this.session.room.id

      Logger.info('%(username)s with ID: %(id)b has disconnected', user)
  	  this.broadcast.emit('user/logout', user.id)
    }
  }

}
