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
import { accAdd } from "@/common/math.js";

echarts.registerTheme("NJCB", theme);
export default {
  data() {
    return {
      loadChartOne: false,
      dateYear: ""
    };
  },
  computed: {
    ...mapGetters("user", ["getRoleInfo"])
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
    getXm() {
      let arr = [
        "findTurnoverEchart",
        "findProfitsEchart",
        "findOutputsEchart",
        "findljEchart",
        "findXmInfoYearEchart"
      ];
      let param = `year=${this.dateYear}`;
      let promise = [];
      arr.forEach(item => {
        promise.push(this.$api[item](this, param));
      });
      let data = {
        turnover: 0,
        profit: 0,
        output: 0,
        lj: 0
      };
      let data2 = {
        turnover: [0, 0],
        profit: [0, 0],
        output: [0, 0],
        lj: [0, 0]
      };
      Promise.all(promise).then(res => {
        res.forEach((item, index) => {
          if (index < 4) {
            let arr = item.result;
            arr.forEach(i => {
              let num = i.monthOutPut || 0;
              data[item.type] = accAdd(data[item.type], num);
            });
          } else {
            let resIndex = res[4].result;
            resIndex.forEach(item => {
              let num1 = item.yearPlan || 0;
              let num2 = item.yearIndex || 0;
              data2[item.type][0] = accAdd(data2[item.type][0], num1);
              data2[item.type][1] = accAdd(data2[item.type][1], num2);
            });
          }
        });
        this.loadChartOne = true;
        let myChart1 = echarts.init(
          document.getElementById("chart-one"),
          "NJCB"
        );
        myChart1.setOption(this.getHUizhiData(data, data2));
        this.loadChartOne = false;
      });
    },
    getHUizhiData(data, data2) {
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
            ["产值", data["output"], data2["output"][0], data2["output"][1]],
            [
              "营业额",
              data["turnover"],
              data2["turnover"][0],
              data2["turnover"][1]
            ],
            ["利润", data["profit"], data2["profit"][0], data2["profit"][1]],
            ["两金", data["lj"], data2["lj"][0], data2["lj"][1]]
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
      this.getXm();
      // this.getChartOne();
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