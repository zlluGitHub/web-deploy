
let mongoose = require('mongoose');
const tools = require("../../public/javascripts/tools");
let Schema = mongoose.Schema;
let templateSchema = new Schema({
    title: {
        type: String,
        default: ""
        // unique: true,
    },
    type: {
        type: String,
        default: ""
    },
    look: {
        type: Number,
        // default: tools.random()
        default: 1
    },
    star: {
        type: Number,
        default: 1
    },
    author: {
        type: String,
        default: ""
    },
    url: {
        type: String,
        default: "/assets/img/dt.png"
    },
    imgSrc: {
        type: String,
        default: "/assets/img/df.png"
    },
    explain: {
        type: String,
        default: ""
    },
    date: {
        type: String,
        default: tools.dateTime()
    },
    chartClass: {
        type: String,
        default: "0"  //"0"代表echarts "1"代表其他图表
    },
    publish: {
        type: String,
        default: "yes"  //"yes"代表发布 "no"代表保存草稿
    }
});

// 输出(导出);
module.exports = mongoose.model('sd_templates', templateSchema);
// 定义一个模型，可以根据这个模型调用其API方法。
// 这个模型定义的是数据库的goods集合数据，所以这个model取名good是对应这个集合，连接数据库之后，这个模型会根据名字的复数形式"goods"来查找数据集合。
// module.exports = mongoose.model('good',produtSchema,'goods'); 也可以后面注明链接的是数据库的goods集合



