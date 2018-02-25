import { AssetsLoader } from '../lib'
import * as utils from '../../utils'
import Game from '../Game'

export default class LoadingScreen {

  static resources = ['loading.stack', 'loading.frame']

  static view: Object
  static renderer: Object
  static width2: Number
  static height2: Number
  static ldBarSprite: Object
  static loadingText: Object
  static photo: String

  static init(callback: Function) {
    this.view = new PIXI.Container()
    this.callback = callback

    this.width2 = Game.renderer.width / 2
    this.height2 = Game.renderer.height / 2

    const randomPhoto = utils.getRandomInt(1, 30) // 1-30
    this.photo = `loading.photos.${randomPhoto}`
    this.resources.push(this.photo)

    new AssetsLoader(this.resources)
      .error(console.error)
      .complete(this.render.bind(this))

    // Initiate loading bar
    this.createLoadingText()
    this.createLoadingBar()
  }

  static createLoadingText() {
    // @TODO: Convert to BitmapText
    const textStyle = new PIXI.TextStyle({
      fill: 'white',
      fontFamily: 'Ubuntu Condensed',
      fontWeight: 'bold',
      fontSize: '30px',
      align: 'center',
      letterSpacing: 1
    })

    this.loadingText = new PIXI.Text('I like your t-shirt uziboozy.', textStyle)

    // Set anchor point to horizontal center
    this.loadingText.anchor.set(0.5)
    this.loadingText.position.set(this.width2, this.height2 + 250)

    this.view.addChild(this.loadingText)
  }

  static createLoadingBar() {
    // Loader container to hold all graphical elements
    const ldCtr = new PIXI.Container()

    const ldBarHeight = this.loadingText.position.y + 38
    const ldBarWidth = this.width2 - (409 / 2) // ldBarCtr width

    // Loader bar container with white border
    const ldBarCtr = new PIXI.Graphics()
    ldBarCtr.lineStyle(1, 0xFFFFFF)
    ldBarCtr.drawRoundedRect(0, 0, 409, 29, 1)
    ldBarCtr.position.set(ldBarWidth - 5, ldBarHeight - 6)
    ldCtr.addChild(ldBarCtr)

    // Black background for the loader bar
    const ldBarBg = new PIXI.Graphics()
    ldBarBg.beginFill(0x000000)
    ldBarBg.drawRect(0, 0, 404, 24)
    ldBarBg.endFill()
    ldBarBg.position.set(ldBarWidth - 3, ldBarHeight - 3)
    ldCtr.addChild(ldBarBg)

    // Loader bar itself
    const ldBar = new PIXI.Graphics()

    ldBar.beginFill(0xBACAD3)
    ldBar.drawRect(0, 0, 1, 8.5)
    ldBar.endFill()

    ldBar.beginFill(0x8CA1AD)
    ldBar.drawRect(0, ldBar.height, 1, 11.5)
    ldBar.endFill()

    // Create sprite from texture so the width can be adjusted
    this.ldBarSprite = new PIXI.Sprite(Game.renderer.generateTexture(ldBar))
    this.ldBarSprite.position.set(ldBarWidth - 1, ldBarHeight - 1)
    ldCtr.addChild(this.ldBarSprite)

    this.view.addChild(ldCtr)
  }

  static updateProgress(progress: Number) {
    this.ldBarSprite.width = progress.toFixed(2) * 4.02 // 402px
  }

  static render(resources) {
    const stackHeight = this.height2 - 25

    const stack = new PIXI.Sprite(resources['loading.stack'].texture)
    stack.anchor.set(0.5)
    stack.position.set(this.width2, stackHeight)
    this.view.addChild(stack)

    const photo = new PIXI.Sprite(resources[this.photo].texture)
    photo.anchor.set(0.5)
    photo.position.set(this.width2 + 6, stackHeight - 6)
    this.view.addChild(photo)

    const frame = new PIXI.Sprite(resources['loading.frame'].texture)
    frame.anchor.set(0.5)
    frame.position.set(this.width2, stackHeight)
    this.view.addChild(frame)

    // Finally add loading screen to world
    Game.world.addChild(this.view)

    this.callback()
  }

  static destroy() {
    Game.world.removeChild(this.view)
    this.view.destroy(true)
  }

}
