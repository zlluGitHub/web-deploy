const commitSchema = require("../schema/commit");
const tools = require("../public/javascripts/tools");
module.exports = async (log, bid) => {
    let logConent = []
    await commitSchema.find({ bid }, async (err, data) => {
        if (err) {
            console.log('错误信息：', err);
        } else {
            logConent = data[0].log;
        }
    });

    if (Array.isArray(log)) {
        log.forEach(item => {
            item.time = tools.dateTime()
            console.log(item.message);
        })
        logConent = [...logConent, ...log]
    } else {
        log.time = tools.dateTime()
        logConent = [...logConent, log]
        console.log(log.message);
    }

    await commitSchema.updateOne({ bid }, { $set: { endTime: tools.dateTime(), log: logConent } }, async (err, data) => {
        if (err) {
            console.log('错误信息：', err);
        }
    });

    // 结束进程
    if (someConditionNotMet()) {
        printUsageToStdout();
        process.exitCode = 1;
    }
}