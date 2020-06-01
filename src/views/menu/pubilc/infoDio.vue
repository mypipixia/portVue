<template>
  <el-drawer :title="drawerTitle"
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
        <el-select v-model="selKind"
                   size="mini"
                   @change="changeKind"
                   v-if="!isDefaultKind"
                   style="margin-left:10px;width:100px"
                   placeholder="请选择">
          <el-option v-for="item in kindArr"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
        <el-select v-model="selEid"
                   size="mini"
                   v-if="!!eidArr"
                   @change="changeKind"
                   style="margin-left:10px;width:100px"
                   placeholder="请选择">
          <el-option v-for="item in eidArr"
                     :key="item.eid"
                     :label="item.entryName"
                     :value="item.eid">
          </el-option>
        </el-select>
      </el-card>
      <el-table :data="gridData"
                border
                v-loading="yearLoad"
                highlight-current-row
                @row-click="rowClick">
        <el-table-column v-for="(item,index) in GridTable"
                         :key="index"
                         :prop="item.prop"
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
      <el-dialog :title="isAdd?'新增':'编辑'"
                 :visible.sync="GridDrawer"
                 class="xmInfo-dio"
                 append-to-body
                 top="40px"
                 width="600px">
        <span>
          <infoForm v-if="GridDrawer"
                    :renderArr="GridDesc[selKind]"
                    :formData.sync="GridData"
                    ref="gridFrom"></infoForm>
        </span>
        <span slot="footer"
              class="dialog-footer">
          <el-button @click="GridDrawer = false"
                     size="small">取 消</el-button>
          <el-button type="primary"
                     @click="saveGrid"
                     :loading="gridAddLoad"
                     size="small">确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog title="季度信息设置"
                 :visible.sync="jdSetShow"
                 class="xmInfo-dio"
                 append-to-body
                 width="1000px">
        <el-button type="primary"
                   size="mini"
                   style="margin-bottom:10px"
                   @click="addJdInfo">新增</el-button>
        <el-table :data="jdTable"
                  border
                  v-loading="loadJd"
                  :height="300"
                  style="width: 100%">
          <el-table-column :prop="item.prop"
                           :label="item.label"
                           v-for="(item,index) in jdInfoHeaer[selKind]"
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
                      :renderArr="jdGridDesc[selKind]"
                      :formData.sync="jdGridData"
                      ref="gridFromJd"></infoForm>
          </span>
          <span slot="footer"
                class="dialog-footer">
            <el-button @click="jdAddDio = false"
                       size="small">取 消</el-button>
            <el-button type="primary"
                       @click="saveJdGrid"
                       :loading="loadjdAdd"
                       size="small">确 定</el-button>
          </span>
        </el-dialog>
      </el-dialog>
    </div>
  </el-drawer>
</template>

<script>
import { JD_ARR } from "@/common/consts";

