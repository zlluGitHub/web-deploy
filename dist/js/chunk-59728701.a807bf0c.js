(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-59728701"],{"01e1":function(t,e,a){"use strict";a("9148")},"159b":function(t,e,a){var i=a("da84"),o=a("fdbc"),n=a("17c2"),s=a("9112");for(var r in o){var c=i[r],l=c&&c.prototype;if(l&&l.forEach!==n)try{s(l,"forEach",n)}catch(d){l.forEach=n}}},"17c2":function(t,e,a){"use strict";var i=a("b727").forEach,o=a("a640"),n=o("forEach");t.exports=n?[].forEach:function(t){return i(this,t,arguments.length>1?arguments[1]:void 0)}},"1dde":function(t,e,a){var i=a("d039"),o=a("b622"),n=a("2d00"),s=o("species");t.exports=function(t){return n>=51||!i((function(){var e=[],a=e.constructor={};return a[s]=function(){return{foo:1}},1!==e[t](Boolean).foo}))}},"20d6":function(t,e,a){"use strict";var i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"spots"},[a("span",{staticClass:"decorate",staticStyle:{background:"rgb(201, 27, 0)",width:"51px",height:"51px","margin-top":"-25.5px","margin-left":"-25.5px",top:"55.6675%",left:"5%"}}),a("span",{staticClass:"decorate",staticStyle:{background:"rgb(23, 90, 171)",width:"28px",height:"28px","margin-top":"-14px","margin-left":"-14px",top:"10.2246%",left:"15%"}}),a("span",{staticClass:"decorate",staticStyle:{background:"rgb(233, 34, 36)",width:"37px",height:"37px","margin-top":"-18.5px","margin-left":"-18.5px",top:"71.9133%",left:"25%"}}),a("span",{staticClass:"decorate",staticStyle:{background:"rgb(0, 62, 135)",width:"47px",height:"47px","margin-top":"-23.5px","margin-left":"-23.5px",top:"22.8839%",left:"35%"}}),a("span",{staticClass:"decorate",staticStyle:{background:"rgb(0, 135, 231)",width:"31px",height:"31px","margin-top":"-15.5px","margin-left":"-15.5px",top:"5.09172%",left:"45%"}}),a("span",{staticClass:"decorate",staticStyle:{background:"rgb(23, 90, 171)",width:"52px",height:"52px","margin-top":"-26px","margin-left":"-26px",top:"32.1525%",left:"55%"}}),a("span",{staticClass:"decorate",staticStyle:{background:"rgb(255, 86, 0)",width:"29px",height:"29px","margin-top":"-14.5px","margin-left":"-14.5px",top:"46.8035%",left:"65%"}}),a("span",{staticClass:"decorate",staticStyle:{width:"44px",height:"44px","margin-top":"-22px","margin-left":"-22px",top:"76.8537%",left:"75%"}}),a("span",{staticClass:"decorate",staticStyle:{background:"rgb(201, 27, 0)",width:"43px",height:"43px","margin-top":"-21.5px","margin-left":"-21.5px",top:"30.7088%",left:"85%"}}),a("span",{staticClass:"decorate",staticStyle:{width:"27px",height:"27px","margin-top":"-13.5px","margin-left":"-13.5px",top:"7.43497%",left:"95%"}}),a("div",{staticClass:"warp"},[a("div",{staticClass:"left"},[a("div",{staticClass:"logo"},[a("i",{class:t.icon})]),a("div",{staticClass:"info"},[a("h2",[t._v(t._s(t.title))]),a("p",[t._v(t._s(t.describe))])])]),t._t("default")],2)])},o=[],n={props:["icon","title","describe"]},s=n,r=(a("5c23"),a("2877")),c=Object(r["a"])(s,i,o,!1,null,"4c08b714",null);e["a"]=c.exports},"30f8":function(t,e,a){},"4de4":function(t,e,a){"use strict";var i=a("23e7"),o=a("b727").filter,n=a("1dde"),s=n("filter");i({target:"Array",proto:!0,forced:!s},{filter:function(t){return o(this,t,arguments.length>1?arguments[1]:void 0)}})},"5c23":function(t,e,a){"use strict";a("b7f7")},"5c74":function(t,e,a){"use strict";a("ed3d")},8418:function(t,e,a){"use strict";var i=a("c04e"),o=a("9bf2"),n=a("5c6c");t.exports=function(t,e,a){var s=i(e);s in t?o.f(t,s,n(0,a)):t[s]=a}},9148:function(t,e,a){},"9ff1":function(t,e,a){"use strict";a("30f8")},a33d:function(t,e,a){"use strict";var i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("Modal",{staticClass:"log-box",attrs:{title:"部署日志",scrollable:"",transfer:!1,width:"70%","mask-closable":!1,"footer-hide":!0},model:{value:t.isLogModal,callback:function(e){t.isLogModal=e},expression:"isLogModal"}},[a("div",{ref:"logWarp",staticClass:"log-warp"},[a("ul",t._l(t.socketData,(function(e,i){return a("li",{key:i},[a("span",[t._v("【"+t._s(e.time)+" 】:")]),a("pre",{domProps:{innerHTML:t._s(e.message)}})])})),0)])])},o=[],n=a("20d6"),s=a("f971"),r={components:{Decorate:n["a"],DeployTip:s["a"]},data:function(){return{isLogModal:!1}},props:["socketData"],watch:{socketData:function(){this.isLogModal=!0;var t=this.$refs.logWarp;t.scrollHeight>t.clientHeight&&(t.scrollTop=t.scrollHeight)}}},c=r,l=(a("5c74"),a("2877")),d=Object(l["a"])(c,i,o,!1,null,"b2ba6ab0",null);e["a"]=d.exports},a640:function(t,e,a){"use strict";var i=a("d039");t.exports=function(t,e){var a=[][t];return!!a&&i((function(){a.call(null,e||function(){throw 1},1)}))}},ade3:function(t,e,a){"use strict";function i(t,e,a){return e in t?Object.defineProperty(t,e,{value:a,enumerable:!0,configurable:!0,writable:!0}):t[e]=a,t}a.d(e,"a",(function(){return i}))},b64b:function(t,e,a){var i=a("23e7"),o=a("7b0b"),n=a("df75"),s=a("d039"),r=s((function(){n(1)}));i({target:"Object",stat:!0,forced:r},{keys:function(t){return n(o(t))}})},b7f7:function(t,e,a){},d1c1:function(t,e,a){"use strict";a.r(e);var i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"swd-commit"},[a("div",{staticClass:"header"},[a("Decorate",{attrs:{icon:"ivu-icon ivu-icon-ios-list-box-outline",title:"构建列表（"+t.projectData.title+"）",describe:"这里将展示你的个人项目，当然也包括协同项目。"}})],1),a("div",{staticClass:"breadcrumb"},[a("div",{staticClass:"warp"},[a("Breadcrumb",[a("BreadcrumbItem",{attrs:{to:"/"}},[a("Icon",{attrs:{type:"ios-home-outline",size:"18"}}),t._v(" 工作台 ")],1),a("BreadcrumbItem",[a("Icon",{attrs:{type:"ios-list-box-outline",size:"18"}}),t._v(" "+t._s("构建列表（"+t.projectData.title+"）")+" ")],1)],1)],1)]),a("div",{staticClass:"content"},[a("div",[a("Table",{attrs:{border:"",columns:t.columns,data:t.content},scopedSlots:t._u([{key:"deploy",fn:function(e){var i=e.row;return[i.bid===t.projectData.commitBid?a("p",{staticClass:"deploy-state"},[a("i",{staticClass:"ok"}),a("span",[t._v("已部署")])]):a("p",{staticClass:"deploy-state"},[a("i",{staticClass:"no"}),a("span",[t._v("未部署")])])]}},{key:"structure",fn:function(e){var a=e.row;return[t._v(" "+t._s(a.isExit?"Git 推送（"+a.activeType+"）":"手动推送（"+a.activeType+"）")+" ")]}},{key:"fileChange",fn:function(e){var i=e.row;return[i.isExit?a("p",{staticClass:"file-change"},[a("span",[t._v("修改"),a("em",[t._v(t._s(i.modified.length))]),t._v("个、 ")]),a("span",[t._v("新增"),a("em",[t._v(t._s(i.added.length))]),t._v("个、 ")]),a("span",[t._v("刪除"),a("em",[t._v(t._s(i.removed.length))]),t._v("个 ")])]):a("p",{staticClass:"file-change"},[a("span",[t._v("修改"),a("em",[t._v("☀")]),t._v("个、 ")]),a("span",[t._v("新增"),a("em",[t._v("☀")]),t._v("个、 ")]),a("span",[t._v("刪除"),a("em",[t._v("☀")]),t._v("个 ")])])]}},{key:"message",fn:function(e){var a=e.row;return[t._v(" "+t._s(a.message?a.message:"暂无描述")+" ")]}},{key:"action",fn:function(e){var i=e.row;return[a("div",{staticClass:"button-action"},[i.bid!==t.projectData.commitBid?a("Button",{attrs:{type:"primary",size:"small"},on:{click:function(e){return t.handleInitReset(i)}}},[t._v("部署")]):t._e(),a("Button",{attrs:{type:"warning",size:"small"},on:{click:function(e){return t.handleShowLog(i)}}},[t._v("日志")]),i.isExit?a("Button",{attrs:{type:"error",size:"small"},on:{click:function(e){return t.handleUrl(i)}}},[t._v("变动")]):t._e()],1)]}}])}),a("div",{staticClass:"page"},[a("Page",{attrs:{"prev-text":"上一页","next-text":"下一页","show-elevator":"","show-total":"",total:t.total,"show-sizer":""},on:{"on-change":t.changePage,"on-page-size-change":t.changeSizePage}})],1)],1)]),a("LogModal",{ref:"logModal",attrs:{socketData:t.socketData}})],1)},o=[],n=(a("b64b"),a("a4d3"),a("4de4"),a("e439"),a("159b"),a("dbb4"),a("ade3"));function s(t,e){var a=Object.keys(t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(t);e&&(i=i.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),a.push.apply(a,i)}return a}function r(t){for(var e=1;e<arguments.length;e++){var a=null!=arguments[e]?arguments[e]:{};e%2?s(Object(a),!0).forEach((function(e){Object(n["a"])(t,e,a[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(a)):s(Object(a)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(a,e))}))}return t}a("d81d"),a("fb6a");var c=a("20d6"),l=a("a33d"),d={components:{Decorate:c["a"],LogModal:l["a"]},data:function(){return{pageNo:1,pageSize:10,total:10,isLogModal:!1,socketData:[],columns:[{title:"构建方式",slot:"structure",width:200},{title:"构建情况",slot:"fileChange"},{title:"构建时间",key:"startTime"},{title:"构建时长",width:150,key:"duration"},{title:"部署状态",slot:"deploy",width:150},{title:"构建描述",slot:"message"},{title:"操作",slot:"action",width:200}],content:[],projectData:{}}},created:function(){this.getProjectData(),this.handleGetData()},methods:{handleShowLog:function(t){this.$refs.logModal.isLogModal=!0,this.socketData=t.log},handleGetData:function(){var t=this,e={pageNo:this.pageNo,pageSize:this.pageSize,projectId:this.$route.query.bid};this.$request.get("/swd/commit/get",{params:e}).then((function(e){200===e.data.code&&(t.total=e.data.count,t.content=e.data.data.map((function(e){var a=new Date(e.startTime),i=new Date(e.endTime);return e.duration="共耗时："+Math.floor((i-a)/1e3)+"秒",e.state=t.procedure(e.deployState),e.activeType=t.activeType(e.activeType),e.hookPayload&&(e=r(r({},e),e.hookPayload),e.added=e.added?e.added:[],e.modified=e.modified?e.modified:[],e.removed=e.removed?e.removed:[]),e})))}))},getProjectData:function(){var t=this;this.$request.get("/swd/deploy/get",{params:{bid:this.$route.query.bid}}).then((function(e){200===e.data.code&&(t.projectData=e.data.data[0])}))},procedure:function(t){return"start"===t.type?16:"clone"===t.type?32:"install"===t.type?48:"build"===t.type?64:"deploy"===t.type?80:"port"===t.type?100:void 0},activeType:function(t){return"init"===t?"首次部署":"resetInit"===t?"重新部署":"install"===t?"依赖安装":"build"===t?"打包部署":"gitHook"===t?"自动部署":"默认部署"},changePage:function(t){this.pageNo=t,this.handleGetData()},changeSizePage:function(t){this.pageSize=t,this.handleGetData()},handleUrl:function(t){var e=window.open();e.opener=null,e.location=t.isExit?t.url:this.projectData.git.slice(0,-4),e.target="_blank"},handleInitReset:function(t){var e=this;this.$Modal.confirm({title:"系统提示",content:"<p>确定要重新部署该版本吗？</p>",onOk:function(){e.createSocketServer((function(){e.socketData=[{message:"已连接到应用服务器，正在部署...",time:e.$dateTime()}],e.$refs.logModal.isLogModal=!0,e.projectData.hookPayload=t.hookPayload,e.projectData.commitBid=t.bid,e.$request.post("/swd/deploy/relyReset",e.projectData).then((function(t){200===t.data.code&&e.$Modal.success({title:"系统提示",content:t.data.message})}))}))}})},createSocketServer:function(t){var e=this;this.$request.post("/swd/deploy/openSocket").then((function(a){a.data.result&&(e.socket=new WebSocket("ws://152.136.101.31:8001"),e.socket.onopen=function(){e.socketData=[{message:"已连接到应用服务器，正在部署...",time:e.$dateTime()}],t()},e.socket.onmessage=function(t){e.socketData.push({message:t.data,time:e.$dateTime()})})}))}}},p=d,u=(a("9ff1"),a("2877")),f=Object(u["a"])(p,i,o,!1,null,"ee12f93c",null);e["default"]=f.exports},d81d:function(t,e,a){"use strict";var i=a("23e7"),o=a("b727").map,n=a("1dde"),s=n("map");i({target:"Array",proto:!0,forced:!s},{map:function(t){return o(this,t,arguments.length>1?arguments[1]:void 0)}})},dbb4:function(t,e,a){var i=a("23e7"),o=a("83ab"),n=a("56ef"),s=a("fc6a"),r=a("06cf"),c=a("8418");i({target:"Object",stat:!0,sham:!o},{getOwnPropertyDescriptors:function(t){var e,a,i=s(t),o=r.f,l=n(i),d={},p=0;while(l.length>p)a=o(i,e=l[p++]),void 0!==a&&c(d,e,a);return d}})},e439:function(t,e,a){var i=a("23e7"),o=a("d039"),n=a("fc6a"),s=a("06cf").f,r=a("83ab"),c=o((function(){s(1)})),l=!r||c;i({target:"Object",stat:!0,forced:l,sham:!r},{getOwnPropertyDescriptor:function(t,e){return s(n(t),e)}})},ed3d:function(t,e,a){},f971:function(t,e,a){"use strict";var i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"tip-warp"},[a("h3",[a("Icon",{attrs:{type:"ios-help-circle-outline",size:"18"}}),a("span",{staticClass:"active"},[t._v("关联 Git 仓库")])],1),a("div",{staticClass:"content"},[a("div",[t._v("1、打开git：项目仓库 -> Settings -> Webhooks -> Add webhook")]),a("div",[t._v(" 2、在 "),a("span",{staticClass:"code"},[t._v("Target URL")]),t._v(" 中填入 "),a("span",{staticClass:"url"},[t._v(t._s(t.url)+"/swd/git/webhook")]),t._v(" 地址 ")]),t._m(0),t._m(1),t._m(2),a("div",[a("span",{staticStyle:{color:"red"}},[t._v("注意：")]),t._v("若项代码托管平台为GitHub时，在第 2 步中需要填入 "),a("span",{staticClass:"url"},[t._v(t._s(t.url)+"/api/deploy/git?key="+t._s(t.key?t.key:"返回的key值"))]),t._v(" 地址。 ")])])])},o=[function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[t._v(" 3、 "),a("span",{staticClass:"code"},[t._v("POST Content Type")]),t._v(" 选择 "),a("span",{staticClass:"select"},[t._v("application/json")])])},function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[t._v(" 4、 "),a("span",[t._v(" 在 "),a("span",{staticClass:"code"},[t._v("Secret")]),t._v(" 中填入部署成功后返回的 Key 值。 ")])])},function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[t._v(" 5、 "),a("span",{staticClass:"code"},[t._v("Trigger On")]),t._v("选择 "),a("span",{staticClass:"select"},[t._v("Push Events")])])}],n={data:function(){return{key:"",url:""}},mounted:function(){this.url=window.location.origin},methods:{handleShell:function(){this.$event.emit("isShell",!0)}}},s=n,r=(a("01e1"),a("2877")),c=Object(r["a"])(s,i,o,!1,null,"0899da98",null);e["a"]=c.exports},fb6a:function(t,e,a){"use strict";var i=a("23e7"),o=a("861d"),n=a("e8b5"),s=a("23cb"),r=a("50c4"),c=a("fc6a"),l=a("8418"),d=a("b622"),p=a("1dde"),u=p("slice"),f=d("species"),h=[].slice,v=Math.max;i({target:"Array",proto:!0,forced:!u},{slice:function(t,e){var a,i,d,p=c(this),u=r(p.length),g=s(t,u),m=s(void 0===e?u:e,u);if(n(p)&&(a=p.constructor,"function"!=typeof a||a!==Array&&!n(a.prototype)?o(a)&&(a=a[f],null===a&&(a=void 0)):a=void 0,a===Array||void 0===a))return h.call(p,g,m);for(i=new(void 0===a?Array:a)(v(m-g,0)),d=0;g<m;g++,d++)g in p&&l(i,d,p[g]);return i.length=d,i}})}}]);