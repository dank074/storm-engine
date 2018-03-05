import React, { Component, Fragment } from 'react'

import Game from '../Game'

export default class Renderer extends Component {

  componentDidMount() {
    this.refs['game-container'].appendChild(Game.renderer.view)

    this.animate()
    window.addEventListener('resize', this.resize)
  }

  resize = () => {
    Game.renderer.view.style.width = '100vw'//`${window.innerWidth}px`
    Game.renderer.view.style.height = '100vh'//`${window.innerHeight}px`
  }

  animate = () => {
    Game.renderer.render(Game.world)

    window.requestAnimationFrame(this.animate)
  }

  render = () => (
    <Fragment>
      {this.props.children}
      <div ref="game-container" />
    </Fragment>
  )

}
