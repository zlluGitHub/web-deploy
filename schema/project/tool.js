
let mongoose = require('mongoose');
const tools = require("../../public/javascripts/tools");
let Schema = mongoose.Schema;
let toolSchema = new Schema({
    bid: { 
        type: String,
        default: ""
    },
   
    name: {
        type: String,
        // default: tools.random()
        default: ""
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
    tip: {
        type: String,
        default: ""
    },
    href: {
        type: String,
        default: ""
    },
    imgUrl: {
        type: String,
        default: ""
    }
});

// 输出(导出);
module.exports = mongoose.model('sd_tools', toolSchema);



