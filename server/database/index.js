const deploySchema = require("../schema/deploy");
const commitSchema = require("../schema/commit");
const tools = require("../public/javascripts/tools");
module.exports = {
    saveDeploy: (body, res) => {
        return new Promise((resolve, reject) => {
            body.time = tools.dateTime();
            body.isServer = false
            body.gzip = true
            deploySchema.create(body, (err, data) => {
                if (err) {
                    console.log(`项目【${body.title}】信息创建失败！`)
                    console.log(err)
                    if (res) res.json({
                        message: err, state: {
                            state: 2,
                            type: 'start'
                        }, code: 500
                    });
                } else {
                    resolve()
                }
            })
        });
    },
    saveCommit: (body, res) => {
        return new Promise((resolve, reject) => {
            let data = {
                startTime: tools.dateTime(),
                bid: body.bid ? body.bid : tools.getUid(),
                endTime: tools.dateTime(),
                activeType: body.activeType ? body.activeType : 'init',
                log: [
                    // {
                    //     message,
                    //     time: tools.dateTime(),
                    // }
                ],
                projectId: body.projectId,
                deployState: {
                    state: false,
                    type: 'start'
                },
                hookPayload: body.hookPayload ? body.hookPayload : {
                    isExit: false,
                    before: "",
                    after: "",
                    url: "",
                    added: "",
                    removed: "",
                    modified: "",
                    commitId: "",
                    message: ""
                },
            }

            // data = { ...data, ...body }
            commitSchema.create(data, (err, data) => {
                if (err) {
                    console.log(`项目【${body.title}】日志信息创建失败！`)
                    console.log(err)
                    if (res) res.json({
                        message: err, state: {
                            state: 2,
                            type: 'start'
                        }, code: 500
                    });
                } else {
                    resolve()
                }
            })
        });
    },
    updateDeploy: (body, res) => {
        return new Promise((resolve, reject) => {
            deploySchema.updateOne({ bid: body.bid }, body, (err, data) => {
                if (err) {
                    console.log(`项目【${body.title}】信息更新失败！`)
                    console.log(err)
                    if (res) res.json({
                        message: err, state: {
                            state: 2,
                            type: 'start'
                        }, code: 500
                    });
                } else {
                    resolve()
                }
            })
        });
    },

    deleteDeploy: (body, res) => {
        return new Promise((resolve, reject) => {
            deploySchema.deleteMany(body, (err, data) => {
                if (err) {
                    console.log(`项目【${body.title}】信息删除失败！`)
                    console.log(err)
                    if (res) res.json({
                        message: err, state: {
                            state: 2,
                            type: 'deploy'
                        }, code: 500
                    });
                } else {
                    resolve()
                }
            })
        });
    },
    deleteCommit: (body, res) => {
        return new Promise((resolve, reject) => {
            commitSchema.deleteMany(body, (err, data) => {
                if (err) {
                    console.log(`项目【${body.title}】日志信息删除失败！`)
                    console.log(err)
                    if (res) res.json({
                        message: err, state: {
                            state: 2,
                            type: 'deploy'
                        }, code: 500
                    });
                } else {
                    resolve(data)
                }
            })
        });
    },
    getDeploy: (bid, res) => {
        return new Promise((resolve, reject) => {
            deploySchema.find({ bid }, (err, data) => {
                if (err) {
                    console.log(`项目【${body.title}】信息获取失败！`)
                    console.log(err)
                    if (res) res.json({
                        code: 500
                    });
                } else {
                    console.log(data);
                    resolve(data[0])
                }
            })
        });
    },
}