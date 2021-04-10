let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let editionSchema = new Schema({
    title: {  //所属项目
        type: String,
        default: ""
    },
    proxy: { // 代理
        type: Array,
        default: []
    },
    dist: { //打包目录
        type: String,
        default: ""
    },
    remark: { //摘要
        type: String,
        default: ""
    },
    git: { //git地址
        type: String,
        default: ""
    },
    www: { //部署根目录
        type: String,
        default: ""
    },
    port: { //端口号
        type: String,
        default: ""
    },
    branch: { //分支
        type: String,
        default: ""
    },
    bid: { //唯一标识
        type: String,
        default: ""
    },
    time: { //时间
        type: String,
        default: ""
    }, 
    build: { // 打包
        type: String,
        default: ""
    },
});

// 输出(导出);
module.exports = mongoose.model('swd_deploys', editionSchema);
