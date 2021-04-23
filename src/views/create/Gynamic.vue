<template>
  <div class="content">
    <section>
      <div :class="['list-item', isProjectExit ? 'ivu-form-item-error' : '']">
        <label> <i class="star">*</i>项目名称： </label>
        <Input
          v-model="title"
          @on-blur="handleIsProjectExit"
          placeholder="请输入项目名称..."
          class="put-warp"
        />
        <div class="tip">
          <Tooltip max-width="200" content="请填写项目名称。" placement="right">
            <Icon type="ios-help-circle-outline" />
          </Tooltip>
          <span v-if="isProjectExit" class="isExNo">此项目已存在，请重新输入！</span>
        </div>
      </div>
      <div :class="['list-item', isWwwExit ? 'ivu-form-item-error' : '']">
        <label> <i class="star">*</i>部署目录： </label>
        <Input
          v-model="www"
          @on-blur="handleIsWwwExit"
          placeholder="例如：dist"
          class="put-warp"
        />
        <div class="tip">
          <Tooltip
            max-width="200"
            content="指部署到服务器上的目录，也就是一级目录。"
            placement="right"
          >
            <Icon type="ios-help-circle-outline" />
          </Tooltip>
          <span v-if="isWwwExit" class="isExNo">此目录已存在，请重新输入！</span>
        </div>
      </div>
      <div :class="['list-item', portMessage.state ? 'ivu-form-item-error' : '']">
        <label> <i class="star">*</i>部署端口：</label>
        <Input
          v-model="port"
          @on-blur="handleIsPortExit"
          placeholder="例如：8080 （选填）"
          class="put-warp"
        />
        <div class="tip">
          <Tooltip
            max-width="200"
            content="默认：本系统端口号/部署目录/index.html"
            placement="right"
          >
            <Icon type="ios-help-circle-outline" />
          </Tooltip>
          <span v-if="portMessage.state" class="isExNo">{{ portMessage.message }}</span>
          <!-- <span v-else class="isExNo">{{ portMessage.message }}</span> -->
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
          <Tooltip max-width="200" content="此处填写 gitLab 仓库地址。" placement="right">
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
          <Tooltip max-width="200" content="此处填写此项目的打包目录。" placement="right">
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
        <Button type="success" ghost @click="handleAutoSubmit('deploy')">{{
          $route.query.bid ? "更新部署" : "开始部署"
        }}</Button>
        <Button type="primary" ghost @click.stop="handleAutoSubmit('save')"
          >提交保存</Button
        >
        <Button @click.stop="handleBack">返回首页</Button>
        <!--  <Button type="error" ghost @click.stop="handleClear">重置</Button> -->
      </div>
      <!-- <div
          v-if="zzcAutoSubmit"
          @click="handleZzcAutoSubmit"
          class="auto-submit-zzc"
        ></div> -->
      <!-- </Modal> -->
    </section>
    <!-- 日志内容 -->
    <LogModal :isLogModal="isLogModal" :socketData="socketData" />
  </div>
