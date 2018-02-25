import fs from 'fs'
import path from 'path'
import gd from 'node-gd'

import * as utils from '../../utils'
import logger from './logger'

const AVATAR_TYPE_NORMAL = 'figure'
const AVATAR_TYPE_HEAD = 'head'
const AVATAR_TYPE_PART = 'part'

function iimageflip(image: Object, x: Number = 0, y: Number = 0, width: Number = 0, height: Number = 0) {
	if (width < 1) width = image.width
	if (height < 1) height = image.height

	const tmp = gd.createTrueColorSync(width, height)
	tmp.alphaBlending(0)
	tmp.saveAlpha(1)

	//const x2 = x + width - 1

	for (x = 0; x < width; x++) {
		tmp.copy(image, x, 0, width - x - 1, 0, 1, height)
	}

	return tmp.destroy()
}

class Avatar {

	figure: String
	dir: Number
	headDir: Number
	action: Array
	drink: Number
	sig: Number
	frame: Number
	renderType: String
	isRendered: Boolean = false
	rendered: Array = []
	newDrawOrder: Array
	width: Number = 64
	height: Number = 110
	offset: Array = [-32, 45]
	partData: Object = {}
	partDataIds: Object = {}
	figureParts: Object = {}
	renderType: String = AVATAR_TYPE_NORMAL
	useHrbFor: Array = ['hh_human_hats.26', 'acc_head_U_ears_muffs', 'hat_U_shade']
	avatarPath: Array = [__dirname, '..', '..', 'assets', 'images', 'gameplay', 'avatar']

	avatar: Object
	drawOrder: Object
	palette: Object
	partSets: Object

	constructor(figure: String, dir: Number = 3, headDir: Number = 3, action: String = 'std', drink: Number = 0, sig: Number = 0, frame: Number = 0, renderType: String = AVATAR_TYPE_NORMAL) {
		if (dir < 0 || dir > 7) {
			dir = 3
		}

		if (headDir < 0 || headDir > 7) {
			dir = 3
		}

		this.figure = figure
		this.dir = dir
		this.headDir = headDir
		this.action = action
		this.drink = drink
		this.sig = sig
		this.frame = frame
		this.renderType = renderType

		this.sets = require('../../assets/avatar')
		this.drawOrder = require('../../assets/drawOrder')
		this.palette = require('../../assets/palette')
		this.partSets = require('../../assets/partSets')
		this.manifest = require('../../assets/manifest')

		if (action === 'respect' || action === 'sig' && action !== 'wav') {
			this.action = 'wav'
		} else if (action === 'lay') {
			this.width = 110
			this.height = 64
			this.offset = [-10, 20]
			this.newDrawOrder = ['li', 'lh', 'ls', 'lc', 'bd', 'lg', 'ch', 'ca', 'cc', 'cp', 'wa', 'rh', 'rs', 'rc', 'hd', 'fc', 'ey', 'hr', 'hrb', 'fa', 'ea', 'ha', 'he', 'ri', 'sh']
		} else if (renderType === AVATAR_TYPE_HEAD) {
			this.width = 64
			this.height = 64
			this.offset = [-31, 65]
			this.newDrawOrder = ['lg', 'ch', 'ca', 'cc', 'cp', 'wa', 'hd', 'fc', 'ey', 'hr', 'hrb', 'fa', 'ea', 'ha', 'he', 'ri']
		} else if (renderType === AVATAR_TYPE_PART) {
			this.width = 64
			this.height = 64
		}

		this.parseFigure()

		if (drink > 0) {
			this.figureParts['ri'] = [drink, null, null]
		}

		if (this.action === 'sig') {
			this.width = 76
			this.height = 122
			this.offset = [-31, 51]
			this.figureParts['li'] = [sig, null, null]
		}

		const img = gd.createTrueColorSync(this.width, this.height)
		const color = img.colorAllocate(1, 2, 3)
		img.colorTransparent(color)

		this.avatar = img.filledRectangle(0, 0, this.width, this.height, color)
	}

	parseFigure() {
		const parts = this.figure.split('.')

		parts.forEach(part => {
			const data = part.split('-')

			this.figureParts[data[0]] = [data[1], data[2], data[3]]
		})
	}

