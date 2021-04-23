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
        <label>部署端口：</label>
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
      <div class="list-item" v-if="!$route.query.bid">
        <label>选择文件：</label>
        <!--   <Upload
          class="put-warp"
          webkitdirectory
          type="drag"
          :before-upload="handleBeforeUpload"
          action="//jsonplaceholder.typicode.com/posts/"
        >
          <div style="padding: 20px 0" v-if="!file">
            <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
            <p>请选择或拖拽文件夹到这里</p>
          </div>
          <div style="padding: 20px 0" v-else>
            <Icon type="ios-folder" size="52" style="color: #3399ff" />
            <p>已选择【{{ file.name }}】文件夹</p>
          </div>
        </Upload>
       <div v-if="file !== null">
          Upload file: {{ file.name }}
          <Button type="text" @click="handleUploadFile" :loading="loadingStatus">{{
            loadingStatus ? "文件正在上传中..." : "点击上传文件"
          }}</Button>
        </div> -->
        <div class="put-warp file-warp">
          <div class="file-top">
            <Upload
              class="upload-but"
              multiple
              type="drag"
              :show-upload-list="false"
              :before-upload="handleBeforeUpload"
              action="/"
            >
              请选择文件
            </Upload>
            <Upload
              class="upload-but"
              multiple
              webkitdirectory
              type="drag"
               action="/"
              :show-upload-list="false"
              :before-upload="handleBeforeUpload"
            >
              请选择文件夹
            </Upload>
          </div>
          <div v-if="file.length === 0" class="file-bottom not-warp">
            <div>
              <Icon type="ios-folder-open-outline" />
            </div>
            <p>暂无文件</p>
          </div>
          <!-- 上传文件列表 -->
          <ul v-if="update && file.length !== 0" class="file-bottom">
            <li v-for="(item, i) in file" :key="i">
              <span>
                <Icon type="ios-paper-outline" />
                <span class="name">{{
                  item.webkitRelativePath ? item.webkitRelativePath : item.name
                }}</span>
              </span>
              <span>
                <span v-if="item.state" :style="{ color: '#19be6b' }">上传成功</span>
                <span v-else>等待上传</span>
                <i class="fa fa-close" @click="handleDeleteFile(i)"></i>
              </span>
            </li>
          </ul>
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

      <!-- <div class="tip-box">
        <DeployTip />
      </div> -->
      <div class="button-footer">
        <Button type="success" ghost @click="handleAutoSubmit">{{
          $route.query.bid ? "提交修改" : "提交部署"
        }}</Button>
        <Button type="error" v-if="!$route.query.bid" ghost @click.stop="handleResetData"
          >重置</Button
        >
        <Button @click.stop="handleBack">返回首页</Button>
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
      file: [],
      loadingStatus: false,
      update: true, //刷新作用
      fileNumber: 0,

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
      remark: "",

      isServer: "",
      router: "",
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
            this.remark = data.remark;
            this.www = data.www;
            this.port = data.port;

            this.commitBid = data.commitBid;
            this.isServer = data.isServer;
            this.router = data.router;
          }
        });
    }
  },
  methods: {
    // 文件件上传
    handleBeforeUpload(file) {
      console.log(file);
      file.state = false;
      this.file.push(file);
      return false;
    },
    handleUploadFile() {
      this.loadingStatus = true;
      setTimeout(() => {
        this.file = [];
        this.loadingStatus = false;
        this.$Message.success("Success");
      }, 1500);
    },
    // 删除文件
    handleDeleteFile(i) {
      this.file.splice(i, 1);
    },
    // 重置
    handleResetData() {
      this.title = "";
      this.www = "";
      this.port = "";
      this.remark = "";
      this.file = [];
    },
    //  提交保存
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
      // if (!this.port) {
      //   this.$Modal.warning({
      //     title: "系统提示",
      //     content: "部署端口不得为空，请输入后再试！",
      //   });
      //   return;
      // }

      let data = {
        title: this.title,
        www: this.www,
        port: this.port,
        remark: this.remark,
        isStatic: "1",
      };

      this.createSocketServer(() => {
        this.isLogModal = true;
        if (this.$route.query.bid) {
          data.bid = this.$route.query.bid;
          this.$request.post("/swd/deploy/initStatic", data).then((res) => {
            if (res.data.code === 200) {
              this.handleAddFile();
              // this.socketData.push({
              //   message: this.title + "项目部署成功！",
              //   time: this.$dateTime(),
              // });

              // this.$Modal.success({
              //   title: "系统提示",
              //   content: this.title + "项目部署成功！",
              // });
              // this.$router.push({ path: "/details", query: { bid: res.data.data } });
            }
          });
        } else {
          this.$request.post("/swd/deploy/initStatic", data).then((res) => {
            if (res.data.code === 200) {
              this.handleAddFile();
              // this.socketData.push({
              //   message: this.title + "项目部署成功！",
              //   time: this.$dateTime(),
              // });
              // this.$Modal.success({
              //   title: "系统提示",
              //   content: this.title + "项目部署成功！",
              // });
              // this.$router.push({ path: "/details", query: { bid: res.data.data } });
            }
          });
        }
      });
    },

    // 上传保存文件
    handleAddFile() {
      if (this.file && this.file.length !== 0) {
        this.fileNumber = 0;
        this.file.forEach((item, i) => {
          let formData = new FormData();
          formData.append("file", item, item.name);
          this.$request
            .post("/swd/fileEdit/add", formData, {
              headers: {
                "www-name": this.www,
                webkitRelativePath: item.webkitRelativePath,
              },
            })
            .then((res) => {
              if (res.data.code === 200) {
                item.state = true;
                this.update = false;
                this.update = true;

                this.socketData.push({
                  message: item.name + "文件上传保存成功！",
                  time: this.$dateTime(),
                });
              } else {
                this.socketData.push({
                  message: item.name + "文件上传保存失败！",
                  time: this.$dateTime(),
                });
              }
              this.deployIsSesses(i);
            })
            .catch((err) => {
              this.socketData.push({
                message: item.name + "文件上传保存失败！",
                time: this.$dateTime(),
              });
              this.deployIsSesses(i);
            });
        });
      } else {
        this.$Modal.success({
          title: "系统提示",
          content: this.title + "项目部署成功！",
        });
        this.socketData.push({
          message: this.title + "项目部署成功！",
          time: this.$dateTime(),
        });
      }
    },
    deployIsSesses(i) {
      if (this.fileNumber === this.file.length - 1) {
        this.$Modal.success({
          title: "系统提示",
          content: this.title + "项目部署成功！",
        });
        this.socketData.push({
          message: this.title + "项目部署成功！",
          time: this.$dateTime(),
        });
        // this.$router.push({ path: "/details", query: { bid: res.data.data } });
      } else {
        this.fileNumber++;
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
          } else {
            this.isProjectExit = false;
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
            } else {
              this.isWwwExit = false;
            }
          });
      }
    },

    handleBack() {
      this.$router.push({ path: "/" });
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
    .file-warp {
      // display: flex;
      // flex-direction: column;

      border: 1px solid #eee;
      border-radius: 4px;
      .file-top {
        font-size: 12px;
        display: flex;
        border-bottom: 1px solid #eee;
        // align-items: center;
        justify-content: space-around;
        button {
          margin: 0 10px;
        }
        /deep/ .ivu-upload-drag {
          border: 0;
          background: transparent;
        }
        > .upload-but {
          // background: #2d8cf0;
          // color: #fff;
          &:hover {
            color: #2d8cf0;
          }
          flex: 1;
          padding: 8px;
          &:nth-child(1) {
            border-right: 1px solid #eee;
          }
        }
      }
      .file-bottom {
        padding: 10px;
        // display: flex;
        // flex-wrap: wrap;
        overflow-y: auto;
        max-height: 250px;
        // background: rgba(238, 238, 238, 0.2);
        li {
          margin: 0;
          // width: 50%;
          display: flex;

          justify-content: space-between;
          &:hover {
            background: rgba(238, 238, 238, 0.493);
          }
          > span {
            display: flex;
            align-items: center;
          }
          span {
            margin: 0 6px;
            // width: 160px;
          }
          .name {
            display: inline-block;
            max-width: 270px;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            word-break: break-all;
          }
          .fa-close {
            cursor: pointer;
            margin-left: 6px;
            &:hover {
              color: red;
            }
          }
        }
      }
      .not-warp {
        text-align: center;
        padding: 40px;
        flex-direction: column;
        i {
          font-size: 28px;
        }
      }
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
