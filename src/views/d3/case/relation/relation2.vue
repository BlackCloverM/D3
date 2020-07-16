<template>
  <div id="full">
    <div class="toolbar">
      <template v-for="item in toolbarList">
        <el-tooltip
          v-if="item.type == 'radio'"
          class="item"
          effect="dark"
          popper-class="toolbarBottomTooltip"
          :content="item.name"
          placement="bottom"
          :key="item.name"
        >
          <div
            class="radioButton"
            @click="toolbarClick(item)"
            @mouseenter="toolbarBottomFullscreen"
            :style="item.isCheck ? 'background-color: #3da6ff' : ''"
          >
            <i :class="item.icon"></i>
          </div>
        </el-tooltip>
        <el-tooltip
          v-if="item.type == 'button'"
          class="item"
          effect="dark"
          popper-class="toolbarBottomTooltip"
          :content="item.name"
          placement="bottom"
          :key="item.name"
        >
          <div
            class="radioButton"
            @click="toolbarClick(item)"
            @mouseenter="toolbarBottomFullscreen"
          >
            <i :class="item.icon"></i>
          </div>
        </el-tooltip>
      </template>
    </div>
    <div class="toolbarBottom">
      <div v-for="(item, index) in toolbarBottomList" :key="index">
        <el-tooltip
          class="item"
          style="margin-top: 10px"
          effect="dark"
          :content="toolbarBottomTooltip(item.name)"
          :hide-after="0"
          popper-class="toolbarBottomTooltip"
          placement="right"
          :key="item.name"
          v-if="item.is"
        >
          <div
            ref="div"
            class="radioButton"
            @click="toolbarBottomClick(item.name)"
            @mouseenter="toolbarBottomFullscreen"
          >
            <i :class="item.icon"></i>
          </div>
        </el-tooltip>
      </div>
    </div>
    <div class="graphBox" id="main" style="height:800px"></div>
  </div>
</template>

