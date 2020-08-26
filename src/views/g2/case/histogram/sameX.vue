<!-- 解决G2不能展示相同x轴坐标的问题 -->
<template>
  <div>
    <div id="bar"></div>
  </div>
</template>

<script>
import { registerTheme, Chart } from "@antv/g2";
export default {
  data() {
    return {
      dialogData: [
        {
          amount: 1200,
          dealTime: "2015-10-14 03:54:54",
          card: "621937129111748"
        },
        {
          amount: 1400,
          dealTime: "2015-10-15 03:54:54",
          card: "621937129111747"
        },
        {
          amount: 600,
          dealTime: "2015-10-16 03:54:54",
          card: "621937129111749"
        },
        {
          amount: 1200,
          dealTime: "2015-10-17 03:54:54",
          card: "621937129111747"
        }
      ]
    };
  },
  methods: {
    initChart() {
      // 处理数据 添加唯一项
      this.dialogData.map((item, index) => {
        item.id = item.card + index;
      });
      const chart = new Chart({
        container: "bar",
        autoFit: true,
        height: 300
      });
      // 设置柱状图最大宽度
      registerTheme("newTheme", {
        maxColumnWidth: 40
      });
      chart.theme("newTheme");

      chart.scale("amount", {
        nice: true
      });
      // x轴数据格式化
      chart.axis("id", {
        label: {
          // 使用 formatter 回调函数
          formatter: val => {
            return val.split(" ")[0];
          }
        }
      });
      // 设置留白, 图形与侧边的距离的百分比
      chart.scale("card", {
        shared: true,
        range: [0.2, 0.8]
      });
      chart.tooltip({
        showTitle: false,
        showMarkers: false, // 不展示 tooltip markers  即柱状图上边的点
        itemTpl: `
                <ul class="g2-tooltip-list">
                    <li class="g2-tooltip-list-item">
                        <span class="g2-tooltip-marker" style="background: {color};"></span>
                        <span class="g2-tooltip-name">交易账号：</span>
                        <span class="g2-tooltip-value">{card}</span>
                    </li>
                    <li class="g2-tooltip-list-item">
                        <span class="g2-tooltip-marker" style="background: {color};"></span>
                        <span class="g2-tooltip-name">交易金额：</span>
                        <span class="g2-tooltip-value">{amount}</span>
                    </li>
                    <li class="g2-tooltip-list-item">
                        <span class="g2-tooltip-marker" style="background: {color};"></span>
                        <span class="g2-tooltip-name">交易时间：</span>
                        <span class="g2-tooltip-value">{dealTime}</span>
                    </li>
                </ul>
                `
      });
      chart.data(this.dialogData);
      chart.interaction("active-region"); // 使用 active-region 交互行为
      chart
        .interval()
        .position("id*amount")
        .tooltip("card*amount*dealTime", (card, amount, dealTime) => {
          return {
            card,
            amount,
            dealTime
          };
        });

      chart.render();
    }
  },
  mounted() {
    this.initChart();
  }
};
</script>

<style lang="scss" scoped></style>
