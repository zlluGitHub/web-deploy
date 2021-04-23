<template>
  <div class="ide-index">
    <Split v-model="split">
      <div slot="left" class="left">
        <div class="ide-hedaer">
          <i class="fa fa-codepen"></i>
          <span>项目名称</span>
        </div>
        <div class="operation-warp">
          <div>文件（12）</div>
          <div class="search">
            <i class="fa fa-search" @click="isFind = !isFind"></i>
            <i class="fa fa-plus"></i>
          </div>
        </div>
        <Tree
          :data="treeData"
          @on-select-change="handleSelectChange"
          @on-contextmenu="handleContextMenu"
        >
          <template slot="contextMenu">
            <DropdownItem @click.native="handleContextMenuEdit">编辑</DropdownItem>
            <DropdownItem @click.native="handleContextMenuDelete" style="color: #ed4014"
              >删除</DropdownItem
            >
          </template>
        </Tree>
      </div>
      <div slot="right" class="right">
        <div class="ide-hedaer">
          <!-- 保存当前文本 -->
          <Tooltip content="保存当前文本" placement="bottom">
            <i class="fa fa-save"></i>
          </Tooltip>
          <!-- 保存全部 -->
          <Tooltip content="保存全部" placement="bottom">
            <i class="fa fa-clipboard"></i>
          </Tooltip>

          <i class="fa fa-undo"></i>
          <i class="fa fa-repeat"></i>
          <!-- 行号 -->
          <Tooltip :content="showGutter ? '隐藏行号' : '显示行号'" placement="bottom">
            <i class="fa fa-outdent" @click="handleShowGutter"></i>
          </Tooltip>
          <!-- 主题 -->
          <Tooltip content="主题" placement="bottom">
            <Dropdown @on-click="handleThemeDropdown" trigger="click" class="dropdown">
              <i class="fa fa-magic"> <em class="fa fa-caret-down"></em></i>

              <DropdownMenu slot="list">
                <DropdownItem
                  v-for="(item, i) in themeArr"
                  :class="{ active: item === theme }"
                  :name="item"
                  :key="'e' + i"
                  >{{ item }}</DropdownItem
                >
              </DropdownMenu>
            </Dropdown>
          </Tooltip>
          <!-- 字体 -->
          <Tooltip content="字体大小" placement="bottom">
            <Dropdown @on-click="handleDropdown" class="dropdown" trigger="click">
              <i class="fa fa-font"> <em class="fa fa-caret-down"></em></i>
              <DropdownMenu slot="list">
                <DropdownItem
                  v-for="(item, i) in fontSizeArr"
                  :class="{ active: item === fontSize }"
                  :name="item"
                  :key="'e' + i"
                  >{{ item }}px</DropdownItem
                >
              </DropdownMenu>
            </Dropdown>
          </Tooltip>
          <!-- 换行 -->
          <Tooltip :content="isWrap ? '关闭自动换行' : '开启自动换行'" placement="bottom">
            <i class="fa fa-exchange" @click="handleWrap"></i>
          </Tooltip>
        </div>
        <ul class="file-scroll-bar">
          <li>
            <i class="fa fa-file-code-o"></i> <span>index.html</span>
            <i class="fa fa-remove"></i>
          </li>
          <li class="active">
            <i class="fa fa-file-code-o"></i> <span>index.html</span
            ><i class="fa fa-remove"></i>
          </li>
          <li>
            <i class="fa fa-file-code-o"></i> <span>index.html</span
            ><i class="fa fa-remove"></i>
          </li>
        </ul>
        <div class="content">
          <AceEditor
            ref="ace"
            v-model="content"
            @init="editorInit"
            :lang="language"
            :theme="theme"
            width="100%"
            height="600px"
            :options="{
              enableBasicAutocompletion: true,
              enableLiveAutocompletion: true,
              fontSize: fontSize,
              highlightActiveLine: true,
              enableSnippets: true,
              showLineNumbers: true,
              tabSize: 2,
              showPrintMargin: false,
              showGutter: showGutter,
            }"
            :commands="[
              {
                name: 'save',
                bindKey: { win: 'Ctrl-s', mac: 'Command-s' },
                exec: null,
                readOnly: true,
              },
            ]"
          />
          <!-- 替换 -->
          <div class="replace-warp" v-if="isFind">
            <Replace @on-click="handleReplaceOnClick" />
          </div>
        </div>
      </div>
    </Split>
  </div>
