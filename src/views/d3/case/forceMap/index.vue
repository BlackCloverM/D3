<template>
  <div>
    <h3>力导图</h3>
    <svg width="800" height="600"></svg>
  </div>
</template>

<script>
import * as d3 from "d3";
export default {
  data() {
    return {
      nodes: [
        { name: "香泉" },
        { name: "北川新县城" },
        { name: "桃龙" },
        { name: "泸州" },
        { name: "田田" },
        { name: "二少爷" },
        { name: "小杜" },
        { name: "臭憨憨" },
        { name: "管理员" }
      ],
      edges: [
        //value控制线的长短,source和target未nodes的下标（即连线的规则）
        { source: 0, target: 5, relation: "籍贯", value: 1.3 },
        { source: 4, target: 5, relation: "基友", value: 2 },
        { source: 4, target: 6, relation: "父子", value: 2 },
        { source: 4, target: 7, relation: "❤", value: 2 },
        { source: 1, target: 4, relation: "籍贯", value: 2 },
        { source: 2, target: 6, relation: "籍贯", value: 0.9 },
        { source: 3, target: 7, relation: "籍贯", value: 2 },
        { source: 5, target: 6, relation: "闺蜜", value: 1.6 },
        { source: 6, target: 7, relation: "塑料姐妹", value: 2 },
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

    //生成节点数据
    forceSimulation.nodes(this.nodes);

    //生成边集数据
    forceSimulation
      .force("link")
      .links(this.edges)
      .distance(function(d) {
        return d.value * 100;
      });
    // forceSimulation.alphaMin(0.01);
    // forceSimulation.stop();
    // forceSimulation.restart();
    console.log(this.edges);
    console.log(this.nodes);

    //设置图形的中心位置
    forceSimulation
      .force("center")
      .x(width / 2)
      .y(height / 2);

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

    //绘制线上的文字
    let linkTexts = g
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
      .append("g")
      .selectAll(".circleText")
      .data(this.nodes)
      .enter()
      .append("g");

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

    //绑定tick事件
    forceSimulation.on("tick", ticked);

    //通过call将拖拽对应的元素上
    gs.call(
      d3
        .drag()
        .on("start", started)
        .on("drag", dragged)
        .on("end", ended)
    );
    function ticked() {
      console.log(11);
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
      linkTexts
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
    //拖拽开始时
    function started(d) {
      if (!d3.event.active) {
        forceSimulation.alphaTarget(0.1).restart(); //设置衰减系数，对节点位置移动过程的模拟，数值越高移动越快，数值范围[0，1]
      }
      d.fx = d.x;
      d.fy = d.y;
    }

    //拖拽中
    function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }

    //拖拽结束时
    function ended(d) {
      if (!d3.event.active) {
        forceSimulation.alphaTarget(0);
      }
      //节点解除固定
      d.fx = null;
      d.fy = null;
    }
  }
};
</script>
