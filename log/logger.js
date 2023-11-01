const { createLogger, format, transports } = require('winston');
const { combine, timestamp, errors, json } = format;

let filePath = __dirname.split("\\").splice(0, 6).join("/");

const logger = createLogger({
    level: 'info',
    transports: [
        new transports.File({ filename: filePath + '/error.log', level: 'error' }),
        new transports.File({ filename:  filePath + '/combined.log' }),
    ],
    format: format.combine(
        format.timestamp({
           format: 'MMM-DD-YYYY HH:mm:ss'
       }),
        format.printf(info => `${[info.timestamp]}: ${info.level}: ${info.label}: ${info.message}`),
        json()
    )
});

module.exports = logger;