<template>
  <div class="output"
       v-if="pandun(500)">
    <el-card class="box-card">
      <el-button size="mini"
                 type="primary"
                 @click="add"
                 v-if="pandun(502)">新增</el-button>
      <el-button size="mini"
                 type="danger"
                 plain
                 @click="del"
                 :disabled="!selId.length"
                 v-if="pandun(501)">删除</el-button>
      <el-button size="mini"
                 plain
                 v-if="pandun(510)"
                 @click="setInfo">设置</el-button>
      <el-button size="mini"
                 plain
                 @click="exportExcel">excel导出</el-button>
      <el-select v-model="searchInfo.jd"
                 placeholder="请选择"
                 size="mini"
                 @change="jdChange"
                 style="marginLeft:10px;width:100px">
        <el-option label="全部"
                   value="">
        </el-option>
        <el-option v-for="item in JD_ARR"
                   :key="item.value"
                   :label="item.label"
                   :value="item.label">
        </el-option>
      </el-select>
      <el-select v-model="searchInfo.status"
                 placeholder="请选择"
                 size="mini"
                 @change="jdChange"
                 style="marginLeft:10px;width:100px">
        <el-option label="全部"
                   value="">
        </el-option>
        <el-option v-for="(item,index) in STA_STU"
                   :key="index"
                   :label="item"
                   :value="item">
        </el-option>
      </el-select>
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
    <el-card class="box-card content"
             v-loading="initTable">
      <div class="top">
        <el-table :data="tableData"
                  border
                  ref="table"
                  :height="tableHeight"
                  @selection-change="handleSelectionChange">
          <el-table-column type="selection"
                           width="50"
                           align="center">
          </el-table-column>
          <el-table-column :prop="item.prop"
                           :label="item.label"
                           :width="item.width"
                           :sortable="item.sortable"
                           v-for="(item,index) in tableHeader"
                           :key="index">
          </el-table-column>
          <el-table-column align="center"
                           label="操作"
                           width="220"
                           fixed="right"
                           v-if="isNeedCaoz">
            <template slot-scope="scope">
              <el-button size="mini"
                         @click="edit(scope)"
                         v-if="setStatus(scope.row,'edit') && pandun(503)">编辑</el-button>
              <el-button size="mini"
                         :loading="btnLoading == '驳回'"
                         :disabled="!!btnLoading"
                         @click="changeStatus(scope.row,'驳回',507)"
                         v-if="setStatus(scope.row,'boh') && pandun(507)">驳回</el-button>
              <el-button size="mini"
                         :loading="btnLoading == '审核中'"
                         :disabled="!!btnLoading"
                         @click="changeStatus(scope.row,'审核中',505)"
                         v-if="setStatus(scope.row,'tj') && pandun(505)">提交</el-button>
              <el-button size="mini"
                         :loading="btnLoading == '已审核'"
                         :disabled="!!btnLoading"
                         @click="changeStatus(scope.row,'已审核',509)"
                         v-if="setStatus(scope.row,'tg') && pandun(509)">通过</el-button>
              <el-button size="mini"
                         :loading="btnLoading == '草稿'"
                         :disabled="!!btnLoading"
                         @click="changeStatus(scope.row,'草稿',508)"
                         v-if="setStatus(scope.row,'cx') && pandun(508)">撤销</el-button>
              <el-button size="mini"
                         :loading="btnLoading == '停用'"
                         :disabled="!!btnLoading"
                         @click="changeStatus(scope.row,'停用',506)"
                         v-if="setStatus(scope.row,'ty') && pandun(506)">停用</el-button>
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
    <modal :title="isAdd?'新增':'编辑'"
           :visible.sync="drawer"
           size="50%"
           :renderArr="formDesc"
           ref="repForm"
           :wrapperClosable="false"
           @sub="sub"
           :formData.sync="formData"></modal>
    <infoDio v-model="tableShow"
             isDefaultKind="lj"
             :eidArr="formDesc.eid.options"
             @success="successDio"
             drawerTitle="两金信息设置"></infoDio>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  JD_ARR,
  JD_ARRs,
  STA_STU,
  STA_STUMonth,
  monthJdArr
} from "@/common/consts";
import infoDio from "./pubilc/infoDio";

