<template>
  <div>
    <svg class="svg" height="700" width="1000"></svg>
  </div>
</template>

<script>
import * as d3 from "d3";
export default {
  data() {
    return {
      regionA: [
        { x: "", y: 20 },
        { x: "Quarter1", y: 36 },
        { x: "Quarter2", y: 40 },
        { x: "Quarter3", y: 22 },
        { x: "Quarter4", y: 20 }
      ],
      regionB: [
        { x: "", y: 60 },
        { x: "Quarter1", y: 85 },
        { x: "Quarter2", y: 70 },
        { x: "Quarter3", y: 65 },
        { x: "Quarter4", y: 62 }
      ]
    };
  },
  mounted() {
    let svg = d3.select("svg");
    let width = svg.attr("width");
    let height = svg.attr("height");
    let g = svg.append("g");
    let bottomLine = 500; // 离顶部的距离
    let leftLine = 50; // 离左侧的距离
    let xLength = 800; // x轴长度
    let yLength = 440; // y轴长度
    let xAxiosScale = ["", "Quarter1", "Quarter2", "Quarter3", "Quarter4"];

    // 绘制x轴
    let xScale = d3
      .scaleLinear()
      .domain([0, 5])
      .range([0, xLength]);
    let pathB = g.append("path");
    let pathA = g.append("path");
    let xAxis = d3
      .axisBottom(xScale)
      .ticks(5)
      .tickSizeOuter(0)
      .tickPadding(10)
      .tickValues([0, 1, 2, 3, 4])
      .tickFormat(formatXTick);

    let gx = g
      .append("g")
      .call(xAxis)
      .attr("transform", `translate(${leftLine},${bottomLine})`);
    // 去掉第一个刻度
    d3.select(".tick")
      .select("line")
      .remove();
    // 绘制y轴
    let yScale = d3
      .scaleLinear()
      .domain([0, 110])
      .range([yLength, 0]);

    let yAxis = d3
      .axisLeft(yScale)
      .tickValues([0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100])
      .tickPadding(10)
      .tickSizeOuter(0);

    let gy = g
      .append("g")
      .call(yAxis)
      .attr("transform", `translate(${leftLine}, ${bottomLine - yLength})`);

    gy.append("text")
      .text("$")
      .attr("fill", "currentColor")
      .attr("x", "-16")
      .attr("dy", "0.32em");

    // 绘制面积图
    let area_generatorA = d3
      .area()
      .x(function(d, i) {
        return xScale(i);
      })
      .y0(500)
      .y1(function(d) {
        return bottomLine - 4 * d.y;
      });

    pathA
      .attr("d", area_generatorA(this.regionA))
      .attr("fill", "#f3837a")
      .attr("transform", `translate(${leftLine}, 0)`);

    pathB
      .attr("d", area_generatorA(this.regionB))
      .attr("fill", "#fbc1a7")
      .attr("transform", `translate(${leftLine}, 0)`);

    // 画箭头
    let defs = svg.append("defs");
    let arrowMarker = defs
      .append("marker")
      .attr("id", "arrow")
      .attr("markerUnits", "strokeWidth")
      .attr("markerWidth", "12")
      .attr("markerHeight", "12")
      .attr("viewBox", "0 0 12 12")
      .attr("refX", "6")
      .attr("refY", "6")
      .attr("orient", "auto");
    let arrow_path = "M2,2 L10,6 L2,10 L6,6 L2,2";
    arrowMarker
      .append("path")
      .attr("d", arrow_path)
      .attr("fill", "#ccc");

    // 给坐标轴添加箭头
    let arrow = d3.selectAll(".domain").attr("marker-end", "url(#arrow)");

    // 添加文字
    let textA = g
      .selectAll(".textA")
      .data(this.regionA)
      .enter()
      .append("text")
      .text(function(d) {
        return d.y;
      })
      .attr("transform", function(d, i) {
        return `translate(${xScale(i) + leftLine}, ${bottomLine - 4 * d.y})`;
      })
      .attr("fill", "currentColor");

    let textB = g
      .selectAll(".textA")
      .data(this.regionB)
      .enter()
      .append("text")
      .text(function(d) {
        return d.y;
      })
      .attr("transform", function(d, i) {
        return `translate(${xScale(i) + leftLine}, ${bottomLine - 4 * d.y})`;
      })
      .attr("fill", "currentColor");

    // x轴格式化函数  d为tickValues传入的值
    function formatXTick(d, i) {
      return xAxiosScale[i];
    }
  }
};
</script>

<style lang="scss">
.svg {
  user-select: none;
  border: 1px solid #ccc;
  text {
    font-size: 14px;
  }
  .domain {
    stroke: #ccc;
  }
  .tick {
    line {
      stroke: #ccc;
    }
  }
}
</style>