	draw() {
		if (!this.isRendered) {
			this.render()
		}

		if (this.renderType === AVATAR_TYPE_PART && !this.debugMode) {
			const img = gd.createTrueColorSync(this.width, this.height)
			const transparent = img.colorAllocate(1, 2, 3)
			img.colorTransparent(transparent)

			img.filledRectangle(0, 0, this.width, this.height, transparent)
			img.copy(this.avatar, 0, 0, 0, 0, this.avatar.width, this.avatar.height)

			return img
		}

		return this.avatar
	}

	render() {
		const figurePartKeys = Object.keys(this.figureParts)

		if (utils.isArray(figurePartKeys)) {
			figurePartKeys.forEach(part => {
				if (this.figureParts[part]) {
					this.renderPartData(part)
				}
			})
		}

		if (utils.isArray(figurePartKeys)) {
			figurePartKeys.forEach(part => {
				if (this.figureParts[part] && this.partSets['activePart'][this.renderType === 'part' ? 'figure' : this.renderType]) {
					this.renderPart(part)
				}
			})
		}

		let dir = this.dir - 1
		if (dir === -1) {
			dir = 6
		} else if (dir > 3 || dir <= 0) {
			dir = this.getFlipDirection(dir)
		}

		const drawOrder = !this.newDrawOrder
			? this.drawOrder['std'][this.dir]
			: this.newDrawOrder

		const rendered = []
		let lowestY = 0
		let lowestX = 0
		let highestY = 0
		let highestX = 0

		drawOrder.forEach(part => {
			if (this.parts[part] && this.renderType === AVATAR_TYPE_PART) {
				drawOrder[part].forEach((image, key) => {
					const partKey = this.parts[part][key]

					if (lowestX <= image[1] || lowestX === 0) {
						lowestX = image[1]
					}
					if (lowestY <= image[2] || lowestY === 0) {
						lowestY = image[2]
					}

					partKey[1] = partKey[1] - lowestX
					partKey[2] = partKey[2] - lowestY


					if (partKey[1] < 0 && Math.abs(partKey[1]) > highestX) {
						highestX = Math.abs(partKey[1])
					}
					if (partKey[2] < 0 && Math.abs(partKey[2]) > highestY) {
						highestY = Math.abs(partKey[2])
					}

					partKey[1] = partKey[1] + highestX
					partKey[2] = partKey[2] + highestY

					if (partKey[1] + partKey[3] > this.width || this.width === 64) {
						this.width = partKey[1] + partKey[3]
					}
					if(partKey[2] + partKey[4] > this.height || this.height === 64) {
						this.height = partKey[2] + partKey[4]
					}


					if (this.rendered[image[5] + '' + image[6]] && (image[5] === 'lg' || image[5] === 'hr' || image[5] === 'hrb')) return
					this.rendered.push(image[5] + '' + image[6])
					this.avatar.copy(image[0], image[1], image[2], 0, 0, image[3], image[4])
				})
			}
		})

		this.isRendered = true
	}

	renderPart(partName: String) {
		const partData = this.figureParts[partName]
		const parts = this.getParts(partName, partData[0])

		if (partName === 'ri') {
			parts.push({
				type: 'ri',
				id: this.drink,
				colorable: false
			})
		} else if (partName === 'li') {
			parts.push({
				type: 'li',
				id: this.sig,
				colorable: false
			})
		}

		if (!parts) return

		parts.forEach(part => {
			let library = this.getLibrary(part.type, partData[0])

			if (!library && part.type !== 'ls' && part.type !== 'rs') {
				return
			} else if (!library && part.type === 'ls') {
				library = 'hh_human_shirt'
			} else if (!library && part.type === 'rs') {
				library = 'hh_human_shirt'
			}

			const actions = this.actions[part]
			const action = actions[this.action]
				? actions[this.action]
				: actions[0]

			let direction = this.getDirection(part.type)
			if (direction > -1 && direction < 8) {
				//let newType = part.type
				let doFlip = true

				const frame = this.getFrameForPart(part.type, action)
				const flipDirection = this.getFlipDirection(direction)

				const imageFileOne = this.getImagePart(library, action, part.type, part.id, direction, frame)
				//const imageFileTwo = this.getImagePart(library, action, this.partSets.partFlips[part.type], part.id, flipDirection, frame)
				const imageFileTwo = this.getImagePart(library, action, part.type, part.id, flipDirection, frame)

				if (fs.existsSync(imageFileOne)) {
					doFlip = false
				} else if (!fs.existsSync(imageFileTwo)) {
					part.type = this.partSets.partFlips[part.type]
				}

				if (flipDirection === 0 || flipDirection > 5 && part.type === 'ey' || part.type === 'fc') {
					return
				}

				if (part.type.length === 3 && !this.renderedParts[part.type]) {
					this.renderedParts.push(part.type)

					this.renderPartType(partName, part, doFlip, flipDir, partData, flipDir, action, part.type)
				}
			}
		})
	}

