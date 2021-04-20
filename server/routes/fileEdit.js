const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

//读取目录结构
router.get('/catalog', async (req, res, next) => {
    let { folder } = req.query;
    if (folder === 'backups' || folder === 'www') {
        const getCatalog = (dir) => {
            let filesNameArr = []
            // 用个hash队列保存每个目录的深度
            let mapDeep = {}
            mapDeep[dir] = 0
            // 先遍历一遍给其建立深度索引
            const getMap = (dir, curIndex) => {
                let files = fs.readdirSync(dir) //同步拿到文件目录下的所有文件名
                files.map(function (file) {
                    //let subPath = path.resolve(dir, file) //拼接为绝对路径
                    let subPath = path.join(dir, file) //拼接为相对路径
                    let stats = fs.statSync(subPath) //拿到文件信息对象
                    // 必须过滤掉node_modules文件夹
                    if (file != 'node_modules') {
                        mapDeep[file] = curIndex + 1
                        if (stats.isDirectory()) { //判断是否为文件夹类型
                            return getMap(subPath, mapDeep[file]) //递归读取文件夹
                        }
                    }
                })
            }

            getMap(dir, mapDeep[dir])

            const readdirs = (dir, folderName, myroot) => {
                let result = { //构造文件夹数据
                    path: dir,
                    title: path.basename(dir),
                    type: 'directory',
                    deep: mapDeep[folderName]
                }
                let files = fs.readdirSync(dir) //同步拿到文件目录下的所有文件名
                result.children = files.map(function (file) {
                    //let subPath = path.resolve(dir, file) //拼接为绝对路径
                    let subPath = path.join(dir, file) //拼接为相对路径
                    let stats = fs.statSync(subPath) //拿到文件信息对象
                    if (stats.isDirectory()) { //判断是否为文件夹类型
                        return readdirs(subPath, file, file) //递归读取文件夹
                    }
                    return { //构造文件数据
                        path: subPath,
                        title: file,
                        // expand: true,
                        // contextmenu: true,
                        type: 'file'
                    }
                })
                return result //返回数据
            }
            filesNameArr.push(readdirs(dir, dir))
            return filesNameArr
        }

        let dir = path.join(__dirname, `../../${folder}`)

        res.json({ data: getCatalog(dir), message: "请求成功！", code: 200 });
    } else {
        res.json({ data: null, message: "无权访问！", code: 200 });
    }
});
//读取文件内容
router.get('/content', async (req, res, next) => {
    let { filePath } = req.query;
    fs.readFile(filePath, "utf-8", function (err, data) {
        // let obj = JSON.parse(data);
        if (err) {
            console.log(err);
            res.json({ data: null, message: err, code: 500 });
        } else {
            res.json({ data, message: '请求成功！', code: 200 });
        }
    });
});

module.exports = router;