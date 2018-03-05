'use strict'

const Model = use('Model')

module.exports = class Rooms extends Model {

  static get tableName() {
    return 'rooms'
  }

}
