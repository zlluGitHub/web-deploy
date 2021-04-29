<template>
  <div class="swd-details">
    <div class="header">
      <Decorate
        icon="ivu-icon ivu-icon-ios-paper-outline"
        :title="`静态构建详情（${projectData.title}）`"
        describe="在这里可以创建一个新的项目，同时也可以迭代之前的项目。项目的创建分为静态部署与自动部署，可根据自身需求进行选择。"
      >
        <div class="button-warp">
          <Button ghost type="warning" @click="handleRouter">重新部署</Button>
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
              <label>构建者：</label>
              <p>{{ projectData.userId ? projectData.userId : "管理员" }}</p>
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
              <label>CommitID：</label>
              <p>{{ projectData.commitBid }}</p>
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
        commitBid: "加载中...",
        deployState: "加载中...",
        dist: "加载中...",
        duration: "加载中...",
       
        isServer: "加载中...",
        isStatic: "加载中...",
      
        port: "加载中...",
        remark: "加载中...",
        router: "加载中...",
     
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
          }
        });
    },
 
    handleRouter() {
      this.$router.push({
        path: "create",
        query: { bid: this.$route.query.bid ,isStatic:1},
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
