<template>
  <div class="login">
    <div class="login_content">
      <el-card class="box-card">
        <el-form ref="ruleForm"
                 class="demo-dynamic"
                 :model="form"
                 :rules="rules"
                 hide-required-asterisk>
          <el-form-item prop="mobileNo"
                        label="账号">
            <el-input placeholder="账号/电话号码"
                      v-model="form.mobileNo"></el-input>
          </el-form-item>
          <el-form-item label="密码"
                        prop="password">
            <el-input placeholder="密码"
                      @keyup.enter.native="login"
                      v-model="form.password"
                      show-password></el-input>
          </el-form-item>
        </el-form>
        <div class="login_chex">
          <el-checkbox v-model="chexObj.reacco">记住账号</el-checkbox>
          <el-checkbox v-model="chexObj.repass">记住密码</el-checkbox>
        </div>
        <div class="login_btn">
          <el-button type="primary"
                     style="width:100%"
                     @click="login">登 录</el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import Storage from "@/utils/Cache";
import { cookie_user_key } from "@/common/consts.js";

export default {
  computed: {
    ...mapState("user", {
      userInfo: state => state.userInfo
    })
  },
  data() {
    const phone = (rule, value, callback) => {
      if (!/^1[3456789]\d{9}$/.test(value)) {
        callback(new Error("请输入正确的电话号码"));
      } else {
        callback();
      }
    };
    return {
      chexObj: {
        repass: false,
        reacco: false
      },
      form: {
        password: "",
        mobileNo: ""
      },
      rules: {
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" }
        ],
        mobileNo: [
          { required: true, message: "账号不能为空", trigger: "blur" },
          { validator: phone, trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.loginInfoCookie();
    this.removeUserInfoA();
  },
  methods: {
    ...mapActions("user", ["loginTo", "removeUserInfoA"]),
    loginInfoCookie() {
      const storage = new Storage();
      let userInfo = storage.getCookie(cookie_user_key);
      this.form.password = userInfo.password || "";
      this.form.mobileNo = userInfo.mobileNo || "";
      this.chexObj.repass = userInfo.repass || false;
      this.chexObj.reacco = userInfo.reacco || false;
    },
    login() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.loginTo({
            vm: this,
            loginInfo: { ...this.form, ...this.chexObj }
          });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.login {
  background-image: url("~@/assets/images/loginBg.jpeg");
  height: 100%;
  width: 100%;
  background-size: cover;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  .box-card {
    padding: 30px 20px;
  }
  .login_content {
    width: 25%;
    min-width: 400px;
  }
  .login_chex {
    padding-left: 2px;
  }
  .login_btn {
    margin-top: 30px;
  }
}
</style>