import React, { Component, Fragment } from 'react'
import { observer, inject } from 'mobx-react'

import { HotelView } from '../../containers'

import UserInterface from './UI'

@inject(store => ({
  user: store.user.info,
  active: store.gui.active
}))
@observer
export default class Overlay extends Component {

  render() {
    const { user, active, children } = this.props

    return active ? (
      <Fragment>
        <HotelView />
        <UserInterface />
      </Fragment>
    ) : null
  }

}
