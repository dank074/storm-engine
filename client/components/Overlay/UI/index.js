import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'

import Game from '../../../Game'

import { Dashboard } from './styled'

@inject(store => ({
  user: store.user.info,
  avatar: store.user.avatar
}))
@observer
export default class UserInterface extends Component {

  render() {
    const { user } = this.props

    return (
      <Dashboard>

      </Dashboard>
    )
  }

}
