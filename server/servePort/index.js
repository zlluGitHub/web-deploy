
const express = require('express');
const proxy = require("http-proxy-middleware");
const history = require('connect-history-api-fallback');
const net = require('net');
const killPort = require('kill-port');
const path = require('path');
const logger = require('../logs/index.js');


let openServer = (data, callBack) => {
    return new Promise(async (resolve, reject) => {
        let app = express();
        if (data.router === 'history') {
            app.use(history());
        }
        // 跨域代理 
        let commitArr = [{
            type: 'port',
            message: `项目【${data.title}】服务正在启动中...`
        },
        {
            type: 'port',
            message: `正在配置【${data.title}】服务配置代理`
        }]
        data.proxy.forEach((item, i) => {
            if (data.proxy[i].rewrite && data.proxy[i].target) {
                let pathRewrite = {}
                pathRewrite['^/' + item.rewrite] = "";
                app.use(`/${item.rewrite}/**`,
                    proxy.createProxyMiddleware({
                        // 代理目标地址
                        target: item.target,
                        changeOrigin: true,
                        // ws: true,   
                        // xfwd:true,
                        // 地址重写
                        pathRewrite
                    })
                );
                commitArr.push({
                    type: 'port',
                    state: false,
                    message: '【' + item.rewrite + '】->【' + item.target + '】代理配置成功！'
                })
            }
        });
        await logger.updateCommit(commitArr, data.commitBid).catch(err => {
            // logger.exitProcess()
        })

        app.use(express.static(path.join(__dirname, '../../www/' + data.www)));

        let server = app.listen(data.port);
        await server.on('error', async (error) => {
            let message = `项目${data.title}服务【${data.port}】启动失败，请检查端口是否重复！`
            await logger.updateCommit([
                {
                    type: 'port',
                    message
                },
                {
                    type: 'port',
                    message: error
                }
            ], data.commitBid).catch(err => {
                // logger.exitProcess()
            })

            if (callBack) callBack(false, message)
            reject(false, message)
        });
        await server.on('listening', async () => {
            global.appServer[data.bid] = server;
            let message = `项目【${data.title}】服务【${data.port}】启动成功！`
            await logger.updateCommit({
                type: 'port',
                message
            }, data.commitBid).catch(err => {
                // logger.exitProcess()
            })
            if (callBack) callBack(true, message)
            resolve(true, message)
        });
    });
};
let closeServer = (data, callBack) => {
    return new Promise(async (resolve, reject) => {
        if (global.appServer[data.bid]) {
            global.appServer[data.bid].close();
            let message = `项目【${data.title}】服务【${data.port}】关闭成功！`
            if (data.commitBid) await logger.updateCommit({
                type: 'port',
                message
            }, data.commitBid).catch(err => {
                // logger.exitProcess()
            })
            if (callBack) callBack(true, message)
            resolve(true, message)
        } else {
            killPort(data.port, 'tcp')
                .then(async () => {
                    let message = `项目【${data.title}】服务【${data.port}】关闭成功！`
                    if (data.commitBid) await logger.updateCommit({
                        type: 'port',
                        message
                    }, data.commitBid).catch(err => {
                        // logger.exitProcess()
                    })
                    if (callBack) callBack(true, message)
                    resolve(true, message)
                    // if (isRes) res.json({ message, result: true, code: 200 });
                })
                .catch(async error => {
                    let message = `项目【${data.title}】服务【${data.port}】关闭失败！`
                    if (data.commitBid) await logger.updateCommit([
                        {
                            type: 'port',
                            message
                        },
                        {
                            type: 'port',
                            message: error
                        }
                    ], data.commitBid).catch(err => {
                        // logger.exitProcess()
                    })
                    if (callBack) callBack(false, message)
                    reject(false, message)
                });
        }
    });
}
let portIsOccupied = (data, callBack) => {
    return new Promise(async (resolve, reject) => {
        // 创建服务并监听该端口
        try {
            let server = net.createServer().listen(data.port);
            server.on('listening', async () => { // 执行这块代码说明端口未被占用
                server.close() // 关闭服务
                let message = `此服务端口【${data.port}】未被占用！`
                if (data.commitBid) await logger.updateCommit({
                    type: 'port',
                    message
                }, data.commitBid).catch(err => {
                    // logger.exitProcess()
                })
                if (callBack) callBack(true, message)
                resolve(true, message)
            });

            server.on('error', async (err) => {
                // if (err.code === 'EADDRINUSE') { // 端口已经被使用
                let message = `此服务端口【${data.port}】已被占用，请更换其他端口！`
                if (data.commitBid) await logger.updateCommit([
                    {
                        type: 'port',
                        message
                    },
                    {
                        type: 'port',
                        message: err
                    }
                ], data.commitBid).catch(err => {
                    // logger.exitProcess()
                })
                if (callBack) callBack(false, message)
                reject(false, message)
            });

        } catch (err) {
            if (err.code === 'ERR_SOCKET_BAD_PORT') {
                let message = `服务端口【${data.port}】设置有误，应大于等于0且小于65536！`
                if (data.commitBid) await logger.updateCommit([
                    {
                        type: 'port',
                        message
                    },
                    {
                        type: 'port',
                        message: err
                    }
                ], data.commitBid).catch(err => {
                    // logger.exitProcess()
                })
                if (callBack) callBack(false, message)
                reject(false, message)
            } else {
                let message = `服务端口【${data.port}】异常，请检查后重试！`
                if (data.commitBid) await logger.updateCommit([
                    {
                        type: 'port',
                        message
                    },
                    {
                        type: 'port',
                        message: err
                    }
                ], data.commitBid).catch(err => {
                    // logger.exitProcess()
                })
                if (callBack) callBack(false, message)
                reject(false, message)
            }
        }
    })
}

let restartPort = (body, callBack) => {
    return new Promise(async (resolve, reject) => {
        await portIsOccupied(body).catch(async () => {
            await closeServer(body).catch(error => {
                if (callBack) callBack(false, error)
                reject(error)
            })
        })
        await openServer(body).then(() => {
            if (callBack) callBack(true)
            resolve(true)
        }).catch((error) => {
            if (callBack) callBack(false, error)
            reject(error)
        })
    })
}


module.exports = { openServer, portIsOccupied, closeServer, restartPort }