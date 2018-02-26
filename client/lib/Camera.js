import Mousetrap from 'mousetrap'

import Game from '../Game'

export default class Camera {

	_zoomLevel = 1

	constructor() {
		this.view = new PIXI.Container()
		this.view.interactive = true

		this.view.hitArea = new PIXI.Rectangle(0, 0, Game.renderer.width, Game.renderer.height)
	}

	render(room) {
		this.room = room

		this.view.position.copy(room.position)

		this.view.addChild(room)
		this._addInteractions()

		Game.world.addChild(this.view)
	}

	remove() {
		Game.world.removeChild(this.view)
	}

	_setZoomLevel(action) {
		switch (action) {
			case 'in':
				return this._zoomLevel += 0.1

			case 'out':
				return this._zoomLevel -= 0.1

			case 'reset':
				return this._zoomLevel = 1
		}
	}

	_zoom = (action) => {
		return (e) => {
			const zoomLevel = this._setZoomLevel(action)

			this.room.scale.set(zoomLevel)
			// @TODO: Fix positioning depending on scale level
			// so that the room stays in center when zooming
			this.room.position.set(
				this.room.position.x / zoomLevel,
				this.room.position.y / zoomLevel
			)

			return false
		}
	}

	_cameraReset = () => {
		this.room.position.set(0, 0)

		return false
	}

	_addInteractions() {
		this.room.interactive = true

		Mousetrap.bind(['ctrl+z+up','command+z+up'], this._zoom('in'))
		Mousetrap.bind(['ctrl+z+down', 'command+z+down'], this._zoom('out'))
		Mousetrap.bind(['ctrl+shift+z', 'command+shift+z'], this._zoom('reset'))
		Mousetrap.bind(['ctrl+shift+c', 'command+shift+c'], this._cameraReset)

		this.view
			.on('pointerdown', this.onDragStart)
			.on('pointerup', this.onDragEnd)
			.on('pointerupoutside', this.onDragEnd)
			.on('pointermove', this.onDragMove)
	}

	onDragStart = (event) => {
   	const { room } = this

		room.dragData = event.data
		room.dragging = true
		room.dragPointerStart = event.data.getLocalPosition(room.parent)
		room.dragObjStart = new PIXI.Point()
		room.dragObjStart.copy(room.position)
		room.dragGlobalStart = new PIXI.Point()
		room.dragGlobalStart.copy(event.data.global)
	}

	onDragEnd = (event) => {
   	const { room } = this

    if (!room.dragging) return

    if (room.dragging == 1) {
    	room.factor = 1.0 - room.factor
    }

    room.dragging = 0
    room.dragData = null
    // set the interaction data to null
	}

	onDragMove = (event) => {
   	const { room } = this
   	const data = room.dragData

    if (!room.dragging) return

    if (room.dragging == 1) {
       // click or drag?
       if (Math.abs(data.global.x - room.dragGlobalStart.x) +
           Math.abs(data.global.y - room.dragGlobalStart.y) >= 3) {
          // DRAG
          room.dragging = 2
       }
    } else if (room.dragging == 2) {
       const dragPointerEnd = data.getLocalPosition(room.parent)
       // DRAG

       room.position.set(
         room.dragObjStart.x + (dragPointerEnd.x - room.dragPointerStart.x),
         room.dragObjStart.y + (dragPointerEnd.y - room.dragPointerStart.y)
       )
    }
	}

}
