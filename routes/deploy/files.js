
const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const multer = require("multer");

// 文件存储
let url = './backups/';
let upload = multer({ dest: url }).single('file');
router.post('/add', upload, (req, res, next) => {
    let file = req.file;
    let body = req.body;
    if (body.root && body.version && file) {
        let filePath = body.root + '/' + body.version + '/'
        let relativePath = body.relativePath.slice(0, body.relativePath.indexOf('/' + body.filename));
        mkdirs(url + filePath + relativePath, function (params) {
            console.log(params);
            fs.renameSync(url + file.filename, url + filePath + body.relativePath); //这里修改文件名字。
            res.json({ result: true, code: 200 });
        });
    } else {
        res.json({ result: false, code: 500, message: "上传文件不能为空！" });
        return;
    }
});

// 递归创建多层目录并写入文件
function mkdirs(dirname, callback) {
    fs.exists(dirname, function (exists) {
        if (exists) {
            callback();
        } else {
            mkdirs(path.dirname(dirname), function () {
                fs.mkdir(dirname, callback);
            });
        }
    });
}


router.post('/read', (req, res, next) => {
    let components = []
    const files = fs.readdirSync('./www')
    files.forEach(function (item, index) {
        let stat = fs.lstatSync("./www/" + item)
        if (stat.isDirectory() === true) {
            components.push(item)
        }
    })
    res.json({ result: true, code: 200, mkdir: components });
});

router.get('/change', (req, res, next) => {
    // fs.readFile('./vue.config.js', function (err1, data) {
    //     if (err1) {
    //         console.error(err1);
    //         res.json({ result: false, code: 500, err:err1 });
    //     } else {
    //         var str = `module.exports = { publicPath: '/text2222222', productionSourceMap: process.env.NODE_ENV === 'production' ? false : true, lintOnSave: false }`
    //         fs.writeFile('./vue.config.js', str, function (err2) {
    //             if (err2) {
    //                 res.json({ result: false, code: 500, err:err2 });
    //             } else {
    //                 console.log('--------------------修改成功');
    //                 // console.log(person.data);
                    res.json({ result: true, code: 200 });
    //             }
    //         })
    //     }
    // })
});

module.exports = router;







