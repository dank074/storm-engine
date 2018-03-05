import RoomEntity from './RoomEntity'

export default class RoomTileEntity extends RoomEntity {

  interactive = true

  constructor(thickness, tile) {
    super()

    this._thickness = thickness
    this._pos = {
      x: tile[0],
      y: tile[1],
      z: tile[2] || 0 //default floor height is 0
    }

    this.draw()
    this.cacheBitMap = true
  }

  _drawThickness(first, second, third, fourth) {
    if (this._thickness > 0) {
      this.beginFill(0x838357)
      this.lineStyle(1, 0x7A7A51)
      this.moveTo(second.x - 0.5, second.y)
      this.lineTo(second.x - 0.5, second.y + this._thickness)
      this.lineTo(third.x - 0.5, third.y + this._thickness)
      this.lineTo(third.x - 0.5, third.y)
      this.endFill()

      this.beginFill(0x6F6F49)
      this.lineStyle(1, 0x676744)
      this.moveTo(fourth.x + 0.5, fourth.y)
      this.lineTo(fourth.x + 0.5, fourth.y + this._thickness)
      this.lineTo(third.x + 0.5, third.y + this._thickness)
      this.lineTo(third.x + 0.5, third.y)
      this.endFill()
    }
  }

}
