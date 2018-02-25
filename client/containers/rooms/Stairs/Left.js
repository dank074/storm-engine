import RoomTileEntity from '../RoomTileEntity'

export default class RoomStairsLeft extends RoomTileEntity {

  interactive = true

  draw() {
    this._start = this._getStart(this._pos)

    for (let i = 4; i > 0; i--) {
      const x = this._pos.x
      const y = this._pos.y - this._divide(i) + 0.75
      const z = (this._pos.z || 0) + this._divide(i)

      const start = this._getStart({ x, y, z })

      const first = { x: start.X, y: start.Y }
      const second = { x: start.X - this._width / 2, y: start.Y + this._height / 2 }
      const third = { x: start.X - 24, y: start.Y + 20 }
      const fourth = { x: start.X + this._width / 8, y: start.Y + this._height / 8 }

      this.beginFill(0x989865)
      this.lineStyle(1.5, 0x8E8E5E)
      this.moveTo(first.x, first.y)
      this.lineTo(second.x, second.y)
      this.lineTo(third.x, third.y)
      this.lineTo(fourth.x, fourth.y)
      this.lineTo(first.x, first.y)

      this.endFill()

      this._drawThickness(first, second, third, fourth)
    }
  }

  click = () => console.log(this.pos)

}
