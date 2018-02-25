import winston from 'winston'
import path from 'path'
import fs from 'fs'

winston.setLevels(winston.config.npm.levels)
winston.addColors(winston.config.npm.colors)

const logs = path.resolve(__dirname, '..', '..', 'logs')

if (!fs.existsSync(logs)) fs.mkdirSync(logs)

export default new (winston.Logger)({
  transports: [
    new winston.transports.File({
      level: 'info',
      filename: path.join(logs, 'StormServer.log'),
      handleExceptions: true,
      json: true,
      maxsize: 5242880, // 5mb
      maxFiles: 5
    }),
    new winston.transports.Console({
      level: 'silly',
      json: false,
      colorize: true,
      timestamp: true
    })
  ],
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(logs, 'StormExceptions.log')
    })
  ]
})
