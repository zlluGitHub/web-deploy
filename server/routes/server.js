
const express = require('express');
const proxy = require("http-proxy-middleware");
const history = require('connect-history-api-fallback');
const net = require('net');
const killPort = require('kill-port');
const logger = require('../logs/index.js');

let appServer = {}; //存放服务实例
module.exports = {
    openServer: (data, res) => {
        //开启端口回调 
        let app = express();
        app.use(history());
        // 跨域代理
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
            }
        });
        app.use(express.static(path.join(__dirname, '../../www/' + data.www)));

        let server = app.listen(data.port);
        server.on('error', (error) => {
            let message = `${data.title}服务（${data.port}）启动失败！`
            logger.error(message);
            logger.error(error);
            res.json({ message, result: false, code: 500 });
        });
        server.on('listening', () => {
            let message = `${data.title}服务（${data.port}）启动成功！`
            appServer[data.bid] = server;
            logger.info(message);
            res.json({ message, result: true, code: 200 });
        });
    },
    closeServer: (data, res) => {
        appServer[data.bid].close();
        killPort(port, 'tcp')
            .then(() => {
                let message = `${data.title}服务（${data.port}）关闭成功！`
                logger.info(message);
                res.json({ message, result: true, code: 200 });
            })
            .catch(error => {
                let message = `${data.title}服务（${data.port}）关闭失败！`
                logger.error(message);
                logger.error(error);
                res.json({ message, result: false, code: 500 });
            });
    },
    portIsOccupied: (port, res) => {
        // 创建服务并监听该端口
        let server = net.createServer().listen(port);
        server.on('listening', function () { // 执行这块代码说明端口未被占用
            server.close() // 关闭服务
            // console.log('The port【' + port + '】 is available.') // 控制台输出信息
            logger.info('The port【' + port + '】 is available.');
            res.json({ message: "此服务端口未被占用！", result: true, code: 200 });
        });

        server.on('error', function (err) {
            if (err.code === 'EADDRINUSE') { // 端口已经被使用
                logger.info('The port【' + port + '】 is occupied, please change other port.')
                res.json({ message: "此服务端口已经被使用！", result: false, code: 200 });
            };
        });
    }

};