	imagerecolor(image: Object, red: Number, green: Number, blue: Number) {
		for (let x = 0; x < image.width; x++) {
			for (let y = 0; y < image.height; x++) {
				// @TODO: Find equivalent node-gd fn of PHP imagecolorsforindex
				/*
					$rgb = imagecolorsforindex($image, imagecolorat($image, $x, $y));
					$r = $rgb['red'];
					$g = $rgb['green'];
					$b = $rgb['blue'];
					$a = $rgb['alpha'];

					$r = (($red / 255) * $r);
					$g = (($green / 255) * $g);
					$b = (($blue / 255) * $b);
				*/

				image.setPixel(x, y, image.colorAllocate(red, green, blue))
			}
		}
	}

	renderPartType(partName: String, part: Object, doFlip: Boolean, flipDir: Number, partData: Array, dir: Number, action: Number) {
		let library = this.getLibrary(part.type, partData[0])

		if (!library && part.type !== 'ls' && part.type !== 'rs') {
			return false
		} else if (!library && part.type === 'ls' || part.type === 'rs') {
			library = 'hh_human_shirt'
		}

		part.type = this.hasHat(part.type)

		const manifest = this.getManifest(library)

		if (part.colorable) {
			const palette = this.getPalette(partName)
			const color = this.getColor(palette, partData[1])
			const rgb = [this.hexToRGB(color)]

			if (partData[2]) {
				const colorTwo = this.getColor(palette, partData[2])
				rgb.push(this.hexToRGB(color))
			}
		}

		const count = rgb.length > 1 ? 3 : 1
		for (let i = 0; i < count; i++) {
			const framePart = this.getFrameForPart(part.type, action)
			const partFile = [
				'h',
				action,
				part.type,
				(part.id + i),
				dir,
				framePart
			].join('_')
			const imageFile = this.getImagePart(library, action, part.type, (part.id + i), dir, framePart)

			if (!fs.existsSync(imageFile)) continue;

			const partImage = gd.createFromPng(imageFile)
			let offsetX
			let pImagePosXas = 0
			let pImagePosYas = 0

			if (doFlip) {
				iimageflip(partImage)
				offsetX = (this.width - partImage.width) + 3
			} else if (!doFlip && dir > 3 && dir < 7) {
				pImagePosXas = -1
			}

			if (offsetX) {
				pImagePosXas = offsetX - ((this.width / 2) - Number(manifest[partFile])) + this.offset[0]
			} else {
				pImagePosXas += ((this.width / 2) - Number(manifest[partFile])) + this.offset[0]
			}

			pImagePosYas += ((this.height / 2) - Number(manifest[partFile])) + this.offset[1]

			if (part.colorable && part.type !== 'ey') {
				const ib = i < 2 ? i : i - 1
				this.imagerecolor(partImage, rgb[ib].r, rgb[ib].g, rgb[ib].b)
			}

			this.parts[part.type] = [partImage, pImagePosXas, pImagePosYas, image.width, image.height, part.type, i]
			//this.getImagePart(library, action, part.type, part.id, direction, frame)
		}
	}

	hexToRGB(color: String, separate: Boolean = true) {
		const bigInt = parseInt(color, 16)
		const r = (bigInt >> 16) & 255
		const g = (bigInt >> 8) & 255
		const b = bigInt & 255

		// uglier but faster: r + ',' + g + ',' + b
		return separate ? { r, g, b } : [r, g, b].join(',')
	}

	getManifest(library: String): Object {
		if (!this.manifest[library]) {
			const manifestXMLPath = path.join(
				...this.avatarPath,
				`${library}_manifest.dat`
			)
			const manifestPath = path.join(
				__dirname,
				'..',
				'..',
				'assets',
				'manifest.json'
			)

			const manifest = fs.readFileSync(manifestXMLPath, {encoding: 'utf8'})
			const parsed = require('xml-js').xml2json(manifest, {compact: true})

			this.manifest[library] = {}
			parsed.manifest.assets.asset.forEach(asset => {
				const { name } = asset._attributes
				const offset = asset.param._attributes.value

				this.manifest[library][name] = offset
			})

			fs.writeFileSync(manifestPath, JSON.stringify(this.manifest))
		}

		return this.manifest[library]
	}

