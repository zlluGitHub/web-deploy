
const express = require("express");
const router = express.Router();

const tools = require("../public/javascripts/tools");
const logger = require("../logs/index");
const workflow = require('../workflow');



router.post('/webhook', async (req, res, next) => {
    let resBody = req.body; //Gitea
    let key = req.get('X-Gitee-Token'); //gitlab 

    await logger.getDeploy(key).then(async body => {
        body.commitBid = tools.getUid();
        body.time = tools.dateTime();
        if (body.isAuto) {

            await logger.saveCommit([
                {
                    type: 'start',
                    time: tools.dateTime(),
                    message: `准备构建${body.title}项目,请稍后...`
                }
            ], body.commitBid, body.bid).catch(async err => {
                logger.exitState()
            })

            await logger.updateDeploy(body).catch(async err => {
                await logger.updateCommit(
                    {
                        type: 'start',
                        message: err
                    }, body.commitBid).catch(err => {
                        // logger.exitState()
                    })
                let deployState = {
                    state: false,
                    type: 'start'
                }
                await logger.exitState({ commitBid: body.commitBid, deployState })
                await res.json({ message: err, state: deployState, code: 500 });
            })

            await workflow.initWebhook(body, res);

            let message = `项目${body.title}已构建成功！`
            await logger.updateCommit({
                type: 'port',
                message
            }, body.commitBid).catch(err => {
                // logger.exitProcess()
            })

            let deployState = {
                state: true,
                type: 'port'
            }

            await logger.exitState({
                commitBid: body.commitBid,
                deployState,
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
                }
            }, 'noExit')

        }

        res.json({ message, state: deployState, code: 200 });

    }).catch(err => {
        res.json({ message: err, code: 500 });
    })

});

module.exports = router;







