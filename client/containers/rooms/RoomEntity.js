export default class RoomEntity extends PIXI.Graphics {

  _width = 64
  _height = 32

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

  _getPosition = ({ x, y, z }) => ({
    X: (y * 32) - (x * 32),
    Y: (y * 16) + (x * 16) - (z * 32)
  })

}
