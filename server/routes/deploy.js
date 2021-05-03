const express = require('express');
// const fs = require('fs');
const router = express.Router();
const shell = require('shelljs');
const path = require('path');
const tools = require("../public/javascripts/tools");
const workflow = require('../workflow');
const deploySchema = require("../schema/deploy");
const commitSchema = require("../schema/commit");
const logger = require('../logs/index.js');
const server = require('../servePort');
// const exitProcess = require('../process');
const net = require('net');
// const command = require('../command/index.js');
const database = require('../database/index.js');
// const socket = require('../websocket/index.js');
// const socketServer = require('../websocket/index.js');

// init:第一次部署  resetInit：重新部署    install：重新安装依赖  build：重新打包部署

// 项目初始化
deploySchema.find({}, (err, data) => {
    if (err) {
        console.log(err);
    } else {
        data.forEach(item => {
            if (item.isServer) {
                server.openServer(item, async (state, mes) => {
                    if (state) {
                        let message = `${item.title}项目重启成功！`
                        await logger.setlog({
                            bid: item.commitBid,
                            log: { message }
                        }, false)

                    } else {
                        let message = `${item.title}项目重启失败！`
                        await logger.setlog({
                            bid: item.commitBid,
                            log: { message }
                        }, false)
                    }
                })
            }
        })
    }
})


router.post('/openSocket', (req, res, next) => {
    server.tryUsePort(8001, port => {
        // if (!state) {
        //     console.log(`正在释放【${8001}】端口...`)
        //     global.connect.server.close()
        //     console.log('webSocket 服务正在重启中...')
        // }
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
        }).listen(port);
        let time = setTimeout(() => {
            if (global.connect.server) global.connect.server.close();
            global.connect.server = null
            clearTimeout(time)
        }, 1000 * 60 * 5)
        res.json({ message: "webSocket 服务已链接！", result: true, code: 200 });
    })
});

