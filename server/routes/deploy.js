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
            // commitSchema.find({ bid: item.commitBid }, (err, commit) => {
            //     if (err) {
            //         console.log(err);
            //     } else {
            if (item.isServer) {
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

            //     }
            // });
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
        }).skip(pageNo * pageSize).limit(pageSize).sort({ _id: -1 })
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
                            // item.isServer = data[0].isServer
                            item.startTime = data[0].startTime
                            item.endTime = data[0].endTime
                            item.deployState = data[0].deployState
                            item.hookPayload = data[0].hookPayload
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
    body.bid = tools.getUid();
    body.time = tools.dateTime();
    body.isServer = false

    if (!shell.which('git')) {
        res.json({ message: "Git 命令不存在，请安装后再试！", result: false, code: 500 });
        shell.exit(1);
    } else {

        await logger.saveDeploy(body).catch(err => {
            // 结束进程

            res.json({
                message: err, state: {
                    state: false,
                    type: 'start'
                }, code: 500
            });
        });

        await logger.saveCommit([
            {
                type: 'start',
                time: tools.dateTime(),
                message: `准备构建${body.title}项目,请稍后...`
            }
        ], body.commitBid, body.bid).catch(async err => {
            await res.json({
                message: err, state: {
                    state: false,
                    type: 'start'
                }, code: 500
            });

        })

        await workflow.initProject(body, res);

        await logger.updateCommit({
            type: 'info',
            message: `检测【${body.port}】端口服务是否已开启，请稍后...`
        }, body.commitBid).catch(err => {
            // logger.exitState()
        })
        await server.portIsOccupied(body, async (state, message) => {
            if (!state) {
                await logger.updateCommit([
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

                let deployState = {
                    state: true,
                    type: 'port'
                }
                await logger.exitState({
                    bid: body.bid,
                    commitBid: body.commitBid,
                    deployState,
                    isServer: true,
                }, 'noExit')
                await res.json({ message, data: body.bid, code: 200 });
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

                        let deployState = {
                            state: true,
                            type: 'port'
                        }
                        await logger.exitState({
                            bid: body.bid,
                            commitBid: body.commitBid,
                            deployState,
                            isServer: true,
                        }, 'noExit')
                        await res.json({ message, data: body.bid, code: 200 });

                    } else {
                        let message = `项目【${body.title}】构建失败！`
                        await logger.updateCommit({
                            type: 'port',
                            message
                        }, body.commitBid).catch(err => {
                            // logger.exitProcess()
                        })

                        let deployState = {
                            state: false,
                            type: 'port'
                        }

                        await logger.exitState({
                            bid: body.bid,
                            commitBid: body.commitBid,
                            deployState,
                            isServer: false,
                        }, 'noExit')
                        await res.json({ message, state: deployState, code: 500 });
                    }
                }).catch(() => { })
            }

        }).catch(() => { })

    }
});

