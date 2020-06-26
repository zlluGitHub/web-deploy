const express = require('express');
const router = express.Router();
const tools = require("../../public/javascripts/tools");
const feedback = require("../../schema/project/feedback");

//获取数据
router.get('/get', (req, res, next) => {
    let query = req.query;
    let pageNo = query.pageNo ? query.pageNo : 1;
    let pageSize = query.pageSize ? query.pageSize : 10;
    let queryObj = {}
    if (query.bid) {
        queryObj.bid = query.bid;
    };
    if (query.userId) {
        queryObj.userId = query.userId;
    };
    if (query.state) {
        queryObj.state = query.state;
    };

    feedback.find(queryObj, (err, data) => {
        if (err) {
            console.log('错误信息：', err);
            res.json({ result: false, code: 500 });
            return;
        } else {
            //数据分页处理
            data = tools.setPage(data, pageNo, pageSize);
            res.json({ result: true, code: 200, data });
        };
    });
});

//添加
router.post('/add', (req, res, next) => {
    let body = req.body;
    body.bid = tools.getUid();
    body.state = body.state?body.state:'no';
    body.date = tools.dateTime();
    feedback.create(body, (err, data) => {
        if (err) {
            console.log('错误信息：', err);
            res.json({ result: false, code: 500 });
            return;
        } else {
            res.json({ result: true, code: 200 });
        };
    });
});

//删除
router.post('/delete', (req, res, next) => {
    let body = req.body;
    feedback.deleteOne({ bid: body.bid }, (err, data) => {
        if (err) {
            console.log('错误信息：', err);
            res.json({ result: false, code: 500 });
            return;
        } else {
            res.json({ result: true, code: 200 });
        };
    });
});

//更新
router.post('/update', (req, res, next) => {
    let body = req.body;
    body.date = tools.dateTime();
    feedback.update({ bid: body.bid }, { $set: body }, (err, data) => {
        if (err) {
            res.json({ result: false, code: 500 });
            console.log('错误信息：', err);
            return;
        } else {
            res.json({ result: true, code: 200 });
        };
    });
});

module.exports = router;