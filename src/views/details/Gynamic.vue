<template>
  <div class="swd-details">
    <div class="header">
      <Decorate
        icon="ivu-icon ivu-icon-ios-paper-outline"
        :title="`构建详情（${projectData.title}）`"
        describe="在这里可以创建一个新的项目，同时也可以迭代之前的项目。项目的创建分为静态部署与自动部署，可根据自身需求进行选择。"
      >
        <div class="button-warp">
          <Button ghost type="primary" @click="initReset">重新部署</Button>
          <Button ghost type="success" @click="installReset">依赖部署</Button>
          <Button ghost type="info" @click="buildReset">打包部署</Button>
          <Button ghost type="warning" @click="handleRouter">修改信息</Button>
        </div>
      </Decorate>
    </div>

    <div class="breadcrumb">
      <Breadcrumb class="warp">
        <BreadcrumbItem to="/">
          <Icon type="ios-home-outline" size="18"></Icon>
          工作台
        </BreadcrumbItem>
        <BreadcrumbItem to="/components/breadcrumb">
          <Icon type="ios-paper-outline" size="18" />
          {{ `构建详情（${projectData.title}）` }}
        </BreadcrumbItem>
      </Breadcrumb>
    </div>
    <div class="content">
      <section>
        <!-- <Divider orientation="left">构建状态</Divider> -->
        <Steps :current="current" :status="status" class="step-warp">
          <Step
            :title="current > 0 ? '已完成' : '待进行'"
            content="准备创建部署环境空间。"
          ></Step>
          <Step
            :title="current > 1 ? '已完成' : '待进行'"
            content="拉取远程Git仓库中的项目。"
          ></Step>
          <Step
            :title="current > 2 ? '已完成' : '待进行'"
            content="安装项目所需依赖文件。"
          ></Step>
          <Step
            :title="current > 3 ? '已完成' : '待进行'"
            content="将项目进行打包压缩处理。"
          ></Step>
          <Step
            :title="current > 4 ? '已完成' : '待进行'"
            content="配置项目所依赖的运行环境。"
          ></Step>
          <Step
            :title="current > 5 ? '已完成' : '待进行'"
            content="项目构建成功。"
          ></Step>
        </Steps>
        <Divider orientation="left">构建信息</Divider>
        <div class="details-box">
          <Row>
            <Col span="12">
              <label>项目名称：</label>
              <p>
                <a href="" target="_blank"> {{ projectData.title }}</a>
                <i v-html="svgIcon"></i>
              </p>
            </Col>
            <Col span="12">
              <label>创建时间：</label>
              <p>{{ projectData.time }}</p>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <label>部署Key：</label>
              <p>
                {{ projectData.bid }}
                <i
                  class="fa fa-question-circle-o"
                  :style="{
                    marginLeft: '6px',
                    fontSize:'18px'
                  }"
                ></i>
              </p>
            </Col>

            <Col span="12">
              <label>Git地址：</label>
              <p>
                <a :href="projectData.git" target="_blank">{{ projectData.git }}</a>
                <i v-html="svgIcon"></i>
              </p>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <label>开始时间：</label>
              <p>{{ projectData.startTime }}</p>
            </Col>
            <Col span="12">
              <label>结束时间：</label>
              <p>{{ projectData.endTime }}</p>
            </Col>
          </Row>

          <Row>
            <Col span="12">
              <label>部署时长：</label>
              <p>{{ projectData.duration }}秒</p>
            </Col>
            <Col span="12">
              <label>服务状态：</label>
              <p>{{ projectData.isServer ? "已开启" : "已关闭" }}</p>
            </Col>
          </Row>

          <Row>
            <Col span="12">
              <label>路由模式：</label>
              <p>{{ projectData.router }}模式</p>
            </Col>
            <Col span="12">
              <label>部署方式：</label>
              <p>{{ projectData.isStatic === "0" ? "自动部署" : "静态部署" }}</p>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <label>构建者：</label>
              <p>{{ projectData.userId ? projectData.userId : "管理员" }}</p>
            </Col>
            <Col span="12">
              <label>打包目录：</label>
              <p>{{ projectData.dist }}</p>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <label>项目分支：</label>
              <p>{{ projectData.branch }}</p>
            </Col>
            <Col span="12">
              <label>部署端口：</label>
              <p>{{ projectData.port }}</p>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <label>部署目录：</label>
              <p>{{ projectData.www }}</p>
            </Col>
            <Col span="12">
              <label>部署秘钥：</label>
              <p>{{ projectData.key ? projectData.key : "暂无秘钥" }}</p>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <label>打包命令：</label>
              <p>{{ projectData.build }}</p>
            </Col>
            <Col span="12">
              <label>安装依赖：</label>
              <p>{{ projectData.install }}</p>
            </Col>
          </Row>

          <Row>
            <Col span="12">
              <label>代理地址：</label>
              <div>
                <p v-for="(item, i) in projectData.proxy" :key="i">
                  <template v-if="item.target && item.rewrite"
                    >{{ item.rewrite }} <Icon type="md-arrow-forward" />
                    {{ item.target }}</template
                  >
                  <template v-else>暂无任何代理</template>
                </p>
              </div>
            </Col>
            <Col span="12">
              <label>部署摘要：</label>
              <p>{{ projectData.remark }}</p>
            </Col>
          </Row>
        </div>
      </section>
    </div>
    <!-- 日志内容 -->
    <LogModal :isLogModal="isLogModal" :socketData="socketData" />
  </div>
