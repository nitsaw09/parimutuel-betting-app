const winston = require('winston');

const customLevels = {
    levels: { error: 0, warn: 1, info: 2, success: 6 },
    colors: {
        info: 'blue',
        error: 'red',
        success: 'green',
        warn: 'yellow',
    }
};

const { levels, colors } = customLevels;

winston.addColors(colors);

const logConfiguration = {
    levels,
    transports: [
        new winston.transports.Console({ level: 'success' }),
    ],
    format: winston.format.combine(
        winston.format.label({
            label: `Label🏷️`
        }),
        winston.format.timestamp({
           format: 'MMM-DD-YYYY HH:mm:ss'
        }),
        winston.format.colorize(),
        winston.format.printf(info => `${info.level}: ${info.label}: ${[info.timestamp]}: ${info.message}`),
    )
};

class Logger {
    logger;
    logName = Logger.name;
    constructor(logName) {
        this.logName = logName;
        this.logger = winston.createLogger(logConfiguration);
    }

    info(message) {
        this.logger.info(`${this.logName} - ${message}`);
    }

    error(message) {
        this.logger.error(`${this.logName} - ${message}`);
    }

    success(message) {
        this.logger.success(`${this.logName} - ${message}`);
    }

    warn(message) {
        this.logger.warn(`${this.logName} - ${message}`);
    }
}

module.exports = Logger;