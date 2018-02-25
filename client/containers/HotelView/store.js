import { observable, action } from 'mobx'

export default new class HotelViewStore {

  @observable active = false

  @action render() {
    this.active = true
  }

  @action destroy() {
    this.active = false
  }

}
