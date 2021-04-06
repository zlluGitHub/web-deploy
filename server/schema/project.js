let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let projectSchema = new Schema({
    url: { //项目封面
        type: String,
        default: "/assets/img/dt.png"
    },
    userId: { //用户id
        type: String,
        default: "" 
    },
    isAuto: { //是否关闭自动部署
        type: String,
        default: ""//yes 或 no
    },
    isPort: { //是否关闭端口
        type: String,
        default: "" //yes 或 no
    },
    isHistory: { //是否关闭刷新404问题
        type: String,
        default: "" //yes 或 no
    },
    projectName: {  //所属项目
        type: String,
        default: ""
    },
    root: { //部署根目录
        type: String,
        default: ""
    },
    port: { //端口号
        type: String,
        default: ""
    },
    target: { //代理接口
        type: String,
        default: ""
    },
    key: { //秘钥key
        type: String,
        default: ""
    },
    portState: { //端口状态
        type: String,
        default: "" // 0 关闭 1打开
    },
    webUrl: { //网站访问链接
        type: String,
        default: ""
    },
    versionRoot: { //版本号目录
        type: String,
        default: ""
    },
    version: { //版本号
        type: String,
        default: ""
    },
    idDeployment: { //是否部署
        type: String,
        default: ""
    },
    remark: { //摘要
        type: String,
        default: ""
    },
    catalog: { //上传时的根目录
        type: String,
        default: ""
    },
    bid: { //唯一标识
        type: String,
        default: ""
    } ,
    time: { //时间
        type: String,
        default: ""
    },
    // 自动化部分
    dist: { //打包目录
        type: String,
        default: ""
    }, 
    mode: { //部署方式
        type: String,
        default: ""
    }, 
    branch: { //分支
        type: String,
        default: ""
    }, 
    order: { //命令
        type: String,
        default: ""
    }, 
    gitUrl: { //git地址
        type: String,
        default: ""
    }, 

    proxy: { // 代理
        type: String,
        default: "[]"
    }, 
});

// 输出(导出);
module.exports = mongoose.model('swd_project', projectSchema);
