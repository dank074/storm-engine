import { createInstance as LocalForage } from 'localforage'

export default class Storage extends LocalForage {

  _cache = {}

  async get(key) {
    if (this._cache[key]) return this._cache[key]

    const data = await this.getItem(key)
    this._cache[key] = data

    return data
  }

  async set(key, data) {
    this._cache[key] = data

    await this.setItem(key, data)

    return data
  }

  remove(key) {
    delete this._cache[key]

    return this.removeItem(key)
  }

  clear() {
    this._cache = {}

    return super.clear()
  }

  cacheLength() {
    return Object.keys(this._cache).length
  }



}
