<template>
  <div class="swd-create">
    <div class="header">
      <Decorate
        icon="ivu-icon ivu-icon-md-add"
        title="创建项目"
        describe="在这里可以创建一个新的项目，同时也可以迭代之前的项目。项目的创建分为静态部署与自动部署，可根据自身需求进行选择。"
      >
        <div class="deploy-change">
          <div
            v-show="$route.query.isStatic !== '1'"
            class="but-item"
            @click="handleCharge('0')"
            :class="[modeType === '0' ? 'active' : '']"
          >
            <i class="ivu-icon ivu-icon-android-list"></i> 自动部署
          </div>
          <div
            v-show="$route.query.isStatic !== '0'"
            class="but-item"
            @click="handleCharge('1')"
            :class="[modeType === '1' ? 'active' : '']"
          >
            <i class="ivu-icon ivu-icon-gear-a"></i>静态部署
          </div>
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
          <Icon type="md-add" size="18"></Icon> 创建项目
        </BreadcrumbItem>
      </Breadcrumb>
    </div>
    <Gynamic v-if="modeType === '0'" />
    <StaticIndex v-if="modeType === '1'" />
  </div>
</template>
<script>
import Decorate from "@/components/Decorate";
import Gynamic from "./Gynamic";
import StaticIndex from "./StaticIndex";
export default {
  components: {
    Decorate,
    Gynamic,
    StaticIndex,
  },
  data() {
    return {
      modeType: "0",
    };
  },
  created() {
    this.modeType = this.$route.query.isStatic ? this.$route.query.isStatic : "0";
  },
  methods: {
    handleCharge(val) {
      this.modeType = val;
    },
  },
};
</script>
<style lang="scss" scoped>
.swd-create {
  .deploy-change {
    position: absolute;
    bottom: 0px;
    right: 150px;
    display: flex;
    // margin-top: 20px;
    .but-item {
      float: left;
      height: 40px;
      line-height: 40px;
      padding: 0 15px;
      color: #586069;
      cursor: pointer;
      border: solid transparent;
      border-width: 3px 1px 1px;
      // border-radius: 3px 3px 0 0;
      &.active {
        color: #24292e;
        background: #f5f7fa;
        border-color: #2d8cf0 #e1e4e8 transparent;
        position: relative;
        &::after {
          content: "";
          position: absolute;
          display: block;
          background: #f5f7fa;
          height: 6px;
          bottom: -3px;
          left: 0;
          width: 100%;
        }
      }
    }
  }
}
</style>
