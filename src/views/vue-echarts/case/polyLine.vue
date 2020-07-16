<template>
  <div>
    <vue-echarts :options="options" style="width:100%;height:500px" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      generateData: {
        categoryData: [
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
        ],
        callTimeData: [
          6065,
          3634,
          588,
          1250,
          699,
          2284,
          4914,
          12109,
          21725,
          33661
        ],
        callNumData: [50, 33, 17, 18, 12, 48, 116, 249, 374, 540]
      }
    };
  },
  computed: {
    options() {
      let { categoryData, callTimeData, callNumData } = this.generateData;
      return {
        tooltip: {
          trigger: "axis",
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
          },
          axisPointer: {
            type: "shadow"
          }
        },
        grid: {
          bottom: 90,
          left: 60,
          right: 40,
          top: 40
        },
        dataZoom: [
          {
            type: "inside",
            start: 0,
            end: 60
          },
          {
            type: "slider"
          }
        ],
        xAxis: {
          data: categoryData,
          silent: false,
          splitLine: {
            show: false
          },
          splitArea: {
            show: false
          }
        },
        yAxis: [
          {
            name: "通话总时长（秒）",
            type: "value",
            splitArea: {
              show: false
            }
          },
          {
            name: "通话次数（次）",
            type: "value",
            splitArea: {
              show: false
            },
            splitLine: {
              show: false
            }
          }
        ],
        legend: {
          data: ["通话总时长", "通话次数"]
        },
        series: [
          {
            name: "通话总时长",
            type: "line",
            data: callTimeData,
            yAxisIndex: "0",
            large: true,
            itemStyle: {
              normal: {
                color: "#00A8BC"
              }
            }
          },
          {
            name: "通话次数",
            type: "line",
            data: callNumData,
            yAxisIndex: "1",
            large: true
          }
        ]
      };
    }
  }
};
</script>
