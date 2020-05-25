<template>
  <el-container style="height:100%">
    <el-header style="padding:0">
      <toolbar></toolbar>
    </el-header>
    <el-container style="overflow:hidden">
      <el-aside width="210px">
        <drawer></drawer>
      </el-aside>
      <el-main style="overflow:auto;padding:10px;background:#e6e6e6">
        <repView></repView>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import drawer from "./drawer";
import repView from "./repView";
import toolbar from "./toolbar";

export default {
  components: {
    drawer,
    repView,
    toolbar
  }
};
</script>

<style lang="scss" scoped>
.el-aside {
  & > .el-menu {
    height: 100%;
    overflow: auto;
    background-color: #f5f7fa;
  }
}
</style>