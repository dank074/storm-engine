'use strict'

const _ = require('lodash')

module.exports = class Namespace {

  constructor(Ioc) {
    this._ioc = Ioc

    this._middleware = []
    this._channels = {}
  }

  _setup(Ws) {
    this.io = Ws
  }

  use(...args) {
    this._middleware.push(...args)

    return this
  }

  channel(name, closure) {
    this._channels[name] = closure

    return this
  }

  _boot() {
    this._middleware.forEach(middleware => this.io.use(...middleware))

    this.io.on('connection', (socket) => {
      socket.io = this.io
      socket.updateAttributes = function (attributes) {
        socket.session = _.merge({}, socket.session, attributes)
      }

      Object.keys(this._channels).forEach(name => {
        const closure = this._channels[name].split('.')

        const Channel = this._ioc.use(closure[0])
        const channel = new Channel(this.io, socket)

        if (closure.length > 1) {
          const method = channel[closure[1]]

          socket.on(name, method)//.bind(socket)
        } else if (Channel.prototype.hasOwnProperty('__invoke')) {
          socket.on(name, channel['__invoke'])//.bind(socket)
        } else {
          Object.getOwnPropertyNames(Channel.prototype).forEach(method => {
            if (method !== 'constructor' && typeof channel[method] === 'function') {
              socket.on(`${name}/${method}`, channel[method])//.bind(socket)
            }
          })
        }
      })
    })
  }

}
