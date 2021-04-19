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

        // 判断部署项目是否存在，粗在则删除
        if (await fs.existsSync(path.join(__dirname, `../../backups/${projectName}`))) {
            await command.deleteProject(body.bid, projectName, body.commitBid, res)
        }
        //从 git 仓库中拉取项目
        await command.cloneProject(body.bid, body.git, body.branch, body.commitBid, res)

        //安装项目依赖
        await command.initPackage(body.bid, projectName, body.install, body.commitBid, res)

        //项目打包
        await command.buildProject(body.bid, projectName, body.build, body.commitBid, res)

        let wwwDir = path.join(__dirname, `../../www/${body.www}`)
        // 判断部署目录是否存在，存在则删除
        if (await fs.existsSync(wwwDir)) {
            await command.deleteRoot(body.bid,  body.title, body.www, body.commitBid, res)
        }

        await fs.mkdirSync(wwwDir)
        await logger.updateCommit({
            type: 'deploy',
            message: body.title + '项目部署根目录已重建成功！'
        }, body.commitBid).catch(err => {
            // res.json({ message: err, data: null, code: 500 });
            // logger.exitProcess()
        })

        await command.mvProject(body.bid, body.dist, body.www, projectName, body.commitBid, res)
    },


    // 重新安装依赖
    initRely: async (body, res) => {
        let startIndex = body.git.lastIndexOf('/');
        let endIndex = body.git.lastIndexOf('.');
        let projectName = body.git.slice(startIndex + 1, endIndex);

        // 判断依赖是否存在，存在则删除
        if (await fs.existsSync(path.join(__dirname, `../../backups/${projectName}/node_modules`))) {
            await command.deleteNodeModule(body.bid, projectName, body.commitBid, res)
        }

        //安装项目依赖
        await command.initPackage(body.bid, projectName, body.install, body.commitBid, res)

        //项目打包
        await command.buildProject(body.bid, projectName, body.build, body.commitBid, res)

        let wwwDir = path.join(__dirname, `../../www/${body.www}`)
        // 判断部署目录是否存在，存在则删除
        if (await fs.existsSync(wwwDir)) {
            await command.deleteRoot(body.bid, body.title, body.www, body.commitBid, res)
        }

        await fs.mkdirSync(wwwDir)
        await logger.updateCommit({
            type: 'deploy',
            message: body.title + '项目部署根目录已重建成功！'
        }, body.commitBid).catch(err => {
            // res.json({ message: err, data: null, code: 500 });
            // logger.exitProcess()
        })

        await command.mvProject(body.bid, body.dist, body.www, projectName, body.commitBid, res)
    },
    // 重新打包文件
    initBuild: async (body, res) => {
        let startIndex = body.git.lastIndexOf('/');
        let endIndex = body.git.lastIndexOf('.');
        let projectName = body.git.slice(startIndex + 1, endIndex);

        //项目打包
        await command.buildProject(body.bid, projectName, body.build, body.commitBid, res)

        let wwwDir = path.join(__dirname, `../../www/${body.www}`)
        // 判断部署目录是否存在，存在则删除
        if (await fs.existsSync(wwwDir)) {
            await command.deleteRoot(body.bid, body.title, body.www, body.commitBid, res)
        }

        await fs.mkdirSync(wwwDir)
        await logger.updateCommit({
            type: 'deploy',
            message: body.title + '项目部署根目录已重建成功！'
        }, body.commitBid).catch(err => {
            // res.json({ message: err, data: null, code: 500 });
            // logger.exitProcess()
        })

        await command.mvProject(body.bid, body.dist, body.www, projectName, body.commitBid, res)
    },

    // 部署指定版本
    initReset: async (body, res) => {
        let startIndex = body.git.lastIndexOf('/');
        let endIndex = body.git.lastIndexOf('.');
        let projectName = body.git.slice(startIndex + 1, endIndex);

        //拉取指定版本文件
        if (body.hookPayload && body.hookPayload.isExit) {
            await command.gitReset(body.bid, projectName, body.commitBid, body.hookPayload.commitId, res)
        }

        // 判断依赖是否存在，存在则删除
        if (await fs.existsSync(path.join(__dirname, `../../backups/${projectName}/node_modules`))) {
            await command.deleteNodeModule(body.bid, projectName, body.commitBid, res)
        }

        //安装项目依赖
        await command.initPackage(body.bid, projectName, body.install, body.commitBid, res)

        //项目打包
        await command.buildProject(body.bid, projectName, body.build, body.commitBid, res)

        let wwwDir = path.join(__dirname, `../../www/${body.www}`)
        // 判断部署目录是否存在，存在则删除
        if (await fs.existsSync(wwwDir)) {
            await command.deleteRoot(body.bid, body.title, body.www, body.commitBid, res)
        }

        await fs.mkdirSync(wwwDir)
        await logger.updateCommit({
            type: 'deploy',
            message: body.title + '项目部署根目录已重建成功！'
        }, body.commitBid).catch(err => {
            // res.json({ message: err, data: null, code: 500 });
            // logger.exitProcess()
        })

        await command.mvProject(body.bid, body.dist, body.www, projectName, body.commitBid, res)
    },

    // webhook工作流部分
    initWebhook: async (body, res) => {
        let startIndex = body.git.lastIndexOf('/');
        let endIndex = body.git.lastIndexOf('.');
        let projectName = body.git.slice(startIndex + 1, endIndex);

        //同步文件
        await command.gitPull(body.bid, projectName, body.commitBid, res)

        //删除项目依赖
        await command.deleteNodeModule(body.bid, projectName, body.commitBid, res)

        //安装项目依赖
        await command.initPackage(body.bid, projectName, body.install, body.commitBid, res)

        //项目打包
        await command.buildProject(body.bid, projectName, body.build, body.commitBid, res)

        let wwwDir = path.join(__dirname, `../../www/${body.www}`)
        // 判断部署目录是否存在，存在则删除
        if (await fs.existsSync(wwwDir)) {
            await command.deleteRoot(body.bid, body.title, body.www, body.commitBid, res)
        }

        await fs.mkdirSync(wwwDir)
        await logger.updateCommit({
            type: 'deploy',
            message: body.title + '项目部署根目录已重建成功！'
        }, body.commitBid).catch(err => {
            // res.json({ message: err, data: null, code: 500 });
            // logger.exitProcess()
        })

        await command.mvProject(body.bid, body.dist, body.www, projectName, body.commitBid, res)
    }
}


