<template>
  <div>
    <svg height="800" width="1000"></svg>
  </div>
</template>
<script>
import * as d3 from "d3";
export default {
  data() {
    return {
      dotData: [
        { x: 0, y: 0 },
        { x: 1, y: 5 },
        { x: 2, y: 10 },
        { x: 3, y: 0 },
        { x: 4, y: 6 },
        { x: 5, y: 11 },
        { x: 6, y: 9 },
        { x: 7, y: 4 },
        { x: 8, y: 11 },
        { x: 9, y: 2 }
      ]
    };
  },
  mounted() {
    let svg = d3.select("svg");
    let width = svg.attr("width");
    let height = svg.attr("height");
    let g = svg.append("g");
    let bottomLine = 600;
    let leftLine = 50;

    // x轴
    let xScale = d3
      .scaleLinear()
      .domain([0, 10])
      .range([0, 500]);
    let xAxis = d3
      .axisTop(xScale)
      .ticks(10)
      .tickSize(500)
      .tickPadding(-520);
    let gx = g
      .append("g")
      .call(xAxis)
      .attr("transform", "translate(" + leftLine + ", " + bottomLine + ")");
    gx.selectAll("line").attr("stroke-width", 0.5);
    gx.selectAll("path").attr("stroke-width", 0);
    // y轴
    let yScale = d3
      .scaleLinear()
      .domain([0, 12])
      .range([500, 0]);
    let yAxis = d3
      .axisRight(yScale)
      .ticks(12)
      .tickSize(500)
      .tickPadding(-520);
    let gy = g
      .append("g")
      .call(yAxis)
      .attr(
        "transform",
        "translate(" + leftLine + ", " + (bottomLine - 500) + ")"
      );
    gy.selectAll("line").attr("stroke-width", 0.5);
    gy.selectAll("path").attr("stroke-width", 0);
    //画面积函数
    var area_generator = d3
      .area()
      .x(function(d) {
        return xScale(d.x);
      })
      .y0(500) //面积的高度
      .y1(function(d) {
        return yScale(d.y);
      })
      .curve(d3.curveMonotoneX); //改变线的样式
    //画面积
    console.log(area_generator(this.dotData));
    g.append("path")
      .attr("d", area_generator(this.dotData)) //d="M1,0L20,40.....  d-path data
      .style("fill", "steelblue")
      .attr("transform", "translate(" + leftLine + ", " + 100 + ")");
  },
  methods: {}
};
</script>
