
const express = require("express");
const router = express.Router();
const fs = require("fs");
const multer = require("multer");

// 图片存储路径
let url = './static/assets/img/chart/';
//设置文件存储路径 upload文件如果不存在则会自己创建一个。
let upload = multer({ dest: url }).single('file');

router.post('/', upload, (req, res, next) => {
  if (req.file.length === 0) {  //判断一下文件是否存在，也可以在前端代码中进行判断。
    res.json({ result: false, code: 500, message: "上传文件不能为空！" });
    // res.render("error", { message: "上传文件不能为空！" });
    return;
  } else {
    let file = req.file;
    //file.originalname：源文件名称
    let fileName = new Date().getTime() + '.jpg';
    fs.renameSync(url + file.filename, url + fileName);//这里修改文件名字。
    let fileInfo = {};
    // 获取文件信息
    // fileInfo.mimetype = file.mimetype;
    fileInfo.name = fileName;
    fileInfo.size = file.size;
    fileInfo.path = 'assets/img/chart/' + fileName;
    res.json({ result: true, code: 200, fileInfo });
  }
});

module.exports = router;