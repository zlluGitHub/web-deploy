const tools = require("../public/javascripts/tools");
const command = require('../command/index.js');
const fs = require('fs');
const path = require('path');
const logger = require('../logs/index.js');
module.exports = {
    // 部署项目
    initProject: async (body, res) => {
        let startIndex = body.git.lastIndexOf('/');
        let endIndex = body.git.lastIndexOf('.');
        let projectName = body.git.slice(startIndex + 1, endIndex);
        console.log('wewewe');
        // 判断部署项目是否存在，粗在则删除
        if (await fs.existsSync(path.join(__dirname, `../../backups/${projectName}`))) {
            await command.deleteProject(projectName, body.commitBid, res)
        }
        //从 git 仓库中拉取项目
        await command.cloneProject(body.git, body.branch, body.commitBid, res)

        //安装项目依赖
        await command.initPackage(projectName, body.install, body.commitBid, res)

        //项目打包
        await command.buildProject(projectName, body.build, body.commitBid, res)

        let wwwDir = path.join(__dirname, `../../www/${body.www}`)
        // 判断部署目录是否存在，存在则删除
        if (await fs.existsSync(wwwDir)) {
            await command.deleteRoot(body.title, body.www, body.commitBid, res)
        }

        await fs.mkdirSync(wwwDir)
        await logger.updateCommit({
            type: 'deploy',
            message: body.title + '项目部署根目录已重建成功！'
        }, body.commitBid).catch(err => {
            // res.json({ message: err, data: null, code: 500 });
            // logger.exitProcess()
        })

        await command.mvProject(body.dist, body.www, projectName, body.commitBid, res)
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


