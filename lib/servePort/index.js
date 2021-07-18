const express=require("express"),proxy=require("http-proxy-middleware"),history=require("connect-history-api-fallback"),net=require("net"),path=require("path"),compression=require("compression"),{handleError,handleSuccess}=require("../public/javascripts"),database=require("../database/index.js");let portIsOccupied=port=>new Promise((resolve,reject)=>{let server=net.createServer().listen(port);server.on("listening",()=>{server.close(),resolve()}),server.on("error",function(err){reject()})}),closeServer=(data,res)=>new Promise(async(resolve,reject)=>{global.appServer[data.bid]&&(global.appServer[data.bid].close(),global.appServer[data.bid]=null),await portIsOccupied(data.port).then(async()=>{await database.updateDeploy({bid:data.bid,isServer:!1}),resolve()}).catch(err=>{reject()})}),openServer=(data,res)=>new Promise(async(resolve,reject)=>{await handleSuccess({message:"Opening Web Service, please wait...",data:data});let app=express();if("history"===data.router?(app.use(history()),await handleSuccess({message:'Project service routing has been configured to "history" mode.',data:data})):handleSuccess({message:'Project service routing has been configured to "hash" mode.',data:data}),data.gzip&&(app.use(compression()),await handleSuccess({message:"Gzip compression started successfully.",data:data})),data.proxy&&data.proxy.length){await handleSuccess({message:"Configuring agent, please wait...",data:data});let commitArr=[];data.proxy.forEach((item,rewrite)=>{if(data.proxy[rewrite].rewrite&&data.proxy[rewrite].target){let pathRewrite={};rewrite="/"===item.rewrite.slice(0,1)?item.rewrite:`/${item.rewrite}`;pathRewrite["^"+rewrite]="",app.use(`${rewrite}/**`,proxy.createProxyMiddleware({target:item.target,changeOrigin:!0,pathRewrite:pathRewrite})),commitArr.push({message:"Agent ["+rewrite+"] - > ["+item.Target+"] configured successfully！"})}}),await handleSuccess({message:commitArr,data:data})}app.use(express.static(path.join(__dirname,"../../www/"+data.www)));let server=app.listen(data.port);server.on("error",error=>{reject(error)}),server.on("listening",async()=>{global.appServer[data.bid]=server;let obj={isServer:!0,bid:data.bid};data.router&&(obj.router=data.router),data.gzip&&(obj.gzip=data.gzip),data.proxy&&(obj.proxy=data.proxy),data.port&&(obj.port=data.port),data.git&&(obj.git=data.git),await database.updateDeploy(obj),await handleSuccess({message:`Service ${data.port} port started successfully`,data:data}),resolve()})});function portInUse(port){return new Promise((resolve,reject)=>{let server=net.createServer().listen(port);server.on("listening",function(){server.close(),resolve(port)}),server.on("error",function(err){"EADDRINUSE"==err.code&&resolve(err)})})}const tryUsePort=async function(port,portAvailableCallback){await portInUse(port)instanceof Error?(console.log(`端口：${port}被占用`),port++,tryUsePort(port,portAvailableCallback)):portAvailableCallback(port)};module.exports={openServer:openServer,closeServer:closeServer,tryUsePort:tryUsePort,portInUse:portInUse,portIsOccupied:portIsOccupied};