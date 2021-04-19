<template>
  <div class="swd-commit">
    <div class="header">
      <Decorate
        icon="ivu-icon ivu-icon-ios-list-box-outline"
        :title="`构建列表（${projectData.title}）`"
        describe="这里将展示你的个人项目，当然也包括协同项目。"
      />
    </div>
    <div class="breadcrumb">
      <Breadcrumb class="warp">
        <BreadcrumbItem to="/">
          <Icon type="ios-home-outline" size="18"></Icon>
          工作台
        </BreadcrumbItem>
        <BreadcrumbItem to="/components/breadcrumb">
          <Icon type="ios-list-box-outline" size="18" />
          {{ `构建详情（${projectData.title}）` }}
        </BreadcrumbItem>
      </Breadcrumb>
    </div>
    <div class="content">
      <div>
        <Table border :columns="columns" :data="content">
          <!-- <template slot-scope="{ row }" slot="commitId">
            <a v-if="row.isExit" :href="row.url">{{ row.commitId }}</a>
            <span v-else>{{ row.bid }}</span>
          </template> -->
          <!-- <template slot-scope="{ row }" slot="id">
           {{row.user?row.user:'管理员'}}
          </template> -->

          <template slot-scope="{ row }" slot="deploy">
            <!-- {{ row.user ? row.user : "管理员" }} -->
            <p v-if="row.bid === projectData.commitBid" class="deploy-state">
              <i class="ok"></i><span>已部署</span>
            </p>
            <p v-else class="deploy-state"><i class="no"></i><span>未部署</span></p>
          </template>

          <template slot-scope="{ row }" slot="structure">
            {{ row.isExit ? "Git 推送" : "手动推送" }}
          </template>

          <template slot-scope="{ row }" slot="fileChange">
            <!-- <Tooltip v-if="row.isExit" max-width="200" placement="top"> 
              <div slot="content">
                <p>修改：{{ row.modified.length }} 个文件</p>
                <p>新增：{{ row.added.length }} 个文件</p>
                <p>刪除：{{ row.removed.length }} 个文件</p>
              </div>
            </Tooltip> -->
            <p v-if="row.isExit" class="file-change">
              <span
                >修改<em>{{ row.modified.length }}</em
                >个、
              </span>
              <span
                >新增<em>{{ row.added.length }}</em
                >个、
              </span>
              <span
                >刪除<em>{{ row.removed.length }}</em
                >个
              </span>
            </p>
            <span v-else>< ----- 空 ----- ></span>
            <!-- 1 个文件修改, 2个文件新增(+), 66 个文件删除(-) -->
          </template>

          <template slot-scope="{ row }" slot="message">
            {{ row.message ? row.message : "暂无描述" }}
          </template>
          <template slot-scope="{ row }" slot="state">
            <Progress :percent="row.state">
              <Icon type="checkmark-circled"></Icon>
              <span>{{ row.state }}%</span>
            </Progress>
          </template>
          <template slot-scope="{ row }" slot="action">
            <div class="button-action">
              <Button type="primary" size="small" @click="handleInitReset(row)"
                >部署</Button
              >
              <Button @click="handleShowLog(row)" type="warning" size="small"
                >日志</Button
              >
              <Button @click="handleUrl(row)" type="error" size="small">变动</Button>
            </div>
          </template>
        </Table>
        <div class="page">
          <Page
            prev-text="上一页"
            next-text="下一页"
            show-elevator
            show-total
            :total="total"
            show-sizer
            @on-change="changePage"
            @on-page-size-change="changeSizePage"
          />
        </div>
      </div>
    </div>
    <!-- 日志内容 -->
    <LogModal :isLogModal="isLogModal" :socketData="socketData" />
  </div>
</template>

