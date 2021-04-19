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
        <div class="list-item">
          <label> <i class="star">*</i>所属项目： </label>
          <Input v-model="title" placeholder="请输入项目名称..." class="put-warp" />
          <div class="tip">
            <Tooltip max-width="200" content="请填写项目名称。" placement="right">
              <Icon type="ios-help-circle-outline" />
            </Tooltip>
            <span v-if="isProjectExit" class="isEx">此项目已存在，请重新输入！</span>
          </div>
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

            <span v-if="isWwwExit" class="isEx">此目录已存在，请重新输入！</span>
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
            <span v-if="portMessage.code === 1" class="isExOk">{{
              portMessage.message
            }}</span>
            <span v-else class="isExNo">{{ portMessage.message }}</span>
          </div>
        </div>

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
                <Icon type="ios-add-circle-outline" @click.stop="handleAddProxy" />
                <Icon
                  v-if="proxy.length > 1"
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
          <label> <i class="star">*</i>安装依赖： </label>
          <Input v-model="install" placeholder="例如：npm install" class="put-warp" />
          <div class="tip">
            <Tooltip
              max-width="200"
              content="填写项目依赖安装指令，支持 npm 和 cnpm 指令。"
              placement="right"
            >
              <Icon type="ios-help-circle-outline" />
            </Tooltip>
          </div>
        </div>
        <div class="list-item">
          <label> <i class="star">*</i>打包命令： </label>
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
        <div class="list-item">
          <label> 部署秘钥： </label>
          <Input
            v-model="key"
            placeholder="若本项目为私有仓库，请输入秘钥"
            class="put-warp"
          />
          <div class="tip">
            <Tooltip
              max-width="200"
              content="若本项目为私有仓库，请输入该秘钥，否则部署可能失败！"
              placement="right"
            >
              <Icon type="ios-help-circle-outline" />
            </Tooltip>
          </div>
        </div>
         
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
       
          <Button type="success" ghost @click="handleAutoSubmit">开始部署</Button>
          <Button type="primary" ghost @click.stop="handleBack">返回首页</Button>
          <Button type="error" ghost @click.stop="handleClear">重置</Button>
        </div>
        <!-- <div
          v-if="zzcAutoSubmit"
          @click="handleZzcAutoSubmit"
          class="auto-submit-zzc"
        ></div> -->
        <!-- </Modal> -->
      </section>
    </div>
    <Modal
      title="部署日志"
      v-model="isLogModal"
      scrollable
      :mask-closable="false"
      :footer-hide="true"
    >
      <div class="rz-box">
        <p v-for="(item, i) in socketData" :key="i">
          {{ item }}
        </p>
      </div>
      <!-- <div class="rz-tip" v-if="isOk">
        <div class="tip-box">
          <div>
            <p>
              √ 秘钥Key：
              <span style="color: #3390ff">{{ key }}</span>
            </p>
            <Divider orientation="left">关联 Git 仓库</Divider>
            <div class="tisi">
              <div>1、打开git：项目仓库 -> Settings -> Webhooks -> Add webhook；</div>
              <div>
                2、在
                <span class="code">Target URL</span> 中填入
                <span class="url">{{ $url }}/api/deploy/git</span> 地址；
              </div>
              <div>
                3、
                <span class="code">POST Content Type</span> 选择
                <span class="select">application/json</span>；
              </div>
              <div>
                4、在
                <span class="code">Secret</span> 中填入秘钥Key：
                <span class="url">{{ key }}</span
                >；
              </div>
              <div>
                5、
                <span class="code">Trigger On</span>选择
                <span class="select">Push Events</span>；
              </div>
              <div>
                <span style="color: red">注意：</span>若项代码托管平台为 GitHub 时，在第 2
                步中需要填入
                <span class="url"
                  >{{ $url }}/api/deploy/git?key={{ key ? key : "返回的key值" }}</span
                >
                地址。
              </div>
            </div>
          </div>
        </div>
      </div> -->
    </Modal>
  </div>
