<template>
  <div class="output"
       v-if="getRoleInfo =='*'">
    <el-card class="box-card">
      <el-button size="mini"
                 type="primary"
                 @click="add">新增</el-button>
      <el-select v-model="roleKind"
                 placeholder="角色类别"
                 size="mini"
                 @change="userkindChange"
                 style="margin-left:10px">
        <el-option label="全部"
                   value=""></el-option>
        <el-option v-for="item in options"
                   :key="item.rid"
                   :label="item.rname"
                   :value="item.rid">
        </el-option>
      </el-select>
      <div class="searchInput">
        <el-input v-model="username"
                  size="mini"
                  style="width:200px;margin-right:10px"
                  placeholder="用户名"
                  @keyup.enter.native="seach"></el-input>
        <el-button size="mini"
                   type="primary"
                   @click="seach">查 询</el-button>
      </div>

    </el-card>
    <el-card class="box-card content">
      <div class="top">
        <el-table :data="tableData"
                  stripe
                  style="width: 100%">
          <el-table-column :prop="item.prop"
                           :label="item.label"
                           v-for="(item,index) in tableHeader"
                           :key="index">
          </el-table-column>
          <el-table-column label="操作"
                           fixed="right"
                           width="200">
            <template slot-scope="scope">
              <el-button size="mini"
                         type="danger"
                         @click="handleDelete(scope.row)">删除</el-button>
              <el-button size="mini"
                         @click="changeUser(scope.row)">修改角色</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="bot">
        <el-pagination :page-sizes="[10, 20, 50, 100]"
                       :page-size="10"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="pageLength"
                       @size-change="sizeChange"
                       :currentPage.sync='currentPage'>
        </el-pagination>
      </div>
    </el-card>
    <el-dialog title="角色修改"
               :visible.sync="dialogVisible"
               width="300px">
      <el-select v-model="ChangeKind"
                 placeholder="角色类别"
                 size="small"
                 style="margin-left:10px;width:240px">
        <el-option v-for="item in options"
                   :key="item.rid"
                   :label="item.rname"
                   :value="item.rid">
        </el-option>
      </el-select>
      <span slot="footer"
            class="dialog-footer">
        <el-button type="primary"
                   size="mini"
                   @click="addSaveUserChange">保 存</el-button>
      </span>
    </el-dialog>

    <modal :title="isAdd?'新增':'编辑'"
           :visible.sync="drawer"
           size="50%"
           :renderArr="formDesc"
           ref="repForm"
           @sub="sub"
           :formData.sync="formData"></modal>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      selID: "",
      ChangeKind: "",
      dialogVisible: false,
      username: "",
      sizePage: 10,
      currentPage: 1,
      roleKind: "",
      pageLength: 0,
      options: [],
      drawer: false,
      isAdd: true,
      formData: {
        username: "",
        password: "",
        mobileNo: "",
        rid: ""
      },
      formDesc: {
        username: {
          type: "input",
          label: "用户名",
          required: true
        },
        password: {
          type: "input",
          label: "密码",
          required: true
        },
        mobileNo: {
          type: "input",
          label: "手机号",
          required: true,
          ruleType: "phone"
        },
        rid: {
          type: "select",
          label: "角色",
          required: true,
          optionsKey: {
            label: "rname",
            value: "rid"
          },
          options: []
        }
      },
      tableHeader: [
        {
          label: "用户名",
          prop: "username"
        },
        {
          label: "用户账号",
          prop: "mobileNo"
        },
        {
          label: "角色",
          prop: "rname"
        }
      ],
      tableData: []
    };
  },
  watch: {
    currentPage() {
      this.loadTable(false);
    },
    drawer(v) {
      !v && this.initFormInfo();
    }
  },
  computed: {
    ...mapGetters("user", ["getRoleInfo"])
  },
  created() {
    if (this.getRoleInfo == "*") {
      this.getAllTable();
    }
  },
  methods: {
    changeUser(v) {
      this.ChangeKind = v.rid;
      this.selID = v.userId;
      this.dialogVisible = true;
    },
    async addSaveUserChange() {
      try {
        await this.$api.changeUserInfo(this, {
          rid: this.ChangeKind,
          userId: this.selID
        });
        this.$message.success("修改成功");
        this.dialogVisible = false;
        this.loadTable(false);
      } catch (_) {
        this.$message.warning("修改失败，请重试");
      }
    },
    seach() {
      this.loadTable();
    },
    //刷新grid
    loadTable(v = true) {
      let parm = { username: this.username, rid: this.roleKind };
      v && (this.currentPage = 1);
      this.getAllTable(parm);
    },
    //编辑赋值
    //初始化
    initFormInfo() {
      this.formData = {
        username: "",
        password: "",
        mobileNo: "",
        rid: ""
      };
    },
    handleDelete(v) {
      this.$confirm("此操作将删除该账号, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        await this.$api.delUser(this, { id: v.userId });
        this.$message({
          type: "success",
          message: "删除成功!"
        });
        this.loadTable();
      });
    },
    async sub() {
      try {
        const result = await this.$api.registUser(this, {
          ...this.formData,
          avatar: ""
        });
        this.drawer = false;
        this.loadTable();
        this.$message.success(result.desc);
      } catch (error) {
        this.$message.error(error.desc);
      }
    },
    sizeChange(v) {
      this.sizePage = v;
      this.loadTable();
    },
    add() {
      this.isAdd = true;
      this.drawer = true;
    },
    //获取用户信息
    async getAllTable(parm = {}) {
      const result = await this.$api.getAllTable(this, {
        searchInfo: parm,
        countPerPage: this.sizePage,
        currentPage: this.currentPage
      });
      this.options = result.roleArr;
      this.formDesc.rid.options = result.roleArr.filter(item => {
        return item.status == 1;
      });
      let tableData = [];
      result.result.forEach(item => {
        let rname = result.roleArr.find(s => {
          return item.rid == s.rid;
        }).rname;
        tableData.push({
          ...item,
          rname
        });
      });
      this.tableData = tableData;
      this.pageLength = result.len;
    },
    userkindChange() {
      this.loadTable();
    }
  }
};
</script>

<style lang="scss" scoped>
.output {
  height: 100%;
  .content {
    width: 100%;
    overflow: auto;
    height: calc(100% - 65px);
    margin-top: 10px;
    .top {
      height: calc(100% - 45px);
    }
    .bot {
      padding: 10px 0;
      float: right;
    }
  }
}
</style>
<style lang="scss">
.content {
  .el-card__body {
    height: calc(100% - 20px);
  }
  .el-table {
    height: 100%;
    .el-table__body-wrapper {
      height: calc(100% - 60px);
    }
  }
}
.searchInput {
  float: right;
  width: 270px;
}
.el-card__body {
  padding: 10px;
}
</style>