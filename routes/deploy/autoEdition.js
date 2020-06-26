
const express = require("express");
const router = express.Router();
const fs = require("fs");
const exec = require('child_process').exec;
// 文件存储
let url = './backups/';
// 克隆项目
router.post('/clone', function (req, res, next) {
    let body = req.body;
    let root = body.root
    let branch = body.branch
    let order = body.order
    let gitUrl = body.gitUrl
    if (root && branch && order && gitUrl) {
        let gitName = gitUrl.slice(gitUrl.lastIndexOf("/") + 1, gitUrl.lastIndexOf(".git"))
        function cloneProject() {
            exec(`cd ${url + root} && git clone -b ${branch} ${gitUrl}`, { encoding: 'utf8' }, (error, stdout, stderr) => {
                if (error) {
                    console.log('错误信息：', error);
                    return res.json({ result: false, code: 500, message: '仓库更新失败！', error: stderr });
                } else {
                    return res.json({ result: true, code: 200, message: '仓库拉取成功！' });
                }
            });
        }
        fs.mkdir(url + root, error => {
            if (error) {
                //判断文件夹是否存在
                fs.exists(url + root + '/' + gitName, (exists) => {
                    if (exists) {
                        // exec(`cd ${url + root} && rd /s /q ${gitName}`, { encoding: 'utf8' }, (error, stdout, stderr) => { // windows
                        exec(`cd ${url + root} && rm -rf ${gitName}`, { encoding: 'utf8' }, (error, stdout, stderr) => {
                            if (error) {
                                console.log('错误信息：', error);
                                return res.json({ result: false, code: 500, message: stderr });
                            } else {
                                cloneProject();
                            }
                        });
                    } else {
                        cloneProject()
                    }
                });
            } else {
                cloneProject()
            };
        });
    } else {
        return res.json({ result: false, code: 500, message: '参数错误！' });
    }
});
// 拉取项目
router.post('/pull', function (req, res, next) {
    let body = req.body;
    let root = body.root
    let branch = body.branch
    let gitUrl = body.gitUrl
    if (root && branch) {
        let gitName = gitUrl.slice(gitUrl.lastIndexOf("/") + 1, gitUrl.lastIndexOf(".git"))
        exec(`cd ${url + root}/${gitName} && git pull`, { encoding: 'utf8' }, (error, stdout, stderr) => {
            if (error) {
                console.log('错误信息：', error);
                return res.json({ result: false, code: 500, message: '项目pull失败！', error: stderr });
            } else {
                return res.json({ result: true, code: 200, message: "项目pull成功!" });
            }
        });
    } else {
        return res.json({ result: false, code: 500, message: '初始化项目参数错误！' });
    }
});

// 初始化项目 安装依赖
router.post('/init', function (req, res, next) {
    let body = req.body;
    let root = body.root
    let order = body.order
    let branch = body.branch
    let gitUrl = body.gitUrl
    if (root && branch) {
        let gitName = gitUrl.slice(gitUrl.lastIndexOf("/") + 1, gitUrl.lastIndexOf(".git"))
        let npm = order.indexOf('cnpm') > -1 ? 'cnpm' : 'npm';
        exec(`cd ${url + root}/${gitName} && ${npm} i`, { encoding: 'utf8' }, (error, stdout, stderr) => {
            if (error) {
                console.log('错误信息：', error);
                return res.json({ result: false, code: 500, message: '依赖安装失败！', error: stderr });
            } else {
                return res.json({ result: true, code: 200, message: "依赖安装成功!" });
            }
        });
    } else {
        return res.json({ result: false, code: 500, message: '初始化项目参数错误！' });
    }
});
// 打包项目
router.post('/build', function (req, res, next) {
    let body = req.body;
    let root = body.root
    let branch = body.branch
    let order = body.order
    let gitUrl = body.gitUrl
    if (root && branch && order && gitUrl) {
        // let npm = order.indexOf('cnpm') > -1 ? 'cnpm' : 'npm';
        order = order.replace(/cnpm/g, "npm")
        let gitName = gitUrl.slice(gitUrl.lastIndexOf("/") + 1, gitUrl.lastIndexOf(".git"))
        if (body.port && body.port !== "") {
            exec(`cd ${url + root}/${gitName} && ${order}`, { encoding: 'utf8' }, (error, stdout, stderr) => {
                if (error) {
                    console.log('错误信息：', error);
                    return res.json({ result: false, code: 500, message: '项目打包失败！', error: stderr });
                } else {
                    return res.json({ result: true, code: 200, message: "项目打包成功!" });
                }
            });
        } else {

            // 看是否有端口号
            if (body.prot) {
                //修改 vue.config.js 配置文件
                fs.readFile(url + root + "/" + gitName + "/vue.config.js", function (err1, data) {
                    if (err1) {
                        console.error(err1);
                        // res.json({ result: false, code: 500, err: err1 });

                        console.log('暂无 vue.config.js 配置文件，开始打包中...');
                        exec(`cd ${url + root}/${gitName} && ${order}`, { encoding: 'utf8' }, (error, stdout, stderr) => {
                            if (error) {
                                console.log('错误信息：', error);
                                return res.json({ result: false, code: 500, message: '项目打包失败！', error: stderr });
                            } else {
                                return res.json({ result: true, code: 200, message: "项目打包成功!" });
                            }
                        });
                    } else {
                        let str = `module.exports = { publicPath: '/${root}', productionSourceMap: process.env.NODE_ENV === 'production' ? false : true, lintOnSave: false }`
                        fs.writeFile(url + root + "/" + gitName + "/vue.config.js", str, function (err2) {
                            if (err2) {
                                console.error(err2);
                                res.json({ result: false, code: 500, err: err2 });
                            } else {
                                console.log('vue.config.js 修改成功，开始打包中...');
                                exec(`cd ${url + root}/${gitName} && ${order}`, { encoding: 'utf8' }, (error, stdout, stderr) => {
                                    if (error) {
                                        console.log('错误信息：', error);
                                        return res.json({ result: false, code: 500, message: '项目打包失败！', error: stderr });
                                    } else {
                                        return res.json({ result: true, code: 200, message: "项目打包成功!" });
                                    }
                                });
                            }
                        })
                    }
                });
            } else {
                console.log('暂无设置端口号，默认打包中...');
                exec(`cd ${url + root}/${gitName} && ${order}`, { encoding: 'utf8' }, (error, stdout, stderr) => {
                    if (error) {
                        console.log('错误信息：', error);
                        return res.json({ result: false, code: 500, message: '项目打包失败！', error: stderr });
                    } else {
                        return res.json({ result: true, code: 200, message: "项目打包成功!" });
                    }
                });
            }
        }

    } else {
        return res.json({ result: false, code: 500, message: '打包参数错误！' });
    }
});


module.exports = router;







