<template>
  <div ref="myChart" :style="{ width: '100%', height: '400px' }"></div>
</template>

<script>
export default {
  mounted() {
    this.draw();
  },
  methods: {
    draw() {
      let myChart = this.$refs.myChart;
      let ECharts;
      if (myChart) {
        ECharts = this.$echarts.init(myChart);
      }
      let options = {
        visualMap: {
          show: false,
          min: 0,
          max: 1000
        },
        calendar: {
          range: "2020"
        },
        series: {
          type: "heatmap",
          coordinateSystem: "calendar",
          // 第一列代表日期，第二列代表颜色
          data: [
            ["2017-01-02", 900],
            ["2017-01-03", 877],
            ["2017-01-05", 699],
            ["2017-01-07", 699],
            ["2017-01-08", 699],
            ["2017-01-10", 699],
            ["2017-01-20", 99]
          ]
        }
      };
      ECharts.setOption(options);
    }
  }
};
</script>
