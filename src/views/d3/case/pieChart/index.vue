<template>
  <div>
    <h3>饼状图</h3>
    <svg width="600" height="400"></svg>
  </div>
</template>

<script>
import * as d3 from "d3";
export default {
  data() {
    return {
      pieData: [
        { name: "鞋子", amount: 10 },
        { name: "外套", amount: 20 },
        { name: "内衣", amount: 30 },
        { name: "裤子", amount: 40 },
        { name: "围巾", amount: 20 }
      ]
    };
  },
  mounted() {
    const innerRadius = 0; //内半径
    const outerRadius = 100; //外半径
    const cornerRadius = 10; //拐角半径
    const padAngle = 0.05; //间隙角度
    //颜色比例尺
    let colorScale = d3
      .scaleOrdinal()
      .domain(d3.range(this.pieData.length))
      .range(d3.schemeCategory10);
    let svg = d3.select("svg");
    //生成器
    let arc = d3
      .arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .cornerRadius(cornerRadius);
    //生成数据
    let pie = d3
      .pie()
      .value(function(d) {
        return d.amount;
      })
      .padAngle(padAngle);
    let pieData = pie(this.pieData);

    let g = svg
      .append("g")
      .attr("transform", "translate(" + 200 + "," + 200 + ")");
    let gs = g
      .selectAll(".g")
      .data(pieData)
      .enter()
      .append("g");
    gs.on("mouseover", function() {
      d3.select(this)
        .select("path")
        .transition()
        .duration(0)
        .attr("fill-opacity", 0.5);
    }).on("mouseout", function() {
      d3.select(this)
        .select("path")
        .transition()
        .duration(0)
        .attr("fill-opacity", 1);
    });
    //绘制扇形
    gs.append("path")
      .attr("d", function(d) {
        return arc(d);
      })
      .attr("fill", function(d, i) {
        return colorScale(i);
      });
    //添加文字
    gs.append("text")
      .attr("transform", function(d) {
        return "translate(" + arc.centroid(d) + ")";
      })
      .text(function(d) {
        return d.data.name;
      })
      .attr("text-anchor", "middle");
  }
};
</script>
