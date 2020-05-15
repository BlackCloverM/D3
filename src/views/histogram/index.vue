<!--
 * @Author: 马永华
 * @Date: 2020-05-11 14:35:17
 * @LastEditors: 马永华
 * @LastEditTime: 2020-05-13 14:35:22
 * @Description: D3js学习————柱状图
 -->
<template>
  <div>
    <div>柱状图</div>
    <svg width="1000" height="1000"></svg>
  </div>
</template>
<script>
import * as d3 from "d3";
export default {
  data() {
    return {
      rectData: [50, 100, 150, 115, 65, 200, 135, 175, 100] //数据（表示矩形的高度）
    };
  },
  mounted() {
    let svg = d3.select("svg");
    let rectWidth = 25; //矩形的宽度
    let paddingWidth = 5; //矩形间的间隔
    const yBaseLine = 400; //定义的一个常量，表示柱状图x轴距svg图片顶部的高度
    let g = svg.append("g");
    g.attr("transform", "translate(" + 200 + ", " + 0 + ")");
    //定义矩形的定点，宽高，将矩形画出来
    g.selectAll("rect")
      .data(this.rectData)
      .enter()
      .append("rect")
      .on("mouseover", function() {
        d3.select(this)
          .transition()
          .duration(1000)
          .attr("fill", "yellow");
      })
      .on("mouseout", function() {
        d3.select(this)
          .transition()
          .duration(1000)
          .attr("fill", "green");
      })
      .attr("y", d => yBaseLine - d)
      .attr("x", (d, i) => {
        return i * (rectWidth + paddingWidth);
      })
      .attr("height", d => d)
      .attr("width", 0)
      .attr("fill", "pink")
      .attr(
        "transform",
        "translate(" + (rectWidth / 2 + paddingWidth) + ", " + 0 + ")"
      )
      //添加矩形过渡效果
      .transition()
      .duration(1000)
      .delay((d, i) => {
        return i * 500;
      })
      .attr("width", rectWidth);

    //画x轴
    let xScale = d3
      .scaleLinear()
      .range([0, 300])
      .domain([0, 10]);
    let xAxis = d3.axisBottom(xScale).ticks(10);
    g.append("g")
      .call(xAxis)
      .attr("transform", "translate(" + 0 + "," + yBaseLine + ")");
    //画y轴
    let yScale = d3
      .scaleLinear()
      .domain([0, d3.max(this.rectData)])
      .range([d3.max(this.rectData), 0]);

    let yAxis = d3.axisLeft(yScale).ticks(9);

    g.append("g")
      .call(yAxis)
      .attr("transform", "translate(" + 0 + ", " + (yBaseLine - 200) + ")");

    let gs = g
      .selectAll(".rect")
      .data(this.rectData)
      .enter()
      .append("g");
    //添加文本
    gs.append("text")
      .text(d => {
        return d;
      })
      .attr("x", function(d, i) {
        return xScale(i);
      })
      .attr("y", function(d) {
        return yScale(d);
      })
      .attr("transform", "translate(" + 0 + ", " + (yBaseLine - 225) + ")")
      .attr("dx", 17.5)
      .attr("dy", 25)
      .attr("font-size", 0)
      .attr("font-weight", 10)
      .transition()
      .duration(2000)
      .delay((d, i) => {
        return i * 400;
      })
      .attr("font-size", 14);
  }
};
</script>
