let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const tools = require("../../public/javascripts/tools");
let taskSchema = new Schema({
    title: { //标题
        type: String,
        default: ""
    },
    project: { //所属项目
        type: String,
        default: ""
    },
    assign: { //指派
        type: String,
        default: ""
    },
    send: { //抄送
        type: String,
        default: ""
    },
    level: { //级别
        type: String,
        // default: tools.random()
        default: ""
    },
    author: { //创建者
        type: String,
        default: ""
    },
    url: {
        type: String,
        default: "/assets/img/dt.png"
    },
    date: {
        type: String,
        default: tools.dateTime()
    },
    state: { //当前状态
        type: String,
        default: ""
    },
    type: { // 任务类型
        type: String,
        default: ""
    },
    step: { // 重现步骤
        type: String,
        default: ""
    },
    remarks: { //备注
        type: String,
        default: ""
    },
    appendix: { //附件
        type: String,
        default: ""
    }
});

module.exports = mongoose.model('sd_tasks', taskSchema);



