const fs=require("fs"),path=require("path");function dateTime(){let date=new Date;let month=date.getMonth()+1,strDate=date.getDate();1<=month&&month<=9&&(month="0"+month),0<=strDate&&strDate<=9&&(strDate="0"+strDate);let hours=date.getHours();0<=hours&&hours<=9&&(hours="0"+hours);let minutes=date.getMinutes();0<=minutes&&minutes<=9&&(minutes="0"+minutes);let seconds=date.getSeconds();return 0<=seconds&&seconds<=9&&(seconds="0"+seconds),date.getFullYear()+"-"+month+"-"+strDate+" "+hours+":"+minutes+":"+seconds}function dateTimeSeconds(){let date=new Date;let hours=date.getHours();0<=hours&&hours<=9&&(hours="0"+hours);let minutes=date.getMinutes();0<=minutes&&minutes<=9&&(minutes="0"+minutes);let seconds=date.getSeconds();return 0<=seconds&&seconds<=9&&(seconds="0"+seconds),hours+":"+minutes+":"+seconds}function getUid(){function S4(){return(65536*(1+Math.random())|0).toString(16).substring(1)}return S4()+S4()+S4()+S4()+S4()+S4()+S4()+S4()+S4()}function checkImgType(ths){return""===ths?(console.log("请上传图片"),!1):!!/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(ths)}function setPage(list,pageNo,pageSize,sort){if(0===list.length)return{list:[],total:0};pageNo=0==+pageNo?1:+pageNo,pageSize=+pageSize;let start=null,end=null;return sort&&"drop"!==sort||(list=list.reverse()),pageNo&&pageSize?(0<pageNo&&(start=(pageNo-1)*pageSize,end=start+pageSize),{list:list.slice(start,end),total:list.length}):{list:list,total:list.length}}function random(m,n){return Math.floor(Math.random()*(m-n)+n)}function exitProcess(){someConditionNotMet()&&(printUsageToStdout(),process.exitCode=1)}function mkdirsSync(dirname){return!!fs.existsSync(dirname)||(mkdirsSync(path.dirname(dirname))?(fs.mkdirSync(dirname),!0):void 0)}const createFile=async(dir,content)=>{return fs.existsSync(dir)||await mkdirsSync(dir.slice(0,dir.lastIndexOf("/"))),new Promise((resolve,reject)=>{fs.writeFile(dir,content,err=>{err?(console.log(err),reject(err)):resolve()})})};module.exports={dateTime:dateTime,getUid:getUid,checkImgType:checkImgType,setPage:setPage,random:random,dateTimeSeconds:dateTimeSeconds,exitProcess:exitProcess,mkdirsSync:mkdirsSync,createFile:createFile};