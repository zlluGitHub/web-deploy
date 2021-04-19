const express = require('express');
const router = express.Router();
const commitSchema = require("../schema/commit");

//获取日志信息
router.get('/get', (req, res, next) => {
    let { pageSize, pageNo, projectId } = req.query;

    pageSize = pageSize ? pageSize * 1 : 10;
    pageNo = pageNo ? pageNo * 1 - 1 : 0;
    let filter = {};

    if (projectId) {
        filter.projectId = projectId;
    };

    let p1 = new Promise((resolve, reject) => {
        commitSchema.find(filter, { _id: 0, __v: 0 }, (err, data) => {
            if (err) {
                reject(err)

            } else {
                resolve(data)

            }
        }).skip(pageNo * pageSize).limit(pageSize).sort({ _id: -1 })
    })

    let p2 = new Promise((resolve, reject) => {
        commitSchema.find().count((err, count) => {
            if (err) {
                reject(err)
            } else {
                resolve(count)
            }
        })
    })
    Promise.all([p1, p2]).then((result) => {
        res.json({ message: '获取成功！', data: result[0], count: result[1], code: 200 });
    }).catch((error) => {
        console.log(error)
        res.json({ result: false, code: 500 });
    })

});

//更新日志信息
router.post('/updateInfo', (req, res, next) => {
    let body = req.body;

    commitSchema.updateOne({ bid: body.bid }, body, (err, data) => {
        if (err) {
            console.log('错误信息：', err);
            res.json({ message: "日志更新失败！", result: false, code: 500 });
        } else {
            res.json({ message: "日志更新成功！", data: body.bid, code: 200 });
        };
    });
});

module.exports = router;