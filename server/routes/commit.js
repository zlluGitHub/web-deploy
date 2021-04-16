// const express = require('express');
// const fs = require('fs');
// const router = express.Router();
// const shell = require('shelljs');
// // const path = require('path');
// const tools = require("../public/javascripts/tools");
// const workflow = require('../workflow');
// const deploySchema = require("../schema/deploy");
// const logger = require('../logs/index.js');
// const server = require('../servePort');
// // const socket = require('../websocket/index.js');
// // const socketServer = require('../websocket/index.js');


// router.post('/openSocket', (req, res, next) => {
//     server.portIsOccupied(8001, '', async state => {
//         if (!state) {
//             global.connect.server.close()
//         }
//         global.connect.server = await global.ws.createServer(async conn => {
//             console.log("New connection")
//             global.connect.conn = conn
//             console.log(conn)
//             await conn.on('connect', (code) => {
//                 console.log('开启连接', code)
//                 conn.sendText("已连接到应用服务器，正在部署...")
//             })
//             await conn.on("close", (code, reason) => {
//                 console.log("Connection closed")
//                 conn.sendText("Socket 服务已断开！")
//             })
//             await conn.on("error", (code, reason) => {
//                 console.log("Connection error")
//                 conn.sendText("Socket 服务错 误！")
//             })
//         }).listen(8001)
//         res.json({ message: "Socket 服务已开启！", result: true, code: 200 });
//     })
// });


// // socket(conn => {

// // 获取项目
// router.get('/get', async (req, res, next) => {
//     let { pageSize, pageNo, bid, title } = req.query;

//     pageSize = pageSize ? pageSize * 1 : 10;
//     pageNo = pageNo ? pageNo * 1 - 1 : 0;
//     let filter = {};

//     if (bid) {
//         filter.bid = bid;
//     };
//     if (title) {
//         filter.title = { $regex: new RegExp(`${regExp}`, 'gi') };
//     };

//     let p1 = new Promise((resolve, reject) => {
//         deploySchema.find(filter, { _id: 0, __v: 0 }, (err, data) => {
//             if (err) {
//                 reject(err)
//             } else {
//                 resolve(data)
//             }
//         }).skip(pageNo * pageSize).limit(pageSize)
//     })

//     let p2 = new Promise((resolve, reject) => {
//         deploySchema.find().count(function (err, count) {
//             if (err) {
//                 reject(err)
//             } else {
//                 resolve(count)
//             }
//         })
//     })

//     Promise.all([p1, p2]).then((result) => {
//         res.json({ data: result[0], count: result[1], code: 200, result: true });
//     }).catch((error) => {
//         console.log(error)
//         res.json({ result: false, code: 500 });
//     })
// });

// //项目部署
// router.post('/init', async (req, res, next) => {
//     let body = req.body;

//     // let body = {
//     //     title: "asdsd",
//     //     proxy: [{
//     //         rewrite: "text",
//     //         target: "/jjjjj",
//     //     }],
//     //     dist: "dist",
//     //     remark: 'remark',
//     //     git: 'https://gitee.com/zlluGitHub/test-project.git', //git 地址
//     //     www: 'root',
//     //     port: 8899,
//     //     branch: "master", //git 分支
//     //     build: "npm run build", //部署命令
//     // }
//     body.time = tools.dateTime();
//     body.bid = tools.getUid();

//     if (!shell.which('git')) {
//         // shell.echo('Sorry, this script requires git');
//         res.json({ message: "Git 命令不存在，请安装后再试！", result: false, code: 500 });
//         shell.exit(1);
//     } else {
//         let conn = global.connect.conn;
//         // console.log(global.connect);
//         // let socketServer = await socket(async (conn) => {
//         await workflow.initProject(body, res, conn)
//         await deploySchema.create(body, async (err, data) => {
//             if (err) {
//                 console.log('错误信息：', err);
//                 logger.error('信息入库错误：', err)
//                 await conn.sendText('信息入库错误：', err)
//                 global.connect.server.close()
//                 res.json({ message: body.title + "项目信息保存失败，但部署成功，请检查数据库是否连接！", result: false, code: 500 });
//             } else {
//                 // console.log(body.title + "项目部署成功！");
//                 await server.closeServer(body)
//                 await server.openServer(body, res, conn)
//             }
//         })
//         // })
//     }
// });

