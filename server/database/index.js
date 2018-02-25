import Sequelize from 'sequelize'

import { logger } from '../lib'

export default (database) => {
	const sequelize = new Sequelize(
	  database.name,
	  database.username,
	  database.password,
	  database.sequelize
	)

	sequelize.authenticate()
	  .then(() => logger.info('Game Server: Connection has successfully been established.'))
	  .catch(err => {
	  	logger.debug('==> ERROR: Unable to connect to the database: ')
	  	logger.error(err)
	  })

  return sequelize
}
