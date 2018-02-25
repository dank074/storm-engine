import DataTypes from 'sequelize'
import moment from 'moment'

export default (db) => {
	const UserRoomVisits = db.define('user_roomvisits', {
		user_id: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		room_id: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		entry_timestamp: {
			type: DataTypes.INTEGER,
			defaultValue: moment().unix()
		},
		exit_timestamp: DataTypes.INTEGER,
	}, {
		timestamps: false
	})

	UserRoomVisits.prefix = 'UserRoomVisits'

	return UserRoomVisits
}
