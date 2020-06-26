
const express = require("express");
const request = require('request');
const fs = require("fs");
const router = express.Router();
// const crypto = require('crypto');
// console.log(crypto.getHashes()); //打印支持的hash算法
// // 创建解密算法
// function aseDecode(data, password) {
//     /* 
//      该方法使用指定的算法与密码来创建 decipher对象, 第一个算法必须与加密数据时所使用的算法保持一致;
//      第二个参数用于指定解密时所使用的密码，其参数值为一个二进制格式的字符串或一个Buffer对象，该密码同样必须与加密该数据时所使用的密码保持一致
//     */
//     const decipher = crypto.createDecipher('aes192', password);

//     /*
//      第一个参数为一个Buffer对象或一个字符串，用于指定需要被解密的数据
//      第二个参数用于指定被解密数据所使用的编码格式，可指定的参数值为 'hex', 'binary', 'base64'等，
//      第三个参数用于指定输出解密数据时使用的编码格式，可选参数值为 'utf-8', 'ascii' 或 'binary';
//     */
//     let decrypted = decipher.update(data, 'hex', 'utf-8');

//     decrypted += decipher.final('utf-8');
//     return decrypted;
// };


// // function deSign(sign, key, iv) {
// //     let src = '';
// //     const cipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
// //     src += cipher.update(sign, 'hex', 'utf8');
// //     src += cipher.final('utf8');
// //     return src;
// // }
// router.post('/post', (req, res, next) => {

