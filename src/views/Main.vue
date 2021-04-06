<template>
  <div class="main-box">
    <Header />
    <transition name="fade" mode="out-in">
      <router-view />
    </transition>
  </div>
</template>

<script>
import Header from "@/components/Header.vue";
export default {
  name: "mains",
  components: {
    Header
  },
};
</script>
