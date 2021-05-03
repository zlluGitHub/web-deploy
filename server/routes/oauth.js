/*
 *  github 第三方 登录
 */
const express = require('express');
const router = express.Router();
const request = require('request');
// const fs = require('fs');
// const path = require('path');
const config = require('../../config.json');
let timeout = 30 * 60 * 1000; // 设置超时
router.post('/github', (req, res, next) => {
    let githubConfig = {
        // 客户ID
        client_ID: config.oauth.github.client_ID,
        // 客户密匙
        client_Secret: config.oauth.github.client_Secret,
        // 获取 access_token
        access_token_url: config.oauth.github.access_token_url,
        // 获取用户信息
        user_info_url: config.oauth.github.user_info_url + '?',
        // 回调地址
        redirect_uri: req.headers.origin + '/login'
    };
    let host = 'http://' + req.headers.host;
    let param = req.body;
    let code = param.code || '';
    if (code == '') {
        res.json({ message: '请输入正确参数！', code: 103, result: false });
        return;
    }
    request({
        url: githubConfig.access_token_url,
        timeout: timeout,
        form: {
            client_id: githubConfig.client_ID,
            client_secret: githubConfig.client_Secret,
            code: code,
            redirect_uri: githubConfig.redirect_uri
        }
    }, (error, response, body) => {
        if (!error && response.statusCode == 200) {
            let urlStr = githubConfig.user_info_url + body;
            request({
                url: urlStr,
                timeout: timeout,
                headers: { 'User-Agent': config.oauth.github.name, }
            }, (error, response, resbody) => {
                if (!error) {
                    let data = JSON.parse(resbody);
                    request({
                        method: 'POST', //请求方式
                        timeout: timeout,
                        url: `${host}/swd/person/user`,
                        form: {
                            name: data.login,
                            petname: data.name,
                            password: data.email ? data.email : data.id,
                            speech: data.bio,
                            url: data.avatar_url,
                            web: data.blog,
                            bid: data.node_id,
                            mark: 'oauth',
                            type: 'y',
                            admin: "1"
                        }
                    }, (error, response, body) => {
                        if (!error && response.statusCode == 200) {
                            let data = JSON.parse(body);
                            res.json({
                                code: 200, result: true, data
                            });
                        } else {
                            console.log(error);
                            res.json({ result: false, code: 500 });
                        }
                    });
                } else {
                    console.log(error);
                    res.json({ message: '获取用户信息失败！', code: 102, result: false });
                }
            })
        } else {
            console.log(error);
            res.json({ message: '获取用户信息失败！', code: 101, result: false });
        }
    })
});

