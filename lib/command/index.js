const shell=require("shelljs"),path=require("path"),compressing=require("compressing"),{NodeSSH}=require("node-ssh"),ssh=new NodeSSH,fs=require("fs-extra"),backupsPath="../../backups",wwwPath="../../www",{handleError,handleSuccess}=require("../public/javascripts"),backDirPath="../../backDir",logger=require("../logs/index.js");function execShell(command,cwd){return new Promise((resolve,reject)=>{ssh.exec(command,[],{cwd:cwd}).then(result=>{resolve(result)}).catch(error=>{reject(error)})})}module.exports={cloneProject:(body,res)=>new Promise(async(resolve,reject)=>{let rootPath=`${backupsPath}/${body.www}`;"6"==body.isStatic&&(rootPath=`${backDirPath}/${body.bid}`);var result=path.join(__dirname,rootPath);await fs.ensureDir(result).catch(async error=>{await handleError({message:"Project directory creation failed!",error:error,data:body,res:res})}),await handleSuccess({message:"Cloning project from Git...",data:body});result=await shell.exec(`git clone -b ${body.git.branch} ${body.git.url}`,{cwd:result});result.stdout&&await handleSuccess({message:result.stdout,data:body}),0==result.code?(await handleSuccess({message:"Project clone from git successfully!",data:body}),resolve()):await handleError({message:"Project clone from git failed！",error:result.stderr,data:body,res:res})}),initPackage:(body,res)=>new Promise(async(resolve,reject)=>{await handleSuccess({message:"Project dependency is being installed, please wait...",data:body});let rootPath=`${backupsPath}/${body.www}/${body.projectName}`;"6"==body.isStatic&&(rootPath=`${backDirPath}/${body.bid}/${body.projectName}`);var result=await shell.exec(body.install,{cwd:path.join(__dirname,rootPath)});result.stdout&&await handleSuccess({message:result.stdout,data:body}),0==result.code?(await handleSuccess({message:"Project dependency package installed successfully!",data:body}),resolve()):await handleError({message:"Project dependency package installed failed！",error:result.stderr,data:body,res:res})}),buildProject:(body,res)=>new Promise(async(resolve,reject)=>{await handleSuccess({message:"The project file is being packaged...",data:body});let rootPath=`${backupsPath}/${body.www}/${body.projectName}`;"6"==body.isStatic&&(rootPath=`${backDirPath}/${body.bid}/${body.projectName}`);var result=await shell.exec(body.build,{cwd:path.join(__dirname,rootPath)});result.stdout&&await handleSuccess({message:result.stdout,data:body}),0==result.code?(await handleSuccess({message:"Project packaged successfully!",data:body}),resolve()):await handleError({message:"Project packaging failed！",error:result.stderr,data:body,res:res})}),deleteProject:(body,res)=>new Promise(async(resolve,reject)=>{await handleSuccess({message:"The project has been detected and is being removed. Please wait...",data:body});let rootPath=`${backupsPath}/${body.www}`;"6"==body.isStatic&&(rootPath=`${backDirPath}/${body.bid}`);let order=`${body.projectName}`;order=order.replace("*","");var result=await shell.exec(`rm -rf ${order}`,{cwd:path.join(__dirname,rootPath)});result.stdout&&await handleSuccess({message:result.stdout,data:body}),0==result.code?(await handleSuccess({message:"The project was removed successfully.",data:body}),resolve()):await handleError({message:"The item removal failed.",error:result.stderr,data:body,res:res})}),deleteNodeModule:(body,res)=>new Promise(async(resolve,reject)=>{await handleSuccess({message:`Deleting ${body.ProjectName} project "node_modules" dependency, please wait...`,data:body});let rootPath=`${backupsPath}/${body.www}/${body.projectName}`;"6"==body.isStatic&&(rootPath=`${backDirPath}/${body.bid}/${body.projectName}`);var result=await shell.exec("rm -rf node_modules",{cwd:path.join(__dirname,rootPath)});result.stdout&&await handleSuccess({message:result.stdout,data:body}),0==result.code?(await handleSuccess({message:`Project ${body.ProjectName} "node_modules" dependency package removed successfully!`,data:body}),resolve()):await handleError({message:`Project ${body.ProjectName} "node_modules" dependency package removed failed.`,error:result.stderr,data:body,res:res})}),deleteRoot:(body,res)=>new Promise(async(resolve,reject)=>{let order=`./${body.www}`;order=order.replace("*",""),await handleSuccess({message:"Project deployment root is being removed...",data:body});var result=await shell.exec(`rm -rf ${order}`,{cwd:path.join(__dirname,wwwPath)});result.stdout&&await handleSuccess({message:result.stdout,data:body}),0==result.code?(await handleSuccess({message:"Project deployment root directory removal successfully.",data:body}),resolve()):await handleError({message:"Project deployment root directory removal failed!！",error:result.stderr,res:res})}),copyPackage:(body,res)=>new Promise(async(resolve,reject)=>{await handleSuccess({message:"Copying package.json file...",data:body});let rootPath=`${backupsPath}/${body.www}`;"6"==body.isStatic&&(rootPath=`${backDirPath}/${body.bid}`);var result=await shell.exec(`cp -rf ./${body.projectName}/package.json ./`,{cwd:path.join(__dirname,rootPath)});result.stdout&&await handleSuccess({message:result.stdout,data:body}),0==result.code?(await handleSuccess({message:"The package.json file in the project was copied successfully!",data:body}),resolve()):await handleError({message:"Failed to copy the package.json file in the project！",error:result.stderr,res:res})}),deletePackage:(body,res)=>new Promise(async(resolve,reject)=>{await handleSuccess({message:"Deleting old package.json file, please wait...",data:body});let rootPath=`${backupsPath}/${body.www}`;"6"==body.isStatic&&(rootPath=`${backDirPath}/${body.bid}`);var result=await shell.exec("rm -rf package.json",{cwd:path.join(__dirname,rootPath)});result.stdout&&await handleSuccess({message:result.stdout,data:body}),0==result.code?(await handleSuccess({message:"The package.json backup file in the project was deleted successfully!",data:body}),resolve()):await handleError({message:"Failed to delete the package.json backup file in the project！",error:result.stderr,res:res})}),mvProject:(body,res)=>new Promise(async(resolve,reject)=>{await handleSuccess({message:"Copy git package file to deployment root directory...",data:body});var result=await shell.exec(`cp -rf ./${body.dist}/* ${path.join(__dirname,`${wwwPath}/${body.www}`)}`,{cwd:path.join(__dirname,`${backupsPath}/${body.www}/${body.projectName}`)});result.stdout&&await handleSuccess({message:result.stdout,data:body}),0==result.code?(await handleSuccess({message:"Successfully deployed the project file to the root directory!",data:body}),resolve()):await handleError({message:"Error deploying project file to root directory！",error:result.stderr,data:body,res:res})}),mvToBackups:(body,res)=>new Promise(async(resolve,reject)=>{await handleSuccess({message:"Copying and packing project file to backup directory, please wait...",data:body});let rootPath=`${backupsPath}/${body.www}`;"6"==body.isStatic&&(rootPath=`${backDirPath}/${body.bid}`),await fs.ensureDir(path.join(__dirname,`${rootPath}/${body.commitBid}`)).catch(error=>{handleError({message:"Project backup directory creation failed!",error:error,res:res})});var result=await shell.exec(`cp -rf ./${body.projectName}/${body.dist}/* ./${body.commitBid}`,{cwd:path.join(__dirname,rootPath)});result.stdout&&await handleSuccess({message:result.stdout,data:body}),0==result.code?(await handleSuccess({message:"Project file backup succeeded!",data:body}),resolve()):await handleError({message:"Project file backup failed!",error:result.stderr,data:body,res:res})}),mvReductionWww:(body,res)=>new Promise(async(resolve,reject)=>{await handleSuccess({message:"Preparing to restore backup files, please wait...",data:body});var result=await shell.exec(`cp -rf ./${body.commitBid}/* ${path.join(__dirname,`${wwwPath}/${body.www}`)}`,{cwd:path.join(__dirname,`${backupsPath}/${body.www}`)});result.stdout&&await handleSuccess({message:result.stdout,data:body}),0==result.code?(await handleSuccess({message:"Backup file restored successfully!",data:body}),resolve()):await handleError({message:"Backup file restored failed!",error:result.stderr,data:body,res:res})}),gitPull:(body,res)=>new Promise(async(resolve,reject)=>{await handleSuccess({message:"The remote git warehouse is synchronizing with the local project. Please wait...",data:body});let rootPath=`${backupsPath}/${body.www}`;"6"==body.isStatic&&(rootPath=`${backDirPath}/${body.bid}`);var result=await shell.exec("git pull",{cwd:path.join(__dirname,`${rootPath}/${body.projectName}`)});result.stdout&&await handleSuccess({message:result.stdout,data:body}),0==result.code?(await handleSuccess({message:"Remote git warehouse synchronized with local project successfully!",data:body}),resolve()):await handleError({message:"Failed to synchronize remote git warehouse with local project!",error:result.stderr,data:body,res:res})}),gitReset:async(bid,deployState,commitBid,versionNumber,res)=>{var resTip="从远程Git仓库拉取"+versionNumber+"版本中，请稍后...";await logger.updateCommit({type:"clone",message:resTip},commitBid).catch(err=>{});resTip=await shell.exec(`git reset --hard ${versionNumber}`,{cwd:path.join(__dirname,`${backupsPath}/${deployState}`)});if(0===resTip.code){let message="拉取"+versionNumber+"版本成功！";resTip.stdout&&await logger.updateCommit([{type:"clone",message:resTip.stdout},{type:"clone",message:message}],commitBid).catch(err=>{}),console.log(message)}else{let message=resTip.stderr;resTip=deployState+"远程Git仓库与本地项目同步失败！";await logger.updateCommit([{type:"clone",message:resTip},{type:"clone",message:message}],commitBid).catch(err=>{});deployState={state:!1,type:"clone"};res.json({message:resTip,state:deployState,code:500}),logger.exitState({commitBid:commitBid,deployState:deployState})}},deleteBackProject:async(body,res)=>{await logger.setlog({log:{message:`项目${body.projectName}文件已存在，正在移除中...`},bid:body.commitBid},!0,res);let log=[],order=`./${body.projectName}`;var resTip;-1===order.indexOf("/*")?((resTip=await shell.exec(`rm -rf ${order}`,{cwd:path.join(__dirname,body.backDirPath)})).stdout&&log.push({message:resTip.stdout}),resTip.stderr&&log.push({message:resTip.stderr}),0===resTip.code?(log.push({message:`项目${body.projectName}移除成功！`}),await logger.setlog({log:log,bid:body.commitBid},!0,res)):(resTip=`项目${body.projectName}移除失败！`,log.push({message:resTip}),await logger.setlog({log:log,bid:body.commitBid},!0,res),res.json({message:resTip,code:500}),process.exit(500))):(await logger.setlog({log:log,bid:body.commitBid},!1,res),res.json({message:"检测到危险字符串'/*'，请修改后重试！",code:500}))},cloneBackProject:async(body,res)=>{await logger.setlog({bid:body.commitBid,log:{message:`从 git 仓库中正在拉取【${body.projectName}】项目中，请稍后...`}},!0,res);let log=[];var resTip=await shell.exec(`git clone -b ${body.git.branch} ${body.git.url}`,{cwd:path.join(__dirname,`${body.backDirPath}`)});resTip.stdout&&log.push({message:resTip.stdout}),resTip.stderr&&log.push({message:resTip.stderr}),0===resTip.code?(log.push({message:`项目${body.projectName}拉取成功！`}),await logger.setlog({log:log,bid:body.commitBid},!0,res)):(resTip=`项目${body.projectName}拉取失败！`,log.push({message:resTip}),await logger.setlog({log:log,bid:body.commitBid},!0,res),res.json({message:resTip,code:500}),process.exit(500))},pullBackProject:async(body,res)=>{await logger.setlog({bid:body.commitBid,log:{message:"同步本地项目与远程 Git 中，请稍后..."}},!0,res);let log=[];var resTip=await shell.exec("git pull",{cwd:path.join(__dirname,`${body.backDirPath}/${body.projectName}`)});resTip.stdout&&log.push({message:resTip.stdout}),resTip.stderr&&log.push({message:resTip.stderr}),0===resTip.code?(log.push({message:`项目${body.projectName}拉取成功！`}),await logger.setlog({log:log,bid:body.commitBid},!0,res)):(resTip=`项目${body.projectName}拉取失败！`,log.push({message:resTip}),await logger.setlog({log:log,bid:body.commitBid},!0,res),res.json({message:resTip,code:500}),process.exit(500))},buildBackProject:async(body,res)=>{await logger.setlog({log:{message:`项目【${body.projectName}】正在打包中，请稍后...`},bid:body.commitBid},!0,res);let log=[];var resTip=await shell.exec(body.build,{cwd:path.join(__dirname,`${body.backDirPath}/${body.projectName}/${body.buildPath}`)});resTip.stdout&&log.push({message:resTip.stdout}),resTip.stderr&&log.push({message:resTip.stderr}),0===resTip.code?(log.push({message:`项目${body.projectName}打包成功！`}),await logger.setlog({log:log,bid:body.commitBid},!0,res)):(resTip=`项目${body.projectName}打包失败！`,log.push({message:resTip}),await logger.setlog({log:log,bid:body.commitBid},!0,res),res.json({message:resTip,code:500}),process.exit(500))},buildZipFile:async(body,res)=>{await handleSuccess({message:"Compressing package file...",data:body});let filePath1="",filePath2="";"6"==body.isStatic?(filePath1=`${backDirPath}/${body.bid}/${body.projectName}/${body.dist}`,filePath2=`${backDirPath}/${body.bid}/${body.projectName}/distzip.zip`):"5"==body.isStatic&&(filePath1=`${backDirPath}/${body.bid}/${body.commitBid}`,filePath2=`${backDirPath}/${body.bid}/distzip.zip`),await compressing.zip.compressDir(path.join(__dirname,filePath1),path.join(__dirname,filePath2)).then(async()=>{await handleSuccess({message:"Package file compressed successfully!",data:body})}).catch(async error=>{await handleError({message:"Package file compressed failed!",error:error,data:body,res:res})})},connectSSH:async(body,res)=>{await handleSuccess({message:"Connecting to remote server, please wait...",data:body});var type=body.sshServer.password?"password":"privateKey";let obj={host:body.sshServer.host,username:body.sshServer.username,port:body.sshServer.port,[type]:body.sshServer.password||body.sshServer.privateKey};body.sshServer.readyTimeout&&(obj.readyTimeout=body.sshServer.readyTimeout),await ssh.connect(obj).then(async e=>{await handleSuccess({message:"Remote server connected successfully!",data:body})}).catch(async error=>{await handleError({message:"SSH connection failed（ Possible reasons: 1: wrong password, 2: wrong private key address, 3: the server does not configure the local public key.",error:error,data:body,res:res})})},mkdirShell:async(body,res)=>{let pwd=body.www;ssh.mkdir(pwd).then(async result=>{await handleSuccess({message:`${pwd} folder directory creation successfully!`,data:body})}).catch(async error=>{await handleError({message:`${pwd} folder directory creation failed!`,error:error,data:body,res:res})}),await handleSuccess({message:"Remote directory folder created successfully!",data:body})},deleteProjectSSh:async(body,res)=>{await handleSuccess({message:"Removing remote project, please wait...",data:body});let dirPath="/zll";body.www&&body.www.indexOf("*")<=-1&&(dirPath=body.www),await execShell(`rm -rf ${dirPath}`,"/").then(async()=>{await handleSuccess({message:"Remote project removed successfully!",data:body})}).catch(async error=>{await handleError({message:"Remote project removed failed!",data:body,error:error,res:res})})},putFilesSSh:async(body,res)=>{await handleSuccess({message:"Uploading compressed file, please wait...",data:body});let filePath1="/zll";"6"==body.isStatic?filePath1=`${backDirPath}/${body.bid}/${body.projectName}/distzip.zip`:"5"==body.isStatic&&(filePath1=`${backDirPath}/${body.bid}/distzip.zip`);var filePath2=`/${body.www}/distzip.zip`;await ssh.putFiles([{local:path.join(__dirname,filePath1),remote:filePath2}]).then(async()=>{await handleSuccess({message:"The compressed file has been uploaded to the remote server successfully!",data:body})}).catch(async error=>{await handleError({message:"The compressed file has been uploaded to the remote server failed!",data:body,error:error,res:res})})},undoZipFile:async(body,res)=>{await handleSuccess({message:"Extracting remote package file, please wait...",data:body}),await execShell("unzip -o distzip.zip",`/${body.www}`).then(async result=>{result.stdout&&await handleSuccess({message:result.stdout,data:body})}).catch(async error=>{await handleError({message:"Remote compressed file decompression failed!",error:error,data:body,res:res})});let dist="zll";"6"==body.isStatic?dist=body.dist:"5"==body.isStatic&&(dist=body.commitBid),await execShell(`mv -f ./${dist}/* ./`,`/${body.www}`).then(async result=>{result.stdout&&await handleSuccess({message:result.stdout,data:body})}).catch(async error=>{await handleError({message:"Remote unzip file move failed！",error:error,data:body,res:res})}),await execShell("rm -rf distzip.zip",`/${body.www}`).then(async result=>{result.stdout&&await handleSuccess({message:result.stdout,data:body})}).catch(async error=>{await handleError({message:"Remote compressed file deletion failed!",error:error,data:body,res:res})}),await execShell(`rm -rf ${dist}`,`/${body.www}`).then(async result=>{result.stdout&&await handleSuccess({message:result.stdout,data:body})}).catch(async error=>{await handleError({message:"Remote package decompression file deletion failed!！",error:error,data:body,res:res})})},runProjectSSh:async(body,res)=>{await logger.setlog({log:{message:"项目正在启动中，请稍后..."},bid:body.commitBid},!0,res),await execShell(body.runJar,body.www).then(async()=>{await logger.setlog({log:{message:"项目启动成功！"},bid:body.commitBid},!0,res)}).catch(async err=>{await logger.setlog({log:[{message:err},{message:"项目启动失败！"}],bid:body.commitBid},!0,res),await res.json({message:"项目启动失败！",code:500}),process.exit(500)})},setGitConfig:async(body,res)=>new Promise(async(resolve,reject)=>{let gitUrl=body.git.url,webUrl=gitUrl.slice(gitUrl.indexOf("//")+2,gitUrl.length);webUrl=webUrl.slice(0,webUrl.indexOf("/")),await handleSuccess({message:"Setting git access...",data:body}),await fs.outputFile("/root/.gitconfig","[credential] \n  helper = store").catch(error=>{handleError({message:"Git login certificate gitconfig setting failed！",error:error,res:res})});var http=gitUrl.slice(0,gitUrl.indexOf("//")),username=body.git.username||"zllusername",password=body.git.password||"zllpassword";await fs.outputFile("/root/.git-credentials",`${http}//${username}:${password}@${webUrl}`).catch(error=>{handleError({message:"Git credentials setting failed！",error:error,res:res})}),await handleSuccess({message:"Git login certificate has been set successfully!",data:body}),resolve()})};