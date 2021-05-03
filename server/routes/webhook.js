
const express = require("express");
const router = express.Router();

const tools = require("../public/javascripts/tools");
const logger = require("../logs/index");
const workflow = require('../workflow');
const database = require('../database/index.js');


router.post('/webhook', (req, res, next) => {
    let resBody = req.body; //Gitea
    let key = req.get('X-Gitee-Token'); //gitlab 
    database.getDeploy(key).then(async body => {
        console.log(body);
        if (body && body.isAuto) {

            body.commitBid = tools.getUid();
            body.time = tools.dateTime();

            await database.updateDeploy(body).then(() => {
                console.log(`项目【${body.title}】信息更新成功！`)
            })

            await database.saveCommit({
                bid: body.commitBid,
                projectId: body.bid,
                hookPayload: {
                    isExit: true,
                    before: resBody.before,
                    after: resBody.after,
                    url: resBody.commits[0].url,
                    added: resBody.commits[0].added,
                    removed: resBody.commits[0].removed,
                    modified: resBody.commits[0].modified,
                    commitId: resBody.after,
                    message: resBody.commits[0].message
                },
                activeType: 'gitHook'
            }).then(() => {
                console.log(`项目【${body.title}】日志信息创建成功！`)
            })

            // 开始创建
            await logger.setlog({
                bid: body.commitBid,
                log: {
                    message: `开始准备构建【${body.title}】项目，请稍后...`
                }
            }, true)

            // 任务流开始 
            await workflow.initWebhook(body, res);

            await logger.setlog({
                log: {
                    message: '开始配置项目运行服务环境相关信息，请稍后...',
                },
                deployState: {
                    state: 0,
                    type: 'deploy'
                },
                bid: body.commitBid
            }, true)

            let message = `项目【${body.title}】已构建完成！`;
            let deployState = {
                state: 1,
                type: 'deploy'
            }

            await logger.setlog({
                log: {
                    message,
                },
                deployState,
                bid: body.commitBid
            }, true)

        }
    })

    res.json({ code: 200 });
});

module.exports = router;







