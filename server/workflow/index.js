const tools = require("../public/javascripts/tools");
const command = require('../command');
const fs = require('fs');
const path = require('path');
module.exports = {
    // 部署项目
    initProject: async (body, res) => {
        let startIndex = body.git.lastIndexOf('/');
        let endIndex = body.git.lastIndexOf('.');
        let projectName = body.git.slice(startIndex + 1, endIndex);

        if (await fs.existsSync(path.join(__dirname, `../../backups/${projectName}`))) {
            if (!await command.deleteProject(projectName)) {
                res.json({ message: projectName + "项目移除失败！", result: false, code: 500 });
                tools.exitProcess(0);
            }
        }
        if (!await command.cloneProject(body.git, body.branch)) {
            res.json({ message: projectName + "项目拉取失败！", result: false, code: 500 });
            tools.exitProcess(0);
        }

        if (!await command.initPackage(projectName)) {
            res.json({ message: projectName + "项目初始化失败！", result: false, code: 500 });
            tools.exitProcess(0);
        }
        if (!await command.buildProject(projectName)) {
            res.json({ message: projectName + "项目打包失败！", result: false, code: 500 });
            tools.exitProcess(0);
        }
        let wwwDir = path.join(__dirname, `../../www/${body.www}`)
        if (await fs.existsSync(wwwDir)) {
            if (!await command.deleteRoot(body.www)) {
                res.json({ message: projectName + "项目部署文件移除失败！", result: false, code: 500 });
                tools.exitProcess(0);
            }
        }
        if (!await fs.mkdirSync(wwwDir)) {
            if (!await command.mvProject(body.dist, body.www, projectName)) {
                res.json({ message: projectName + "项目打包文件转移失败！", result: false, code: 500 });
                tools.exitProcess(0);
            }
        } else {
            res.json({ message: projectName + "项目部署文件夹创建失败！", result: false, code: 500 });
            tools.exitProcess(0);
        }
    },
    // 重新安装依赖
    initRely: async (body, res) => {
        let startIndex = body.git.lastIndexOf('/');
        let endIndex = body.git.lastIndexOf('.');
        let projectName = body.git.slice(startIndex + 1, endIndex);

        if (await fs.existsSync(path.join(__dirname, `../../backups/${projectName}/node_modules`))) {
            if (!await command.deleteNodeModule(projectName)) {
                res.json({ message: projectName + "项目依赖包移除失败！", result: false, code: 500 });
                tools.exitProcess(0);
            }
        }
        
        if (!await command.initPackage(projectName)) {
            res.json({ message: projectName + "项目初始化失败！", result: false, code: 500 });
            tools.exitProcess(0);
        }
        if (!await command.buildProject(projectName)) {
            res.json({ message: projectName + "项目打包失败！", result: false, code: 500 });
            tools.exitProcess(0);
        }
        let wwwDir = path.join(__dirname, `../../www/${body.www}`)
        if (await fs.existsSync(wwwDir)) {
            if (!await command.deleteRoot(body.www)) {
                res.json({ message: projectName + "项目部署文件移除失败！", result: false, code: 500 });
                tools.exitProcess(0);
            }
        }
        if (!await fs.mkdirSync(wwwDir)) {
            if (!await command.mvProject(body.dist, body.www, projectName)) {
                res.json({ message: projectName + "项目打包文件转移失败！", result: false, code: 500 });
                tools.exitProcess(0);
            }
        } else {
            res.json({ message: projectName + "项目部署文件夹创建失败！", result: false, code: 500 });
            tools.exitProcess(0);
        }
    },
     // 重新打包文件
     initBuild: async (body, res) => {
        let startIndex = body.git.lastIndexOf('/');
        let endIndex = body.git.lastIndexOf('.');
        let projectName = body.git.slice(startIndex + 1, endIndex);

        let wwwDir = path.join(__dirname, `../../www/${body.www}`)
        if (await fs.existsSync(wwwDir)) {
            if (!await command.deleteRoot(body.www)) {
                res.json({ message: projectName + "项目部署文件移除失败！", result: false, code: 500 });
                tools.exitProcess(0);
            }
        }
        if (!await fs.mkdirSync(wwwDir)) {
            if (!await command.mvProject(body.dist, body.www, projectName)) {
                res.json({ message: projectName + "项目打包文件转移失败！", result: false, code: 500 });
                tools.exitProcess(0);
            }
        } else {
            res.json({ message: projectName + "项目部署文件夹创建失败！", result: false, code: 500 });
            tools.exitProcess(0);
        }
    }
}


