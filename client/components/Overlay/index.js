import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'

@inject(store => ({
  user: store.user.info,
  active: store.gui.active
}))
@observer
export default class Overlay extends Component {

  render() {
    const { user, active, children } = this.props

    return active ? (
      <div>
        {children}
      </div>
    ) : null
  }

}
