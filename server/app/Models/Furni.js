'use strict'

const Model = use('Model')

module.exports = class Furni extends Model {

  static get tableName() {
    return 'furniture'
  }

  items() {
    return this.belongsTo('App/Models/RoomItems')
  }

}
