
const express = require('express');
const proxy = require("http-proxy-middleware");
const history = require('connect-history-api-fallback');
const net = require('net');
const killPort = require('kill-port');
const path = require('path');
const compression = require('compression')
const logger = require('../logs/index.js');


let openServer = (data, callBack, res) => {
    return new Promise(async (resolve, reject) => {
        let commitArr = [{
            message: `项目【${data.title}】服务正在配置中，请稍后...`
        }, {
            message: `正在配置【${data.title}】项目服务路由模式...`
        }];

        let app = express();
        
        // 设置路由模式
        if (data.router === 'history') {
            app.use(history());
            commitArr.push({
                message: `项目【${data.title}】服务路由已配置成history模式`
            })
        } else {
            commitArr.push({
                message: `项目【${data.title}】服务路由已配置成hash模式`
            })
        }

        // 是否开启gzip压缩
        if (data.gzip) {
            app.use(compression());
        }

        // 配置代理
        if (data.proxy && data.proxy.length) {
            commitArr.push({
                message: `正在配置【${data.title}】服务配置代理...`
            })
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
                        message: '代理【' + item.rewrite + '】->【' + item.target + '】配置成功！',
                    })
                }
            });

            await logger.setlog({
                log: commitArr,
                bid: data.commitBid
            }, true, res)
        }

        // 配置静态资源文件夹
        app.use(express.static(path.join(__dirname, '../../www/' + data.www)));

        // 开启服务
        await logger.setlog({
            log: {
                message: '正在配置（' + data.port + '）端口服务，请稍后...',
            },
            bid: data.commitBid
        }, true, res)

        let server = app.listen(data.port);
        let message = null
        server.on('error', async (error) => {
            global.appServer[data.bid] = server;
            if (error.code === 'EADDRINUSE') {
                message = `项目【${data.title}】服务（${data.port}）端口早已启动！`
                await logger.setlog({
                    log: [{
                        message
                    }, {
                        message: error
                    }],
                    bid: data.commitBid
                }, true, res)
                if (callBack) callBack(true)
                resolve(true, message)
            } else {
                message = `项目【${data.title}】服务（${data.port}）端口启动失败！`
                await logger.setlog({
                    log: [{
                        message
                    }, {
                        message: error
                    }],
                    deployState: { state: 2 },
                    bid: data.commitBid
                }, true, res)
                if (callBack) callBack(false)
                reject(false, message)
            }
        });
        server.on('listening', async () => {
            global.appServer[data.bid] = server;
            let message = `项目${data.title}服务（${data.port}）端口启动成功！`
            logger.setlog({
                log: {
                    message
                },
                bid: data.commitBid
            }, true, res)
            if (callBack) callBack(true)
            resolve(true, message)
        });
    });
};

let closeServer = (data, callBack, res) => {
    return new Promise(async (resolve, reject) => {
        if (global.appServer[data.bid]) {
            global.appServer[data.bid].close();
            let message = `项目【${data.title}】服务（${data.port}）关闭成功！`
            await logger.setlog({
                log: {
                    message
                },
                bid: data.commitBid
            }, true, res)
            if (callBack) callBack(true, message)
            resolve(true, message)
        } else {
            killPort(data.port, 'tcp')
                .then(async () => {
                    let message = `项目【${data.title}】服务（${data.port}）端口关闭成功！`

                    await logger.setlog({
                        log: {
                            message
                        },
                        bid: data.commitBid
                    }, true, res)

                    if (callBack) callBack(true, message)
                    resolve(true, message)
                    // if (isRes) res.json({ message, result: true, code: 200 });
                })
                .catch(async error => {
                    let message = `项目【${data.title}】服务（${data.port}）端口关闭失败！`
                    await logger.setlog({
                        log: [{
                            message
                        }, {
                            message: error
                        }],
                        deployState: { state: 2 },
                        bid: data.commitBid
                    }, true, res)
                    // if (res) res.json({ message, code: 500 });
                    if (callBack) callBack(false, message)
                    reject(false, message)
                });
        }
    });
}

// let portIsOccupied = (data, callBack, res) => {
//     return new Promise(async (resolve, reject) => {
//         // 创建服务并监听该端口
//         try {
//             let server = net.createServer().listen(data.port);
//             server.on('listening', async () => { // 执行这块代码说明端口未被占用
//                 server.close() // 关闭服务
//                 let message = `此服务端口（${data.port}）未被占用！`

//                 await logger.setlog({
//                     log: { message },
//                     bid: data.commitBid
//                 }, true, res)
//                 if (callBack) callBack(true, message)
//                 resolve(true, message)
//             });

//             server.on('error', async (err) => {
//                 if (err.code === 'EADDRINUSE') { // 端口已经被使用
//                     let message = `此服务端口（${data.port}）已被占用，请更换其他端口！`
//                     await logger.setlog({
//                         log: [{
//                             message
//                         }, {
//                             message: err
//                         }],
//                         deployState: { state: 2 },
//                     }, true, res)
//                     if (callBack) callBack(false, message)
//                     reject(false, message)
//                 } else {
//                     let message = `此服务端口开启发生错误，开启失败！`
//                     await logger.setlog({
//                         log: [{
//                             message
//                         }, {
//                             message: err
//                         }],
//                         deployState: { state: 2 },
//                     }, true, res)
//                     if (res) res.json({ message, code: 500 });
//                 }
//             });

//         } catch (err) {
//             if (err.code === 'ERR_SOCKET_BAD_PORT') {
//                 let message = `服务端口【${data.port}】设置有误，应大于等于0且小于65536！`
//                 await logger.setlog({
//                     log: [{
//                         message
//                     }, {
//                         message: err
//                     }],
//                     deployState: { state: 2 },
//                 }, true, res)
//                 // if (callBack) callBack(false, message)
//                 // reject(false, message)
//                 if (res) res.json({ message, code: 500 });
//             } else {
//                 let message = `服务端口【${data.port}】异常，请检查后重试！`
//                 await logger.setlog({
//                     log: [{
//                         message
//                     }, {
//                         message: err
//                     }],
//                     deployState: { state: 2 },
//                 }, true, res)
//                 // if (callBack) callBack(false, message)
//                 // reject(false, message)
//                 if (res) res.json({ message, code: 500 });
//             }
//         }
//     })
// }


// 随机端口
function portInUse(port) {
    return new Promise((resolve, reject) => {
        let server = net.createServer().listen(port);
        server.on('listening', function () {
            server.close();
            resolve(port);
        });
        server.on('error', function (err) {
            if (err.code == 'EADDRINUSE') {
                resolve(err);
            }
        });
    });
}

const tryUsePort = async function (port, portAvailableCallback) {
    let res = await portInUse(port);
    if (res instanceof Error) {
        console.log(`端口：${port}被占用`);
        port++;
        tryUsePort(port, portAvailableCallback);
    } else {
        portAvailableCallback(port);
    }
}


// // 测试 
// let port=8022;
// tryUsePort(port ,function(port){
//     // do something ...
//     console.log(`端口：${port}可用\n`);
//     // net.createServer().listen(port);
// });



module.exports = { openServer, closeServer, tryUsePort, portInUse }