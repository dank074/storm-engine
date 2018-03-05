import _ from 'lodash'

import * as utils from '../../utils'

import Game from '../Game'

export default class AssetsHandler {

  assets: Array
  loader: Object
  finished: Boolean = true

  constructor(images) {
    if (images) {
      this.setupLoader(utils.isArray(images) ? images : [images])
    }
  }

  preload() {
    this.setupLoader(require('../../assets/resources'))

    return this
  }

  setupLoader(assets) {
    if (!this.finished) {
      throw new TypeError('Last loading not finished')
    }

    this.loader = new PIXI.loaders.Loader()
    this.finished = false

    if (utils.isArray(assets)) {
      return assets.forEach(this.loaderAdd)
    }

    utils.flatten(assets).forEach(this.loaderAdd)
  }

  loaderAdd = (resource: Array) => {
    console.log(resource)
    if (utils.isObject(resource)) {
      // No reason to validate if its being run in production
      if (Game.config.dev) {
        resource = utils.validate(resource, {
          name: {
            type: 'string',
            required: true
          },
          url: {
            type: 'string',
            required: true
          }
        })
      }

      this.loader.add(resource.name, this.parsePath(null, resource.url))
    } else {
      this.loader.add(resource, this.parsePath(resource))
    }
  }

  error(callback: Function) {
    this.loader.once('error', (err) => {
      this.finished = true

      callback(err)
    })

    return this
  }

  progress(callback: Function) {
    this.loader.on('progress', callback)

    return this
  }

  complete(callback: Function) {
    this.loader.load((loader, resources) => {
      this.finished = true

      Game.resources = _.merge({}, Game.resources, resources)

      callback(resources, loader)
    })

    return this
  }

  parsePath(src: String, url: String, ext: String = '.png') {
    const gamePath = `${Game.config.assetsUrl}/`
    let fullPath = gamePath + (url ? url : 'images/')

    if (!url) {
      const path = src.split('.').join('/')

      fullPath += path + ext
    }

    return fullPath
  }

}
