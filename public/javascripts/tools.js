// 获取当前时间
function dateTime() {
    let date = new Date();
    let seperator1 = "-";
    let seperator2 = ":";
    let month = date.getMonth() + 1;
    let strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    };
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    };

    let hours = date.getHours();
    if (hours >= 0 && hours <= 9) {
        hours = "0" + hours;
    };

    let minutes = date.getMinutes();
    if (minutes >= 0 && minutes <= 9) {
        minutes = "0" + minutes;
    };

    let seconds = date.getSeconds();
    if (seconds >= 0 && seconds <= 9) {
        seconds = "0" + seconds;
    };

    let currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
        + " " + hours + seperator2 + minutes
        + seperator2 + seconds;
    return currentdate;
};

//生成随机ID
function getUid() {
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return (S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4());
}
/*  
 * 判断图片类型  
 */
function checkImgType(ths) {
    if (ths === "") {
        console.log("请上传图片");
        return false;
    } else {
        if (!/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(ths)) {
            return false;
        }
    }
    return true;
}
/*  
 * 分页查询  
 */
function setPage(list, pageNo, pageSize, sort) {
    pageNo = pageNo * 1 === 0 ? 1 : pageNo * 1;
    pageSize = pageSize * 1;
    let start = null, end = null;
    // 排序 (rise)升序 ("" 或 drop)降序
    if (!sort || sort === "drop") {
        list = list.reverse();
    };

    if (pageNo && pageSize) {
        if (pageNo > 0) {
            start = (pageNo - 1) * pageSize;
            end = start + pageSize;
        };
        return {
            list: list.slice(start, end),
            total: list.length
        };
    } else {
       
        return {
            list: list,
            total: list.length
        };
    };
}
function random(m, n) {
    return Math.floor(Math.random() * (m - n) + n);
}
module.exports = { dateTime, getUid, checkImgType, setPage, random };