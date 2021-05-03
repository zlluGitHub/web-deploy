const commitSchema = require("../schema/commit");
const tools = require("../public/javascripts/tools");
module.exports = {
    setlog: (body, isSend, res) => {
        return new Promise((resolve, reject) => {
            let conn = global.connect.conn;
            commitSchema.find({ bid: body.commitBid ? body.commitBid : body.bid }, (err, data) => {
                if (err) {
                    console.log(err);
                    if (conn.sendText && isSend) conn.sendText(err);
                    if (res) res.json({
                        message: err, code: 500
                    });
                    console.log(`构建程序成功退出！`)
                    process.exitCode = 1;
                } else {
                    let logConent = data[0].log;
                    if (Array.isArray(body.log)) {
                        body.log.forEach(item => {
                            item.time = tools.dateTime()
                            console.log(item.message);
                            if (conn.sendText && isSend) conn.sendText(item.message);
                        })
                        logConent = [...logConent, ...body.log]
                    } else {
                        body.log.time = tools.dateTime()
                        logConent = [...logConent, body.log]
                        console.log(body.log.message);
                        if (conn.sendText && isSend) conn.sendText(body.log.message);
                    }
                    body.log = logConent;
                    if (body.deployState) {
                        body.deployState = { ...data[0].deployState, ...body.deployState }
                    }
                    body.endTime = tools.dateTime();
                    commitSchema.updateOne({ bid: body.bid }, body, (err, data) => {
                        if (err) {
                            console.log(err);
                            if (conn.sendText && isSend) conn.sendText(err);
                            if (res) res.json({
                                message: err, code: 500
                            });
                            console.log(`构建程序成功退出！`)
                            process.exitCode = 1;

                        } else {
                            resolve();
                        }
                    });
                }
            });
        });
    },
    exitProcess: () => {
        // 如何正确设置退出码，同时让进程正常退出。
        if (someConditionNotMet()) {
            console.log(`构建程序成功退出！`)
            printUsageToStdout();
            process.exitCode = 1;
        }
    }
}