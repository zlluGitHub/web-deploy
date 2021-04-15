<template>
  <div class="swd-details">
    <div class="header">
      <Decorate
        icon="ivu-icon ivu-icon-md-add"
        title="部署详情"
        describe="在这里可以创建一个新的项目，同时也可以迭代之前的项目。项目的创建分为静态部署与自动部署，可根据自身需求进行选择。"
      >
      </Decorate>
    </div>

    <div class="content">
      <section>
     
          <Steps :current="1" status="error"  class="step-warp">
            <Step title="已完成" content="这里是该步骤的描述信息"></Step>
            <Step title="进行中" content="这里是该步骤的描述信息"></Step>
            <Step title="待进行" content="这里是该步骤的描述信息"></Step>
          </Steps> 
      </section>
    </div>
  </div>
</template>
<script>
import Decorate from "@/components/Decorate";
// import io from "socket.io-client";
export default {
  components: {
    Decorate,
  },

  data() {
    return {};
  },

  methods: {},
};
</script>
<style lang="scss" scoped>
.swd-details {
  .content {
    display: flex;
    justify-content: center;
    > section {
      width: 80%;
      margin-top: 20px;
      background: #fff;
      padding: 20px;
      border-radius: 5px;
     .step-warp{
       padding: 20px 15%;
     }
      
    }
  }
}
</style>
