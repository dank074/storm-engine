
export default (req, res, next) => {
	const { figure } = req.params

	const figurePath = path.join(
		__dirname,
		'..',
		'..',
		'assets',
		'images',
		'spritesheet',
		figure,
		'animations.png'
	)

	fs.stat(figurePath, (err, stat) => {
		if (err) {
			if (err.code !== 'ENOENT') {
				logger.error(err)
			}

			const directions = [1, 2, 3, 4, 5, 6, 7, 0]
			const actions = ['std', 'wlk']
			const walks = [0, 3, 2, 1]
			const avatars = []

			directions.forEach(direction => {
				actions.forEach(action => {
					if (action === 'wlk') {
						walks.forEach(walk => {
							const avatar = new Avatar(figure, direction, direction, action, 0, 0, walk)
							avatars.push(avatar.draw())
						})
					} else {
						const avatar = new Avatar(figure, direction, direction, action, 0, 0, 0)
						avatars.push(avatar.draw())
					}
				})
			})

			for (let i = 0; i <= 4; i++) {
				let direction = i * 2
				if (direction === 8) direction = 0

				const avatar = new Avatar(figure, direction, direction, 'sit', 0, 0, 0)
				avatars.push(avatar.draw())
			}

			const spritesheet = gd.createTrueColorSync(avatars.length * 64, 110)
			const transparent = spritesheet.colorAllocate(1, 2, 3)
			spritesheet.colorTransparent(transparent)

			spritesheet.filledRectangle(0, 0, avatars.length * 64, 110, transparent)

			let x = 0
			avatars.forEach(avatar => {
				avatar.copy(spritesheet, x, 0, 0, 0, 64, 110)
				avatar.destroy()
				x *= 64
			})

			spritesheet.savePng(figurePath, -1, (err) => {
				if (err) logger.error(err)

				spritesheet.destroy()

				res.sendFile(figurePath)
			})
		} else {
			res.sendFile(figurePath)
		}
	})
}
