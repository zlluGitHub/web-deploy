let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let userSchema = new Schema({
    name: { //姓名
        type: String,
        default: ""
        // unique: true,
    },
    petname: { //昵称
        type: String,
        default: ""
        // unique: true,
    },
    password: { //密码
        type: String,
        default: ""
    },
    speech:{ //哲言 || 个人介绍
        type: String,
        default: ""
    },
    position:{ //位置坐标 || 居住地
        type: String,
        default: ""
    },
    date:{ //加入时间
        type: String,
        default: ""
    },
    role:{ //角色
        type: String,
        default: ""
    },
    url: { //头像地址
        type: String,
        default: "/assets/img/dt.png"
    },
    sex: {  //性别
        type: String,
        default: ""
    },
    email: { //电子邮件
        type: String,
        default: ""
    },
    wechat: { //微信
        type: String,
        default: ""
    },
    qq: { //qq
        type: String,
        default: ""
    },
    mark: { // 是否第三方登录 oauth  self
        type: String, 
        default: ""
    },
    web: { //个人主页 || 网站域名
        type: String,
        default: ""
    },
    phone: { //联系方式
        type: String,
        default: ""
    },
    bid: { //唯一标识
        type: String,
        default: ""
    } ,
    git: { //git
        type: String,
        default: ""
    } ,
    admin:{ //是否为管理员
        type: String,
        default: "0" // "0"是 "1"否 
    }
});

// 输出(导出);
module.exports = mongoose.model('sd_users', userSchema);



