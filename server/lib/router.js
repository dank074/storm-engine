import glob from 'glob'
import path from 'path'
import fs from 'fs'
import _ from 'lodash'

import { isString } from '../../utils'

export default function SocketRouter({ models, db, routes, io, config, ...rest }) {
  const _routes = {}
  const _models = {}

  glob.sync(path.join(models, '**')).forEach(modelFile => {
    const resolve = path.resolve(modelFile)

    if (fs.lstatSync(resolve).isDirectory() || path.basename(modelFile).includes('index')) {
      return false
    }

    const model = require(modelFile)(db, config)
    _models[model.prefix] = model
  })


  glob.sync(path.join(routes, '**')).forEach(file => {
    const resolve = path.resolve(file)

    if (fs.lstatSync(resolve).isDirectory()) {
      return false
    }

    const removeDirFromPath = resolve.replace(routes, '')
    const convertToRoute = removeDirFromPath.split('\\').join('/')
    let route = convertToRoute.replace('.js', '').slice(1)

    const Controller = require(file)
    if (!(Controller instanceof Function)) {
      return false
    }

    _routes[route] = Controller
  })

  // clean this up somehow
  const clients = {}

  // Validate auth ticket before allowing socket access
  /*io.use(async (socket, next) => {
    const { Users } = _models
    const { authTicket } = socket.handshake.query

    const user = await Users.findByAuthTicket(authTicket)

    if (!user) {
      return next(new Error('Authentication failed'))
    }

    next()
  })*/

  io.on('connection', (socket) => {
    socket.updateAttributes = (attributes: Object) => {
      socket.session = _.merge(socket.session, attributes)
    }

    socket.getUserId = () => socket.session.user.id
    socket.getRoomId = () => socket.session.room.id

    Object.keys(_routes).forEach(name => {
      // const Controller = _routes[name]
      // socket[Controller.method].call(socket, name, fn)

      socket.on(name, (...args) => {
        return _routes[name]({
          ...rest,
          io,
          db,
          config,
          socket,
          clients,
          args: [...args],
          models: _models
        })
      })
    })
  })
}
