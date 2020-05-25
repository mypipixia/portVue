<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="scss" scoped>
#app {
  width: 100%;
  height: 100%;
}
</style>
<script>
export default {
  mounted() {
    console.log("页面加载完毕");
  }
};
</script>
