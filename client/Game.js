import { Room } from './containers/rooms'
import { AssetsLoader } from './lib'

export default new class Game {

  setup({ storage, store, config, socket, world, renderer }) {
		this.storage = storage
		this.store = store
		this.config = config
		this.socket = socket
		this.world = world
		this.renderer = renderer
	}

	start() {
		const { socket, config, store: { loadingScreen, gui, hotelView } } = this
		// Render loading screen
		// Authenticate user while rendering loading screen
		socket.emit('users/login', config.authTicket, (user) => {
			this.store.user.set(user)
			// Preload assets before game is rendered
			new AssetsLoader()
				.preload()
				.progress(({ progress }) => {
					// Update progress on loading screen
					loadingScreen.updateProgress(progress)
				})
				.complete(resources => {
					this.resources = resources

					Room.init()
					// Wait until progress bar has transitioned
					setTimeout(async () => {
						gui.render()

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
