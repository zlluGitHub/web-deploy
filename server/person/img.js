
const express = require("express");
const router = express.Router();
const fs = require("fs");
const multer = require("multer");

// 图片存储路径
let url = './public/images/';
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
    fileInfo.path = 'images/' + fileName;
    res.json({ result: true, code: 200, fileInfo , message: "文件上传成功！"});
  }
});

// 删除头像
router.post('/remove', (req, res, next) => {
  let body = req.body;
  if (body.name) {
      fs.readdirSync(url).map((file) => {
          if (body.name === file) {
              fs.unlink(url + file, (err) => {
                  if (err) {
                      console.log(err);
                      res.json({ result: false, code: 500, message: body.name + " 文件删除失败！" });
                  } else {
                      res.json({ result: true, code: 200, message: body.name + " 文件删除成功！" });
                  }
              });
          }
      });
  } else {
      res.json({ result: false, code: 500, message: body.name + " 文件删除失败！" });
  }
});

module.exports = router;