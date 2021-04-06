const express = require('express');
const fs = require('fs');
const router = express.Router();
const shell = require('shelljs');
const path = require('path');
const tools = require("../public/javascripts/tools");
const workflow = require('../workflow');
const deploySchema = require("../schema/deploy");

//项目部署
router.get('/init', async (req, res, next) => {
    // let body = req.body;
    let body = {
        title: "asdsd",
        proxy: [{
            rewrite: "text",
            target: "/jjjjj",
        }],
        dist: "dist",
        remark: 'remark',
        git: 'https://gitee.com/zlluGitHub/test-project.git', //git 地址
        www: 'root',
        port: 8899,
        branch: "master", //git 分支
        build: "npm run build", //部署命令
    }
    body.time = tools.dateTime();
    body.bid = tools.getUid();

    if (!shell.which('git')) {
        // shell.echo('Sorry, this script requires git');
        res.json({ message: "Git 命令不存在，请安装后再试！", result: false, code: 500 });
        shell.exit(1);
    } else {

        await workflow.initProject(body, res)
        await deploySchema.create(body, (err, data) => {
            if (err) {
                console.log('错误信息：', err);
                res.json({ message: body.title + "项目信息保存失败，但部署成功，请检查数据库是否连接！", result: false, code: 500 });
            } else {
                console.log('项目部署成功！');
                res.json({ message: body.title + "项目部署成功！", result: true, code: 200 });
            }
        })
    }
});

//测试
router.get('/test', async (req, res, next) => {
    let result = path.join(__dirname, `../../wwws`);
    // await command.mvProject(projectName)
    if (fs.existsSync(result)) {
        console.log(1);
    }
    res.json({ data: result, result: true, code: 200 });
});

//重新安装依赖文件
router.post('/rely', async (req, res, next) => {
    let body = req.body;
    body.time = tools.dateTime();
    body.bid = tools.getUid();

    let git = 'https://gitee.com/zlluGitHub/test-project.git';
    let projectName = git.slice(git.lastIndexOf('/') + 1, git.lastIndexOf('.'));
    await command.deleteProject(`${projectName}/node_modules`)
    await command.initProject(projectName)
    await command.buildProject(projectName)
    res.json({ message: projectName + "项目部署成功！", result: true, code: 200 });
});

//重新打包文件
router.post('/build', async (req, res, next) => {
    let body = req.body;
    body.time = tools.dateTime();
    body.bid = tools.getUid();

    let git = 'https://gitee.com/zlluGitHub/test-project.git';
    let projectName = git.slice(git.lastIndexOf('/') + 1, git.lastIndexOf('.'));
    await command.buildProject(projectName)
    res.json({ message: projectName + "项目部署成功！", result: true, code: 200 });
});


module.exports = router;