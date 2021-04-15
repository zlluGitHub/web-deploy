
const express = require('express');
const proxy = require("http-proxy-middleware");
const history = require('connect-history-api-fallback');
const net = require('net');
const killPort = require('kill-port');
const path = require('path');
const logger = require('../logs/index.js');

module.exports = {
    openServer: async (data, conn, commitBid, callBack) => {
        // let message = `${data.title}服务端口（${data.port}）启动中...`
        // await logger.updateCommit({
        //     type: 'deploy',
        //     state: false,
        //     message
        // }, commitBid)
        // await conn.sendText(message)
        //开启端口回调 

        let app = express();
        app.use(history());

        // 跨域代理
        message = `${data.title}服务配置代理中...`
        let commitArr = [{
            type: 'deploy',
            state: false,
            message
        }]
        if (conn) await conn.sendText(message);

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
                    type: 'deploy',
                    state: false,
                    message: item.rewrite + '->' + item.target + '代理配置成功！'
                })
                if (conn) conn.sendText(item.rewrite + '->' + item.target + '代理配置成功！');
            }
        });
        await logger.updateCommit(commitArr, commitBid)

        app.use(express.static(path.join(__dirname, '../../www/' + data.www)));

        let server = app.listen(data.port);
        server.on('error', async (error) => {
            let message = `${data.title}服务（${data.port}）启动失败，请检查端口是否重复！`
            await logger.updateCommit([
                {
                    type: 'deploy',
                    state: false,
                    message
                },
                {
                    type: 'deploy',
                    state: false,
                    message: error
                }
            ], commitBid)
            if (conn) await conn.sendText(message)
            // await conn.sendText(error)
            await callBack(false, message)
            // if (isRes) res.json({ message, result: false, code: 500 });
        });
        server.on('listening', async () => {
            global.appServer[data.bid] = server;
            let message = `${data.title}服务（${data.port}）启动成功！`
            await logger.updateCommit({
                type: 'deploy',
                state: true,
                message
            }, commitBid)
            if (conn) await conn.sendText(message)
            await callBack(true, message)
            // if (isRes) res.json({ message, result: true, code: 200 });
        });

    },
    closeServer: async (data, callBack) => {
        if (global.appServer[data.bid]) {
            global.appServer[data.bid].close();
            await callBack(true, `${data.title}服务（${data.port}）关闭成功！`)
        } else {
            await killPort(data.port, 'tcp')
                .then(async () => {
                    let message = `${data.title}服务（${data.port}）关闭成功！`
                    await callBack(true, message)
                    // if (isRes) res.json({ message, result: true, code: 200 });
                })
                .catch(async error => {
                    let message = `${data.title}服务（${data.port}）关闭失败！`
                    console.log(message);
                    console.log(error);
                    await callBack(false, message)
                    // res.json({ message, result: false, code: 500 });
                });
        }
    },
    portIsOccupied: async (port, callBack) => {
        let result = null
        // 创建服务并监听该端口
        try {
            let server = net.createServer().listen(port);
            server.on('listening', async () => { // 执行这块代码说明端口未被占用
                server.close() // 关闭服务
                let message = `此服务端口【${port}】未被占用！`
                console.log(message);
                // if (res) res.json({ message, result: true, code: 200 });
                result = true
                if (callBack) await callBack(true, message)
            });

            server.on('error', async (err) => {
                // res.json({ message: err, result: false, code: 500 });
                // if (err.code === 'EADDRINUSE') { // 端口已经被使用
                let message = `此服务端口【${port}】已被占用，请更换其他端口！`
                console.log(message);
                // console.log(err);
                // if (res) res.json({ message, result: true, code: 500 });
                result = false
                if (callBack) await callBack(false, message)
                // };
            });

        } catch (err) {
            if (err.code === 'ERR_SOCKET_BAD_PORT') {
                let message = `服务端口【${port}】设置有误，应大于等于0且小于65536！`
                console.log(message);
                // console.log(err);
                // if (res) res.json({ message, result: true, code: 500 });
                if (callBack) await callBack(false, message)
            } else {
                let message = `服务端口【${port}】异常，请检查后重试！`
                console.log(message);
                // console.log(err);
                if (callBack) await callBack(false, message)
            }
            console.log(err);
            result = false
        }
        return result;
    }

};