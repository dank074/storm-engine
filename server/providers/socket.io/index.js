'use strict'

const { ServiceProvider } = require('@adonisjs/fold')

module.exports = class SocketIO extends ServiceProvider {

  async register() {
    this.app.singleton('App/Providers/WebSockets', (Ioc) => {
      const Socket = require('./socket')

      const Logger = use('Logger')
      const Helpers = use('Helpers')
      const Server = use('Server')

      return new Socket(Ioc, Server, Helpers, Logger)
    })
    this.app.alias('App/Providers/WebSockets', 'Ws')

    this.app.bind('App/Providers/WebSockets/Channel', (Ioc) => {
      return require('./service')
    })
    this.app.alias('App/Providers/WebSockets/Channel', 'Channel')
  }

  async boot() {
    this.app.use('App/Providers/WebSockets')._start(this.app)
  }

}
