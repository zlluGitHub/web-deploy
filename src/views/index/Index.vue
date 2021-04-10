<template>
  <div class="swd-index">
    <div class="header">
      <Decorate
        icon="ivu-icon ivu-icon-md-cube"
        title="工作台"
        describe="这里将展示你的个人项目，当然也包括协同项目。"
      />
    </div>
    <div class="content">
      <div>
        <ul class="box">
          <li v-for="(item, i) in projectData" :key="item.bid + i">
            <span class="state" v-if="!item.port">
              <i :style="{ background: '#2d8cf0' }"></i>
              <span>服务运行中</span>
            </span>
            <span class="state" v-else>
              <i
                :style="{
                  background: item.isPort === 'yes' ? '#2d8cf0' : 'red',
                }"
              ></i>
              <span v-if="item.isPort === 'yes'">服务运行中</span>
              <span v-else>服务已暂停</span>
            </span>
            <span class="state auto" v-if="item.mode == '1'">
              <i
                :style="{
                  background: item.isAuto === 'yes' ? '#2d8cf0' : 'red',
                }"
              ></i>
              <span>{{
                item.isAuto === "yes" ? "自动部署已开启" : "自动部署已暂停"
              }}</span>
            </span>
            <div class="md-more" v-if="item.mode === '1' || item.port">
              <Dropdown trigger="click" style="margin-left: 20px">
                <Icon type="md-more" size="18" />
                <DropdownMenu slot="list">
                  <DropdownItem v-if="item.port" @click.native="handleProt(item)"
                    >{{ item.isPort === "yes" ? "暂停" : "开启" }}运行服务</DropdownItem
                  >
                  <DropdownItem v-if="item.mode === '1'" @click.native="handleAuto(item)"
                    >{{ item.isAuto === "yes" ? "关闭" : "开启" }}自动部署</DropdownItem
                  >
                  <DropdownItem v-if="item.port" @click.native="handleHistory(item)"
                    >{{
                      item.isHistory === "yes" ? "关闭" : "开启"
                    }}History模式</DropdownItem
                  >
                </DropdownMenu>
              </Dropdown>
            </div>

            <div class="icon">
              <!-- <Icon
                  type="ios-star-outline"
                  size="26"
                  v-if="item.collect!=='1'"
                  @click="handleStar(item.bid,'1')"
                /> 
                <Icon type="ios-star" size="26" v-else @click="handleStar(item.bid,'0')" />-->
            </div>

            <h2 @click="handleHref(item)">{{ item.title }}</h2>
            <p>
              <Icon type="ios-code-working" size="20" />
              <span>{{ item.version }}</span>
            </p>
            <p>
              <Icon type="ios-settings-outline" size="18" />
              <span>{{ item.mode == "0" ? "静态部署" : "自动部署" }}</span>
            </p>
            <p>
              <Icon type="ios-time-outline" size="18" />
              <span>{{ item.time }}</span>
            </p>
            <div class="description">{{ item.remark }}</div>
            <div class="bottom-list">
              <Tooltip
                content="复制链接"
                placement="top"
                class="border-r-no"
                v-clipboard:copy="item.href"
                v-clipboard:success="onCopy"
                v-clipboard:error="onError"
              >
                <Icon type="ios-link" size="20" />
              </Tooltip>
              <Tooltip
                content="删除"
                placement="top"
                class="border-r-no"
                @click.native="handleDelete(item)"
              >
                <Icon type="ios-trash" size="20" />
              </Tooltip>

              <Tooltip
                content="更新项目"
                placement="top"
                class="border-r-no"
                @click.native="handleRouter('/addpage', item.key, item)"
              >
                <Icon type="md-repeat" size="20" />
                <!-- <Icon type="md-add"/> -->
              </Tooltip>
              <Tooltip
                content="部署列表"
                placement="top"
                @click.native="handleRouter('/tablePage', item.key)"
              >
                <Icon type="ios-list-box-outline" size="20" />
              </Tooltip>
            </div>
          </li>
        </ul>
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
      total: 0,
      projectData: [],
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
.swd-index {
  .content {
    padding-top: 20px;
    display: flex;
    justify-content: center;
    > div {
      width: 80%;
      > ul {
        display: flex;
        flex-wrap: wrap;
        > li {
          background: #fff;
          width: 282px;
          padding: 10px 20px;
          box-shadow: 0 1px 5px #e5e5e5;
          border-radius: 4px;
          transition: all 0.3s;
          position: relative;
          margin: 20px 10px;
          margin-top: 0px;
          // padding-bottom: 5px;
          // margin-bottom: 0;
          .icon {
            display: flex;
            justify-content: center;
            padding: 10px;
            margin-bottom: 20px;
            margin-top: 15px;
            border-bottom: 1px solid #eee;
            cursor: pointer;
            color: #f84c5b;
          }
          h2 {
            font-weight: 800;
            font-size: 16px;
            cursor: pointer;
            letter-spacing: 2px;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            word-break: break-all;
            transition: color 0.2s;
          }
          h2:hover {
            color: #27cfc3;
          }
          .description {
            padding: 10px;
            border: 1px solid #eee;
            border-radius: 4px;
            margin-top: 10px;
            background: #f5f5f5;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .description:before {
            content: "";
            display: block;
            width: 20px;
            height: 2px;
            background: #f84c5b;
            border-radius: 4px;
            margin-bottom: 3px;
          }
          p {
            margin: 15px 0;
            i {
              margin-right: 8px;
            }
          }
          .bottom-list {
            display: flex;
            //  border-top: 1px solid #eee;
            margin-top: 12px;
            padding: 10px 0;
            > div {
              padding: 10px 0px;
              flex-grow: 1;
              display: flex;
              justify-content: center;
              border: 1px solid #eee;
              cursor: pointer;
            }
            > div:hover {
              color: #2d8cf0;
              //    border-color: #2d8cf0;
            }
            .border-r-no {
              border-right: 0;
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
