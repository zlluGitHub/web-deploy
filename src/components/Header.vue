<template>
  <div class="swd-header">
    <div class="swd-section">
      <div class="left">
        <!-- <h1>Web Deploy</h1> -->
        <h1 @click="handleRouter"></h1>
        <Menu mode="horizontal" :theme="theme" active-name="1">
          <!-- <Input v-model="value14" placeholder="Enter something..." clearable style="width: 100px" /> -->
          <MenuItem name="1" to="/"> <Icon type="md-cube" size="18" />工作台 </MenuItem>

          <MenuItem name="2" to="/create">
            <Icon type="md-add" size="20" />创建项目
          </MenuItem>
             <MenuItem name="4" to="/system">
            <Icon type="ios-person" size="24" />个人中心
          </MenuItem>
          <MenuItem name="7" to="/CodeIde">
            <Icon type="md-add" size="20" />在线IDE
          </MenuItem>
          <!-- <MenuItem name="3" to="/projectmanage">
            <Icon type="ios-list-box-outline" size="20" />项目列表
          </MenuItem> -->

       
          <!-- <MenuItem name="5" @click.native="handleRouterLog">
            <Icon type="ios-list-box-outline" size="20" />日志列表
          </MenuItem> -->
          <!-- <MenuItem name="3"  @click.native="handleShell"> -->
          <!-- <MenuItem name="5" to="/shell">
            <Icon type="md-code-working" size="24" />命令行
          </MenuItem>-->
          <!-- <Submenu name="3">
          <template slot="title">
            <Icon type="ios-stats" />使用文档
          </template>
          <MenuGroup title="使用">
            <MenuItem name="3-1">新增和启动</MenuItem>
            <MenuItem name="3-2">活跃分析</MenuItem>
            <MenuItem name="3-3">时段分析</MenuItem>
          </MenuGroup>
          <MenuGroup title="留存">
            <MenuItem name="3-4">用户留存</MenuItem>
            <MenuItem name="3-5">流失用户</MenuItem>
          </MenuGroup>
          </Submenu>-->
          <!-- <MenuItem name="4" to="/docs"> -->
          <MenuItem name="6">
            <span @click="handleUrl('https://zllugithub.github.io/web-deploy/')">
              <!-- <Icon type="ios-information-circle-outline" size="20"></Icon>反馈（Issues） -->
              <Icon type="ios-book" size="20" />说明文档
            </span>
          </MenuItem>
          <MenuItem name="7">
            <!-- <Badge :count="2"> -->
            <span @click="handleUrl('https://github.com/zlluGitHub/web-deploy/issues')">
              <Icon type="ios-information-circle-outline" size="20"></Icon>反馈（Issues）
            </span>

            <!-- </Badge>消息 -->
          </MenuItem>
        </Menu>
      </div>
      <!-- <Input
        v-model="inputVal"
        search
        @on-search="handleOnSearch"
        placeholder="查找项目..."
        style="width: 200px"
      />-->
      <Dropdown class="dropdown-menu">
        <div class="heade-menu">
          <img :src="user.url" />
          <span>{{ user.name }}</span>
          <Icon type="ios-arrow-down"></Icon>
        </div>
        <DropdownMenu slot="list">
          <DropdownItem @click.native="handleQuit">
            <Icon type="ios-log-out" size="16" />退出登录
          </DropdownItem>
          <!-- <DropdownItem divided>北京烤鸭</DropdownItem> -->
        </DropdownMenu>
      </Dropdown>
    </div>
    <Modal v-model="isOpen" width="360">
      <p slot="header">
        <Icon
          type="ios-information-circle"
          size="20"
          style="color: #f60; margin-right: 10px"
          >></Icon
        >
        <span>请输入登录密码进行验证</span>
      </p>

      <Input v-model="password" placeholder="请输入密码..." style="width: 100%" />

      <div slot="footer">
        <Button @click="handleRouterLog">取消</Button>
        <Button type="primary" @click="handleCheck">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
export default {
  data() {
    return {
      theme: "dark",
      inputVal: "",
      password: "",
      isOpen: false,
      user: {
        url:"",
        name:""
      },
    };
  },
  // watch: {
  //   inputVal(val) {

  //   }
  // },
  mounted() {
    // this.user = this.$store.state.variable.info;
    // this.$event.on("inputClear", val => {
    //   this.inputVal = val;
    // });
  },
  methods: {
    // handleShell() {
    //   this.$event.emit("isShell", true);
    // },
    handleUrl(url) {
      let win = window.open();
      win.opener = null;
      win.location = url;
      win.target = "_blank";
    },
    handleCheck() {
      let user = this.$store.state.variable.info;
      if (user.password === this.password) {
        this.isOpen = false;
        this.password = "";
        this.$router.push({ path: "/logs" });
      } else {
        this.$Modal.error({
          title: "系统提示",
          content: "密码错误，请重新输入！",
        });
      }
    },
    handleRouterLog() {
      this.password = "";
      this.isOpen = !this.isOpen;
    },
    handleRouter() {
      this.$router.push({ path: "/" });
    },
    handleOnSearch() {
      this.$event.emit("input", this.inputVal);
    },
    handleQuit() {
      window.sessionStorage.clear();
      this.$store.commit("setUser", {});
      this.$store.commit("setItemData", {});
      this.$router.push({ path: "/login" });
    },
  },
};
</script>

<style lang="scss">
.swd-header {
  display: flex;
  justify-content: center;
  background: #515a6e;
  // > div {
  //   width: 80%;
  //   display: flex;
  //   align-items: center;
  //   justify-content: space-between;
  // }
  .swd-section {
    width: 80%;
   display: flex;
   justify-content: space-between;
    .left {
      display: flex;
      align-items: center;
      h1 {
        color: #fff;
        margin-right: 20px;
        margin-left: 10px;
        height: 35px;
        width: 55px;
        cursor: pointer;
        background: url("../assets/logo.png") center center no-repeat;
        background-size: 100% 100%;
      }
    }
    // .dropdown-menu {
    //   color: rgba(255, 255, 255, 0.7);
    //   .heade-menu {
    //     display: flex;
    //     justify-content: center;
    //     align-items: center;
    //     height: 60px;
    //     cursor: pointer;
    //     margin-right: 10px;
    //     img {
    //       width: 32px;
    //       height: 32px;
    //       border-radius: 100%;
    //       margin: 10px 5px;
    //     }
    //   }
    // }
  }
}
</style>
