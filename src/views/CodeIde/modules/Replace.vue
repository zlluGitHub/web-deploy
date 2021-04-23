<template>
  <div class="replace-box">
    <div class="button-toggle">
      <i class="fa fa-caret-right"></i>
    </div>
    <div class="find-part">
      <div class="find-top">
        <div class="left">
          <input type="text" />
          <div class="matches-count">0 of 0</div>
        </div>
        <div class="right">
          <i class="fa fa-arrow-left"></i>
          <i class="fa fa-arrow-right"></i>
          <i class="fa fa-close" @click="handleClick('close')"></i>
        </div>
      </div>
      <div class="replace-bottom">
        <input type="text" />
        <i class="fa fa-exchange"></i>
      </div>
    </div>
    <div class="ming-ban" @click="handleClick('close')"></div>
  </div>
</template>

<script>
export default {
  name: "replace",
  components: {
    // Header
  },
  methods: {
    handleClick(mark) {
      this.$emit("on-click", mark);
    },
  },
};
</script>
<style lang="scss" scoped>
.replace-box {
  align-items: center;
  width: 460px;
  display: flex;
  box-shadow: 0 2px 8px #a8a8a8;
  font-size: 12px;
  padding: 10px 15px;
  padding-left: 10px;
  background: #f3f3f3;
  .button-toggle {
    display: flex;
    align-items: center;
    z-index: 100;
    i {
      // font-size: 15px;
      padding: 0 5px;
      margin-right: 5px;
      font-size: 16px;
      cursor: pointer;
      &:hover {
        color: #fe7300;
      }
    }
  }
  .find-part {
    flex: 1;
    z-index: 100;
    input {
      border: none;
      width: 280px;
      height: 22px;
      padding: 0 5px;
      outline: none;
    }
    .find-top {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .left {
        display: flex;
        align-items: center;
        .matches-count {
          margin-left: 5px;
        }
      }
      .right {
        display: flex;
        align-items: center;
        i {
          margin-left: 10px;
          cursor: pointer;
          &:hover {
            color: #fe7300;
          }
        }
      }
    }
    .replace-bottom {
      display: flex;
      align-items: center;
      margin-top: 5px;
      i {
        margin-left: 10px;
        cursor: pointer;
        &:hover {
          color: #fe7300;
        }
      }
    }
  }
  .ming-ban {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 50;
  }
}
</style>
