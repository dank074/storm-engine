import { Camera, Avatar } from '../../lib'

import RoomFurni from './RoomFurni'
import RoomFloor from './RoomFloor'
import Game from '../../Game'

export default new class Room {

	view: Object
	camera: Object

	tiles: Object = {}
	users: Object = {}

	init() {
		this.camera = new Camera()
		this.avatars = new PIXI.Container()
		//this.avatar = new Avatar({  })

		this.view = new PIXI.Container()
		//this.createFloor()
	}

	leave() {
		this.camera.remove()

		this.floor.destroy(false)
	}

	join(roomId: Number) {
		return new Promise(resolve => {
			if (this.data) this.leave()

			Game.socket.emit('rooms/join', roomId, (room) => {
				this.data = room
				this.data.floor = JSON.parse(room.floor)
				
				resolve(room)

				// determine if locked or password protected ??
				switch (room) {
					case 'locked': {
						// locked
					}

					case 'password': {
						// password
					}

					case 'full': {
						// room full
					}

					case 'banned': {
						// banned
					}

					default:
						return this.addToCamera()
				}
			})
		})
	}

	setupHandlers() {
		const { socket } = Game

		Game.socket.on('rooms/join', this.addAvatar)
		Game.socket.on('rooms/leave', this.removeAvatar)

		Game.socket.on('rooms/user/move', (target: Object, x: Number, y: Number) => {
			this.users[target.id].move(x, y)
		})
	}

	removeAvatar = (target: Object) => {
		this.avatars.removeChild(this.users[target.id])

		delete this.users[target.id]
	}

	addAvatar = (target: Object) => {
		const avatar = new Avatar({ target })

		this.users[target.id] = avatar
		this.avatars.addChild(avatar)
	}

	addAvatars() {
		this.users[Game.user.id] = Game.avatar
		this.avatars.addChild(Game.avatar)

		this.data.users.forEach(this.addAvatar)

		this.view.addChild(this.avatars)
	}

	addToCamera() {
		//this.renderer.displayList = new PIXI.DisplayList()
		// this.createWalls()
		Game.renderer.mouseover = () => this.floor.tileOutline.visible = false
		this.createFloor()
		this.createFurni()
		// this.createAvatars()

		this.setupHandlers()

		Game.renderer.backgroundColor = 0x212226

		this.camera.render(this.view)
	}

	createFurni() {
		if (this.furni) this.furni.destroy(false)
		this.furni = new RoomFurni(this.floor, this.data)

		this.furni.draw()
		this.view.addChild(this.furni)
	}

	createFloor() {
		if (this.floor) this.floor.destroy(false)
		this.floor = new RoomFloor(this.data)

		this.floor.draw()
		this.view.addChild(this.floor)
	}

}