import FileSaver from "file-saver";
import XLSX from "xlsx";
import { ljTable } from "@/common/table";
import { accAdd, accRound } from "@/common/math.js";

import _ from "lodash";
import moment from "moment";
export default {
  components: {
    infoDio
  },
  data() {
    return {
      tableShow: false,
      btnLoading: "",
      allTableData: [],
      initTable: true,
      isNeedCaoz: true,
      sizePage: 10,
      searchInfo: {
        entryName: "",
        jd: "",
        status: ""
      },
      isInitTableHeight: true,
      tableHeight: 200,
      pageLength: 0,
      currentPage: 1,
      JD_ARR,
      STA_STU,
      drawer: false,
      isAdd: true,
      formData: {
        eid: "",
        year: "",
        jd: "",
        month: "",
        monthOutPut: "",
        monthNextOutPut: "",
        monthLowerOutPut: ""
      },
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
        year: {
          type: "date",
          label: "年",
          required: true,
          prop: {
            valueFormat: "yyyy",
            type: "year"
          }
        },
        jd: {
          type: "select",
          label: "季度",
          optionsKey: {
            label: "label",
            value: "label"
          },
          options: JD_ARR,
          required: true
        },
        month: {
          type: "select",
          label: "月份",
          optionsKey: {
            label: "label",
            value: "label"
          },
          options: [],
          required: true
        },
        monthOutPut: {
          type: "input",
          label: "本月实际产值",
          required: true,
          ruleType: "num"
        },
        monthNextOutPut: {
          type: "input",
          label: "下月计划产值",
          required: true,
          ruleType: "num"
        },
        monthLowerOutPut: {
          type: "input",
          label: "公司下发下月产值",
          required: false,
          ruleType: "num"
        }
      },
      tableHeader: ljTable,
      tableData: [],
      selId: [],
      editID: "",
      isFirst: true
    };
  },
  watch: {
    "formData.jd"(v) {
      let arr = STA_STUMonth[v] || [];
      if (!this.isFirst) {
        this.formData.month = "";
      } else {
        this.isFirst = false;
      }
      this.formDesc.month.options = arr;
    },
    currentPage() {
      this.loadTable(false);
    },
    drawer(v) {
      if (!v) {
        this.formData = {
          jd: "",
          eid: "",
          year: "",
          col2Next: "",
          col3: "",
          col4: ""
        };
      }
    }
  },
  computed: {
    ...mapGetters("user", ["getRoleInfo", "getUserInfo"])
  },
  created() {
    this.setTableHeight();
    window.addEventListener("resize", this.setTableHeight);
    if (this.pandun(500)) {
      this.getAllTable();
      this.getXm();
    }
  },
  destroyed() {
    window.removeEventListener("resize", this.setTableHeight);
  },
  methods: {
    successDio() {
      this.getAllTable();
    },
    setInfo() {
      this.tableShow = true;
    },
    setTableHeight() {
      var that = this;
      if (!this.isInitTableHeight) {
        return;
      }
      this.isInitTableHeight = false;
      setTimeout(() => {
        that.tableHeight = window.innerHeight - 210;
        this.isInitTableHeight = true;
      }, 100);
    },
    setStatus(v, s) {
      let status = v.status;
      if (s == "edit" || s == "tj") {
        return status == "草稿" || status == "驳回";
      } else if (s == "boh" || s == "cx" || s == "tg") {
        return status == "审核中";
      } else if (s == "ty") {
        return status == "已审核";
      }
    },
    //修改状态
    async changeStatus(v, s, flag) {
      let oid = v.oid;
      let parm = {
        oid,
        status: s,
        flag: flag
      };
      try {
        const result = await this.$api.ljUpdateStatus(this, parm);
        this.getAllTable(true);
        this.$message.success(result.desc);
      } catch (error) {
        this.$message.error(error.desc);
      }
    },
    async getXm() {
      let parm = this.pandun(504)
        ? { entryName: "" }
        : { entryName: "", userId: this.getUserInfo.userId };
      const result = await this.$api.xmMgrGetAllTable(this, {
        searchInfo: parm
      });
      this.formDesc.eid.options = result.result || [];
    },
    exportExcel() {
      this.isNeedCaoz = false;
      this.$nextTick(() => {
        /* generate workbook object from table */
        let wb = XLSX.utils.table_to_book(document.querySelector(".top"));
        /* get binary string as output */
        let wbout = XLSX.write(wb, {
          bookType: "xlsx",
          bookSST: true,
          type: "array"
        });

        FileSaver.saveAs(
          new Blob([wbout], { type: "application/octet-stream" }),
          "产值信息表.xlsx"
        );
        this.isNeedCaoz = true;

        return wbout;
      });
    },
    pandun(v) {
      if (this.getRoleInfo == "*") {
        return true;
      } else {
        let flag = this.getRoleInfo.includes(v);
        return flag;
      }
    },
    del() {
      this.$confirm("此操作将删除该信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        try {
          await this.$api.ljDel(this, { ids: this.selId });
          this.getAllTable();
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
          let status = item.status;
          if (status != "已审核" && status != "审核中") {
            data.push(item.oid);
          }
        });
      }
      this.selId = data;
    },

    jdChange() {
      this.loadTable();
    },
    sizeChange(v) {
      this.sizePage = v;
      this.loadTable();
    },
    loadTable(v = true) {
      v && (this.currentPage = 1);
      this.setTableArr();
    },
    async getAllTable(v = false) {
      this.initTable = true;
      let name = this.pandun(504) ? "ljGetAllTable" : "ljFindOnlyID";
      const result = await this.$api[name](this, {
        id: this.getUserInfo.userId
      });
      this.initTable = false;
      this.pageLength = result.result.length;
      this.allTableData = result.result || [];
      this.setTableObj();
      this.loadTable(v);
    },
    setTableArr() {
      let flData = _.cloneDeep(this.allTableData);
      if (this.searchInfo.entryName) {
        flData = flData.filter(item => {
          return item.entryName.includes(this.searchInfo.entryName);
        });
      }
      if (this.searchInfo.jd) {
        flData = flData.filter(item => {
          return item.jd == this.searchInfo.jd;
        });
      }
      if (this.searchInfo.status) {
        flData = flData.filter(item => {
          return item.status == this.searchInfo.status;
        });
      }

      this.pageLength = flData.length;
      let beg = this.sizePage * (this.currentPage - 1);
      let end = beg + this.sizePage;
      flData = flData.slice(beg, end);

      // data = this.setBJDWC(data);
      // data = this.setDNLJWC(data);
      // data = this.setKGLJ(data);
      this.tableData = flData;
    },
    //设置数组格式
    setTableObj() {
      let initData = {};
      let jdIIndex = {};
      //季度实际
      let jdLjArr = {};
      //年度实际
      let ndSjArr = {};
      //开工累计
      let kgLjArr = {};
      this.allTableData.forEach(item => {
        let { year, eid, month, jd } = item;

        let date = year + "-" + month;
        let nowDate = moment(date).format("YYYY-MM");
        let str = eid + "-" + nowDate;
        initData[str] = item;
        let jdName = eid + "-" + year + "-" + JD_ARRs[jd];
        let ndName = eid + "-" + year;
        !jdIIndex.hasOwnProperty(jdName) && (jdIIndex[jdName] = item);
        jdLjArr[jdName] = jdLjArr[jdName] || [];
        jdLjArr[jdName].push(item);
        ndSjArr[ndName] = ndSjArr[ndName] || [];
        ndSjArr[ndName].push(item);
        kgLjArr[eid] = kgLjArr[eid] || [];
        kgLjArr[eid].push(item);
      });
      this.allTableData.forEach(item => {
        let { year, month, eid, jd } = item;
        let date = year + "-" + month;
        let preDate = moment(date)
          .subtract(1, "month")
          .format("YYYY-MM");
        let monthName = eid + "-" + preDate;
        let nodeMonth = initData[monthName];
        //设置本月计划产值
        item.monthPlanOutPut = nodeMonth ? nodeMonth.monthNextOutPut || "" : "";
        //设置公司下发本月产值
        item.monthLowerOutPutNow = nodeMonth
          ? nodeMonth.monthLowerOutPut || ""
          : "";
        //计算季度相关
        let jdDate = moment(date).subtract(3, "month");
        let jdYear = jdDate.format("YYYY");
        let jdMonth = jdDate.format("MM");
        let jdId = monthJdArr[jdMonth - 1];
        let jdName = eid + "-" + jdYear + "-" + jdId;
        let jdNode = jdIIndex[jdName];
        //设置本季度计划产值
        item.jdNextOutPutNow = jdNode ? jdNode.jdNext || "" : "";
        //设置公司下发本季度产值
        item.jdLowerOutPutNow = jdNode ? jdNode.jdLower || "" : "";

        let jdNameSj = eid + "-" + year + "-" + JD_ARRs[jd];
        //设置本季度实际产值
        let ljArr = jdLjArr[jdNameSj] || [];
        let ljJd = 0;
        ljArr.forEach(i => {
          if (month >= i.month) {
            let num = i.monthOutPut || 0;
            ljJd = accAdd(num, ljJd);
          }
        });
        item.jdOutPut = ljJd;
        //设置年度产值
        let ndStr = eid + "-" + year;
        let nDOutPut = 0;
        let ndObj = ndSjArr[ndStr] || [];
        ndObj.forEach(i => {
          if (month >= i.month) {
            let num = i.monthOutPut || 0;
            nDOutPut = accAdd(num, nDOutPut);
          }
        });
        item.yearOutPut = nDOutPut;
        //设置开工累计
        let kgOutPut = 0;
        let kgObj = kgLjArr[eid] || [];
        kgObj.forEach(i => {
          let kgStr = i.year + "-" + i.month;
          if (date >= kgStr) {
            let num = i.monthOutPut || 0;
            kgOutPut = accAdd(num, kgOutPut);
          }
        });
        item.kgOutPut = kgOutPut;
        if (item.yearPlan) {
          item.bf = accRound(item.yearOutPut / item.yearPlan, 4) * 100 + "%";
        }
      });
    },
    seach() {
      this.loadTable();
    },
    initFormData() {
      this.isFirst = true;
      this.formData = {
        eid: "",
        year: "",
        jd: "",
        month: "",
        monthOutPut: "",
        monthNextOutPut: "",
        monthLowerOutPut: ""
      };
    },
    add() {
      this.initFormData();
      this.editID = "";
      this.isAdd = true;
      this.drawer = true;
    },
    edit(v) {
      this.initFormData();
      this.editID = v.row.oid;
      let keys = Object.keys(v.row);
      keys.forEach(key => {
        this.formData.hasOwnProperty(key) && (this.formData[key] = v.row[key]);
      });
      this.drawer = true;
      this.isAdd = false;
    },
    async saveAdd() {
      try {
        const result = await this.$api.ljAdd(this, {
          ...this.formData,
          status: "草稿",
          uid: this.getUserInfo.userId
        });
        this.drawer = false;
        this.getAllTable();
        this.$message.success(result.desc);
      } catch (error) {
        this.$message.error(error.desc);
      }
    },
    async saveEdit() {
      try {
        let param = {
          oid: this.editID,
          ...this.formData
        };
        const result = await this.$api.ljUpdate(this, param);
        this.drawer = false;
        this.getAllTable(true);
        this.$message.success(result.desc);
      } catch (error) {
        this.$message.error(error.desc);
      }
    },
    async sub() {
      if (this.isAdd) {
        this.saveAdd();
      } else {
        this.saveEdit();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.output {
  .btn_list {
    width: 100%;
    text-align: center;
  }
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
.el-card__body {
  padding: 10px;
}
</style>