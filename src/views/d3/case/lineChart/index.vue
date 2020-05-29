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
    let xValue = [
      "16-07-20",
      "16-07-21",
      "16-07-22",
      "16-07-23",
      "16-07-24",
      "16-07-25",
      "16-07-26",
      "16-07-27",
      "16-07-28",
      "16-07-29"
    ];
    let tickNum = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    // x轴
    let xScale = d3
      .scaleLinear()
      .domain([0, 10])
      .range([0, 500]);
    let xAxis = d3
      .axisTop(xScale)
      .ticks(10)
      .tickSize(500)
      .tickPadding(-520)
      // 自定义刻度   如果tickvalues内部数组的元素为数字则可以直接使用，否则要经过处理
      .tickValues(tickNum) //数组长度应和原来的刻度数目一致
      .tickFormat(formatTick);
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

    //画线函数
    let line_generator = d3
      .line()
      // 配置x和y
      .x(function(d) {
        return xScale(d.x);
      })
      .y(function(d) {
        return yScale(d.y);
      });
    // .curve(d3.curveMonotoneX);//转换成曲线
    console.log(line_generator(this.dotData));
    //画路径
    g.append("path")
      .attr("d", line_generator(this.dotData))
      .attr("fill", "none")
      .attr("stroke-width", 1)
      .attr("stroke", "red")
      .attr("transform", "translate(" + leftLine + ", " + 100 + ")");

    //生成正方形，并移动到指定位置
    g.selectAll(".symbol")
      .data(this.dotData)
      .enter()
      .append("path")
      .attr("d", d3.symbol().type(d3.symbolSquare))
      .attr("transform", function(d) {
        return (
          "translate(" +
          (xScale(d.x) + leftLine) +
          ", " +
          (yScale(d.y) + 100) +
          ")"
        );
      });
    // 生成图例
    let legendData = [
      { x: 15, y: 15 },
      { x: 16, y: 15 }
    ];
    g.append("path")
      .attr("d", line_generator(legendData))
      .attr("fill", "none")
      .attr("stroke-width", 1)
      .attr("stroke", "red")
      .attr("transform", "translate(" + -100 + "," + 300 + ")");
    g.append("path")
      .attr("d", d3.symbol().type(d3.symbolSquare))
      .attr("transform", "translate(" + 675 + ", " + 175 + ")");
    g.append("text")
      .text("图例")
      .attr("transform", "translate(" + 710 + ", " + 180 + ")");
    // 格式函数
    function formatTick(d, i) {
      return xValue[i];
    }
  },
  methods: {}
};
</script>
