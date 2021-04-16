
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
// const winston = require('winston');
// const path = require('path');
// const transportConsole = new winston.transports.Console({
//     json: false,
//     timestamp: true,
//     prettyPrint: true,
//     colorize: true,
//     level: 'debug'
// });
// const transportFileDebug = new winston.transports.File({
//     filename: path.join(__dirname, './file/index.log'),
//     json: true,
//     level: 'debug'
// });

// const logger = winston.createLogger({
//     levels: {
//         error: 0,
//         warn: 1,
//         info: 2,
//         debug: 3,
//     },
//     transports: [
//         transportConsole,
//         transportFileDebug
//     ],
//     exceptionHandlers: [
//         transportConsole,
//         transportFileDebug
//     ],
//     exitOnError: false
// });

// winston.addColors({
//     debug: 'blue',
//     info: 'green',
//     warn: 'yellow',
//     error: 'red'
// });

// logger.debug('debug message');
// logger.info('info message');
// logger.warn('warn message');
// logger.error('error message');

/*
 clone:开始构建
 install:初始化
 build:打包
 deploy:部署成功
*/




const commitSchema = require("../schema/commit");
const deploySchema = require("../schema/deploy");
const tools = require("../public/javascripts/tools");
module.exports = {
    updateCommit: (log, bid) => {
        return new Promise((resolve, reject) => {
            let conn = global.connect.conn;
            commitSchema.find({ bid }, async (err, data) => {
                if (err) {
                    console.log('日志信息检索失败：', err);
                    if (conn.sendText) conn.sendText("日志信息检索失败！");
                    if (conn.sendText) conn.sendText(err);
                    reject('日志信息检索失败：' + err)
                } else {
                    let logConent = data[0].log;
                    if (Array.isArray(log)) {
                        log.forEach(item => {
                            item.time = tools.dateTime()
                            console.log(item.message);
                            if (conn.sendText) conn.sendText(item.message);
                        })
                        logConent = [...logConent, ...log]
                    } else {
                        log.time = tools.dateTime()
                        logConent = [...logConent, log]
                        console.log(log.message);
                        if (conn.sendText) conn.sendText(log.message);
                    }

                    commitSchema.updateOne({ bid }, { $set: { endTime: tools.dateTime(), log: logConent } }, (err, data) => {
                        if (err) {
                            console.log('日志信息更新失败：', err);
                            if (conn.sendText) conn.sendText("日志信息更新失败！");
                            if (conn.sendText) conn.sendText(err);
                            reject('日志信息更新失败：' + err)
                        } else {
                            resolve(data)
                        }
                    });
                }
            });
        });
    },
    exitState: (body, mark) => {
        if (body) {
            commitSchema.updateOne({ bid: body.bid }, body, (err, data) => {
                if (err) {
                    console.log(`项目状态【${body.deployState}】更新失败：`, err)
                } else {
                    console.log(`项目状态【${body.deployState}】更新成功！：`)
                    if (global.connect.server) global.connect.server.close()
                    global.connect = {
                        conn: {},
                        server: null,
                    };
                    if ((!mark) && someConditionNotMet()) {
                        printUsageToStdout();
                        process.exitCode = 1;
                    }

                }
            })
        } else {
            if (global.connect.server) global.connect.server.close()
            global.connect = {
                conn: {},
                server: null,
            };
            if ((!mark) && someConditionNotMet()) {
                console.log(`构建程序成功退出！`)
                printUsageToStdout();
                process.exitCode = 1;
            }
        }
    },
    saveCommit: (log, bid, projectId) => {
        let conn = global.connect.conn;
        return new Promise((resolve, reject) => {
            let body = {
                startTime: tools.dateTime(),
                bid: bid ? bid : tools.getUid(),
                endTime: tools.dateTime(),
                log: [log],
                projectId,
                deployState: 'start',
                isServer: false,
            }
            commitSchema.create(body, (err, data) => {
                if (err) {
                    console.log('日志信息保存失败：', err)
                    if (conn.sendText) conn.sendText(err);
                    reject('日志信息保存失败：' + err)
                } else {
                    resolve(data)
                }
            });
        });
    },
    saveDeploy: (body) => {
        let conn = global.connect.conn;
        return new Promise((resolve, reject) => {
            deploySchema.create(body, (err, data) => {
                if (err) {
                    console.log('项目信息保存失败：', err)
                    if (conn.sendText) conn.sendText(err);
                    reject('项目信息保存失败：' + err)
                } else {
                    resolve(data)
                }
            })
        });
    },
    updateDeploy: (body) => {
        let conn = global.connect.conn;
        return new Promise((resolve, reject) => {
            deploySchema.updateOne({ bid: body.bid }, body, (err, data) => {
                if (err) {
                    console.log('项目信息更新失败：', err)
                    if (conn.sendText) conn.sendText(err);
                    reject('项目信息更新失败：' + err)
                } else {
                    resolve(data)
                }
            })
        });
    }

}