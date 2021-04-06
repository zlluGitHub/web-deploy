<template>
  <div class="swd-create">
    <div class="header">
      <Decorate
        icon="ivu-icon ivu-icon-md-add"
        title="创建项目"
        describe="在这里可以创建一个新的项目，同时也可以迭代之前的项目。项目的创建分为静态部署与自动部署，可根据自身需求进行选择。"
      >
        <div class="header__change">
          <div
            class="em-header__nav__item"
            @click="handleCharge('0')"
            :class="[modeType === '0' ? 'is-active' : '']"
          >
            <i class="ivu-icon ivu-icon-android-list"></i> 静态部署
          </div>
          <div
            class="em-header__nav__item"
            @click="handleCharge('1')"
            :class="[modeType === '1' ? 'is-active' : '']"
          >
            <i class="ivu-icon ivu-icon-gear-a"></i> 自动部署
          </div>
        </div>
      </Decorate>
    </div>

    <div class="content">
      <section>
        <!-- 所属项目 -->
        <!-- <div v-if="isAddClear" class="list-item">
          <label> <i class="star">*</i> 所属项目： </label>
          <Select v-model="key" @on-change="projectNameChange" class="put-warp">
            <Option v-for="(item, i) in sideList" :value="item.key" :key="i + 'w'">{{
              item.projectName
            }}</Option>
          </Select>
          <div class="tip">
            <Icon type="ios-add-circle-outline" @click="handleAddClear" />
          </div>
        </div> -->
        <div class="list-item">
          <label> <i class="star">*</i>所属项目： </label>
          <Input v-model="title" placeholder="请输入新项目名称..." class="put-warp" />
          <!-- <div class="tip">
            <Icon type="ios-close-circle-outline" @click="handleAddClear" />
          </div> -->
        </div>
        <div class="list-item">
          <label> <i class="star">*</i>部署目录： </label>
          <Input v-model="www" placeholder="例如：dist" class="put-warp" />
          <div class="tip">
            <Tooltip
              max-width="200"
              content="指部署到服务器上的目录，也就是一级目录。"
              placement="right"
            >
              <Icon type="ios-help-circle-outline" />
            </Tooltip>

            <span v-if="isEx" class="isEx">此目录已存在，请重新输入！</span>
          </div>
        </div>
        <div class="list-item">
          <label>部署端口：</label>
          <Input v-model="port" placeholder="例如：8080 （选填）" class="put-warp" />
          <div class="tip">
            <Tooltip
              max-width="200"
              content="默认：本系统端口号/部署目录/index.html"
              placement="right"
            >
              <Icon type="ios-help-circle-outline" />
            </Tooltip>
            <span v-if="isPort == 0" class="isEx">此端口已存在，请重新输入！</span>
            <span v-if="isPort == -2" class="isEx"
              >端口号格式错误，请正确输入端口号！</span
            >
            <span v-if="isPort == -3" class="isEx">端口应大于等于0且小于65536！</span>
          </div>
        </div>

        <!-- 单个代理地址 -->
        <!-- <div v-if="!(proxy && proxy.length)" class="list-item">
          <label>代理地址：</label>

          <div class="proxy">
            <Input v-model="target" placeholder="例如：http://127.0.0.1 （选填）"  class="put-warp"/>
            <Icon
              type="ios-add-circle-outline"
              @click.stop="handleAddProxy(true)"
            />
          </div>
          <div class="tip">
            <Tooltip
              max-width="200"
              content="默认：若需解决跨域问题，可在这里填入需要代理的接口。"
              placement="right"
            >
              <Icon type="ios-help-circle-outline tip"/>
            </Tooltip>

            <span class="tip-text" v-if="target">
              将部署项目的 baseURL 改为：
              <i>{{ baseUrl + "/" + root }}</i>
            </span>
          </div>
        </div> -->
        <!-- 多个代理 -->
        <div class="list-item">
          <label>代理地址：</label>
          <ul>
            <li v-for="(item, i) in proxy" :key="'x' + i">
              <div class="put-warp proxy-warp">
                <Input
                  v-model="proxy[i].rewrite"
                  placeholder="例如：api"
                  style="width: 30%"
                />
                <span>-</span>
                <Input v-model="proxy[i].target" placeholder="例如：http://127.0.0.1" />
              </div>
              <div class="tip">
                <Icon type="ios-add-circle-outline" @click.stop="handleAddProxy(false)" />
                <Icon
                  type="ios-close-circle-outline"
                  @click.stop="handleDeleteProxy(i)"
                />
              </div>
            </li>
          </ul>
        </div>

        <!-- Git 地址 -->
        <div class="list-item">
          <label> <i class="star">*</i>Git 地址： </label>
          <Input
            v-model="git"
            placeholder="例如：http://10.0.86.12/zll/science.git"
            class="put-warp"
          />
          <div class="tip">
            <Tooltip
              max-width="200"
              content="此处填写 gitLab 仓库地址。"
              placement="right"
            >
              <Icon type="ios-help-circle-outline" />
            </Tooltip>
          </div>
        </div>

        <div class="list-item">
          <label> <i class="star">*</i>项目分支： </label>
          <Input v-model="branch" placeholder="默认：master" class="put-warp" />
          <div class="tip">
            <Tooltip
              max-width="200"
              content="此处填写 gitLab 仓库分支，默认 master 主分支。"
              placement="right"
            >
              <Icon type="ios-help-circle-outline" />
            </Tooltip>
          </div>
        </div>

        <div class="list-item">
          <label> <i class="star">*</i>部署命令： </label>
          <Input v-model="build" placeholder="例如：npm run build" class="put-warp" />
          <div class="tip">
            <Tooltip
              max-width="200"
              content="填写项目打包指令，支持 npm 和 cnpm 指令。"
              placement="right"
            >
              <Icon type="ios-help-circle-outline" />
            </Tooltip>
          </div>
        </div>

        <div class="list-item">
          <label> <i class="star">*</i>打包目录： </label>
          <Input v-model="dist" placeholder="默认：dist" class="put-warp" />
          <div class="tip">
            <Tooltip
              max-width="200"
              content="此处填写此项目的打包目录。"
              placement="right"
            >
              <Icon type="ios-help-circle-outline" />
            </Tooltip>
          </div>
        </div>
        <!-- 
        <div class="list-item">
          <label> <i class="star">*</i>部署文件： </label>
          <uploader
            :key="uploader_key"
            :options="options"
            ref="uploader"
            class="uploader-example"
            @file-complete="fileComplete"
            @complete="complete"
            :autoStart="true"
            :fileStatusText="fileStatusText"
          > 
            <uploader-unsupport></uploader-unsupport>
            <uploader-drop class="uploader-drop-botton" v-if="isUpLoader">
              <uploader-btn :directory="true" :single="true">
                <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
              </uploader-btn>
            </uploader-drop>
            <uploader-list></uploader-list>
          </uploader>
          <Tooltip
            max-width="200"
            content="选择上传此项目的打包目录即可。"
            placement="right"
          >
            <Icon type="ios-help-circle-outline tip" />
          </Tooltip>
        </div> -->

        <!-- <div class="banben"> 
          <div class="list-item">
            <label>部署方式：</label>
            <span v-if="modeType === '1'">自动部署</span>
            <span v-else>静态部署</span>
            <Tooltip
              max-width="200"
              :content="
                modeType === '1'
                  ? '此次部署之后，只要提交代码到 GitLab 仓库即可自动化部署。'
                  : '只需上传静态资源即可。'
              "
              placement="right"
            >
              <Icon type="ios-help-circle-outline tip" />
            </Tooltip>
          </div>
          <div class="list-item">
            <label>部署版本：</label>
            <span>v{{ version }}</span>
          </div>
        </div> -->
        <div class="list-item">
          <label>部署摘要：</label>
          <Input
            v-model="remark"
            type="textarea"
            :rows="4"
            placeholder="请输入概要内容...'"
            class="put-warp"
          />
        </div>
        <div class="tip-box">
          <DeployTip />
        </div>
        <div class="button-footer">
          <!-- <Button v-if="modeType === '0'" ghost type="success" @click="handleSubmit">
            提交部署
          </Button> -->
          <Button type="success" ghost @click="handleAutoSubmit">开始部署</Button>
          <Button type="error" ghost @click.stop="handleClear">重置</Button>
          <Button type="primary" ghost @click.stop="handleBack">返回首页</Button>
        </div>
        <div
          v-if="zzcAutoSubmit"
          @click="handleZzcAutoSubmit"
          class="auto-submit-zzc"
        ></div>
        <!-- </Modal> -->
      </section>
    </div>
  
  </div>
