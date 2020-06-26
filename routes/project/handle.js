const express = require('express');
const router = express.Router();
const tools = require("../../public/javascripts/tools");
const handle = require("../../schema/project/handle");

//获取数据
router.get('/get', (req, res, next) => {
    let query = req.query;
    let pageNo = query.pageNo;
    let pageSize = query.pageSize;
    let queryObj = {}
    if (query.bid) {
        queryObj.bid = query.bid;
    };
    if (query.project) {
        queryObj.project = { $regex: new RegExp(query.project, 'gi') };
    };
    if (query.laboratoryType) {
        queryObj.laboratoryType = { $regex: new RegExp(query.laboratoryType, 'gi') };
    };
    if (query.type) {
        queryObj.type = query.type;
    };

    // if (query.user) {
    //     queryObj.user = { $regex: new RegExp(query.user, 'gi') };
    // };

    handle.find(queryObj, (err, data) => {
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
    body.date = tools.dateTime();
    handle.create(body, (err, data) => {
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
    handle.deleteOne({ bid: body.bid }, (err, data) => {
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
    handle.update({ bid: body.bid }, { $set: body }, (err, data) => {
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