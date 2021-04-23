<template>
  <div class="tip-warp">
    <h3>
      <Icon type="ios-help-circle-outline" size="18" />
      <span class="active">关联 Git 仓库</span>
    </h3>
    <div class="content">
      <div>1、打开git：项目仓库 -> Settings -> Webhooks -> Add webhook</div>
      <div>
        2、在
        <span class="code">Target URL</span> 中填入
        <span class="url">{{ $url }}/api/deploy/git</span> 地址
      </div>
      <div>
        3、
        <span class="code">POST Content Type</span> 选择
        <span class="select">application/json</span>
      </div>
      <div>
        4、
        <!-- <span v-if="isOk">
          在
          <span class="code">Secret</span> 中填入秘钥Key：
          <span class="url">{{ key }}</span
          >；
        </span> -->
        <span>
          在
          <span class="code">Secret</span> 中填入部署成功后返回的 Key 值。
        </span>
      </div>
      <div>
        5、
        <span class="code">Trigger On</span>选择
        <span class="select">Push Events</span>
      </div>
      <div>
        <span style="color: red">注意：</span>若项代码托管平台为GitHub时，在第 2
        步中需要填入
        <span class="url"
          > /api/deploy/git?key={{ "返回的key值" }}</span
        >
        地址。
      </div>
      <!-- <div>
        <span style="color: red">注意：</span>若项代码托管平台为GitHub时，在第 2
        步中需要填入
        <span class="url"
          >{{ $url }}/api/deploy/git?key={{ key ? key : "返回的key值" }}</span
        >
        地址。
      </div> -->
    </div>
  </div>
</template>
<style lang="scss" scoped>
.tip-warp {
  position: absolute;
  top: 0;
  right: 30px;
  h3 {
    margin-bottom: 10px;
    text-align: right;
    font-size: 14px;
    font-weight: 400;
    margin-right: 10px;
    opacity: 0.8;
    span {
      cursor: pointer;
      margin-left: 5px;
    }
    span:hover,
    .active {
      color: #2d8cf0;
    }
    i {
      cursor: pointer;
    }
  }
  .content {
    border: 1px solid #abdcff;
    background-color: #f0faff;
    border-radius: 4px;
    padding: 20px;
    margin: 10px;
    width: 390px;
    > div {
      font-size: 12px;
      color: #515a6e;
      line-height: 1.5;
      color: #515a6e;
      margin-bottom: 6px;
      .url {
        color: #2d8cf0;
      }
      .code {
        color: #fa795e;
      }
      .select {
        padding: 2px 4px;
        font-size: 90%;
        color: #c7254e;
        background-color: #f9f2f4;
        border-radius: 4px;
        margin: 0 5px;
      }
    }
  }
}
</style>
