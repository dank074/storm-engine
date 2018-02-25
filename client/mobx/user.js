import { observable, action } from 'mobx'

import Game from '../Game'

export default new class UserStore {

  @observable info = null
  @observable avatar = null

  @action update(info) {
    this.info = Object.assign({}, this.info, info)
  }

  @action set(info) {
    this.info = info
    Game.user = info
  }

}
