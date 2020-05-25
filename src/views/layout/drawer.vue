<template>
  <el-menu class="el-menu-vertical-demo"
           :default-active='getSelDropList'
           @select="select">

    <el-submenu v-if="pandun(400)">
      <template slot="title">
        <i class="el-icon-location"></i>
        <span>图表</span>
      </template>
      <el-menu-item index="/index/echarts"><i class="el-icon-s-management"></i>图表A</el-menu-item>
      <el-menu-item index="/index/echarts2"><i class="el-icon-s-management"></i>图表B</el-menu-item>
      <el-menu-item index="/index/echarts3"><i class="el-icon-s-management"></i>图表C</el-menu-item>
    </el-submenu>
    <el-menu-item index="/index/xmMgr"
                  v-if="getRoleInfo == '*'"><i class="el-icon-s-management"></i>项目管理</el-menu-item>
    <el-menu-item index="/index/xUser"
                  v-if="getRoleInfo == '*'"><i class="el-icon-s-check"></i>项目关联</el-menu-item>
    <el-menu-item index="/index/output"
                  v-if="pandun(100)"><i class="el-icon-s-data"></i>产值管理</el-menu-item>
    <el-menu-item index="/index/turnover"
                  v-if="pandun(200)"><i class="el-icon-s-data"></i>营业额</el-menu-item>
    <el-menu-item index="/index/profit"
                  v-if="pandun(300)"><i class="el-icon-s-data"></i>利润管理</el-menu-item>
    <el-menu-item index="/index/lj"
                  v-if="pandun(500)"><i class="el-icon-s-data"></i>两金</el-menu-item>
    <el-menu-item index="/index/role"
                  v-if="getRoleInfo == '*'"><i class="el-icon-s-check"></i>权限管理</el-menu-item>
    <el-menu-item index="/index/user"
                  v-if="getRoleInfo == '*'"><i class="el-icon-user"></i>用户管理</el-menu-item>
  </el-menu>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters("common", ["getSelDropList"]),
    ...mapGetters("user", ["getRoleInfo"])
  },
  methods: {
    select(v) {
      this.$router.push({
        path: v
      });
    },
    pandun(v) {
      if (this.getRoleInfo == "*") {
        return true;
      } else {
        let flag = this.getRoleInfo.includes(v);
        return flag;
      }
    }
  }
};
</script>

<style lang="scss">
.el-menu-item {
  background-color: #f5f7fa;
  &:hover,
  &:active {
    background-color: white;
  }
}
</style>