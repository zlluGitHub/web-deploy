const shell=require("shelljs"),path=require("path"),backupsPath="../../backups",wwwPath="../../www",tools=require("../public/javascripts/tools"),logger=require("../logs/index.js");module.exports={cloneProject:(body,res)=>new Promise(async(resTip,reject)=>{await logger.setlog({bid:body.commitBid,deployState:{state:0,type:"clone"},log:{message:`从 git 仓库中正在拉取【${body.projectName}】项目中，请稍后...`}},!0,res);let log=[],deployState={};await tools.mkdirsSync(path.join(__dirname,`${backupsPath}/${body.www}`));var result=await shell.exec(`git clone -b ${body.branch} ${body.git}`,{cwd:path.join(__dirname,`${backupsPath}/${body.www}`)});result.stdout&&log.push({message:result.stdout}),result.stderr&&log.push({message:result.stderr}),0===result.code?(log.push({message:`项目${body.projectName}拉取成功！`}),deployState={state:1,type:"clone"},await logger.setlog({log:log,deployState:deployState,bid:body.commitBid},!0,res),resTip()):(resTip=`项目${body.projectName}拉取失败！`,log.push({message:resTip}),deployState={state:2,type:"clone"},await logger.setlog({log:log,deployState:deployState,bid:body.commitBid},!0,res),res.json({message:message,state:deployState,code:500}))}),initPackage:(body,res)=>new Promise(async(resTip,reject)=>{if(-1<body.install.indexOf("cnpm")&&!shell.which("cnpm")){var result={state:2,type:"install"};await logger.setlog({log:{message:"cnpm 命令不存在，请安装后重新部署！"},bid:body.commitBid,deployState:result},!0,res),res.json({message:"cnpm 命令不存在，请安装后重新部署！",state:result,code:500})}else{await logger.setlog({log:{message:`正在安装【${body.projectName}】项目依赖中，请稍后...`},bid:body.commitBid,deployState:{state:0,type:"install"}},!0,res);let log=[],deployState={};result=await shell.exec(body.install,{cwd:path.join(__dirname,`${backupsPath}/${body.www}/${body.projectName}`)});result.stdout&&log.push({message:result.stdout}),result.stderr&&log.push({message:result.stderr}),0===result.code?(log.push({message:`项目${body.projectName}依赖安装成功！`}),deployState={state:1,type:"install"},await logger.setlog({log:log,deployState:deployState,bid:body.commitBid},!0,res),resTip()):(resTip=`项目${body.projectName}依赖安装失败！`,log.push({message:resTip}),deployState={state:2,type:"install"},await logger.setlog({log:log,deployState:deployState,bid:body.commitBid},!0,res),res.json({message:resTip,state:deployState,code:500}))}}),buildProject:(body,res)=>new Promise(async(resTip,reject)=>{await logger.setlog({log:{message:`项目【${body.projectName}】正在打包中，请稍后...`},bid:body.commitBid,deployState:{state:0,type:"build"}},!0,res);let log=[],deployState={};var result=await shell.exec(body.build,{cwd:path.join(__dirname,`${backupsPath}/${body.www}/${body.projectName}`)});result.stdout&&log.push({message:result.stdout}),result.stderr&&log.push({message:result.stderr}),0===result.code?(log.push({message:`项目${body.projectName}打包成功！`}),deployState={state:1,type:"build"},await logger.setlog({log:log,deployState:deployState,bid:body.commitBid},!0,res),resTip()):(resTip=`项目${body.projectName}打包失败！`,log.push({message:resTip}),deployState={state:2,type:"build"},await logger.setlog({log:log,deployState:deployState,bid:body.commitBid},!0,res),res.json({message:resTip,state:deployState,code:500}))}),deleteProject:(body,res)=>new Promise(async(resTip,reject)=>{await logger.setlog({log:{message:`项目${body.projectName}文件已存在，正在移除中...`},bid:body.commitBid},!0,res);let log=[];var result=await shell.exec(`rm -rf ./${body.projectName}`,{cwd:path.join(__dirname,`${backupsPath}/${body.www}`)});result.stdout&&log.push({message:result.stdout}),result.stderr&&log.push({message:result.stderr}),0===result.code?(log.push({message:`项目${body.projectName}移除成功！`}),await logger.setlog({log:log,bid:body.commitBid},!1,!0),resTip()):(resTip=`项目${body.projectName}移除失败！`,log.push({message:resTip}),await logger.setlog({log:log,bid:body.commitBid},!1,!0),res.json({message:resTip,code:500}))}),deleteNodeModule:(body,res)=>new Promise(async(resTip,reject)=>{await logger.setlog({log:{message:`正在删除${body.projectName}项目依赖，请稍后...`},bid:body.commitBid},!0,res);let log=[];var result=shell.exec(`rm -rf ./${body.projectName}/node_modules`,{cwd:path.join(__dirname,`${backupsPath}/${body.www}`)});result.stdout&&log.push({message:result.stdout}),result.stderr&&log.push({message:result.stderr}),0===result.code?(log.push({message:`项目${body.projectName}依赖包移除成功！`}),await logger.setlog({log:log,bid:body.commitBid},!0,res),resTip()):(resTip=`项目${body.projectName}依赖包移除失败！`,log.push({message:resTip}),await logger.setlog({log:log,bid:body.commitBid},!0,res),res.json({message:resTip,code:500}))}),deleteRoot:(body,res)=>new Promise(async(resTip,reject)=>{await logger.setlog({log:{message:`正在删除${body.projectName}项目部署根目录，请稍后...`},bid:body.commitBid},!0,res);let log=[];var result=await shell.exec(`rm -rf ./${body.www}`,{cwd:path.join(__dirname,wwwPath)});result.stdout&&log.push({message:result.stdout}),result.stderr&&log.push({message:result.stderr}),0===result.code?(log.push({message:`项目${body.projectName}部署根目录移除成功！`}),await logger.setlog({log:log,bid:body.commitBid},!0,res),resTip()):(resTip=`项目${body.projectName}部署根目录移除失败！`,log.push({message:resTip}),await logger.setlog({log:log,bid:body.commitBid},!0,res),res.json({message:resTip,code:500}))}),copyPackage:(body,res)=>new Promise(async(resTip,reject)=>{await logger.setlog({log:{message:"正在复制 package.json 文件，请稍后..."},bid:body.commitBid},!0,res);let log=[];var result=await shell.exec(`cp -rf ./${body.projectName}/package.json ./`,{cwd:path.join(__dirname,`${backupsPath}/${body.www}`)});result.stdout&&log.push({message:result.stdout}),result.stderr&&log.push({message:result.stderr}),0===result.code?(log.push({message:"项目中的 package.json 文件拷贝成功！"}),await logger.setlog({log:log,bid:body.commitBid},!0,res),resTip()):(resTip="项目中的 package.json 文件拷贝失败！",log.push({message:resTip}),await logger.setlog({log:log,bid:body.commitBid},!0,res),res.json({message:resTip,code:500}))}),deletePackage:(body,res)=>new Promise(async(resTip,reject)=>{await logger.setlog({log:{message:"正在删除旧的 package.json 文件，请稍后..."},bid:body.commitBid},!0,res);let log=[];var result=await shell.exec("rm -rf ./package.json",{cwd:path.join(__dirname,`${backupsPath}/${body.www}`)});result.stdout&&log.push({message:result.stdout}),result.stderr&&log.push({message:result.stderr}),0===result.code?(log.push({message:"项目中的 package.json 备份文件删除成功！"}),await logger.setlog({log:log,bid:body.commitBid},!0,res),resTip()):(resTip="项目中的 package.json 备份文件删除失败！",log.push({message:resTip}),await logger.setlog({log:log,bid:body.commitBid},!0,res),res.json({message:resTip,code:500}))}),mvProject:(body,res)=>new Promise(async(resTip,reject)=>{await logger.setlog({log:{message:`正在拷贝打包${body.projectName}项目文件到部署根目录，请稍后...`},bid:body.commitBid},!0,res);let log=[];var result=await shell.exec(`cp -rf ./${body.dist}/* ${path.join(__dirname,`${wwwPath}/${body.www}`)}`,{cwd:path.join(__dirname,`${backupsPath}/${body.www}/${body.projectName}`)});result.stdout&&log.push({message:result.stdout}),result.stderr&&log.push({message:result.stderr}),0===result.code?(log.push({message:`项目${body.projectName}文件拷贝成功！`}),await logger.setlog({log:log,bid:body.commitBid},!0,res),resTip()):(resTip=`项目${body.projectName}文件拷贝失败！`,log.push({message:resTip}),await logger.setlog({log:log,bid:body.commitBid},!0,res),res.json({message:resTip,code:500}))}),mvToBackups:(body,res)=>new Promise(async(resTip,reject)=>{await logger.setlog({log:{message:`正在拷贝打包【${body.projectName}】项目文件到备份目录，请稍后...`},bid:body.commitBid},!0,res);let log=[];await tools.mkdirsSync(path.join(__dirname,`${backupsPath}/${body.www}/${body.commitBid}`));var result=await shell.exec(`cp -rf ./${body.projectName}/${body.dist}/* ./${body.commitBid}`,{cwd:path.join(__dirname,`${backupsPath}/${body.www}`)});result.stdout&&log.push({message:result.stdout}),result.stderr&&log.push({message:result.stderr}),0===result.code?(log.push({message:`项目${body.projectName}文件备份成功！`}),await logger.setlog({log:log,bid:body.commitBid},!0,res),resTip()):(resTip=`项目${body.projectName}文件备份失败！`,log.push({message:resTip}),await logger.setlog({log:log,bid:body.commitBid},!0,res),res.json({message:resTip,code:500}))}),mvReductionWww:(body,res)=>new Promise(async(resolve,reject)=>{await logger.setlog({log:{message:"正在将项目部署到根目录下，请稍后..."},bid:body.commitBid},!0,res);let log=[];var result=await shell.exec(`cp -rf ./${body.commitBid}/* ${path.join(__dirname,`${wwwPath}/${body.www}`)}`,{cwd:path.join(__dirname,`${backupsPath}/${body.www}`)});result.stdout&&log.push({message:result.stdout}),result.stderr&&log.push({message:result.stderr}),0===result.code?(log.push({message:"项目文件已成功拷贝到根目录！"}),await logger.setlog({log:log,bid:body.commitBid},!0,res),resolve()):(log.push({message:"项目文件拷贝到根目录发生错误！"}),await logger.setlog({log:log,bid:body.commitBid},!0,res),res.json({message:"项目文件拷贝到根目录发生错误！",code:500}))}),gitPull:(body,res)=>new Promise(async(resolve,reject)=>{await logger.setlog({bid:body.commitBid,deployState:{state:0,type:"clone"},log:{message:"远程Git仓库与本地项目同步中，请稍后..."}},!0,res);let log=[],deployState={};var result=await shell.exec("git pull",{cwd:path.join(__dirname,`${backupsPath}/${body.www}/${body.projectName}`)});result.stdout&&log.push({message:result.stdout}),result.stderr&&log.push({message:result.stderr}),0===result.code?(log.push({message:"远程Git仓库与本地项目同步成功！"}),deployState={state:1,type:"clone"},await logger.setlog({log:log,deployState:deployState,bid:body.commitBid},!0,res),resolve()):(log.push({message:"远程Git仓库与本地项目同步失败！"}),deployState={state:2,type:"clone"},await logger.setlog({log:log,deployState:deployState,bid:body.commitBid},!0,res),res.json({message:message,state:deployState,code:500}))}),gitReset:async(bid,deployState,commitBid,versionNumber,res)=>{var resTip="从远程Git仓库拉取"+versionNumber+"版本中，请稍后...";await logger.updateCommit({type:"clone",message:resTip},commitBid).catch(err=>{});resTip=await shell.exec(`git reset --hard ${versionNumber}`,{cwd:path.join(__dirname,`${backupsPath}/${deployState}`)});if(0===resTip.code){let message="拉取"+versionNumber+"版本成功！";resTip.stdout&&await logger.updateCommit([{type:"clone",message:resTip.stdout},{type:"clone",message:message}],commitBid).catch(err=>{}),console.log(message)}else{let message=resTip.stderr;resTip=deployState+"远程Git仓库与本地项目同步失败！";await logger.updateCommit([{type:"clone",message:resTip},{type:"clone",message:message}],commitBid).catch(err=>{});deployState={state:!1,type:"clone"};res.json({message:resTip,state:deployState,code:500}),logger.exitState({commitBid:commitBid,deployState:deployState})}}};