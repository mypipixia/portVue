<template>
  <div class="role"
       v-if="getRoleInfo =='*'">
    <el-card class="box-card">
      <el-button size="mini"
                 type="primary"
                 @click="add">新增</el-button>
      <el-button size="mini"
                 type="primary"
                 :disabled="!selId"
                 @click="setAuthArr">权限分配</el-button>
      <el-button size="mini"
                 type="danger"
                 plain
                 :disabled="!selId"
                 @click="delRole">删除</el-button>
      <el-button size="mini"
                 type="warning"
                 plain
                 :disabled="!selId"
                 @click="changeStatus(status)">{{status == 0?'启用':'停用'}}</el-button>
    </el-card>
    <div class="role_content">
      <div class="role_left">
        <el-tree :data="leftData"
                 ref="roleLeft"
                 default-expand-all
                 highlight-current
                 node-key="rid"
                 @node-click="nodeClick	"
                 :props="defaultProps2">

          <span class="custom-tree-node"
                :class="{'custom-tree-node-del':!data.status}"
                slot-scope="{ data }">
            {{data.rname}}
          </span>

        </el-tree>
      </div>
      <div class="role_right">
        <el-tree :data="rightData"
                 show-checkbox
                 ref="roleIndex"
                 check-strictly
                 default-expanded-keys="['*']"
                 node-key="roleIndex"
                 check-on-click-node
                 :expand-on-click-node="false"
                 :props="defaultProps"></el-tree>
      </div>

    </div>
    <el-dialog title="新增"
               :visible.sync="dialogVisible"
               width="500px">
      <infoForm :renderArr="formDesc"
                :formData.sync="formData"
                ref="form"></infoForm>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="addSure">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      dataCheck: ["*"],
      selId: "",
      status: 0,
      formData: {
        rname: "",
        sort: ""
      },
      formDesc: {
        rname: {
          type: "input",
          label: "角色名称",
          required: true
        },
        sort: {
          type: "input",
          label: "排序号",
          required: true,
          ruleType: "num"
        }
      },
      dialogVisible: false,
      rightData: [],
      leftData: [],
      defaultProps: {
        children: "children",
        label: "authName"
      },
      defaultProps2: {
        children: "children",
        label: "rname"
      }
    };
  },
  computed: {
    ...mapGetters("user", ["getRoleInfo"])
  },
  mounted() {
    if (this.getRoleInfo == "*") {
      this.findAuth();
      this.roleFind();
    }
  },
  methods: {
    async delRole() {
      this.$confirm("是否删除角色", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        try {
          const result = await this.$api.delRole(this, { rid: this.selId });
          this.roleFind();
          this.$message.success(result.desc);
        } catch (error) {
          this.$message.error(error.desc);
        }
      });
    },
    //改变status
    async changeStatus(v) {
      let status = v == 0 ? 1 : 0;
      try {
        let result = await this.$api.changeStatus(this, {
          status,
          rid: this.selId
        });
        this.roleFind();
        this.$message.success(result.desc);
      } catch (error) {
        this.$message.error(error);
      }
    },
    async addSure() {
      let flag = this.$refs["form"].validate();
      if (flag) {
        try {
          const result = await this.$api.roleCreate(this, {
            ...this.formData,
            status: 1,
            authArr: ""
          });
          this.$message.success(result.desc);
          this.dialogVisible = false;
          this.roleFind();
        } catch (error) {
          this.$message.error(error);
        }
      }
    },
    add() {
      this.dialogVisible = true;
    },
    nodeClick(v) {
      this.selId = v["rid"];
      this.status = v["status"];
      if (v["authArr"] == "*") {
        this.$refs.roleIndex.setCheckedKeys(this.dataCheck, false);
      } else {
        let data;
        if (v.authArr) {
          data = v.authArr.split(",");
        } else {
          data = [];
        }
        this.$refs.roleIndex.setCheckedKeys(data, false);
      }
    },
    //角色树查找
    async roleFind() {
      const result = await this.$api.roleFind(this);
      this.leftData = [
        {
          rid: 0,
          rname: "角色树",
          status: 1,
          children: result.result
        }
      ];
      this.$nextTick(() => {
        this.$refs.roleLeft.setCurrentKey(this.selId);
      });
    },
    //角色权限分配
    async setAuthArr() {
      this.$confirm("是否确认分配权限", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info"
      }).then(async () => {
        let data = this.$refs.roleIndex.getCheckedKeys();
        let flag = data.includes("*");
        let parm = {
          authArr: "",
          rid: this.selId
        };
        if (flag) {
          parm.authArr = "*";
        } else {
          parm.authArr = data.join(",");
        }
        try {
          const result = await this.$api.setAuthArr(this, parm);
          this.$message.success(result.desc);
          this.roleFind();
        } catch (error) {
          this.$message.error(error);
        }
      });
    },
    getTreeData(aid = 0, value) {
      let arr = [];
      value.forEach(item => {
        if (item.pid == aid) {
          let list = this.getTreeData(item.aid, value);
          item.children = list;
          arr.push(item);
        }
      });
      return arr;
    },
    async findAuth() {
      const result = await this.$api.authFind(this);
      let data = this.getTreeData(0, result.result);
      this.rightData = [
        {
          aid: "*",
          authName: "权限树",
          children: data,
          roleIndex: "*"
        }
      ];
      result.result.forEach(item => {
        this.dataCheck.push(item.roleIndex);
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.role {
  height: 100%;
  width: 100%;
  .custom-tree-node {
    font-size: 14px;
    color: #606266;
  }
  .custom-tree-node-del {
    text-decoration: line-through;
    color: red;
  }
  .role_content {
    height: calc(100% - 60px);
    width: 100%;
    display: flex;
    margin-top: 10px;
    & > div {
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      background: #ffffff;
    }
    .role_title {
      font-size: 14px;
      padding: 10px;
      text-align: center;
      color: #303133;
    }
    .role_left {
      width: 200px;
      height: 100%;
      padding: 10px;
      box-sizing: border-box;
      overflow: auto;
      margin-right: 10px;
    }
    .role_right {
      flex: 1;
      padding: 10px;
      height: 100%;
      box-sizing: border-box;
      overflow: auto;
    }
  }
}
</style>
<style lang="scss">
.el-card__body {
  padding: 10px;
}
</style>