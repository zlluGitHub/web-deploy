<template>
  <div class="swd-commit">
    <div class="header">
      <Decorate
        icon="ivu-icon ivu-icon-md-cube"
        title="工作台"
        describe="这里将展示你的个人项目，当然也包括协同项目。"
      />
    </div>
    <div class="content">
      <div>
        <div class="details-box">
          <Row>
            <Col span="12">
              <label>项目名称：</label>
              <p>按说出生地发</p>
            </Col>
            <Col span="12">
              <label>CommitID：</label>
              <p>按说出生地发</p>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <label>Git：</label>
              <p>按说出生地发</p>
            </Col>
            <Col span="12">
              <label>部署目录：</label>
              <p>按说出生地发</p>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <label>构建者：</label>
              <p>按说出生地发</p>
            </Col>
            <Col span="12">
              <label>开始时间：</label>
              <p>按说出生地发</p>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <label>部署端口：</label>
              <p>按说出生地发</p>
            </Col>
            <Col span="12">
              <label>代理地址：</label>
              <p>按说出生地发</p>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <label>项目分支：</label>
              <p>按说出生地发</p>
            </Col>
            <Col span="12">
              <label>安装依赖：</label>
              <p>按说出生地发</p>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <label>打包命令：</label>
              <p>按说出生地发</p>
            </Col>
            <Col span="12">
              <label>打包目录：</label>
              <p>按说出生地发</p>
            </Col>
          </Row>
          <Row>
            <Col >
              <label>部署KEY：</label>
              <p>按说出生地发</p>
            </Col>
            
          </Row>
          <Row>
            <Col span="12">
              <label>部署秘钥：</label>
              <p>按说出生地发</p>
            </Col>
            <Col span="12">
              <label>部署摘要：</label>
              <p>按说出生地发</p>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <label>结束时间：</label>
              <p>按说出生地发</p>
            </Col>
            <Col span="12">
              <label>部署时长：</label>
              <p>按说出生地发</p>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <label>部署状态：</label>
              <p>按说出生地发</p>
            </Col>
            <Col span="12">
              <label>服务状态：</label>
              <p>按说出生地发</p>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <label>路由模式：</label>
              <p>按说出生地发</p>
            </Col>
            <Col span="12">
              <label>部署模式：</label>
              <p>按说出生地发</p>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <label>创建时间：</label>
              <p>按说出生地发</p>
            </Col>
            <Col span="12">
              <label>部署状态：</label>
              <p>按说出生地发</p>
            </Col>
          </Row>
        </div>
        <Divider orientation="left">部署历史</Divider>
        <Table border :columns="columns" :data="content">
          <!-- <template slot-scope="{ row }" slot="author">
                <div class="author">
                  <img :src="$url+row.url" :alt="row.author" />
                  <span>{{row.author}}</span>
                </div>
              </template>-->
          <template slot-scope="{ row }" slot="projectName">
            <Tooltip max-width="200" :content="row.projectName" placement="top">
              <span class="nowrap">{{ row.projectName }}</span>
            </Tooltip>
          </template>
          <template slot-scope="{ row }" slot="version">
            <span style="color: #fab67b">{{ row.version }}</span>
          </template>
          <template slot-scope="{ row }" slot="target">
            <span>{{ row.target ? row.target : "暂无代理" }}</span>
          </template>
          <template slot-scope="{ row }" slot="port">
            <p>
              <i
                v-if="row.port"
                class="yuandian"
                :style="{
                  background:
                    row.idDeployment == 'yes' && row.isPort == 'yes'
                      ? 'cornflowerblue'
                      : '#ccc',
                }"
              ></i>
              <span>{{ row.port ? row.port : "无端口号" }}</span>
            </p>
          </template>
          <template slot-scope="{ row }" slot="idDeployment">
            <span
              v-if="row.idDeployment == 'yes'"
              :style="{
                color: row.port ? (row.isPort === 'yes' ? '#6CD1A7' : 'red') : '#6CD1A7',
              }"
              >{{
                row.port ? (row.isPort === "yes" ? "已部署" : "已暂停") : "已部署"
              }}</span
            >
            <span v-else style="color: #ec6c73">未部署</span>
          </template>
          <template slot-scope="{ row }" slot="remark">
            <Tooltip max-width="200" :content="row.remark" placement="top">
              <span class="nowrap">{{ row.remark }}</span>
            </Tooltip>
          </template>
          <!-- <template slot-scope="{ row }" slot="webUrl">
                <span
                  v-if="row.idDeployment=='yes'"
                  class="copy1"
                  v-clipboard:copy="row.href"
                  v-clipboard:success="onCopy"
                  v-clipboard:error="onError"
                >复制链接</span>
                <span v-else class="copy2">复制链接</span>
              </template>-->
          <!-- <template slot-scope="{ row }" slot="mode">
                <span>{{row.mode!='1'?'静态部署':'自动部署'}}</span>
              </template>-->
          <template slot-scope="{ row }" slot="action">
            <div class="error-bot">
              <!-- <Button
                v-if="!row.port"
                @click="handleShow(row)"
                type="success"
                size="small"
                :disabled="row.idDeployment !== 'yes'"
                >访问</Button
              > -->

              <Button type="primary" size="small" @click="handleDeploy(row)"
                >重新构建</Button
              >
              <Button @click="handleShow(row)" type="success" size="small"
                >构建日志</Button
              >
              <Button @click="handleShow(row)" type="success" size="small"
                >构建日志</Button
              >
              <!-- <Button
                    v-if="user.bid == row.authorId"
                    type="error"
                    size="small"
                    @click="handleDelecte(row)"
                    :disabled="row.idDeployment == 'yes'"
                    >删除</Button
                  > -->
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
  </div>
