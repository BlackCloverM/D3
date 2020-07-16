<template>
  <div ref="myChart" :style="{ width: '100%', height: '500px' }"></div>
</template>

<script>
export default {
  mounted() {
    this.draw();
    console.log(this.$route);
    console.log(this.$router);
  },
  methods: {
    draw() {
      const myChart = this.$refs.myChart;
      let ECharts;
      if (myChart) {
        ECharts = this.$echarts.init(myChart, null, { renderer: "svg" });
      }
      let options = {
        title: {},
        legend: {
          data: ["通话次数", "通话频率"]
        },
        yAxis: [
          {
            name: "通话次数（次）"
          },
          {
            name: "通话频率（次/天）",
            splitLine: {
              show: false
            }
          }
        ],
        xAxis: {
          data: [
            "18056465117(六安电信)",
            "15212123277(蚌埠移动)",
            "18756496175(六安移动)",
            "13856476675(六安移动)",
            "15215643018(六安移动)",
            "15855210578(六安移动)",
            "13856426561(六安移动)",
            "13345646526(六安电信)",
            "13805646859(六安移动)",
            "15085592627(遵义移动)"
          ]
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          },
          formatter(params) {
            if (!params) {
              return "";
            }
            let date = params[0].axisValue;
            let htmlStr = `<style>p{margin:0}</style><p>对方号码：${date}</p>`;
            params.map(line => {
              let { data, color, seriesName, marker } = line;
              let unit = seriesName.includes("次数") ? "次" : "";
              color = "#fff";
              htmlStr += `<p style="color:${color}">${marker}${seriesName}：${data}${unit}</p>`;
            });
            return htmlStr;
          }
        },
        dataZoom: [
          {
            type: "slider",
            start: 0,
            end: 60
          },
          {
            type: "inside"
          }
        ],
        grid: {
          bottom: 90,
          left: 60,
          right: 50,
          top: 40
        },
        series: [
          {
            name: "通话次数",
            type: "bar",
            barWidth: 30,
            data: [14, 11, 31, 21, 9, 132, 6, 6, 13, 19],
            yAxisIndex: 0
          },
          {
            name: "通话频率",
            type: "bar",
            barWidth: 30,
            data: [14, 11, 10, 10, 9, 7, 6, 6, 6, 6],
            yAxisIndex: 1,
            itemStyle: {
              color: "#08A8BC"
            }
          }
        ]
      };
      ECharts.setOption(options);
    }
  }
};
</script>
