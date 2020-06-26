/*
 *  github 第三方 登录
 */
const express = require('express');
const router = express.Router();
const request = require('request');
var githubConfig = {
    // 客户ID
    client_ID: '8b089dc0bdefbbfc7d95',
    // 客户密匙
    client_Secret: '61f6952cb122165e69f19f448491054500249715',
    // 获取 access_token
    // eg: https://github.com/login/oauth/access_token?client_id=7***************6&client_secret=4***************f&code=9dbc60118572de060db4&redirect_uri=http://manage.hgdqdev.cn/#/login
    access_token_url: 'https://github.com/login/oauth/access_token',
    // 获取用户信息
    // eg: https://api.github.com/user?access_token=86664b010dbb841a86d4ecc38dfeb8ac673b9430&scope=&token_type=bearer
    user_info_url: 'https://api.github.com/user?',
    // 回调地址
    redirect_uri: 'http://localhost:8080/#/login'
}
router.post('/github', (req, res, next) => {
    // var param = req.query || req.params;
    var param = req.body;
    var code = param.code || '';
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
            var urlStr = githubConfig.user_info_url + body;
            request({
                url: urlStr,
                headers: { 'User-Agent': 'zlluGitHub' }
            }, (error, response, resbody) => {
                if (!error) {
                    res.json({ msg: '用户信息获取成功！', code: 200, result: true, data: JSON.parse(resbody) });
                } else {
                    res.json({ msg: '获取用户信息失败！', code: 102, result: false });
                }
            })
        } else {
            // res.end(JSON.stringify({
            //     msg: '获取用户信息失败',
            //     status: 101
            // }));
            res.json({ msg: '获取用户信息失败！', code: 101, result: false });
        }
    }
    )
});

module.exports = router;