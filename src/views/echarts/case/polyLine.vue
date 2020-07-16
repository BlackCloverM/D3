<template>
  <div ref="myChart" :style="{ height: '500px', width: '100%' }"></div>
</template>

<script>
export default {
  mounted() {
    this.draw();
  },
  methods: {
    draw() {
      let myChart = this.$refs.myChart;
      let Echarts;
      if (myChart) {
        Echarts = this.$echarts.init(myChart, null, { renderer: "svg" });
      }

      let options = {
        tittle: {},
        legend: {
          data: ["通话总时长", "通话次数"]
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
            let htmlStr = `<style>p{margin:0}</style><p>通话时段：${date}</p>`;
            params.map(line => {
              let { data, color, seriesName, marker } = line;
              let unit = seriesName.includes("次数") ? "次" : "";
              color = "#fff";
              htmlStr += `<p style="color:${color}">${marker}${seriesName}：${data}${unit}</p>`;
            });
            return htmlStr;
          }
        },
        // 图表（x轴和y轴围城的范围）的边距
        grid: {
          bottom: 90,
          left: 60,
          right: 40,
          top: 40
        },
        xAxis: {
          data: [
            "00:00 ~ 01:00",
            "01:00 ~ 02:00",
            "02:00 ~ 03:00",
            "03:00 ~ 04:00",
            "04:00 ~ 05:00",
            "05:00 ~ 06:00",
            "06:00 ~ 07:00",
            "07:00 ~ 08:00",
            "08:00 ~ 09:00",
            "09:00 ~ 10:00"
          ]
        },
        yAxis: [
          {
            name: "通话总时长（秒）",
            // 类似于斑马纹的一个效果默认不显示
            splitArea: {
              show: true
            }
          },
          {
            name: "通话次数（次）",
            // 是否显示分割线
            splitLine: {
              show: false
            }
          }
        ],
        dataZoom: [
          // 前面写了start和end后面的可以省略
          {
            type: "slider",
            start: 10,
            end: 60
          },
          {
            type: "inside"
          }
        ],
        series: [
          {
            name: "通话总时长", // a
            type: "line",
            data: [6065, 3634, 588, 1250, 699, 2284, 4914, 12109, 21725, 33661], // c
            yAxisIndex: 0
          },
          {
            name: "通话次数",
            type: "line",
            data: [50, 33, 17, 18, 12, 48, 116, 249, 374, 540],
            yAxisIndex: 1
          }
        ]
      };

      Echarts.setOption(options);
    }
  }
};
</script>