// router.post('/closeSocket', (req, res, next) => {
//     if (global.connect.server) global.connect.server.close();
//     res.json({ message: "webSocket 服务已关闭！", code: 200 });
// });

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
        deploySchema.find(filter).count((err, count) => {
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

//webHook部署
router.post('/init', async (req, res) => {
    let body = req.body;

    body.commitBid = tools.getUid();
    body.bid = tools.getUid();

    if (!shell.which('git')) {
        res.json({ message: "Git 命令不存在，请安装后再试！", result: false, code: 500 });
        shell.exit(1);
    } else {

        await database.saveDeploy(body, res).then(() => {
            console.log(`项目【${body.title}】信息创建成功！`)
        })

        await database.saveCommit({
            bid: body.commitBid,
            projectId: body.bid,
            activeType: 'init'
        }, res).then(() => {
            console.log(`项目【${body.title}】日志信息创建成功！`)
        })

        // 开始创建
        await logger.setlog({
            bid: body.commitBid,
            log: {
                message: `开始准备构建【${body.title}】项目，请稍后...`
            }
        }, true, res)


        // 任务流开始 
        await workflow.initProject(body, res);

        // 开始部署
        await logger.setlog({
            log: {
                message: '开始配置项目运行服务环境相关信息，请稍后...',
            },
            deployState: {
                state: 0,
                type: 'deploy'
            },
            bid: body.commitBid
        }, true, res)


        if (body.port) {

            // 判断端口是否开启
            // await server.portIsOccupied(body, null, res).catch(async () => {
            //     await server.closeServer(body, null, res)
            // })
            let portState = await server.portInUse(body.port);
            if (portState instanceof Error) {
                await server.closeServer(body, null, res)
            }

            // 开启服务 
            await server.openServer(body, null, res).then(async () => {

                await database.updateDeploy({
                    bid: body.bid,
                    isServer: true
                }, res)

                let message = `构建完成，请访问（${body.port}）端口即可访问！`;
                let deployState = {
                    state: 1,
                    type: 'deploy'
                }

                await logger.setlog({
                    log: {
                        message,
                    },
                    deployState,
                    bid: body.commitBid
                }, true, res)

                res.json({ message, key: body.bid, state: deployState, code: 200 });
            }).catch(async (err) => {

                await database.updateDeploy({
                    bid: body.bid,
                    isServer: false
                }, res)

                let message = `项目【${body.title}】已构建失败！`;
                let deployState = {
                    state: 2,
                    type: 'deploy'
                }
                await logger.setlog({
                    log: {
                        message,
                    },
                    deployState,
                    bid: body.commitBid
                }, true, res)
                res.json({ message: err, state: deployState, code: 500 });
            })
        } else {
            let message = `项目【${body.title}】已构建完成！`;
            let deployState = {
                state: 1,
                type: 'deploy'
            }

            await logger.setlog({
                log: {
                    message,
                },
                deployState,
                bid: body.commitBid
            }, true, res)

            res.json({ message, key: body.bid, state: deployState, code: 200 });
        }
    }
});

//webHook重新部署更新
router.post('/initReset', async (req, res, next) => {
    let body = req.body;

    body.commitBid = tools.getUid();
    body.time = tools.dateTime();

    if (!shell.which('git')) {
        res.json({ message: "Git 命令不存在，请安装后再试！", code: 500 });
        shell.exit(1);
    } else {

        await database.updateDeploy(body, res).then(() => {
            console.log(`项目【${body.title}】信息更新成功！`)
        })

        await database.saveCommit({
            bid: body.commitBid,
            projectId: body.bid,
            activeType: 'resetInit'
        }, res).then(() => {
            console.log(`项目【${body.title}】日志信息创建成功！`)
        })

        // 开始创建
        await logger.setlog({
            bid: body.commitBid,
            log: {
                message: `开始准备构建【${body.title}】项目，请稍后...`
            }
        }, true, res)


        // 任务流开始 
        await workflow.initProject(body, res);


        await logger.setlog({
            log: {
                message: '开始配置项目运行服务环境相关信息，请稍后...',
            },
            deployState: {
                state: 0,
                type: 'deploy'
            },
            bid: body.commitBid
        }, true, res)


        if (body.port) {

            // 判断端口是否开启
            // await server.portIsOccupied(body, null, res).catch(async () => {
            //     await server.closeServer(body, null, res)
            // })
            let portState = await server.portInUse(body.port);
            if (portState instanceof Error) {
                await server.closeServer(body, null, res)
            }

            // 开启服务 
            await server.openServer(body, null, res).then(async () => {

                await database.updateDeploy({
                    bid: body.bid,
                    isServer: true
                }, res)

                let message = `项目【${body.title}】已构建完成，请访问（${body.port}）端口即可访问！`;
                let deployState = {
                    state: 1,
                    type: 'deploy'
                }

                await logger.setlog({
                    log: {
                        message,
                    },
                    deployState,
                    bid: body.commitBid
                }, true, res)

                res.json({ message, key: body.bid, state: deployState, code: 200 });
            }).catch(async (err) => {

                await database.updateDeploy({
                    bid: body.bid,
                    isServer: false
                }, res)

                let message = `项目【${body.title}】已构建失败！`;
                let deployState = {
                    state: 2,
                    type: 'deploy'
                }
                await logger.setlog({
                    log: {
                        message,
                    },
                    deployState,
                    bid: body.commitBid
                }, true, res)
                res.json({ message: err, state: deployState, code: 500 });
            })
        } else {
            let message = `项目【${body.title}】已构建完成！`;
            let deployState = {
                state: 1,
                type: 'deploy'
            }

            await logger.setlog({
                log: {
                    message,
                },
                deployState,
                bid: body.commitBid
            }, true, res)

            res.json({ message, key: body.bid, state: deployState, code: 200 });
        }
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

        await database.updateDeploy({
            bid: body.bid,
            commitBid: body.commitBid
        }, res).then(() => {
            console.log(`项目【${body.title}】信息更新成功！`)
        })

        await database.saveCommit({
            bid: body.commitBid,
            projectId: body.bid,
            activeType: 'install'
        }, res).then(() => {
            console.log(`项目【${body.title}】日志信息创建成功！`)
        })

        // 开始创建
        await logger.setlog({
            bid: body.commitBid,
            log: {
                message: `项目${body.title}依赖正在重新安装中，请稍后...`
            }
        }, true, res)

        // 任务流开始 
        await workflow.initRely(body, res);

        await logger.setlog({
            log: {
                message: `项目${body.title}依赖已重新安装，项目更新部署成功！`,
            },
            bid: body.commitBid
        }, true, res)

        await res.json({ message: `项目${body.title}依赖已重新安装，项目更新部署成功！`, data: body.bid, code: 200 });
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
        await database.updateDeploy({
            bid: body.bid,
            commitBid: body.commitBid
        }, res).then(() => {
            console.log(`项目【${body.title}】信息更新成功！`)
        })
        await database.saveCommit({
            bid: body.commitBid,
            projectId: body.bid,
            activeType: 'build'
        }, res).then(() => {
            console.log(`项目【${body.title}】日志信息创建成功！`)
        })

        // 开始创建
        await logger.setlog({
            bid: body.commitBid,
            log: {
                message: `项目${body.title}正在重新打包中，请稍后...`
            }
        }, true, res)

        // 任务流开始 
        await workflow.initBuild(body, res);

        await logger.setlog({
            log: {
                message: `项目${body.title}已重新打包完成，项目更新部署成功！`
            },
            bid: body.commitBid
        }, true, res)

        await res.json({ message: `项目${body.title}已重新打包完成，项目更新部署成功！`, data: body.bid, code: 200 });
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

        await database.updateDeploy({
            bid: body.bid,
            commitBid: body.commitBid
        }, res).then(() => {
            console.log(`项目【${body.title}】信息更新成功！`)
        })
        // await database.saveCommit({
        //     bid: body.commitBid,
        //     projectId: body.bid,
        //     activeType: 'build'
        // }, res).then(() => {
        //     console.log(`项目【${body.title}】日志信息创建成功！`)
        // })

        // 开始创建
        await logger.setlog({
            bid: body.commitBid,
            log: {
                message: `准备构建${body.title}项目，请稍后...`
            }
        }, true, res)

        // 任务流开始 
        await workflow.initCommitReset(body, res);

        await logger.setlog({
            log: {
                message: `项目${body.title}项目更新部署成功！`
            },
            bid: body.commitBid
        }, true, res)

        await res.json({ message: `项目${body.title}项目更新部署成功！`, data: body.bid, code: 200 });
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

//删除项目信息
router.post('/deleteInfo', async (req, res, next) => {
    let body = req.body;

    if (body.projectPort) {
        let portState = await server.portInUse(body.port);
        if (portState instanceof Error) {
            await server.closeServer(body, null, res)
        }
        global.appServer[body.bid] = null;
    }

    if (body.projectInfo) {
        await database.deleteDeploy({ bid: body.bid }, res).then(() => {
            console.log(`项目【${body.title}】信息删除成功！`)
        })
        await database.deleteCommit({ bid: body.bid }, res).then(() => {
            console.log(`项目【${body.title}】所有日志信息删除成功！`)
        })
    }

    if (body.projectBackups) {
        let result = await shell.exec(`rm -rf ./${body.www}`, {
            cwd: path.join(__dirname, `../../backups`),
        })
        console.log(result.stdout);
        console.log(result.stderr);

        result = await shell.exec(`rm -rf ./${body.www}`, {
            cwd: path.join(__dirname, '../../www'),
        })
        console.log(result.stdout);
        console.log(result.stderr);
    }

    res.json({ message: body.title + "项目删除成功！", code: 200 });
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

    let message = '正在切换路由模式，请稍后...'
    await logger.setlog({
        log: {
            message
        },
        bid: body.commitBid
    }, true, res)

    if (body.port && body.isServer) {

        let portState = await server.portInUse(body.port);
        if (portState instanceof Error) {
            await server.closeServer(body, null, res)
        }

        // 开启服务 
        await server.openServer(body, null, res).then(async () => {

            await database.updateDeploy({
                bid: body.bid,
                isServer: true
            }, res)

            let message = `项目${body.title}路由已成功切换至${body.router}模式！`;
            let deployState = {
                state: 1,
                type: 'deploy'
            }
            await logger.setlog({
                log: {
                    message,
                },
                deployState,
                bid: body.commitBid
            }, true, res)

            res.json({ message, state: deployState, code: 200 });
        }).catch(async (err) => {

            await database.updateDeploy({
                bid: body.bid,
                isServer: false
            }, res)

            let message = `项目${body.title}路由模式切换失败！`;
            let deployState = {
                state: 2,
                type: 'deploy'
            }
            await logger.setlog({
                log: {
                    message,
                },
                deployState,
                bid: body.commitBid
            }, true, res)
            res.json({ message: err, state: deployState, code: 500 });
        })

    } else {
        await database.updateDeploy({
            bid: body.bid,
            isServer: true
        }, res)

        let message = `项目${body.title}路由已成功切换至${body.router}模式！`;
        let deployState = {
            state: 1,
            type: 'deploy'
        }
        await logger.setlog({
            log: {
                message,
            },
            deployState,
            bid: body.commitBid
        }, true, res)

        res.json({ message, state: deployState, code: 200 });
    }
});


//关闭服务端口
router.post('/closeServer', async (req, res, next) => {
    let body = req.body;

    await logger.setlog({
        log: {
            message: '正在关闭' + body.port + '端口服务，请稍后...',
        },
        bid: body.commitBid
    }, false, res)

    let portState = await server.portInUse(body.port);
    if (portState instanceof Error) {

        console.log(`项目【${body.title}】服务端口（${body.port}）已启用`);

        await server.closeServer(body, async (state, message) => {
            if (state) {
                await database.updateDeploy({
                    bid: body.bid,
                    isServer: false
                }, res)

                res.json({ message, data: body.bid, code: 200 });
            } else {
                res.json({ message, code: 500 });
            }
        })

    } else {
        let message = `项目【${body.title}】服务端口（${body.port}）早已关闭`
        console.log(message);
        await database.updateDeploy({
            bid: body.bid,
            isServer: false
        }, res)
        res.json({ message, data: body.bid, code: 200 });
    }

});

//开启服务端口
router.post('/openServer', async (req, res, next) => {
    let body = req.body;
    await logger.setlog({
        log: {
            message: '正在开启' + body.port + '端口服务，请稍后...',
        },
        bid: body.commitBid
    }, false, res)

    let portState = await server.portInUse(body.port);
    if (portState instanceof Error) {
        await server.closeServer(body, null, res)
    }
    await server.openServer(body, async (state, message) => {
        if (state) {
            await database.updateDeploy({
                bid: body.bid,
                isServer: true
            }, res)
            res.json({ message, data: body.bid, code: 200 });
        } else {
            await database.updateDeploy({
                bid: body.bid,
                isServer: false
            }, res)
            res.json({ message, code: 500 });
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
    console.log(req.body);
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

            for (let index = 0; index < data.length; index++) {
                if (data[index].port) {
                    result.all++;

                    // 判断端口是否开启
                    let portState = await server.portInUse(data[index].port);
                    if (portState instanceof Error) {
                        await server.closeServer(data[index], null, res)
                    }
                    // 开启端口
                    await server.openServer(data[index], async (state, message) => {
                        if (state) {
                            await database.updateDeploy({
                                bid: data[index].bid,
                                isServer: true
                            }, res)
                            result.success++
                            console.log(`${data[index].title}项目开启状态更新成功！`);
                        } else {
                            await database.updateDeploy({
                                bid: data[index].bid,
                                isServer: false
                            }, res)
                            result.error++
                            console.log(`${data[index].title}项目开启状态更新失败！`);
                        }
                    })
                }
            }
            res.json({ message: "请求成功！", data: result, code: 200 });
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

            for (let index = 0; index < data.length; index++) {
                if (data[index].port) {
                    result.all++;
                    await server.closeServer(data[index]).catch(() => {
                        result.error++
                    })

                    await database.updateDeploy({
                        bid: data[index].bid,
                        isServer: false
                    }, res).then(() => {
                        result.success++
                        console.log(`项目${data[index].title}服务关闭状态更新成功！`);
                    }).catch(err => {
                        result.error++
                        console.log(`项目${data[index].title}服务关闭状态更新失败！`);
                    })

                    // await logger.updateDeploy({ bid: data[index].bid, isServer: false }).then(() => {
                    //     result.success++
                    //     console.log(`项目${data[index].title}服务关闭状态更新成功！`);
                    // }).catch(err => {
                    //     result.error++
                    //     console.log(`项目${data[index].title}服务关闭状态更新失败！`);
                    // })
                }
            }

            res.json({ message: "请求成功！", data: result, code: 200 });
        }
    })
})

//项目静态部署
router.post('/initStatic', async (req, res, next) => {
    let body = req.body;

    body.commitBid = tools.getUid();
    body.time = tools.dateTime();
    body.isServer = false
    body.isStatic = '1'

    if (body.bid) {
        await database.updateDeploy(body, res).then(() => {
            console.log(`项目${body.title}信息更新成功！`)
        })
    } else {
        body.bid = tools.getUid();
        await database.saveDeploy(body, res).then(() => {
            console.log(`项目【${body.title}】信息创建成功！`)
        })
    }

    if ((!body.port) && global.appServer[data.bid]) {
        global.appServer[data.bid].close();
    }

    await database.saveCommit({
        bid: body.commitBid,
        projectId: body.bid
    }, res).then(() => {
        console.log(`准备构建 ${body.title} 项目目录信息，请稍后...`)
    })

    await tools.mkdirsSync(path.join(__dirname, `../../backups/${body.www}/${body.commitBid}`))

    let message = `准备上传 ${body.title} 项目文件，请稍后...`

    await logger.setlog({
        log: {
            message,
        },
        bid: body.commitBid
    }, true, res)

    res.json({ message, data: body, code: 200 });
});

//项目静态部署将文件转到www文件夹下
router.post('/deployReduction', async (req, res, next) => {
    let body = req.body;

    await logger.setlog({
        log: {
            message: `准备将项目文件移动到部署根目录,请稍后...`
        },
        bid: body.commitBid
    }, true, res)

    // 任务流开始 
    await workflow.initCommitReset(body, res);

    // await command.deleteRoot(body.bid, body.title, body.www, body.commitBid, res)
    // tools.mkdirsSync(path.join(__dirname, '../../www/' + body.www))
    // await logger.updateDeploy(body).catch(err => { });
    // await command.mvReductionWww(body, res)

    if (body.port) {

        // 判断端口是否开启
        // await server.portIsOccupied(body, null, res).catch(async () => {
        //     await server.closeServer(body, null, res)
        // })
        let portState = await server.portInUse(body.port);
        if (portState instanceof Error) {
            await server.closeServer(body, null, res)
        }

        // 开启服务 
        await server.openServer(body, null, res).then(async () => {

            await database.updateDeploy({
                bid: body.bid,
                isServer: true
            }, res)

            let message = `项目【${body.title}】已构建完成，请访问（${body.port}）端口即可访问！`;
            let deployState = {
                state: 1,
                type: 'deploy'
            }

            await logger.setlog({
                log: {
                    message,
                },
                deployState,
                bid: body.commitBid
            }, true, res)

            res.json({ message, state: deployState, code: 200 });
        }).catch(async (err) => {

            await database.updateDeploy({
                bid: body.bid,
                isServer: false
            }, res)

            let message = `项目【${body.title}】已构建失败！`;
            let deployState = {
                state: 2,
                type: 'deploy'
            }
            await logger.setlog({
                log: {
                    message,
                },
                deployState,
                bid: body.commitBid
            }, true, res)
            res.json({ message: err, state: deployState, code: 500 });
        })
    } else {
        let message = `项目【${body.title}】已构建完成！`;
        let deployState = {
            state: 1,
            type: 'deploy'
        }

        await logger.setlog({
            log: {
                message,
            },
            deployState,
            bid: body.commitBid
        }, true, res)

        res.json({ message, state: deployState, code: 200 });
    }
});



// //项目重新部署(静态部署指定版本)
// router.post('/initReductionReset', async (req, res, next) => {
//     let body = req.body;
//     // body.oldCommitBid = body.commitBid
//     // body.commitBid = tools.getUid();

//     body.time = tools.dateTime();
//     body.isServer = false
//     body.isStatic = '1'


//     await logger.updateCommit({
//         type: 'build',
//         message: `准备重新构建${body.title}项目,请稍后...`
//     }, body.commitBid).catch(err => {
//         // logger.exitProcess()
//     })


//     await command.deleteRoot(body.bid, body.title, body.www, body.commitBid, res)
//     tools.mkdirsSync(path.join(__dirname, '../../www/' + body.www))
//     await command.mvReductionWww(body, res)
//     await logger.updateDeploy(body).catch(err => { });


//     if (body.port) {
//         await server.closeServer(body).catch(err => {
//             // logger.exitState()
//         })

//         await server.openServer(body).then(async () => {
//             let message = `项目【${body.title}】已构建完成，请访问【${body.port}】端口即可访问！`
//             await logger.updateCommit([
//                 {
//                     type: 'port',
//                     message
//                 }
//             ], body.commitBid).catch(err => {
//                 // logger.exitState()
//             })
//             let deployState = {
//                 state: true,
//                 type: 'port'
//             }

//             await logger.exitState({
//                 bid: body.bid,
//                 commitBid: body.commitBid,
//                 deployState,
//                 isServer: true,
//             }, 'noExit')
//             res.json({ message, data: body.bid, code: 200 });

//         }).catch(async err => {
//             let message = `项目【${body.title}】构建失败！`
//             await logger.updateCommit({
//                 type: 'port',
//                 message
//             }, body.commitBid).catch(err => {
//                 // logger.exitProcess()
//             })

//             let deployState = {
//                 state: false,
//                 type: 'port'
//             }

//             await logger.exitState({
//                 bid: body.bid,
//                 commitBid: body.commitBid,
//                 deployState,
//                 isServer: false,
//             }, 'noExit')
//             await res.json({ message, state: deployState, code: 500 });
//         })

//     } else {
//         let message = `【${body.title}】项目运行环境构建完成！`
//         await logger.updateCommit({
//             type: 'port',
//             message
//         }, body.commitBid).catch(err => {
//             // logger.exitProcess()
//         })

//         let deployState = {
//             state: true,
//             type: 'port'
//         }
//         await logger.exitState({
//             bid: body.bid,
//             commitBid: body.commitBid,
//             deployState,
//             isServer: true,
//         }, 'noExit')
//         res.json({ message, data: body.bid, code: 200 });
//     }

// });
module.exports = router;