</template>
<script>
import Decorate from "@/components/Decorate";
import LogModal from "@/components/LogModal";
// import io from "socket.io-client";
export default {
  components: {
    Decorate,
    LogModal,
  },

  data() {
    return {
      isLogModal: false,
      socketData: [],
      current: 0,
      status: "wait",
      projectData: {
        bid: "加载中...",
        branch: "加载中...",
        build: "加载中...",
        commitBid: "加载中...",
        deployState: "加载中...",
        dist: "加载中...",
        duration: "加载中...",
        git: "加载中...",
        install: "加载中...",
        isAuto: "加载中...",
        isServer: "加载中...",
        isStatic: "加载中...",
        isZip: "加载中...",
        key: "加载中...",
        port: "加载中...",
        proxy: [],
        remark: "加载中...",
        router: "加载中...",
        time: "加载中...",
        title: "加载中...",
        www: "加载中...",
      },
      stepContent: [
        {
          title: "",
          state: true,
        },
      ],
    };
  },
  created() {
    this.svgIcon =
      '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" x="0px" y="0px" viewBox="0 0 100 100" width="15" height="15" class="icon outbound"><path fill="currentColor" d="M18.8,85.1h56l0,0c2.2,0,4-1.8,4-4v-32h-8v28h-48v-48h28v-8h-32l0,0c-2.2,0-4,1.8-4,4v56C14.8,83.3,16.6,85.1,18.8,85.1z"></path> <polygon fill="currentColor" points="45.7,48.7 51.3,54.3 77.2,28.5 77.2,37.2 85.2,37.2 85.2,14.9 62.8,14.9 62.8,22.9 71.5,22.9"></polygon></svg>';
    this.getProjectData();
  },

  methods: {
    getProjectData() {
      this.$request
        .get("/swd/deploy/get", { params: { bid: this.$route.query.bid } })
        .then((res) => {
          if (res.data.code === 200) {
            this.projectData = res.data.data[0];
            this.current = this.procedure(this.projectData.deployState);
            this.status = this.projectData.deployState.state ? "process" : "error";
          }
        });
    },
    //项目重新部署
    initReset() {
      this.$Modal.confirm({
        title: "系统提示",
        content: "<p>确定要重新部署该项目吗？</p>",
        onOk: () => {
          this.$Message.loading({
            content: "正在部署中，请稍后...",
            duration: 0,
          });
          this.createSocketServer(() => {
            this.isLogModal = true;
            this.$request.post("/swd/deploy/initReset", this.projectData).then((res) => {
              this.$Message.destroy();
              if (res.data.code === 200) {
                this.$Modal.success({
                  title: "系统提示",
                  content: res.data.message,
                });
                this.getProjectData();
              }
            });
          });
        },
        onCancel: () => {},
      });
    },
    //项目重新打包
    buildReset() {
      this.$Modal.confirm({
        title: "系统提示",
        content: "<p>确定要重新打包该项目吗？</p>",
        onOk: () => {
          this.$Message.loading({
            content: "正在部署中，请稍后...",
            duration: 0,
          });
          this.createSocketServer(() => {
            this.isLogModal = true;
            this.$request.post("/swd/deploy/relyBuild", this.projectData).then((res) => {
              this.$Message.destroy();
              if (res.data.code === 200) {
                this.$Modal.success({
                  title: "系统提示",
                  content: res.data.message,
                });
                this.getProjectData();
              }
            });
          });
        },
        onCancel: () => {},
      });
    },
    //项目重新安装依赖
    installReset() {
      this.$Modal.confirm({
        title: "系统提示",
        content: "<p>确定要为该项目重新安装依赖文件吗？</p>",
        onOk: () => {
          this.$Message.loading({
            content: "正在部署中，请稍后...",
            duration: 0,
          });
          this.createSocketServer(() => {
            this.isLogModal = true;
            this.$request
              .post("/swd/deploy/relyInstall", this.projectData)
              .then((res) => {
                this.$Message.destroy();
                if (res.data.code === 200) {
                  this.$Modal.success({
                    title: "系统提示",
                    content: res.data.message,
                  });
                  this.getProjectData();
                }
              });
          });
        },
        onCancel: () => {},
      });
    },
    handleRouter() {
      this.$router.push({
        path: "create",
        query: { bid: this.$route.query.bid, isStatic: 0 },
      });
    },
    procedure(state) {
      if (state.type === "state") {
        return 0;
      } else if (state.type === "clone") {
        return 1;
      } else if (state.type === "install") {
        return 2;
      } else if (state.type === "build") {
        return 3;
      } else if (state.type === "deploy") {
        return 4;
      } else if (state.type === "port") {
        return 6;
      } else {
        return 0;
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
            // console.log("message: " + e.data); //打印出服务端返回过来的数据
          };
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.swd-details {
  .header {
    .button-warp {
      margin-top: 20px;
      button {
        margin-left: 20px;
      }
    }
  }

  .content {
    display: flex;
    justify-content: center;
    > section {
      width: 80%;
      background: #fff;
      padding: 20px;
      border-radius: 5px;
      .step-warp {
        padding: 30px 40px;
      }
      .details-box {
        padding: 20px;
        p {
          display: flex;
          align-items: center;
          a {
            color: #3eaf7c;
            margin-right: 5px;
            &:hover {
              color: #10be70;
            }
          }
        }

        /deep/ .ivu-row {
          margin: 10px 0;
          .ivu-col {
            display: flex;
            label {
              color: #515a6e;
              font-size: 14px;
              font-weight: 600;
              width: 80px;
              text-align: right;
            }
          }
        }
      }
    }
  }
}
</style>
