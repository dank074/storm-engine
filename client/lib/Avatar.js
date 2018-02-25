import AssetsLoader from './AssetsLoader'
import Game from '../Game'

import { Room } from '../containers/rooms'

export default class Avatar extends PIXI.Sprite {

	target: Object
	isOwner: Boolean
	avatar: Object

	constructor({ target }) {
		super(Game.resources['avatars.ghost'].texture)

		//this.target = target
		//this.isOwner = user.id === target.id

		//this.view = new PIXI.Container()

		// Render ghost until avatar has been resolved
		//this.set(Game.resources['avatars/'])

		Game.storage.get(target.look).then(this.setTexture).catch(() => {
			new AssetsLoader({
				name: target.look,
				url: `imaging/${target.look}`
			}).complete(resources => {
				Game.storage.set(target.look, resources[target.look])
				this.setTexture(resources[target.look])
			})
		})
	}

	setTexture = (look) => {
		this.destroy(false)

		this.from(look.texture)
	}

	move(tile) {
		this.position.copy(tile.position)//set(tileSprite.width, tileSprite.height)
	}

}