</template>

<script>
import Decorate from "@/components/Decorate";
export default {
  components: {
    Decorate,
  },
  // props: {
  //   msg: String
  // },

  data() {
    return {
      pageNo: 1,
      pageSize: 10,
      total: 10,
      isModel: false,
      modal_loading: false,
      columns: [
        {
          title: "ID",
          width: 180,
          slot: "projectName",
        },
        {
          title: "CommitID",

          slot: "projectName",
        },
        {
          title: "构建者",

          slot: "author",
        },
        {
          title: "开始时间",

          slot: "version",
        },
        {
          title: "结束时间",

          slot: "version",
        },
        {
          title: "部署时长",

          slot: "version",
        },
        {
          title: "部署状态",

          slot: "version",
        },
        {
          title: "操作",

          slot: "action",
        },
      ],
      content: [
        {
          name: "John Brown",
          age: 18,
          address: "New York No. 1 Lake Park",
        },
      ],
      itemData: {},
      isOpen: true,

      cityList1: [],
      cityList2: [
        { name: "已部署", value: "yes" },
        { name: "未部署", value: "no" },
      ],
      titleVal: "",
      authorVal: "",
      publishVal: "",
      user: {},
      // -----------------------------------------
      // isDetail: true,
      // mark: true,
      // author: "",
      // page: 1,
      typeArr: [],

      cityList3: [],
      // bid: "",

      classVal: "",
    };
  },
  watch: {
    // keySelect(val) {
    //   // console.log(this.keyInput);
    //   // console.log(val);
    //   if (val) {
    //     this.buttonDisabled = this.keyInput !== val;
    //   }
    // },
    // isDelete(val) {
    //   if (!val) {
    //     this.handleCancel();
    //   }
    // },
  },
  created() {
    // let shell = window.sessionStorage.getItem("shell");
    // if (shell == "yes") {
    //   window.sessionStorage.removeItem("shell");
    //   // window.location.reload();
    // }
    // this.$event.on("isPort", (e) => {
    //   this.handleProt(e);
    // });
    this.handleGetData();
  },
  mounted() {
    // this.$Message.destroy();
    // this.user = this.$store.state.variable.info;
    // this.authorId = this.user.bid;
    // if (this.user.name === "admin") {
    //   this.authorId = "";
    //   this.collect = "";
    //   this.qurey = "全部";
    // }
    // this.handleGetData();
    // // this.$event.on("input", val => {
    // //   this.projectName = val;
    // //   this.handleGetData();
    // // });
    // this.$Message.destroy();
    // this.user = this.$store.state.variable.info;
    // this.authorId = this.user.bid;
    // if (this.user.name === "admin") {
    //   this.authorId = "";
    //   this.collect = "";
    //   this.qurey = "全部";
    // }
  },
  methods: {
    handleGetData() {
      // this.$Message.destroy();
      let data = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        // pageSize: this.pageSize
        // idDeployment: "yes",
      };
      // if (this.authorId && this.qurey !== "全部") {
      //   data.authorId = this.authorId;
      // }
      // if (this.collect) {
      //   data.collect = this.collect;
      // }
      // if (this.key) {
      //   data.key = this.key;
      // }
      this.$request.get("/swd/deploy/get", { params: data }).then((res) => {
        if (res.data.code === 200) {
          this.total = res.data.count;
          this.projectData = res.data.data;
        }
      });
    },
    changePage(event) {
      this.pageNo = event;
      this.handleGetData();
    },
    changeSizePage(event) {
      this.pageSize = event;
      this.handleGetData();
    },
    handleOnChange(key) {
      // this.noauthorId = false;
      this.authorId = "";
      this.collect = "";
      this.handleCancel();
      // this.$event.emit("inputClear", "");
      switch (key) {
        case "我创建的":
          this.authorId = this.user.bid;
          break;
        case "已收藏的":
          this.collect = "1";
          // this.authorId = this.user.bid;
          break;
        // case "启动服务":
        //   this.handleServer();
        //   break;
        default:
          break;
      }

      this.handleGetData();
    },
    handleServer() {
      this.$axios
        .post("/api/service/operation/open", this.$qs.stringify({ port: "all" }))
        .then((res) => {
          this.$Message.destroy();
          if (res.data.result) {
            this.handleGetData();
            this.$Modal.success({
              title: "系统提示",
              content: "允许启动的项目服务已重启成功！",
            });
          } else {
            this.$Message["error"]({
              background: true,
              content: "操作失败，请重试！",
            });
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    handleStar(bid, collect) {
      this.$axios
        .post("/api/deploy/edition/update", this.$qs.stringify({ bid, collect }))
        .then((res) => {
          let message = collect == "1" ? "收藏成功！" : "已取消收藏！";
          this.$Message.destroy();
          if (res.data.result) {
            this.$Message["success"]({
              background: true,
              content: message,
            });
            this.handleGetData();
          } else {
            this.$Message["error"]({
              background: true,
              content: "操作失败！",
            });
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    // 单个端口操作
    handleProt(data) {
      this.$Message.destroy();
      if (data.isPort === "yes") {
        this.$axios
          .post(
            "/api/service/operation/close",
            this.$qs.stringify({ key: data.key, port: data.port })
          )
          .then((res) => {
            // let message = data.isPort == "yes" ? data.port+"端口关闭成功！" :  data.port+"端口关闭失败！";
            this.$Message.destroy();
            if (res.data.result) {
              // this.$Message["success"]({
              //   background: true,
              //   content: data.projectName + "服务关闭成功！",
              // });
              this.$Modal.success({
                title: "系统提示",
                content: data.projectName + "服务关闭成功！",
              });
              this.handleGetData();
            } else {
              this.$Message["error"]({
                background: true,
                content: data.projectName + "服务关闭失败！",
              });
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      } else {
        this.$axios
          .post("/api/service/operation/open", this.$qs.stringify(data))
          .then((res) => {
            // let message = data.isPort == "yes" ? data.port+"端口关闭成功！" :  data.port+"端口关闭失败！";
            this.$Message.destroy();
            if (res.data.result) {
              // this.$Message["success"]({
              //   background: true,
              //   content:
              //     data.projectName +
              //     "服务开启成功，已运行在 " +
              //     data.port +
              //     " 端口！",
              // });
              this.$Modal.success({
                title: "系统提示",
                content:
                  data.projectName + "服务开启成功，已运行在 " + data.port + " 端口！",
              });
              this.handleGetData();
            } else {
              this.$Message["error"]({
                background: true,
                content: data.projectName + "服务开启失败！",
              });
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    },
    // 自动部署
    handleAuto(data) {
      let content_success = "";
      let content_error = "";
      if (data.isAuto === "yes") {
        data.isAuto = "no";
        content_success = "自动部署关闭成功！（此项目与Git不在关联，自动部署已暂停）";
        content_error = "自动部署关闭失败！";
      } else {
        data.isAuto = "yes";
        content_success = "自动部署开启成功！（此项目与Git已关联，自动部署已开启）";
        content_error = "自动部署开启失败！";
      }
      this.$axios
        .post(
          "/api/deploy/edition/update",
          this.$qs.stringify({ isAuto: data.isAuto, key: data.key })
        )
        .then((res) => {
          // let message = data.isPort == "yes" ? data.port+"端口关闭成功！" :  data.port+"端口关闭失败！";
          this.$Message.destroy();
          if (res.data.result) {
            // this.$Message["success"]({
            //   background: true,
            //   content: content_success,
            // });
            this.$Modal.success({
              title: "系统提示",
              content: data.projectName + content_success,
            });
            this.handleGetData();
          } else {
            this.$Message["error"]({
              background: true,
              content: data.projectName + content_error,
            });
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    // History 模式
    handleHistory(data) {
      let content_success = "";
      let content_error = "";
      if (data.isHistory === "yes") {
        data.isHistory = "no";
        content_success = "History路由模式关闭成功！";
        content_error = "History路由模式关闭失败！";
      } else {
        data.isHistory = "yes";
        content_success = "History路由模式开启成功！";
        content_error = "History路由模式开启失败！";
      }
      this.$axios
        .post(
          "/api/service/operation/history",
          this.$qs.stringify({
            isHistory: data.isHistory,
            key: data.key,
            idDeployment: data.idDeployment,
            root: data.root,
            target: data.target,
            port: data.port,
            webUrl: data.webUrl,
          })
        )
        .then((res) => {
          // let message = data.isPort == "yes" ? data.port+"端口关闭成功！" :  data.port+"端口关闭失败！";
          this.$Message.destroy();
          if (res.data.result) {
            // this.$Message["success"]({
            //   background: true,
            //   content: content_success,
            // });
            this.$Modal.success({
              title: "系统提示",
              content: data.projectName + content_success,
            });
            this.handleGetData();
          } else {
            this.$Message["error"]({
              background: true,
              content: data.projectName + content_error,
            });
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    handleCancel() {
      this.key = "";
      this.keySelect = "";
      this.keyInput = "";
      this.buttonDisabled = true;
    },
    handleDelModal() {
      this.$Message.destroy();
      this.$axios
        .post(
          "/api/deploy/edition/delete",
          this.$qs.stringify({
            key: this.keyInput,
            vi: "1",
            root: this.root,
          })
        )
        .then((res) => {
          if (res.data.result) {
            this.$Message["success"]({
              background: true,
              content: "删除成功！",
            });
            this.isDelete = false;
            this.handleCancel();
            this.handleGetData();
          } else {
            this.$Message["error"]({
              background: true,
              content: "删除失败！",
            });
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    handleDelete(val) {
      // if (this.user.name === "Admin") {
      //   this.isToLogin = true;
      // } else {
      this.isDelete = true;
      this.keyInput = val.key;
      this.root = val.root;
      // }
    },
    handleRouter(path, val, data) {
      // this.$store.commit("setItemData", data);
      this.$router.push({ path, query: { bid: val } });
    },
    handleHref(data) {
      let win = window.open();
      win.opener = null;
      win.location = data.href;
      win.target = "_blank";
    },
    onCopy() {
      this.$Message.destroy();
      this.$Message["success"]({
        background: true,
        content: "链接地址已复制到粘贴板！",
      });
    },
    onError() {
      this.$Message.destroy();
      this.$Message["success"]({
        background: true,
        content: "复制失败！",
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.swd-commit {
  .content {
    padding-top: 20px;
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
  .page {
    background: #fff;
    padding: 20px;
    display: flex;
    justify-content: center;
    border: 1px solid #eee;
  }
}
</style>
