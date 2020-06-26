const express = require('express');
const router = express.Router();
const tools = require("../../public/javascripts/tools");
const email = require("../../public/javascripts/email");
const user = require("../../schema/person/user");

//获取数据 部分信息
router.get('/', (req, res, next) => {
    user.find({}, (err, data) => {
        if (err) {
            console.log('错误信息：', err);
            res.json({ result: false, code: 500 });
            return;
        } else {
            //数据处理
            data = data.map(item => {
                return {
                    name: item.name,
                    url: item.url
                }
            });
            res.json({ result: true, code: 200, data });
        };
    });
});

//验证 数据 登录
let code = 2342327865; //验证码
router.post('/login', (req, res, next) => {
    // let query = req.query;
    let query = req.body;
    code = tools.random(100000, 999999)
    if (query.mark == 0) {
        // 发送邮件
        email.sendMail('18230086651@163.com', '前端自动化部署平台', query.email,
            `【WD】注册验证`,
            `您好，${query.name}！欢迎注册前端自动化部署平台，验证码：${code}。如非本人操作，请忽略。`);
        res.json({ result: true, code: 200 });
    } else {
        user.find({}, (err, data) => {
            if (err) {
                console.log('错误信息：', err);
                res.json({ result: false, code: 500 });
                return;
            } else {
                //数据处理
                let name = query.name;
                let pass = query.pass;
                let mark = false, info = {};
                for (let index = 0; index < data.length; index++) {
                    let item = data[index];
                    if (item.name === name && item.password == pass) {
                        mark = true;
                        info = item;
                        break;
                    };
                };
                if (mark) {
                    res.json({ result: true, code: 200, content: info });
                } else {
                    res.json({ result: false, code: 500, content: '登录失败！' });
                };
            };
        });

    }
});


// 找回密码
router.post('/reset', (req, res, next) => {
    // let query = req.query;
    let query = req.body;
    if (query.email) {

        user.find({}, (err, data) => {
            if (err) {
                console.log('错误信息：', err);
                res.json({ result: false, code: 500 });
                return;
            } else {
                //数据处理
                let name = query.name;
                let mark = false, info = {};
                for (let index = 0; index < data.length; index++) {
                    let item = data[index];
                    if (item.name === name && item.email == query.email) {
                        mark = true;
                        info = item;
                        break;
                    };
                };

                if (mark) {
                    // 发送邮件
                    email.sendMail('18230086651@163.com', '前端自动化部署平台', query.email,
                        `【WD】密码找回`,
                        `您好，${info.name}！您在前端自动化部署平台注册的密码已找回，登录密码：${info.password}，为了您账号的安全，请务必到个人中心修改密码！`);
                    res.json({ result: true, code: 200 });
                } else {
                    res.json({ result: false, code: 500, content: '密码找回失败！' });
                };
            };
        });

    } else {
        res.json({ result: false, code: 500, content: '账号或邮箱错误！' });

    }
});



//获取全量信息 
router.get('/list', (req, res, next) => {
    let query = req.query;
    user.find(query, (err, data) => {
        if (err) {
            console.log('错误信息：', err);
            res.json({ result: false, code: 500 });
            return;
        } else {
            data = data.map(item => {
                let content = {
                    name: item.name,
                    petname: item.petname,
                    speech: item.speech,
                    position: item.position,
                    date: item.date,
                    role: item.role,
                    url: item.url,
                    sex: item.sex,
                    email: item.email,
                    wechat: item.wechat,
                    qq: item.qq,
                    mark: item.mark,
                    web: item.web,
                    phone: item.phone,
                    bid: item.bid,
                    admin: item.admin,
                    _id: item._id
                }
                return content;
            })
            res.json({ result: true, code: 200, data });
        };
    });
});

//添加
router.post('/', (req, res, next) => {
    let body = req.body;
    //添加 bid 
    body.bid = body.bid ? body.bid : tools.getUid();
    body.mark = body.mark ? body.mark : 'self';
    console.log(body);

    if ((body.name && body.password && body.type == 'y') || code == body.code) {
        //判断是否已经注册
        let mark = false;
        let bid = "";
        user.find({}, (err, data) => {
            if (err) {
                console.log('错误信息：', err);
                res.json({ result: false, code: 500 });
                return;
            } else {
                //数据处理
                for (let index = 0; index < data.length; index++) {
                    let item = data[index];
                    if (item.email === body.email && item.name === body.name && item.password === body.password) {
                        mark = true;
                        bid = item.bid;
                        break;
                    };
                };
                if (!mark) {
                    body.date = body.date ? body.date : tools.dateTime();
                    user.create(body, (err, data) => {
                        if (err) {
                            console.log('错误信息：', err);
                            res.json({ result: false, code: 500 });
                            return;
                        } else {
                            res.json({ result: true, code: 200 });
                        };
                    });
                } else {
                    res.json({ result: true, code: 200, mark: true ,mes:"您已注册，请直接登录！"});
                    // if (body.type == 'y') {
                    //     user.update({ bid }, { $set: body }, (err, data) => {
                    //         if (err) {
                    //             res.json({ result: false, code: 500, mark: true });
                    //             console.log('错误信息：', err);
                    //             return;
                    //         } else {
                    //             res.json({ result: true, code: 200 });
                    //         };
                    //     });
                    // } else {
                    //     res.json({ result: false, code: 500, mark: true });
                    // }
                }

            };
        });
    } else {
        res.json({ result: false, code: 500, mas: true });
    }
});


//删除
router.post('/delete', (req, res, next) => {
    let bid = req.query.bid;
    user.deleteOne({ bid }, (err, data) => {
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
router.post('/update', (req, res, next) => {
    let body = req.body;
    user.update({ bid: body.bid }, { $set: body }, (err, data) => {
        if (err) {
            res.json({ result: false, code: 500, message: '更新失败！' });
            console.log('错误信息：', err);
            return;
        } else {
            res.json({ result: true, code: 200, message: '更新成功！' });
        };
    });
});


module.exports = router;