export default {
  props: {
    drawerTitle: {
      type: String,
      default: ""
    },
    value: {
      type: Boolean,
      default: false
    },
    isDefaultKind: {
      type: String,
      default: ""
    },
    defaultEid: {
      type: [String, Number],
      default: ""
    },
    eidArr: {
      type: [Array],
      default: () => {}
    }
  },
  computed: {
    GridTable() {
      let arr = this.gridDataDto[this.selKind];
      return arr;
    }
  },
  data() {
    return {
      selEid: "",
      loadjdAdd: false,
      jdAddDio: false,
      jdGridDesc: {
        output: {
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
          jdNext: {
            type: "input",
            label: "下季度计划产值",
            required: false
          },
          jdLower: {
            type: "input",
            label: "公司下发下季度产值",
            required: false
          }
        },
        turnover: {
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

          jdNext: {
            type: "input",
            label: "下季度计划营业额",
            required: false
          },
          jdLower: {
            type: "input",
            label: "公司下发下季度营业额",
            required: false
          }
        },
        profit: {
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
          jdNext: {
            type: "input",
            label: "下季度计划利润",
            required: false
          },
          jdLower: {
            type: "input",
            label: "公司下发下季度利润",
            required: false
          }
        },
        lj: {
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
          jdNext: {
            type: "input",
            label: "下季度计划两金",
            required: false
          },
          jdLower: {
            type: "input",
            label: "公司下发下季度两金",
            required: false
          }
        }
      },
      jdGridData: {
        jd: "",
        jdNext: "",
        jdLower: ""
      },
      jdInfoHeaer: {
        output: [
          {
            label: "季度",
            prop: "jd"
          },
          {
            label: "下季度计划产值",
            prop: "jdNext"
          },
          {
            label: "公司下发下季度产值",
            prop: "jdLower"
          }
        ],
        turnover: [
          {
            label: "季度",
            prop: "jd"
          },
          {
            label: "下季度计划营业额",
            prop: "jdNext"
          },
          {
            label: "公司下发下季度营业额",
            prop: "jdLower"
          }
        ],
        profit: [
          {
            label: "季度",
            prop: "jd"
          },
          {
            label: "下季度计划利润",
            prop: "jdNext"
          },
          {
            label: "公司下发下季度利润",
            prop: "jdLower"
          }
        ],
        lj: [
          {
            label: "季度",
            prop: "jd"
          },
          {
            label: "下季度计划两金",
            prop: "jdNext"
          },
          {
            label: "公司下发下季度两金",
            prop: "jdLower"
          }
        ]
      },
      jdSetShow: false,
      jdTable: [],
      loadJd: false,
      infoId: "",
      GridDrawer: false,
      gridAddLoad: false,
      GridDesc: {
        output: {
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
          yearPlan: {
            type: "input",
            label: "本年计划完成产值",
            required: true,
            ruleType: "num"
          },
          yearIndex: {
            type: "input",
            label: "公司下发本年度产值",
            required: false,
            ruleType: "num"
          }
        },
        turnover: {
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
          yearPlan: {
            type: "input",
            label: "本年度计划营业额",
            required: true,
            ruleType: "num"
          },
          yearIndex: {
            type: "input",
            label: "公司下发本年营业额",
            required: false,
            ruleType: "num"
          }
        },
        profit: {
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
          yearPlan: {
            type: "input",
            label: "本年度计划利润",
            required: true,
            ruleType: "num"
          },
          yearIndex: {
            type: "input",
            label: "公司下发本年利润",
            required: false,
            ruleType: "num"
          }
        },
        lj: {
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
          yearPlan: {
            type: "input",
            label: "本年度计划两金",
            required: true,
            ruleType: "num"
          },
          yearIndex: {
            type: "input",
            label: "公司下发本年两金",
            required: false,
            ruleType: "num"
          }
        }
      },
      GridData: {
        year: "",
        yearPlan: "",
        yearIndex: ""
      },
      isAdd: false,
      yearLoad: false,
      kindArr: [
        {
          label: "产值",
          value: "output"
        },
        {
          label: "营业额",
          value: "turnover"
        },
        {
          label: "利润",
          value: "profit"
        }
      ],
      gridInfoId: 0,
      gridDataDto: {
        output: [
          {
            prop: "year",
            width: "100px",
            label: "年度",
            sortable: true
          },
          {
            prop: "yearPlan",
            width: "150px",
            label: "本年计划完成产值"
          },
          {
            prop: "yearIndex",
            width: "150px",
            label: "公司下发本年度产值"
          }
        ],
        turnover: [
          {
            prop: "year",
            width: "100px",
            label: "年度",
            sortable: true
          },
          {
            prop: "yearPlan",
            width: "150px",
            label: "本年度计划营业额"
          },
          {
            prop: "yearIndex",
            width: "220px",
            label: "公司下发本年营业额"
          }
        ],
        profit: [
          {
            prop: "year",
            width: "100px",
            label: "年度",
            sortable: true
          },
          {
            prop: "yearPlan",
            width: "150px",
            label: "本年度计划利润"
          },
          {
            prop: "yearIndex",
            width: "220px",
            label: "公司下发本年利润"
          }
        ],
        lj: [
          {
            prop: "year",
            width: "100px",
            label: "年度",
            sortable: true
          },
          {
            prop: "yearPlan",
            width: "150px",
            label: "本年度计划两金"
          },
          {
            prop: "yearIndex",
            width: "220px",
            label: "公司下发本年两金"
          }
        ]
      },
      tableShow: false,
      delGridId: "",
      selKind: "output",
      gridData: [],
      jdId: 0
    };
  },
  methods: {
    initJdInfo() {
      this.jdGridData = {
        jd: "",
        jdNext: "",
        jdLower: ""
      };
    },
    jdEdit(row) {
      this.initJdInfo();
      this.jdGridDesc[this.selKind].jd.disabled = true;
      let { id, jd, jdNext, jdLower } = row;
      this.jdId = id;
      this.jdGridData.jd = jd;
      this.jdGridData.jdNext = jdNext;
      this.jdGridData.jdLower = jdLower;
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
          this.$emit("success");
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
      this.loadjdAdd = true;
      let param = {
        ...this.jdGridData,
        id: this.jdId,
        eid: this.defaultEid || this.selEid,
        infoId: this.infoId
      };
      try {
        const result = await this.$api.xmInfoJdAdd(this, param);
        this.$message.success(result.desc);
        this.getJdInfo();
        this.loadjdAdd = false;
        this.jdAddDio = false;
        this.$emit("success");
      } catch (error) {
        this.loadjdAdd = false;
        this.$message.error(error.desc);
      }
    },
    addJdInfo() {
      this.jdGridDesc[this.selKind].jd.disabled = false;
      this.isAdd = true;
      this.jdId = 0;
      this.jdAddDio = true;
      this.initJdInfo();
    },
    setingJd(row) {
      this.infoId = row.id;
      this.getJdInfo();
      this.jdSetShow = true;
    },
    async getJdInfo() {
      try {
        this.loadJd = true;
        let result = await this.$api.xmInfoJdFind(
          this,
          `infoId=${this.infoId}`
        );
        this.jdTable = result.result;
        this.loadJd = false;
      } catch (error) {
        this.loadJd = false;
        this.$message.error(error.desc);
      }
    },
    async saveGrid() {
      let flag = this.$refs["gridFrom"].validate();
      if (flag) {
        let param = {
          id: this.gridInfoId,
          eid: this.defaultEid || this.selEid,
          type: this.selKind,
          ...this.GridData
        };
        try {
          this.gridAddLoad = true;
          const result = await this.$api.xmInfoAdd(this, param);
          this.$message.success(result.desc);
          this.GridDrawer = false;
          this.gridAddLoad = false;
          this.getXmInfo();
          this.$emit("success");
        } catch (error) {
          this.gridAddLoad = false;
          this.$message.error(error.desc);
        }
      }
    },
    changeKind() {
      this.getXmInfo();
    },
    async getXmInfo() {
      this.yearLoad = true;
      const result = await this.$api.xmInfoFind(
        this,
        `eid=${this.defaultEid || this.selEid}&type=${this.selKind}`
      );
      this.delGridId = "";
      this.gridData = result.result;
      this.yearLoad = false;
    },
    initGridData() {
      this.GridData = {
        year: "",
        yearPlan: "",
        yearIndex: ""
      };
    },
    init() {
      this.selKind = this.isDefaultKind || "output";
      this.delGridId = "";
      if (!!this.eidArr && this.eidArr.length) {
        this.selEid = this.eidArr[0].eid;
      }
      this.getXmInfo();
    },
    rowClick(v) {
      this.delGridId = v.id;
    },
    //新增
    addGrid() {
      this.initGridData();
      this.gridInfoId = 0;
      this.GridDrawer = true;
      this.GridDesc[this.selKind].year.prop.disabled = false;
      this.isAdd = true;
    },
    //删除
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
          this.$emit("success");
        } catch (error) {
          this.$message.error(error.desc);
        }
      });
    },
    gridEdit(row) {
      this.initGridData();
      this.gridInfoId = row.id;
      this.GridData.year = row.year;
      this.GridData.yearPlan = row.yearPlan;
      this.GridData.yearIndex = row.yearIndex;
      this.GridDesc[this.selKind].year.prop.disabled = true;
      this.GridDrawer = true;
      this.isAdd = false;
    }
  },
  watch: {
    value(v) {
      if (v) {
        this.init();
      }
      this.tableShow = v;
    },
    tableShow(v) {
      this.$emit("input", v);
    }
  },
  created() {
    this.tableShow = this.value;
  }
};
</script>

<style>
</style>