</template>

<script>
import Decorate from "@/components/Decorate";
import AceEditor from "vuejs-ace-editor";
import Replace from "./modules/Replace";
export default {
  components: {
    Decorate,
    AceEditor,
    Replace,
  },
  // props: {
  //   msg: String
  // },

  data() {
    return {
      split: 0.15,
      isWrap: false,
      fontSizeArr: [12, 13, 14, 15, 16, 17, 18, 20, 22, 24, 26, 28, 30, 32],
      showGutter: true,
      isFind: false,
      fontSize: 14,
      content: "",
      theme: "monokai", //monokai、mono_industrial
      themeArr: [
          "monokai",
        // "ambiance",
        // "chaos",
        "chrome",
        // "clouds_midnight",
        // "clouds",
        // "cobalt",
        // "crimson_editor",
        // "dawn",
        // "dreamweaver",
        "eclipse",
        "github",
        // "idle_fingers",
        // "iplastic",
        // "katzenmilch",
        // "kr_theme",
        // "kuroir",
        // "merbivore_soft",
        // "merbivore",
        // "mono_industrial",
      
        // "pastel_on_dark",
        // "solarized_dark",
        // "solarized_light",
        // "sqlserver",
        // "terminal",
        // "textmate",
        // "tomorrow_night_blue",
        // "tomorrow_night_bright",
        // "tomorrow_night_eighties",
        // "tomorrow_night",
        // "tomorrow",
        // "twilight",
        // "vibrant_ink",
        // "xcode",
      ],
      language: "json", //json、java、javascript、html、scala、sql
      languageChange: {
        json: "json",
        js: "javascript",
        html: "html",
        vue: "html",
        scala: "scala",
        sql: "sql",
        css: "css",
        sql: "java",
      },

      treeData: [],
    };
  },
  watch: {},
  created() {

    // backups
    this.$request
      .get("/swd/fileEdit/catalog", { params: { folder: "www" } })
      .then((res) => {
        if (res.data.code === 200) {
          let data = res.data.data;
          this.loopTree(data, 0);
          this.treeData = data;
        }
      });
  },
  mounted() {},
  methods: {
    // 目录点击事件
    handleSelectChange(e) {
      console.log(e[0]);
      if (e[0] && e[0].type === "file") {
        let title = e[0].title;
        this.language = this.languageChange[
          title.slice(title.lastIndexOf(".") + 1, title.length)
        ];
        this.$request
          .get("/swd/fileEdit/content", { params: { filePath: e[0].path } })
          .then((res) => {
            if (res.data.code === 200) {
              this.content = res.data.data;
            }
          });
      } else {
        let loopTree = (data) => {
          data.forEach((ele) => {
            if (ele.title === e[0].title) {
              ele.expand = !ele.expand;
            } else if (ele.children && ele.children.length > 0) {
              loopTree(ele.children);
            }
          });
        };
        if (e[0]) loopTree(this.treeData);
      }
    },
    handleContextMenu(data) {
      this.contextData = data;
    },
    handleContextMenuEdit() {
      this.$Message.info("Click edit of" + this.contextData.title);
    },
    handleContextMenuDelete() {
      this.$Message.info("Click delete of" + this.contextData.title);
    },

    //  自动换行
    handleWrap() {
      this.isWrap = !this.isWrap;
      this.$refs.ace.editor.getSession().setUseWrapMode(this.isWrap);
    },

    // 显隐行号
    handleShowGutter() {
      this.showGutter = !this.showGutter;
    },
    // 设置字体大小
    handleDropdown(size) {
      this.fontSize = size;
    },
    // 主题切换
    handleThemeDropdown(theme) {
      this.theme = theme;
    },

    // 替换事件
    handleReplaceOnClick(mark) {
      if (mark === "close") {
        this.isFind = !this.isFind;
      }
    },

    // 遍历树结构
    loopTree(data, deep) {
      data.forEach((ele) => {
        // ele.deep = deep;
        ele.expand = deep <= 0 ? true : false;
        ele.render = (h, { root, node, data }) => {
          let icon = "fa fa-folder";
          if (data.type === "file") {
            icon = "fa fa-file-code-o";
          } else {
            icon = ele.expand ? "fa fa-folder-open" : "fa fa-folder";
          }

          return h("span", [
            h("i", {
              class: [icon, "tree-icon"],
              // style: {
              //   marginRight: "8px",
              // },
            }),
            h("span", data.title),
          ]);
        };
        if (ele.children && ele.children.length > 0) {
          this.loopTree(ele.children, deep + 1);
        }
      });
    },

    editorInit: function () {
      require("vuejs-ace-editor/node_modules/brace/ext/language_tools"); //language extension prerequsite...
      require("vuejs-ace-editor/node_modules/brace/mode/html"); //language
      require("vuejs-ace-editor/node_modules/brace/mode/javascript");
      require("vuejs-ace-editor/node_modules/brace/mode/scala");
      require("vuejs-ace-editor/node_modules/brace/mode/sql");
      require("vuejs-ace-editor/node_modules/brace/mode/css");
      require("vuejs-ace-editor/node_modules/brace/mode/json");
      // require("brace/mode/less");
      require("vuejs-ace-editor/node_modules/brace/theme/monokai");
      require("vuejs-ace-editor/node_modules/brace/theme/chrome");
      require("vuejs-ace-editor/node_modules/brace/theme/eclipse");
      require("vuejs-ace-editor/node_modules/brace/theme/github");
      require("vuejs-ace-editor/node_modules/brace/theme/mono_industrial");
      require("vuejs-ace-editor/node_modules/brace/snippets/javascript"); //snippet
    },
  },
};
</script>
<style lang="scss" scoped>
.ide-index {
  background: #fff;
  height: 100%;
  .ide-hedaer {
    background: #efefef;
    height: 40px;
    display: flex;
    align-items: center;
    padding: 0 15px;
    i {
      margin-right: 10px;
    }
  }
  .left {
    /deep/ .ivu-tree {
      padding: 20px;
      ul {
        li {
          margin: 0;
        }
      }
    }
    .ide-hedaer {
      font-size: 17px;
    }
    .operation-warp {
      display: flex;
      justify-content: space-between;
      height: 35px;
      padding: 0 15px;
      align-items: center;
      border-bottom: 1px solid #eee;
      i {
        margin-left: 10px;
        cursor: pointer;
        &:hover {
          color: #fe7300;
        }
      }
    }
  }
  .right {
    .ide-hedaer {
      i {
        margin: 0 10px;
        cursor: pointer;
        &:hover {
          color: #fe7300;
        }
      }
    }
    .dropdown {
      /deep/ .ivu-dropdown-item {
        &:hover {
          background: #fe720018;
          color: #fe7300;
        }
      }
      .active {
        color: #fe7300;
      }
      .fa-caret-down {
        margin-left: 3px;
      }
    }
    .file-scroll-bar {
      display: flex;
      height: 35px;
      padding: 0 20px;
      background: #f8f8f8;
      li {
        display: flex;
        align-items: center;
        padding: 0 15px;
        span {
          cursor: pointer;
        }
        i {
          margin-right: 5px;
        }
        .fa-remove {
          margin-left: 10px;
          cursor: pointer;
        }
        &.active {
          background: #fff;
        }
      }
    }
    .content {
      // padding-top: 20px;
      background: #fff;
      position: relative;
      .replace-warp {
        position: absolute;
        top: 5px;
        right: 50px;
        z-index: 100;
      }
    }
  }
  /deep/ .tree-icon {
    margin-right: 8px;
  }
  /deep/ .ivu-split-trigger-bar-con.vertical {
    display: none;
  }
  /deep/ .ivu-split-trigger-vertical {
    background: transparent;
    border-right: 0;
  }
}
</style>
