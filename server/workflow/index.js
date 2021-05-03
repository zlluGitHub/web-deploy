const tools = require("../public/javascripts/tools");
const command = require('../command/index.js');
const fs = require('fs');
const path = require('path');
const backupsPath = '../../backups'
const wwwPath = '../../www'
const shell = require('shelljs');
const logger = require('../logs/index.js');
module.exports = {
    // 部署项目
    initProject: (body, res) => {
        return new Promise(async (resolve, reject) => {
            let startIndex = body.git.lastIndexOf('/');
            let endIndex = body.git.lastIndexOf('.');
            let projectName = body.git.slice(startIndex + 1, endIndex);
            body.projectName = projectName

            // 判断部署项目是否存在，粗在则删除
            if (await fs.existsSync(path.join(__dirname, `${backupsPath}/${body.www}/${projectName}`))) {
                // 删除项目文件 
                await command.deleteProject(body, res)
            }
            //从 git 仓库中拉取项目 
            await command.cloneProject(body, res)

            //安装项目依赖 
            await command.initPackage(body, res)

            //项目打包 
            await command.buildProject(body, res)

            let wwwDir = path.join(__dirname, `${wwwPath}/${body.www}`)

            // 判断部署目录是否存在，存在则删除
            if (await fs.existsSync(wwwDir)) {
                await command.deleteRoot(body, res)
            }

            // 创建根目录
            await logger.setlog({
                log: {
                    message: `开始创建部署根目录${body.www}文件夹`
                },
                bid: body.commitBid
            }, true, res)

            await fs.mkdirSync(wwwDir)

            await logger.setlog({
                log: {
                    message: `部署根目录文件夹${body.www}创建成功！`
                },
                bid: body.commitBid
            }, true, res)

            await command.mvProject(body, res)
            await command.mvToBackups(body, res)

            // 备份package.json文件
            if (await fs.existsSync(path.join(__dirname, `${backupsPath}/${body.www}/package.json`))) {
                // 删除package.json文件 
                await command.deletePackage(body, res)
            }
            await command.copyPackage(body, res)

            resolve()
        });
    },


    // 重新安装依赖
    initRely: (body, res) => {
        return new Promise(async (resolve, reject) => {
            let startIndex = body.git.lastIndexOf('/');
            let endIndex = body.git.lastIndexOf('.');
            let projectName = body.git.slice(startIndex + 1, endIndex);
            body.projectName = projectName

            // 判断部署项目是否存在，存在删除
            if (await fs.existsSync(path.join(__dirname, `${backupsPath}/${body.www}/${projectName}/node_modules`))) {
                // 删除项目文件 
                await command.deleteNodeModule(body, res)
            }

            //安装项目依赖 
            await command.initPackage(body, res)

            //项目打包 
            await command.buildProject(body, res)

            let wwwDir = path.join(__dirname, `${wwwPath}/${body.www}`)

            // 判断部署目录是否存在，存在则删除
            if (await fs.existsSync(wwwDir)) {
                await command.deleteRoot(body, res)
            }

            // 创建根目录
            await logger.setlog({
                log: {
                    message: `开始创建部署根目录${body.www}文件夹`
                },
                bid: body.commitBid
            }, true, res)
            await fs.mkdirSync(wwwDir)

            await logger.setlog({
                log: {
                    message: `部署根目录文件夹${body.www}创建成功！`
                },
                bid: body.commitBid
            }, true, res)

            await command.mvProject(body, res)
            await command.mvToBackups(body, res)

            resolve()
        });
    },
    // 重新打包文件
    initBuild: (body, res) => {
        return new Promise(async (resolve, reject) => {
            let startIndex = body.git.lastIndexOf('/');
            let endIndex = body.git.lastIndexOf('.');
            let projectName = body.git.slice(startIndex + 1, endIndex);
            body.projectName = projectName

            //项目打包 
            await command.buildProject(body, res)

            let wwwDir = path.join(__dirname, `${wwwPath}/${body.www}`)

            // 判断部署目录是否存在，存在则删除
            if (await fs.existsSync(wwwDir)) {
                await command.deleteRoot(body, res)
            }

            // 创建根目录
            await logger.setlog({
                log: {
                    message: `开始创建部署根目录${body.www}文件夹`
                },
                bid: body.commitBid
            }, true, res)
            await fs.mkdirSync(wwwDir)

            await logger.setlog({
                log: {
                    message: `部署根目录文件夹${body.www}创建成功！`
                },
                bid: body.commitBid
            }, true, res)

            await command.mvProject(body, res)
            await command.mvToBackups(body, res)

            resolve()
        });
    },




    // 部署指定版本
    initCommitReset: async (body, res) => {
        return new Promise(async (resolve, reject) => {

            let wwwDir = path.join(__dirname, `${wwwPath}/${body.www}`)

            // 判断部署目录是否存在，存在则删除
            if (await fs.existsSync(wwwDir)) {
                await command.deleteRoot(body, res)
            }

            // 创建根目录
            await logger.setlog({
                log: {
                    message: `开始创建部署根目录${body.www}文件夹`
                },
                bid: body.commitBid
            }, true, res)
            await fs.mkdirSync(wwwDir)

            await logger.setlog({
                log: {
                    message: `部署根目录文件夹${body.www}创建成功！`
                },
                bid: body.commitBid
            }, true, res)

            await command.mvReductionWww(body, res)
            resolve()
        });


        // //拉取指定版本文件
        // if (body.hookPayload && body.hookPayload.isExit) {
        //     await command.gitReset(body.bid, projectName, body.commitBid, body.hookPayload.commitId, res)
        // }

        // // 判断依赖是否存在，存在则删除
        // if (await fs.existsSync(path.join(__dirname, `../../backups/${projectName}/node_modules`))) {
        //     await command.deleteNodeModule(body.bid, projectName, body.commitBid, res)
        // }

        // //安装项目依赖
        // await command.initPackage(body.bid, projectName, body.install, body.commitBid, res)

        // //项目打包
        // await command.buildProject(body.bid, projectName, body.build, body.commitBid, res)

        // let wwwDir = path.join(__dirname, `../../www/${body.www}`)
        // // 判断部署目录是否存在，存在则删除
        // if (await fs.existsSync(wwwDir)) {
        //     await command.deleteRoot(body.bid, body.title, body.www, body.commitBid, res)
        // }

        // await fs.mkdirSync(wwwDir)
        // await logger.updateCommit({
        //     type: 'deploy',
        //     message: body.title + '项目部署根目录已重建成功！'
        // }, body.commitBid).catch(err => {
        //     // res.json({ message: err, data: null, code: 500 });
        //     // logger.exitProcess()
        // })

        // await command.mvProject(body.bid, body.dist, body.www, projectName, body.commitBid, res)
    },

    // webhook工作流部分
    initWebhook: async (body, res) => {
        return new Promise(async (resolve, reject) => {
            let startIndex = body.git.lastIndexOf('/');
            let endIndex = body.git.lastIndexOf('.');
            let projectName = body.git.slice(startIndex + 1, endIndex);
            body.projectName = projectName

            //同步文件
            await command.gitPull(body, res)


            let path1 = path.join(__dirname, `${backupsPath}/${body.www}/package.json`)
            let path2 = path.join(__dirname, `${backupsPath}/${body.www}/${projectName}/package.json`)
            if (await fs.existsSync(path1) && await fs.existsSync(path2) && (await fs.readFileSync(path1, "utf-8") === await fs.readFileSync(path2, "utf-8"))) {

                await logger.setlog({
                    log: {
                        message: '检测配置文件未发生改变，正在打包中...'
                    },
                    bid: body.commitBid
                }, true, res)
            } else {
                await logger.setlog({
                    log: {
                        message: '检测配置文件是已改变，正在准备更新项目...'
                    },
                    bid: body.commitBid
                }, true, res)
                // 删除package.json文件 
                await command.deletePackage(body, res)
                // 更新package.json文件 
                await command.copyPackage(body, res)

                // 删除项目文件 
                await command.deleteNodeModule(body, res)
                //安装项目依赖
                await command.initPackage(body, res)
            }

            //项目打包
            await command.buildProject(body, res)

            let wwwDir = path.join(__dirname, `${wwwPath}/${body.www}`)

            // 判断部署目录是否存在，存在则删除
            if (await fs.existsSync(wwwDir)) {
                await command.deleteRoot(body, res)
            }

            await fs.mkdirSync(wwwDir)

            await logger.setlog({
                log: {
                    message: `部署根目录文件夹${body.www}创建成功！`
                },
                bid: body.commitBid
            }, true, res)

            await command.mvProject(body, res)
            await command.mvToBackups(body, res)
            resolve()
        });
    }


}


