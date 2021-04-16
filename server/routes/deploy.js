const express = require('express');
// const fs = require('fs');
const router = express.Router();
const shell = require('shelljs');
// const path = require('path');
const tools = require("../public/javascripts/tools");
const workflow = require('../workflow');
const deploySchema = require("../schema/deploy");
const commitSchema = require("../schema/commit");
const logger = require('../logs/index.js');
const server = require('../servePort');
// const exitProcess = require('../process');
const net = require('net');
// const socket = require('../websocket/index.js');
// const socketServer = require('../websocket/index.js');

// 项目初始化
deploySchema.find({}, (err, data) => {
    if (err) {
        console.log(err);
    } else {
        data.forEach(item => {
            commitSchema.find({ bid: item.commitBid }, (err, commit) => {
                if (err) {
                    console.log(err);
                } else {
                    if (commit.isServer) {
                        server.openServer(item, (state, mes) => {
                            if (state) {
                                let message = `${item.title}项目重启成功！`
                                logger.updateCommit({
                                    type: 'deploy',
                                    state: true,
                                    message
                                }, item.commitBid).catch(err => {
                                    // logger.exitProcess()
                                })

                            } else {
                                let message = `${item.title}项目重启失败！`
                                logger.updateCommit({
                                    type: 'deploy',
                                    state: false,
                                    message
                                }, item.commitBid).catch(err => {
                                    // logger.exitProcess()
                                })

                            }
                        })
                    }

                }
            });
        })
    }
})

router.post('/openSocket', (req, res, next) => {

    server.portIsOccupied({
        port: '8001'
    }, (state, message) => {
        if (!state) {
            console.log(`正在释放【${8001}】端口...`)
            global.connect.server.close()
            console.log('webSocket 服务正在重启中...')
        }

        global.connect.server = global.ws.createServer(conn => {
            global.connect.conn = conn;
            conn.on('connect', (code) => {
                console.log('webSocket 已开启连接！', code)
                // conn.sendText("已连接到应用服务器，正在部署...")
            })
            conn.on("close", (code, reason) => {
                console.log("Connection closed")
                // conn.sendText("webSocket 服务已断开！")
            })
            conn.on("error", (code, reason) => {
                console.log("Connection error")
                // conn.sendText("webSocket 服务错误！")
            })
        }).listen(8001);
        res.json({ message: "webSocket 服务已链接！", result: true, code: 200 });
    }).catch(() => { })
});


// socket(conn => {

// 获取项目
router.get('/get', async (req, res, next) => {
    let { pageSize, pageNo, bid, title, } = req.query;

    pageSize = pageSize ? pageSize * 1 : 10;
    pageNo = pageNo ? pageNo * 1 - 1 : 0;
    let filter = {};

    if (bid) {
        filter.bid = bid;
    };
    if (title) {
        filter.title = { $regex: new RegExp(`${regExp}`, 'gi') };
    };

    let p1 = new Promise((resolve, reject) => {
        deploySchema.find(filter, { _id: 0, __v: 0 }, (err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        }).skip(pageNo * pageSize).limit(pageSize)
    })

    let p2 = new Promise((resolve, reject) => {
        deploySchema.find().count(function (err, count) {
            if (err) {
                reject(err)
            } else {
                resolve(count)
            }
        })
    })
    // let p3 = new Promise((resolve, reject) => {
    //     await commitSchema.find({, async (err, data) => {
    //         if (err) {
    //             reject(err)
    //         } else {
    //             resolve(count)
    //         }
    //     });
    // })

    Promise.all([p1, p2]).then(async (result) => {
        let proArr = [];
        result[0].forEach(async item => {
            // console.log(item);
            proArr.push(
                new Promise((resolve, reject) => {
                    commitSchema.find({ bid: item.commitBid }, async (err, data) => {
                        if (err) {
                            reject(err)
                        } else {
                            let startTime = new Date(data[0].startTime); // 开始时间
                            let endTime = new Date(data[0].endTime); // 结束时间 

                            // let duration = Math.floor((endTime - startTime) / 1000); // 秒数
                            // let duration = Math.floor((endTime - startTime) / 1000 / 60); // 分钟
                            item.isServer = data[0].isServer
                            item.deployState = data[0].deployState
                            item.duration = Math.floor((endTime - startTime) / 1000);
                            resolve(item)
                        }
                    });
                })
            )
        })


        Promise.all(proArr).then(async (data) => {
            res.json({ data, count: result[1], code: 200, result: true });
        }).catch((error) => {
            console.log(error)
            res.json({ result: false, code: 500 });
        })

    }).catch((error) => {
        console.log(error)
        res.json({ result: false, code: 500 });
    })
});

