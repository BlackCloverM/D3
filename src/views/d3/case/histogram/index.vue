<template>
  <div>
    <h3>国外疫情TOP10——百度</h3>
    <div class="toolTip">
      <div class="country"></div>
      <div class="incre">
        <span class="icon"></span>新增：<span class="amount">18951</span>
      </div>
    </div>
    <svg width="1000" height="600"></svg>
  </div>
</template>
<script>
import * as d3 from "d3";
export default {
  data() {
    return {
      epidemicData: [
        { name: "美国", amount: 20685 },
        { name: "俄罗斯", amount: 10899 },
        { name: "巴西", amount: 8446 },
        { name: "印度", amount: 3475 },
        { name: "英国", amount: 3403 },
        { name: "秘鲁", amount: 3237 },
        { name: "墨西哥", amount: 1997 },
        { name: "土耳其", amount: 1704 },
        { name: "巴基斯坦", amount: 1662 },
        { name: "智利", amount: 1658 }
      ]
    };
  },

  mounted() {
    const _this = this;
    const rectWidth = 20; //定义矩形的宽度
    const yLength = 420; //柱状图y轴的长度
    //定义矩形的高度
    const rectHeight = d3
      .scaleLinear()
      .domain([0, this.maxHeight() + 5000])
      .range([0, yLength]);
    const interval = 20; //定义矩形间的间隔
    //柱状图x轴的长度
    const xLength = (rectWidth + interval) * this.epidemicData.length;
    const baseLine = 450; //定义一个基线的位置，调整柱状图的位置
    const xTick = this.epidemicData.length; //x轴的刻度数目
    const yTick = 6; //y轴刻度数目
    let svg = d3.select("svg");
    //g——分组，可以简单的将他视为一个容器的作用
    let g = svg.append("g");
    let gy = g.append("g"); //将分组提前，改变d3的层级
    let rect = g
      .attr("transform", "translate(" + 100 + ", " + 0 + ")")
      .selectAll("rect")
      .data(this.epidemicData)
      .enter()
      .append("rect")
      .attr("x", (d, i) => i * (rectWidth + interval))
      .attr("y", d => baseLine - rectHeight(d.amount))
      .attr("width", rectWidth)
      .attr("height", d => rectHeight(d.amount))
      .attr("fill", d => {
        return this.retColor(d.amount);
      });
    rect
      .on("mousemove", _this.throttle(_this.moveEvent, 200))
      .on("mouseover", function() {
        d3.select(this)
          .transition()
          .duration(0)
          .attr("fill", "#f9d774");
      })
      .on("mouseout", function(d) {
        d3.select(".toolTip").style("display", "none");
        d3.select(this)
          .transition()
          .attr("fill", _this.retColor(d.amount));
      });
    //画出x轴
    let xScale = d3
      .scaleBand()
      .domain(this.address())
      .range([0, xLength]);

    let xAxis = d3
      .axisBottom(xScale)
      .ticks(xTick)
      .tickPadding(30);

    let gx = g
      .append("g")
      .call(xAxis)
      .attr("transform", "translate(" + -45 + ", " + baseLine + ")");
    gx.selectAll("text")
      .style("color", "#bebebe")
      .attr("transform", "rotate(" + -45 + ")");
    gx.selectAll("line").attr("stroke", "");
    gx.selectAll("path").attr("stroke", "");

    //画出y轴

    let yScale = d3
      .scaleLinear()
      .domain([0, this.maxHeight() + 5000])
      .range([yLength, 0]);
    let yAxis = d3.axisLeft(yScale).ticks(yTick);

    gy.call(yAxis).attr(
      "transform",
      "translate(" + -10 + ", " + (baseLine - yLength) + ")"
    );
    gy.selectAll("line")
      .attr("stroke", "#CCC")
      .attr("x2", xLength)
      .attr("stroke-width", 0.5);
    gy.selectAll("path").attr("stroke", "");
    gy.selectAll("text").style("color", "#bebebe");
  },

  methods: {
    //返回最大值
    maxHeight() {
      return this.epidemicData.reduce((total, curVal) => {
        return total > curVal.amount ? total : curVal.amount;
      }, 0);
    },
    //根据数值范围返回颜色字符串
    retColor(amount) {
      if (amount < 6000) {
        return "#f6b46c";
      } else if (amount < 12000) {
        return "#ea774d";
      } else {
        return "#d92121";
      }
    },
    //将epidemicData中的国家单独抽成一个数组
    address() {
      return this.epidemicData.reduce((total, curVal) => {
        total.push(curVal.name);
        return total;
      }, []);
    },
    //节流
    throttle(fn, duration) {
      let lastTime = 0;
      return function(params) {
        let now = new Date().getTime();
        if (now - lastTime > duration) {
          fn(params);
          lastTime = new Date().getTime();
        }
      };
    },
    //在矩形上移动产生的变化
    moveEvent(d) {
      let mouse = d3.event;
      let yPosition = mouse.pageY + 20;
      let xPosition = mouse.pageX + 20;
      let toolTip = d3
        .select(".toolTip")
        .style("left", xPosition + "px")
        .style("top", yPosition + "px")
        .style("display", "flex");
      d3.select(".country").text(d.name);
      d3.select(".amount").text(d.amount);
      d3.select(".icon").style("background", "red");
    }
  }
};
</script>
<style lang="scss" scoped>
.toolTip {
  position: absolute;
  height: 56px;
  width: 110px;
  border: 0.5px solid #cccccc;
  border-radius: 5px;
  padding-left: 10px;
  display: none;
  font-size: 14px;
  flex-flow: column;
  justify-content: space-around;
  background: #fff;
  .icon {
    display: inline-block;
    height: 8px;
    width: 8px;
    border-radius: 50%;
    margin-right: 5px;
  }
}
</style>
