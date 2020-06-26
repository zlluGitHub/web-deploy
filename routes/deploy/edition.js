const express = require('express');
const router = express.Router();
const fs = require("fs");
const request = require('request');
const path = require("path");
const tools = require("../../public/javascripts/tools");
const component = require("../../schema/deploy/edition");
const user = require("../../schema/person/user");

//获取数据
router.get('/get', (req, res, next) => {
    let query = req.query;
    let pageNo = query.pageNo ? query.pageNo : 1;
    let pageSize = query.pageSize ? query.pageSize : 10;
    component.find({}, (err, data) => {
        if (err) {
            console.log('错误信息：', err);
            res.json({ result: false, code: 500 });
        } else {
            let project = []

            data.forEach(item => {
                project.push({
                    projectName: item.projectName,
                    key: item.key
                })
            })
            let obj = {};
            project = project.reduce(function (item, next) {
                obj[next.key] ? '' : obj[next.key] = true && item.push(next);
                return item;
            }, []);
            // project = Array.from(new Set(project));

            if (query.projectName) {
                data = data.filter(item => {
                    if (query.accurate == '1') {
                        return item.projectName === query.projectName;
                    } else {
                        return item.projectName.indexOf(query.projectName) > -1;
                    }
                })
            }
            let versionData = null
            if (data.length > 0) {
                versionData = data[data.length - 1]
            } else {
                versionData = { version: '1.0.1' }
            }

            if (query.bid) {
                data = data.filter(item => {
                    return item.bid == query.bid
                })
            }
            if (query.key) {
                data = data.filter(item => {
                    return item.key == query.key
                })
            }

            if (query.version) {
                data = data.filter(item => {
                    return item.version == query.version
                })
            }
            if (query.authorId) {
                data = data.filter(item => {
                    return item.authorId == query.authorId
                })
            }
            if (query.mode) {
                data = data.filter(item => {
                    return item.mode == query.mode
                })
            }
            if (query.collect) {
                data = data.filter(item => {
                    return item.collect == query.collect
                })
            }
            if (query.idDeployment) {
                data = data.filter(item => {
                    return item.idDeployment == query.idDeployment
                })
            }
            //数据分页处理
            data = tools.setPage(data, pageNo, pageSize);

            user.find({}, (err, userArr) => {
                if (err) {
                    console.log('错误信息：', err);
                    res.json({ result: false, code: 500 });
                    return;
                } else {
                    // console.log(userArr);
                    data.list = data.list.map(item => {
                        for (let index = 0; index < userArr.length; index++) {
                            if (userArr[index].bid === item.authorId) {
                                item.author = userArr[index].name;
                                item.url = userArr[index].url;
                            }
                        }
                        item._id = undefined;
                        item.__v = undefined;
                        return item;
                    })

                    let dataObj = { result: true, code: 200 };
                    // dataObj.userArr = userArr
                    if (query.select == 'one') {
                        dataObj.data = data.list[0] ? data.list[0] : versionData
                        dataObj.version = versionData.version
                    } else {
                        dataObj.project = project
                        dataObj.list = data.list
                        dataObj.total = data.total
                    }
                    res.json(dataObj);
                };
            });
        };
    });
});


//添加
router.post('/add', (req, res, next) => {
    let body = req.body;
    body.time = tools.dateTime();
    body.bid = tools.getUid();
    body.webUrl = "/" + body.root;
    body.collect = body.collect ? body.collect : '0';
    body.idDeployment = body.idDeployment ? body.idDeployment : 'yes'
    body.portState = body.portState ? body.portState : '0'
    if (body.mode == '1') {
        // 删除根目录下的文件
        delDir('./www/' + body.root);//删除文件夹
        // 复制文件
        let gitName = body.gitUrl.slice(body.gitUrl.lastIndexOf("/") + 1, body.gitUrl.lastIndexOf(".git"))
        let sourcesPath = './backups/' + body.root + '/' + gitName + '/' + body.dist
        let dirPath = './backups/' + body.root + '/' + body.version + '/' + body.dist
        if (mkdirsSync(dirPath)) {
            checkDirectory(sourcesPath, dirPath, copy);
            checkDirectory(sourcesPath, './www/' + body.root, copy);
        }

    } else {
        let SOURCES_DIRECTORY = './backups/' + body.root + '/' + body.version + '/' + body.catalog;  //源目录
        let _dirname = './www/' + body.root;  //目标目录
        // 删除根目录下的文件
        delDir(_dirname);//删除文件夹
        // 复制文件
        checkDirectory(SOURCES_DIRECTORY, _dirname, copy);
    }

    //更新数据
    component.updateMany({ projectName: body.projectName }, { $set: { idDeployment: 'no' } }, (err, result) => {
        if (err) {
            res.json({ result: false, code: 500 });
            console.log('错误信息：', err);
        } else {
            if (!body.key) {
                body.key = tools.getUid(); //秘钥key
                console.log(body.key);
            }
            component.create(body, (err, data) => {
                if (err) {
                    console.log('错误信息：', err);
                    res.json({ result: false, code: 500 });
                } else {
                    // 开启端口
                    let key = body.key
                    if (body.port && body.port !== "") {
                        let url = 'http://' + req.headers.host;
                        request({
                            method: 'POST', //请求方式
                            url: `${url}/api/service/operation/open`,
                            form: body
                        }, function (error, response, data) {
                            if (!error && response.statusCode == 200) {
                                console.log(body.port + '端口服务启动成功！');
                                res.json({ result: true, code: 200, message: body.port + '端口服务启动成功！', key });
                            } else {
                                console.log(body.port + '端口服务启动失败！');
                                res.json({ result: false, code: 200, message: body.port + '端口服务启动失败！' });
                            }
                        });
                    } else {
                        res.json({ result: true, code: 200, key });
                    }
                };
            });
        };
    });
});

