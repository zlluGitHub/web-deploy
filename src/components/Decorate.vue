<template>
  <div class="spots">
    <span
      class="decorate"
      style="
        background: rgb(201, 27, 0);
        width: 51px;
        height: 51px;
        margin-top: -25.5px;
        margin-left: -25.5px;
        top: 55.6675%;
        left: 5%;
      "
    ></span>
    <span
      class="decorate"
      style="
        background: rgb(23, 90, 171);
        width: 28px;
        height: 28px;
        margin-top: -14px;
        margin-left: -14px;
        top: 10.2246%;
        left: 15%;
      "
    ></span>
    <span
      class="decorate"
      style="
        background: rgb(233, 34, 36);
        width: 37px;
        height: 37px;
        margin-top: -18.5px;
        margin-left: -18.5px;
        top: 71.9133%;
        left: 25%;
      "
    ></span>
    <span
      class="decorate"
      style="
        background: rgb(0, 62, 135);
        width: 47px;
        height: 47px;
        margin-top: -23.5px;
        margin-left: -23.5px;
        top: 22.8839%;
        left: 35%;
      "
    ></span>
    <span
      class="decorate"
      style="
        background: rgb(0, 135, 231);
        width: 31px;
        height: 31px;
        margin-top: -15.5px;
        margin-left: -15.5px;
        top: 5.09172%;
        left: 45%;
      "
    ></span>
    <span
      class="decorate"
      style="
        background: rgb(23, 90, 171);
        width: 52px;
        height: 52px;
        margin-top: -26px;
        margin-left: -26px;
        top: 32.1525%;
        left: 55%;
      "
    ></span>
    <span
      class="decorate"
      style="
        background: rgb(255, 86, 0);
        width: 29px;
        height: 29px;
        margin-top: -14.5px;
        margin-left: -14.5px;
        top: 46.8035%;
        left: 65%;
      "
    ></span>
    <span
      class="decorate"
      style="
        width: 44px;
        height: 44px;
        margin-top: -22px;
        margin-left: -22px;
        top: 97.8537%;
        left: 75%;
      "
    ></span>
    <span
      class="decorate"
      style="
        background: rgb(201, 27, 0);
        width: 43px;
        height: 43px;
        margin-top: -21.5px;
        margin-left: -21.5px;
        top: 30.7088%;
        left: 85%;
      "
    ></span>
    <span
      class="decorate"
      style="
        width: 27px;
        height: 27px;
        margin-top: -13.5px;
        margin-left: -13.5px;
        top: 7.43497%;
        left: 95%;
      "
    ></span>
    <div class="warp">
      <div class="left">
        <div class="logo">
          <i :class="icon"></i>
        </div>
        <div class="info">
          <h2>{{ title }}</h2>
          <p>{{ describe }}</p>
        </div>
      </div>
      <!-- <div class="right"> -->
        <slot></slot>
      <!-- </div> -->
    </div>
  </div>
</template>
<script>
export default {
  props: ["icon", "title", "describe"],
};
</script>
<style lang="scss" scoped>
.spots {
  padding: 30px 0;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  justify-content: center;
  .decorate {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: #4b89fc;
    position: absolute;
    left: 200px;
    opacity: 0.13;
  }
  .warp {
    width: 80%;
    display: flex;
    justify-content: space-between;
    .left {
      display: flex;
      .logo {
        width: 50px;
        height: 50px;
        background: #2d8cf0;
        border-radius: 4px;
        box-shadow: 0 10px 50px rgba(45, 140, 240, 0.4);
        color: #fff;
        font-size: 28px;
        text-align: center;
        line-height: 50px;
      }
      .info {
        margin-left: 20px;
      }
    }
  }
}
</style>
