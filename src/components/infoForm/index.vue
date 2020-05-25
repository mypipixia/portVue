<template>
  <el-form ref="form"
           :model="form">
    <el-row>
      <renderForm :renderArr="renderArr"
                  :formData="form"
                  @bindForm="bindForm"></renderForm>
    </el-row>
  </el-form>
</template>

<script>
import renderForm from "./renderForm";
export default {
  components: {
    renderForm
  },
  name: "repForm",
  props: {
    renderArr: {
      type: Object,
      default: () => {
        return {};
      }
    },
    formData: {
      type: Object,
      default: () => {
        return {};
      }
    },
    rules: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  watch: {
    formData: {
      handler(v) {
        this.form = v;
      },
      deep: true,
      immediate: true
    }
  },
  data() {
    return {
      form: {}
    };
  },
  methods: {
    bindForm(value, key) {
      this.form[key] = value;
      this.$emit("update:formData", this.form);
    },
    //重置表单
    resetForm() {
      this.$refs["form"].resetFields();
    },
    validate() {
      let flag = false;
      this.$refs.form.validate(vali => {
        flag = vali;
      });
      return flag;
    }
  }
};
</script>

<style>
</style>