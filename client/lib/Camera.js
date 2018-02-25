import Game from '../Game'

export default class Camera {

	view: Object
	room: Object

	constructor() {
		this.view = new PIXI.Container()
		this.view.interactive = true

		this.view.hitArea = new PIXI.Rectangle(0, 0, Game.renderer.width, Game.renderer.height)

		//document.addEventListener('mousewheel') // zoom effect
	}

	render(room: Object) {
		this.room = room

		this.view.position.copy(room.position) //.set(room.position.x, room.position.y)

		this.view.addChild(room)
		this.addInteractions()

		Game.world.addChild(this.view)
	}

	remove() {
		Game.world.removeChild(this.view)
	}

	addInteractions() {
		this.room.interactive = true

		this.view
			.on('pointerdown', this.onDragStart)
			.on('pointerup', this.onDragEnd)
			.on('pointerupoutside', this.onDragEnd)
			.on('pointermove', this.onDragMove)
	}

	onDragStart = (event) => {
   	const { room } = this

		console.log('onDragStart')

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
