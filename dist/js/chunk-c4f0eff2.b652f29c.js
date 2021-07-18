(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-c4f0eff2"],{2906:function(t,e,i){"use strict";i.r(e);var s=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"swd-create"},[i("div",{staticClass:"header"},[i("Decorate",{attrs:{icon:"ivu-icon ivu-icon-md-add",title:"创建WEB项目",describe:"在这里可以创建一个新的项目，同时也可以迭代之前的项目。项目的创建分为手动部署与自动部署，可根据自身需求进行选择。"}},[i("div",{staticClass:"deploy-change"},[i("div",{staticClass:"but-item",class:["0"===t.modeType?"active":""],on:{click:function(e){return t.handleCharge("0")}}},[i("i",{staticClass:"ivu-icon ivu-icon-android-list"}),t._v(" 自动部署 ")]),i("div",{staticClass:"but-item",class:["1"===t.modeType?"active":""],on:{click:function(e){return t.handleCharge("1")}}},[i("i",{staticClass:"ivu-icon ivu-icon-gear-a"}),t._v("静态部署 ")])])])],1),i("div",{staticClass:"breadcrumb"},[i("div",{staticClass:"warp"},[i("Breadcrumb",[i("BreadcrumbItem",{attrs:{to:"/"}},[i("Icon",{attrs:{type:"ios-home-outline",size:"18"}}),t._v(" 工作台 ")],1),i("BreadcrumbItem",[i("Icon",{attrs:{type:"md-add",size:"18"}}),t._v(" 创建WEB项目 ")],1)],1),i("div",{staticClass:"go-back",on:{click:function(e){return t.$router.go(-1)}}},[i("Icon",{attrs:{type:" fa fa-share-square-o",size:"15"}}),t._v(" "),i("span",[t._v("返回上一页")])],1)],1)]),"0"===t.modeType?i("Gynamic"):t._e(),"1"===t.modeType?i("StaticIndex"):t._e()],1)},a=[],o=i("20d6"),r=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"content"},[i("section",[i("div",{class:["list-item",t.isProjectExit?"ivu-form-item-error":""]},[t._m(0),i("Input",{staticClass:"put-warp",attrs:{placeholder:"请输入项目名称..."},on:{"on-blur":t.handleIsProjectExit},model:{value:t.title,callback:function(e){t.title=e},expression:"title"}}),i("div",{staticClass:"tip"},[i("Tooltip",{attrs:{"max-width":"200",content:"请填写项目名称。",placement:"right"}},[i("Icon",{attrs:{type:"ios-help-circle-outline"}})],1),t.isProjectExit?i("span",{staticClass:"isExNo"},[t._v("此项目已存在，请重新输入！")]):t._e()],1)],1),i("div",{class:["list-item",t.isWwwExit?"ivu-form-item-error":""]},[t._m(1),i("Input",{staticClass:"put-warp",attrs:{disabled:t.disabled,placeholder:"例如：dist"},on:{"on-blur":t.handleIsWwwExit},model:{value:t.www,callback:function(e){t.www=e},expression:"www"}}),i("div",{staticClass:"tip"},[i("Tooltip",{attrs:{"max-width":"200",content:"指部署到服务器上的目录，也就是一级目录。",placement:"right"}},[i("Icon",{attrs:{type:"ios-help-circle-outline"}})],1),t.isWwwExit?i("span",{staticClass:"isExNo"},[t._v("此目录已存在，请重新输入！")]):t._e()],1)],1),i("div",{class:["list-item",t.portMessage.state?"ivu-form-item-error":""]},[t._m(2),i("Input",{staticClass:"put-warp",attrs:{disabled:t.disabled,placeholder:"例如：8080 （选填）"},on:{"on-blur":t.handleIsPortExit},model:{value:t.port,callback:function(e){t.port=e},expression:"port"}}),i("div",{staticClass:"tip"},[i("Tooltip",{attrs:{"max-width":"200",content:"默认：本系统端口号/部署目录/index.html",placement:"right"}},[i("Icon",{attrs:{type:"ios-help-circle-outline"}})],1),t.portMessage.state?i("span",{staticClass:"isExNo"},[t._v(t._s(t.portMessage.message))]):t._e()],1)],1),i("div",{staticClass:"list-item"},[i("label",[t._v("代理地址：")]),i("ul",t._l(t.proxy,(function(e,s){return i("li",{key:"x"+s},[i("div",{staticClass:"put-warp proxy-warp"},[i("Input",{staticStyle:{width:"30%"},attrs:{placeholder:"例如：api"},model:{value:t.proxy[s].rewrite,callback:function(e){t.$set(t.proxy[s],"rewrite",e)},expression:"proxy[i].rewrite"}}),i("span",[t._v("-")]),i("Input",{attrs:{placeholder:"例如：http://127.0.0.1"},model:{value:t.proxy[s].target,callback:function(e){t.$set(t.proxy[s],"target",e)},expression:"proxy[i].target"}})],1),i("div",{staticClass:"tip"},[i("Icon",{attrs:{type:"ios-add-circle-outline"},on:{click:function(e){return e.stopPropagation(),t.handleAddProxy(e)}}}),t.proxy.length>1?i("Icon",{attrs:{type:"ios-close-circle-outline"},on:{click:function(e){return e.stopPropagation(),t.handleDeleteProxy(s)}}}):t._e()],1)])})),0)]),i("div",{staticClass:"list-item"},[t._m(3),i("Input",{staticClass:"put-warp",attrs:{placeholder:"例如：https://github.com/zlluGitHub/web-deploy.git"},model:{value:t.git.url,callback:function(e){t.$set(t.git,"url",e)},expression:"git.url"}}),i("div",{staticClass:"tip"},[i("Tooltip",{attrs:{"max-width":"200",content:"此处填写 gitLab 仓库地址。",placement:"right"}},[i("Icon",{attrs:{type:"ios-help-circle-outline"}})],1)],1)],1),i("div",{staticClass:"list-item"},[t._m(4),i("Input",{staticClass:"put-warp",attrs:{placeholder:"默认：master"},model:{value:t.git.branch,callback:function(e){t.$set(t.git,"branch",e)},expression:"git.branch"}}),i("div",{staticClass:"tip"},[i("Tooltip",{attrs:{"max-width":"200",content:"此处填写 gitLab 仓库分支，默认 master 主分支。",placement:"right"}},[i("Icon",{attrs:{type:"ios-help-circle-outline"}})],1)],1)],1),i("div",{staticClass:"list-item"},[i("label",[t._v(" 仓库状态：")]),i("Select",{staticClass:"put-warp",model:{value:t.ckType,callback:function(e){t.ckType=e},expression:"ckType"}},t._l([{label:"公共仓库",value:"ggck"},{label:"私有仓库",value:"syck"}],(function(e){return i("Option",{key:e.value,attrs:{value:e.value}},[t._v(t._s(e.label))])})),1),i("div",{staticClass:"tip"},[i("Tooltip",{attrs:{"max-width":"200",content:"若为公共仓库则不需要设置账号密码。",placement:"right"}},[i("Icon",{attrs:{type:"ios-help-circle-outline"}})],1)],1)],1),"syck"===t.ckType?i("div",{staticClass:"list-item"},[t._m(5),i("Input",{staticClass:"put-warp",attrs:{placeholder:"请输入用户名..."},model:{value:t.git.username,callback:function(e){t.$set(t.git,"username",e)},expression:"git.username"}})],1):t._e(),"syck"===t.ckType?i("div",{staticClass:"list-item"},[t._m(6),i("Input",{staticClass:"put-warp",attrs:{type:"password",placeholder:"请输入登录密码...'"},model:{value:t.git.password,callback:function(e){t.$set(t.git,"password",e)},expression:"git.password"}})],1):t._e(),i("div",{staticClass:"list-item"},[t._m(7),i("Input",{staticClass:"put-warp",attrs:{placeholder:"例如：npm install"},model:{value:t.install,callback:function(e){t.install=e},expression:"install"}}),i("div",{staticClass:"tip"},[i("Tooltip",{attrs:{"max-width":"200",content:"填写项目依赖安装指令，支持 npm 和 cnpm 指令。",placement:"right"}},[i("Icon",{attrs:{type:"ios-help-circle-outline"}})],1)],1)],1),i("div",{staticClass:"list-item"},[t._m(8),i("Input",{staticClass:"put-warp",attrs:{placeholder:"例如：npm run build"},model:{value:t.build,callback:function(e){t.build=e},expression:"build"}}),i("div",{staticClass:"tip"},[i("Tooltip",{attrs:{"max-width":"200",content:"填写项目打包指令，支持 npm 和 cnpm 指令。",placement:"right"}},[i("Icon",{attrs:{type:"ios-help-circle-outline"}})],1)],1)],1),i("div",{staticClass:"list-item"},[t._m(9),i("Input",{staticClass:"put-warp",attrs:{placeholder:"默认：dist"},model:{value:t.dist,callback:function(e){t.dist=e},expression:"dist"}}),i("div",{staticClass:"tip"},[i("Tooltip",{attrs:{"max-width":"200",content:"此处填写此项目的打包目录。",placement:"right"}},[i("Icon",{attrs:{type:"ios-help-circle-outline"}})],1)],1)],1),i("div",{staticClass:"list-item"},[i("label",[t._v("部署摘要：")]),i("Input",{staticClass:"put-warp",attrs:{type:"textarea",rows:4,placeholder:"请输入概要内容...'"},model:{value:t.remark,callback:function(e){t.remark=e},expression:"remark"}})],1),i("div",{staticClass:"tip-box"},[i("DeployTip",{key:t.bid})],1),i("div",{staticClass:"button-footer"},[i("Button",{attrs:{type:"success",ghost:""},on:{click:t.handleAutoSave}},[t._v(t._s(t.$route.query.bid?"更新部署":"开始部署"))]),i("Button",{on:{click:function(e){return e.stopPropagation(),t.handleBack(e)}}},[t._v("返回首页")])],1)]),i("LogModal",{ref:"logModal",attrs:{socketData:t.socketData},on:{"on-close":t.handleBack}})],1)},l=[function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("label",[i("i",{staticClass:"star"},[t._v("*")]),t._v("项目名称： ")])},function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("label",[i("i",{staticClass:"star"},[t._v("*")]),t._v("部署目录： ")])},function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("label",[i("i",{staticClass:"star"},[t._v("*")]),t._v("部署端口：")])},function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("label",[i("i",{staticClass:"star"},[t._v("*")]),t._v("Git 地址： ")])},function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("label",[i("i",{staticClass:"star"},[t._v("*")]),t._v("项目分支： ")])},function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("label",[i("i",{staticClass:"star"},[t._v("*")]),t._v("Git账号：")])},function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("label",[i("i",{staticClass:"star"},[t._v("*")]),t._v("Git密码：")])},function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("label",[i("i",{staticClass:"star"},[t._v("*")]),t._v("安装依赖： ")])},function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("label",[i("i",{staticClass:"star"},[t._v("*")]),t._v("打包命令： ")])},function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("label",[i("i",{staticClass:"star"},[t._v("*")]),t._v("打包目录： ")])}],n=(i("99af"),i("a434"),i("f971")),c=i("a33d"),d={components:{Decorate:o["a"],DeployTip:n["a"],LogModal:c["a"]},data:function(){return{modeType:"0",isProjectExit:!1,isWwwExit:!1,isLogModal:!1,sideList:["已连接到应用服务器，正在部署..."],socket:null,socketData:[],portMessage:{},disabled:!!this.$route.query.bid,queryTitle:"",queryWww:"",queryPort:"",title:"",ckType:"ggck",bid:"",www:"",port:"",proxy:[{rewrite:"",target:""}],dist:"",key:"",gzip:!0,remark:"",git:{url:"",branch:"master",password:"",username:""},build:"npm run build",install:"cnpm i",isServer:!1,router:"history"}},watch:{ckType:function(t){"ggck"===t&&(this.git.username="",this.git.password="")}},created:function(){var t=this;this.$route.query.bid&&this.$request.get("/swd/deploy/get",{params:{bid:this.$route.query.bid}}).then((function(e){if(200===e.data.code){var i=e.data.data[0];t.queryPort=i.port,t.queryTitle=i.title,t.queryWww=i.www,t.title=i.title,t.bid=i.bid,t.proxy=i.proxy,t.gzip=i.gzip,t.dist=i.dist,t.remark=i.remark,t.git=i.git?i.git:{url:"",branch:"master",password:"",username:""},t.www=i.www,t.port=i.port,t.key=i.key,t.build=i.build,t.install=i.install,t.commitBid=i.commitBid,t.isServer=i.isServer,t.router=i.router,t.git.username&&t.git.password&&(t.ckType="syck")}}))},methods:{handleAutoSave:function(){this.title?this.www?this.port?this.git.url?this.git.branch?this.install?this.build?this.dist?this.handleAutoSubmit("save"):this.$Modal.warning({title:"系统提示",content:"打包目录不得为空，请输入后再试！"}):this.$Modal.warning({title:"系统提示",content:"打包命令不得为空，请输入后再试！"}):this.$Modal.warning({title:"系统提示",content:"安装依赖命令不得为空，请输入后再试！"}):this.$Modal.warning({title:"系统提示",content:"项目分支不得为空，请输入后再试！"}):this.$Modal.warning({title:"系统提示",content:"Git 地址不得为空，请输入后再试！"}):this.$Modal.warning({title:"系统提示",content:"部署端口不得为空，请输入后再试！"}):this.$Modal.warning({title:"系统提示",content:"部署目录不得为空，请输入后再试！"}):this.$Modal.warning({title:"系统提示",content:"项目名称不得为空，请输入后再试！"})},handleAutoSubmit:function(t){var e=this,i={title:this.title,www:this.www,port:this.port,git:this.git,build:this.build,install:this.install,dist:this.dist,proxy:this.proxy,gzip:this.gzip,key:this.key,remark:this.remark,commitBid:this.commitBid,isServer:this.isServer,isStatic:"0",router:this.router};this.createSocketServer((function(){e.$refs.logModal.isLogModal=!0,e.$Message.loading({content:"正在部署中，请稍后...",duration:0}),e.$route.query.bid?(i.bid=e.$route.query.bid,e.$request.post("/swd/deploy/initReset",i).then((function(t){e.$Message.destroy(),200===t.data.code&&(e.socketData.push({message:t.data.message,time:e.$dateTime()}),e.$Modal.success({title:"系统提示",content:"项目部署成功，打开【".concat(e.port,"】端口即可访问！")}),e.bid=t.data.data.bid)}))):e.$request.post("/swd/deploy/init",i).then((function(t){e.$Message.destroy(),200===t.data.code&&(e.socketData.push({message:t.data.message,time:e.$dateTime()}),e.socketData.push({message:"部署Key："+t.data.data.bid,time:e.$dateTime()}),e.$Modal.success({title:"系统提示",content:"<div><p>项目部署成功，打开【".concat(e.port,"】端口即可访问！</p><p>部署Key：").concat(t.data.data.bid,"</p></div>")}),e.bid=t.data.data.bid)}))}))},handleIsPortExit:function(){var t=this;this.port&&(this.isIntNum(this.port)?this.$request.post("/swd/deploy/portIsOccupied",{port:this.port}).then((function(e){200===e.data.code&&(1===e.data.data||t.queryPort&&t.queryPort===t.port?t.portMessage={state:!1,message:e.data.message}:t.portMessage={state:!0,message:e.data.message})})):this.portMessage={state:!0,message:"端口设置有误，请输入正整数！"})},handleIsProjectExit:function(){var t=this;this.title&&this.$request.post("/swd/deploy/isProject",{title:this.title}).then((function(e){200===e.data.code&&(t.queryTitle?t.queryTitle!==t.title?t.isProjectExit=e.data.state:t.isProjectExit=!1:t.isProjectExit=e.data.state)}))},handleIsWwwExit:function(){var t=this;this.www&&this.$request.post("/swd/deploy/isWwwFolder",{title:this.title,www:this.www}).then((function(e){200===e.data.code&&(t.queryWww?t.queryWww!==t.www?t.isWwwExit=e.data.state:t.isWwwExit=!1:t.isWwwExit=e.data.state)}))},handleAddProxy:function(){this.proxy.push({rewrite:"",target:""})},handleDeleteProxy:function(t){this.proxy.length>0&&this.proxy.splice(t,1)},handleBack:function(){this.$router.push({path:"/"})},handleLoginModal:function(){window.sessionStorage.clear(),this.$store.commit("setUser",{}),this.$router.push({path:"/login"})},isIntNum:function(t){return!!(1*t)},createSocketServer:function(t){var e=this;this.$request.post("/swd/deploy/openSocket").then((function(i){i.data.result&&(e.socket=new WebSocket("ws://".concat(location.hostname,":8001")),e.socket.onopen=function(){e.socketData=[{message:"已连接到应用服务器，正在部署...",time:e.$dateTime()}],t()},e.socket.onmessage=function(t){e.socketData.push({message:t.data,time:e.$dateTime()})})}))}}},p=d,u=(i("cbdf"),i("2877")),h=Object(u["a"])(p,r,l,!1,null,"001ec7a2",null),m=h.exports,w=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"content"},[i("section",[i("div",{class:["list-item",t.isProjectExit?"ivu-form-item-error":""]},[t._m(0),i("Input",{staticClass:"put-warp",attrs:{placeholder:"请输入项目名称..."},on:{"on-blur":t.handleIsProjectExit},model:{value:t.title,callback:function(e){t.title=e},expression:"title"}}),i("div",{staticClass:"tip"},[i("Tooltip",{attrs:{"max-width":"200",content:"请填写项目名称。",placement:"right"}},[i("Icon",{attrs:{type:"ios-help-circle-outline"}})],1),t.isProjectExit?i("span",{staticClass:"isExNo"},[t._v("此项目已存在，请重新输入！")]):t._e()],1)],1),i("div",{class:["list-item",t.isWwwExit?"ivu-form-item-error":""]},[t._m(1),i("Input",{staticClass:"put-warp",attrs:{disabled:t.disabled,placeholder:"例如：dist"},on:{"on-blur":t.handleIsWwwExit},model:{value:t.www,callback:function(e){t.www=e},expression:"www"}}),i("div",{staticClass:"tip"},[i("Tooltip",{attrs:{"max-width":"200",content:"指部署到服务器上的目录，也就是一级目录。",placement:"right"}},[i("Icon",{attrs:{type:"ios-help-circle-outline"}})],1),t.isWwwExit?i("span",{staticClass:"isExNo"},[t._v("此目录已存在，请重新输入！")]):t._e()],1)],1),i("div",{class:["list-item",t.portMessage.state?"ivu-form-item-error":""]},[i("label",[t._v("部署端口：")]),i("Input",{staticClass:"put-warp",attrs:{disabled:t.disabled,placeholder:"例如：8080 （选填）"},on:{"on-blur":t.handleIsPortExit},model:{value:t.port,callback:function(e){t.port=e},expression:"port"}}),i("div",{staticClass:"tip"},[i("Tooltip",{attrs:{"max-width":"200",content:"默认：本系统端口号/部署目录/index.html",placement:"right"}},[i("Icon",{attrs:{type:"ios-help-circle-outline"}})],1),t.portMessage.state?i("span",{staticClass:"isExNo"},[t._v(t._s(t.portMessage.message))]):t._e()],1)],1),i("div",{staticClass:"list-item"},[i("label",[t._v("代理地址：")]),i("ul",t._l(t.proxy,(function(e,s){return i("li",{key:"x"+s},[i("div",{staticClass:"put-warp proxy-warp"},[i("Input",{staticStyle:{width:"30%"},attrs:{placeholder:"例如：api"},model:{value:t.proxy[s].rewrite,callback:function(e){t.$set(t.proxy[s],"rewrite",e)},expression:"proxy[i].rewrite"}}),i("span",[t._v("-")]),i("Input",{attrs:{placeholder:"例如：http://127.0.0.1"},model:{value:t.proxy[s].target,callback:function(e){t.$set(t.proxy[s],"target",e)},expression:"proxy[i].target"}})],1),i("div",{staticClass:"tip"},[i("Icon",{attrs:{type:"ios-add-circle-outline"},on:{click:function(e){return e.stopPropagation(),t.handleAddProxy(e)}}}),t.proxy.length>1?i("Icon",{attrs:{type:"ios-close-circle-outline"},on:{click:function(e){return e.stopPropagation(),t.handleDeleteProxy(s)}}}):t._e()],1)])})),0)]),i("div",{staticClass:"list-item"},[i("label",[t._v("选择文件：")]),i("div",{staticClass:"put-warp file-warp"},[i("div",{staticClass:"file-top"},[i("Upload",{staticClass:"upload-but",attrs:{multiple:"",type:"drag","show-upload-list":!1,"before-upload":t.handleBeforeUpload,action:"/"}},[t._v(" 请选择文件 ")]),i("Upload",{staticClass:"upload-but",attrs:{multiple:"",webkitdirectory:"",type:"drag",action:"/","show-upload-list":!1,"before-upload":t.handleBeforeUpload}},[t._v(" 请选择文件夹 ")])],1),0===t.file.length?i("div",{staticClass:"file-bottom not-warp"},[i("div",[i("Icon",{attrs:{type:"ios-folder-open-outline"}})],1),i("p",[t._v("暂无文件")])]):t._e(),t.update&&0!==t.file.length?i("ul",{staticClass:"file-bottom"},t._l(t.file,(function(e,s){return i("li",{key:s},[i("span",[i("Icon",{attrs:{type:"ios-paper-outline"}}),i("span",{staticClass:"name"},[t._v(t._s(e.webkitRelativePath?e.webkitRelativePath:e.name))])],1),i("span",[e.state?i("span",{style:{color:"#19be6b"}},[t._v("上传成功")]):i("span",[t._v("等待上传")]),i("i",{staticClass:"fa fa-close",on:{click:function(e){return t.handleDeleteFile(s)}}})])])})),0):t._e()])]),i("div",{staticClass:"list-item"},[i("label",[t._v("部署摘要：")]),i("Input",{staticClass:"put-warp",attrs:{type:"textarea",rows:4,placeholder:"请输入概要内容...'"},model:{value:t.remark,callback:function(e){t.remark=e},expression:"remark"}})],1),i("div",{staticClass:"button-footer"},[i("Button",{attrs:{type:"success",ghost:""},on:{click:t.handleAutoSave}},[t._v("提交部署")]),i("Button",{on:{click:function(e){return e.stopPropagation(),t.handleBack(e)}}},[t._v("返回首页")])],1)]),i("LogModal",{ref:"logModal",attrs:{socketData:t.socketData},on:{"on-close":t.handleClose}})],1)},v=[function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("label",[i("i",{staticClass:"star"},[t._v("*")]),t._v("项目名称： ")])},function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("label",[i("i",{staticClass:"star"},[t._v("*")]),t._v("部署目录： ")])}],f=(i("159b"),i("ac1f"),i("1276"),i("fb6a"),i("a15b"),i("b0c0"),i("c4e3")),g={components:{Decorate:o["a"],DeployTip:n["a"],LogModal:c["a"]},data:function(){return{file:[],loadingStatus:!1,update:!0,fileNumber:0,disabled:!!this.$route.query.bid,bid:"",isProjectExit:!1,isWwwExit:!1,isLogModal:!1,sideList:["已连接到应用服务器，正在部署..."],socket:null,socketData:[],portMessage:{},queryTitle:"",queryWww:"",queryPort:"",title:"",commitBid:"",www:"",gzip:!0,port:"",remark:"",proxy:[{rewrite:"",target:""}],isServer:!1,router:"history"}},created:function(){var t=this;this.$route.query.bid&&(this.bid=this.$route.query.bid,this.$request.get("/swd/deploy/get",{params:{bid:this.bid}}).then((function(e){if(200===e.data.code){var i=e.data.data[0];t.queryPort=i.port,t.queryTitle=i.title,t.queryWww=i.www,t.proxy=i.proxy,t.title=i.title,t.isServer=i.isServer,t.remark=i.remark,t.www=i.www,t.port=i.port,t.gzip=i.gzip,t.router=i.router}})))},methods:{handleClose:function(){this.$router.push({path:"/"})},handleAutoSave:function(){this.title?this.www?(this.$route.query.bid,this.handleAutoSubmit()):this.$Modal.warning({title:"系统提示",content:"部署目录不得为空，请输入后再试！"}):this.$Modal.warning({title:"系统提示",content:"项目名称不得为空，请输入后再试！"})},handleBeforeUpload:function(t){return t.state=!1,this.file.push(t),!1},handleDeleteFile:function(t){this.file.splice(t,1)},handleResetData:function(){this.title="",this.www="",this.port="",this.gzip=!0,this.remark="",this.router="history",this.proxy=[{rewrite:"",target:""}],this.file=[]},handleAutoSubmit:function(){var t=this,e={title:this.title,www:this.www,port:this.port,isServer:this.isServer,remark:this.remark,proxy:this.proxy,gzip:this.gzip,router:this.router,isStatic:"1"};this.createSocketServer((function(){t.$refs.logModal.isLogModal=!0,e.bid=t.$route.query.bid,t.$Message.loading({content:"正在构建中，请稍后...",duration:0}),t.$request.post("/swd/deploy/initStatic",e).then((function(e){if(t.$Message.destroy(),200===e.data.code)if(t.commitBid=e.data.data.commitBid,t.bid=e.data.data.bid,t.file.length>10)var i=setTimeout((function(){t.$Modal.confirm({title:"系统提示",content:"<p>检测到文件个数过多，是否进行压缩打包上传？</p>",onOk:function(){t.handleUploadZip()},onCancel:function(){t.handleAddFile()}}),clearTimeout(i)}),500);else t.handleAddFile()}))}))},handleUploadZip:function(){var t=this;this.socketData.push({message:"The uploaded file is being compressed and packaged. Please wait...",time:this.$dateTime()});var e=new f;this.file.forEach((function(t){var i=t.webkitRelativePath.split("/");if(i.length>2){i=i.slice(1,i.length-1);var s=e.folder(i.join("/"));s.file(t.name,t)}else e.file(t.name,t)})),e.generateAsync({type:"Blob",compression:"DEFLATE"}).then((function(e){t.socketData.push({message:"The file has been compressed successfully and is being uploaded. Please wait...",time:t.$dateTime()});var i=new FormData;i.append("file",e),t.$request.post("/swd/fileEdit/saveZip",i,{headers:{"www-name":t.www,"commit-bid":t.commitBid}}).then((function(e){t.socketData.push({message:"压缩文件已上传成功！",time:t.$dateTime()}),t.deployReduction()}))}))},handleAddFile:function(){var t=this;this.file&&0!==this.file.length?(this.fileNumber=0,this.file.forEach((function(e,i){var s=new FormData;s.append("file",e,e.name),t.$request.post("/swd/fileEdit/saveFile",s,{headers:{"www-name":t.www,"commit-bid":t.commitBid,webkitRelativePath:e.webkitRelativePath}}).then((function(s){200===s.data.code?(e.state=!0,t.update=!1,t.update=!0,t.socketData.push({message:e.name+"文件上传保存成功！",time:t.$dateTime()})):t.socketData.push({message:e.name+"文件上传保存失败！",time:t.$dateTime()}),t.deployIsSesses(i)})).catch((function(s){t.socketData.push({message:e.name+"文件上传保存失败！",time:t.$dateTime()}),t.deployIsSesses(i)}))}))):(this.$Modal.success({title:"系统提示",content:this.title+"项目部署信息更新成功！"}),this.socketData.push({message:this.title+"项目部署信息更新成功！",time:this.$dateTime()}))},deployIsSesses:function(){this.fileNumber===this.file.length-1?this.deployReduction():this.fileNumber++},deployReduction:function(){var t=this,e={title:this.title,www:this.www,bid:this.bid,port:this.port,isServer:this.isServer,proxy:this.proxy,gzip:this.gzip,router:this.router,commitBid:this.commitBid,isStatic:"1"};this.$request.post("/swd/deploy/deployReduction",e).then((function(e){t.$Message.destroy(),200===e.data.code&&(t.$Modal.success({title:"系统提示",content:t.title+"项目部署成功！"}),t.socketData.push({message:t.title+"项目部署成功！",time:t.$dateTime()}))}))},handleIsPortExit:function(){var t=this;this.port&&(this.isIntNum(this.port)?this.$request.post("/swd/deploy/portIsOccupied",{port:this.port}).then((function(e){200===e.data.code&&(1===e.data.data||t.queryPort&&t.queryPort===t.port?t.portMessage={state:!1,message:e.data.message}:t.portMessage={state:!0,message:e.data.message})})):this.portMessage={state:!0,message:"端口设置有误，请输入正整数！"})},handleIsProjectExit:function(){var t=this;this.title&&this.$request.post("/swd/deploy/isProject",{title:this.title}).then((function(e){200===e.data.code?t.queryTitle?t.queryTitle!==t.title?t.isProjectExit=e.data.state:t.isProjectExit=!1:t.isProjectExit=e.data.state:t.isProjectExit=!1}))},handleIsWwwExit:function(){var t=this;this.www&&this.$request.post("/swd/deploy/isWwwFolder",{title:this.title,www:this.www}).then((function(e){200===e.data.code?t.queryWww?t.queryWww!==t.www?t.isWwwExit=e.data.state:t.isWwwExit=!1:t.isWwwExit=e.data.state:t.isWwwExit=!1}))},handleBack:function(){this.$router.push({path:"/"})},isIntNum:function(t){return!!(1*t)},createSocketServer:function(t){var e=this;this.$request.post("/swd/deploy/openSocket").then((function(i){i.data.result&&(e.socket=new WebSocket("ws://".concat(location.hostname,":8001")),e.socket.onopen=function(){e.socketData=[{message:"已连接到应用服务器，正在部署...",time:e.$dateTime()}],t()},e.socket.onmessage=function(t){e.socketData.push({message:t.data,time:e.$dateTime()})})}))},handleAddProxy:function(){this.proxy.push({rewrite:"",target:""})},handleDeleteProxy:function(t){this.proxy.length>0&&this.proxy.splice(t,1)}}},y=g,b=(i("7e17"),Object(u["a"])(y,w,v,!1,null,"5dce1838",null)),x=b.exports,k={components:{Decorate:o["a"],Gynamic:m,StaticIndex:x},data:function(){return{modeType:"0"}},created:function(){this.modeType=this.$route.query.isStatic?this.$route.query.isStatic:"0"},methods:{handleCharge:function(t){this.modeType=t}}},_=k,$=(i("8497"),Object(u["a"])(_,s,a,!1,null,"0075af9d",null));e["default"]=$.exports},"30a3":function(t,e,i){},"7d99":function(t,e,i){},"7e17":function(t,e,i){"use strict";i("7d99")},8497:function(t,e,i){"use strict";i("30a3")},b5d9:function(t,e,i){},cbdf:function(t,e,i){"use strict";i("b5d9")}}]);