//项目部署
router.post('/init', async (req, res, next) => {
    let body = req.body;

    body.commitBid = tools.getUid();
    body.time = tools.dateTime();
    body.bid = tools.getUid();

    if (!shell.which('git')) {
        res.json({ message: "Git 命令不存在，请安装后再试！", result: false, code: 500 });
        shell.exit(1);
    } else {

        await logger.saveDeploy(body).catch(err => {
            // 结束进程
            res.json({ message: err, state: 'state', code: 500 });
            logger.exitState()
        })

        await logger.saveCommit([
            {
                type: 'start',
                message: `准备构建${body.title}项目,请稍后...`
            }
        ], body.commitBid, body.bid).catch(err => {
            // 结束进程
            res.json({ message: err, state: 'state', code: 500 });
            logger.exitState()
        })

        await workflow.initProject(body, res);

        await logger.updateCommit({
            type: 'info',
            message: `检测【${body.port}】端口服务是否已开启，请稍后...`
        }, body.commitBid).catch(err => {
            // logger.exitState()
        })
        await server.portIsOccupied(body, (state, message) => {
            if (!state) {
                logger.updateCommit([
                    {
                        type: 'info',
                        message: `检测到【${body.port}】端口服务已开启`
                    },
                    {
                        type: 'port',
                        message: `项目【${body.title}】已构建完成，请访问【${body.port}】端口即可访问！`
                    }
                ], body.commitBid).catch(err => {
                    // logger.exitState()
                })
                res.json({ message, state: 'port', code: 200 });
                logger.exitState({
                    bid: body.commitBid,
                    deployState: 'port',
                    isServer: true,
                }, 'noExit')
            } else {
                server.openServer(body, async (state, mes) => {
                    if (state) {
                        let message = `【${body.title}】项目已构建完成，请访问【${body.port}】端口即可访问！`
                        await logger.updateCommit({
                            type: 'port',
                            message
                        }, body.commitBid).catch(err => {
                            // logger.exitProcess()
                        })
                        res.json({ message, state: 'port', code: 200 });
                        logger.exitState({
                            bid: body.commitBid,
                            deployState: 'port',
                            isServer: true,
                        }, 'noExit')
                    } else {
                        let message = `【${body.title}】项目构建失败！`
                        await logger.updateCommit({
                            type: 'port',
                            message
                        }, body.commitBid).catch(err => {
                            // logger.exitProcess()
                        })
                        res.json({ message, state: 'port', code: 500 });
                        logger.exitState({
                            bid: body.commitBid,
                            deployState: 'port',
                            isServer: false,
                        }, 'noExit')
                    }
                }).catch(() => { })
            }

        }).catch(() => { })

    }
});

//更新项目信息
router.post('/updateInfo', async (req, res, next) => {
    let body = req.body;

    body.time = tools.dateTime();
    body.bid = tools.getUid();

    await deploySchema.updateMany({ bid: body.bid }, { $set: body }, async (err, data) => {
        if (err) {
            console.log('错误信息：', err);
            res.json({ message: body.title + "项目信息更新失败！", result: false, code: 500 });
        } else {
            res.json({ message: body.title + "项目信息更新成功！", result: true, code: 200 });
        };
    });
});
//项目重新部署
router.post('/reset', async (req, res, next) => {
    let body = req.body;
    body.time = tools.dateTime();
    body.bid = tools.getUid();
    if (!shell.which('git')) {
        // shell.echo('Sorry, this script requires git');
        res.json({ message: "Git 命令不存在，请安装后再试！", result: false, code: 500 });
        shell.exit(1);
    } else {
        await workflow.initProject(body, res);
        await deploySchema.updateMany({ bid: body.bid }, { $set: body }, async (err, data) => {
            if (err) {
                console.log('错误信息：', err);
                res.json({ message: body.title + "项目信息更新失败，但部署成功，请检查数据库是否连接！", result: false, code: 500 });
            } else {
                await server.openServer(body, res)
            };
        });
    }
});


