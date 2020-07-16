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
        callNumData: [14, 11, 31, 21, 9, 132, 6, 6, 13, 19],
        callRateData: [14, 11, 10, 10, 9, 7, 6, 6, 6, 6],
        categoryData: [
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
      }
    };
  },
  computed: {
    options() {
      let { categoryData, callNumData, callRateData } = this.generateData;
      return {
        tooltip: {
          trigger: "axis",
          formatter(params) {
            let phoneNum = params[0].axisValue;
            let htmlStr = `<style>p{margin:0}</style><p>对方号码：${phoneNum}</p>`;
            params.map(pie => {
              let { data, color, seriesName, marker } = pie;
              let unit = seriesName.includes("频率") ? "次/天" : "次";
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
          right: 50,
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
            name: "通话次数（次）",
            type: "value",
            splitArea: {
              show: false
            }
          },
          {
            name: "通话频率（次/天）",
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
          data: ["通话次数", "通话频率"]
        },
        series: [
          {
            name: "通话次数",
            type: "bar",
            barWidth: 30,
            data: callNumData,
            yAxisIndex: "0",
            large: true
          },
          {
            name: "通话频率",
            type: "bar",
            barWidth: 30,
            data: callRateData,
            yAxisIndex: "1",
            large: true,
            itemStyle: {
              normal: {
                color: "#08A8BC"
              }
            }
          }
        ]
      };
    }
  }
};
</script>
