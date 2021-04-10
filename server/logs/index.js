
// let log4js = require("log4js");
// log4js.configure({
//     appenders: {
//         fileout: {
//             type: "file",
//             filename: './server/logs/file/zll.log',//您要写入日志文件的路径
//         },
//         datafileout: {
//             type: "dateFile",
//             filename: './server/logs/file/zll.log',
//             pattern: ".yyyy-MM-dd-hh-mm-ss-SSS.log"
//         },
//         consoleout: { type: "console" },
//     },
//     categories: {
//         default: { appenders: ["fileout", "consoleout"], level: "debug" },
//         anything: { appenders: ["consoleout"], level: "debug" }
//     }
// });
// // 设置日志记录级别，记录当前级别及以后 ALL < TRACE < DEBUG < INFO < WARN < ERROR < FATAL < MARK < OFF
// // log.level = 'error'

// let logger = log4js.getLogger('anything');
// logger.info('result.stderr')

// module.exports = logger

/*
  基本使用
 */
const winston = require('winston');
const path = require('path');
const transportConsole = new winston.transports.Console({
    json: false,
    timestamp: true,
    prettyPrint: true,
    colorize: true,
    level: 'debug'
});
const transportFileDebug = new winston.transports.File({
    filename: path.join(__dirname, './file/index.log'),
    json: true,
    level: 'debug'
});

const logger = winston.createLogger({
    levels: {
        error: 0,
        warn: 1,
        info: 2,
        debug: 3,
    },
    transports: [
        transportConsole,
        transportFileDebug
    ],
    exceptionHandlers: [
        transportConsole,
        transportFileDebug
    ],
    exitOnError: false
});

winston.addColors({
    debug: 'blue',
    info: 'green',
    warn: 'yellow',
    error: 'red'
});

// logger.debug('debug message');
// logger.info('info message');
// logger.warn('warn message');
// logger.error('error message');

module.exports = logger