//项目重新部署
router.post('/initReset', async (req, res, next) => {
    let body = req.body;

    body.commitBid = tools.getUid();
    body.time = tools.dateTime();

    if (!shell.which('git')) {
        res.json({ message: "Git 命令不存在，请安装后再试！", code: 500 });
        shell.exit(1);
    } else {

        await logger.saveCommit([
            {
                type: 'start',
                time: tools.dateTime(),
                message: `准备构建${body.title}项目,请稍后...`
            }
        ], body.commitBid, body.bid).catch(async err => {
            await res.json({
                message: err, state: {
                    state: false,
                    type: 'start'
                }, code: 500
            });

        })

        await logger.updateDeploy(body).catch(async err => {
            await logger.updateCommit(
                {
                    type: 'start',
                    message: err
                }, body.commitBid).catch(err => {
                    // logger.exitState()
                })
            let deployState = {
                state: false,
                type: 'start'
            }
            await logger.exitState({ commitBid: body.commitBid, deployState })
            await res.json({ message: err, state: deployState, code: 500 });
        })

        await workflow.initProject(body, res);

        await logger.updateCommit({
            type: 'info',
            message: `检测【${body.port}】端口服务是否已开启，请稍后...`
        }, body.commitBid).catch(err => {
            // logger.exitState()
        })
        await server.portIsOccupied(body, async (state, message) => {
            if (!state) {
                await logger.updateCommit([
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
                let deployState = {
                    state: false,
                    type: 'port'
                }
                await logger.exitState({
                    bid: body.bid,
                    commitBid: body.commitBid,
                    deployState,
                    isServer: true,
                }, 'noExit')
                await res.json({ message, data: body.bid, code: 200 });
            } else {
                server.openServer(body, async (state, mes) => {
                    if (state) {
                        let message = `项目【${body.title}】已构建完成，请访问【${body.port}】端口即可访问！`
                        await logger.updateCommit({
                            type: 'port',
                            message
                        }, body.commitBid).catch(err => {
                            // logger.exitProcess()
                        })
                        let deployState = {
                            state: true,
                            type: 'port'
                        }
                        await logger.exitState({
                            bid: body.bid,
                            commitBid: body.commitBid,
                            deployState,
                            isServer: true,
                        }, 'noExit')
                        await res.json({ message, data: body.bid, code: 200 });
                    } else {

                        let message = `项目【${body.title}】构建失败！`
                        await logger.updateCommit({
                            type: 'port',
                            message
                        }, body.commitBid).catch(err => {
                            // logger.exitProcess()
                        })
                        let deployState = {
                            state: false,
                            type: 'port'
                        }
                        await logger.exitState({
                            bid: body.bid,
                            commitBid: body.commitBid,
                            deployState,
                            isServer: false,
                        }, 'noExit')
                        await res.json({ message, state: deployState, code: 500 });
                    }
                }).catch(() => { })
            }

        }).catch(() => { })

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
router.post('/relyInstall', async (req, res, next) => {

    let body = req.body;
    body.commitBid = tools.getUid();

    if (!shell.which('git')) {
        // shell.echo('Sorry, this script requires git');
        res.json({ message: "Git 命令不存在，请安装后再试！", result: false, code: 500 });
        shell.exit(1);
    } else {

        await logger.saveCommit([
            {
                type: 'start',
                time: tools.dateTime(),
                message: `准备构建${body.title}项目,请稍后...`
            }
        ], body.commitBid, body.bid).catch(async err => {
            await res.json({
                message: err, state: {
                    state: false,
                    type: 'start'
                }, code: 500
            });

        })

        await logger.updateDeploy(body).catch(async err => {
            await logger.updateCommit(
                {
                    type: 'install',
                    message: err
                }, body.commitBid).catch(err => {
                    // logger.exitState()
                })
            let deployState = {
                state: false,
                type: 'install'
            }
            await logger.exitState({ commitBid: body.commitBid, deployState })
            await res.json({ message: err, state: deployState, code: 500 });
        })


        await logger.updateCommit({
            type: 'install',
            message: `项目${body.title}依赖正在重新安装中，请稍后...！`
        }, body.commitBid).catch(err => {
            // logger.exitProcess()
        })
        await workflow.initRely(body, res);

        let message = `项目${body.title}依赖已重新安装，项目更新部署成功！`
        await logger.updateCommit({
            type: 'deploy',
            message
        }, body.commitBid).catch(err => {
            // logger.exitProcess()
        })

        let deployState = {
            state: true,
            type: 'port'
        }

        await logger.exitState({
            bid: body.bid,
            commitBid: body.commitBid,
            deployState,
        }, 'noExit')
        await res.json({ message, data: body.bid, code: 200 });
    }
});

//重新打包文件
router.post('/relyBuild', async (req, res, next) => {
    let body = req.body;
    body.commitBid = tools.getUid();

    if (!shell.which('git')) {
        // shell.echo('Sorry, this script requires git');
        res.json({ message: "Git 命令不存在，请安装后再试！", result: false, code: 500 });
        shell.exit(1);
    } else {


        await logger.saveCommit([
            {
                type: 'start',
                time: tools.dateTime(),
                message: `准备构建${body.title}项目,请稍后...`
            }
        ], body.commitBid, body.bid).catch(async err => {
            await res.json({
                message: err, state: {
                    state: false,
                    type: 'start'
                }, code: 500
            });

        })

        await logger.updateDeploy(body).catch(async err => {
            await logger.updateCommit(
                {
                    type: 'build',
                    message: err
                }, body.commitBid).catch(err => {
                    // logger.exitState()
                })
            let deployState = {
                state: false,
                type: 'build'
            }
            await logger.exitState({ commitBid: body.commitBid, deployState })
            await res.json({ message: err, state: deployState, code: 500 });
        })

        await logger.updateCommit({
            type: 'build',
            message: `项目${body.title}正在重新打包中，请稍后...！`
        }, body.commitBid).catch(err => {
            // logger.exitProcess()
        })

        await workflow.initBuild(body, res);

        let message = `项目${body.title}已重新打包完成，项目更新部署成功！`

        await logger.updateCommit({
            type: 'build',
            message
        }, body.commitBid).catch(err => {
            // logger.exitProcess()
        })

        let deployState = {
            state: true,
            type: 'port'
        }

        await logger.exitState({
            commitBid: body.commitBid,
            deployState,
        }, 'noExit')

        await res.json({ message, data: body.bid, code: 200 });
    }
});

// 部署指定版本
router.post('/relyReset', async (req, res, next) => {
    let body = req.body;

    // body.commitBid = tools.getUid();
    body.time = tools.dateTime();

    if (!shell.which('git')) {
        // shell.echo('Sorry, this script requires git');
        res.json({ message: "Git 命令不存在，请安装后再试！", result: false, code: 500 });
        shell.exit(1);
    } else {

        await commitSchema.updateOne({ bid: body.commitBid }, { startTime: tools.dateTime() }, (err, data) => {
            if (err) {
                console.log(`项目构建状态更新失败：`, err)
            }
        })
        // await logger.saveCommit([
        //     {
        //         type: 'start',
        //         time: tools.dateTime(),
        //         message: `准备构建${body.title}项目，请稍后...`
        //     }
        // ], body.commitBid, body.bid).catch(async err => {
        //     logger.exitState()
        // })
        await logger.updateCommit(
            {
                type: 'start',
                time: tools.dateTime(),
                message: `准备构建${body.title}项目，请稍后...`
            }, body.commitBid).catch(err => {
                // logger.exitState()
            })


        await logger.updateDeploy({ bid: body.bid, commitBid: body.commitBid, time: body.time }).catch(async err => {
            await logger.updateCommit(
                {
                    type: 'start',
                    message: err
                }, body.commitBid).catch(err => {
                    // logger.exitState()
                })
            let deployState = {
                state: false,
                type: 'start'
            }
            await logger.exitState({ commitBid: body.commitBid, deployState })
            await res.json({ message: err, state: deployState, code: 500 });
        })


        await workflow.initReset(body, res);

        let message = `项目${body.title}已构建成功！`
        await logger.updateCommit({
            type: 'port',
            message
        }, body.commitBid).catch(err => {
            // logger.exitProcess()
        })

        let deployState = {
            state: true,
            type: 'port'
        }

        await logger.exitState({
            commitBid: body.commitBid,
            deployState
        }, 'noExit')
        res.json({ message, data: body.bid, code: 200 });
    }

});

//更新项目信息
router.post('/updateInfo', (req, res, next) => {
    let body = req.body;
    body.time = tools.dateTime();

    deploySchema.updateOne({ bid: body.bid }, body, (err, data) => {
        if (err) {
            console.log('错误信息：', err);
            res.json({ message: body.title + "项目信息更新失败！", result: false, code: 500 });
        } else {
            res.json({ message: body.title + "项目信息更新成功！", data: body.bid, code: 200 });
        };
    });

});

//新增项目信息
router.post('/saveInfo', async (req, res, next) => {
    let body = req.body;
    body.time = tools.dateTime();
    body.commitBid = tools.getUid();
    body.bid = tools.getUid();
    await logger.saveCommit([
        {
            type: 'start',
            time: tools.dateTime(),
            message: `项目${body.title}信息正在保存，请稍后...`
        }
    ], body.commitBid, body.bid).catch(err => {
        res.json({
            message: err, state: {
                state: false,
                type: 'start'
            }, code: 500
        });

    })
    await logger.saveDeploy(body).then(async () => {
        let deployState = {
            state: true,
            type: 'start'
        }
        let message = body.title + "项目信息保存成功！"
        res.json({ message, data: body.bid, code: 200 });
        await logger.updateCommit({
            type: 'start',
            message
        }, body.commitBid).catch(err => {
            // logger.exitProcess()
        })
        await logger.exitState({
            commitBid: body.commitBid,
            deployState,
        }, 'noExit')
    }).catch(async err => {
        let deployState = {
            state: false,
            type: 'start'
        }
        let message = body.title + "项目信息更新失败！"
        await logger.updateCommit({
            type: 'start',
            message
        }, body.commitBid).catch(err => {
            // logger.exitProcess()
        })

        await logger.exitState({
            commitBid: body.commitBid,
            deployState,
        }, 'noExit')
        res.json({ message, bid: body.bid, code: 500 });
    });


});

//切换路由模式
router.post('/history', async (req, res, next) => {
    let body = req.body;
    body.time = tools.dateTime();

    await logger.updateCommit({
        type: 'router',
        message: '正在切换路由模式，请稍后...'
    }, body.commitBid).catch(err => {
        // logger.exitProcess()
    })

    await deploySchema.updateOne({ bid: body.bid }, body, async (err, data) => {
        if (err) {
            let message = body.title + "项目路由信息更新失败！"
            await logger.updateCommit({
                type: 'router',
                message
            }, body.commitBid).catch(err => {
                // logger.exitProcess()
            })
            console.log(message);
            console.log('错误信息：', err);
            await res.json({ message, result: false, code: 500 });
        } else {
            await server.restartPort(body).then(async () => {
                let message = body.title + `项目路由已成功切换至${body.router}模式！`
                await logger.updateCommit({
                    type: 'router',
                    message
                }, body.commitBid).catch(err => {
                    // logger.exitProcess()
                })
                console.log(message);

                let deployState = {
                    state: true,
                    type: 'port'
                }

                await logger.exitState({
                    commitBid: body.commitBid,
                    deployState,
                }, 'noExit')
                await res.json({ message, data: body.bid, code: 200 });
            }).catch(async () => {
                let message = body.title + "项目路由切换失败，请重试！"
                await logger.updateCommit({
                    type: 'router',
                    message
                }, body.commitBid).catch(err => {
                    // logger.exitProcess()
                })
                console.log(message);
                let router = body.router === 'hash' ? 'history' : 'hash'
                await deploySchema.updateOne({ bid: body.bid }, { router }, (err, data) => {
                    console.log('错误信息：', err);
                })

                let deployState = {
                    state: false,
                    type: 'port'
                }
                await logger.exitState({
                    commitBid: body.commitBid,
                    deployState,
                }, 'noExit')
                await res.json({ message, state: deployState, code: 500 });
            })

        };
    });
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
                bid: body.bid,
                isServer: false,
            }, 'noExit')

            res.json({ message, data: body.bid, code: 200 });
        } else {
            let message = `${body.title}服务关闭失败，请重试！`
            logger.updateCommit(
                {
                    type: 'port',
                    message
                }, body.commitBid).catch(err => {
                    // logger.exitProcess()
                })

            res.json({ message, code: 500 });
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
                bid: body.bid,
                isServer: true,
            }, 'noExit')


            res.json({ message, data: body.bid, code: 200 });
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
            res.json({ message, code: 500 });
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

// 检测项目是否存在
router.post('/isProject', (req, res, next) => {

    deploySchema.find({ title: req.body.title }, (err, data) => {
        if (err) {
            console.log(err);
            res.json({ message: err, state: false, code: 500 });
        } else {

            let state = data.length !== 0;
            res.json({ message: state ? '此项目已存在！' : '此项目暂不存在！', state, code: 200 });
        }
    })
})

// 判断项目www根目录是否存在
router.post('/isWwwFolder', (req, res, next) => {

    deploySchema.find({}, (err, data) => {
        if (err) {
            console.log(err);
            res.json({ message: err, state: false, code: 500 });
        } else {
            let isExit = false;
            data.forEach(item => {
                if (item.www === req.body.www) {
                    isExit = true
                }
            })
            if (isExit) {
                res.json({ message: "此文件夹已存在！", state: true, code: 200 });
            } else {
                res.json({ message: "此文件夹暂不存在！", state: false, code: 200 });
            }
        }
    })
})

// 重启所有服务
router.post('/openAllServer', (req, res, next) => {

    deploySchema.find({}, async (err, data) => {
        if (err) {
            console.log(err);
            res.json({ message: err, data: {}, code: 500 });
        } else {
            let result = {
                all: 0,
                error: 0,
                success: 0,
            };

            await data.forEach(async (item, i) => {
                if (item.port) {
                    result.all++
                    await server.restartPort(item).then(async () => {
                        await logger.updateDeploy({ bid: item.bid, isServer: true }).then(() => {
                            result.success++
                            console.log(`${item.title}项目重启成功！`);
                        }).catch(err => {
                            result.error++
                            console.log(`${item.title}项目状态更新失败！`);
                        })
                    }).catch(() => {
                        result.error++
                        console.log(`${item.title}项目重启失败！`);
                    })
                }
            })
            await res.json({ message: "请求成功！", data: result, code: 200 });
        }
    })
})

// 关闭所有服务
router.post('/closeAllServer', (req, res, next) => {

    deploySchema.find({}, async (err, data) => {
        if (err) {
            console.log(err);
            res.json({ message: err, data: {}, code: 500 });
        } else {
            let result = {
                all: 0,
                error: 0,
                success: 0,
            };
            await data.forEach(async (item, i) => {
                if (item.port) {
                    result.all++
                    await server.closeServer(item, async (state, mes) => {
                        if (state) {
                            await logger.updateDeploy({ bid: item.bid, isServer: false }).catch(err => {
                                result.error++
                            }).then(() => {
                                console.log(`${item.title}项目重启成功！`);
                                result.success++
                            })
                        } else {
                            result.error++
                            console.log(`${item.title}项目重启失败！`);
                        }
                    })
                }

            })
            res.json({ message: "请求成功！", data: result, code: 200 });
        }
    })
})

module.exports = router;