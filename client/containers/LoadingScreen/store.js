import { observable, action } from 'mobx'

export default new class LoadingScreenStore {

  @observable progress = 0
  @observable active = true

  @action updateProgress(amount) {
    this.progress = amount.toFixed(2)
  }

  @action render() {
    this.active = true
  }

  @action destroy() {
    this.active = false
  }

}
