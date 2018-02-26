import RoomTileEntity from '../RoomTileEntity'

export default class RoomStairsNorthEast extends RoomTileEntity {

  draw() {
    this._start = this._getStart(this._pos)

    const points = []

    for (let i = 4; i > 0; i--) {
      points[i] = []

      const x = this._pos.x - this._divide(i) + 0.75
      const y = this._pos.y
      const z = (this._pos.z || 0) + this._divide(i)

      const start = this._getStart({ x, y, z })

      points[i].push({ x: start.X, y: start.Y })
      points[i].push({ x: start.X - this._width / 8, y: start.Y + this._height / 8 })
      points[i].push({ x: start.X + 24, y: start.Y + 20 })
      points[i].push({ x: start.X + this._width / 2, y: start.Y + this._height / 2 })

      this.beginFill(0x989865)
      this.lineStyle(1.5, 0x8E8E5E)
      this.moveTo(points[i][0].x, points[i][0].y)
      this.lineTo(points[i][1].x, points[i][1].y)
      this.lineTo(points[i][2].x, points[i][2].y)
      this.lineTo(points[i][3].x, points[i][3].y)

      this.endFill()

      this._drawThickness(...points[i])
    }

    this.hitArea = new PIXI.Polygon(
      points.flatten().map(({ x, y }) => {
        return new PIXI.Point(x, y)
      })
    )
  }

}
