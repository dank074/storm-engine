import io from 'socket.io-client'

import * as utils from '../utils'

export default class GameClient {

	renderer: Object
	socket: Object
	config: Object
	world: Object
	camera: Object
	room: Object
	resources: Object

	constructor (options: Object) {
		if (window) {
			require('pixi.js')
			const Storage = require('./lib/Storage')
			const Game = require('./Game')

			this.config = utils.validate(options, {
				host: {
					type: 'string',
					default: '127.0.0.1'
				},
				port: {
					type: 'integer',
					default: 30000
				},
				url: {
					type: 'string',
					default: '//127.0.0.1:30000'
				},
				assetsUrl: {
					type: 'string',
					default: '//127.0.0.1:3000'
				},
				secure: {
					type: 'boolean',
					default: false
				},
				container: {
					type: 'element',
					required: true
				},
				width: {
					type: 'integer',
					default: window.innerWidth//options.container.offsetWidth
				},
				height: {
					type: 'integer',
					default: window.innerHeight//options.container.offsetHeight
				},
				authTicket: {
					type: 'string',
					required: true
				},
				backgroundColor: {
					default: 0x0E151C
				},
				resolution: {
					type: 'integer',
					default: 1
				},
				storage: 'object',
				room: 'integer',
				dev: {
					type: 'boolean',
					default: false
				}
			})

			const { assetsUrl, authTicket, secure, host, port, container, backgroundColor, resolution, height, width } = this.config

			container.style.cssText = `
			  height: 100vh;
			  width: 100vw;
			  left: 0;
			  right: 0;
			  top: 0;
			  bottom: 0;
			  overflow: hidden;
		 	`

			// Connect to server socket
			this.socket = io(`//${host}:${port}`, {
				secure,
				query: { authTicket },
				reconnect: true
			})

			/*require('webfontloader').load({
				custom: {
					families: ['Ubuntu', 'Ubuntu Condensed'],
					urls: [`${assetsUrl}/fonts/fonts.css`]
				}
			})*/

      const rendererOptions = {
        antialias: true,
        legacy: true,
        width,
        height,
        backgroundColor: 0xFFFFFF,
        resolution
      }

			// Firefox Quantum doesn't completely support WebGL yet
			this.renderer = PIXI.autoDetectRenderer(rendererOptions)

			this.storage = new Storage(options.storage)
			this.world = new PIXI.Container()
			this.store = require('./mobx/store')()

			Game.setup(this)
			require('./gui')(this.config, this.store)

			this.socket.on('connect', () => {
				console.info('Socket connected')

				Game.start()
			})

			this.socket.on('error', console.error)
			this.socket.on('connect_timeout', console.error)
			this.socket.on('connect_error', console.error)
		}
	}

}