// //更新项目信息
// router.post('/updateInfo', async (req, res, next) => {
//     let body = req.body;

//     body.time = tools.dateTime();
//     body.bid = tools.getUid();

//     await deploySchema.updateMany({ bid: body.bid }, { $set: body }, async (err, data) => {
//         if (err) {
//             console.log('错误信息：', err);
//             res.json({ message: body.title + "项目信息更新失败！", result: false, code: 500 });
//         } else {
//             res.json({ message: body.title + "项目信息更新成功！", result: true, code: 200 });
//         };
//     });
// });
// //项目重新部署
// router.post('/reset', async (req, res, next) => {
//     let body = req.body;
//     body.time = tools.dateTime();
//     body.bid = tools.getUid();
//     if (!shell.which('git')) {
//         // shell.echo('Sorry, this script requires git');
//         res.json({ message: "Git 命令不存在，请安装后再试！", result: false, code: 500 });
//         shell.exit(1);
//     } else {
//         await workflow.initProject(body, res);
//         await deploySchema.updateMany({ bid: body.bid }, { $set: body }, async (err, data) => {
//             if (err) {
//                 console.log('错误信息：', err);
//                 res.json({ message: body.title + "项目信息更新失败，但部署成功，请检查数据库是否连接！", result: false, code: 500 });
//             } else {
//                 await server.openServer(body, res)
//             };
//         });
//     }
// });


// // //测试
// // router.get('/test', async (req, res, next) => {
// //     let result = path.join(__dirname, `../../wwws`);
// //     // await command.mvProject(projectName)
// //     if (fs.existsSync(result)) {
// //         console.log(1);
// //     }
// //     res.json({ data: result, result: true, code: 200 });
// // });

// //重新安装依赖文件
// router.post('/rely', async (req, res, next) => {
//     let body = req.body;
//     if (!shell.which('git')) {
//         // shell.echo('Sorry, this script requires git');
//         res.json({ message: "Git 命令不存在，请安装后再试！", result: false, code: 500 });
//         shell.exit(1);
//     } else {
//         await workflow.initRely(body, res);
//         // logger.info(body.title + "项目依赖已安装，项目更新部署成功！")
//         // res.json({ message: body.title + "项目依赖已安装，项目更新部署成功！", result: true, code: 200 });
//         await server.openServer(body, res)
//     }
// });

// //重新打包文件
// router.post('/build', async (req, res, next) => {
//     let body = req.body;
//     if (!shell.which('git')) {
//         // shell.echo('Sorry, this script requires git');
//         res.json({ message: "Git 命令不存在，请安装后再试！", result: false, code: 500 });
//         shell.exit(1);
//     } else {
//         await workflow.initBuild(body, res);
//         // logger.info(body.title + "已打包完成，项目更新部署成功！")
//         // res.json({ message: body.title + "已打包完成，项目更新部署成功！", result: true, code: 200 });
//         await server.openServer(body, res)
//     }
// });

// //关闭服务端口
// router.post('/closeServer', async (req, res, next) => {
//     let body = req.body;
//     if (!shell.which('git')) {
//         // shell.echo('Sorry, this script requires git');
//         res.json({ message: "Git 命令不存在，请安装后再试！", result: false, code: 500 });
//         shell.exit(1);
//     } else {
//         await server.closeServer(body, res)

//     }
// });
// //检测端口是否被占用
// router.post('/portIsOccupied', async (req, res, next) => {
//     let body = req.body;
//     if (!shell.which('git')) {
//         // shell.echo('Sorry, this script requires git');
//         res.json({ message: "Git 命令不存在，请安装后再试！", result: false, code: 500 });
//         shell.exit(1);
//     } else {
//         await server.portIsOccupied(body.port, res)
//     }
// });

// //开启服务端口
// router.post('/openServer', async (req, res, next) => {
//     let body = req.body;
//     if (!shell.which('git')) {
//         // shell.echo('Sorry, this script requires git');
//         res.json({ message: "Git 命令不存在，请安装后再试！", result: false, code: 500 });
//         shell.exit(1);
//     } else {
//         await server.openServer(body, res)

//     }
// });
// // })
// module.exports = router;