// 文件转移（重新部署）
router.post('/transfer', (req, res, next) => {
    let body = req.body;
    if (body.root && body.version && body.catalog && body.projectName && body.bid) {
        component.updateMany({ projectName: body.projectName }, { $set: { idDeployment: 'no' } }, (err, result) => {
            if (err) {
                res.json({ result: false, code: 500 });
                console.log('错误信息：', err);
            } else {
                let SOURCES_DIRECTORY = './backups/' + body.root + '/' + body.version + '/' + body.catalog;  //源目录
                let _dirname = './www/' + body.root;  //目标目录
                // 删除根目录下的文件
                delDir(_dirname);//删除文件夹
                // 复制文件
                checkDirectory(SOURCES_DIRECTORY, _dirname, copy);
                component.updateOne({ bid: body.bid }, { $set: { idDeployment: 'yes' } }, (err, result) => {
                    if (err) {
                        res.json({ result: false, code: 500 });
                        console.log('错误信息：', err);
                    } else {
                        res.json({ result: true, code: 200 });
                    };
                });
            };
        });
    } else {
        res.json({ result: false, code: 500 });
    }

    // if (body.root && body.version && body.catalog && body.bid) {

    //     //更新数据
    //     function backCall() {
    //         component.updateOne({ bid: body.bid }, { $set: { idDeployment: 'yes' } }, (err, result) => {
    //             if (err) {
    //                 res.json({ result: false, code: 500 });
    //                 console.log('错误信息：', err);
    //             } else {
    //                 const SOURCES_DIRECTORY = './backups/' + body.root + '/' + body.version + '/' + body.catalog;  //源目录
    //                 const _dirname = './www/' + body.root;  //目标目录
    //                 // 删除根目录下的文件
    //                 delDir(_dirname);//删除文件夹
    //                 // 复制文件
    //                 checkDirectory(SOURCES_DIRECTORY, _dirname, copy);
    //                 res.json({ result: true, code: 200 });
    //             };
    //         });
    //     };

    //     let uidArr = JSON.parse(body.uidArr);
    //     if (uidArr && uidArr.length !== 0) {
    //         let mark = 0;
    //         uidArr.forEach(bid => {
    //             component.updateOne({ bid: bid }, { $set: { idDeployment: 'no' } }, (err, result) => {
    //                 if (err) {
    //                     res.json({ result: false, code: 500 });
    //                     console.log('错误信息：', err);
    //                 } else {
    //                     mark = mark + 1
    //                     if (mark == uidArr.length) {
    //                         backCall();
    //                     }
    //                 };
    //             });
    //         })
    //     } else {
    //         backCall();
    //     };

    // } else {
    //     res.json({ result: false, code: 500 });
    // }
});

//删除
router.post('/delete', (req, res, next) => {
    let body = req.body;
    if (body.vi == '1') {
        delDir('./backups/' + body.root);//删除文件夹
        component.deleteMany({ projectName: body.projectName }, (err, data) => {
            if (err) {
                console.log('错误信息：', err);
                res.json({ result: false, code: 500 });
            } else {
                res.json({ result: true, code: 200 });
            };
        });
    } else {
        delDir('./backups/' + body.root + '/' + body.version);//删除文件夹
        component.deleteOne({ bid: body.bid }, (err, data) => {
            if (err) {
                console.log('错误信息：', err);
                res.json({ result: false, code: 500 });
            } else {
                res.json({ result: true, code: 200 });
            };
        });
    }



});

//更新
router.post('/update', (req, res, next) => {
    let body = req.body;
    component.update({ bid: body.bid }, { $set: body }, (err, data) => {
        if (err) {
            res.json({ result: false, code: 500, message: '更新失败！' });
            console.log('错误信息：', err);
            return;
        } else {
            res.json({ result: true, code: 200, message: '更新成功！' });
        };
    });
});

function copy(src, dst) {
    let paths = fs.readdirSync(src); //同步读取当前目录
    paths.forEach(function (path) {
        let _src = src + '/' + path;
        let _dst = dst + '/' + path;
        fs.stat(_src, function (err, stats) {  //stats  该对象 包含文件属性
            if (err) throw err;
            if (stats.isFile()) { //如果是个文件则拷贝 
                let readable = fs.createReadStream(_src);//创建读取流
                let writable = fs.createWriteStream(_dst);//创建写入流
                readable.pipe(writable);
            } else if (stats.isDirectory()) { //是目录则 递归 
                checkDirectory(_src, _dst, copy);
            }
        });
    });
}
function checkDirectory(src, dst, callback) {
    fs.access(dst, fs.constants.F_OK, (err) => {
        if (err) {
            fs.mkdirSync(dst);
            callback(src, dst);
        } else {
            callback(src, dst);
        }
    });
};

// 删除文件及文件夹
function delDir(path) {
    let files = [];
    if (fs.existsSync(path)) {
        files = fs.readdirSync(path);
        files.forEach((file, index) => {
            let curPath = path + "/" + file;
            if (fs.statSync(curPath).isDirectory()) {
                delDir(curPath); //递归删除文件夹
            } else {
                fs.unlinkSync(curPath); //删除文件
            }
        });
        fs.rmdirSync(path);
    }
}

// 递归创建目录 同步方法
function mkdirsSync(dirname) {
    if (fs.existsSync(dirname)) {
        return true;
    } else {
        if (mkdirsSync(path.dirname(dirname))) {
            fs.mkdirSync(dirname);
            return true;
        }
    }
}
module.exports = router;