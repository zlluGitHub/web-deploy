let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let commitSchema = new Schema({
    projectId: {  //所属项目
        type: String,
        default: ""
    },
    // commitId: {
    //     type: String,
    //     default: ""
    // },
    userId: {
        type: String,
        default: ""
    },
    startTime: {
        type: String,
        default: ""
    },
    endTime: {
        type: String,
        default: ""
    },
    // deployState: {
    //     type: String,
    //     default: ""
    // },
    log: {
        type: Array,
        default: []
    },
    bid: {
        type: String,
        default: ""
    }
});

// 输出(导出);
module.exports = mongoose.model('swd_commits', commitSchema);
