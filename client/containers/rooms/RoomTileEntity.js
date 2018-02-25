export default class RoomTileEntity extends PIXI.Graphics {

  cacheBitMap = true

  _width = 64
  _height = 32

  constructor(thickness, tile) {
    super()

    this._thickness = thickness
    this._pos = {
      x: tile[0],
      y: tile[1],
      z: tile[2] || 0 //default floor height is 0
    }

    this.draw()
  }

  _divide(i) {
    switch (i) {
      case 1:
        return 0
      case 2:
        return 0.25
      case 3:
        return 0.50
      case 4:
        return 0.75
      default:
        return i
    }
  }

  _getStart = ({ x, y, z }) => ({
    X: (y * 32) - (x * 32),
    Y: (y * 16) + (x * 16) - (z * 32)
  })

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