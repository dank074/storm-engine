import RoomTileEntity from './RoomTileEntity'

export default class RoomTile extends RoomTileEntity {

  draw() {
    const { X, Y } = this._start = this._getPosition(this._pos)

    const points = []

    points.push({ x: X, y: Y })
    points.push({ x: X - (this._width / 2), y: Y + (this._height / 2) })
    points.push({ x: X, y: Y + this._height })
    points.push({ x: X + (this._width / 2), y: Y + (this._height / 2) })

    this.hitArea = new PIXI.Polygon(
      points.map(({ x, y }) => {
        return new PIXI.Point(x, y)
      })
    )

    this.beginFill(0x989865)
    this.lineStyle(1.5, 0x8E8E5E) //2, 0x8E8E5E
    this.moveTo(points[0].x, points[0].y)
    this.lineTo(points[1].x, points[1].y)
    this.lineTo(points[2].x, points[2].y)
    this.lineTo(points[3].x, points[3].y)

    this.endFill()

    this._drawThickness(...points)
  }

}
