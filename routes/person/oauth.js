/*
 *  github 第三方 登录
 */
const express = require('express');
const router = express.Router();
const request = require('request');


router.post('/github', (req, res, next) => {
    // let param = req.query || req.params; 
    // console.log(req.headers.host); //server地址 host: 'localhost:82'
    // console.log(req.headers.origin); //客户端请求地址 origin: 'http://localhost:8080'
    let githubConfig = {
        // 客户ID
        // client_ID: '8b089dc0bdefbbfc7d95',
        client_ID: '597827f3b2327150f3d7',
        // 客户密匙
        // client_Secret: '61f6952cb122165e69f19f448491054500249715',
        client_Secret: 'e9a3d245b0842f4a1d619234ff00c3bdfd8382a0',
        // 获取 access_token
        // eg: https://github.com/login/oauth/access_token?client_id=7***************6&client_secret=4***************f&code=9dbc60118572de060db4&redirect_uri=http://manage.hgdqdev.cn/#/login
        access_token_url: 'https://github.com/login/oauth/access_token',
        // 获取用户信息
        // eg: https://api.github.com/user?access_token=86664b010dbb841a86d4ecc38dfeb8ac673b9430&scope=&token_type=bearer
        user_info_url: 'https://api.github.com/user?',
        // 回调地址
        redirect_uri: req.headers.origin + '/login'
    };
    let host = 'http://' + req.headers.host;
    let param = req.body;
    let code = param.code || '';
    if (code == '') {
        res.json({ msg: '请输入正确参数！', code: 103, result: false });
        return;
    }
    request({
        url: githubConfig.access_token_url,
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
                headers: { 'User-Agent': 'zlluGitHub' }
            }, (error, response, resbody) => {
                if (!error) {
                    let data = JSON.parse(resbody);
                    // 将获取到的数据存入数据库

                    request({
                        method: 'POST', //请求方式
                        url: `${host}/api/person/user`,
                        form: {
                            name: data.login,
                            petname: data.name,
                            password: data.id,
                            speech: data.bio,
                            date: data.created_at,
                            role: data.type,
                            url: data.avatar_url,
                            web: data.blog,
                            bid: data.node_id,
                            mark: 'oauth',
                            type: 'y',
                            admin: "1"
                        }
                    }, (error, response, body) => {
                        if (!error && response.statusCode == 200) {
                            res.json({
                                code: 200, result: true, data: {
                                    name: data.login,
                                    password: data.id
                                }
                            });
                        } else {
                            console.log(error);
                            res.json({ result: false, code: 500 });
                        }
                    });
                } else {
                    console.log(error);
                    res.json({ msg: '获取用户信息失败！', code: 102, result: false });
                }
            })
        } else {
            // res.end(JSON.stringify({
            //     msg: '获取用户信息失败',
            //     status: 101
            // }));
            console.log(error);
            res.json({ msg: '获取用户信息失败！', code: 101, result: false });
        }
    }
    )
});

router.post('/gitee', (req, res, next) => {
    let githubConfig = {
        // 客户ID
        // client_ID: 'f8747cff265598b49d5490eec1b922e362c99a332e2ba5592124af3a98884464',
        client_ID: 'e4762d9e0e22e30c129ba61b235a1bfafcefbb5b58e46e2301c15ae6c514e0be',
        // 客户密匙
        // client_Secret: '70a6aa2f40d2f744236457652d57f2c7220735097d5ab61a0c8ffa569f67f218',
        client_Secret: 'eb84418e5dda4240e94f11885090e43478fcc6cb23b902785b2c1f4ea84c26ba',
        // 获取 access_token
        access_token_url: 'https://gitee.com/oauth/token',
        // 获取用户信息
        user_info_url: 'https://gitee.com/api/v5/user',
        // 回调地址
        redirect_uri: req.headers.origin + '/login'
    };

    let host = 'http://' + req.headers.host
    let param = req.body;
    let code = param.code || '';
    if (code == '') {
        res.json({ msg: '请输入正确参数！', code: 103, result: false });
        return;
    }
    request({
        url: githubConfig.access_token_url,
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
            // console.log(body);

            request({
                url: githubConfig.access_token_url,
                method: 'POST', //请求方式
                form: {
                    grant_type: 'refresh_token',
                    refresh_token: body.refresh_token
                },
                headers: { 'User-Agent': 'zlluGitHub' }
            }, (error, response, resbody) => {
                if (!error) {
                    let data = JSON.parse(resbody);
                    // 获取用户信息
                    request({
                        url: githubConfig.user_info_url,
                        form: {
                            access_token: data.access_token
                        }
                    }, (error, response, resbody) => {
                        if (!error) {

                            // 将获取到的数据存入数据库
                            let data = JSON.parse(resbody)
                            request({
                                method: 'POST', //请求方式
                                url: `${host}/api/person/user`,
                                form: {
                                    name: data.login,
                                    petname: data.name,
                                    password: data.id,
                                    url: data.avatar_url,
                                    web: data.blog,
                                    speech: data.bio,
                                    date: data.created_at,
                                    role: data.type,
                                    git: data.html_url,
                                    email: data.email,
                                    mark: 'oauth',
                                    type: 'y',
                                    admin: "1"
                                }
                            }, (error, response, body) => {
                                if (!error && response.statusCode == 200) {
                                    res.json({
                                        code: 200, result: true, data: {
                                            name: data.login,
                                            password: data.id
                                        }
                                    });
                                } else {
                                    console.log(error);
                                    res.json({ result: false, code: 500 });
                                }
                            });
                        } else {
                            console.log(error);
                            res.json({ msg: '获取用户信息失败！', code: 104, result: false });
                        };
                    })

                } else {
                    console.log(error);
                    res.json({ msg: '获取用户信息失败！', code: 102, result: false });
                }
            })
        } else {
            // res.end(JSON.stringify({
            //     msg: '获取用户信息失败',
            //     status: 101
            // }));
            console.log(error);
            res.json({ msg: '获取用户信息失败！', code: 101, result: false });
        }
    }
    )
});

module.exports = router;