<template>
  <el-drawer v-on="$listeners"
             :visible.sync="drawer"
             v-bind="$attrs">
    <div class="demo-drawer__content">
      <infoForm v-on="$listeners"
                v-bind="$attrs"
                v-if="drawer"
                ref="form"></infoForm>
      <div class="demo-drawer__footer">
        <el-button @click="cen"
                   title="取 消">取 消</el-button>
        <el-button title="重 置"
                   @click="resetForm">重 置</el-button>
        <el-button type="primary"
                   @click="sub"
                   title="提 交">提 交</el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    visible: {
      handler(v) {
        this.drawer = v;
      },
      immediate: true
    },
    drawer(v) {
      this.$emit("update:visible", v);
    }
  },
  data() {
    return {
      drawer: false
    };
  },
  methods: {
    cen() {
      this.drawer = false;
      this.$emit("close");
    },
    init() {
      this.$emit("init");
    },
    sub() {
      this.$refs["form"].validate() && this.$emit("sub");
    },
    resetForm() {
      this.$nextTick(() => {
        this.$refs["form"].resetForm();
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.demo-drawer__content {
  padding: 0 10px;
  text-align: right;
}
.demo-drawer__footer {
  position: absolute;
  bottom: 0;
  padding: 10px;
  background-color: #f3f3f5;
  left: 0;
  overflow: auto;
  right: 0;
}
</style>
<style lang="scss">
.el-drawer__header {
  background-color: #f3f3f5;
  padding: 20px;
  margin-bottom: 20px;
}
.el-drawer__body {
  overflow: auto;
  margin-bottom: 60px;
}
</style>