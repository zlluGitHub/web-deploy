const express=require("express"),router=express.Router(),shell=require("shelljs"),path=require("path"),tools=require("../public/javascripts/tools"),workflow=require("../workflow"),deploySchema=require("../schema/deploy"),commitSchema=require("../schema/commit"),logger=require("../logs/index.js"),server=require("../servePort"),net=require("net"),database=require("../database/index.js");deploySchema.find({},(err,data)=>{err?console.log(err):data.forEach(item=>{item.isServer&&server.openServer(item,async(state,mes)=>{var message=state?`${item.title}项目重启成功！`:`${item.title}项目重启失败！`;await logger.setlog({bid:item.commitBid,log:{message:message}},!1)})})}),router.post("/openSocket",(req,res,next)=>{server.tryUsePort(8001,port=>{global.connect.server=global.ws.createServer(conn=>{(global.connect.conn=conn).on("connect",code=>{console.log("webSocket 已开启连接！",code)}),conn.on("close",(code,reason)=>{console.log("Connection closed")}),conn.on("error",(code,reason)=>{console.log("Connection error")})}).listen(port);let time=setTimeout(()=>{global.connect.server&&global.connect.server.close(),global.connect.server=null,clearTimeout(time)},3e5);res.json({message:"webSocket 服务已链接！",result:!0,code:200})})}),router.get("/get",async(p2,res,next)=>{let{pageSize,pageNo,bid,title}=p2.query;pageSize=pageSize?+pageSize:10,pageNo=pageNo?+pageNo-1:0;let filter={};bid&&(filter.bid=bid),title&&(filter.title={$regex:new RegExp(`${regExp}`,"gi")});var p1=new Promise((resolve,reject)=>{deploySchema.find(filter,{_id:0,__v:0},(err,data)=>{err?reject(err):resolve(data)}).skip(pageNo*pageSize).limit(pageSize).sort({_id:-1})}),p2=new Promise((resolve,reject)=>{deploySchema.find(filter).count((err,count)=>{err?reject(err):resolve(count)})});Promise.all([p1,p2]).then(async result=>{let proArr=[];result[0].forEach(async item=>{proArr.push(new Promise((resolve,reject)=>{commitSchema.find({bid:item.commitBid},async(endTime,data)=>{var startTime;endTime?reject(endTime):(startTime=new Date(data[0].startTime),endTime=new Date(data[0].endTime),item.startTime=data[0].startTime,item.endTime=data[0].endTime,item.deployState=data[0].deployState,item.hookPayload=data[0].hookPayload,item.duration=Math.floor((endTime-startTime)/1e3),resolve(item))})}))}),Promise.all(proArr).then(async data=>{res.json({data:data,count:result[1],code:200,result:!0})}).catch(error=>{console.log(error),res.json({result:!1,code:500})})}).catch(error=>{console.log(error),res.json({result:!1,code:500})})}),router.post("/init",async(deployState,res)=>{let body=deployState.body;var message;body.commitBid=tools.getUid(),body.bid=tools.getUid(),shell.which("git")?(await database.saveDeploy(body,res).then(()=>{console.log(`项目【${body.title}】信息创建成功！`)}),await database.saveCommit({bid:body.commitBid,projectId:body.bid,activeType:"init"},res).then(()=>{console.log(`项目【${body.title}】日志信息创建成功！`)}),await logger.setlog({bid:body.commitBid,log:{message:`开始准备构建【${body.title}】项目，请稍后...`}},!0,res),await workflow.initProject(body,res),await logger.setlog({log:{message:"开始配置项目运行服务环境相关信息，请稍后..."},deployState:{state:0,type:"deploy"},bid:body.commitBid},!0,res),body.port?(await server.portInUse(body.port)instanceof Error&&await server.closeServer(body,null,res),await server.openServer(body,null,res).then(async()=>{await database.updateDeploy({bid:body.bid,isServer:!0},res);var message=`构建完成，请访问（${body.port}）端口即可访问！`,deployState={state:1,type:"deploy"};await logger.setlog({log:{message:message},deployState:deployState,bid:body.commitBid},!0,res),res.json({message:message,key:body.bid,state:deployState,code:200})}).catch(async err=>{await database.updateDeploy({bid:body.bid,isServer:!1},res);var message=`项目【${body.title}】已构建失败！`,deployState={state:2,type:"deploy"};await logger.setlog({log:{message:message},deployState:deployState,bid:body.commitBid},!0,res),res.json({message:err,state:deployState,code:500})})):(message=`项目【${body.title}】已构建完成！`,deployState={state:1,type:"deploy"},await logger.setlog({log:{message:message},deployState:deployState,bid:body.commitBid},!0,res),res.json({message:message,key:body.bid,state:deployState,code:200}))):(res.json({message:"Git 命令不存在，请安装后再试！",result:!1,code:500}),shell.exit(1))}),router.post("/initReset",async(deployState,res,next)=>{let body=deployState.body;var message;body.commitBid=tools.getUid(),body.time=tools.dateTime(),shell.which("git")?(await database.updateDeploy(body,res).then(()=>{console.log(`项目【${body.title}】信息更新成功！`)}),await database.saveCommit({bid:body.commitBid,projectId:body.bid,activeType:"resetInit"},res).then(()=>{console.log(`项目【${body.title}】日志信息创建成功！`)}),await logger.setlog({bid:body.commitBid,log:{message:`开始准备构建【${body.title}】项目，请稍后...`}},!0,res),await workflow.initProject(body,res),await logger.setlog({log:{message:"开始配置项目运行服务环境相关信息，请稍后..."},deployState:{state:0,type:"deploy"},bid:body.commitBid},!0,res),body.port?(await server.portInUse(body.port)instanceof Error&&await server.closeServer(body,null,res),await server.openServer(body,null,res).then(async()=>{await database.updateDeploy({bid:body.bid,isServer:!0},res);var message=`项目【${body.title}】已构建完成，请访问（${body.port}）端口即可访问！`,deployState={state:1,type:"deploy"};await logger.setlog({log:{message:message},deployState:deployState,bid:body.commitBid},!0,res),res.json({message:message,key:body.bid,state:deployState,code:200})}).catch(async err=>{await database.updateDeploy({bid:body.bid,isServer:!1},res);var message=`项目【${body.title}】已构建失败！`,deployState={state:2,type:"deploy"};await logger.setlog({log:{message:message},deployState:deployState,bid:body.commitBid},!0,res),res.json({message:err,state:deployState,code:500})})):(message=`项目【${body.title}】已构建完成！`,deployState={state:1,type:"deploy"},await logger.setlog({log:{message:message},deployState:deployState,bid:body.commitBid},!0,res),res.json({message:message,key:body.bid,state:deployState,code:200}))):(res.json({message:"Git 命令不存在，请安装后再试！",code:500}),shell.exit(1))}),router.post("/relyInstall",async(req,res,next)=>{let body=req.body;body.commitBid=tools.getUid(),shell.which("git")?(await database.updateDeploy({bid:body.bid,commitBid:body.commitBid},res).then(()=>{console.log(`项目【${body.title}】信息更新成功！`)}),await database.saveCommit({bid:body.commitBid,projectId:body.bid,activeType:"install"},res).then(()=>{console.log(`项目【${body.title}】日志信息创建成功！`)}),await logger.setlog({bid:body.commitBid,log:{message:`项目${body.title}依赖正在重新安装中，请稍后...`}},!0,res),await workflow.initRely(body,res),await logger.setlog({log:{message:`项目${body.title}依赖已重新安装，项目更新部署成功！`},bid:body.commitBid},!0,res),await res.json({message:`项目${body.title}依赖已重新安装，项目更新部署成功！`,data:body.bid,code:200})):(res.json({message:"Git 命令不存在，请安装后再试！",result:!1,code:500}),shell.exit(1))}),router.post("/relyBuild",async(req,res,next)=>{let body=req.body;body.commitBid=tools.getUid(),shell.which("git")?(await database.updateDeploy({bid:body.bid,commitBid:body.commitBid},res).then(()=>{console.log(`项目【${body.title}】信息更新成功！`)}),await database.saveCommit({bid:body.commitBid,projectId:body.bid,activeType:"build"},res).then(()=>{console.log(`项目【${body.title}】日志信息创建成功！`)}),await logger.setlog({bid:body.commitBid,log:{message:`项目${body.title}正在重新打包中，请稍后...`}},!0,res),await workflow.initBuild(body,res),await logger.setlog({log:{message:`项目${body.title}已重新打包完成，项目更新部署成功！`},bid:body.commitBid},!0,res),await res.json({message:`项目${body.title}已重新打包完成，项目更新部署成功！`,data:body.bid,code:200})):(res.json({message:"Git 命令不存在，请安装后再试！",result:!1,code:500}),shell.exit(1))}),router.post("/relyReset",async(req,res,next)=>{let body=req.body;body.time=tools.dateTime(),shell.which("git")?(await database.updateDeploy({bid:body.bid,commitBid:body.commitBid},res).then(()=>{console.log(`项目【${body.title}】信息更新成功！`)}),await logger.setlog({bid:body.commitBid,log:{message:`准备构建${body.title}项目，请稍后...`}},!0,res),await workflow.initCommitReset(body,res),await logger.setlog({log:{message:`项目${body.title}项目更新部署成功！`},bid:body.commitBid},!0,res),await res.json({message:`项目${body.title}项目更新部署成功！`,data:body.bid,code:200})):(res.json({message:"Git 命令不存在，请安装后再试！",result:!1,code:500}),shell.exit(1))}),router.post("/updateInfo",(req,res,next)=>{let body=req.body;body.time=tools.dateTime(),deploySchema.updateOne({bid:body.bid},body,(err,data)=>{err?(console.log("错误信息：",err),res.json({message:body.title+"项目信息更新失败！",result:!1,code:500})):res.json({message:body.title+"项目信息更新成功！",data:body.bid,code:200})})}),router.post("/deleteInfo",async(result,res,next)=>{let body=result.body;body.projectPort&&(await server.portInUse(body.port)instanceof Error&&await server.closeServer(body,null,res),global.appServer[body.bid]=null),body.projectInfo&&(await database.deleteDeploy({bid:body.bid},res).then(()=>{console.log(`项目【${body.title}】信息删除成功！`)}),await database.deleteCommit({bid:body.bid},res).then(()=>{console.log(`项目【${body.title}】所有日志信息删除成功！`)})),body.projectBackups&&(result=await shell.exec(`rm -rf ./${body.www}`,{cwd:path.join(__dirname,"../../backups")}),console.log(result.stdout),console.log(result.stderr),result=await shell.exec(`rm -rf ./${body.www}`,{cwd:path.join(__dirname,"../../www")}),console.log(result.stdout),console.log(result.stderr)),res.json({message:body.title+"项目删除成功！",code:200})}),router.post("/saveInfo",async(req,res,next)=>{let body=req.body;body.time=tools.dateTime(),body.commitBid=tools.getUid(),body.bid=tools.getUid(),await logger.saveCommit([{type:"start",time:tools.dateTime(),message:`项目${body.title}信息正在保存，请稍后...`}],body.commitBid,body.bid).catch(err=>{res.json({message:err,state:{state:!1,type:"start"},code:500})}),await logger.saveDeploy(body).then(async()=>{var message=body.title+"项目信息保存成功！";res.json({message:message,data:body.bid,code:200}),await logger.updateCommit({type:"start",message:message},body.commitBid).catch(err=>{}),await logger.exitState({commitBid:body.commitBid,deployState:{state:!0,type:"start"}},"noExit")}).catch(async err=>{var message=body.title+"项目信息更新失败！";await logger.updateCommit({type:"start",message:message},body.commitBid).catch(err=>{}),await logger.exitState({commitBid:body.commitBid,deployState:{state:!1,type:"start"}},"noExit"),res.json({message:message,bid:body.bid,code:500})})}),router.post("/history",async(deployState,res,next)=>{let body=deployState.body;body.time=tools.dateTime();if(await logger.setlog({log:{message:"正在切换路由模式，请稍后..."},bid:body.commitBid},!0,res),body.port&&body.isServer)await server.portInUse(body.port)instanceof Error&&await server.closeServer(body,null,res),await server.openServer(body,null,res).then(async()=>{await database.updateDeploy({bid:body.bid,isServer:!0},res);var message=`项目${body.title}路由已成功切换至${body.router}模式！`,deployState={state:1,type:"deploy"};await logger.setlog({log:{message:message},deployState:deployState,bid:body.commitBid},!0,res),res.json({message:message,state:deployState,code:200})}).catch(async err=>{await database.updateDeploy({bid:body.bid,isServer:!1},res);var message=`项目${body.title}路由模式切换失败！`,deployState={state:2,type:"deploy"};await logger.setlog({log:{message:message},deployState:deployState,bid:body.commitBid},!0,res),res.json({message:err,state:deployState,code:500})});else{await database.updateDeploy({bid:body.bid,isServer:!0},res);let message=`项目${body.title}路由已成功切换至${body.router}模式！`;deployState={state:1,type:"deploy"};await logger.setlog({log:{message:message},deployState:deployState,bid:body.commitBid},!0,res),res.json({message:message,state:deployState,code:200})}}),router.post("/closeServer",async(message,res,next)=>{let body=message.body;await logger.setlog({log:{message:"正在关闭"+body.port+"端口服务，请稍后..."},bid:body.commitBid},!1,res),await server.portInUse(body.port)instanceof Error?(console.log(`项目【${body.title}】服务端口（${body.port}）已启用`),await server.closeServer(body,async(state,message)=>{state?(await database.updateDeploy({bid:body.bid,isServer:!1},res),res.json({message:message,data:body.bid,code:200})):res.json({message:message,code:500})})):(message=`项目【${body.title}】服务端口（${body.port}）早已关闭`,console.log(message),await database.updateDeploy({bid:body.bid,isServer:!1},res),res.json({message:message,data:body.bid,code:200}))}),router.post("/openServer",async(req,res,next)=>{let body=req.body;await logger.setlog({log:{message:"正在开启"+body.port+"端口服务，请稍后..."},bid:body.commitBid},!1,res),await server.portInUse(body.port)instanceof Error&&await server.closeServer(body,null,res),await server.openServer(body,async(state,message)=>{state?(await database.updateDeploy({bid:body.bid,isServer:!0},res),res.json({message:message,data:body.bid,code:200})):(await database.updateDeploy({bid:body.bid,isServer:!1},res),res.json({message:message,code:500}))})}),router.post("/portIsOccupied",(message,res,next)=>{let body=message.body;if(shell.which("git"))try{let server=net.createServer().listen(body.port);server.on("listening",()=>{server.close();var message=`此服务端口【${body.port}】未被占用！`;res.json({message:message,data:1,code:200})}),server.on("error",err=>{var message=`此服务端口【${body.port}】已被占用，请更换其他端口！`;res.json({message:message,data:2,code:200})})}catch(err){var message;"ERR_SOCKET_BAD_PORT"===err.code?(message=`服务端口【${body.port}】设置有误，应大于等于0且小于65536！`,res.json({message:message,data:3,code:200})):(message=`服务端口【${body.port}】异常，请检查后重试！`,res.json({message:message,data:4,code:200}))}else res.json({message:"Git 命令不存在，请安装后再试！",result:!1,code:500}),shell.exit(1)}),router.post("/isProject",(req,res,next)=>{console.log(req.body),deploySchema.find({title:req.body.title},(err,state)=>{err?(console.log(err),res.json({message:err,state:!1,code:500})):(state=0!==state.length,res.json({message:state?"此项目已存在！":"此项目暂不存在！",state:state,code:200}))})}),router.post("/isWwwFolder",(req,res,next)=>{deploySchema.find({},(err,data)=>{if(err)console.log(err),res.json({message:err,state:!1,code:500});else{let isExit=!1;data.forEach(item=>{item.www===req.body.www&&(isExit=!0)}),isExit?res.json({message:"此文件夹已存在！",state:!0,code:200}):res.json({message:"此文件夹暂不存在！",state:!1,code:200})}})}),router.post("/openAllServer",(req,res,next)=>{deploySchema.find({},async(err,data)=>{if(err)console.log(err),res.json({message:err,data:{},code:500});else{let result={all:0,error:0,success:0};for(let index=0;index<data.length;index++)data[index].port&&(result.all++,await server.portInUse(data[index].port)instanceof Error&&await server.closeServer(data[index],null,res),await server.openServer(data[index],async(state,message)=>{state?(await database.updateDeploy({bid:data[index].bid,isServer:!0},res),result.success++,console.log(`${data[index].title}项目开启状态更新成功！`)):(await database.updateDeploy({bid:data[index].bid,isServer:!1},res),result.error++,console.log(`${data[index].title}项目开启状态更新失败！`))}));res.json({message:"请求成功！",data:result,code:200})}})}),router.post("/closeAllServer",(req,res,next)=>{deploySchema.find({},async(err,data)=>{if(err)console.log(err),res.json({message:err,data:{},code:500});else{let result={all:0,error:0,success:0};for(let index=0;index<data.length;index++)data[index].port&&(result.all++,await server.closeServer(data[index]).catch(()=>{result.error++}),await database.updateDeploy({bid:data[index].bid,isServer:!1},res).then(()=>{result.success++,console.log(`项目${data[index].title}服务关闭状态更新成功！`)}).catch(err=>{result.error++,console.log(`项目${data[index].title}服务关闭状态更新失败！`)}));res.json({message:"请求成功！",data:result,code:200})}})}),router.post("/initStatic",async(message,res,next)=>{let body=message.body;body.commitBid=tools.getUid(),body.time=tools.dateTime(),body.isServer=!1,body.isStatic="1",body.bid?await database.updateDeploy(body,res).then(()=>{console.log(`项目${body.title}信息更新成功！`)}):(body.bid=tools.getUid(),await database.saveDeploy(body,res).then(()=>{console.log(`项目【${body.title}】信息创建成功！`)})),!body.port&&global.appServer[data.bid]&&global.appServer[data.bid].close(),await database.saveCommit({bid:body.commitBid,projectId:body.bid},res).then(()=>{console.log(`准备构建 ${body.title} 项目目录信息，请稍后...`)}),await tools.mkdirsSync(path.join(__dirname,`../../backups/${body.www}/${body.commitBid}`));message=`准备上传 ${body.title} 项目文件，请稍后...`;await logger.setlog({log:{message:message},bid:body.commitBid},!0,res),res.json({message:message,data:body,code:200})}),router.post("/deployReduction",async(deployState,res,next)=>{let body=deployState.body;var message;await logger.setlog({log:{message:"准备将项目文件移动到部署根目录,请稍后..."},bid:body.commitBid},!0,res),await workflow.initCommitReset(body,res),body.port?(await server.portInUse(body.port)instanceof Error&&await server.closeServer(body,null,res),await server.openServer(body,null,res).then(async()=>{await database.updateDeploy({bid:body.bid,isServer:!0},res);var message=`项目【${body.title}】已构建完成，请访问（${body.port}）端口即可访问！`,deployState={state:1,type:"deploy"};await logger.setlog({log:{message:message},deployState:deployState,bid:body.commitBid},!0,res),res.json({message:message,state:deployState,code:200})}).catch(async err=>{await database.updateDeploy({bid:body.bid,isServer:!1},res);var message=`项目【${body.title}】已构建失败！`,deployState={state:2,type:"deploy"};await logger.setlog({log:{message:message},deployState:deployState,bid:body.commitBid},!0,res),res.json({message:err,state:deployState,code:500})})):(message=`项目【${body.title}】已构建完成！`,deployState={state:1,type:"deploy"},await logger.setlog({log:{message:message},deployState:deployState,bid:body.commitBid},!0,res),res.json({message:message,state:deployState,code:200}))}),module.exports=router;