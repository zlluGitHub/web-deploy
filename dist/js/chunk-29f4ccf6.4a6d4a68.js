(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-29f4ccf6"],{"05f8":function(t,e,o){"use strict";o("69aa")},"0a0d":function(t,e,o){"use strict";o.r(e);var i=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"swd-index"},[i("div",{staticClass:"header"},[i("Decorate",{attrs:{icon:"ivu-icon ivu-icon-md-cube",title:"工作台",describe:"这里将展示你的个人项目，当然也包括协同项目。"}},[i("div",{staticClass:"button-warp"},[i("Button",{attrs:{ghost:"",type:"primary",loading:t.refreshLoading,icon:"md-refresh"},on:{click:t.handleRefresh}},[t._v("重启所有服务")]),i("Button",{attrs:{ghost:"",type:"error",loading:t.powerLoading,icon:"md-power"},on:{click:t.handlePower}},[t._v("关闭所有服务")])],1)])],1),i("div",{staticClass:"content"},[i("div",[t.projectData&&t.projectData.length?i("ul",t._l(t.projectData,(function(e,o){return i("li",{key:e.bid+o},[i("div",{staticClass:"item-header"},["0"==e.isStatic?i("div",{staticClass:"left"},[i("span",{staticClass:"state"},[i("i",{style:{background:e.isServer?"#2d8cf0":"red"}}),i("span",[t._v(t._s(e.isServer?"服务已开启":"服务已关闭"))])]),i("span",{staticClass:"state auto"},[i("i",{style:{background:e.isAuto?"#2d8cf0":"red"}}),i("span",[t._v(t._s(e.isAuto?"部署已开启":"部署已暂停"))])])]):i("div",{staticClass:"left"},[i("span",{staticClass:"state"},[i("i",{style:{background:e.isServer?"#2d8cf0":"red"}}),e.port?i("span",[t._v(t._s(e.isServer?"服务已开启":"服务已关闭"))]):i("span",[t._v("静态服务")])])]),e.port?i("div",{staticClass:"right"},[i("Dropdown",{attrs:{trigger:"click"}},[i("Icon",{attrs:{type:"md-more",size:"18"}}),i("DropdownMenu",{attrs:{slot:"list"},slot:"list"},[e.port?i("DropdownItem",{nativeOn:{click:function(o){return t.handleReload(e)}}},[t._v(" 重启运行服务 ")]):t._e(),e.port?i("DropdownItem",{nativeOn:{click:function(o){return t.handleProt(e)}}},[t._v(" "+t._s(e.isServer?"关闭":"开启")+"运行服务 ")]):t._e(),"0"===e.isStatic?i("DropdownItem",{nativeOn:{click:function(o){return t.handleAuto(e)}}},[t._v(" "+t._s(e.isAuto?"关闭":"开启")+"自动部署 ")]):t._e(),i("DropdownItem",{nativeOn:{click:function(o){return t.handleGzip(e)}}},[t._v(" "+t._s(e.gzip?"关闭":"开启")+"Gzip模式 ")]),e.port?i("DropdownItem",{nativeOn:{click:function(o){return t.handleHistory(e)}}},[t._v(" "+t._s("hash"===e.router?"切换至History模式":"切换至Hash模式")+" ")]):t._e()],1)],1)],1):t._e()]),i("h2",{on:{click:function(o){return t.handleToUrl(e)}}},[t._v(" "+t._s(e.title)+" ")]),i("p",[i("Icon",{attrs:{type:"ios-code-working",size:"20"}}),i("span",[t._v(t._s(e.router)+"模式")])],1),i("p",[i("Icon",{attrs:{type:"ios-settings-outline",size:"18"}}),i("span",[t._v(t._s("0"==e.isStatic?"自动部署":"静态部署")+t._s(e.port?"（"+e.port+"）":""))])],1),i("p",[i("Icon",{attrs:{type:"ios-time-outline",size:"18"}}),i("span",[t._v(t._s(e.time))])],1),i("div",{staticClass:"description"},[t._v(t._s(e.remark?e.remark:"暂无描述"))]),i("div",{staticClass:"bottom-list"},[i("Tooltip",{staticClass:"border-r-no",attrs:{content:"删除",placement:"top"}},[i("Icon",{attrs:{type:"ios-trash-outline",size:"20"},on:{click:function(o){return t.handleModalDelete(e)}}})],1),i("Tooltip",{staticClass:"border-r-no",attrs:{content:"更新项目",placement:"top"}},[i("Icon",{attrs:{type:"ios-create-outline",size:"20"},on:{click:function(o){return t.handleRouter("/create",e.bid,e.isStatic)}}})],1),i("Tooltip",{staticClass:"border-r-no",attrs:{content:"部署列表",placement:"top"}},[i("Icon",{attrs:{type:"ios-list",size:"26"},on:{click:function(o){return t.handleRouter("/commitList",e.bid,e.isStatic)}}})],1),i("Tooltip",{attrs:{content:"项目详情",placement:"top"}},[i("Icon",{attrs:{type:"ios-list-box-outline",size:"20"},on:{click:function(o){return t.handleRouter("0"==e.isStatic?"/gynamicDetails":"/staticIndexDetails",e.bid)}}})],1)],1)])})),0):i("div",{staticClass:"no-warp"},[i("img",{attrs:{src:o("5c25")}})]),i("div",{staticClass:"page"},[i("Page",{attrs:{"prev-text":"上一页","next-text":"下一页","show-elevator":"","show-total":"",total:t.total,"show-sizer":""},on:{"on-change":t.changePage,"on-page-size-change":t.changeSizePage}})],1)])]),i("Modal",{attrs:{transfer:!1,title:"系统提示","ok-text":"确认删除","cancel-text":"我再想想"},on:{"on-ok":t.handleDeleteModal},model:{value:t.isModalDelete,callback:function(e){t.isModalDelete=e},expression:"isModalDelete"}},[i("div",{staticClass:"modal-box"},[i("div",[i("Checkbox",{model:{value:t.projectInfo,callback:function(e){t.projectInfo=e},expression:"projectInfo"}},[t._v("彻底删除项目所有相关信息，包含部署日志等"),i("span",[t._v("（不可恢复）"),i("Icon",{attrs:{type:"ios-information-circle"}})],1)]),i("Checkbox",{model:{value:t.projectBackups,callback:function(e){t.projectBackups=e},expression:"projectBackups"}},[t._v("彻底删除项目部署文件，包含版本备份文件等"),i("span",[t._v("（不可恢复）"),i("Icon",{attrs:{type:"ios-information-circle"}})],1)])],1)])])],1)},a=[],n=(o("99af"),o("20d6")),s={components:{Decorate:n["a"]},data:function(){return{refreshLoading:!1,powerLoading:!1,pageNo:1,pageSize:10,total:0,projectData:[],serverData:{},isModalDelete:!1,projectPort:!0,projectInfo:!1,projectBackups:!1}},created:function(){this.handleGetData()},methods:{handleRefresh:function(){var t=this;this.$Modal.confirm({title:"系统提示",content:"<p>确定要重启所有项目服务吗？</p>",onOk:function(){t.refreshLoading=!0,t.$request.post("/swd/deploy/openAllServer").then((function(e){if(200===e.data.code){var o=setTimeout((function(){t.$Modal.success({title:"系统提示",content:"所有服务已重启成功！"}),t.refreshLoading=!1,clearTimeout(o)}),500);t.handleGetData()}}))}})},handlePower:function(){var t=this;this.$Modal.confirm({title:"系统提示",content:"<p>确定要关闭所有项目服务吗？</p>",onOk:function(){t.powerLoading=!0,t.$request.post("/swd/deploy/closeAllServer").then((function(e){if(200===e.data.code){var o=setTimeout((function(){t.$Modal.success({title:"系统提示",content:"所有服务均已关闭！"}),t.powerLoading=!1,clearTimeout(o)}),500);t.handleGetData()}}))}})},handleGetData:function(){var t=this,e={pageNo:this.pageNo,pageSize:this.pageSize};this.$request.get("/swd/deploy/get",{params:e}).then((function(e){200===e.data.code&&(t.total=e.data.count,t.projectData=e.data.data)}))},changePage:function(t){this.pageNo=t,this.handleGetData()},changeSizePage:function(t){this.pageSize=t,this.handleGetData()},handleReload:function(t){var e=this;this.$Message.loading({content:"服务正在重启中，请稍后...",duration:0}),this.$request.post("/swd/deploy/closeServer",{bid:t.bid,commitBid:t.commitBid,title:t.title,port:t.port}).then((function(o){200===o.data.code?e.$request.post("/swd/deploy/openServer",{bid:t.bid,commitBid:t.commitBid,title:t.title,port:t.port,proxy:t.proxy,www:t.www}).then((function(o){e.$Message.destroy(),200===o.data.code?(e.$Modal.success({title:"系统提示",content:t.title+"服务重启成功！"}),e.handleGetData()):e.$Modal.error({title:"系统提示",content:t.title+"服务重启失败！"})})):(e.$Message.destroy(),e.$Modal.error({title:"系统提示",content:t.title+"服务重启失败！"}))}))},handleProt:function(t){var e=this;t.isServer?this.$request.post("/swd/deploy/closeServer",{bid:t.bid,commitBid:t.commitBid,title:t.title,port:t.port}).then((function(o){200===o.data.code?(e.$Modal.success({title:"系统提示",content:t.title+"服务关闭成功！"}),e.handleGetData()):e.$Modal.error({title:"系统提示",content:t.title+"服务关闭失败！"})})):this.$request.post("/swd/deploy/openServer",{bid:t.bid,commitBid:t.commitBid,title:t.title,port:t.port,proxy:t.proxy,www:t.www}).then((function(o){200===o.data.code?(e.$Modal.success({title:"系统提示",content:t.title+"服务开启成功！"}),e.handleGetData()):e.$Modal.error({title:"系统提示",content:t.title+"服务开启失败！"})}))},handleGzip:function(t){var e=this,o="";t.gzip?(t.gzip=!1,o="已关闭Gzip模式！"):(t.gzip=!0,o="已开启Gzip模式！"),this.$request.post("/swd/deploy/updateInfo",{gzip:t.gzip,bid:t.bid}).then((function(t){200===t.data.code&&(e.$Modal.success({title:"系统提示",content:o}),e.handleGetData())}))},handleAuto:function(t){var e=this,o="";t.isAuto?(t.isAuto=!1,o="自动部署关闭成功！（此项目与Git不在关联，自动部署已暂停）"):(t.isAuto=!0,o="自动部署开启成功！（此项目与Git已关联，自动部署已开启）"),this.$request.post("/swd/deploy/updateInfo",{isAuto:t.isAuto,bid:t.bid}).then((function(i){200===i.data.code&&(e.$Modal.success({title:"系统提示",content:t.title+o}),e.handleGetData())}))},handleHistory:function(t){var e=this,o="",i="";"hash"===t.router?(t.router="history",o="History路由模式关闭成功！",i="History路由模式关闭失败！"):(t.router="hash",o="History路由模式开启成功！",i="History路由模式开启失败！"),this.$request.post("/swd/deploy/history",t).then((function(a){200===a.data.code?(e.$Modal.success({title:"系统提示",content:t.title+o}),e.handleGetData()):e.$Modal.error({title:"系统提示",content:t.title+i})})).catch((function(t){}))},handleModalDelete:function(t){this.serverData=t,this.isModalDelete=!0,this.projectPort=!0,this.projectInfo=!1,this.projectBackups=!1},handleDeleteModal:function(){var t=this;if(this.$Message.loading({content:"正在删除中，请稍后...",duration:0}),!this.projectInfo&&!this.projectBackups)return this.$Message.destroy(),void this.$Modal.error({title:"系统提示",content:"请至少选择一项后才可执行此操作！"});this.serverData.projectPort=this.projectPort,this.serverData.projectInfo=this.projectInfo,this.serverData.projectBackups=this.projectBackups,this.$request.post("/swd/deploy/deleteInfo",this.serverData).then((function(e){t.$Message.destroy(),200===e.data.code&&(t.$Modal.success({title:"系统提示",content:e.data.message}),t.handleGetData())}))},handleRouter:function(t,e,o){this.$router.push({path:t,query:{bid:e,isStatic:o}})},handleToUrl:function(t){var e=window.open();e.opener=null,t.port?e.location="".concat(window.location.protocol,"//").concat(window.location.hostname,":").concat(t.port):e.location="".concat(window.location.origin,"/").concat(t.www),e.target="_blank"}}},r=s,c=(o("05f8"),o("2877")),l=Object(c["a"])(r,i,a,!1,null,"0bdc0488",null);e["default"]=l.exports},"1dde":function(t,e,o){var i=o("d039"),a=o("b622"),n=o("2d00"),s=a("species");t.exports=function(t){return n>=51||!i((function(){var e=[],o=e.constructor={};return o[s]=function(){return{foo:1}},1!==e[t](Boolean).foo}))}},"20d6":function(t,e,o){"use strict";var i=function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("div",{staticClass:"spots"},[o("span",{staticClass:"decorate",staticStyle:{background:"rgb(201, 27, 0)",width:"51px",height:"51px","margin-top":"-25.5px","margin-left":"-25.5px",top:"55.6675%",left:"5%"}}),o("span",{staticClass:"decorate",staticStyle:{background:"rgb(23, 90, 171)",width:"28px",height:"28px","margin-top":"-14px","margin-left":"-14px",top:"10.2246%",left:"15%"}}),o("span",{staticClass:"decorate",staticStyle:{background:"rgb(233, 34, 36)",width:"37px",height:"37px","margin-top":"-18.5px","margin-left":"-18.5px",top:"71.9133%",left:"25%"}}),o("span",{staticClass:"decorate",staticStyle:{background:"rgb(0, 62, 135)",width:"47px",height:"47px","margin-top":"-23.5px","margin-left":"-23.5px",top:"22.8839%",left:"35%"}}),o("span",{staticClass:"decorate",staticStyle:{background:"rgb(0, 135, 231)",width:"31px",height:"31px","margin-top":"-15.5px","margin-left":"-15.5px",top:"5.09172%",left:"45%"}}),o("span",{staticClass:"decorate",staticStyle:{background:"rgb(23, 90, 171)",width:"52px",height:"52px","margin-top":"-26px","margin-left":"-26px",top:"32.1525%",left:"55%"}}),o("span",{staticClass:"decorate",staticStyle:{background:"rgb(255, 86, 0)",width:"29px",height:"29px","margin-top":"-14.5px","margin-left":"-14.5px",top:"46.8035%",left:"65%"}}),o("span",{staticClass:"decorate",staticStyle:{width:"44px",height:"44px","margin-top":"-22px","margin-left":"-22px",top:"76.8537%",left:"75%"}}),o("span",{staticClass:"decorate",staticStyle:{background:"rgb(201, 27, 0)",width:"43px",height:"43px","margin-top":"-21.5px","margin-left":"-21.5px",top:"30.7088%",left:"85%"}}),o("span",{staticClass:"decorate",staticStyle:{width:"27px",height:"27px","margin-top":"-13.5px","margin-left":"-13.5px",top:"7.43497%",left:"95%"}}),o("div",{staticClass:"warp"},[o("div",{staticClass:"left"},[o("div",{staticClass:"logo"},[o("i",{class:t.icon})]),o("div",{staticClass:"info"},[o("h2",[t._v(t._s(t.title))]),o("p",[t._v(t._s(t.describe))])])]),t._t("default")],2)])},a=[],n={props:["icon","title","describe"]},s=n,r=(o("5c23"),o("2877")),c=Object(r["a"])(s,i,a,!1,null,"4c08b714",null);e["a"]=c.exports},"5c23":function(t,e,o){"use strict";o("b7f7")},"5c25":function(t,e,o){t.exports=o.p+"img/no-data.525d0c46.png"},"69aa":function(t,e,o){},8418:function(t,e,o){"use strict";var i=o("c04e"),a=o("9bf2"),n=o("5c6c");t.exports=function(t,e,o){var s=i(e);s in t?a.f(t,s,n(0,o)):t[s]=o}},"99af":function(t,e,o){"use strict";var i=o("23e7"),a=o("d039"),n=o("e8b5"),s=o("861d"),r=o("7b0b"),c=o("50c4"),l=o("8418"),d=o("65f0"),p=o("1dde"),u=o("b622"),h=o("2d00"),f=u("isConcatSpreadable"),g=9007199254740991,v="Maximum allowed index exceeded",m=h>=51||!a((function(){var t=[];return t[f]=!1,t.concat()[0]!==t})),w=p("concat"),b=function(t){if(!s(t))return!1;var e=t[f];return void 0!==e?!!e:n(t)},x=!m||!w;i({target:"Array",proto:!0,forced:x},{concat:function(t){var e,o,i,a,n,s=r(this),p=d(s,0),u=0;for(e=-1,i=arguments.length;e<i;e++)if(n=-1===e?s:arguments[e],b(n)){if(a=c(n.length),u+a>g)throw TypeError(v);for(o=0;o<a;o++,u++)o in n&&l(p,u,n[o])}else{if(u>=g)throw TypeError(v);l(p,u++,n)}return p.length=u,p}})},b7f7:function(t,e,o){}}]);