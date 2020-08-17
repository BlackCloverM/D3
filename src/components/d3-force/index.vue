<template>
  <div style="width: 100%;height: 100%" id="container">
    <kr-graph-toolbar-new
      :list="toolbar"
      :options="selectOptions"
      @toolbarClick="toolbarClick"
      :showInfo="isShow"
    ></kr-graph-toolbar-new>
    <kr-graph-left-bottom @toolbarClick="toolbarClickLB"></kr-graph-left-bottom>
    <div id="force_main"></div>
    <kr-right-info :title="infoTitle" :show.sync="isShow">
      <slot name="rightBar"></slot>
    </kr-right-info>
  </div>
</template>

<script>
import d3 from "d3/d3.min.js";
import util from "@/libs/util.js";
import { nodeImages } from "../d3-circular/config";
import {
  toggleNode,
  toggleLine,
  toggleLineText,
  linkToggleLine,
  linkToggleNode,
  linkToggleLineText,
  nodeToggleClick,
  clearStatus
} from "./methods";
export default {
  name: "d3-force-layout",
  components: {},
  props: {
    selectOptions: {
      type: Array,
      default: () => []
    },
    toolbar: {
      type: Array,
      default: () => []
    },
    infoTitle: { type: String, default: "设置" },
    showRightBar: {
      type: Boolean,
      default: false
    },
    nodes: {
      type: Array,
      default: () => [],
      required: true
    },
    links: {
      type: Array,
      default: () => [],
      required: true
    },
    nodeKey: {
      type: String,
      default: "id"
    },
    sourceKey: {
      type: String,
      default: "source"
      // 默认用户知晓边起点的key为“source”
    },
    targetKey: {
      type: String,
      default: "target"
      // 默认用户知晓组件边终点数据的key为target
    },
    linkTextKey: {
      type: String,
      default: "lineText"
    },
    nodeTextKey: {
      type: String,
      default: "nodeText"
    },
    options: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    isShow(val) {
      this.$emit("close", val);
    },
    showRightBar(val) {
      this.isShow = val;
    },
    options: {
      handler() {
        this.reBuildD3Chart();
      },
      deep: true,
      immediate: true
    }
  },
  data() {
    return {
      isShow: false,
      linkMap: {},
      nodeMap: {},
      maxY: 0,
      minY: 0,
      screenWidth: 1600, // 屏幕宽度
      imageWidth: 18, // 节点图片宽度
      imageHeight: 18, // 节点图片高度
      distanceX: 300, // x轴间距
      distanceY: 200, // y轴间距
      left: 50, // 容器的偏移量
      initScale: 1, // 初始化比例，
      labelWidth: 24, // 连线文字标签的宽度
      labelHeight: 16, // 连线文字高度
      nodeFontSize: 14, // 节点文字大小
      labelFontSize: 12, // 连线文字大小
      // 下面的是由代码自动生成的
      width: 0, // 容器宽度
      height: 0, // 容器高度
      centerX: 0, // 中心点x位置
      centerY: 0, // 中心点y位置
      x: 0, // d3图的偏移量
      distance: 60, // 连线的长度
      nodeConf: {
        fillColor: {
          "3": "#362A33", // 涉毒
          "1": "#0F3E47" // 普通
        },
        analyser: {
          "1": "#BBE0E0", // 普通分析对象
          "3": "#FFDDDC" // 涉毒分析对象
        },
        borderColor: {
          "3": "#C23531",
          "2": "#FF9966",
          "1": "#33CCCC"
        },
        strokeColor: "none",
        strokeWidth: 1,
        textFillColor: "#fff",
        radius: 16
      },
      lineConf: {
        strokeColor: "rgb(82,90,90)"
      },
      nodeTextFontSize: 12,
      lineTextFontSize: 12,
      translate: [0, 0]
    };
  },
  mounted() {
    this.screenWidth = document.getElementById("force_main").offsetWidth;
    this.height = document.getElementById("force_main").offsetHeight;
    this.reBuildD3Chart();
  },
  activated() {
    //进入页面的时候创建事件监听（离开页面的时候要移除事件监听）
    window.onresize = this.changeResize;
  },
  methods: {
    toolbarClick(type, value) {
      if (value == "回到中心") {
        this.zoom.translate([0, 0]);
        this.zoom.scale([1]);
        this.changeZoom();
        return;
      }
      this.$emit("toolbarClick", type, value);
    },

    toolbarClickLB(type) {
      switch (type) {
        case "放大":
          this.zoom.scale([this.zoom.scale() + 0.2]);
          this.changeZoom();
          break;
        case "缩小":
          this.zoom.scale([this.zoom.scale() - 0.2]);
          this.changeZoom();
          break;
        case "全屏":
          var fullDiv = document.getElementById("container");
          util.fullscreen(fullDiv);
          this.changeResize();
          break;
        case "退出全屏":
          util.fullscreen();
          break;
      }
    },
    changeResize() {
      this.screenWidth = document.getElementById("container").offsetWidth;
      this.height = document.getElementById("container").offsetHeight;
      this.force.size([this.screenWidth, this.height]);
      d3.select("svg .background")
        .attr("width", this.screenWidth)
        .attr("height", this.height);

      d3.select("#force_main")
        .select("svg")
        .attr("width", this.screenWidth)
        .attr("height", this.height);
    },
    changeZoom() {
      this.translate = this.zoom.translate();
      this.container.attr(
        "transform",
        "translate(" +
          this.translate.join(",") +
          ")scale(" +
          this.zoom.scale() +
          ")"
      );
    },

    reBuildD3Chart() {
      this.emptyData();
      this.initD3();
    },
    emptyData() {
      d3.select("#force_main")
        .select("svg")
        .remove();
    },
    zoomFn() {
      const { translate, scale } = d3.event;
      translate[0] = translate[0] + this.x;
      this.translate = translate;
      this.container.attr(
        "transform",
        "translate(" + translate + ")scale(" + scale + ")"
      );
    },
    rewriteChartConfig() {
      for (let key in this.options) {
        if (this.hasOwnProperty(key)) {
          // 添加判断仅覆盖内部需要的数据
          this[key] = this.options[key];
        }
      }
    },
    rewriteNodeData(nodeArr) {
      return nodeArr.map((node, index) => {
        node.index = index;
        this.nodeMap[node[this.nodeKey]] = index;
        return node;
      });
    },
    rewriteLinkData(linkArr) {
      let { nodeKey, sourceKey, targetKey, nodeMap } = this;
      return linkArr.map((link, index) => {
        let obj = {};
        obj.source = nodeMap[link[sourceKey]];
        obj.target = nodeMap[link[targetKey]];
        obj.index = index;
        this.linkMap[`${link[sourceKey]}-${link[targetKey]}`] = link;
        return obj;
      });
    },
    initD3() {
      this.force = d3.layout
        .force()
        .size([this.screenWidth, this.height]) // 画布的大小
        .linkDistance(200) // 连线长度
        .charge(-1000); // 排斥/吸引，值越小越排斥

      // 全图缩放器
      this.zoom = d3.behavior
        .zoom()
        .scaleExtent([0.25, 2])
        .on("zoom", this.zoomFn);

      // 节点拖拽器（使用 d3.behavior.drag 节点拖动失效）
      this.drag = this.force
        .drag()
        .origin(d => d)
        .on("dragstart", this.dragstartFn)
        .on("drag", this.dragFn)
        .on("dragend", this.dragendFn);

      // SVG
      this.svg = d3
        .select("#force_main")
        .append("svg")
        .attr("width", this.screenWidth)
        .attr("height", this.height)
        .append("g")
        .call(this.zoom)
        .on("dblclick.zoom", null);
      // 缩放层（位置必须在 container 之前）
      this.zoomOverlay = this.svg
        .append("rect")
        .attr("width", this.screenWidth)
        .attr("height", this.height)
        .attr("class", "background")
        .style("fill", "none")
        .style("cursor", "move")
        .style("pointer-events", "all");
      // .on("click", () => {
      //   this.clearStatus();
      // });

      this.container = this.svg
        .append("g")
        .attr("transform", "scale(" + this.initScale + ")")
        .attr("class", "container");

      this.draw();
    },
    draw() {
      let _this = this;
      let nodes = this.rewriteNodeData(this.nodes);
      let edges = this.rewriteLinkData(this.links);
      // 绑定力导向图数据
      this.force
        .nodes(nodes) // 设定节点数组
        .links(edges); // 设定连线数组

      // 开启力导向布局
      this.force.start();
      // 手动快速布局
      for (let i = 0, n = 1000; i < n; ++i) {
        this.isTrick = true; //true表示在计算过程中 false表示计算完成
        this.force.tick();
      }
      this.isTrick = false;
      // 停止力布局
      this.force.stop();

      // 固定所有节点
      nodes.forEach(node => {
        node.fixed = true;
      });
      this.nodeData = nodes;
      this.linkData = edges;
      // 节点连线
      this.linkLine = this.container
        .append("g")
        .selectAll(".link")
        .data(this.force.links())
        .enter()
        .append("path")
        .attr("class", "link")
        .attr({
          d: link => this.genLinkPath(link),
          id: link => "link-" + link.id
        })
        .style("stroke", () => this.lineConf.strokeColor);
      // 连线的文字
      this.lineText = this.container
        .append("g")
        .selectAll(".linetext")
        .data(this.force.links())
        .enter()
        .append("text")
        .style("font-size", this.lineTextFontSize)
        .attr({
          class: "linetext",
          id: link => "linktext" + link.id,
          dx: link => this.getLineTextDx(link),
          dy: 5
        });
      //线点击事件
      this.linkLine
        .on("click", currLink => {
          _this.isLinkClick = true;
          _this.$emit("linkClick", currLink);
        })
        .on("mouseenter", currLink => {
          if (this.isLinkClick || this.isNodeClick) {
            return;
          }
          //设置定时器0.1秒之后触发（避免鼠标快速滑过造成的页面闪烁）
          this.timer = setTimeout(() => {
            linkToggleNode.call(this, currLink, true);
            linkToggleLine.call(this, currLink, true);
            linkToggleLineText.call(this, currLink, true);
          }, 100);
        })
        .on("mouseleave", currLink => {
          if (this.isLinkClick) {
            this.isLinkClick = false; // 释放掉点击事件
            return;
          }
          //清除定时器
          window.clearTimeout(this.timer);
          toggleNode.call(this, this.nodeCircle, currLink, false);
          toggleLine.call(this, this.linkLine, currLink, false);
          toggleLineText.call(this, this.lineText, currLink, false);
        });
      this.lineText
        .append("textPath")
        .attr("xlink:href", link => "#link-" + link.id)
        .text(link => link.score);
      // 节点（圆）
      this.nodeCircle = this.container
        .append("g")
        .selectAll(".node")
        .data(this.force.nodes())
        .enter()
        .append("g")
        .style("cursor", "pointer")
        .attr("class", "node")
        .call(this.drag); // 节点可拖动
      //添加circle
      this.nodeCircle
        .append("circle")
        .style("fill", node => {
          if (node.isAnalysiser) {
            // 分析人员
            return _this.nodeConf.analyser[node.drugType == 3 ? "3" : "1"];
          }
          // 其他人员
          return _this.nodeConf.fillColor[node.drugType] || "1";
        })
        .style(
          "stroke",
          node => this.nodeConf.borderColor[node.drugType || "1"]
        )
        .style("stroke-width", this.nodeConf.strokeWidth)
        .attr("class", "node-circle")
        .attr("id", node => "node-circle-" + node.name)
        .attr("r", this.nodeConf.radius);
      // 节点图片
      this.nodeCircle

        .append("circle")
        .attr("class", "img-circle")
        .attr("r", () => this.nodeConf.radius)
        .style("fill", d => {
          //创建圆形图片
          var defs = this.svg
            .append("defs")
            .attr("id", "imgdefs" + d[_this.nodeKey]);

          var catpattern = defs
            .append("pattern")
            .attr("id", "catpattern" + d[_this.nodeKey])
            .attr("height", 1)
            .attr("width", 1);

          var width =
              d[_this.nodeKey] != this.$route.query.mapId
                ? this.imageWidth
                : 24,
            height =
              d[_this.nodeKey] != this.$route.query.mapId
                ? this.imageHeight
                : 24;
          var img = "";
          if (d.isAnalysiser || d.realName || d.realname) {
            img = nodeImages["person"]["isAnalyser"];
          } else {
            let nodeType = d.nodeType || "person";

            let userType = d.drugType == 3 ? "drugUser" : "normal";
            img = nodeImages[nodeType][userType];
          }
          catpattern
            .append("image")
            .attr("x", -(width / 2 - this.nodeConf.radius))
            .attr("y", -(height / 2 - this.nodeConf.radius))
            .attr("width", width)
            .attr("height", height)
            .attr("xlink:href", img);
          if (d.id == this.$route.query.mapId) {
            d.drugType = d.drugType;
          }
          return "url(#catpattern" + d[_this.nodeKey] + ")";
        });
      // 节点文字
      this.nodeCircle
        // .filter(node => node.id != this.$route.query.mapId)
        .append("text")
        .attr("class", "nodetext")
        .attr("id", node => "node-text-" + node.id)
        .style("font-size", this.nodeTextFontSize)
        .style("font-weight", 400)
        .style("fill", () => this.nodeConf.textFillColor)
        .attr("text-anchor", "middle")
        .attr("dy", "2em")
        .text(d => {
          return d[this.nodeTextKey];
        });
      this.nodeCircle
        .on("mouseenter", currNode => {
          this.isClick = false;
          toggleNode.call(this, this.nodeCircle, currNode, true);
          toggleLine.call(this, this.linkLine, currNode, true);
          toggleLineText.call(this, this.lineText, currNode, true);
        })
        .on("mouseleave", currNode => {
          this.isNodeClick = false; // 释放掉点击事件
          if (this.isClick) {
            return;
          }
          toggleNode.call(this, this.nodeCircle, currNode, false);
          toggleLine.call(this, this.linkLine, currNode, false);
          toggleLineText.call(this, this.lineText, currNode, false);
        })
        .on("click", currNode => {
          this.isClick = true;
          this.isNodeClick = true;
          nodeToggleClick.call(this, currNode);
          _this.$emit("nodeClick", currNode);
        });
      // 更新力导向图
      // 注意1：必须调用一次 tick （否则，节点会堆积在左上角）
      // 注意2：调用位置必须在 nodeCircle, nodeText, linkLine, lineText 后
      setTimeout(() => {
        this.tick();
      }, 0);

      // 监听力学图运动事件，更新坐标
      this.force.on("tick", this.tick);
    },
    // 生成关系连线路径
    genLinkPath(link) {
      let sx = link.source.x;
      let tx = link.target.x;
      let sy = link.source.y;
      let ty = link.target.y;

      return "M" + sx + "," + sy + " L" + tx + "," + ty;
    },
    getLineTextDx(d) {
      const sr = this.nodeConf.radius;
      const sx = d.source.x;
      const sy = d.source.y;
      const tx = d.target.x;
      const ty = d.target.y;

      const distance = Math.sqrt(Math.pow(tx - sx, 2) + Math.pow(ty - sy, 2));

      // const textLength = d.label.length;
      const textLength = (d.labels || "asd").toString().length;
      const deviation = 8; // 调整误差
      const dx =
        (distance - sr - textLength * this.lineTextFontSize) / 2 + deviation;
      return dx;
    },

    //计算线文字的角度
    getLineTextAngle(d, bbox) {
      if (d.target.x < d.source.x) {
        const { x, y, width, height } = bbox;
        const rx = x + width / 2;
        const ry = y + height / 2;
        return "rotate(180 " + rx + " " + ry + ")";
      } else {
        return "rotate(0)";
      }
    },
    tick() {
      const shelf = this;

      if (!this.draging) {
        //不是推拽事件的时候
        if (!this.isTrick) {
          //trick函数计算位置完成的时候再更新点的位置（这样可以减少节点变动，提高性能)
          // 节点位置
          this.nodeCircle.attr(
            "transform",
            node => "translate(" + node.x + "," + node.y + ")"
          );
          // 连线路径
          this.linkLine.attr("d", link => this.genLinkPath(link));
          // 连线文字位置
          this.lineText.attr("dx", link => this.getLineTextDx(link));
          // 连线文字角度
          this.lineText.attr("transform", function(link) {
            return shelf.getLineTextAngle(link, this.getBBox());
          });
        }
      } else {
        //是拖拽事件且没按住crtl的时候只更新拖拽点的位置（其它点位置不变动）
        if (!this.isCrtl) {
          // 节点位置
          this.nodeCircle
            .filter(node => node.id == this.dragNode.id) //筛选拖拽点更新位置
            .attr(
              "transform",
              node => "translate(" + node.x + "," + node.y + ")"
            );
          // 连线路径
          this.linkLine
            .filter(
              link =>
                link.source.id == this.dragNode.id ||
                link.target.id == this.dragNode.id
            )
            .attr("d", link => this.genLinkPath(link));
          // 连线文字位置
          this.lineText
            .filter(
              link =>
                link.source.id == this.dragNode.id ||
                link.target.id == this.dragNode.id
            )
            .attr("dx", link => this.getLineTextDx(link));
          // 连线文字角度
          this.lineText
            .filter(
              link =>
                link.source.id == this.dragNode.id ||
                link.target.id == this.dragNode.id
            )
            .attr("transform", function(link) {
              return shelf.getLineTextAngle(link, this.getBBox());
            });
        } else {
          //是拖拽事件且按住crtl的时候拖动当前节点和与其相关的一级节点（其它点位置不变动）

          var moveNoeIds = [],
            movePx = this.dragNode.px - this.dragNodePx,
            movePy = this.dragNode.py - this.dragNodePy;
          this.linkData.map(value => {
            if (value.source.id == this.dragNode.id) {
              if (value.target.weight == 1) {
                moveNoeIds.push(value.target.id);
              }
            } else if (value.target.id == this.dragNode.id) {
              if (value.source.weight == 1) {
                moveNoeIds.push(value.source.id);
              }
            }
          });
          // 节点位置
          this.nodeCircle
            .filter(node => {
              if (node.id == this.dragNode.id) {
                return true;
              } else if (
                moveNoeIds.findIndex(value => value == node.id) != -1
              ) {
                node.x = node.x + movePx;
                node.y = node.y + movePy;
                node.px = node.px + movePx;
                node.py = node.py + movePy;
                return true;
              } else {
                return false;
              }
            })
            .attr(
              "transform",
              node => "translate(" + node.x + "," + node.y + ")"
            );
          // 连线路径
          this.linkLine
            .filter(
              link =>
                link.source.id == this.dragNode.id ||
                link.target.id == this.dragNode.id
            )
            .attr("d", link => this.genLinkPath(link));
          // 连线文字位置
          this.lineText
            .filter(
              link =>
                link.source.id == this.dragNode.id ||
                link.target.id == this.dragNode.id
            )
            .attr("dx", link => this.getLineTextDx(link));
          // 连线文字角度
          this.lineText
            .filter(
              link =>
                link.source.id == this.dragNode.id ||
                link.target.id == this.dragNode.id
            )
            .attr("transform", function(link) {
              return shelf.getLineTextAngle(link, this.getBBox());
            });

          this.dragNodePx = this.dragNode.px;
          this.dragNodePy = this.dragNode.py;
        }
      }
    },
    virtualNodeClick(primaryId) {
      this.isClick = true;
      this.isNodeClick = true;
      let obj = {};
      obj[this.nodeKey] = primaryId;
      nodeToggleClick.call(this, obj);
    },
    hideNodes(key, value, blockStyle) {
      let _this = this;
      this.nodeCircle.style("display", node => {
        return node[key] == value && !node.isAnalysiser ? blockStyle : "";
      });
      let nodeArr = [];
      this.nodeCircle.filter(node => {
        if (node[key] == value && !node.isAnalysiser) {
          nodeArr.push(node[_this.nodeKey]);
        }
      });
      _this.linkLine.style("display", link => {
        if (
          nodeArr.includes(link.target[_this.nodeKey]) ||
          nodeArr.includes(link.source[_this.nodeKey])
        ) {
          return blockStyle;
        } else {
          return "";
        }
      });
    }
  },
  created() {},
  deactivated() {
    // 离开当前页面的时候移除事件监听
    window.removeEventListener("resize", this.changeResize);
  },
  destroyed() {
    // 销毁当前页面的时候移除事件监听
    window.removeEventListener("resize", this.changeResize);
  }
};
</script>
<style lang="scss" scoped></style>
<style>
#force_main {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

text {
  pointer-events: none;
  user-select: none;
}

.node:hover {
  cursor: pointer;
}

.link {
  stroke-opacity: 1;
  stroke-width: 2;
  cursor: pointer;
}
.link-active {
  stroke-opacity: 1;
  stroke-width: 3;
}
.linetext {
  font-family: Microsoft YaHei;
  fill: #fff;
}
</style>
