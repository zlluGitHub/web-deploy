const nodemailer = require("nodemailer");
const config = require('../../config.json');
// 参数：发件人，收件人，主题，正文（支持html格式）
function sendMail(tos, msg) {
    let from = config.email.from;
    let aliasName = '前端自动化部署平台';
    let subject = config.email.subject;
    const smtpTransport = nodemailer.createTransport({
        host: config.email.host,
        // secureConnection: true, // use SSL
        secure: true,
        port: config.email.port,
        auth: {
            user: from,
            pass: config.email.password
        }
    });

    smtpTransport.sendMail({
        from: aliasName + ' ' + '<' + from + '>', //发件人
        to: tos,//'li@latelee.org, latelee@163.com',//收件人，多个邮箱地址间用英文逗号隔开
        subject: subject,//邮件主题
        //text    : msg,
        html: msg //正文（支持html格式）
    }, function (err, res) {
        if (err) {
            console.log('error: ', err);
        }
    });
}

module.exports = { sendMail };
