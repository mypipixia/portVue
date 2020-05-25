<template>
  <div class="userInfo">
    <div class='box-card-img'>
      <el-upload class="avatar-uploader"
                 :show-file-list="false"
                 :data='{
                    name: new Date().getTime(),
                    userId: getUserInfo.userId
                 }'
                 :action="apiUrl+'/user/upload'"
                 :headers="{Authorization:getToken}"
                 :before-upload="beforeAvatarUpload"
                 :on-success="handleSuccess"
                 :on-error="handleError">
        <el-avatar :src="imageUrl"
                   :size="100"></el-avatar>
        <div style="font-size:12px">只能上传图片，且不超过2M</div>
      </el-upload>
    </div>
    <!-- <img src="localhost:3000/upload/1571904219891.jpg" /> -->
    <el-card class="box-card">
      <infoForm :renderArr="formDesc"
                ref="repForm"
                :formData.sync="formData"></infoForm>
      <el-button style="width:100%;margin-top:50px"
                 type="primary"
                 @click="saveInfo">保存</el-button>
    </el-card>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import _ from "lodash";
export default {
  data() {
    return {
      apiUrl: window.apiUrl,
      formData: {
        username: "",
        password: ""
      },
      formDesc: {
        username: {
          type: "input",
          label: "用户名",
          required: true
        },
        password: {
          type: "input",
          label: "密码"
        }
      },
      username: "",
      password: "",
      imageUrl:
        "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
    };
  },
  mounted() {
    this.formData.username = this.getUserInfo.username;
    this.imageUrl =
      this.getUserInfo.avatar ||
      "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png";
  },
  computed: {
    ...mapGetters("user", ["getToken", "getUserInfo"])
  },
  methods: {
    ...mapMutations("user", ["saveUserInfo"]),
    async saveInfo() {
      try {
        let parm = { ...this.formData, userId: this.getUserInfo.userId };
        const result = await this.$api.updateUser(this, parm);
        let data = _.cloneDeep(this.getUserInfo);
        data.username = this.formData.username;
        this.saveUserInfo(data);
        this.$message.success(result.desc);
      } catch (error) {
        this.$message.error(error.desc);
      }
    },
    handleSuccess(v) {
      this.$message.success(v.desc);
      let data = _.cloneDeep(this.getUserInfo);
      data.avatar = v.url;
      this.saveUserInfo(data);
      this.imageUrl = v.url;
    },
    handleError() {
      this.$message.error("上传失败,请重试");
    },
    beforeAvatarUpload(file) {
      const isJPG =
        file.type === "image/jpeg" ||
        file.type === "image/gif" ||
        file.type === "image/png" ||
        file.type === "image/jpg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像只能是图片!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    }
  }
};
</script>

<style lang="scss" scoped>
.userInfo {
  height: 100%;
  width: 100%;
  padding-top: 50px;
  box-sizing: border-box;
  position: relative;
  .box-card-img {
    position: absolute;
    top: -4px;
    text-align: center;
    left: 50%;
    color: #909399;
    transform: translateX(-50%);
  }
  .box-card {
    padding: 70px 50px;
    width: 400px;
    margin: 0 auto;
    box-sizing: border-box;
    height: 450px;
  }
}
</style>