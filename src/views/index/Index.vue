<template>
  <div class="swd-index">
    <div class="header">
      <Decorate
        icon="ivu-icon ivu-icon-md-cube"
        title="工作台"
        describe="这里将展示你的个人项目，当然也包括协同项目。"
      >
        <div class="button-warp">
          <Button
            ghost
            type="primary"
            :loading="refreshLoading"
            icon="md-refresh"
            @click="handleRefresh"
            >重启所有服务</Button
          >
          <Button
            ghost
            type="error"
            :loading="powerLoading"
            icon="md-power"
            @click="handlePower"
            >关闭所有服务</Button
          >
          <!-- <Button ghost type="success" icon="md-add" @click="handleRouter('/create')"
            >创建新项目</Button
          > -->
        </div>
      </Decorate>
    </div>
    <div class="content">
      <div>
        <ul>
          <li v-for="(item, i) in projectData" :key="item.bid + i">
            <div class="item-header">
              <!-- 自动部署 -->
              <div class="left" v-if="item.isStatic == '0'">
                <span class="state">
                  <i
                    :style="{
                      background: item.isServer ? '#2d8cf0' : 'red',
                    }"
                  ></i>
                  <span>{{ item.isServer ? "服务已开启" : "服务已关闭" }}</span>
                </span>
                <span class="state auto">
                  <i
                    :style="{
                      background: item.isAuto ? '#2d8cf0' : 'red',
                    }"
                  ></i>
                  <span>{{ item.isAuto ? "部署已开启" : "部署已暂停" }}</span>
                </span>
              </div>
              <!-- 静态部署 -->
              <div class="left" v-else>
                <span class="state">
                  <i
                    :style="{
                      background: item.isServer ? '#2d8cf0' : 'red',
                    }"
                  ></i>
                  <span v-if="item.port">{{ item.isServer ? "服务已开启" : "服务已关闭" }}</span>
                  <span v-else>静态服务</span>
                </span>
              </div>

              <div class="right">
                <Dropdown trigger="click">
                  <Icon type="md-more" size="18" />
                  <DropdownMenu slot="list">
                    <DropdownItem @click.native="handleProt(item)" v-if="item.port"
                      >{{ item.isServer ? "暂停" : "开启" }}运行服务</DropdownItem
                    >
                    <DropdownItem
                      @click.native="handleAuto(item)"
                      v-if="item.isStatic === '0'"
                      >{{ item.isAuto ? "关闭" : "开启" }}自动部署</DropdownItem
                    >
                    <DropdownItem @click.native="handleHistory(item)" v-if="item.port">{{
                      item.router === "hash" ? "切换至History模式" : "切换至Hash模式"
                    }}</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
            </div>

            <!--     <div class="icon">
            <Icon
                  type="ios-star-outline"
                  size="26"
                  v-if="item.collect!=='1'"
                  @click="handleStar(item.bid,'1')"
                /> 
                <Icon type="ios-star" size="26" v-else @click="handleStar(item.bid,'0')" />
            </div>-->

            <h2
              @click="
                handleRouter(
                  item.isStatic == '0' ? '/gynamicDetails' : '/staticIndexDetails',
                  item.bid,
                  item.isStatic
                )
              "
            >
              {{ item.title }}
            </h2>

            <p>
              <Icon type="ios-settings-outline" size="18" />
              <span>{{ item.isStatic == "0" ? "自动部署" : "静态部署" }}</span>
            </p>
            <p>
              <Icon type="ios-code-working" size="20" />
              <span>{{ item.router }}模式</span>
            </p>
            <p>
              <Icon type="ios-time-outline" size="18" />
              <span>{{ item.time }}</span>
            </p>
            <div class="description">{{ item.remark ? item.remark : "暂无描述" }}</div>
            <div class="bottom-list">
              <!--<Tooltip content="复制链接" placement="top" class="border-r-no">
               <Tooltip
                content="复制链接"
                placement="top"
                class="border-r-no"
                v-clipboard:copy="item.href"
                v-clipboard:success="onCopy"
                v-clipboard:error="onError"
              > 
                <Icon type="ios-link" size="20" />
              </Tooltip>-->
              <Tooltip content="删除" placement="top" class="border-r-no">
                <Icon type="ios-trash-outline" size="20" @click="handleDelete(item)" />
              </Tooltip>

              <Tooltip content="更新项目" placement="top" class="border-r-no">
                <!-- <Icon type="ios-create-outline" /> -->
                <Icon
                  type="ios-create-outline"
                  size="20"
                  @click="handleRouter('/create', item.bid, item.isStatic)"
                />
                <!-- <Icon type="md-add"/> -->
              </Tooltip>
              <Tooltip content="部署列表" placement="top" class="border-r-no">
                <!-- <Icon type="ios-list" /> -->
                <Icon
                  type="ios-list"
                  size="26"
                  @click="handleRouter('/commitList', item.bid, item.isStatic)"
                />
              </Tooltip>
              <Tooltip content="项目详情" placement="top">
                <!-- <Icon type="ios-paper-outline" /> -->
                <Icon
                  type="ios-list-box-outline"
                  size="20"
                  @click="
                    handleRouter(
                      item.isStatic == '0' ? '/gynamicDetails' : '/staticIndexDetails',
                      item.bid
                    )
                  "
                />
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
      refreshLoading: false,
      powerLoading: false,
      pageNo: 1,
      pageSize: 10,
      total: 0,
      projectData: [],
      serverData: {},
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
    handleRefresh() {
      this.$Modal.confirm({
        title: "系统提示",
        content: "<p>确定要重启所有项目服务吗？</p>",
        onOk: () => {
          this.refreshLoading = true;
          this.$request.post("/swd/deploy/openAllServer").then((res) => {
            if (res.data.code === 200) {
              this.refreshLoading = false;
              // this.serverData = res.data.data;
              // console.log('asasas');

              this.handleGetData();
              this.$Modal.success({
                title: "系统提示",
                content: "所有服务已重启成功！",
              });
            }
          });
        },
      });
    },
    handlePower() {
      this.$Modal.confirm({
        title: "系统提示",
        content: "<p>确定要关闭所有项目服务吗？</p>",
        onOk: () => {
          this.powerLoading = true;
          this.$request.post("/swd/deploy/closeAllServer").then((res) => {
            if (res.data.code === 200) {
              this.powerLoading = false;
              // this.serverData = res.data.data;
              this.handleGetData();
              this.$Modal.success({
                title: "系统提示",
                content: "所有服务已关闭成功！",
              });
            }
          });
        },
      });
    },
    handleGetData() {
      // this.$Message.destroy();
      let data = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
      };
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
    // handleOnChange(key) {
    //   // this.noauthorId = false;
    //   this.authorId = "";
    //   this.collect = "";
    //   this.handleCancel();
    //   // this.$event.emit("inputClear", "");
    //   switch (key) {
    //     case "我创建的":
    //       this.authorId = this.user.bid;
    //       break;
    //     case "已收藏的":
    //       this.collect = "1";
    //       // this.authorId = this.user.bid;
    //       break;
    //     // case "启动服务":
    //     //   this.handleServer();
    //     //   break;
    //     default:
    //       break;
    //   }

    //   this.handleGetData();
    // },
    // handleServer() {
    //   this.$axios
    //     .post("/api/service/operation/open", this.$qs.stringify({ port: "all" }))
    //     .then((res) => {
    //       this.$Message.destroy();
    //       if (res.data.result) {
    //         this.handleGetData();
    //         this.$Modal.success({
    //           title: "系统提示",
    //           content: "允许启动的项目服务已重启成功！",
    //         });
    //       } else {
    //         this.$Message["error"]({
    //           background: true,
    //           content: "操作失败，请重试！",
    //         });
    //       }
    //     })
    //     .catch(function (error) {
    //       console.log(error);
    //     });
    // },
    // handleStar(bid, collect) {
    //   this.$axios
    //     .post("/api/deploy/edition/update", this.$qs.stringify({ bid, collect }))
    //     .then((res) => {
    //       let message = collect == "1" ? "收藏成功！" : "已取消收藏！";
    //       this.$Message.destroy();
    //       if (res.data.result) {
    //         this.$Message["success"]({
    //           background: true,
    //           content: message,
    //         });
    //         this.handleGetData();
    //       } else {
    //         this.$Message["error"]({
    //           background: true,
    //           content: "操作失败！",
    //         });
    //       }
    //     })
    //     .catch(function (error) {
    //       console.log(error);
    //     });
    // },
    // 单个端口操作
    handleProt(data) {
      // this.$Message.destroy();
      if (data.isServer) {
        this.$request
          .post("/swd/deploy/closeServer", {
            bid: data.bid,
            commitBid: data.commitBid,
            title: data.title,
            port: data.port,
          })
          .then((res) => {
            if (res.data.code === 200) {
              this.$Modal.success({
                title: "系统提示",
                content: data.title + "服务关闭成功！",
              });
              this.handleGetData();
            } else {
              this.$Modal.error({
                title: "系统提示",
                content: data.title + "服务关闭失败！",
              });
            }
          });
      } else {
        this.$request
          .post("/swd/deploy/openServer", {
            bid: data.bid,
            commitBid: data.commitBid,
            title: data.title,
            port: data.port,
            proxy: data.proxy,
            www: data.www,
          })
          .then((res) => {
            if (res.data.code === 200) {
              this.$Modal.success({
                title: "系统提示",
                content: data.title + "服务开启成功！",
              });
              this.handleGetData();
            } else {
              this.$Modal.error({
                title: "系统提示",
                content: data.title + "服务开启失败！",
              });
            }
          });
      }
    },
    // 自动部署
    handleAuto(data) {
      let content_success = "";
      let content_error = "";
      if (data.isAuto) {
        data.isAuto = false;
        content_success = "自动部署关闭成功！（此项目与Git不在关联，自动部署已暂停）";
        content_error = "自动部署关闭失败！";
      } else {
        data.isAuto = true;
        content_success = "自动部署开启成功！（此项目与Git已关联，自动部署已开启）";
        content_error = "自动部署开启失败！";
      }
      this.$request
        .post("/swd/deploy/updateInfo", { isAuto: data.isAuto, bid: data.bid })
        .then((res) => {
          // let message = data.isPort == "yes" ? data.port+"端口关闭成功！" :  data.port+"端口关闭失败！";
          // this.$Message.destroy();
          if (res.data.code === 200) {
            this.$Modal.success({
              title: "系统提示",
              content: data.title + content_success,
            });
            this.handleGetData();
          }
        });
    },

    // History 模式
    handleHistory(data) {
      let content_success = "";
      let content_error = "";
      if (data.router === "hash") {
        data.router = "history";
        content_success = "History路由模式关闭成功！";
        content_error = "History路由模式关闭失败！";
      } else {
        data.router = "hash";
        content_success = "History路由模式开启成功！";
        content_error = "History路由模式开启失败！";
      }
      this.$request
        .post("/swd/deploy/history", data)
        .then((res) => {
          // this.$Message.destroy();
          if (res.data.code === 200) {
            this.$Modal.success({
              title: "系统提示",
              content: data.title + content_success,
            });
            this.handleGetData();
          } else {
            this.$Modal.error({
              title: "系统提示",
              content: data.title + content_error,
            });
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    // handleCancel() {
    //   this.key = "";
    //   this.keySelect = "";
    //   this.keyInput = "";
    //   this.buttonDisabled = true;
    // },
    // handleDelModal() {
    //   // this.$Message.destroy();
    //   this.$axios
    //     .post(
    //       "/api/deploy/edition/delete",
    //       this.$qs.stringify({
    //         key: this.keyInput,
    //         vi: "1",
    //         root: this.root,
    //       })
    //     )
    //     .then((res) => {
    //       if (res.data.result) {
    //         this.$Message["success"]({
    //           background: true,
    //           content: "删除成功！",
    //         });
    //         this.isDelete = false;
    //         this.handleCancel();
    //         this.handleGetData();
    //       } else {
    //         this.$Message["error"]({
    //           background: true,
    //           content: "删除失败！",
    //         });
    //       }
    //     })
    //     .catch(function (error) {
    //       console.log(error);
    //     });
    // },

    // 删除项目
    handleDelete(data) {
      this.$Modal.confirm({
        title: "系统提示",
        content: "<p>此项目删除后不可恢复，确定要删除有关该项目的所有内容吗？</p>",
        onOk: () => {
          this.$Message.loading({
            content: "正在删除中，请稍后...",
            duration: 0,
          });
          this.$request.post("/swd/deploy/deleteInfo", data).then((res) => {
            this.$Message.destroy();
            if (res.data.code === 200) {
              this.$Modal.success({
                title: "系统提示",
                content: data.title + "删除成功！",
              });
              this.handleGetData();
            }
          });
        },
      });
    },
    handleRouter(path, bid, isStatic) {
      // this.$store.commit("setItemData", data);
      this.$router.push({ path, query: { bid, isStatic } });
    },
    // handleHref(data) {
    //   let win = window.open();
    //   win.opener = null;
    //   win.location = data.href;
    //   win.target = "_blank";
    // },
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
  .header {
    .button-warp {
      margin-top: 20px;

      button {
        margin-left: 20px;
      }
    }
    /deep/ .ivu-icon-ios-refresh {
      font-size: 18px;
    }
  }
  .content {
    padding-top: 20px;
    display: flex;
    justify-content: center;
    > div {
      width: 80%;
      > ul {
        display: flex;
        flex-wrap: wrap;
        .item-header {
          margin-top: 10px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 13px 0;
          border-bottom: 1px solid #eee;
          margin-bottom: 10px;
          .left {
            .state {
              top: 18px;
              left: 20px;
              font-size: 12px;
               margin-right: 18px;
              i {
                padding: 5px;
                border-radius: 100%;
                background: #f84c5b;
                display: inline-block;
                margin-right: 6px;
              }
              span {
                margin-right: 10px;
              }
            }
            .auto {
              left: 120px;
            }
          }
          .right {
            position: relative;
            /deep/ .ivu-dropdown {
              // position: absolute;
              // top: 5px;
              // right: 0px;
              cursor: pointer;
            }
          }
        }
        > li {
          background: #fff;
          width: 282px;
          padding: 10px 20px;
          padding-top: 0;
          box-shadow: 0 1px 5px #e5e5e5;
          border-radius: 4px;
          transition: all 0.3s;
          position: relative;
          margin: 20px 10px;
          margin-top: 0px;

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
            padding: 10px 0;
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
  /deep/ .ivu-tooltip-rel{
    display: flex;
    align-items: center;
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
