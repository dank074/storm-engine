import Game from '../../Game'

export default class Overlay {

	view: Object
	guiBar: Object

	static init() {
		this.view = new PIXI.Container()

		this.setup()
	}

	static setup() {
		const guiBar = this.guiBar = new PIXI.Graphics()
		//guiBar.alpha = 0.5

		guiBar.beginFill(0x41403D) //0x55534E
		guiBar.drawRect(0, 0, Game.renderer.width, 2)
		guiBar.endFill()

		guiBar.beginFill(0x333333) //0x3B3933 // 0x#333333
		guiBar.drawRect(0, guiBar.height, Game.renderer.width, 47)
		guiBar.endFill()

		guiBar.beginFill(0x41403D)
		guiBar.drawRect(0, guiBar.height, Game.renderer.width, 1)
		guiBar.endFill()

		guiBar.position.set(0, Game.renderer.height - guiBar.height)
		this.view.addChild(guiBar)

		Game.world.addChild(this.view)
	}

}
