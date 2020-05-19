<template>
  <div>
    <div>demo</div>
    <svg width="600" height="400"></svg>
  </div>
</template>
<script>
import * as d3 from "d3";
export default {
  data() {
    return {
      pieData: [50, 150, 115, 65, 135, 175, 100]
    };
  },
  mounted() {
    document.title = "demo";
    let svg = d3.select("svg");
    let arc = d3.arc();
    let pie = d3.pie();
    //将原始数据变成可以绘制饼状图的数据
    let pieData = pie(this.pieData);
    const innerRadius = 0; //内半径
    const outerRadius = 100; //外半径

    let g = svg
      .append("g")
      .attr("transform", "translate(" + 100 + ", " + 100 + ")");
    //颜色比例尺
    let colorScale = d3
      .scaleOrdinal()
      .domain(d3.range(this.pieData.length))
      .range(d3.schemeCategory10);
    let arc_generator = d3
      .arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius);
    let gs = g
      .selectAll(".g")
      .data(pieData)
      .enter()
      .append("g");
    gs.append("path")
      .attr("d", d => {
        return arc_generator(d);
      })
      .attr("fill", (d, i) => {
        return colorScale(i);
      });
    //绘制饼状图上面的文字信息
    gs.append("text")
      .attr("transform", function(d) {
        //位置设在中心处
        return "translate(" + arc_generator.centroid(d) + ")";
      })
      .attr("text-anchor", "middle")
      .text(function(d) {
        return d.data;
      });
  }
};
</script>