</template>
<script>
import Decorate from "@/components/Decorate";
import DeployTip from "@/components/DeployTip"; 
export default {
  components: {
    Decorate,
    DeployTip,
  },
  data() {
    return {
      modeType: "静态部署" ,//模式
      isProjectExit: false,
      isWwwExit: false,
      isLogModal: false,
      sideList: ["已连接到应用服务器，正在部署..."],
      socket: null,
      socketData: [],
      portMessage: "",

      title: "",
      www: "",
      port: 8080,
      proxy: [
        {
          rewrite: "",
          target: "",
        },
      ],
      dist: "",
      key: "",
      remark: "",
      git: "", //git 地址
      branch: "", //git 分支
      build: "", //部署命令
      install: "", //部署命令

      // title: "测试项目",
      // www: "/textas",
      // port: 8080,
      // proxy: [
      //   {
      //     rewrite: "text",
      //     target: "/jjjjj",
      //   },
      // ],
      // dist: "dist",
      // remark: "hjvy",

      // git: "https://gitee.com/zlluGitHub/test-project.git", //git 地址
      // branch: "master", //git 分支
      // build: "npm run build", //部署命令
      // install: "cnpm i", //部署命令
    };
  },
  watch: {
    port(val) {
      if (this.isIntNum(val)) {
        this.$request.post("/swd/deploy/portIsOccupied", { port: val }).then((res) => {
          if (res.data.data === 1) {
            this.portMessage = {
              code: 1,
              message: `此服务端口【${val}】可用！`,
            };
          } else {
            this.portMessage = res.data;
          }
        });
      } else {
        this.portMessage = {
          code: 500,
          message: "端口设置有误，请输入正整数！",
        };
      }
    },
  },
  created() {
    if (this.$route.query.bid) {
      this.$request
        .get("/swd/deploy/get", { params: { bid: this.$route.query.bid } })
        .then((res) => {
          if (res.data.code === 200) {
            let data = res.data.data[0];
            this.title = data.title;
            this.proxy = data.proxy;
            this.dist = data.dist;
            this.remark = data.remark;
            this.git = data.git; //git 地址
            this.www = data.www;
            this.port = data.port;
            this.key = data.key;
            this.branch = data.branch; //git 分支
            this.build = data.build; //部署命令
            this.install = data.install; //部署命令
          }
        });
    }
  },
  methods: {
    //拉取项目(自动部署)
    handleAutoSubmit() {
      let data = {
        title: this.title,
        proxy: this.proxy,
        dist: this.dist,
        remark: this.remark,
        git: this.git, //git 地址
        www: this.www,
        port: this.port,
        branch: this.branch ? this.branch : "master", //git 分支
        build: this.build, //部署命令
        install: this.install, //部署命令
      };

      this.createSocketServer(() => {
        this.isLogModal = true;
        this.$request.post("/swd/deploy/init", data).then((res) => {
          if (res.data.result) {
            this.socketData.push(this.title + "项目部署成功！");
            // this.$socket.close(); //关闭websocket
          }
        });
      });
    },

    // 添加代理
    handleAddProxy() {
      this.proxy.push({
        rewrite: "",
        target: "",
      });
    },
    handleDeleteProxy(i) {
      if (this.proxy.length > 0) {
        this.proxy.splice(i, 1);
      }
    },

     
    // handleZzcAutoSubmit() {
    //   this.$Message["warning"]({
    //     background: true,
    //     content: "请勿关闭当前界面，项目正在部署中，请耐心等待~",
    //   });
    // },

    handleBack() {
      this.$router.push({ path: "/" });
    },
    // handleCharge(val) {
    //   this.modeType = val;
    // },
    // handleHelp() {
    //   this.isHelp = !this.isHelp;
    // },
    // handleToLogin() {
    //   this.isToLogin = false;
    // },
    handleLoginModal() {
      window.sessionStorage.clear();
      this.$store.commit("setUser", {});
      this.$router.push({ path: "/login" });
    },
    
    isIntNum(val) {
      if (val * 1) {
        return true;
      } else {
        return false;
      }
    },

    createSocketServer(callBack) {
      /*创建服务端socket连接*/
      this.$request.post("/swd/deploy/openSocket").then((res) => {
        if (res.data.result) {
          /*创建客户端socket连接*/
          this.socket = new WebSocket("ws://152.136.101.31:8001");
          this.socket.onopen = () => {
            this.socketData = ["已连接到应用服务器，正在部署..."];
            console.log("WebSocket open"); //成功连接上Websocket
            callBack();
          };
          this.socket.onmessage = (e) => {
            this.socketData.push(e.data);
            console.log("message: " + e.data); //打印出服务端返回过来的数据
          };
        }
      });
    },
  },
  beforeDestroy() {
    if (this.isClickBushu) {
      window.location.reload();
    }
    // }
  },
 
};
</script>
<style lang="scss" scoped>
.swd-create {
  /deep/ .header__change {
    position: absolute;
    bottom: 0px;
    right: 150px;
    display: flex;
    // margin-top: 20px;
    .em-header__nav__item {
      float: left;
      height: 40px;
      line-height: 40px;
      padding: 0 15px;
      color: #586069;
      cursor: pointer;
      border: solid transparent;
      border-width: 3px 1px 1px;
      border-radius: 3px 3px 0 0;
    }
    .is-active {
      color: #24292e;
      background: #f5f7fa;
      border-color: #2d8cf0 #e1e4e8 transparent;
    }
  }
  .content {
    display: flex;
    justify-content: center;
    > section {
      width: 80%;
      margin-top: 20px;
      background: #fff;
      padding: 20px;
      border-radius: 5px;
      position: relative;
      .tip-box {
        top: 20px;
        right: 20px;
        position: absolute;
      }
    }
    .list-item {
      margin: 15px 0;
      display: flex;
      align-items: center;
      .star {
        color: red;
        margin-right: 3px;
      }
      label {
        width: 100px;
        text-align: right;
      }
      .put-warp {
        width: 450px;
      }
      ul {
        li {
          display: flex;
          align-items: center;
          margin-bottom: 5px;
          &:last-child {
            margin-bottom: 0;
          }
        }
        .proxy-warp {
          display: flex;
          align-items: center;
          span {
            margin: 0 3px;
          }
        }
      }
    }
  }
  .button-footer {
    margin: 20px 100px;
    display: flex;
    button {
      width: 120px;
      margin: 0 30px;
    }
  }
  .tip {
    display: flex;
    justify-content: center;
    margin-left: 10px;
    i {
      font-size: 22px;
      cursor: pointer;
    }
    /deep/ .ivu-tooltip {
      margin-right: 5px;
    }
    .isExOk {
      color: #19be6b;
    }
    .isExNo {
      color: red;
    }
  }
}
</style>