router.post('/gitee', (req, res, next) => {
    let githubConfig = {
        // 客户ID
        client_ID: config.oauth.gitee.client_ID,
        // 客户密匙
        client_Secret: config.oauth.gitee.client_Secret,
        // 获取 access_token
        access_token_url: config.oauth.gitee.access_token_url,
        // 获取用户信息
        user_info_url: config.oauth.gitee.user_info_url,
        // 回调地址
        redirect_uri: req.headers.origin + '/login'
    };

    let host = 'http://' + req.headers.host
    let param = req.body;
    let code = param.code || '';
    if (code == '') {
        res.json({ message: '请输入正确参数！', code: 103, result: false });
        return;
    }
    request({
        url: githubConfig.access_token_url,
        timeout: timeout,
        method: 'POST', //请求方式
        form: {
            grant_type: 'authorization_code',
            code: code,
            client_id: githubConfig.client_ID,
            client_secret: githubConfig.client_Secret,
            redirect_uri: githubConfig.redirect_uri
        }
    }, (error, response, redata) => {
        if (!error && response.statusCode == 200) {
            let body = JSON.parse(redata);
            request({
                url: githubConfig.access_token_url,
                timeout: timeout,
                method: 'POST', //请求方式
                form: {
                    grant_type: 'refresh_token',
                    refresh_token: body.refresh_token
                },
                headers: config.oauth.gitee.headers
            }, (error, response, resbody) => {
                if (!error) {
                    let data = JSON.parse(resbody);
                    // 获取用户信息
                    request({
                        url: githubConfig.user_info_url,
                        timeout: timeout,
                        form: {
                            access_token: data.access_token
                        }
                    }, (error, response, resbody) => {
                        if (!error) {

                            // 将获取到的数据存入数据库
                            let data = JSON.parse(resbody)
                            request({
                                method: 'POST', //请求方式
                                timeout: timeout,
                                url: `${host}/swd/person/user`,
                                form: {
                                    name: data.login,
                                    petname: data.name,
                                    // password: data.email,
                                    password: data.email ? data.email : data.id,
                                    url: data.avatar_url,
                                    web: data.blog,
                                    speech: data.bio,
                                    // date: data.created_at,
                                    // role: data.type,
                                    git: data.html_url,
                                    email: data.email,
                                    mark: 'oauth',
                                    type: 'y',
                                    admin: "1"
                                }
                            }, (error, response, body) => {
                                if (!error && response.statusCode == 200) {
                                    let data = JSON.parse(body);
                                    res.json({
                                        code: 200, result: true, data
                                    });
                                } else {
                                    console.log(error);
                                    res.json({ result: false, code: 500 });
                                }
                            });
                        } else {
                            console.log(error);
                            res.json({ message: '获取用户信息失败！', code: 104, result: false });
                        };
                    })

                } else {
                    console.log(error);
                    res.json({ message: '获取用户信息失败！', code: 102, result: false });
                }
            })
        } else {
            console.log(error);
            res.json({ message: '获取用户信息失败！', code: 101, result: false });
        }
    })
});
router.post('/gitlab', (req, res, next) => {
    let githubConfig = {
        // 客户ID
        client_ID: config.oauth.gitlab.client_ID,
        // 客户密匙
        client_Secret: config.oauth.gitlab.client_Secret,
        // 获取 access_token
        access_token_url: config.oauth.gitlab.access_token_url,
        // 获取用户信息
        user_info_url: config.oauth.gitlab.user_info_url,
        // 回调地址
        redirect_uri: req.headers.origin + '/login'
    };

    let host = 'http://' + req.headers.host
    let param = req.body;
    let code = param.code || '';
    if (code == '') {
        res.json({ message: '请输入正确参数！', code: 103, result: false });
        return;
    };
    request({
        url: githubConfig.access_token_url,
        timeout: timeout,
        method: 'POST', //请求方式
        form: {
            grant_type: 'authorization_code',
            code: code,
            client_id: githubConfig.client_ID,
            client_secret: githubConfig.client_Secret,
            redirect_uri: githubConfig.redirect_uri
        }
    }, (error, response, redata) => {
        if (!error && response.statusCode == 200) {
            let body = JSON.parse(redata);
            // 获取用户信息
            request({
                url: githubConfig.user_info_url,
                timeout: timeout,
                form: {
                    access_token: body.access_token
                }
            }, (error, response, resbody) => {
                if (!error) {

                    // 将获取到的数据存入数据库
                    let data = JSON.parse(resbody);
                    request({
                        method: 'POST', //请求方式
                        timeout: timeout,
                        url: `${host}/swd/person/user`,
                        form: {
                            name: data.name,
                            petname: data.username,
                            password: data.email ? data.email : data.id,
                            url: data.avatar_url,
                            web: data.web_url,
                            git: data.web_url,
                            email: data.email,
                            mark: 'oauth',
                            type: 'y',
                            admin: "1"
                        }
                    }, (error, response, body) => {
                        if (!error && response.statusCode == 200) {
                            let data = JSON.parse(body);
                            res.json({
                                code: 200, result: true, data
                            });
                        } else {
                            console.log(error);
                            res.json({ result: false, code: 500 });
                        }
                    });
                } else {
                    console.log(error);
                    res.json({ message: '获取用户信息失败！', code: 104, result: false });
                };
            })
        } else {
            console.log(error);
            res.json({ message: '获取用户信息失败！', code: 101, result: false });
        }
    })
});


// // 获取第三方登录信息
// router.post('/config', (req, res, next) => {
//     //读取配置文件
//     let configObj = {}
//     if (config.oauth && config.oauth.github && config.oauth.github.state) {
//         configObj.github = config.oauth.github.client_ID
//     }
//     if (config.oauth && config.oauth.gitee && config.oauth.gitee.state) {
//         configObj.gitee = config.oauth.gitee.client_ID
//     }
//     if (config.oauth && config.oauth.gitlab && config.oauth.gitlab.state) {
//         configObj.gitlab = config.oauth.gitlab.client_ID
//     }
//     if (config.email && config.email.state) {
//         configObj.email = config.email.state
//     }

//     //记录访问量
//     fs.readFile(path.resolve(__dirname, "../../log/webParame.json"), 'utf8', function (err, data) {
//         if (!err && data) {
//             data = JSON.parse(data);
//             data.visits = data.visits * 1 + 1
//             config.visits = data.visits
//             fs.writeFile(path.resolve(__dirname, "../../log/webParame.json"), JSON.stringify(data), 'utf8', function (error) {
//                 if (error) { console.log(error); }
//             })
//         } else { console.log(err); }
//         res.json({ code: 200, result: true, data: configObj });
//     });
// });
module.exports = router;