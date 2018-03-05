import Game from '../../Game'

export default class RoomFurni extends PIXI.Container {

  /**
  * @TODO:
  * Instead of having to require all images in the resources.json
  * automatically load them for us using our AssetsLoader class
  * so until images have been resolved show a ghost furni sprite
  */

  constructor(floor, { furni }) {
    super()

    this._floor = floor
    this._furni = furni
  }

  draw() {
    this._furni.sort().forEach(data => {
      const Furni = require(`../../furni/${data.name}`)
      const furni = new Furni(data)

      furni.render()

      this.addChild(furni)
    })

    this.position.set(Game.renderer.width / 2, Game.renderer.height / 2)
  }

}
