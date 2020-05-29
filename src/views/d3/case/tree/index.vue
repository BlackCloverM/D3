<template>
  <div>
    <h3>树状图</h3>
    <svg width="800" height="800"></svg>
  </div>
</template>
<script>
import * as d3 from "d3";
export default {
  data() {
    return {
      address: {
        name: "中国",
        children: [
          {
            name: "浙江",
            children: [
              { name: "杭州", value: 100 },
              { name: "宁波", value: 100 },
              { name: "温州", value: 100 },
              { name: "绍兴", value: 100 }
            ]
          },
          {
            name: "广西",
            children: [
              {
                name: "桂林",
                children: [
                  { name: "秀峰区", value: 100 },
                  { name: "叠彩区", value: 100 },
                  { name: "象山区", value: 100 },
                  { name: "七星区", value: 100 }
                ]
              },
              { name: "南宁", value: 100 },
              { name: "柳州", value: 100 },
              { name: "防城港", value: 100 }
            ]
          },
          {
            name: "黑龙江",
            children: [
              { name: "哈尔滨", value: 100 },
              { name: "齐齐哈尔", value: 100 },
              { name: "牡丹江", value: 100 },
              { name: "大庆", value: 100 }
            ]
          },
          {
            name: "新疆",
            children: [
              { name: "乌鲁木齐" },
              { name: "克拉玛依" },
              { name: "吐鲁番" },
              { name: "哈密" }
            ]
          }
        ]
      }
    };
  },
  mounted() {
    let svg = d3.select("svg");
    let width = svg.attr("width");
    let height = svg.attr("height");
    let g = svg.append("g");

    // 构建完整的层级数据
    let hierarchyData = d3.hierarchy(this.address).sum(function(d) {
      return d.value;
    });

    //创建一个树状图

    let tree = d3
      .tree()
      .size([width - 400, height - 200])
      .separation(function(a, b) {
        return (a.parent == b.parent ? 1 : 2) / a.depth;
      });
    let treeData = tree(hierarchyData);
    let nodes = treeData.descendants();
    let links = treeData.links();

    //曲线生成器
    let Bézier_curve_generator = d3
      .linkHorizontal()
      .x(function(d) {
        return d.y;
      })
      .y(function(d) {
        return d.x;
      });

    //绘制边
    g.append("g")
      .selectAll("path")
      .data(links)
      .enter()
      .append("path")
      .attr("d", function(d) {
        let start = { x: d.source.x, y: d.source.y };
        let end = { x: d.target.x, y: d.target.y };
        return Bézier_curve_generator({ source: start, target: end });
      })
      .attr("fill", "none")
      .attr("stroke", "green")
      .attr("stroke-width", 1);

    var gs = g
      .append("g")
      .selectAll("g")
      .data(nodes)
      .enter()
      .append("g")
      .attr("transform", function(d) {
        return "translate(" + d.y + "," + d.x + ")";
      });
    //绘制节点
    gs.append("circle")
      .attr("r", 6)
      .attr("fill", "white")
      .attr("stroke", "pink")
      .attr("stroke-width", 1);

    //文字
    gs.append("text")
      .attr("x", function(d) {
        return d.children ? -60 : 8;
      })
      .attr("y", -5)
      .attr("dy", 10)
      .text(function(d) {
        return d.data.name;
      });
  }
};
</script>
