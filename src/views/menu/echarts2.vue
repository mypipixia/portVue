<template>
  <div class="echarts"
       v-if="pandun(400)">
    <el-card class="box-card">
      <el-date-picker v-model="dateYear"
                      type="year"
                      size="mini"
                      value-format="yyyy"
                      @change="initChart"
                      placeholder="选择年">
      </el-date-picker>
      <el-select v-model="selKindList"
                 size="mini"
                 @change="initChart"
                 style="margin-left:10px"
                 placeholder="请选择">
        <el-option v-for="item in xmList"
                   :key="item.eid"
                   :label="item.entryName"
                   :value="item.eid">
        </el-option>
      </el-select>
    </el-card>
    <el-card class="box-card my-box-chart"
             style="margin-top:10px">
      <div id="chart-one"
           v-loading="loadChartOne"
           style="width:100%;height:500px"></div>
    </el-card>

  </div>
</template>

<script>
import echarts from "echarts";
import moment from "moment";
import { mapGetters } from "vuex";
import { theme } from "@/plugins/macarons";
echarts.registerTheme("NJCB", theme);
export default {
  data() {
    return {
      loadChartOne: false,
      dateYear: "",
      xmList: [],
      selKindList: ""
    };
  },
  computed: {
    ...mapGetters("user", ["getRoleInfo", "getUserInfo"])
  },
  created() {
    if (this.pandun(400)) {
      let now = new Date().getTime();
      this.dateYear = moment(now).format("YYYY");
      this.getXm();
    }
  },
  methods: {
    pandun(v) {
      if (this.getRoleInfo == "*") {
        return true;
      } else {
        let flag = this.getRoleInfo.includes(v);
        return flag;
      }
    },
    async getXm() {
      let parm = this.pandun(104)
        ? { entryName: "" }
        : { entryName: "", userId: this.getUserInfo.userId };
      const result = await this.$api.xmMgrGetAllTable(this, {
        searchInfo: parm
      });
      this.xmList = result.result;
      if (this.xmList.length) {
        this.selKindList = this.xmList[0].eid;
      }
      this.initAllChart();
    },
    async getChartOne() {
      this.loadChartOne = true;
      let param = `eid=${this.selKindList}&year=${this.dateYear}`;
      const data = await this.$api.getEchartOne(this, param);
      let myChart1 = echarts.init(document.getElementById("chart-one"), "NJCB");
      myChart1.setOption(this.getHUizhiData(data.result));
      this.loadChartOne = false;
    },
    getHUizhiData(data) {
      let option = {
        title: {
          text: "年度产值、营业额、利润分析",
          subtext: ""
        },
        toolbox: {
          show: true,
          feature: {
            saveAsImage: { show: true }
          }
        },
        legend: {},
        tooltip: {},
        dataset: {
          source: [
            ["product", "公司下发完成", "年度计划完成", "年度实际完成"],
            [
              "产值",
              data[0]["yearIndex"],
              data[0]["yearPlan"],
              data[0]["monthAll"]
            ],
            [
              "营业额",
              data[1]["yearIndex"],
              data[1]["yearPlan"],
              data[1]["monthAll"]
            ],
            [
              "利润",
              data[2]["yearIndex"],
              data[2]["yearPlan"],
              data[2]["monthAll"]
            ]
          ],
          label: {
            show: true,
            position: "top"
          }
        },
        xAxis: { type: "category" },
        yAxis: {},
        // Declare several bar series, each will be mapped
        // to a column of dataset.source by default.
        series: [
          {
            type: "bar",
            label: {
              show: true,
              position: "top"
            }
          },
          {
            type: "bar",
            label: {
              show: true,
              position: "top"
            }
          },
          {
            type: "bar",
            label: {
              show: true,
              position: "top"
            }
          }
        ]
      };
      return option;
    },
    initChart() {
      this.getChartOne();
    },
    initAllChart() {
      this.getChartOne();
    }
  }
};
</script>

<style lang="scss" scoped>
.echarts {
  height: 100%;
  .echarts-card {
    padding: 10px;
    background-color: white;
  }
  .my-box-chart {
    height: calc(100% - 85px);
    overflow: auto;
  }
}
</style>