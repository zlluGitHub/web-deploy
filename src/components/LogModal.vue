<template>
  <Modal
    title="部署日志"
    v-model="isLogModal"
    scrollable
    width="50%"
    :mask-closable="false"
    :footer-hide="true"
  >
    <div class="rz-box">
      <p v-for="(item, i) in socketData" :key="i">
        【{{ item.time }} 】： {{ item.message }}
      </p>
    </div>
    <!-- <div class="rz-tip" v-if="isOk">
        <div class="tip-box">
          <div>
            <p>
              √ 秘钥Key：
              <span style="color: #3390ff">{{ key }}</span>
            </p>
            <Divider orientation="left">关联 Git 仓库</Divider>
            <div class="tisi">
              <div>1、打开git：项目仓库 -> Settings -> Webhooks -> Add webhook；</div>
              <div>
                2、在
                <span class="code">Target URL</span> 中填入
                <span class="url">{{ $url }}/api/deploy/git</span> 地址；
              </div>
              <div>
                3、
                <span class="code">POST Content Type</span> 选择
                <span class="select">application/json</span>；
              </div>
              <div>
                4、在
                <span class="code">Secret</span> 中填入秘钥Key：
                <span class="url">{{ key }}</span
                >；
              </div>
              <div>
                5、
                <span class="code">Trigger On</span>选择
                <span class="select">Push Events</span>；
              </div>
              <div>
                <span style="color: red">注意：</span>若项代码托管平台为 GitHub 时，在第 2
                步中需要填入
                <span class="url"
                  >{{ $url }}/api/deploy/git?key={{ key ? key : "返回的key值" }}</span
                >
                地址。
              </div>
            </div>
          </div>
        </div>
      </div> -->
  </Modal>
</template>
<script>
import Decorate from "@/components/Decorate";
import DeployTip from "@/components/DeployTip";
export default {
  components: {
    Decorate,
    DeployTip,
  },
  data() {
    return {};
  },
  props: ["isLogModal", "socketData"],
};
</script>
<style lang="scss" scoped></style>
