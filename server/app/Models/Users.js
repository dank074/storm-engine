'use strict'

const Model = use('Model')

module.exports = class Users extends Model {

  static get tableName() {
    return 'users'
  }

}
