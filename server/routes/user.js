const express = require('express');
const router = express.Router();
const tools = require("../public/javascripts/tools");
const email = require("../public/javascripts/email");
const user = require("../schema/user");
//获取数据 部分信息
// router.get('/', (req, res, next) => {
//     user.find({}, (err, data) => {
//         if (err) {
//             console.log('错误信息：', err);
//             res.json({ result: false, code: 500 });
//             return;
//         } else {
//             //数据处理
//             data = data.map(item => {
//                 return {
//                     name: item.name,
//                     url: item.url
//                 }
//             });
//             console.log('验证码发送邮件成功！');
//             res.json({ result: true, code: 200, data });
//         };
//     });
// });

//验证 数据 登录
// let code = 2342327865; //验证码
router.post('/login', (req, res, next) => {
    let body = req.body;

    user.find({
        name: body.name,
        password: body.password
    }, (err, data) => {
        if (err) {
            console.log('错误信息：', err);
            res.json({ message: "用户信息校验失败！", code: 500 });
        } else {
            if (data[0]) {
                res.json({
                    result: true, data: {
                        name: data[0].name,
                        date: data[0].date,
                        bid: data[0].bid,
                        // password: data[0].password
                    }, message: "用户登陆成功！", code: 200
                });
            } else {
                res.json({ result: false, code: 200, message: "用户登录失败！" });
            }
        };
    });

    // code = tools.random(100000, 999999)
    // if (query.mark == 0) {
    //     // 发送邮件
    //     email.sendMail(query.email, `您好，${query.name}！欢迎注册前端自动化部署平台，验证码：${code}。如非本人操作，请忽略。`);
    //     console.log('验证码发送邮件成功！');
    //     res.json({ result: true, code: 200 });
    // } else {
    // user.find({}, (err, data) => {
    //     if (err) {
    //         console.log('错误信息：', err);
    //         res.json({ result: false, code: 500 });
    //         return;
    //     } else {
    //         //数据处理
    //         let name = query.name;
    //         let pass = query.pass;
    //         let mark = false, info = {};
    //         for (let index = 0; index < data.length; index++) {
    //             let item = data[index];
    //             if (item.name === name && item.password == pass) {
    //                 mark = true;
    //                 info = item;
    //                 break;
    //             };
    //         };
    //         if (mark) {
    //             let content = {}
    //             if (query.shell !== 'yes') {
    //                 content = info
    //             }
    //             res.json({ result: true, code: 200, content });
    //         } else {
    //             console.log('错误信息：', '登录失败！');
    //             res.json({ result: false, code: 500, content: '登录失败！' });
    //         };
    //     };
    // });

    // }
});


// 找回密码
// router.post('/reset', (req, res, next) => {
//     let query = req.body;
//     if (query.email) {

//         user.find({}, (err, data) => {
//             if (err) {
//                 console.log('错误信息：', err);
//                 res.json({ result: false, code: 500 });
//                 return;
//             } else {
//                 //数据处理
//                 let name = query.name;
//                 let mark = false, info = {};
//                 for (let index = 0; index < data.length; index++) {
//                     let item = data[index];
//                     if (item.name === name && item.email == query.email) {
//                         mark = true;
//                         info = item;
//                         break;
//                     };
//                 };

//                 if (mark) {
//                     // 发送邮件
//                     email.sendMail(query.email, `您好，${info.name}！您在前端自动化部署平台注册的密码已找回，登录密码：${info.password}，为了您账号的安全，请务必到个人中心修改密码！`);
//                     res.json({ result: true, code: 200 });
//                 } else {
//                     res.json({ result: false, code: 500, content: '密码找回失败！' });
//                 };
//             };
//         });

//     } else {
//         res.json({ result: false, code: 500, content: '账号或邮箱错误！' });
//     }
// });

//获取全量信息 
// router.get('/list', (req, res, next) => {
//     let query = req.query;
//     user.find(query, (err, data) => {
//         if (err) {
//             console.log('错误信息：', err);
//             res.json({ result: false, code: 500 });
//             return;
//         } else {
//             data = data.map(item => {
//                 let content = {
//                     name: item.name,
//                     petname: item.petname,
//                     speech: item.speech,
//                     position: item.position,
//                     date: item.date,
//                     role: item.role,
//                     url: item.url,
//                     sex: item.sex,
//                     email: item.email,
//                     wechat: item.wechat,
//                     qq: item.qq,
//                     mark: item.mark,
//                     web: item.web,
//                     phone: item.phone,
//                     bid: item.bid,
//                     admin: item.admin,
//                     _id: item._id
//                 }
//                 return content;
//             })
//             res.json({ result: true, code: 200, data });
//         };
//     });
// });

//添加
router.post('/', (req, res, next) => {
    let body = req.body;
    body.bid = body.bid ? body.bid : tools.getUid();
    // body.mark = body.mark ? body.mark : 'self';
    body.date = tools.dateTime();

    user.find({
        name: body.name,
        password: body.password
    }, (err, data) => {
        if (err) {
            console.log('错误信息：', err);
            res.json({ message: "用户信息获取失败！", code: 500 });
        } else {
            if (!data[0]) {
                // body.date = body.date ? body.date : tools.dateTime();
                user.create(body, (err, data) => {
                    if (err) {
                        console.log('错误信息：', err);
                        res.json({ message: "抱歉，注册失败！", code: 500 });
                    } else {
                        res.json({
                            result: true, data: {
                                name: body.name,
                                date: body.date,
                                bid: body.bid,
                            }, message: "恭喜，注册成功，请登录！", code: 200
                        });
                    };
                });
            } else {
                res.json({
                    result: false, data: {
                        name: body.name,
                        date: body.date,
                        bid: body.bid,
                    }, code: 200, message: "您已注册，请直接登录！"
                });
            }
        };
    });
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
    user.updateOne({ bid: body.bid }, { $set: body }, (err, data) => {
        if (err) {
            res.json({ code: 500, message: '信息更新失败！' });
            console.log('错误信息：', err);
        } else {
            res.json({ code: 200, message: '信息更新成功！' });
        };
    });
});


module.exports = router;