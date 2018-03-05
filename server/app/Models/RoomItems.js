'use strict'

const Model = use('Model')

module.exports = class RoomItems extends Model {

  static get tableName() {
    return 'room_items'
  }

  furni() {
    return this.hasMany('App/Models/Furni', 'itemId')
  }

}