</template>
<script>
import Decorate from "@/components/Decorate";
import DeployTip from "@/components/DeployTip";
import LogModal from "@/components/LogModal";
export default {
  components: {
    Decorate,
    DeployTip,
    LogModal,
  },
  data() {
    return {
      modeType: "0", //模式
      isProjectExit: false,
      isWwwExit: false,
      isLogModal: false,
      sideList: ["已连接到应用服务器，正在部署..."],
      socket: null,
      socketData: [],
      portMessage: {},

      queryTitle: "",
      queryWww: "",
      queryPort: "",

      title: "",
      www: "",
      port: "",
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
      branch: "master", //git 分支
      build: "npm run build", //部署命令
      install: "cnpm i",

      isServer: "",
      router: "",

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

  created() {
    if (this.$route.query.bid) {
      this.$request
        .get("/swd/deploy/get", { params: { bid: this.$route.query.bid } })
        .then((res) => {
          if (res.data.code === 200) {
            let data = res.data.data[0];

            this.queryPort = data.port;
            this.queryTitle = data.title;
            this.queryWww = data.www;

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
            this.commitBid = data.commitBid;
            this.isServer = data.isServer;
            this.router = data.router;
          }
        });
    }
  },
  methods: {
    //拉取项目(自动部署)
    handleAutoSubmit(mark) {
      if (!this.title) {
        this.$Modal.warning({
          title: "系统提示",
          content: "项目名称不得为空，请输入后再试！",
        });
        return;
      }
      if (!this.www) {
        this.$Modal.warning({
          title: "系统提示",
          content: "部署目录不得为空，请输入后再试！",
        });
        return;
      }
      if (!this.port) {
        this.$Modal.warning({
          title: "系统提示",
          content: "部署端口不得为空，请输入后再试！",
        });
        return;
      }
      if (!this.git) {
        this.$Modal.warning({
          title: "系统提示",
          content: "Git 地址不得为空，请输入后再试！",
        });
        return;
      }
      if (!this.branch) {
        this.$Modal.warning({
          title: "系统提示",
          content: "项目分支不得为空，请输入后再试！",
        });
        return;
      }
      if (!this.install) {
        this.$Modal.warning({
          title: "系统提示",
          content: "安装依赖命令不得为空，请输入后再试！",
        });
        return;
      }
      if (!this.build) {
        this.$Modal.warning({
          title: "系统提示",
          content: "打包命令不得为空，请输入后再试！",
        });
        return;
      }
      if (!this.dist) {
        this.$Modal.warning({
          title: "系统提示",
          content: "打包目录不得为空，请输入后再试！",
        });
        return;
      }

      let data = {
        title: this.title,
        www: this.www,
        port: this.port,
        git: this.git, //git 地址
        branch: this.branch ? this.branch : "master", //git 分支
        build: this.build, //部署命令
        install: this.install, //部署命令
        dist: this.dist,
        proxy: this.proxy,
        key: this.key,
        remark: this.remark,
        commitBid: this.commitBid,
        isServer: this.isServer,
        isStatic: "0",
        router: this.router,
      };

      if (mark === "deploy") {
        this.createSocketServer(() => {
          this.isLogModal = true;
          if (this.$route.query.bid) {
            data.bid = this.$route.query.bid;
            this.$request.post("/swd/deploy/initReset", data).then((res) => {
              if (res.data.code === 200) {
                this.socketData.push({
                  message: this.title + "项目部署成功！",
                  time: this.$dateTime(),
                });

                this.$Modal.success({
                  title: "系统提示",
                  content: this.title + "项目部署成功！",
                });
                this.$router.push({ path: "/details", query: { bid: res.data.data } });
              }
            });
          } else {
            this.$request.post("/swd/deploy/init", data).then((res) => {
              if (res.data.code === 200) {
                this.socketData.push({
                  message: this.title + "项目部署成功！",
                  time: this.$dateTime(),
                });
                this.$Modal.success({
                  title: "系统提示",
                  content: this.title + "项目部署成功！",
                });
                this.$router.push({ path: "/details", query: { bid: res.data.data } });
              }
            });
          }
        });
      } else if (mark === "save") {
        if (this.$route.query.bid) {
          data.bid = this.$route.query.bid;
          this.$request.post("/swd/deploy/updateInfo", data).then((res) => {
            if (res.data.code === 200) {
              this.$router.push({ path: "/details", query: { bid: data.bid } });
            }
          });
        } else {
          this.$request.post("/swd/deploy/saveInfo", data).then((res) => {
            if (res.data.code === 200) {
              this.$router.push({ path: "/details", query: { bid: res.data.data } });
            }
          });
        }
      }
    },

    // 判断端口是否可用
    handleIsPortExit() {
      if (this.port) {
        if (this.isIntNum(this.port)) {
          this.$request
            .post("/swd/deploy/portIsOccupied", { port: this.port })
            .then((res) => {
              if (res.data.code === 200) {
                if (res.data.data === 1) {
                  this.portMessage = {
                    state: false,
                    message: res.data.message,
                  };
                } else {
                  if (this.queryPort) {
                    if (this.queryPort === this.port) {
                      this.portMessage = {
                        state: false,
                        message: res.data.message,
                      };
                    } else {
                      this.portMessage = {
                        state: true,
                        message: res.data.message,
                      };
                    }
                  } else {
                    this.portMessage = {
                      state: true,
                      message: res.data.message,
                    };
                  }
                }
              }
            });
        } else {
          this.portMessage = {
            state: true,
            message: "端口设置有误，请输入正整数！",
          };
        }
      }
    },
    // 判断项目是否存在
    handleIsProjectExit() {
      if (this.title) {
        this.$request.post("/swd/deploy/isProject", { title: this.title }).then((res) => {
          if (res.data.code === 200) {
            if (!this.queryTitle) {
              this.isProjectExit = res.data.state;
            } else {
              if (this.queryTitle !== this.title) {
                this.isProjectExit = res.data.state;
              } else {
                this.isProjectExit = false;
              }
            }
          }
        });
      }
    },
    // 判断项目www根目录是否存在
    handleIsWwwExit() {
      if (this.www) {
        this.$request
          .post("/swd/deploy/isWwwFolder", { title: this.title, www: this.www })
          .then((res) => {
            if (res.data.code === 200) {
              if (!this.queryWww) {
                this.isWwwExit = res.data.state;
              } else {
                if (this.queryWww !== this.www) {
                  this.isWwwExit = res.data.state;
                } else {
                  this.isWwwExit = false;
                }
              }
            }
          });
      }
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
            this.socketData = [
              { message: "已连接到应用服务器，正在部署...", time: this.$dateTime() },
            ];
            console.log("WebSocket open"); //成功连接上Websocket
            callBack();
          };
          this.socket.onmessage = (e) => {
            this.socketData.push({ message: e.data, time: this.$dateTime() });
            console.log("message: " + e.data); //打印出服务端返回过来的数据
          };
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.content {
  display: flex;
  justify-content: center;
  > section {
    width: 80%;
    // margin-top: 20px;
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
