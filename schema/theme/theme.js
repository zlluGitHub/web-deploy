let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let themeSchema = new Schema({
    name: {
        type: String,
        default: ""
    },
    color: {
        type: String,
        default: ""
    }
});

// 输出(导出);
module.exports = mongoose.model('sd_themes', themeSchema);



