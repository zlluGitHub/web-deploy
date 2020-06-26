
const express = require('express');
const router = express.Router();
const theme = require("../../schema/theme/theme");
router.get('/', (req, res, next) => {
    let query = req.query;
    let newQuery = {};
    if (query.name) {
        newQuery.name = query.name;
    };
    if (query.bid) {
        newQuery._id = query.bid;
    };
    theme.find(newQuery, (err, data) => {
        if (err) {
            console.log('错误信息：', err);
            res.json({ result: false, code: 500 });
            return;
        } else {
            // for (let index = 0; index < data.length; index++) {
            //     let item = data[index];
            //     if (item.themeName === query.name) {
            //         mark = true;
            //         info = item;
            //         break;
            //     };
            // };
            let content = data.map(item => {
                let obj = { name: item.name, color: item.color };
                return obj;
            })
            res.json({ result: true, code: 200, data: content });
        };
    });
});

//添加
router.post('/', (req, res, next) => {
    let body = req.body;
    theme.create(body, (err, data) => {
        if (err) {
            console.log('错误信息：', err);
            res.json({ result: false, code: 500 });
            return;
        } else {
            res.json({ result: true, code: 200, data });
        };
    });
});

module.exports = router;