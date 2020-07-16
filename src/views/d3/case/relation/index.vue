<template>
  <div>
    <h3>关系图</h3>
    <svg width="1000" height="400"></svg>
  </div>
</template>

<script>
import * as d3 from "d3";
export default {
  mounted() {
    let nodes = [{ name: "二少爷" }, { name: "北川" }, { name: "刘田" }];
    let edges = [
      //value控制线的长短,source和target为nodes的下标（即连线的规则）
      { source: 0, target: 1, relation: "籍贯", value: 2 },
      { source: 0, target: 2, relation: "基友", value: 2 },
      { source: 1, target: 2, relation: "住址", value: 2 }
    ];
    let svg = d3.select("svg");
    let width = svg.attr("width");
    let height = svg.attr("height");
    let g = svg.append("g").attr("transform", `translate(${40}, ${60})`);
    let colorScale = d3
      .scaleOrdinal()
      .domain(edges.length)
      .range(d3.schemeCategory10);

    // 缩放
    let zoom = d3
      .zoom()
      .scaleExtent([0.5, 3]) // 设置最小和最大的缩放比例
      // 缩放过程中
      .on("zoom", zoomed)
      // 缩放开始时
      .on("start", function() {
        console.log("start");
      })
      // 缩放结束时
      .on("end", function() {
        console.log("end");
      });
    function zoomed() {
      g.attr("transform", function() {
        console.log("zoom");
        // console.log(d3.event);
        return d3.event.transform;
      });
    }
    svg.call(zoom);

    let forceSimulation = d3
      .forceSimulation()
      .force("link", d3.forceLink()) //弹簧力模型
      .force("charge", d3.forceManyBody()) //电荷力模型
      .force(
        "center",
        d3
          .forceCenter()
          .x(width / 2)
          .y(height / 2)
      ); //向心力模型  同时绑定中心位置

    //生成节点数据
    forceSimulation.nodes(nodes);

    console.table(nodes);

    //生成边集数据
    forceSimulation.force(
      "link",
      d3.forceLink(edges).distance(function(d) {
        return d.value * 100;
      })
    );

    // console.table(edges);

    // 布局计算 手动控制计算次数
    for (let i = 0, n = 30; i < n; ++i) {
      forceSimulation.tick();
    }

    // forceSimulation.stop();
    // forceSimulation.restart();

    // 固定节点
    nodes.map(value => {
      value.fx = value.x;
      value.fy = value.y;
    });

    //绘制边
    let links = g
      .append("g")
      .selectAll("line")
      .data(edges)
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
      .data(edges)
      .enter()
      .append("text")
      .text(function(d) {
        return d.relation;
      });

    //将节点和文字放在同一个组内
    let gs = g
      .append("g")
      .selectAll(".circleText")
      .data(nodes)
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
      // d.fx = null;
      // d.fy = null;
    }
  }
};
</script>

<style lang="scss" scoped>
svg {
  border: 1px solid red;
}
</style>
