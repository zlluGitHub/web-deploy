const express = require('express');
const router = express.Router();
const component = require("../../schema/deploy/edition");
router.post('/', (req, res, next) => {
    component.find({}, (err, data) => {
        if (err) {
            console.log('错误信息：', err);
            res.json({ result: false, code: 500 });
        } else {
            let arr = data.map(item => {
                return item.port
            })
            res.json({ result: true, data: arr });
        }
    });
});
module.exports = router;