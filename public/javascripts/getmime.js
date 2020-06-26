
const fs = require('fs');
/*获取后缀名的方法*/
function getMime(extname) {
    fs.readFile('../json/mime.json', (err, data) => {
        if (err) {
            console.log('mime.json文件不存在');
            return false;
        };
        let Mimes = JSON.parse(data.toString());
        return Mimes[extname] || 'text/html';
    });
}

module.exports = getMime;