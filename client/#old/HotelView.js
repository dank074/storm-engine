import * as GUI from './gui'

import Game from '../Game'

export default class HotelView {

	renderer: Object
	resources: Object
	socket: Object
	world: Object
	view: Object
	backgroundGradient: Object
	backgroundGradientHeight: Number
	receptionLogo: Object
	background: Object
	backgroundLeft: Object

	static init() {
		const { resources, renderer } = Game

		this.view = new PIXI.Container()
		this.chat = new PIXI.Container()
		this.uiLeft = new PIXI.Container()
		this.uiRight = new PIXI.Container()

		const guiOverlayHeight = 50//GUI.Overlay.guiBar.height
		const gradientHeight = renderer.height - guiOverlayHeight

		/*const canvas = document.createElement('canvas')
		canvas.width = renderer.width
		canvas.height = renderer.height

		const ctx = canvas.getContext('2d')
		const gradient = ctx.createLinearGradient(0, 0, 0, renderer.height / 1.2)
		gradient.addColorStop(0, '#FF8C00')
		gradient.addColorStop(1, '#E53E00')
		ctx.fillStyle = gradient
		ctx.fillRect(0, 0, renderer.width, renderer.height)

		this.backgroundGradient = new PIXI.Sprite(PIXI.Texture.fromCanvas(canvas))
		//this.backgroundGradient.alpha = 0.5
		this.backgroundGradient.anchor.set(0.5)
		this.backgroundGradient.position.set(renderer.width / 2, renderer.height / 2)
		this.view.addChild(this.backgroundGradient)*/

		this.backgroundGradient = new PIXI.Sprite(resources['hotelview.gradient'].texture)
		this.backgroundGradient.width = renderer.width
		//this.backgroundGradient.alpha = 0.5
		this.backgroundGradient.anchor.set(0.5)
		this.backgroundGradient.position.set(renderer.width / 2, renderer.height / 2)
		this.view.addChild(this.backgroundGradient)

		this.receptionLogo = new PIXI.Sprite(resources['hotelview.reception_logo'].texture)
		this.receptionLogo.position.set(100, 0) // 0px from top and 50px from left
		this.view.addChild(this.receptionLogo)

		this.background = new PIXI.Sprite(resources['hotelview.background'].texture)
		this.background.anchor.set(1)
		this.background.position.set(renderer.width, gradientHeight)
		this.view.addChild(this.background)

		this.backgroundLeft = new PIXI.Sprite(resources['hotelview.background_left'].texture)
		this.backgroundLeft.anchor.set(0.0)
		this.backgroundLeft.position.set(0, gradientHeight - this.backgroundLeft.height)
		this.view.addChild(this.backgroundLeft)

		return this
	}

	static render() {
		Game.renderer.transparent = true
		Game.world.addChild(this.view)
	}

	static remove() {
		Game.renderer.transparent = false
		Game.world.removeChild(this.view)
	}

}
