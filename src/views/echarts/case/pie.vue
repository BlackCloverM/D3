<template>
  <div ref="myChart" :style="{ width: '500px', height: '500px' }"></div>
</template>

<script>
export default {
  mounted() {
    this.draw();
  },
  methods: {
    draw() {
      const myChart = this.$refs.myChart;
      let ECharts;
      if (myChart) {
        ECharts = this.$echarts.init(myChart);
      }
      let options = {
        // 全局背景色
        backgroundColor: "#2c343c",
        visualMap: {
          // 不显示 visualMap 组件，只用于明暗度的映射
          show: false,
          // 映射的最小值为 80
          min: 80,
          // 映射的最大值为 600
          max: 600,
          inRange: {
            // 明暗度的范围是 0 到 1
            colorLightness: [0, 1]
          }
        },
        series: [
          {
            roseType: "angle", // 將饼图显示成功南丁格尔图
            name: "访问来源",
            type: "pie",
            radius: "55%",
            data: [
              { value: 235, name: "视频广告" },
              { value: 274, name: "联盟广告" },
              { value: 310, name: "邮件营销" },
              { value: 335, name: "直接访问" },
              { value: 400, name: "搜索引擎" }
            ],
            label: {
              // 局部通用文本样式  >  全局通用文本样式  可全局设置
              textStyle: {
                color: "rgba(255, 255, 255, 0.3)"
              }
            },
            // 标签引导线颜色设置,可全局设置
            labelLine: {
              lineStyle: {
                color: "rgba(255, 255, 255, 0.3)"
              }
            },
            // 通用样式配置 阴影、透明度、颜色、边框颜色、边框宽度等
            itemStyle: {
              // 设置扇形的颜色
              color: "#c23531",
              // 阴影的大小
              shadowBlur: 200,
              // 阴影水平方向上的偏移
              shadowOffsetX: 0,
              // 阴影垂直方向上的偏移
              shadowOffsetY: 0,
              // 阴影颜色
              shadowColor: "rgba(0, 0, 0, 0.5)"
            }
          }
        ]
      };
      ECharts.setOption(options);
    }
  }
};
</script>

<style lang="scss" scoped></style>