// //测试
// router.get('/test', async (req, res, next) => {
//     let result = path.join(__dirname, `../../wwws`);
//     // await command.mvProject(projectName)
//     if (fs.existsSync(result)) {
//         console.log(1);
//     }
//     res.json({ data: result, result: true, code: 200 });
// });

//重新安装依赖文件
router.post('/rely', async (req, res, next) => {
    let body = req.body;
    if (!shell.which('git')) {
        // shell.echo('Sorry, this script requires git');
        res.json({ message: "Git 命令不存在，请安装后再试！", result: false, code: 500 });
        shell.exit(1);
    } else {
        await workflow.initRely(body, res);
        // logger.info(body.title + "项目依赖已安装，项目更新部署成功！")
        // res.json({ message: body.title + "项目依赖已安装，项目更新部署成功！", result: true, code: 200 });
        await server.openServer(body, res)
    }
});

//重新打包文件
router.post('/build', async (req, res, next) => {
    let body = req.body;
    if (!shell.which('git')) {
        // shell.echo('Sorry, this script requires git');
        res.json({ message: "Git 命令不存在，请安装后再试！", result: false, code: 500 });
        shell.exit(1);
    } else {
        await workflow.initBuild(body, res);
        // logger.info(body.title + "已打包完成，项目更新部署成功！")
        // res.json({ message: body.title + "已打包完成，项目更新部署成功！", result: true, code: 200 });
        await server.openServer(body, res)
    }
});

//关闭服务端口
router.post('/closeServer', (req, res, next) => {
    let body = req.body;

    server.closeServer(body, (state, message) => {
        if (state) {
            logger.updateCommit(
                {
                    type: 'port',
                    state: false,
                    message
                }
                , body.commitBid)
            // 改变部署状态
            logger.exitState({
                bid: body.commitBid,
                deployState: 'port',
                isServer: false,
            }, 'noExit')

            res.json({ message, result: true, code: 200 });
        } else {
            res.json({ message: `${body.title}服务关闭失败，请重试！`, result: false, code: 500 });
        }
    })

});

//开启服务端口
router.post('/openServer', (req, res, next) => {
    let body = req.body;
    server.openServer(body, (state, mes) => {
        if (state) {
            let message = `项目【${body.title}】服务端口【${body.port}】已开启成功！`
            logger.updateCommit(
                {
                    type: 'port',
                    message
                }, body.commitBid).catch(err => {
                    // logger.exitProcess()
                })
            // 改变部署状态
            logger.exitState({
                bid: body.commitBid,
                deployState: 'port',
                isServer: true,
            }, 'noExit')


            res.json({ message, data: null, code: 200 });
            console.log(message);
        } else {
            let message = `项目${body.title}服务端口【${body.port}】开启失败，请重试！`
            logger.updateCommit(
                {
                    type: 'port',
                    message
                }, body.commitBid).catch(err => {
                    // logger.exitProcess()
                })
            res.json({ message, data: null, code: 500 });
            console.log(message);
        }
    })
});

//检测端口是否被占用
router.post('/portIsOccupied', (req, res, next) => {
    let body = req.body;
    if (!shell.which('git')) {
        res.json({ message: "Git 命令不存在，请安装后再试！", result: false, code: 500 });
        shell.exit(1);
    } else {
        try {
            let server = net.createServer().listen(body.port);
            server.on('listening', () => { // 执行这块代码说明端口未被占用
                server.close() // 关闭服务
                let message = `此服务端口【${body.port}】未被占用！`
                res.json({ message, data: 1, code: 200 });
            });
            server.on('error', (err) => {
                let message = `此服务端口【${body.port}】已被占用，请更换其他端口！`

                res.json({ message, data: 2, code: 200 });
            });
        } catch (err) {
            if (err.code === 'ERR_SOCKET_BAD_PORT') {
                let message = `服务端口【${body.port}】设置有误，应大于等于0且小于65536！`
                res.json({ message, data: 3, code: 200 });
            } else {
                let message = `服务端口【${body.port}】异常，请检查后重试！`
                res.json({ message, data: 4, code: 200 });
            }
        }
    }
});


// })
module.exports = router;