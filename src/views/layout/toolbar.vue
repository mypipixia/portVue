<template>
  <div class="toolbar">
    <div class="toolbar_title">信息管理系统</div>
    <div class="toolbar_close">
      <i class="el-icon-minus icons"> </i> <span class="text"
            @click="loginOut">退出</span>
    </div>
    <div class="toolbar_user"
         title="用户信息"
         @click="userGo">
      <el-avatar :size="30"
                 :src="circleUrl"></el-avatar>
      <span class="userName">{{getUserInfo.username}}</span>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters("user", ["getUserInfo"]),
    circleUrl() {
      let url =
        this.getUserInfo.avatar ||
        "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png";
      return url;
    }
  },
  methods: {
    userGo() {
      this.$router.push({
        path: "/index/userInfo"
      });
    },
    loginOut() {
      this.$confirm("是否退出系统?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$router.replace({
          path: "/login"
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.toolbar {
  width: 100%;
  height: 100%;
  background-color: #409eff;
  overflow: hidden;
  line-height: 60px;
  padding: 0 20px;
  color: #ffffff;
  box-sizing: border-box;
  .toolbar_title {
    margin-left: 30px;
    font-size: 18px;
    float: left;
  }
  .toolbar_user {
    float: right;
    display: flex;
    align-items: center;
    height: 100%;
    cursor: pointer;
    .userName {
      display: inline-block;
      margin-left: 15px;
    }
  }
  .toolbar_close {
    float: right;
    padding: 0 10px;
    .text {
      cursor: pointer;
    }
    .icons {
      display: inline-block;
      margin-right: 5px;
    }
  }
}
</style>