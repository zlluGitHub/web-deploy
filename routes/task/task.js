const express = require('express');
const router = express.Router();
const tools = require("../../public/javascripts/tools");
const task = require("../../schema/task/task");

//获取分类
router.get('/type', (req, res, next) => {
    task.find({}, (err, data) => {
        if (err) {
            console.log('错误信息：', err);
            res.json({ result: false, code: 500 });
            return;
        } else {
            //左侧统计分类
            let arr = [];
            //右侧统计分类
            let classArr = [];
            data.forEach(item => {
                arr.push(item.type);
                classArr.push(item.class);
            });

            let obj = {}, newArr = [];
            for (var i = 0; i < arr.length; i++) {
                var temp = arr[i];
                if (!obj[temp]) {
                    obj[temp] = 1;
                } else {
                    obj[temp] = obj[temp] + 1;
                }
            };
            let count = 0;
            for (key in obj) {
                count = count + obj[key];
                newArr.push({
                    type: key,
                    count: obj[key]
                })
            };
            classArr = Array.from(new Set(classArr));
            res.json({ result: true, code: 200, type: newArr, count, classArr });
        };
    });
});

//获取数据
router.get('/', (req, res, next) => {
    let query = req.query;
    let pageNo = query.pageNo ? query.pageNo : 1;
    let pageSize = query.pageSize ? query.pageSize : 10;
    let queryObj = {}
    if (query.bid) {
        queryObj._id = query.bid;
    };
    if (query.type) {
        queryObj.type = query.type;
    };
    if (query.assign) {
        queryObj.assign = query.assign;
    };
    if (query.author) {
        queryObj.author = query.author;
    };
    if (query.project) {
        queryObj.project = query.project;
    };
    if (query.title) {
        queryObj.title = { $regex: new RegExp(query.title, 'gi') };
    }
    if (query.state) {
        queryObj.state = query.state;
    }

    task.find(queryObj, (err, data) => {
        if (err) {
            console.log('错误信息：', err);
            res.json({ result: false, code: 500 });
            return;
        } else {
            //数据分页处理
            if (query.mark) { //赛选指派他人
                data = data.filter(item => {
                    return item.assign !== query.mark;
                });
            };
            data = tools.setPage(data, pageNo, pageSize);
            //判断返回数据格式
            let warpData = { result: true, code: 200 };
            if (!query.bid) {
                warpData.list = data.list.map(item => {
                    let obj = {
                        appendix: item.appendix,
                        assign: item.assign,
                        send: item.send,
                        author: item.author,
                        date: item.date.slice(0, 10),
                        level: item.level,
                        project: item.project,
                        remarks: item.remarks,
                        step: item.step,
                        state: item.state,
                        title: item.title,
                        type: item.type,
                        url: item.url,
                        bid: item._id
                    }
                    return obj;
                });
                warpData.total = data.total;
            } else {
                let item = data.list[0];
                let obj = {
                    appendix: item.appendix,
                    assign: item.assign,
                    author: item.author,
                    date: item.date.slice(0, 10),
                    level: item.level,
                    project: item.project,
                    step: item.step,
                    remarks: item.remarks,
                    state: item.state,
                    title: item.title,
                    type: item.type,
                    url: item.url,
                    bid: item._id
                }
                warpData.content = obj;
            }
            res.json(warpData);
        };
    });
});

//添加
router.post('/', (req, res, next) => {
    let body = req.body;
    if (!body.date) {
        body.date = tools.dateTime();
    }
    task.create(body, (err, data) => {
        if (err) {
            console.log('错误信息：', err);
            res.json({ result: false, code: 500 });
            return;
        } else {
            res.json({ result: true, code: 200, data });
        };
    });
});

//删除
router.delete('/', (req, res, next) => {
    let a = req.query.id;
    task.deleteOne({ type: "pie" }, (err, data) => {
        if (err) {
            console.log('错误信息：', err);
            res.json({ result: false, code: 500 });
            return;
        } else {
            res.json({ result: true, code: 200, data });
        };
    });
});

//更新
router.put('/', (req, res, next) => {
    let body = req.body;
    task.update({ _id: body.bid }, { $set: body.data }, (err, data) => {
        if (err) {
            res.json({ result: false, code: 500 });
            console.log('错误信息：', err);
            return;
        } else {
            res.json({ result: true, code: 200, data });
        };
    });
});

module.exports = router;