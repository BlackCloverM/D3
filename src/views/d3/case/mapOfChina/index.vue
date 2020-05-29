<template>
  <div id="world">
    <h3>中国地图</h3>
    <svg id="svg" height="600" width="1024"></svg>
  </div>
</template>
<script>
import * as d3 from "d3";
import * as geo from "d3-geo";
export default {
  data() {
    return {
      places: [
        {
          name: "北京",
          log: "116.3",
          lat: "39.9"
        },
        {
          name: "上海",
          log: "121.4",
          lat: "31.2"
        },
        {
          name: "深圳",
          log: "113",
          lat: "22"
        }
      ]
    };
  },
  mounted() {
    let svg = d3.select("svg");
    let width = svg.attr("width");
    let height = svg.attr("height");
    let g = svg.append("g");

    const projection = geo
      .geoMercator() // 投影方式
      .scale(400) //缩放比例
      .center([105, 38]) // 将中心点设置为经度105，纬度38，这里正好是中国地图的中心点
      .translate([width / 2, height / 2]); // 将投影的中心设置为svg的中心

    // 创建地理路径生成器，使用当前设置的投影
    const path = geo.geoPath(projection);
    // 颜色比例尺
    const colors = d3
      .scaleOrdinal()
      .domain(d3.range(10))
      .range(d3.schemeSet3);

    this.getJson().then(data => {
      g.selectAll("path")
        .data(data.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("fill", function(d, i) {
          return colors(i);
        })
        .attr("stroke", "rgba(255, 255, 255, 0.1")
        .attr("stroke-width", 1)
        .on("mouseover", function() {
          d3.select(this).attr("fill", "red");
        })
        .on("mouseout", function(d, i) {
          d3.select(this).attr("fill", function(d) {
            return colors(i);
          });
        });
    });
    // 根据坐标定位
    const location = svg
      .selectAll(".location")
      .data(this.places)
      .enter()
      .append("g")
      .attr("transform", d => {
        const coor = projection([d.log, d.lat]);
        return "translate(" + coor[0] + "," + coor[1] + ")";
      });
    location
      .append("circle")
      .attr("r", 3)
      .attr("fill", "#e91e63");
  },
  methods: {
    // d3内置的json请求方法
    async getJson() {
      const data = await d3.json(
        "https://geo.datav.aliyun.com/areas_v2/bound/100000_full.json"
      );
      return data;
    }
  }
};
</script>

<style lang="scss" scoped>
#world {
  width: 100%;
  height: 100%;
  background: #888888;
  overflow: hidden;
  #svg {
    margin: 0 auto;
    display: block;
  }
}
</style>
