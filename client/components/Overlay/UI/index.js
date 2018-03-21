import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'

import Game from '../../../Game'

import { Dashboard, Outline, Chat } from './styled'

@inject(store => ({
  user: store.user.info,
  avatar: store.user.avatar
}))
@observer
export default class UserInterface extends Component {

  render() {
    const { user } = this.props

    return (
      <Dashboard className="uk-navbar uk-navbar-container">
        <div className="uk-navbar-left">
          <ul className="uk-navbar-nav">
            <li><Outline src="https://i.imgur.com/HTsiH9x.png" /></li>
            <li><Outline src="https://i.imgur.com/mY5iHdf.png" /></li>
            <li><Outline src="https://i.imgur.com/fkNUIWs.png" /></li>
          </ul>
        </div>
        <div className="uk-navbar-center">
          <ul className="uk-navbar-nav">
            <li><Outline src="https://i.imgur.com/JqaScnN.png" /></li>
            <li><Outline src="https://www.habbo.com/habbo-imaging/avatarimage?hb=image&user=Pulx&headonly=1&direction=2&head_direction=2&action=&gesture=&size=m" /></li>
          </ul>
          <div className="uk-navbar-item">
            <Chat className="uk-input uk-form-width-large" placeholder="Click here to chat..." />
          </div>
          <ul className="uk-navbar-nav">
            <li><Outline src="http://habboemotion.com/resources/images/icons/star_3.gif" /></li>
            <li><Outline src="http://habboemotion.com/resources/images/icons/star_3.gif" /></li>
            <li><Outline src="https://i.imgur.com/0KZ6tLl.png" /></li>
          </ul>
        </div>
        <div className="uk-navbar-right">
          <ul className="uk-navbar-nav">
            <li><Outline src="https://i.imgur.com/cdB7Sia.png" /></li>
            <li><Outline src="http://habboemotion.com/resources/images/icons/star_3.gif" /></li>
          </ul>
        </div>
      </Dashboard>
    )
  }

}
