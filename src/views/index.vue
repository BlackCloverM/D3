<template>
  <div>
    <div>demo</div>
    <svg width="800" height="800"></svg>
  </div>
</template>
<script>
import * as d3 from "d3";
export default {
  data() {
    return {
      nodes: [
        { name: "香泉" }, //0
        { name: "北川新县城" }, //1
        { name: "桃龙" }, //2
        { name: "泸州" }, //3
        { name: "田田" }, //4
        { name: "二少爷" }, //5
        { name: "小杜" }, //6
        { name: "臭憨憨" }, //7
        { name: "管理员" } //8
      ],
      edges: [
        //value控制线的长短
        { source: 0, target: 5, relation: "籍贯", value: 1.3 },
        { source: 4, target: 5, relation: "基友", value: 1 },
        { source: 4, target: 6, relation: "父子", value: 1 },
        { source: 4, target: 7, relation: "❤", value: 1 },
        { source: 1, target: 4, relation: "籍贯", value: 2 },
        { source: 2, target: 6, relation: "籍贯", value: 0.9 },
        { source: 3, target: 7, relation: "籍贯", value: 1 },
        { source: 5, target: 6, relation: "闺蜜", value: 1.6 },
        { source: 6, target: 7, relation: "塑料姐妹", value: 1 },
        { source: 5, target: 8, relation: "职责", value: 2 }
      ]
    };
  },
  mounted() {
    let svg = d3.select("svg");
    let width = svg.attr("width");
    let height = svg.attr("height");
    let g = svg.append("g");
    let colorScale = d3
      .scaleOrdinal()
      .domain(d3.range(this.nodes.length))
      .range(d3.schemeCategory10);
    let forceSimulation = d3
      .forceSimulation()
      .force("link", d3.forceLink()) //弹簧力模型
      .force("charge", d3.forceManyBody()) //电荷力模型
      .force("center", d3.forceCenter()); //向心力模型
    //设置图形的中心位置
    forceSimulation
      .force("center")
      .x(width / 2)
      .y(height / 2);
    //生成节点数据
    forceSimulation.nodes(this.nodes);
    forceSimulation.on("tick", ticked);
    //生成边数据
    forceSimulation
      .force("link")
      .links(this.edges)
      .distance(function(d) {
        //每一边的长度
        return d.value * 100;
      });
    console.log(this.nodes);
    console.log(this.edges);
    //绘制边
    let links = g
      .append("g")
      .selectAll("line")
      .data(this.edges)
      .enter()
      .append("line")
      .attr("stroke", function(d, i) {
        return colorScale(i);
      })
      .attr("stroke-width", 1);
    //绘制线的文字
    let linksText = g
      .append("g")
      .selectAll("text")
      .data(this.edges)
      .enter()
      .append("text")
      .text(function(d) {
        return d.relation;
      });
    //将节点和文字放在同一个组内
    let gs = g
      .selectAll(".circleText")
      .data(this.nodes)
      .enter()
      .append("g")
      .attr("transform", function(d, i) {
        let cirX = d.x;
        let cirY = d.y;
        return "translate(" + cirX + "," + cirY + ")";
      })
      .call(
        d3
          .drag()
          .on("start", started)
          .on("drag", dragged)
          .on("end", ended)
      );

    //绘制节点
    gs.append("circle")
      .attr("r", 10)
      .attr("fill", function(d, i) {
        return colorScale(i);
      });
    //文字
    gs.append("text")
      .attr("x", -10)
      .attr("y", -20)
      .attr("dy", 10)
      .text(function(d) {
        return d.name;
      });
    function ticked() {
      links
        .attr("x1", function(d) {
          return d.source.x;
        })
        .attr("y1", function(d) {
          return d.source.y;
        })
        .attr("x2", function(d) {
          return d.target.x;
        })
        .attr("y2", function(d) {
          return d.target.y;
        });

      linksText
        .attr("x", function(d) {
          return (d.source.x + d.target.x) / 2;
        })
        .attr("y", function(d) {
          return (d.source.y + d.target.y) / 2;
        });

      gs.attr("transform", function(d) {
        return "translate(" + d.x + "," + d.y + ")";
      });
    }
    //???
    function started(d) {
      if (!d3.event.active) {
        forceSimulation.alphaTarget(0.8).restart(); //设置衰减系数，对节点位置移动过程的模拟，数值越高移动越快，数值范围[0，1]
      }
      d.fx = d.x;
      d.fy = d.y;
    }
    function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }
    function ended(d) {
      if (!d3.event.active) {
        forceSimulation.alphaTarget(0);
      }
      d.fx = null;
      d.fy = null;
    }
  },
  methods: {}
};
</script>