//     res.json({ result: false, code: 500,req:req.query });
// })
router.post('/', (req, res, next) => {
    let resBody = req.body;
    if (req.query.key) {
        resBody.secret = req.query.key
    }
    if (resBody.secret) {
        // 获取当前服务配置
        //  var config = utils.getConfig(configPath) 
        //  console.log('read config file:', config)
        // 获取事件名称
        // var eventName = req.get('X-GitHub-Event')
        // // 获取签名信息
        // var sign = req.get('X-Hub-Signature')
        // var delivery = req.get('X-GitHub-Delivery')
        // console.log(new Date(), ' [HOOK REQUEST]')
        // console.log('event:', eventName)
        // console.log('sign:', sign)
        // console.log('delivery:', delivery)
        //  // 获取仓库地址
        //  var repositoryUrl = req.body.repository.url
        //  // 获取分支信息
        //  var refHead = req.body.ref
        //  console.log('push head', refHead)
        //  console.log('repositoryUrl: ', repositoryUrl)
        //  // 查找配置文件中，是否有该仓库的配置
        //  var executer = config[repositoryUrl]
        //  console.log('executer: ', executer)


        // let payload = JSON.stringify(req.body);

        // console.log(aseDecode(payload, 'fdf395172fee8b95d03b07facfda307dadc9')); // 输出  我不是笨蛋

        // const key = Buffer.from('9vApxLk5G3PAsJrM', 'utf8');
        // const iv = Buffer.from('FnJL7EDzjqWjcaY9', 'utf8');
        // const src=deSign('764a669609b0c9b041faeec0d572fd7a', key, iv);
        // console.log(src); // hello world



        // console.log(resBody);
        // console.log(resBody.secret);
        let timeout = 15 * 60 * 1000; // 设置超时
        // let query = req.query;
        let url = 'http://' + req.headers.host;
        // let url = 'http://localhost:82'

        let gitData = {
            message: resBody.commits[0].message,
            repository: resBody.repository
        };
        let objData = {};
        request({
            url: `${url}/api/deploy/edition/get`,
            method: 'GET',
            timeout: timeout,
            qs: {
                // projectName: 'git测试项目',
                // projectName: resBody.secret,
                key: resBody.secret,
                select: 'one',
                mode: '1'
            }
        }, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                let data = JSON.parse(body);
                if (data.data.key) {
                    objData = data.data;
                    objData.version = data.version;
                    // 删除文件
                    // fs.unlink('./backups/' + objData.root + '/package.json', (errq) => {
                    // if (errq) {} else {}
                    // 复制文件
                    fs.copyFile('./backups/' + objData.root + '/' + resBody.repository.name + '/package.json', './backups/' + objData.root + '/package.json', function (err) {
                        if (err) {
                            console.log(err)
                            res.json({ result: false, code: 500 });
                        } else {
                            getPullProject();
                        }
                    })
                    // });
                    // getCloneProject();

                } else {
                    console.log('部署配置项有误，请重新填写！');
                    res.json({ result: false, code: 500 });
                }

            } else {
                console.log(error)
                res.json({ result: false, code: 500 });
            }
        });

        //拉取项目
        function getPullProject() {
            request({
                method: 'POST', //请求方式
                url: `${url}/api/deploy/auto/pull`,
                timeout: timeout,
                form: {
                    gitUrl: objData.gitUrl, //git 地址
                    root: objData.root,
                    branch: objData.branch, //git 分支
                    order: objData.order //部署命令
                }
            }, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    console.log('项目pull成功，正在检测配置文件是否改变...');
                    fs.readFile('./backups/' + objData.root + '/' + resBody.repository.name + '/package.json', "utf-8", function (err, data1) {
                        fs.readFile('./backups/' + objData.root + '/package.json', "utf-8", function (err, data2) {
                            if (data1 === data2) {
                                console.log('检测配置文件是未改变，正在打包中...');
                                handleBuild();
                            } else {
                                console.log('检测配置文件是已改变，正在克隆项目中...');
                                getCloneProject();
                            }
                        })
                    })
                } else {
                    console.log(error)
                    res.json({ result: false, code: 500 });
                }
            });
        }

        //克隆项目
        function getCloneProject() {
            request({
                method: 'POST', //请求方式
                url: `${url}/api/deploy/auto/clone`,
                timeout: timeout,
                form: {
                    gitUrl: objData.gitUrl, //git 地址
                    root: objData.root,
                    branch: objData.branch, //git 分支
                    order: objData.order //部署命令
                }
            }, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    console.log('项目拉取成功，正在安装依赖中...');
                    handleInit();
                } else {
                    console.log(error)
                    res.json({ result: false, code: 500 });
                }
            });
        }

        //初始化项目 安装依赖
        function handleInit() {
            request({
                method: 'POST', //请求方式
                url: `${url}/api/deploy/auto/init`,
                timeout: timeout,
                form: {
                    gitUrl: objData.gitUrl, //git 地址
                    root: objData.root,
                    branch: objData.branch, //git 分支
                    order: objData.order //部署命令
                }
            }, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    console.log('依赖安装成功，正在打包中...');
                    handleBuild();
                } else {
                    console.log(error);
                    res.json({ result: false, code: 500 });
                }
            });
        }
        //打包项目
        function handleBuild() {
            request({
                method: 'POST', //请求方式
                url: `${url}/api/deploy/auto/build`,
                timeout: timeout,
                form: {
                    gitUrl: objData.gitUrl, //git 地址
                    root: objData.root,
                    branch: objData.branch, //git 分支
                    order: objData.order //部署命令
                }
            }, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    handleSubmit();
                    console.log('项目打包完成，正在部署中...');
                } else {
                    console.log(error);
                    res.json({ result: false, code: 500 });
                }
            });
        }
        //部署项目（存储信息）
        function handleSubmit() {
            let version = handleVersion(objData.version)
            request({
                method: 'POST', //请求方式
                url: `${url}/api/deploy/edition/add`,
                timeout: timeout,
                form: {
                    projectName: objData.projectName,
                    author: objData.author,
                    url: objData.url,
                    idDeployment: 'yes',
                    root: objData.root,
                    version: version,
                    uid: objData.bid,
                    key: objData.key,
                    port: objData.port,
                    portState: objData.portState,
                    authorId: objData.authorId,
                    catalog: objData.catalog,
                    versionRoot: "./" + objData.root + "/" + version,
                    remark: gitData.message,
                    dist: objData.dist,
                    gitUrl: objData.gitUrl, //git 地址
                    branch: objData.branch, //git 分支
                    order: objData.order, //部署命令
                    mode: "1"
                }
            }, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    console.log('项目部署完成！');
                    res.json({ result: true, code: 200 });
                } else {
                    console.log(error);
                    res.json({ result: false, code: 500 });
                }
            });
        }


        function handleVersion(val) {
            let arr = val.split(".");
            if (arr[2].indexOf("9") > -1) {
                arr[2] = 0;
                if (arr[1].indexOf("9") > -1) {
                    arr[1] = 0;
                    arr[0] = arr[0] * 1 + 1;
                } else {
                    arr[1] = arr[1] * 1 + 1;
                }
            } else {
                arr[2] = arr[2] * 1 + 1;
            }
            return arr[0] + "." + arr[1] + "." + arr[2];
        }
    } else {
        res.json({ result: false, code: 500 });
    }
});

module.exports = router;







