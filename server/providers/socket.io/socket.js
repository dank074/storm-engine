'use strict'

const io = require('socket.io')
const http = require('http')

const Namespace = require('./namespace')

module.exports = class Socket extends Namespace {

  constructor(Ioc, Server, Helpers, Logger) {
    super(Ioc)

    //this._ioc = Ioc
    this._server = Server
    this._helpers = Helpers
    this._logger = Logger

    this._servicesPath = 'App/Ws'

    this._namespaces = {}
  }

  namespace(name, fn) { // or name it channel, and channel method for on?
    const namespace = new Namespace(this._ioc)

    namespace.setup(this.io.of(name))

    this._namespaces[name] = namespace

    return namespace
  }

  _start(adonis) {
    const options = require(this._helpers.appRoot('config/socket.js'))
    const start = require(this._helpers.appRoot('start/socket.js'))

    const port = options.port || 30000
    const server = http.createServer()
    this.io = io(server, options)

    server.listen(port)

    this._logger.info('serving websockets on', port)

    this._boot()

    Object.values(this._namespaces).forEach(namespace => namespace._boot())
  }

}
