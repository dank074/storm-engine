import DataTypes from 'sequelize'
import CryptoJS from 'crypto-js'
import moment from 'moment'

export default (db, config) => {
  const Rooms = db.define('rooms', {
    roomType: {
      type: DataTypes.ENUM('public', 'private'),
      defaultValue: 'public'
    },
    caption: {
      type: DataTypes.STRING,
      allowNull: false
    },
    owner: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    description: DataTypes.STRING,
    category: DataTypes.INTEGER,
    state: {
      type: DataTypes.ENUM('open', 'locked', 'password', 'invisible'),
      defaultValue: 'open'
    },
    usersNow: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    usersMax: {
      type: DataTypes.INTEGER,
      defaultValue: 25
    },
    tags: {
      type: DataTypes.STRING,
      get: function () {
        return JSON.parse(this.getDataValue('tags'))
      },
      set: function (tags: Array) {
        return this.setDataValue('tags', JSON.stringify(tags))
      }
    },
    password: {
      type: DataTypes.STRING,
      set: function (password: String) {
        const cipherText = CryptoJS.AES.encrypt(password, config.secret)

        return this.setDataValue('password', cipherText.toString())
      }
    },
    wallpaper: DataTypes.STRING,
    floor: {
      type: DataTypes.STRING,
      allowNull: false,
      get: function () {
        return JSON.parse(this.getDataValue('floor'))
      },
      set: function (tiles: Array) {
        return this.setDataValue('floor', JSON.stringify(tiles))
      }
    },
    landscape: DataTypes.STRING,
    allowPets: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    allowPetsEat: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    roomBlockingDisabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    allowHidewall: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    floorThick:{
      type: DataTypes.INTEGER,
      defaultValue: 10
    },
    wallThick:{
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    created: {
      type: DataTypes.INTEGER,
      defaultValue: moment().unix()
    }
  }, {
    timestamps: false
  })

  Rooms.prefix = 'Rooms'

  Rooms.prototype.verifyPassword = function (password: String) {
    const bytes = CryptoJS.AES.decrypt(this.password, config.secret)
    const roomPassword = bytes.toString(CryptoJS.enc.Utf8)

    return password === roomPassword
  }

  Rooms.decrementUsersNow = async function (id: Number) {
    const room = await this.findOne({
      where: { id }
    })

    return room.decrement('usersNow')
  }

  return Rooms
}
