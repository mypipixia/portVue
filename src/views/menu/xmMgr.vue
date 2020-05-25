<template>
  <div class="output"
       v-if="getRoleInfo == '*'">
    <el-card class="box-card">
      <el-button size="mini"
                 type="primary"
                 @click="add">新增</el-button>
      <el-button size="mini"
                 type="danger"
                 plain
                 @click="del"
                 :disabled="!selId.length">删除</el-button>
      <div class="searchInput">
        <el-input v-model="searchInfo.entryName"
                  size="mini"
                  style="width:200px;margin-right:10px"
                  placeholder="项目名"
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
                  v-loading="load.tableLoad"
                  style="width: 100%"
                  @selection-change="handleSelectionChange">
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
                           width="150">
            <template slot-scope="scope">
              <el-button size="small"
                         @click="edit(scope)">编辑</el-button>
              <el-button size="small"
                         @click="set(scope)">设置</el-button>
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
    <el-dialog :title="isAdd?'新增':'编辑'"
               :visible.sync="drawer"
               class="xmInfo-dio"
               top="40px"
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
                   @click="saveDxianMu"
                   :loading="load.gridAdd"
                   size="small">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog :title="isAdd?'新增':'编辑'"
               :visible.sync="GridDrawer"
               class="xmInfo-dio"
               top="40px"
               width="600px">
      <span>
        <infoForm v-if="GridDrawer"
                  :renderArr="GridDesc"
                  :formData.sync="GridData"
                  ref="gridFrom"></infoForm>
      </span>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="GridDrawer = false"
                   size="small">取 消</el-button>
        <el-button type="primary"
                   @click="saveGrid"
                   :loading="load.gridAdd"
                   size="small">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="季度信息设置"
               :visible.sync="jdSetShow"
               class="xmInfo-dio"
               width="1000px">
      <el-button type="primary"
                 size="mini"
                 style="margin-bottom:10px"
                 @click="addJdInfo">新增</el-button>
      <el-table :data="jdTable"
                border
                v-loading="load.jd"
                :height="300"
                style="width: 100%">
        <el-table-column :prop="item.prop"
                         :label="item.label"
                         v-for="(item,index) in jdInfoHeaer"
                         :key="index">
        </el-table-column>
        <el-table-column label="操作"
                         width="150px">
          <template slot-scope="scope">
            <el-button size="mini"
                       @click="jdEdit(scope.row)">编辑</el-button>
            <el-button size="mini"
                       @click="jdDetele(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog :title="isAdd?'新增':'编辑'"
                 :visible.sync="jdAddDio"
                 append-to-body
                 top="40px"
                 class="xmInfo-dio"
                 width="600px">
        <span>
          <infoForm v-if="jdAddDio"
                    :renderArr="jdGridDesc"
                    :formData.sync="jdGridData"
                    ref="gridFromJd"></infoForm>
        </span>
        <span slot="footer"
              class="dialog-footer">
          <el-button @click="jdAddDio = false"
                     size="small">取 消</el-button>
          <el-button type="primary"
                     @click="saveJdGrid"
                     :loading="load.jdAdd"
                     size="small">确 定</el-button>
        </span>
      </el-dialog>
    </el-dialog>
    <infoDio v-model="tableShow"
             :defaultEid="eid"
             :drawerTitle="drawerTitle"></infoDio>
    <!-- <el-drawer :title="drawerTitle"
               :visible.sync="tableShow"
               :wrapperClosable="false"
               :modal-append-to-body="false"
               size="900px">
      <div style="padding:0 10px">
        <el-card>
          <el-button size="mini"
                     type="primary"
                     @click="addGrid">新增</el-button>
          <el-button size="mini"
                     type="danger"
                     plain
                     @click="delGrid"
                     :disabled="!delGridId">删除</el-button>
        </el-card>
        <el-table :data="gridData"
                  border
                  v-loading="load.info"
                  highlight-current-row
                  @row-click="rowClick">
          <el-table-column v-for="(item,index) in GridTable"
                           :key="index"
                           :prop="item.prop"
                           :width="item.width"
                           :sortable="item.sortable"
                           :label="item.label"></el-table-column>
          <el-table-column label="操作"
                           fixed="right"
                           width="150px">
            <template slot-scope="scope">
              <el-button size="mini"
                         @click="gridEdit(scope.row)">编辑</el-button>
              <el-button size="mini"
                         @click="setingJd(scope.row)">设置</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-drawer> -->
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { JD_ARR } from "@/common/consts";
import infoDio from "./pubilc/infoDio";
export default {
  data() {
    return {
      jdInfo: {
        jd: ""
      },
      loadjdAdd: false,
      jdAddDio: false,
      load: {
        jd: false,
        jdAdd: false,
        info: false,
        gridAdd: false,
        tableLoad: false
      },
      jdTable: [],
      jdSetShow: false,
      eid: "",
      gridInfoId: 0,
      GridDrawer: false,
      gridData: [],
      tableShow: false,
      delGridId: "",
      sizePage: 10,
      searchInfo: {
        entryName: ""
      },
      pageLength: 0,
      currentPage: 1,
      JD_ARR,
      drawer: false,
      drawerTitle: "",
      isAdd: true,
      jdGridDesc: {
        jd: {
          type: "select",
          label: "季度",
          optionsKey: {
            label: "label",
            value: "label"
          },
          disabled: false,
          options: JD_ARR,
          required: true
        },
        jdNextOutPut: {
          type: "input",
          label: "下季度计划产值",
          required: false
        },
        jdLowerOutPut: {
          type: "input",
          label: "公司下发下季度产值",
          required: false
        },
        turnoverNextOutPut: {
          type: "input",
          label: "下季度计划营业额",
          required: false
        },
        turnoverLowerOutPut: {
          type: "input",
          label: "公司下发下季度营业额",
          required: false
        },
        proNextOutPut: {
          type: "input",
          label: "下季度计划利润",
          required: false
        },
        proLowerOutPut: {
          type: "input",
          label: "公司下发下季度利润",
          required: false
        }
      },
      jdGridData: {
        jd: "",
        jdNextOutPut: "",
        jdLowerOutPut: "",
        turnoverNextOutPut: "",
        turnoverLowerOutPut: "",
        proNextOutPut: "",
        proLowerOutPut: ""
      },
      GridDesc: {
        year: {
          type: "date",
          label: "年度",
          required: true,
          prop: {
            valueFormat: "yyyy",
            type: "year",
            disabled: false
          }
        },
        yearPlanOutPut: {
          type: "input",
          label: "本年计划完成产值",
          required: true,
          ruleType: "num"
        },
        yearIndexOutPut: {
          type: "input",
          label: "本年度指标",
          required: false,
          ruleType: "num"
        },
        nowYearPlanTurnover: {
          type: "input",
          label: "本年度计划营业额",
          required: true,
          ruleType: "num"
        },
        nowYearLowerTurnover: {
          type: "input",
          label: "公司下发本年营业额",
          required: false,
          ruleType: "num"
        },
        nowYearPlanPro: {
          type: "input",
          label: "本年度计划利润",
          required: true,
          ruleType: "num"
        },
        nowYearLowerPro: {
          type: "input",
          label: "公司下发本年利润",
          required: false,
          ruleType: "num"
        }
      },
      GridData: {
        year: "",
        yearPlanOutPut: "",
        yearIndexOutPut: "",
        nowYearPlanTurnover: "",
        nowYearLowerTurnover: "",
        nowYearPlanPro: "",
        nowYearLowerPro: ""
      },
      formDesc: {
        entryName: {
          type: "input",
          label: "项目名称",
          required: true
        },
        contract: {
          type: "input",
          label: "合同额",
          required: true
        }
      },
      formData: {
        entryName: "",
        contract: ""
      },
      tableHeader: [
        {
          label: "项目名称",
          prop: "entryName"
        },
        {
          label: "合同额",
          prop: "contract"
        }
      ],
      jdInfoHeaer: [
        {
          label: "季度",
          prop: "jd"
        },
        {
          label: "下季度计划产值",
          prop: "jdNextOutPut"
        },
        {
          label: "公司下发下季度产值",
          prop: "jdLowerOutPut"
        },
        {
          label: "下季度计划营业额",
          prop: "turnoverNextOutPut"
        },
        {
          label: "公司下发下季度营业额",
          prop: "turnoverLowerOutPut"
        },
        {
          label: "下季度计划利润",
          prop: "proNextOutPut"
        },
        {
          label: "公司下发下季度利润",
          prop: "proLowerOutPut"
        }
      ],
      tableData: [],
      selId: [],
      infoId: "",
      jdId: ""
    };
  },
  components: {
    infoDio
  },
  watch: {
    tableShow(v) {
      if (!v) {
        this.load.info = v;
      }
    },
    jdSetShow(v) {
      if (!v) {
        this.jdTable = [];
      }
    },
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
    }
  },
  methods: {
    jdEdit(row) {
      this.initJdInfo();
      this.jdGridDesc.jd.disabled = true;
      let {
        id,
        jd,
        jdNextOutPut,
        jdLowerOutPut,
        turnoverNextOutPut,
        turnoverLowerOutPut,
        proNextOutPut,
        proLowerOutPut
      } = row;
      this.jdId = id;
      this.jdGridData.jd = jd;
      this.jdGridData.jdNextOutPut = jdNextOutPut;
      this.jdGridData.jdLowerOutPut = jdLowerOutPut;
      this.jdGridData.turnoverNextOutPut = turnoverNextOutPut;
      this.jdGridData.turnoverLowerOutPut = turnoverLowerOutPut;
      this.jdGridData.proNextOutPut = proNextOutPut;
      this.jdGridData.proLowerOutPut = proLowerOutPut;
      this.isAdd = false;
      this.jdAddDio = true;
    },
    jdDetele(row) {
      this.$confirm("此操作将会删除你的数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        try {
          const result = await this.$api.xmInfoJdDelete(this, {
            id: row.id
          });
          this.$message.success(result.desc);
          this.getJdInfo();
        } catch (error) {
          this.$message.error(error.desc);
        }
      });
    },
    panDuanJD(jd) {
      let flag = false;
      this.jdTable.forEach(item => {
        if (item.jd == jd) {
          flag = true;
        }
      });
      return flag;
    },
    async saveJdGrid() {
      let valFlag = this.$refs["gridFromJd"].validate();
      if (!valFlag) {
        return;
      }
      let { jd } = this.jdGridData;
      let flag = this.panDuanJD(jd);
      if (flag && this.isAdd) {
        this.$message.warning("该季度已存在，不能重复添加!");
        return;
      }
      this.load.jdAdd = true;
      let param = {
        ...this.jdGridData,
        id: this.jdId,
        infoId: this.infoId
      };
      try {
        const result = await this.$api.xmInfoJdAdd(this, param);
        this.$message.success(result.desc);
        this.getJdInfo();
        this.load.jdAdd = false;
        this.jdAddDio = false;
      } catch (error) {
        this.load.jdAdd = false;
        this.$message.error(error.desc);
      }
    },
    initJdInfo() {
      this.jdGridData = {
        jd: "",
        jdNextOutPut: "",
        jdLowerOutPut: "",
        turnoverLowerOutPut: "",
        turnoverNextOutPut: "",
        proLowerOutPut: "",
        proNextOutPut: ""
      };
    },
    addJdInfo() {
      this.initJdInfo();
      this.jdGridDesc.jd.disabled = false;
      this.isAdd = true;
      this.jdId = 0;
      this.jdAddDio = true;
    },
    delGrid() {
      this.$confirm("此操作将会删除你的数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        try {
          const result = await this.$api.xmInfoDelete(this, {
            id: this.delGridId
          });
          this.$message.success(result.desc);
          this.getXmInfo();
        } catch (error) {
          this.$message.error(error.desc);
        }
      });
    },
    rowClick(v) {
      this.delGridId = v.id;
    },
    async saveGrid() {
      let flag = this.$refs["gridFrom"].validate();
      if (flag) {
        let param = {
          id: this.gridInfoId,
          eid: this.eid,
          ...this.GridData
        };
        try {
          this.load.gridAdd = true;
          const result = await this.$api.xmInfoAdd(this, param);
          this.$message.success(result.desc);
          this.GridDrawer = false;
          this.load.gridAdd = false;
          this.getXmInfo();
        } catch (error) {
          this.load.gridAdd = false;
          this.$message.error(error.desc);
        }
      }
    },
    setingJd(row) {
      this.infoId = row.id;
      this.getJdInfo();
      this.jdSetShow = true;
    },
    async getJdInfo() {
      try {
        this.load.jd = true;
        let result = await this.$api.xmInfoJdFind(
          this,
          `infoId=${this.infoId}`
        );
        this.jdTable = result.result;
        this.load.jd = false;
      } catch (error) {
        this.load.jd = false;
        this.$message.error(error.desc);
      }
    },
    gridEdit(row) {
      let {
        year,
        yearPlanOutPut,
        yearIndexOutPut,
        nowYearPlanTurnover,
        nowYearLowerTurnover,
        nowYearPlanPro,
        nowYearLowerPro,
        eid,
        id
      } = row;
      this.GridData.year = year;
      this.GridData.yearPlanOutPut = yearPlanOutPut;
      this.GridData.yearIndexOutPut = yearIndexOutPut;
      this.GridData.nowYearPlanTurnover = nowYearPlanTurnover;
      this.GridData.nowYearLowerTurnover = nowYearLowerTurnover;
      this.GridData.nowYearPlanPro = nowYearPlanPro;
      this.GridData.nowYearLowerPro = nowYearLowerPro;
      this.eid = eid;
      this.gridInfoId = id;
      this.isAdd = false;
      this.GridDesc.year.prop.disabled = true;
      this.GridDrawer = true;
    },
    addGrid() {
      this.gridInfoId = 0;
      this.isAdd = true;
      this.GridData = {
        year: "",
        yearPlanOutPut: "",
        yearIndexOutPut: "",
        nowYearPlanTurnover: "",
        nowYearLowerTurnover: "",
        nowYearPlanPro: "",
        nowYearLowerPro: ""
      };
      this.GridDesc.year.prop.disabled = false;
      this.GridDrawer = true;
    },
    set(v) {
      this.tableShow = true;
      this.eid = v.row.eid;
      this.delGridId = "";
      this.drawerTitle = v.row.entryName;
      // this.getXmInfo();
    },
    //获取项目详细信息
    async getXmInfo() {
      this.load.info = true;
      const result = await this.$api.xmInfoFind(this, `eid=${this.eid}`);
      this.gridData = result.result;
      this.load.info = false;
    },
    async saveCreat() {
      try {
        this.load.gridAdd = true;
        let result = await this.$api.xmMgrAdd(this, this.formData);
        this.load.gridAdd = false;
        this.$message.success(result.desc);
        this.drawer = false;
        this.loadTable();
      } catch (error) {
        this.load.gridAdd = false;
        this.$message.warning(error.desc);
      }
    },
    async saveUpdate(v = true) {
      try {
        this.load.gridAdd = true;
        let result = await this.$api.xmMgrUpdate(this, this.formData);
        v && this.$message.success(result.desc);
        this.drawer = false;
        this.GridDrawer = false;
        this.load.gridAdd = false;
        this.loadTable();
      } catch (error) {
        this.load.gridAdd = false;
        this.$message.warning(error.desc);
      }
    },
    saveDxianMu() {
      let flag = this.$refs["form"].validate();
      if (flag) {
        this.isAdd && this.saveCreat();
        !this.isAdd && this.saveUpdate();
      }
    },
    del() {
      this.$confirm("此操作将删除该信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        try {
          await this.$api.xmMgrDel(this, { ids: this.selId });
          this.loadTable();
          this.$message.success("删除成功");
        } catch (error) {
          this.$message.error("删除失败");
        }
      });
    },
    handleSelectionChange(v) {
      let data = [];
      if (v.length) {
        v.forEach(item => {
          data.push(item.eid);
        });
      }
      this.selId = data;
    },
    edit(v) {
      this.formData = v.row;
      this.drawer = true;
      this.isAdd = false;
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
      this.load.tableLoad = true;
      const result = await this.$api.xmMgrGetAllTable(this, {
        searchInfo: this.searchInfo,
        countPerPage: this.sizePage,
        currentPage: this.currentPage
      });
      this.pageLength = result.len;
      this.tableData = result.result;
      this.load.tableLoad = false;
    },
    seach() {
      this.loadTable();
    },
    add() {
      this.formData = {
        entryName: "",
        contract: ""
      };
      this.isAdd = true;
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
.xmInfo-dio {
  .el-dialog__body {
    padding-top: 10px;
  }
}
</style>