
let mongoose = require('mongoose');
const tools = require("../../public/javascripts/tools");
let Schema = mongoose.Schema;
let feedbackSchema = new Schema({
    bid: {
        type: String,
        default: ""
    },
    userId: {
        type: String,
        // default: tools.random()
        default: ""
    },
    date: {
        type: String,
        default: tools.dateTime()
    },
    content: {
        type: String,
        default: ""
    },
    state: {
        type: String,
        default: ""
    }
});

// 输出(导出);
module.exports = mongoose.model('sd_feedbacks', feedbackSchema);