</template>
<script>
import Decorate from "@/components/Decorate";
import DeployTip from "@/components/DeployTip";
// import io from "socket.io-client";
export default {
  components: {
    Decorate,
    DeployTip,
  },
  props: ["typeArr", "classArr"],

  data() {
    return {
      sideList: [],
      author: "",
      url: "",
      usre: {},
      content: {},
      isToLogin: false,
      isRizhi: false,
      socket: null,
      isKey: true,
      isIp: false,
      key: "",
      target: "",

      isClickBushu: false,
      // **********************************************
      isPort: 1,
      port: "",
      // portArr: [],
      oneBugIsShow: false,
      zzcAutoSubmit: false,
      isHelp: true,
      isEx: false,
      isUpLoader: true,
      uploader_key: new Date().getTime(), //这个用来刷新组件--解决不刷新页面连续上传的缓存上传数据（注：每次上传时，强制这个值进行更改---根据自己的实际情况重新赋值）
      options: {
        target: this.$url + "/api/deploy/files/add", //SpringBoot后台接收文件夹数据的接口
        query: {
          root: "",
          version: "1.0.1",
        },
        testChunks: false, //是否分片-不分片
        fileParameterName: "file", //上传文件时文件的参数名，默认file
      },
      root: "",
      version: "1.0.1",
      versionVal: "1.0.1",
      fileStatusText: {
        error: "上传失败",
        paused: "等待上传",
        success: "上传成功",
        uploading: "正在上传...",
        waiting: "等待中...",
      },
      baseUrl: "",

      idDeployment: "yes",

      catalog: "", //上传目录
      isAddClear: true,
      isOk: false,
      uid: "",

      // itemData: {}, //静态数据
      // projectNameData: {}, //单个数据
      mkdirArr: [], //服务器目录

      isHistory: "yes",

      modeType: "0",

      // mode: "静态部署" //模式
      // ----------------------------------------------------
      title: "测试项目",
      www: "/root",
      port: 8080,
      proxy: [
        {
          rewrite: "text",
          target: "/jjjjj",
        },
      ],
      dist: "dist",
      remark: "hjvy",

      git: "https://gitee.com/zlluGitHub/test-project.git", //git 地址
      branch: "master", //git 分支
      build: "npm run build", //部署命令
    };
  },

  methods: {

    //拉取项目(自动部署)
    handleAutoSubmit() {
    
        let data = {
          title:this.title,
          proxy:this.proxy,
          dist:this.dist,
          remark:this.remark,
          git: this.git, //git 地址
          www: this.www,
          port: this.port,
          branch: this.branch ? this.branch : "master", //git 分支
          build: this.build, //部署命令
        };
        // this.$Message.loading({
        //   content: "请勿关闭浏览器，项目拉取中...",
        //   duration: 0,
        // });
        this.$request
          .post("/swd/deploy/init", data)
          .then((res) => {
            // this.$Message.destroy();
            // if (res.data.result) {
            //   this.$Message["success"]({
            //     background: true,
            //     content: "项目拉取成功！",
            //   });
            //   this.handleInit(data);
            // } else {
            //   this.$Message.destroy();
            //   this.$Modal.error({
            //     title: "异常提示",
            //     content: "发生未知错误，项目拉取失败！",
            //   });
            //   this.zzcAutoSubmit = false;
            // }
          })
          .catch(function (error) {
            console.log(error);
            this.$Message.destroy();
            this.$Modal.error({
              title: "异常提示",
              content: "发生未知错误，项目拉取失败！",
            });
            this.zzcAutoSubmit = false;
          });
    },
    //初始化项目 安装依赖
    handleInit(data) {
      this.$Message.destroy();
      this.$Message.loading({
        content: "请勿关闭当前界面，项目正在初始化，请耐心等待...",
        duration: 0,
      });
      this.$axios
        .post("/api/deploy/auto/init", this.$qs.stringify(data))
        .then((res) => {
          this.$Message.destroy();
          if (res.data.result) {
            this.$Message["success"]({
              background: true,
              content: "项目初始化成功！",
            });
            this.handleBuild(data);
          } else {
            // this.$Message["error"]({
            //   background: true,
            //   content: "项目初始化失败！"
            // });
            this.$Message.destroy();
            this.$Modal.error({
              title: "异常提示",
              content: "发生未知错误，项目初始化失败！",
            });
            this.zzcAutoSubmit = false;
          }
        })
        .catch((error) => {
          console.log(error);
          this.$Message.destroy();
          this.$Modal.error({
            title: "异常提示",
            content: "发生未知错误，项目初始化失败！",
          });
          this.zzcAutoSubmit = false;
        });
    },
    // 打包项目
    handleBuild(data) {
      this.$Message.destroy();
      this.$Message.loading({
        content: "请勿关闭当前界面，项目打包中，请耐心等待...",
        duration: 0,
      });
      this.$axios
        .post("/api/deploy/auto/build", this.$qs.stringify(data))
        .then((res) => {
          if (res.data.result) {
            this.$Message.destroy();
            this.$Message["success"]({
              background: true,
              content: "项目已打包完成！",
            });
            this.isUpLoader = false;
            this.handleSubmit();
          } else {
            this.$Message.destroy();
            this.$Modal.error({
              title: "异常提示",
              content: "发生未知错误，项目已打包失败！",
            });
            this.zzcAutoSubmit = false;
          }
        })
        .catch(function (error) {
          console.log(error);
          this.$Message.destroy();
          this.$Modal.error({
            title: "异常提示",
            content: "发生未知错误，项目已打包失败！",
          });
          this.zzcAutoSubmit = false;
        });
    },
    handleZzcAutoSubmit() {
      this.$Message["warning"]({
        background: true,
        content: "请勿关闭当前界面，项目正在部署中，请耐心等待~",
      });
    },

    handleBack() {
      this.$router.push({ path: "/" });
    },
    handleCharge(val) {
      this.modeType = val;
    },
    handleHelp() {
      this.isHelp = !this.isHelp;
    },
    handleToLogin() {
      this.isToLogin = false;
    },
    handleLoginModal() {
      window.sessionStorage.clear();
      this.$store.commit("setUser", {});
      this.$router.push({ path: "/login" });
    },
    // -------------------------------------------------------

    // handleAddClear() {
    // 	this.isAddClear = !this.isAddClear;
    // },

    // onEditorChange(quill) {
    // 	// console.log(quill);
    // 	this.explain = quill.html;
    // },
    // handleSuccess(res, file) {
    // 	if (res.result) {
    // 		this.imgSrc = res.fileInfo.path;
    // 		this.$Message["success"]({
    // 			background: true,
    // 			content: "图片上传成功！"
    // 		});
    // 	} else {
    // 		this.$Message["error"]({
    // 			background: true,
    // 			content: "图片上传失败！"
    // 		});
    // 	}
    // }
  },
  beforeDestroy() {
    if (this.isClickBushu) {
      window.location.reload();
    }
    // }
  },
  // beforeDestroy() {
  //   if (this.$socket) {
  //     this.$socket.close();
  //     this.$socket.disconnect();
  //     // this.socket = null;
  //   }
  // }
};
</script>
<style lang="scss" scoped>
@import "./index.scss";
/deep/ .ivu-modal-content {
  margin-bottom: 100px;
}
</style>
