<template>
  <div class="output"
       v-if="getRoleInfo =='*'">
    <el-card class="box-card">
      <el-button size="mini"
                 type="primary"
                 @click="add">新增</el-button>
      <div class="searchInput">
        <el-input v-model="text"
                  size="mini"
                  style="width:200px;margin-right:10px"
                  placeholder="项目名/用户名"
                  @keyup.enter.native="seach"></el-input>
        <el-button size="mini"
                   type="primary"
                   @click="seach">查 询</el-button>
      </div>
    </el-card>
    <el-card class="box-card content">
      <div class="top">
        <el-table :data="tableData"
                  border
                  style="width: 100%">
          <el-table-column type="selection"
                           width="100">
          </el-table-column>
          <el-table-column :prop="item.prop"
                           :label="item.label"
                           v-for="(item,index) in tableHeader"
                           :key="index">
          </el-table-column>

          <el-table-column align="left"
                           label="操作"
                           width="100">
            <template slot-scope="scope">
              <el-button size="mini"
                         @click="del(scope)"
                         type="danger"
                         plain>删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="bot">
        <el-pagination :page-sizes="[10, 20, 50,1000, 10000]"
                       :page-size="sizePage"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="pageLength"
                       @size-change="sizeChange"
                       :currentPage.sync='currentPage'>
        </el-pagination>
      </div>
    </el-card>

    <el-dialog title="新增"
               :visible.sync="drawer"
               width="600px">
      <span>
        <infoForm v-if="drawer"
                  :renderArr="formDesc"
                  :formData.sync="formData"
                  ref="form"></infoForm>
      </span>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="drawer = false"
                   size="small">取 消</el-button>
        <el-button type="primary"
                   @click="saveGrid"
                   size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { JD_ARR } from "@/common/consts";
export default {
  data() {
    return {
      gridData: [],
      tableShow: false,
      delGridId: "",
      sizePage: 10,
      text: "",
      pageLength: 0,
      currentPage: 1,
      JD_ARR,
      drawer: false,
      isAdd: true,
      formDesc: {
        eid: {
          type: "select",
          label: "项目名称",
          required: true,
          optionsKey: {
            label: "entryName",
            value: "eid"
          },
          options: []
        },
        userId: {
          type: "select",
          label: "用户名",
          required: true,
          optionsKey: {
            label: "username",
            value: "userId"
          },
          options: []
        }
      },
      formData: {
        eid: "",
        userId: ""
      },
      tableHeader: [
        {
          label: "项目名称",
          prop: "entryName"
        },
        {
          label: "用户名",
          prop: "username"
        }
      ],
      tableData: [],
      selId: []
    };
  },
  watch: {
    currentPage() {
      this.loadTable(false);
    }
  },
  computed: {
    ...mapGetters("user", ["getRoleInfo"])
  },
  created() {
    if (this.getRoleInfo == "*") {
      this.getAllTable();
      this.getXm();
      this.getUser();
    }
  },
  methods: {
    async getXm() {
      const result = await this.$api.xmMgrGetAllTable(this, {
        searchInfo: {}
      });
      this.formDesc.eid.options = result.result || [];
    },
    async getUser() {
      const result = await this.$api.findNotUser(this, "");
      this.formDesc.userId.options = result.result || [];
    },
    delGrid() {
      this.gridData = this.gridData.filter(item => {
        return item.year != this.delGridId;
      });
      let parm = JSON.stringify(this.gridData);
      this.formData.yearBack = parm;
      Promise.resolve(this.saveUpdate(false)).then(() => {
        this.$message.success("删除成功");
      });
    },
    async saveGrid() {
      const flag = this.$refs.form.validate();
      if (flag) {
        try {
          const result = await this.$api.xUserCreat(this, this.formData);
          this.$message.success(result.desc);
          this.drawer = false;
          this.loadTable();
          this.initFormData();
        } catch (error) {
          this.$message.warning(error.desc);
        }
      }
    },
    del(v) {
      this.$confirm("此操作将删除该信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        try {
          let id = v["row"].id;
          await this.$api.xUserDelete(this, { id });
          this.loadTable();
          this.$message.success("删除成功");
        } catch (error) {
          this.$message.error("删除失败");
        }
      });
    },
    sizeChange(v) {
      this.sizePage = v;
      this.loadTable();
    },
    loadTable(v = true) {
      v && (this.currentPage = 1);
      this.getAllTable();
    },
    async getAllTable() {
      const result = await this.$api.findTablexUser(this, {
        text: this.text,
        countPerPage: this.sizePage,
        currentPage: this.currentPage
      });
      this.pageLength = result.len;
      this.tableData = result.result;
    },
    seach() {
      this.loadTable();
    },
    initFormData() {
      this.formData = {
        eid: "",
        userId: ""
      };
    },
    add() {
      this.initFormData();
      this.drawer = true;
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
      overflow: hidden;
    }
    .bot {
      padding: 10px 0;
      float: right;
    }
  }
}
</style>
<style lang="scss">
.searchInput {
  float: right;
  width: 270px;
}
.content {
  .el-card__body {
    height: calc(100% - 20px);
  }
  .el-table {
    height: 100%;
    display: flex;
    flex-direction: column;
    .el-table__body-wrapper {
      overflow: auto;
      flex: 1;
    }
  }
}
.el-card__body {
  padding: 10px;
}
</style>