<template>
  <div class="echarts"
       v-if="pandun(400)">
    <el-card class="box-card">
      <el-date-picker v-model="dateYear"
                      type="year"
                      size="mini"
                      value-format="yyyy"
                      @change="getChart"
                      placeholder="选择年">
      </el-date-picker>
    </el-card>
    <el-card class="box-card my-box-chart"
             style="margin-top:10px">
      <div ref="chart0"
           class="chart"
           v-loading="loadChart[0]"></div>
      <div ref="chart1"
           class="chart"
           v-loading="loadChart[1]"></div>
      <div ref="chart2"
           class="chart"
           v-loading="loadChart[2]"></div>
      <div ref="chart3"
           class="chart"
           v-loading="loadChart[3]"></div>

    </el-card>

  </div>
</template>

<script>
import echarts from "echarts";
import moment from "moment";
import { mapGetters } from "vuex";
import { JD_ARRs } from "@/common/consts";
import { accAdd } from "@/common/math.js";
import { theme } from "@/plugins/macarons";
echarts.registerTheme("NJCB", theme);
export default {
  data() {
    return {
      dateYear: "",
      loadChart: [false, false, false, false]
    };
  },
  computed: {
    ...mapGetters("user", ["getRoleInfo"])
  },
  created() {
    if (this.pandun(400)) {
      let now = new Date().getTime();
      this.dateYear = moment(now).format("YYYY");
      this.getChart();
    }
  },
  methods: {
    getChartInfo(index, item) {
      let param = `year=${this.dateYear}&table=${item.key}`;
      let param2 = `year=${this.dateYear}&table=${item.key + "s"}`;
      this.loadChart[index] = true;
      Promise.all([
        this.$api.findEchartJd(this, param2),
        this.$api.findEchartInfoJd(this, param)
      ]).then(res => {
        let sjData = res[0].result;
        let data = [0, 0, 0, 0, 0];
        sjData.forEach(item => {
          let index = JD_ARRs[item.jd];
          data[index] = accAdd(data[index], item.monthOutPut);
        });

        let jdInfo = res[1].result;
        let jdLower = {};
        let jdNext = {};
        let jdArr = [0, "03", "06", "09", 12];
        jdInfo.forEach(item => {
          let key = item.year + "-" + jdArr[JD_ARRs[item.jd]];
          let num = jdLower[key] || 0;
          jdLower[key] = accAdd(num, item.jdLower);
          let num2 = jdNext[key] || 0;
          jdNext[key] = accAdd(num2, item.jdNext);
        });
        let option = this.setOption(item.label, jdLower, jdNext, data);
        this.initChart(index, option);
      });
    },
    getChart() {
      let type = [
        {
          label: "产值",
          key: "output"
        },
        {
          label: "营业额",
          key: "turnover"
        },
        {
          label: "利润",
          key: "profit"
        },
        {
          label: "两金",
          key: "lj"
        }
      ];

      type.forEach((item, index) => {
        this.getChartInfo(index, item);
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
    setOption(label, jdLower, jdNext, data) {
      let jdArr = ["03", "06", "09", 12];
      let jdIndex1 = this.dateYear - 1 + "-" + jdArr[3];
      let jdIndex2 = this.dateYear + "-" + jdArr[0];
      let jdIndex3 = this.dateYear + "-" + jdArr[1];
      let jdIndex4 = this.dateYear + "-" + jdArr[2];
      let option = {
        title: {
          text: `${label}分析表`,
          subtext: ""
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            crossStyle: {
              color: "#999"
            }
          }
        },
        toolbox: {
          feature: {
            saveAsImage: { show: true }
          }
        },
        legend: {
          data: [`公司计划${label}`, `事业部计划${label}`, `事业部实际${label}`]
        },
        xAxis: [
          {
            type: "category",
            data: ["第一季度", "第二季度", "第三季度", "第四季度"],
            axisPointer: {
              type: "shadow"
            }
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ],
        series: [
          {
            name: `公司计划${label}`,
            type: "bar",
            data: [
              jdLower[jdIndex1] || 0,
              jdLower[jdIndex2] || 0,
              jdLower[jdIndex3] || 0,
              jdLower[jdIndex4] || 0
            ]
          },
          {
            name: `事业部计划${label}`,
            type: "bar",
            data: [
              jdNext[jdIndex1] || 0,
              jdNext[jdIndex2] || 0,
              jdNext[jdIndex3] || 0,
              jdNext[jdIndex4] || 0
            ]
          },
          {
            name: `事业部实际${label}`,
            type: "line",
            data: [data[1], data[2], data[3], data[4]]
          }
        ]
      };
      return option;
    },
    initChart(index, option) {
      let myChart1 = echarts.init(this.$refs["chart" + index], "NJCB");
      myChart1.setOption(option);
      this.loadChart[index] = true;
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
    .chart {
      width: 50%;
      height: 400px;
      float: left;
    }
  }
}
</style>