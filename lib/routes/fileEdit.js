const express=require("express"),fs=require("fs-extra"),path=require("path"),router=express.Router(),multer=require("multer"),compressing=require("compressing"),{handleError,handleSuccess}=require("../public/javascripts");router.get("/catalog",async(dir,res,next)=>{var{folder:dir}=dir.query;"backups"===dir||"www"===dir?(dir=path.join(__dirname,`../../${dir}`),res.json({data:(dir=>{let filesNameArr=[],mapDeep={};mapDeep[dir]=0;const getMap=(dir,curIndex)=>{let files=fs.readdirSync(dir);files.map(function(file){var subPath=path.join(dir,file);let stats=fs.statSync(subPath);if("node_modules"!=file&&(mapDeep[file]=curIndex+1,stats.isDirectory()))return getMap(subPath,mapDeep[file])})};getMap(dir,mapDeep[dir]);const readdirs=(dir,folderName,myroot)=>{let result={path:dir,title:path.basename(dir),type:"directory",deep:mapDeep[folderName]},files=fs.readdirSync(dir);return result.children=files.map(function(file){var subPath=path.join(dir,file);let stats=fs.statSync(subPath);return stats.isDirectory()?readdirs(subPath,file,file):{path:subPath,title:file,type:"file"}}),result};return filesNameArr.push(readdirs(dir,dir)),filesNameArr})(dir),message:"请求成功！",code:200})):res.json({data:null,message:"无权访问！",code:200})}),router.get("/content",async(filePath,res,next)=>{var{filePath}=filePath.query;fs.readFile(filePath,"utf-8",function(err,data){err?(console.log(err),res.json({data:null,message:err,code:500})):res.json({data:data,message:"请求成功！",code:200})})}),router.post("/saveFile",multer().single("file"),(req,res,next)=>{var wwwName=req.get("www-name");let commitBid=req.get("commit-bid"),relativePath=req.get("webkitRelativePath");var fileData=req.get("project-bid"),isStatic=req.get("is-static");let deployFolder=`./backups/${wwwName}/${commitBid}/`;"2"!=isStatic&&"5"!=isStatic||(deployFolder=`./backDir/${fileData}/${commitBid}/`),relativePath=relativePath?deployFolder+relativePath.slice(relativePath.indexOf("/"),relativePath.length):deployFolder+req.file.originalname;fileData=req.file.buffer.toString();fs.outputFile(relativePath,fileData).then(async data=>{await handleSuccess({message:`${req.file.originalname} file write successfully!`,data:{commitBid:commitBid},res:res})}).catch(async error=>{await handleError({message:`${req.file.originalname} file was written failed!`,error:error,data:{commitBid:commitBid},res:res})})}),router.post("/saveZip",multer().single("file"),async(isStatic,res,next)=>{var buffer=isStatic.file.buffer,wwwName=isStatic.get("www-name");let commitBid=isStatic.get("commit-bid");var projectBid=isStatic.get("project-bid"),isStatic=isStatic.get("is-static");await handleSuccess({message:"The compressed file package has been uploaded successfully. It is being decompressed. Please wait",data:{commitBid:commitBid}});let filePath=`./backups/${wwwName}/${commitBid}/`;"2"!=isStatic&&"5"!=isStatic||(filePath=`./backDir/${projectBid}/${commitBid}/`),await compressing.zip.uncompress(buffer,filePath).then(async data=>{await handleSuccess({message:"Zip file uploaded and unzipped successfully！",data:{commitBid:commitBid},res:res})}).catch(async error=>{await handleError({message:"Zip file upload and decompression failed！!",error:error,data:{commitBid:commitBid},res:res})})}),module.exports=router;