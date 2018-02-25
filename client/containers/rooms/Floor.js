import _ from 'lodash'

import Game from '../../Game'

import RoomStairsLeft from './Stairs/Left'
import RoomStairsRight from './Stairs/Right'
import RoomTile from './RoomTile'

export default class RoomFloor extends PIXI.Container {

  constructor({ floorThick, floor }) {
    super()

    this._thickness = floorThick
    this._floor = floor.sort()

    this._tileOutline = new PIXI.Sprite(Game.resources['room.tile.outline'].texture)
    this._tileOutline.anchor.set(0.5)
    this._tileOutline.visible = false
  }

  validTile = (_tile) => this._floor.find(tile => _.isMatch(tile, _tile))

  _createTile(type, tile) {
    switch (type) {
      case 'ROOM_STAIRS_RIGHT':
        return new RoomStairsRight(this._thickness, tile)

      case 'ROOM_STAIRS_LEFT':
        return new RoomStairsLeft(this._thickness, tile)

      default:
        return new RoomTile(this._thickness, tile)
    }
  }

  _tileType(tile) {
    const zIndex = (tile[2] || 0) + 1

    if (this.validTile([tile[0] - 1, tile[1], zIndex])) {
      return 'ROOM_STAIRS_RIGHT'
    }

    if (this.validTile([tile[0], tile[1] - 1, zIndex])) {
      return 'ROOM_STAIRS_LEFT'
    }

    return 'ROOM_TILE'
  }

  draw() {
    this._floor.forEach(tile => {
      if (!this.validTile(tile)) throw new Error(`A tile already exists at: ${tile}`)

      const tileType = this._tileType(tile)
      const roomTile = this._createTile(tileType, tile)
      roomTile._type = tileType

      this.addChild(roomTile)

      roomTile.mouseover = (e) => {
        console.log(roomTile)
        this._tileOutline.visible = true
        this._tileOutline.position.set(roomTile._start.X, roomTile._start.Y + 13.5) // 8 pixels above
      }

      roomTile.mouseout = (e) => {

        //this._tileOutline.visible = false
      }

      roomTile.click = (e) => {
        roomTile.visible = !roomTile.visible
        //Game.store.user.avatar.move(roomTile)
        //console.info(roomTile.pos)
      }
    })

    this.position.set(Game.renderer.width / 2, Game.renderer.height / 2)

    this.addChild(this._tileOutline)
  }

}