	hasHat(partType: String): String {
		if (partType === 'hr') {
			Object.keys(this.partData).forEach(part => {
				const libraryName = this.partData[part]

				if (this.useHrbFor[libraryName]) {
					partType = 'hrb'
				} else if (this.useHrbFor[`${libraryName}.${this.partDataIds[part]}`]) {
					partType = 'hrb'
				} else {
					partType = this.partData['ha'] && !this.useHrbFor[libraryName] ? 'hr' : 'hrb'				}
			})
		}

		return partType
	}

	getFlipDirection(dir: Number): Number  {
		switch (dir) {
			case 0: return 6
			case 1: return 5
			case 2: return 4
			case 3: return 3
			case 4: return 2
			case 5: return 1
			case 6: return 0
			case 7: return 7
			default: return 3
		}
	}

	getParts(partType: String, id: Number): Array {
		const po = this.getSetsPart(partType, id)

		return po.parts.map(i => ({
			id: i.id ? i.id : i,
			type: i.type ? i.type : partType,
			colorable: i.colorable ? i.colorable : true
		}))

		/*return Object.keys(po).map(id => ({
			id,
			type: po[id].type ? po[id].type : part,
			colorable: po[id].colorable ? po[id].colorable : true
		}))*/
	}

	getSetsPart(partType: String, id: Number) {
		console.log(partType, id)
		const sets = this.sets[partType].sets

		let part
		Object.keys(sets).forEach(sex => {
			if (sets[sex][id]) {
				part = sets[sex][id]
			}
		})

		return part
	}

	getLibrary(partType: String, id: Number): String {
		return this.getSetsPart(partType, id).library
	}

	renderPartData(partName: String) {
		const partData = this.figureParts[partName]
		const parts = this.getParts(partName, partData[0])

		if (partName === 'ri') {
			parts.push({
				type: 'ri',
				id: this.drink,
				colorable: false
			})
		} else if (partName === 'li') {
			parts.push({
				type: 'li',
				id: this.sig,
				colorable: false
			})
		}

		if (!parts) return null

		parts.forEach(part => {
			const partDir = this.getDirection(part.type)

			if (partDir === 0 || partDir > 5) {
				if (part.type === 'ey' || part.type === 'fc') return
			}

			this.partData[part.type] = this.getLibrary(part.type, partData[0])
			this.partDataIds[part.type] = part.id
		})
	}

	getImagePart(library: String, action: String, partType: String, partId: Number, dir: Number, frame: Number = 0): String {
		const image = [
			library,
			'h',
			action,
			partType,
			partId,
			dir,
			frame
		].join('_')

		return path.join(
			...this.avatarPath,
			partType,
			library,
			`${image}.png`
		)
	}

	getFrameForPart(part: String, action: String = 'std'): Number {
		try {
			const frames = this.animations[action][part]

			return !!frames[this.frame]
				? this.frame
				: Math.ceil(this.frame / 2) - 1
		} catch(e) {
			return 0
		}
	}

	getPalette(part: String): Number {
		return Number(this.avatar[part].palette)
	}

	getColor(palette: Number, id: Number): String {
		return this.palette[palette][id]
	}

	getDirection(type: String): Number {
		switch (type) {
			case 'ea':
			case 'ey':
			case 'fa':
			case 'fc':
			case 'hr':
			case 'hrb':
			case 'he':
			case 'ha':
			case 'hd':
				return this.headDir

			default:
				return this.dir
		}
	}
}

export default (req, res, next) => {
	const { figure } = req.params

	const figurePath = path.join(
		__dirname,
		'..',
		'..',
		'assets',
		'images',
		'spritesheet',
		`${figure}.png`
	)

	fs.stat(figurePath, (err, stat) => {
		if (err) {
			if (err.code !== 'ENOENT') {
				logger.error(err)
			}

			const directions = [1, 2, 3, 4, 5, 6, 7, 0]
			const actions = ['std', 'wlk', 'lay']
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
				spritesheet.copy(avatar, x, 0, 0, 0, 64, 110)
				avatar.destroy()
				x *= 64
			})

			spritesheet.savePng(figurePath, 0, (err) => {
				if (err) logger.error(err)

				spritesheet.destroy()

				res.sendFile(figurePath)
			})
		} else {
			res.sendFile(figurePath)
		}
	})
}