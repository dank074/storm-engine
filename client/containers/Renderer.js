import React, { Component, Fragment } from 'react'
import Helmet from 'react-helmet'

import Game from '../Game'

import { Overlay } from '../components'
import { LoadingScreen, HotelView, Renderer } from './'

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
      <Helmet>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Ubuntu+Condensed" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/uikit/3.0.0-beta.40/css/uikit.css" />
      </Helmet>
      <LoadingScreen />
      <Overlay />
      <div ref="game-container" />
    </Fragment>
  )

}
