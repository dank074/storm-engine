import moment from 'moment'
import DataTypes from 'sequelize'
import uuid from 'uuid'

export default (db) => {
  const Users = db.define('users', {
    username: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true
    },
    in_room: DataTypes.INTEGER,
    auth_ticket: DataTypes.STRING,
    account_created: DataTypes.INTEGER,
    last_online: DataTypes.INTEGER,
    motto: DataTypes.STRING,
    look: DataTypes.STRING,
    gender: DataTypes.ENUM('M', 'F'),
    vip: DataTypes.BOOLEAN,
    rank: DataTypes.INTEGER,
    rank_vip: DataTypes.INTEGER,
    credits: DataTypes.INTEGER,
    gotw_points: DataTypes.INTEGER,
    diamonds: DataTypes.INTEGER,
    duckets: DataTypes.INTEGER,
    online: DataTypes.BOOLEAN,
    ip_reg: DataTypes.STRING,
    ip_last: DataTypes.STRING,
    machine_id: DataTypes.STRING,
    home_room: DataTypes.INTEGER,
    block_newfriends: DataTypes.BOOLEAN,
    hide_online: DataTypes.BOOLEAN,
    hide_inroom: DataTypes.BOOLEAN,
    volume: DataTypes.STRING,
    last_change: DataTypes.INTEGER,
    focus_preference: DataTypes.BOOLEAN,
    chat_preference: DataTypes.BOOLEAN,
    pets_muted: DataTypes.BOOLEAN,
    bots_muted: DataTypes.BOOLEAN,
    advertising_report_blocked: DataTypes.BOOLEAN,
    ignore_invites: DataTypes.BOOLEAN,
    time_muted: DataTypes.DOUBLE,
    allow_gifts: DataTypes.BOOLEAN,
    trading_locked: DataTypes.DOUBLE,
    friend_bar_state: DataTypes.BOOLEAN,
    disable_forced_effects: DataTypes.BOOLEAN,
    allow_mimic: DataTypes.BOOLEAN
  }, {
    timestamps: false
  })

  Users.prefix = 'Users'

  Users.setOffline = function (id: Number) {
    return this.update({
      online: false,
      in_room: 0
    }, {
      where: { id }
    })
  }

  Users.setOnline = function (id: Number) {
    return this.update({
      online: true
    }, {
      where: { id }
    })
  }

  Users.findByAuthTicket = function (auth_ticket: String) {
    return this.findOne({ where: { auth_ticket } })
  }

  return Users
}
