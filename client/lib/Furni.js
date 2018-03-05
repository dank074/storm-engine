import Game from '../Game'
import AssetsLoader from './AssetsLoader'
import { RoomEntity } from '../containers/rooms'

export default class Furni extends PIXI.Container {

  constructor(data) {
    super()

    this._data = data
    //this._data.direction = 'NE'

    // Since you can't extend multiple classes ...
    this._entity = new RoomEntity()
  }

  setDirection(dir) {
    this._data.direction = dir
    this.render()
  }

  setOpacity = (n = 0.5) => this.alpha = n
  //setOpacity = (n = 0.5) => this.children.forEach(furniPart => furniPart.alpha = n)

  renderTexture = (resources) => {
    this.source[this._data.direction]
      .flatten()
      .sort((a, b) => a.zIndex - b.zIndex)
      .map(({ source, x, y, flip, zIndex, opacity }, i) => {
        const furniPart = new PIXI.Sprite(resources[this.getAssetName(source)].texture)
        furniPart.zOrder = zIndex || i

        const start = this._entity._getPosition(this._data)

        if (opacity) furniPart.alpha = opacity

        if (flip) {
          if (flip.hasOwnProperty('x')) {
            furniPart.scale.x = flip.x
            start.X += this._entity._width
          }

          if (flip.hasOwnProperty('y')) {
            furniPart.scale.y = flip.y
            start.Y += this._entity._height
          }
        }

        furniPart.position.set(
          (start.X + x) - (this._entity._width / 2),// - furniPart.height,// - (this._entity._width / 2),
          (start.Y - y) + (this._entity._height / 2)// + furniPart.width// + (this._entity._height / 2)
        )

        console.log(furniPart.position)

        this.addChild(furniPart)
      })
  }

  getAssetName(source) {
    return `furni.${this._data.name}.images.${source}`
  }

  render() {
    const assets = this.assets.map(source => ({
      name: this.getAssetName(source),
      url: `images/furni/${this._data.name}/${source}.png`
    }))

    new AssetsLoader(assets)
      .error(console.error)
      .complete(this.renderTexture)
  }

  /*mapSources(cb) {
    return Object.keys(this.source).map(source => {
      return this.source[source].map(cb)//cb(this.source[source].flatten())
    })
  }

  resolveParts() {
    return this.mapSources(({ source }, i) => {
      return new Promise((resolve, reject) => {
        const name = this.getStorageName(source)
        const url = `images/furni/${this._data.name}/${source}.png`

        new AssetsLoader({ name, url }).error(reject).complete(resources => {
          //Game.storage.set(name, resources[name].texture)
          resolve(resources[name])
        })
      })
    })
  }

  render() {
    const cachedParts = this.mapSources(({ source }, i) => {
      return Game.storage.get(this.getStorageName(source))
    })

    // render ghost box here
    Promise.all(cachedParts).then(this.renderTexture).catch(() => {
      // or here ?
      Promise.all(this.resolveParts()).then(this.renderTexture)
    })
  }*/

}
