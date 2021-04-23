<template>
  <div class="upload-index">
    <uploader
      :options="options"
      :file-status-text="statusText"
      :auto-start="false"
      class="uploader-example"
      ref="uploader"
      @file-added="onFileAdded"
      @file-success="onFileSuccess"
      @file-error="onFileError"
      @file-removed="fileRemoved"
    >
      <uploader-unsupport></uploader-unsupport>
      <uploader-drop>
        <p>Drop files here to upload or</p>
        <uploader-btn>select files</uploader-btn>
        <uploader-btn :attrs="attrs">select images</uploader-btn>
        <uploader-btn :directory="true">select folder</uploader-btn>
      </uploader-drop>
      <uploader-list></uploader-list>
    </uploader>
    <div slot="footer" class="dialog-footer">
      <span class="filetotal">共计: {{ file_total }}</span>
      <span
        type="danger"
        plain
        @click="errorDialog = true"
        v-show="controllerErrorFileDialog"
        >错误信息</span
      >
      <span @click="cancelUpload">取消上传</span>
      <span type="primary" @click="submitUpload">开始上传</span>
    </div>
  </div>
</template>

<script>
// import SimpleUploader from "vue-simple-uploader";
export default {
  components: {
    // SimpleUploader,
  },
  // props: {
  //   msg: String
  // },

  data() {
    return {
      controllerErrorFileDialog:false,
      options: {
        target: "//localhost:3000/upload",
        maxChunkRetries: 2,
        testChunks: false,
        fileParameterName: "contents",
        chunkSize: 1024 * 1024 * 1024,
        simultaneousUploads: 3,
        query: {
          type: "",
          create_time: "",
        },
        headers: {
          Authorization: token,
        },
      },
      statusText: {
        success: "上传成功",
        error: "上传失败",
        uploading: "上传中",
        paused: "暂停中",
        waiting: "等待中",
      },
      attrs: {
        accept: [],
      },
      file_total: 0, //本次文件上传的总数
      errorfilelist: [], //上传失败信息列表
    };
  },
  watch: {},
  created() {
    // this.$request
    //   .get("/swd/fileEdit/catalog", { params: { folder: "backups" } })
    //   .then((res) => {
    //     if (res.data.code === 200) {
    //       let data = res.data.data;
    //       this.loopTree(data, 0);
    //       this.treeData = data;
    //     }
    //   });
  },
  mounted() {},
  methods: {
    //添加文件到列表还未上传,每添加一个文件，就会调用一次,在这里过滤并收集文件夹中文件格式不正确信息，同时把所有文件的状态设为暂停中
    onFileAdded(file) {
      let file_type = file.name.substring(file.name.lastIndexOf(".") + 1);
      const extension = file_type === this.uploadType;
      if (!extension) {
        let obj = {
          rootname: "无",
          name: file.name,
          errorinfo: "文件不是 " + this.uploadType + " 格式",
        };
        let arr = file.relativePath.split("/");
        if (arr.length > 1) {
          obj["rootname"] = arr[0];
        }
        this.errorfilelist.push(obj);
        file.ignored = true;
      } else {
        file.pause();
      }
      this.$nextTick(() => {
        this.file_total = this.$refs["uploader"].files.length;
      });
      if (this.errorfilelist.length !== 0) {
        this.controllerErrorFileDialog = true;
      }
    },

    //每个文件传输给后端之后，返回的信息
    onFileSuccess(rootFile, file, response, chunk) {
      let res = JSON.parse(response);
      if (res.code !== 10000) {
        let obj = {
          rootname: "无",
          name: file.name,
          errorinfo: res.message,
        };
        if (rootFile.isFolder === true) {
          obj["rootname"] = rootFile.name;
        }
        this.errorfilelist.push(obj);
        this.controllerErrorFileDialog = true;
      }
    },
    // 上传错误触发，文件还未传输到后端
    onFileError(rootFile, file, response, chunk) {
      let obj = {
        rootname: "无",
        name: file.name,
        errorinfo: "文件上传失败",
      };
      if (rootFile.isFolder === true) {
        obj["rootname"] = rootFile.name;
      }
      this.errorfilelist.push(obj);
      this.controllerErrorFileDialog = true;
    },
    // 移除文件
    fileRemoved(file) {
      this.$nextTick(() => {
        this.file_total = this.$refs["uploader"].files.length;
      });
    },
    //点击开始上传按钮
    submitUpload() {
      this.$nextTick(() => {
        for (let i = 0; i < this.$refs["uploader"].files.length; i++) {
          this.$refs["uploader"].files[i].resume();
        }
      });
    },
    //关闭错误文件提示框口，知道上传对话框被关闭时才会被清空
    closeErrorDialog() {
      this.errorDialog = false;
    },
    // 上传弹框关闭
    handelClose() {
      this.clearcache();
      this.thirdDialog = false;
    },
    // 清除缓存
    clearcache() {
      this.file_total = 0;
      this.errorfilelist = [];
      this.controllerErrorFileDialog = false;
      this.$refs.uploader.uploader.cancel();
      // this.getresourceDetail();
    },
    //取消上传
    cancelUpload() {
      this.thirdDialog = false;
      this.clearcache();
    },
  },
};
</script>
<style lang="scss" scoped>
.upload-index {
 .uploader-example {
    width: 880px;
    padding: 15px;
    margin: 40px auto 0;
    font-size: 12px;
    box-shadow: 0 0 10px rgba(0, 0, 0, .4);
  }
  .uploader-example .uploader-btn {
    margin-right: 4px;
  }
  .uploader-example .uploader-list {
    max-height: 440px;
    overflow: auto;
    overflow-x: hidden;
    overflow-y: auto;
  }
}
</style>
