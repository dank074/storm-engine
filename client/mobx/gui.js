import { observable, action } from 'mobx'

export default new class GuiStore {

  @observable active = false

  @action render() {
    this.active = true
  }

  @action destroy() {
    this.active = false
  }

}
