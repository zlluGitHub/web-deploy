
const express = require('express');
const router = express.Router();
const fs = require("fs");
//添加数据
router.get('/file/write', (req, res, next) => {
  // fs.wirteFile有三个参数
  // 1,第一个参数是要写入的文件路径
  // 2,第二个参数是要写入得内容
  // 3,第三个参数是可选参数,表示要写入的文件编码格式,一般就不写,默认就行
  // 4,第四个参数是个回调函数  只有一个参数error,来判断是否写入成功
  let a = req.query.id
  // let a = req.body.a
  console.log(a);
  
  fs.writeFile("./static/assets/js/s.js", a, error => {
    if (error) {
      return console.log("写入文件失败,原因是" + error.message);
    } else {
      console.log("写入成功");
      res.json({ result: true, code: 200 });
    };
  });
});
module.exports = router;