<script>
import Decorate from "@/components/Decorate";
import LogModal from "@/components/LogModal";
export default {
  components: {
    Decorate,
    LogModal,
  },
  data() {
    return {
      pageNo: 1,
      pageSize: 10,
      total: 10,
      isLogModal: false,
      socketData: [],
      columns: [
        // {
        //   title: "ID",
        //   width: 180,
        //   slot: "id",
        // },
        // {
        //   title: "CommitID",
        //   slot: "commitId",
        //   width: 350,
        // },

        {
          title: "构建方式",
          slot: "structure",
          width: 100,
        },

        {
          title: "构建情况",
          width: 250,
          slot: "fileChange",
        },
        // {
        //   title: "开始时间",
        //   key: "startTime",
        // },
        // {
        //   title: "结束时间",
        //   key: "endTime",
        // },
        {
          title: "部署状态",
          slot: "deploy",
          width: 100,
        },
        {
          title: "构建时间",
          width: 180,
          key: "startTime",
        },
        {
          title: "构建时长",
          width: 150,
          key: "duration",
        },
        {
          title: "构建描述",
          slot: "message",
        },
        {
          title: "构建进度",
          slot: "state",
          width: 180,
        },
        {
          title: "操作",
          slot: "action",
          width: 200,
        },
      ],
      content: [],
      projectData: {},
    };
  },

  created() {
    this.getProjectData();
    this.handleGetData();
  },

  methods: {
    handleShowLog(row) {
      this.isLogModal = true;
      this.socketData = row.log;
    },
    handleGetData() {
      // this.$Message.destroy();
      let data = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        // pageSize: this.pageSize
        // idDeployment: "yes",
        projectId: this.$route.query.bid,
      };
      this.$request.get("/swd/commit/get", { params: data }).then((res) => {
        if (res.data.code === 200) {
          this.total = res.data.count;
          this.content = res.data.data.map((item) => {
            let startTime = new Date(item.startTime); // 开始时间
            let endTime = new Date(item.endTime); // 结束时间
            item.duration = "共耗时：" + Math.floor((endTime - startTime) / 1000) + "秒";
            item.state = this.procedure(item.deployState);

            if (item.hookPayload) {
              item = { ...item, ...item.hookPayload };
              item.added = item.added ? item.added : [];
              item.modified = item.modified ? item.modified : [];
              item.removed = item.removed ? item.removed : [];
            }
            return item;
          });
          console.log(this.content);
        }
      });
    },

    getProjectData() {
      this.$request
        .get("/swd/deploy/get", { params: { bid: this.$route.query.bid } })
        .then((res) => {
          if (res.data.code === 200) {
            this.projectData = res.data.data[0];
          }
        });
    },
    procedure(state) {
      if (state.type === "start") {
        return 16;
      } else if (state.type === "clone") {
        return 32;
      } else if (state.type === "install") {
        return 48;
      } else if (state.type === "build") {
        return 64;
      } else if (state.type === "deploy") {
        return 80;
      } else if (state.type === "port") {
        return 100;
      }
    },

    changePage(event) {
      this.pageNo = event;
      this.handleGetData();
    },
    changeSizePage(event) {
      this.pageSize = event;
      this.handleGetData();
    },
    handleUrl(row) {
      let win = window.open();
      win.opener = null;
      win.location = row.isExit ? row.url : this.projectData.git.slice(0, -4);
      win.target = "_blank";
    },
    //部署指定版本项目
    handleInitReset(row) {
      this.$Modal.confirm({
        title: "系统提示",
        content: "<p>确定要重新部署该版本吗？</p>",
        onOk: () => {
          this.createSocketServer(() => {
            this.socketData = [
              { message: "已连接到应用服务器，正在部署...", time: this.$dateTime() },
            ];
            this.isLogModal = true;
            this.projectData.hookPayload = row.hookPayload;
            this.projectData.commitBid = row.bid;
            this.$request.post("/swd/deploy/relyReset", this.projectData).then((res) => {
              if (res.data.code === 200) {
                this.$Modal.success({
                  title: "系统提示",
                  content: res.data.message,
                });
                this.$router.push({
                  path: "/details",
                  query: { bid: this.projectData.bid },
                });
              }
            });
          });
        },
      });
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
.swd-commit {
  .content {
    // padding-top: 20px;
    display: flex;
    justify-content: center;
    > div {
      width: 80%;
      background-color: #fff;
      padding: 20px;
      .details-box {
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
  .deploy-state {
    display: flex;
    align-items: center;
    i {
      width: 10px;
      height: 10px;
      border-radius: 100px;
      margin-right: 5px;
    }
    i.ok {
      background: green;
    }
    i.no {
      background: red;
    }
  }
  .file-change {
    em {
      color: red;
      margin: 0 3px;
    }
  }
  .page {
    background: #fff;
    padding: 20px;
    display: flex;
    justify-content: center;
    border: 1px solid #eee;
  }
  /deep/ .ivu-progress-success .ivu-progress-bg {
    background-color: #19be6b;
  }
  /deep/ .ivu-progress-success .ivu-progress-text {
    color: #333;
  }
  /deep/ .ivu-progress-bg {
    background-color: red;
  }
  /deep/ .ivu-progress-text {
    color: red;
  }
  .button-action {
    button {
      margin: 0 5px;
    }
  }
}
</style>
