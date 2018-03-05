import localForage from 'localforage'

export default class Storage {

  _cache = {}

  constructor(options) {
    this._entity = localForage.createInstance(options)
  }

  async get(key) {
    if (this._cache[key]) return this._cache[key]

    const data = await this._entity.getItem(key)
    this._cache[key] = data

    return data
  }

  async set(key, data) {
    this._cache[key] = data

    await this._entity.setItem(key, data)

    return data
  }

  remove(key) {
    delete this._cache[key]

    return this._entity.removeItem(key)
  }

  clear() {
    this._cache = {}

    return this._entity.clear()
  }

  cacheLength() {
    return Object.keys(this._cache).length
  }



}
