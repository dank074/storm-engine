import Mousetrap from 'mousetrap'

import { Room } from './containers/rooms'
import { AssetsLoader } from './lib'

export default new class Game {

  resources = {}
  removedActions = []
  storedActions = []

  setup({ storage, store, config, socket, world, renderer }) {
		this.storage = storage
		this.store = store
		this.config = config
		this.socket = socket
		this.world = world
		this.renderer = renderer
	}

  _addInteractions() {
    Mousetrap.bind('shift+z', this.undoLastAction)
    Mousetrap.bind('shift+y', this.redoLastAction)
  }

  undoLastAction = (e) => {
    const action = this.storedActions.pop()

    if (action) {
      action.undo(e)
      this.removedActions.push(action)
    }

    return false
  }

  redoLastAction = (e) => {
    const action = this.removedActions.pop()

    if (action) {
      action.redo(e)
      this.storedActions.push(action)
    }

    return false
  }

	start() {
		const { socket, config, store: { loadingScreen, gui, hotelView } } = this
		// Render loading screen
		// Authenticate user while rendering loading screen
		socket.emit('users/login', config.authTicket, (user) => {
      console.warn(user)
			this.store.user.set(user)
			// Preload assets before game is rendered
			new AssetsLoader()
				.preload()
				.progress(({ progress }) => {
					// Update progress on loading screen
					loadingScreen.updateProgress(progress)
				})
				.complete(resources => {
					Room.init()
          
					// Wait until progress bar has transitioned
					setTimeout(async () => {
						gui.render()

            this._addInteractions()

						if (config.room || user.home_room) {
							await Room.join(config.room || user.home_room)
						} else {
							hotelView.render()
						}

						loadingScreen.destroy()
					}, 1500)
				})
		})
	}

}
