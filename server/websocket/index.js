const ws = require("nodejs-websocket")
// let AllUserData = new Array()
// Scream server example: "hi" -> "HI!!!"
module.exports = (callBack) => {
    ws.createServer((conn) => {
        console.log("New connection")
        // conn.on("text",  (str) {
        //     AllUserData.push({
        //         'id': str,
        //         'ws': conn
        //     })
        //     // conn.sendText(str.toUpperCase() + "!!!")

        // })
        callBack(conn)
        conn.on("close", (code, reason) => {
            console.log("Connection closed")
            // 当用户退出的时候捕捉到退出的用户
            // for (let i = 0 in AllUserData) {
            //     if (AllUserData[i].ws == conn) {
            //         console.log(AllUserData[i])
            //     }
            // }
        })
        conn.on("error", function (code, reason) {
            console.log("异常关闭")
          });
        global.socketConn = conn;
    }).listen(8001)
}
// console.log(global.socketConn);