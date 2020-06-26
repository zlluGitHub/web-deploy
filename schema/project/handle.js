
let mongoose = require('mongoose');
const tools = require("../../public/javascripts/tools");
let Schema = mongoose.Schema;
let handleSchema = new Schema({
    bid: { 
        type: String,
        default: ""
    },
    project: {
        type: String,
        default: ""
    },
    describe: {
        type: String,
        // default: tools.random()
        default: ""
    },
    browse: {
        type: String, //浏览次数
        default: "0"
    },
    user: {
        type: String,
        default: ""
    },
    userId: {
        type: String,
        default: ""
    },
    userSrc: {
        type: String,
        default: ""
    },
    date: {
        type: String,
        default: tools.dateTime()
    },
    href: {
        type: String,
        default: ""
    },
    laboratoryType: {
        type: String,
        default: ""
    },
    type: {
        type: String,
        default: ""
    },
    gitUrl: {
        type: String,
        default: ""
    },
    imgUrl: {
        type: String,
        default: ""
    }
});

// 输出(导出);
module.exports = mongoose.model('sd_handles', handleSchema);



