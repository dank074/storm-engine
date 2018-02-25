import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'

import * as utils from '../../../utils'
import Game from '../../Game'

import { Image, Progress, Message, Container } from './styled'

@inject(stores => stores.loadingScreen)
@observer
export default class LoadingScreen extends Component {

  constructor() {
    super()

    this.randomPhoto = utils.getRandomInt(1, 30)
  }

  render() {
    const { active, progress } = this.props

    return active ? (
      <Container>
        <Image.Stack src={`//${Game.config.url}/images/loading/stack.png`}>
          <Image.Photo src={`//${Game.config.url}/images/loading/photos/${this.randomPhoto}.png`} />
          <Image.Frame src={`//${Game.config.url}/images/loading/frame.png`} />
        </Image.Stack>
        <Message>
          I like your t-shirt, uziboozy
        </Message>
        <Progress.Container>
          <Progress.Bar width={progress} />
        </Progress.Container>
        <Progress.Count>
          {progress}
        </Progress.Count>
      </Container>
    ) : null
  }

}
