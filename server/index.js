import express from 'express'
import cors from 'cors'
import path from 'path'

import { logger, SocketRouter } from './lib'
import * as utils from '../utils'

const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)

function parseConfig(config: Object) {
	if (utils.isObject(config)) {
		return config
	} else {
		try {
			return JSON.parse(require('fs').readFileSync(config))
		} catch (err) {
			logger.debug('==> ERROR: Error parsing your config file')
			logger.error(err)
		}
	}
}

function validateConfig(config) {
	return utils.validate(parseConfig(config), {
		host: {
			type: 'string',
			default: '127.0.0.1'
		},
		port: {
			type: 'integer',
			default: 30000
		},
		secret: {
			type: 'string',
			required: true
		},
		database: {
			type: 'object',
			required: true
		}
	})
}

export default function GameServer(config: Object) {
	config = validateConfig(config)

	const db = require('./database')(config.database)

	app.set('config', config)
		.set('trust proxy', 'loopback')
		.use(cors())
		.use(express.static(path.join(__dirname, '..', 'assets')))
		.get('/imaging/:figure', (...args) => require('./lib/avatar2')(...args))

	const runnable = app.listen(config.port, (err) => {
		if (err) throw err

		logger.info('GameServer connected to: %s:%s', config.host, config.port)
	})

	io.listen(runnable)

	SocketRouter({
		config,
		io,
		db,
		logger,
		models: path.join(__dirname, 'database', 'models'),
		routes: path.join(__dirname, 'routes'),
	})

	logger.info(process.cpuUsage())
}
