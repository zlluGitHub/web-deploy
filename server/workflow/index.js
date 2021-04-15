const tools = require("../public/javascripts/tools");
const command = require('../command/index.js');
const fs = require('fs');
const path = require('path');
const logger = require('../logs/index.js');
module.exports = {
    // 部署项目
    initProject: async (body, res, conn, commitBid) => {
        let startIndex = body.git.lastIndexOf('/');
        let endIndex = body.git.lastIndexOf('.');
        let projectName = body.git.slice(startIndex + 1, endIndex);

        if (await fs.existsSync(path.join(__dirname, `../../backups/${projectName}`))) {
            if (!await command.deleteProject(projectName, conn, commitBid)) {
                let message = projectName + "项目移除失败！"
                conn.sendText(message)
                conn.sendText(`${body.title}项目构建失败！`);
                res.json({ message, result: false, code: 500 });
                await logger.updateCommit([
                    {
                        type: 'clone',
                        state: false,
                        message
                    },
                    {
                        type: 'deploy',
                        state: false,
                        message: `${body.title}项目构建失败！`
                    }
                ], commitBid, 'exit')
               
            }
        }
        if (!await command.cloneProject(body.git, body.branch, conn, commitBid)) {
            let message = projectName + "项目拉取失败！"
            conn.sendText(message)
            conn.sendText(`${body.title}项目构建失败！`);
            res.json({ message, result: false, code: 500 });
            await logger.updateCommit([{
                type: 'clone',
                state: false,
                message
            },
            {
                type: 'deploy',
                state: false,
                message: `${body.title}项目构建失败！`
            }], commitBid, 'exit')
           
        }

        if (!await command.initPackage(projectName, body.install, conn, commitBid)) {
            let message = projectName + "项目初始化失败！"
            conn.sendText(message)
            conn.sendText(`${body.title}项目构建失败！`);
            res.json({ message, result: false, code: 500 });
            await logger.updateCommit([
                {
                    type: 'install',
                    state: false,
                    message
                }, {
                    type: 'deploy',
                    state: false,
                    message: `${body.title}项目构建失败！`
                }
            ], commitBid, 'exit')
           
        }
        if (!await command.buildProject(projectName, body.build, conn, commitBid)) {
            let message = projectName + "项目打包失败！"
            conn.sendText(message)
            conn.sendText(`${body.title}项目构建失败！`);
            res.json({ message, result: false, code: 500 });

            await logger.updateCommit([{
                type: 'build',
                state: false,
                message
            }, {
                type: 'deploy',
                state: false,
                message: `${body.title}项目构建失败！`
            }], commitBid, 'exit')
           
        }
        let wwwDir = path.join(__dirname, `../../www/${body.www}`)
        if (await fs.existsSync(wwwDir)) {
            if (!await command.deleteRoot(body.www, conn, commitBid)) {
                let message = projectName + "项目部署文件移除失败！"
                conn.sendText(message)
                conn.sendText(`${body.title}项目构建失败！`);
                res.json({ message, result: false, code: 500 });
                await logger.updateCommit([{
                    type: 'deploy',
                    state: false,
                    message
                }, {
                    type: 'deploy',
                    state: false,
                    message: `${body.title}项目构建失败！`
                }], commitBid, 'exit')
            
            }
        }
        if (!await fs.mkdirSync(wwwDir)) {
            if (!await command.mvProject(body.dist, body.www, projectName, conn, commitBid)) {
                let message = projectName + "项目打包文件转移失败！"
                conn.sendText(message)
                conn.sendText(`${body.title}项目构建失败！`);
                res.json({ message, result: false, code: 500 });
                await logger.updateCommit([{
                    type: 'deploy',
                    state: false,
                    message
                }, {
                    type: 'deploy',
                    state: false,
                    message: `${body.title}项目构建失败！`
                }], commitBid, 'exit')
             
            }
        } else {
            let message = projectName + "项目部署文件夹创建失败！"
            conn.sendText(message)
            conn.sendText(`${body.title}项目构建失败！`);
            res.json({ message, result: false, code: 500 });
            await logger.updateCommit([{
                type: 'deploy',
                state: false,
                message
            }, {
                type: 'deploy',
                state: false,
                message: `${body.title}项目构建失败！`
            }], commitBid, 'exit')
        }
    },



    // 重新安装依赖
    initRely: async (body, res, conn) => {
        let startIndex = body.git.lastIndexOf('/');
        let endIndex = body.git.lastIndexOf('.');
        let projectName = body.git.slice(startIndex + 1, endIndex);

        if (await fs.existsSync(path.join(__dirname, `../../backups/${projectName}/node_modules`))) {
            if (!await command.deleteNodeModule(projectName, conn)) {
                conn.sendText(projectName + "项目依赖包移除失败！")
                res.json({ message: projectName + "项目依赖包移除失败！", result: false, code: 500 });
                tools.exitProcess(0);
            }
        }

        if (!await command.initPackage(projectName, body.install, conn)) {
            conn.sendText(projectName + "项目初始化失败！")
            res.json({ message: projectName + "项目初始化失败！", result: false, code: 500 });
            tools.exitProcess(0);
        }
        if (!await command.buildProject(projectName, body.build, conn)) {
            conn.sendText(projectName + "项目打包失败！")
            res.json({ message: projectName + "项目打包失败！", result: false, code: 500 });
            tools.exitProcess(0);
        }
        let wwwDir = path.join(__dirname, `../../www/${body.www}`)
        if (await fs.existsSync(wwwDir)) {
            if (!await command.deleteRoot(body.www, conn)) {
                conn.sendText(projectName + "项目部署文件移除失败！")
                res.json({ message: projectName + "项目部署文件移除失败！", result: false, code: 500 });
                tools.exitProcess(0);
            }
        }
        if (!await fs.mkdirSync(wwwDir)) {
            if (!await command.mvProject(body.dist, body.www, projectName, conn)) {
                conn.sendText(projectName + "项目打包文件转移失败！")
                res.json({ message: projectName + "项目打包文件转移失败！", result: false, code: 500 });
                tools.exitProcess(0);
            }
        } else {
            conn.sendText(projectName + "项目部署文件夹创建失败！")
            res.json({ message: projectName + "项目部署文件夹创建失败！", result: false, code: 500 });
            tools.exitProcess(0);
        }
    },
    // 重新打包文件
    initBuild: async (body, res, conn) => {
        let startIndex = body.git.lastIndexOf('/');
        let endIndex = body.git.lastIndexOf('.');
        let projectName = body.git.slice(startIndex + 1, endIndex);

        let wwwDir = path.join(__dirname, `../../www/${body.www}`)
        if (await fs.existsSync(wwwDir)) {
            if (!await command.deleteRoot(body.www, conn)) {
                conn.sendText(projectName + "项目部署文件移除失败！")
                res.json({ message: projectName + "项目部署文件移除失败！", result: false, code: 500 });
                tools.exitProcess(0);
            }
        }
        if (!await fs.mkdirSync(wwwDir)) {
            if (!await command.mvProject(body.dist, body.www, projectName, conn)) {
                conn.sendText(projectName + "项目打包文件转移失败！")
                res.json({ message: projectName + "项目打包文件转移失败！", result: false, code: 500 });
                tools.exitProcess(0);
            }
        } else {
            conn.sendText(projectName + "项目部署文件夹创建失败！")
            res.json({ message: projectName + "项目部署文件夹创建失败！", result: false, code: 500 });
            tools.exitProcess(0);
        }
    }
}