<script>
import * as d3 from "d3";
import { cloneDeep } from "lodash";
import person from "@/assets/person.png";
export default {
  data() {
    return {
      //数据源
      graph: {
        nodes: [
          { id: "1", name: "张1" },
          { id: "2", name: "张2" },
          { id: "3", name: "张3" },
          { id: "4", name: "张4" }
        ],
        links: [
          { source: "1", target: "2", label: "关系1", id: 1 },
          { source: "1", target: "3", label: "关系2", id: 2 },
          { source: "1", target: "4", label: "关系3", id: 3 }
        ]
      },
      // 上方工具栏tooltip
      toolbarList: [
        {
          name: "添加节点",
          icon: "el-icon-plus",
          isCheck: false,
          type: "radio"
        },
        {
          name: "添加关系",
          icon: "el-icon-s-operation",
          isCheck: false,
          type: "radio"
        },
        {
          name: "自定义删除",
          icon: "el-icon-delete",
          isCheck: false,
          type: "radio"
        },
        {
          name: "回到中心",
          icon: "el-icon-s-home",
          isCheck: false,
          type: "button"
        },
        {
          name: "刷新",
          icon: "el-icon-refresh",
          isCheck: false,
          type: "button"
        }
      ],
      // 左侧工具栏tooltip
      toolbarBottomList: [
        { name: "全屏", icon: "el-icon-full-screen", is: true },
        { name: "退出全屏", icon: "el-icon-full-screen", is: false },
        { name: "上一步", icon: "el-icon-back", is: true },
        { name: "下一步", icon: "el-icon-right", is: true },
        { name: "放大", icon: "el-icon-zoom-in", is: true },
        { name: "缩小", icon: "el-icon-zoom-out", is: true }
      ],

      //节点、连线相关数据
      nodesMap: {},
      linksMap: {},
      nodesData: [],
      linksData: [], //处理过的线
      linesData: [], //未处理的线
      menus: [
        { event: "扩展", proportion: 1 },
        { event: "删除", proportion: 1 }
      ],
      menusClickNode: "",

      timer: "",
      isCtrl: false,
      isSpace: false,
      dragNode: "", //正在拖动的点
      dragNodeX: "", //拖动点X偏移
      dragNodeY: "", //拖动点Y偏移,
      moveNodes: [],
      dragStartPos: {},
      dragEndPos: {},
      isAddNode: false,
      isAddLine: false,
      isDeleteNodes: false, //自定删除
      addId: 1,
      addD3Event: "", //添加时的点击事件,
      addLineNodes: [],
      stepList: [],
      stepIndex: "end",
      zoomTransform: "",

      //svg 样式相关数据
      width: "",
      height: "",
      nodeConf: {
        fillColor: "#33CCCC",
        borderColor: "#33CCCC",
        strokeColor: "none",
        strokeWidth: 1,
        textFillColor: "#727272",
        radius: 20,
        clickFillColor: "#33CCCC"
      },
      lineConf: {
        strokeColor: "#727272",
        lineTextFontSize: 12,
        strokeWidth: 2
      },
      menusConf: {
        innerRadius: 20,
        outerRadius: 50,
        fillColor: "rgba(51,204,204,0.7)",
        hoverFillColor: "rgba(51,204,204,1)",
        textFill: "#fff"
      },

      //图形配置项
      scaleExtent: [0.2, 3], //缩放范围
      clickDistance: 3, //拖动距离小于这个值的视为点击事件
      isFixed: true,
      dragMoveTtoggleNode: true, //是否开启按住空格拖动时移动相关一级节点,
      isMaker: true //是否显示箭头
    };
  },
  mounted() {
    document.getElementById("main").oncontextmenu = function() {
      return false;
    };
    document.addEventListener("fullscreenchange", () => {
      var isFull = document.webkitIsFullScreen;
      this.toolbarBottomList.map(value => {
        if (value.name == "全屏") {
          value.is = !isFull;
        }
        if (value.name == "退出全屏") {
          value.is = isFull;
        }
      });
    });
    this.width = document.getElementById("main").offsetWidth;
    this.height = document.getElementById("main").offsetHeight;
    console.log(this.height);
    if (this.dragMoveTtoggleNode) {
      //开启事件监听
      this.createEventListener();
    }
    this.createSvg();
  },
  methods: {
    //创建图形
    createSvg() {
      // 缩放器
      this.zoom = d3
        .zoom()
        .scaleExtent(this.scaleExtent)
        .on("start", this.zoomStart)
        .on("zoom", this.zoomFn)
        .on("end", this.zoomEnd);

      this.drag = d3
        .drag()
        .clickDistance(this.clickDistance)
        .on("start", this.dragstartFn)
        .on("drag", this.dragFn)
        .on("end", this.dragendFn);

      // SVG
      this.svg = d3
        .select("#main")
        .append("svg")
        .attr("width", this.width)
        .attr("height", this.height)
        .append("g")
        .call(this.zoom)
        .on("dblclick.zoom", null);

      // 缩放层
      this.zoomOverlay = this.svg
        .append("rect")
        .attr("width", this.width)
        .attr("height", this.height)
        .attr("class", "background")
        .style("fill", "none")
        .style("cursor", "move")
        .style("pointer-events", "all")
        .on("click", () => {
          this.clearStatus();
          if (this.isAddNode) {
            let addNode = {
              id: "add" + this.addId,
              name: "添加" + this.addId,
              fx: d3.event.offsetX,
              fy: d3.event.offsetY,
              x: d3.event.offsetX,
              y: d3.event.offsetY
            };
            this.addNodeLine([addNode], []);
            this.addId += 1;
          }
        })
        .on("mousedown", () => {
          // if (d3.event.button == 0){
          //     this.isZoomMove=false
          // }
        });

      //监听添加关系事件
      this.svg.on("mousemove", () => {
        if (this.isAddLine && this.addLineNodes.length == 1) {
          var transform = d3.zoomTransform(this.svg.node());

          d3.select("#main")
            .select(".container")
            .insert("path", "#linkGroup")
            .attr("class", "movePath");

          var m =
            "M" +
            this.addLineNodes[0].x +
            "," +
            this.addLineNodes[0].y +
            " L" +
            (d3.event.offsetX / transform.k - transform.x / transform.k) +
            "," +
            (d3.event.offsetY / transform.k - transform.y / transform.k);
          d3.select(".movePath")
            .style("stroke", () => this.lineConf.strokeColor)
            .attr("stroke-dasharray", "2 2")
            .attr("d", m);
        }
      });

      this.container = this.svg.append("g").attr("class", "container");

      //监听框选事件
      this.selectEvent();

      //连线组
      this.linkLineGroup = this.container.append("g").attr("id", "linkGroup");

      // 连线文字组
      this.lineTextGroup = this.container.append("g");

      //节点组
      this.nodeCircleGroup = this.container.append("g");

      //初始化节点和边的数据
      this.initNodeAndLine(cloneDeep(this.graph), [
        this.width / 2,
        this.height / 2
      ]);
    },

    //初始化数据
    initNodeAndLine(graphData, center) {
      const shelf = this;

      let { nodes, links } = graphData;

      this.linesData = [...links];

      this.linksMap = this.getLinksMap(links);

      // 生成 nodes map
      this.nodesMap = this.getNodesMap(nodes);

      //节点数据
      this.nodesData = nodes;

      //连线数据
      this.linksData = this.getLinksData(links);

      this.force = d3
        .forceSimulation()
        .force("charge", d3.forceManyBody().strength(-200))
        .force(
          "center",
          center ? d3.forceCenter(center[0], center[1]) : () => {}
        )
        .alphaTarget(1);

      this.force.nodes(this.nodesData);
      this.force.force(
        "link",
        d3
          .forceLink(this.linksData)
          .id(d => d.id)
          .distance(150)
      );

      // 布局计算 手动控制计算次数
      for (let i = 0, n = 1000; i < n; ++i) {
        this.force.tick();
      }
      // 停止力布局
      this.force.stop();

      // 固定所有节点
      this.nodesData.forEach(node => {
        node.fx = node.x;
        node.fy = node.y;
      });

      //创建节点和边
      this.createNodeAndLine();

      // 监听力学图运动事件，更新坐标
      this.force.on("tick", this.tick);
    },

    //创建节点和边
    createNodeAndLine() {
      const shelf = this;
      // 节点g
      var enterNode = this.nodeCircleGroup
        .selectAll(".node")
        .data(this.nodesData)
        .enter()
        .append("g")
        .style("cursor", "pointer")
        .attr("class", "node")
        .attr("id", node => "node-" + node.id)
        .call(this.drag); // 节点可拖动

      //添加circle
      enterNode
        .append("circle")
        .style("fill", node => this.nodeConf.fillColor)
        .style("stroke", this.nodeConf.strokeColor)
        .style("stroke-width", 5)
        .attr("class", "node-circle")
        .attr("id", node => "node-circle-" + node.id)
        .attr("r", this.nodeConf.radius)
        .style("fill", d => {
          //创建圆形图片
          var defs = this.svg.append("defs").attr("id", "imgdefs" + d.id);

          var catpattern = defs
            .append("pattern")
            .attr("id", "catpattern" + d.id)
            .attr("height", 1)
            .attr("width", 1);

          catpattern
            .append("image")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", this.nodeConf.radius * 2)
            .attr("height", this.nodeConf.radius * 2)
            .attr("xlink:href", person);

          return "url(#catpattern" + d.id + ")";
        });
      // 鼠标交互
      enterNode
        .on("mouseenter", currNode => {
          //设置定时器0.1秒之后触发（避免鼠标快速滑过造成的页面闪烁）
          this.timer = setTimeout(() => {
            this.toggleNode(this.nodeCircle, currNode, true);
            this.toggleLine(this.linkLine, currNode, true);
            this.toggleLineText(this.lineText, currNode, true);
          }, 100);
        })
        .on("mouseleave", currNode => {
          this.deleteMenu();
          //清除定时器
          this.isClick = false;
          window.clearTimeout(this.timer);
          this.toggleNode(this.nodeCircle, currNode, false);
          this.toggleLine(this.linkLine, currNode, false);
          this.toggleLineText(this.lineText, currNode, false);
        })
        .on("mousedown", function(currNode) {
          if (shelf.menus.length && d3.event.button == 2) {
            shelf.menusClickNode = currNode;
            shelf.createMenu(this);
          }
        })
        .on("click", currNode => {
          this.nodeToggleClick(currNode);
          if (this.isAddLine) {
            if (this.addLineNodes.length > 1) {
              this.addLineNodes.splice(0, 1);
            }
            this.addLineNodes.push(currNode);
            if (this.addLineNodes.length == 2) {
              var line = {
                source: this.addLineNodes[0].id,
                target: this.addLineNodes[1].id,
                label: "新加关系",
                id: "ll" + this.addId
              };
              if (this.linksMap[line.source + "-" + line.target]) {
                this.$message.warning("已存在关系");
              } else {
                this.addNodeLine([], [line]);
                this.addId += 1;
              }
              this.addLineNodes = [];
              d3.select(".movePath").remove();
              this.clearStatus();
            }
          }
        });

      // 节点文字
      enterNode
        .append("text")
        .attr("class", "nodetext")
        .attr("id", node => "node-text-" + node.id)
        .style("font-size", this.nodeTextFontSize)
        .style("font-weight", 400)
        .style("fill", () => this.nodeConf.textFillColor)
        .attr("text-anchor", "middle")
        .attr("dy", "2.5em")
        .text(d => d.name);
      if (this.isMaker) {
        this.container
          .append("marker")
          .attr("id", "resolved")
          .attr("markerUnits", "strokeWidth")
          .style("fill", this.lineConf.strokeColor)
          .attr("markerWidth", "6")
          .attr("markerHeight", "6")
          .attr("viewBox", "0 0 12 12")
          .attr("refX", this.nodeConf.radius + 10)
          .attr("refY", "6")
          .attr("orient", "auto")
          .append("path")
          .style("stroke", this.lineConf.strokeColor)
          .attr("d", "M2,2 L10,6 L2,10 L6,6 L2,2");
      }
      var enterLine = this.linkLineGroup
        .selectAll(".link")
        .data(this.linksData)
        .enter()
        .append("path")
        .attr("class", "link")
        .attr("d", link => this.getLinkPath(link))
        .attr("id", link => "link-" + link.id)
        .style("stroke", this.lineConf.strokeColor)
        .style("stroke-width", this.lineConf.strokeWidth)
        .style("cursor", "pointer")
        .attr("marker-end", "url(#resolved)");

      //线事件
      enterLine
        .on("click", currNode => {
          this.lineClick(currNode);
        })
        .on("mouseenter", currNode => {
          //设置定时器0.1秒之后触发（避免鼠标快速滑过造成的页面闪烁）
          this.timer = setTimeout(() => {
            this.linkToggleNode(currNode, true);
            this.linkToggleLine(currNode, true);
            this.linkToggleLineText(currNode, true);
          }, 100);
        })
        .on("mouseleave", currNode => {
          if (this.isClick) {
            return;
          }
          //清除定时器
          window.clearTimeout(this.timer);
          this.toggleNode(this.nodeCircle, currNode, false);
          this.toggleLine(this.linkLine, currNode, false);
          this.toggleLineText(this.lineText, currNode, false);
        });

      // 连线的文字
      var enterLineText = this.lineTextGroup
        .selectAll(".linetext")
        .data(this.linksData)
        .enter()
        .append("text")
        .style("font-size", this.lineTextFontSize)
        .attr("class", "linetext")
        .attr("id", link => "linktext" + link.id)
        .attr("dx", link => this.getLineTextDx(link))
        .attr("dy", "5")
        .style("cursor", "pointer");

      enterLineText
        .append("textPath")
        .attr("xlink:href", link => "#link-" + link.id)
        .text(link => link.label);

      enterLineText
        .on("click", currNode => {
          this.lineClick(currNode);
        })
        .on("mouseenter", currNode => {
          //设置定时器0.1秒之后触发（避免鼠标快速滑过造成的页面闪烁）
          this.timer = setTimeout(() => {
            this.linkToggleNode(currNode, true);
            this.linkToggleLine(currNode, true);
            this.linkToggleLineText(currNode, true);
          }, 100);
        })
        .on("mouseleave", currNode => {
          if (this.isClick) {
            return;
          }
          //清除定时器
          window.clearTimeout(this.timer);
          this.toggleNode(this.nodeCircle, currNode, false);
          this.toggleLine(this.linkLine, currNode, false);
          this.toggleLineText(this.lineText, currNode, false);
        });

      this.bindNodeLine();
      this.tick();
    },

    //绑定数据
    bindNodeLine() {
      this.nodeCircle = this.nodeCircleGroup
        .selectAll(".node")
        .data(this.nodesData);
      this.linkLine = this.linkLineGroup
        .selectAll(".link")
        .data(this.linksData);
      this.lineText = this.lineTextGroup
        .selectAll(".linetext")
        .data(this.linksData);
    },

    zoomStart() {
      this.zoomTransform = cloneDeep(d3.event.transform);
    },
    //缩放和平移
    zoomFn() {
      const { transform } = d3.event;
      this.container.attr("transform", transform);
    },

    zoomEnd() {
      let transform = cloneDeep(d3.event.transform);
      this.addStep({
        type: "zoom",
        transformStart: this.zoomTransform,
        transformEnd: transform
      });
    },

    // 更新位置
    tick() {
      const shelf = this;
      this.nodeCircle.attr(
        "transform",
        node => "translate(" + node.x + "," + node.y + ")"
      );
      // 连线路径
      this.linkLine.attr("d", link => this.getLinkPath(link));
      // 连线文字位置
      this.lineText
        .attr("dx", link => this.getLineTextDx(link))
        .attr("transform", function(link) {
          return shelf.getLineTextAngle(link, this.getBBox());
        });
    },

    // 拖动时更新坐标位置，只更新拖拽相关节点
    dragMove(moveNode) {
      const shelf = this;
      this.nodeCircle
        .filter(node => this.isdragMoveNode(moveNode, node))
        .attr("transform", node => "translate(" + node.x + "," + node.y + ")");
      // 连线路径
      this.linkLine
        .filter(link => this.isdragMoveLine(moveNode, link))
        .attr("d", link => this.getLinkPath(link));
      // 连线文字位置
      this.lineText
        .filter(link => this.isdragMoveLine(moveNode, link))
        .attr("dx", link => this.getLineTextDx(link))
        .attr("transform", function(link) {
          return shelf.getLineTextAngle(link, this.getBBox());
        });
    },

    //判断是否是拖拽需要移动的节点
    isdragMoveNode(moveNode, node) {
      if (this.dragMoveTtoggleNode == false || this.isSpace == false) {
        return moveNode.id == node.id ? true : false;
      } else {
        if (moveNode.id == node.id) {
          return true;
        } else {
          let is =
            (this.linksMap[moveNode.id + "-" + node.id] ||
              this.linksMap[node.id + "-" + moveNode.id]) &&
            node.weight == 1;
          if (is) {
            node.x += this.dragNodeX;
            node.y += this.dragNodeY;
            node.fx = node.x;
            node.fy = node.y;
          }
          return is;
        }
      }
    },

    //获取移动节点
    getMoveNodes(moveNode) {
      var nodes = [];
      this.nodesData.map(node => {
        if (this.dragMoveTtoggleNode == false || this.isSpace == false) {
          if (moveNode.id == node.id) {
            nodes.push(node);
          }
        } else {
          if (moveNode.id == node.id) {
            nodes.push(node);
          } else {
            let is =
              (this.linksMap[moveNode.id + "-" + node.id] ||
                this.linksMap[node.id + "-" + moveNode.id]) &&
              node.weight == 1;
            if (is) {
              node.x += this.dragNodeX;
              node.y += this.dragNodeY;
              node.fx = node.x;
              node.fy = node.y;
              nodes.push(node);
            }
          }
        }
      });
      return nodes;
    },

    //判断是否是拖拽需要移动的边
    isdragMoveLine(moveNode, link) {
      return link.source.id == moveNode.id || link.target.id == moveNode.id
        ? true
        : false;
    },

    //开始移动
    dragstartFn(d) {
      this.dragNode = d;
      this.dragNodeX = 0;
      this.dragNodeY = 0;
      this.moveNodes = [];
      this.dragStartPos.x = d.x;
      this.dragStartPos.y = d.y;
    },

    //拖动中
    dragFn(d) {
      this.dragNodeX = d3.event.x - d.x;
      this.dragNodeY = d3.event.y - d.y;
      d.x = d3.event.x;
      d.y = d3.event.y;
      this.dragMove(d);
    },

    //拖动结束
    dragendFn(d) {
      let x, y;
      d.fx = d.x;
      d.fy = d.y;
      this.dragEndPos.x = d.x;
      this.dragEndPos.y = d.y;
      this.dragNode = "";
      x = this.dragEndPos.x - this.dragStartPos.x;
      y = this.dragEndPos.y - this.dragStartPos.y;
      if (
        Math.abs(x) > this.clickDistance ||
        Math.abs(y) > this.clickDistance
      ) {
        this.addStep({
          type: "drag",
          nodes: this.getMoveNodes(d),
          startPos: this.dragStartPos,
          endPos: this.dragEndPos
        });
      }
    },

    //生成节点map
    getNodesMap(nodes) {
      const hash = {};
      nodes.map(value => {
        value.weight = 0;
        this.linesData.map(line => {
          if (line.source == value.id || line.target == value.id) {
            value.weight += 1;
          }
        });
        hash[value.id] = value;
      });

      return hash;
    },

    //生成节点map
    getLinksMap(links) {
      const hash = {};
      links.map(value => {
        const key = value.source + "-" + value.target;
        hash[key] = value;
      });
      return hash;
    },

    //生产连线数据
    getLinksData(links) {
      let data = [];
      links.map(value => {
        let item = { ...value };
        item.source = this.nodesMap[item.source];
        item.target = this.nodesMap[item.target];
        data.push(item);
      });
      return data;
    },

    // 生成关系连线路径
    getLinkPath(link) {
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
      const textLength = d.label.toString().length;
      const deviation = 8; // 调整误差
      const dx =
        (distance - sr - textLength * this.lineConf.lineTextFontSize) / 2 +
        deviation;

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

    //节点hover时改变节点的opacity
    toggleNode(nodeCircle, currNode, isHover) {
      if (isHover) {
        nodeCircle.sort((a, b) => (a.id === currNode.id ? 1 : -1));
        this.nodesData.sort((a, b) => (a.id === currNode.id ? 1 : -1));
        nodeCircle
          .style("opacity", 0.1)
          .filter(node => this.isLinkNode(currNode, node))
          .style("opacity", 1);
      } else {
        nodeCircle.style("opacity", 1);
      }
    },

    //节点hover时改变线的opacity
    toggleLine(linkLine, currNode, isHover) {
      if (isHover) {
        // 加重连线样式
        linkLine
          .style("opacity", 0.1)
          .filter(link => this.isLinkLine(currNode, link))
          .style("opacity", 1)
          .classed("link-active", true);
      } else {
        // 连线恢复样式
        linkLine.style("opacity", 1).classed("link-active", false);
      }
    },

    //节点hover时改变线文字的opacity
    toggleLineText(lineText, currNode, isHover) {
      if (isHover) {
        // 只显示相连连线文字
        lineText.style("fill-opacity", link =>
          this.isLinkLine(currNode, link) ? 1.0 : 0.0
        );
      } else {
        // 显示所有连线文字
        lineText.style("fill-opacity", "1.0");
      }
    },

    //线hover时改变线的opacity
    linkToggleLine(currNode, isHover) {
      if (isHover) {
        // 加重连线样式
        this.linkLine
          .style("opacity", 0.1)
          .filter(link => {
            if (
              link.source.id == currNode.source.id &&
              link.target.id == currNode.target.id
            ) {
              return true;
            } else {
              return false;
            }
          })
          .style("opacity", 1)
          .classed("link-active", true);
      } else {
        // 连线恢复样式
        this.linkLine.style("opacity", 1).classed("link-active", false);
      }
    },

    //线hover时改变节点的opacity
    linkToggleNode(currNode, isHover) {
      if (isHover) {
        this.nodeCircle
          .style("opacity", 0.1)
          .filter(
            node =>
              node.id == currNode.target.id || node.id == currNode.source.id
          )
          .style("opacity", 1);
      } else {
        this.nodeCircle.style("opacity", 1);
      }
    },

    //线hover时改变线文字的opacity
    linkToggleLineText(currNode, isHover) {
      if (isHover) {
        // 只显示相连连线文字
        this.lineText.style("fill-opacity", link =>
          link.source.id == currNode.source.id &&
          link.target.id == currNode.target.id
            ? 1.0
            : 0.0
        );
      } else {
        // 显示所有连线文字
        this.lineText.style("fill-opacity", "1.0");
      }
    },

    //节点选中时的状态
    nodeToggleClick(currNode) {
      const shelf = this;
      this.nodeCircle.each(function(node) {
        if (node.id == currNode.id) {
          d3.select(this)
            .select("circle")
            .style("stroke", shelf.nodeConf.clickFillColor)
            .style("stroke-width", 5);
        } else {
          d3.select(this)
            .select("circle")
            .style("stroke", "none")
            .style("stroke-width", 0);
        }
      });
    },

    //判断是否是连线节点
    isLinkNode(currNode, node) {
      var is = false;
      if (currNode.id === node.id) {
        return true;
      }
      this.linksData.map(value => {
        if (value.source.id == node.id && value.target.id == currNode.id) {
          is = true;
        }
        if (value.target.id == node.id && value.source.id == currNode.id) {
          is = true;
        }
      });
      return is;
    },

    isLinkLine(node, link) {
      return link.source.id == node.id || link.target.id == node.id;
    },

    //边点击事件
    lineClick(line) {
      console.log(line);
    },

    //创建鼠标右键菜单
    createMenu(th) {
      const shelf = this;
      var menu = d3
        .select(th)
        .append("g")
        .attr("id", "graphNodeMenu");
      var arc_generator = d3
        .arc()
        .innerRadius(this.menusConf.innerRadius)
        .outerRadius(this.menusConf.outerRadius);

      var angle_data = d3.pie().value(d => {
        return d.proportion;
      });

      var pieg = menu
        .selectAll("g")
        .data(angle_data(this.menus))
        .enter()
        .append("g")
        .attr("class", "pie")
        .style("fill", this.menusConf.fillColor)
        .on("click", d => {
          this.menuClick(d.data.event);
          this.deleteMenu();
          this.toggleNode(this.nodeCircle, {}, false);
          this.toggleLine(this.linkLine, {}, false);
          this.toggleLineText(this.lineText, {}, false);
          d3.event.stopPropagation();
        })
        .on("mouseover", function() {
          d3.select(this).style("fill", shelf.menusConf.hoverFillColor);
        })
        .on("mouseleave", function() {
          d3.select(this).style("fill", shelf.menusConf.fillColor);
        });

      //pie
      pieg
        .append("path")
        .attr("d", arc_generator)
        .style("stroke", "rgba(255,255,255)")
        .style("stroke-width", 4)
        .on("click", d => {
          this.menuClick(d.data.event);
          this.deleteMenu();
          this.toggleNode(this.nodeCircle, {}, false);
          this.toggleLine(this.linkLine, {}, false);
          this.toggleLineText(this.lineText, {}, false);
          d3.event.stopPropagation();
        });

      //text
      pieg
        .append("text")
        .text(d => {
          return d.data.event;
        })
        .attr("transform", d => {
          var deg = (((d.startAngle + d.endAngle) / Math.PI) * 180) / 2;
          return (
            "translate(" + arc_generator.centroid(d) + ") rotate(" + deg + ")"
          );
        })
        .attr("text-anchor", "middle")
        .attr("dy", "5")
        .style("fill", this.menusConf.textFill)
        .attr("class", "pieText");
    },

    //节点菜单点击
    menuClick(type) {
      switch (type) {
        case "扩展":
          this.addData(this.menusClickNode);
          break;
        case "删除":
          this.deleteNodes([this.menusClickNode]);
          break;
      }
    },

    //删除邮件菜单
    deleteMenu() {
      d3.selectAll("#graphNodeMenu").remove();
    },

    //删除节点
    deleteNodes(nodes, isStep) {
      const shelf = this;
      let deleteNodes = [],
        deleteLines = [];
      nodes.forEach(node => {
        this.nodeCircle.filter(function(d) {
          if (d.id == node.id) {
            d3.select(this).remove();
            var index = shelf.nodesData.findIndex(d => d.id == node.id);
            deleteNodes.push(shelf.nodesData[index]);
            shelf.nodesData.splice(index, 1);
          }
        });
        this.linkLine.filter(function(line) {
          if (line.source.id == node.id || line.target.id == node.id) {
            d3.select(this).remove();
            var ind = shelf.linksData.findIndex(l => line.id == l.id);
            var ind1 = shelf.linesData.findIndex(l => line.id == l.id);
            deleteLines.push(shelf.linesData[ind1]);
            shelf.linksData.splice(ind, 1);
            shelf.linesData.splice(ind, 1);
          }
        });
        this.lineText.filter(function(line) {
          if (line.source.id == node.id || line.target.id == node.id) {
            d3.select(this).remove();
          }
        });
      });
      if (!isStep) {
        this.addStep({
          type: "delete",
          nodes: deleteNodes,
          links: deleteLines
        });
      }
      this.bindNodeLine();
    },

    //删除线
    deleteLine(lines) {
      const shelf = this;
      lines.forEach(node => {
        this.linkLine.filter(function(line) {
          if (line.source.id == node.id || line.target.id == node.id) {
            d3.select(this).remove();
            var ind = shelf.linksData.findIndex(l => line.id == l.id);
            var ind1 = shelf.linesData.findIndex(l => line.id == l.id);
            shelf.linksData.splice(ind, 1);
            shelf.linesData.splice(ind, 1);
          }
        });
        this.lineText.filter(function(line) {
          if (line.source.id == node.id || line.target.id == node.id) {
            d3.select(this).remove();
          }
        });
      });
      this.bindNodeLine();
    },

    //添加节点
    addData(node) {
      let nodes = [],
        links = [];
      for (let n = 0; n < 100; n++) {
        nodes.push({ id: node.id + n, name: "张" + node.id + n });
        links.push({
          source: node.id,
          target: node.id + n,
          label: "关系1",
          id: node.id + n
        });
      }
      this.addNodeLine(nodes, links);
    },

    //添加节点和线
    addNodeLine(nodes, lines, isStep) {
      let addNodes = [],
        addLinks = [];
      nodes.map(value => {
        let index = this.nodesData.findIndex(n => n.id == value.id);
        if (index == -1) {
          this.nodesData.push(value);
          addNodes.push(value);
        }
      });
      lines.map(value => {
        let index = this.linesData.findIndex(
          l =>
            (l.source == value.source && l.target == value.target) ||
            (l.target == value.source && l.source == value.target)
        );
        if (index == -1) {
          this.linesData.push(value);
          addLinks.push(value);
        }
      });
      this.initNodeAndLine({
        nodes: this.nodesData,
        links: this.linesData
      });
      if (!isStep) {
        this.addStep({
          type: "add",
          nodes: addNodes,
          links: addLinks
        });
      }
    },

    //创建事件监听
    createEventListener() {
      const shelf = this;
      document.addEventListener("keydown", shelf.keydownEvent);
      document.addEventListener("keyup", shelf.keyupEvent);
    },

    //监听键盘keydown事件
    keydownEvent(event) {
      const shelf = this;
      var e = event || window.event || arguments.callee.caller.arguments[0];
      if (e && e.keyCode == 32) {
        shelf.isSpace = true;
        event.preventDefault();
        return false;
      }
      if (e && e.keyCode == 17) {
        shelf.isCtrl = true;
        event.preventDefault();
        return false;
      }
      if (e && e.keyCode == 90) {
        if (shelf.isCtrl) {
          shelf.previousStep();
        }
      }
      if (e && e.keyCode == 89) {
        if (shelf.isCtrl) {
          shelf.nextStep();
        }
      }
    },

    //监听键盘keydup事件
    keyupEvent(event) {
      const shelf = this;
      var e = event || window.event || arguments.callee.caller.arguments[0];
      if (e && e.keyCode == 32) {
        shelf.isSpace = false;
      }
    },

    //头部工具栏操作
    toolbarClick(item) {
      if (item.type == "radio") {
        this.toolbarList.map(value => {
          if (value.name != item.name && value.type == "radio") {
            value.isCheck = false;
          }
          if (value.name == item.name) {
            value.isCheck = !value.isCheck;
          }
        });
      }
      this.isAddNode = false;
      this.isAddLine = false;
      this.isDeleteNodes = false;
      this.addLineNodes = [];
      switch (item.name) {
        case "添加节点":
          this.clearStatus();
          this.isAddNode = item.isCheck;
          break;
        case "添加关系":
          this.clearStatus();
          this.isAddLine = item.isCheck;
          break;
        case "自定义删除":
          this.clearStatus();
          this.isDeleteNodes = item.isCheck;
          this.zoomOverlay.style(
            "cursor",
            this.isDeleteNodes ? "crosshair" : "move"
          );
          this.stopZoom();
          break;
        case "回到中心":
          var zoom = d3.zoomTransform(this.svg.node()),
            zoomStart = cloneDeep(zoom);
          zoom.k = 1;
          zoom.x = 0;
          zoom.y = 0;
          this.addStep({
            type: "zoom",
            transformStart: zoomStart,
            transformEnd: cloneDeep(zoom)
          });
          d3.zoom().transform(this.svg, zoom);
          this.container.attr("transform", zoom);
          break;
        case "刷新":
          this.emptyData();
          this.createSvg();
          break;
      }
    },

    //左下角工具栏操作
    toolbarBottomClick(type) {
      switch (type) {
        case "全屏":
          var fullDiv = document.getElementById("full");
          this.fullscreen(fullDiv);
          break;
        case "退出全屏":
          this.fullscreen();
          break;
        case "放大":
          var zoom = d3.zoomTransform(this.svg.node()),
            x = zoom.x,
            y = zoom.y,
            zoomStart = cloneDeep(zoom);
          zoom.k =
            zoom.k + 0.4 < this.scaleExtent[1]
              ? zoom.k + 0.4
              : this.scaleExtent[1];
          zoom.x = x;
          zoom.y = y;
          this.addStep({
            type: "zoom",
            transformStart: zoomStart,
            transformEnd: cloneDeep(zoom)
          });
          d3.zoom().transform(this.svg, zoom);
          this.container.attr("transform", zoom);
          break;
        case "缩小":
          var zoom = d3.zoomTransform(this.svg.node()),
            x = zoom.x,
            y = zoom.y,
            zoomStart = cloneDeep(zoom);
          zoom.k =
            zoom.k - 0.2 > this.scaleExtent[0]
              ? zoom.k - 0.2
              : this.scaleExtent[0];
          zoom.x = x;
          zoom.y = y;
          this.addStep({
            type: "zoom",
            transformStart: zoomStart,
            transformEnd: cloneDeep(zoom)
          });
          d3.zoom().transform(this.svg, zoom);
          this.container.attr("transform", zoom);
          break;
        case "上一步":
          this.previousStep();
          break;
        case "下一步":
          this.nextStep();
          break;
      }
    },

    //清楚状态
    clearStatus() {
      this.nodeCircle
        .select("circle")
        .style("stroke", "none")
        .style("stroke-width", 0);
    },

    //全屏
    fullscreen(div) {
      if (!div) {
        // 退出全屏
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      } else {
        // 进入全屏
        if (div.requestFullscreen) {
          div.requestFullscreen();
        } else if (div.webkitRequestFullScreen) {
          div.webkitRequestFullScreen();
        } else if (div.mozRequestFullScreen) {
          div.mozRequestFullScreen();
        } else if (div.msRequestFullscreen) {
          div.msRequestFullscreen();
        }
      }
    },

    toolbarBottomFullscreen() {
      var isFull = document.webkitIsFullScreen;
      if (isFull) {
        setTimeout(() => {
          var htmls = document.getElementsByClassName("toolbarBottomTooltip");
          for (let n = 0; n < htmls.length; n++) {
            document.getElementById("main").appendChild(htmls[n]);
          }
        }, 100);
      } else {
        d3.select("#main")
          .selectAll(".toolbarBottomTooltip")
          .remove();
      }
    },

    //监听框选事件
    selectEvent() {
      let start = [0, 0],
        end = [0, 0],
        isdown = false,
        isMove = false;
      d3.select("#main")
        .select("svg")
        .on("mousedown", () => {
          if (d3.event.button == 0 && this.isDeleteNodes) {
            start = [d3.event.offsetX, d3.event.offsetY];
            isdown = true;
            d3.select(".selectBox").remove();
            d3.select("#main svg")
              .append("rect")
              .attr("width", 0)
              .attr("height", 0)
              .attr("class", "selectBox")
              .attr("x", start[0])
              .attr("y", start[1])
              .style("stroke", "red")
              .style("stroke-width", 1)
              .style("stroke-dasharray", "3 2")
              .style("fill", "none");
          }
        })
        .on("mousemove", () => {
          if (isdown) {
            isMove = true;
            end = [d3.event.offsetX, d3.event.offsetY];
            var w = end[0] - start[0],
              h = end[1] - start[1];
            d3.select(".selectBox")
              .attr("width", Math.abs(w))
              .attr("height", Math.abs(h));
            if (w >= 0 && h < 0) {
              d3.select(".selectBox")
                .attr("x", start[0])
                .attr("y", end[1]);
            } else if (w < 0 && h >= 0) {
              d3.select(".selectBox")
                .attr("x", end[0])
                .attr("y", start[1]);
            } else if (w < 0 && h < 0) {
              d3.select(".selectBox")
                .attr("x", end[0])
                .attr("y", end[1]);
            }
          }
        })
        .on("mouseup", () => {
          if (d3.event.button == 0 && this.isDeleteNodes && isMove) {
            this.findSelectNode(start, end);
            isdown = false;
            isMove = false;
            start = [0, 0];
            end = [0, 0];
            d3.select(".selectBox").remove();
          }
        })
        .on("mouseleave", () => {
          if (isdown == true) {
            isdown = false;
            start = [0, 0];
            end = [0, 0];
            d3.select(".selectBox").remove();
          }
        });
    },

    //查找选中的点
    findSelectNode(start, end) {
      let boxX,
        boxY,
        hideList = [],
        zoom = d3.zoomTransform(this.svg.node()),
        sacle = zoom.k,
        translate = [zoom.x, zoom.y];
      if (start[0] <= end[0]) {
        boxX = [start[0], end[0]];
      } else {
        boxX = [end[0], start[0]];
      }
      if (start[1] <= end[1]) {
        boxY = [start[1], end[1]];
      } else {
        boxY = [end[1], start[1]];
      }

      this.nodesData.map(node => {
        var isX = false,
          isY = false;
        var outW = this.nodeConf.radius * sacle;
        var x = node.x * sacle + translate[0];
        var y = node.y * sacle + translate[1];
        var minx = x - outW,
          maxx = x + outW,
          maxy = y + outW,
          miny = y - outW;
        if (minx > boxX[1]) {
          isX = false;
        } else if (maxx < boxX[0]) {
          isX = false;
        } else {
          isX = true;
        }
        if (miny > boxY[1]) {
          isY = false;
        } else if (maxy < boxY[0]) {
          isY = false;
        } else {
          isY = true;
        }
        if (isX && isY) {
          hideList.push(node);
          return true;
        } else {
          return false;
        }
      });
      if (hideList.length > 0) {
        this.deleteNodes(hideList);
      }
    },

    //自定义删除时停止zoom事件
    stopZoom() {
      if (this.isDeleteNodes) {
        this.svg.on("mousedown.zoom", null);
        this.svg.on("mousemove.zoom", null);
        this.svg.on("dblclick.zoom", null);
        this.svg.on("touchstart.zoom", null);
        this.svg.on("wheel.zoom", null);
        this.svg.on("mousewheel.zoom", null);
      } else {
        this.svg.call(this.zoom);
      }
    },

    //清空数据和图形
    emptyData() {
      //节点、连线相关数据
      this.nodesMap = {};
      this.linksMap = {};
      this.nodesData = [];
      this.linksData = [];
      this.linesData = [];
      this.linesData = [];
      this.toolbarList = [
        {
          name: "添加节点",
          icon: "el-icon-plus",
          isCheck: false,
          type: "radio"
        },
        {
          name: "添加关系",
          icon: "el-icon-s-operation",
          isCheck: false,
          type: "radio"
        },
        {
          name: "自定义删除",
          icon: "el-icon-delete",
          isCheck: false,
          type: "radio"
        },
        {
          name: "回到中心",
          icon: "el-icon-s-home",
          isCheck: false,
          type: "button"
        },
        {
          name: "刷新",
          icon: "el-icon-refresh",
          isCheck: false,
          type: "button"
        }
      ];
      this.dragNodeX = "";
      this.dragNodeY = "";
      this.isAddNode = false;
      this.isAddLine = false;
      this.isDeleteNodes = false;
      this.addLineNodes = [];
      this.stepList = [];
      this.stepIndex = "end";
      d3.select("#main")
        .select("svg")
        .remove();
    },

    //添加操作步骤
    addStep(step) {
      if (this.stepIndex == "start") {
        this.stepList = [];
        this.stepIndex = "end";
      }
      if (this.stepList[this.stepIndex]) {
        this.stepList.splice(
          this.stepIndex,
          this.stepList.length - this.stepIndex
        );
      }
      this.stepList.push(step);
    },

    //上一步
    previousStep() {
      if (!this.stepList.length) {
        return;
      }
      this.stepIndex =
        this.stepIndex == "end" ? this.stepList.length - 1 : this.stepIndex;
      if (this.stepIndex != "start") {
        let step = this.stepList[this.stepIndex];
        switch (step.type) {
          case "add":
            this.deleteNodes(step.nodes, true);
            break;
          case "delete":
            this.addNodeLine(step.nodes, step.links, true);
            break;
          case "zoom":
            d3.zoom().transform(this.svg, step.transformStart);
            this.container.attr("transform", step.transformStart);
            break;
          case "drag":
            step.nodes.map(value => {
              value.x = value.x - step.endPos.x + step.startPos.x;
              value.y = value.y - step.endPos.y + step.startPos.y;
            });
            this.tick();
            break;
        }
        this.stepIndex = this.stepIndex > 0 ? this.stepIndex - 1 : "start";
      }
    },

    //下一步
    nextStep() {
      if (!this.stepList.length || this.stepIndex == "end") {
        return;
      }
      let step;
      this.stepIndex = this.stepIndex == "start" ? 0 : this.stepIndex;
      step = this.stepList[this.stepIndex];
      switch (step.type) {
        case "add":
          this.addNodeLine(step.nodes, step.links, true);
          break;
        case "delete":
          this.deleteNodes(step.nodes, true);
          break;
        case "zoom":
          d3.zoom().transform(this.svg, step.transformEnd);
          this.container.attr("transform", step.transformEnd);
          break;
        case "drag":
          step.nodes.map(value => {
            value.x = value.x + step.endPos.x - step.startPos.x;
            value.y = value.y + step.endPos.y - step.startPos.y;
          });
          this.tick();
          break;
      }
      this.stepIndex = this.stepList[this.stepIndex + 1]
        ? this.stepIndex + 1
        : "end";
    },

    toolbarBottomTooltip(name) {
      var tip = name;
      if (name == "上一步") {
        if (!this.stepList.length || this.stepIndex == "start") {
          tip = "无上一步";
        }
      }
      if (name == "下一步") {
        if (!this.stepList.length || this.stepIndex == "end") {
          tip = "无下一步";
        }
      }
      return tip;
    }
  },
  destroyed() {
    document.removeEventListener("keydown", this.keydownEvent);
    document.removeEventListener("keyup", this.keyupEvent);
  }
};
</script>

<style scoped>
#full {
  background-color: #fff;
  box-shadow: 1px 1px 1px rgba(204, 204, 204, 1);
  background: url("../../../../assets/wangge.jpg") repeat;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.graphBox {
  height: 100%;
  -moz-user-select: none;
  -webkit-user-select: none;
  user-select: none;
}
.radioButton {
  display: inline-block;
  background-color: #33cccc;
  padding: 6px 10px;
  border-radius: 3px;
  margin-left: 10px;
  cursor: pointer;
}
.toolbar {
  padding: 10px 0;
  background-color: #fff;
}
.toolbarBottom {
  position: absolute;
  bottom: 40px;
  left: 20px;
  background-color: #fff;
}
</style>
<style></style>
