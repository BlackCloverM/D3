<template>
  <div id="BDmap" :class="$style['position']" :style="{ height: height }">
    <div :class="$style['control-btn']" :style="style">
      <el-button
        @click="handleCreateGeneral()"
        :type="`${!isHotMap ? 'primary' : 'hovers'}`"
        >分布图</el-button
      >
      <el-button
        @click="handleCreateHeatmap()"
        style="margin-right: 20px;margin-left:0"
        :type="`${isHotMap ? 'primary' : 'hovers'}`"
        >热力图</el-button
      >
    </div>
    <div :class="$style['control-big']" v-if="bigScreenBtn">
      <el-button type="hovers" @click="handleBigScreen">
        <span v-if="bigScreen">
          <i
            class="iconfont icon-quanpingzuidahua"
            style="font-size:12px;margin-right:3px;"
          ></i
          >大屏
        </span>
        <span v-else>
          <i
            class="iconfont icon-tuichuquanping"
            style="font-size:12px;margin-right:3px;"
          ></i
          >小屏
        </span>
      </el-button>
    </div>
    <slot name="searchBar"></slot>
    <div id="baiduMap" :style="{ height: height }" :class="$style['baidu-map']">
      loading...
    </div>

    <!-- @visible-change="tooltipFullscreen('el-dropdown-menu ')" -->
    <div
      class="select box-shadow"
      :class="$style['selectgj']"
      v-if="selectOptions.options.length"
    >
      <el-dropdown
        ref="dropdown"
        size="medium"
        split-button
        type="primary"
        trigger="click"
        :hide-on-click="false"
      >
        <span class="el-dropdown-link" style>
          {{ selectOptions.title }}
        </span>
        <el-dropdown-menu class="gjlx" style slot="dropdown">
          <!-- width:180px;display:inline-block -->
          <!-- width:270px; -->
          <el-checkbox-group v-model="selectList">
            <el-dropdown-item
              v-for="item in selectOptions.options"
              :key="item.value"
            >
              <el-checkbox :label="item.value">{{ item.name }}</el-checkbox>
            </el-dropdown-item>
          </el-checkbox-group>
          <el-dropdown-item divided style="text-align: center">
            <el-button type="text" @click="selectConfirm">确认</el-button>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <div :class="$style['searchInput']" v-if="isShowSearch">
      <!-- <el-date-picker ref='searchInput'
        size="mini"
        style=" float: right;;padding-right:20px;width: 230px"
        v-model="datesj_time"
        value-format="yyyy-MM-dd"
        type="daterange"
        range-separator="~"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
         :picker-options="pickerOptions"
      ></el-date-picker> -->
      <el-input
        ref="searchInput"
        style=" width: 150px"
        placeholder="请输入内容"
        prefix-icon="el-icon-search"
        @change="changeInput"
        v-model="searchInput"
      >
      </el-input>
    </div>

    <div :class="$style['datesj']" v-if="isShowDatePick">
      <el-date-picker
        ref="datesj"
        style=" float: right;;padding-right:20px;width: 230px"
        v-model="datesj_time"
        value-format="yyyy-MM-dd"
        type="daterange"
        range-separator="~"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="$pickerOptions"
        @change="timeChange"
      ></el-date-picker>
    </div>

    <div :class="$style['control-gjcontrol']" v-if="gjcontrolBtn">
      <el-button
        style="position: absolute;left: 3px;"
        type="primary"
        v-if="!isplay"
        icon="el-icon-video-play"
        circle
        @click="play"
      ></el-button>
      <el-button
        style="position: absolute;left: 3px;"
        type="primary"
        v-if="isplay"
        icon="el-icon-video-pause"
        circle
        @click="pause"
      ></el-button>
      <div style="margin-left:20px">
        <div class="block">
          <!-- range -->
          <el-slider
            id="maphk"
            show-stops
            v-model="gjvalue"
            :format-tooltip="formatTooltip"
            :max="gjmax"
            :disabled="gjsfjy"
            @input="mouseMove"
            :marks="gjmarks"
          ></el-slider>
        </div>
      </div>
    </div>
  </div>
  <!-- <div>sdfsdf</div> -->
</template>
<script>
import {
  BAIDU_MAP_ZOOM,
  BAUDU_MAP_POINT,
  BAIDU_MAP_ZOOM_LEVEL,
  BAIDU_MAP_SCREEN
} from "../../config/index.js";
// import { ROUTER_MODE } from "../config/app";
import { cloneDeep } from "loadsh";
import { getDay } from "@/utils/time.js";
export default {
  created() {},
  data() {
    return {
      bsMainPoint: [], //伴随主对象点集
      bsCircle: [], //伴随圈图层
      icons_sj: [
        // {
        //     name: "01",
        //     url: require("../../assets/image/makers/cheliangkakou.png")
        // },
        // {
        //     name: "02",
        //     url: require("../../assets/image/makers/cheliangkakou.png")
        // },
        // {
        //     name: "03",
        //     url: require("../../assets/image/makers/cheliangkakou.png")
        // }
      ],
      isplay: false,
      searchInput: "",
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      // datesj_time: ["2019-09-03", "2020-09-03"],
      datesj_time: this.setDate(),
      // datesj_time: [(new Date() - 3600 * 1000 * 24 * 365).toLocaleDateString(), (new Date()).toLocaleDateString()],
      clusters: [], //热力图临时变量
      selectList: [],
      ry: [],
      gjcar: null, //汽车图标
      gjlabel: null, //信息标签
      gjtimer: null, //定时器
      gjindex: 0, //记录播放到第几个point
      gjPoint: [
        //  new BMap.Point(114.00100,22.550000 ),
        //    new BMap.Point(114.01430,22.550000 ),
        //      new BMap.Point(114.02860,22.540000 ),
        //        new BMap.Point(114.03700, 22.553500),
        //          new BMap.Point(114.04600, 22.550000),
        //            new BMap.Point(114.05600, 22.550000),
        //              new BMap.Point(114.05600,22.550000 ),
        //                new BMap.Point(114.06500, 22.550000),
        //                  new BMap.Point(114.07505, 22.539000),
        //                    new BMap.Point(114.0851, 22.560000),
        //                      new BMap.Point(114.09015, 22.550000),
        //                        new BMap.Point(114.10525, 22.560000),
        //                          new BMap.Point(114.1137, 22.549000),
      ], //轨迹点
      gjsfjy: false, //轨迹按钮是佛禁用，轨迹播放时处于禁用；
      //需要一个单独的按钮控制，默认区间为全部，设置轨迹拖动范围，关闭设置范围，才能拖动
      sztdfw: false, //默认关闭，则可拖动，轨迹随拖动变化
      // gjvalue: [0, 60],
      gjvalue: 0,

      gjmarks: {
        0: "0°C",
        8: "8°C",
        37: "37°C",
        50: {
          style: {
            color: "#1989FA"
          },
          label: this.$createElement("strong", "50%")
        }
      },
      gjmax: 60,
      gjcontrolBtn: false,

      conIcon: "",
      bigScreen: true,
      markers: [],
      markerClusterer: {},
      sumMarker: 0, // 当前 marker数量
      center: BAUDU_MAP_POINT,
      centerScreen: BAIDU_MAP_SCREEN,
      zoom: BAIDU_MAP_ZOOM,
      zoomLevel: BAIDU_MAP_ZOOM_LEVEL,
      isHotMap: false,
      trackPoint: [], // 用于画线记录点
      map: {},
      oVMap: {},
      iconStart: {},
      iconEnd: {},
      iconHover: {},
      hotMap: [] //热力图
    };
  },
  computed: {
    style() {
      let styleObj = { zIndex: this.zIndex };
      if (this.controlLeft) {
        styleObj.left = "30px";
      }
      if (this.bigScreenBtn) {
        styleObj.right = "80px";
      } else {
        styleObj.right = "20px";
      }
      return styleObj;
    }
  },

  props: {
    //用于不同类型的点进行聚合
    isdiffcluster: {
      type: Boolean,
      default: false
    },
    isShowBsTrack: {
      type: Boolean,
      default: false
    },
    isShowMeetCircle: {
      type: Boolean,
      default: false
    },
    meetCircle: {
      type: Array,
      default: () => {
        return [];
      }
    },
    circleRadius: {
      type: Number,
      default: 500
    },
    isShowTrack: {
      type: Boolean,
      default: false
    },
    isShowSearch: {
      type: Boolean,
      default: false
    },
    isShowDatePick: {
      type: Boolean,
      default: false
    },
    selectOptions: {
      type: Object,
      default: () => {
        return {
          options: [],
          title: "dfgdf"
        };
      }
    },
    ryinfo: {
      type: Array,
      default: () => {
        return [];
      }
    },
    highlightPoint: {
      type: Object,
      default: () => {
        return {};
      }
    },

    // gjPoint: {
    //     type: Array,
    //     default: () => {
    //         return [];
    //     }
    // },
    // gjcontrolBtn: {
    //     type: Boolean,
    //      default: false
    // },
    zIndex: {
      type: Number,
      default: 4
    },
    bigScreenBtn: {
      type: Boolean
    },
    markInfoWinfow: {
      type: Boolean,
      default: true
    },
    // 是否详情传过来的坐标 类型一致或不区分类型[{name,...}]
    mapPoint: {
      type: Array,
      default: () => {
        return [];
      }
    },
    // //伴随主对象点集 mapPoint包含主从对象所有的点集
    // bsMainPoint: {
    //     type: Array,
    //     default: () => {
    //         return [];
    //     }
    // },
    // // 传过来的坐标 类型不一致或区分类型[{name,...,[{},{}]}]
    // mapPoint_diftype: {
    //     type: Array,
    //     default: () => {
    //         return [];
    //     }
    // },
    centerPoint: {
      type: Object,
      default: () => {
        return {};
      }
    },
    list: {
      type: Array,
      default: function() {
        return [];
      }
    },
    // maker的名字用于label显示
    iconMarker: {
      type: String,
      default: ""
    },
    isLine: {
      type: Boolean,
      default: false
    },
    height: {
      type: String,
      // default: "600px"
      default: "100%"
    },
    defaultIcon: {
      type: Boolean,
      default: false
    },
    // 将控制按钮显示在左边
    controlLeft: {
      type: Boolean,
      default: false
    },
    // 是否显示marker上的数量标识
    markerNumber: {
      type: Boolean,
      default: false
    },
    markerStart: {
      type: Boolean,
      default: false
    },
    markerClick: {
      type: Boolean,
      default: false
    },
    // 是否开启聚合 默认 开启
    isMarkerClusterer: {
      type: Boolean,
      default: true
    },
    // 是否开启聚合 默认 开启
    markerClustererGirdSize: {
      type: Number,
      // default: 100
      default: 10
    },
    //特殊样式
    iconClass: {
      type: String,
      default: ""
    },
    // 百度定制个性化地图
    mapStyle: {
      type: Array,
      default: () => {
        return [];
      }
    },
    bigScreenPoint: {
      type: Boolean,
      default: false
    },
    markerOnlyClick: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    setDate() {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
      return [
        getDay(start.toLocaleDateString()),
        getDay(end.toLocaleDateString())
      ];
      //  return ["2020-05-27", "2020-08-27"]
    },
    timeChange() {
      this.$emit("timeChange");
    },
    changeInput() {
      this.$emit("changeInput", this.searchInput);
    },
    selectConfirm() {
      this.$emit("selectChange", this.selectList);
      this.$refs.dropdown.hide();
    },
    formatTooltip(val) {
      // return val / 100;
      if (this.mapPoint.length == 0 || val == null) {
        return 0;
      } else {
        return this.mapPoint[val].time;
      }
    },
    handleResetCenter() {
      var _point = {};
      if (!this.bigScreen) {
        _point = new window.BMap.Point(
          this.centerScreen.lng,
          this.centerScreen.lat
        ); //中心点
      } else {
        _point = new window.BMap.Point(this.center.lng, this.center.lat); //中心点
      }
      this.map.centerAndZoom(_point, this.zoom); //地图默认放大
    },
    handleBigScreen() {
      this.bigScreen = !this.bigScreen;
      this.handleResetCenter();
      this.$emit("handleBigScreen", this.bigScreen);
      // if (!this.bigScreen) {
      //     var fullDiv = document.getElementById("BDmap");
      //     this.fullscreen(fullDiv);
      // } else {
      //     this.fullscreen();
      // }
    },
    /* eslint-disable */
    // 加载地图底图、marker等配置
    handleInit() {
      var _this = this;
      const map = new BMap.Map("baiduMap", {
        minZoom: this.zoomLevel.min,
        maxZoom: this.zoomLevel.max
      });
      this.map = map;
      // 地图添加resize事件
      map.addEventListener("resize", function() {
        map.checkResize();
      });
      // 地图添加 zoomend 事件
      map.addEventListener(
        "zoomstart",
        function() {
          map;
          this.clusters = this.markerClusterer._clusters;
          // this.clusters[0.]_markers.length
        }.bind(this)
      );
      var point = new BMap.Point(this.center.lng, this.center.lat); //中心点
      if (this.bigScreenPoint) {
        point = new BMap.Point(this.centerScreen.lng, this.centerScreen.lat); //中心点
      }

      map.centerAndZoom(point, this.zoom); //地图默认放大
      var top_left_control = new BMap.ScaleControl({
        anchor: BMAP_ANCHOR_BOTTOM_LEFT
      }); // 左上角，添加比例尺
      var top_left_navigation = new BMap.NavigationControl(); //左上角，添加默认缩放平移控件
      var top_right_navigation = new BMap.NavigationControl({
        anchor: BMAP_ANCHOR_BOTTOM_RIGHT,
        type: BMAP_NAVIGATION_CONTROL_SMALL
      }); //右上角，仅包含平移和缩放按钮
      map.enableScrollWheelZoom();
      // map.addControl(top_left_control);
      // map.addControl(top_left_navigation);
      map.addControl(top_right_navigation);
      map.addEventListener("click", function(e) {
        console.log(e.point);
      });
      if (this.mapStyle.length) {
        this.map.setMapStyle({
          styleJson: this.mapStyle
        });
      }

      if (!this.defaultIcon) {
        this.iconStart = new BMap.Icon(
          //require("@/assets/images/map_icon.png"),
          require("../../assets/image/map_end.png"),
          new BMap.Size(23, 35),
          {
            imageOffset: new BMap.Size(0, 0)
          }
        );
        this.iconEnd = new BMap.Icon(
          require("../../assets/image/map_end.png"),
          new BMap.Size(23, 35),
          {
            imageOffset: new BMap.Size(0, 0)
          }
        );
      }
    },
    showPoint1(e) {
      if (!this.markInfoWinfow) return false;
      if (!e.longitude || !e.latitude) return;
      const pt = new BMap.Point(e.longitude, e.latitude);
      this.map.centerAndZoom(pt, this.map.getZoom());
      const infoWindow = new BMap.InfoWindow(
        // e.infowindow || this.myReplace(e.content, "    ", "<br>") || e.title,
           e.infowindow || (e.content?this.myReplace(e.content, "    ", "<br>") :  e.title),
        {
          enableMessage: false
        }
      );

      this.map.openInfoWindow(infoWindow, pt);
    },
    showPoint(e) {
      if (!this.markInfoWinfow) return false;
      if (!e.longitude || !e.latitude) return;
      const pt = new BMap.Point(e.longitude, e.latitude);
      this.map.centerAndZoom(pt, this.map.getZoom());
      const infoWindow = new BMap.InfoWindow(e.infowindow, {
        enableMessage: false
      });
      this.markers[e.index].openInfoWindow(infoWindow);
      //this.map.openInfoWindow(infoWindow, pt);
    },
    // 地图左边点击需要请求列表
    showMapPoint(e) {
      this.mapPoint = e;
      // if (this.isHotMap) {
      //   this.handleClearMap();
      // } else {
      //   this.handleCreateGeneral();
      // }
      this.handleCreateGeneral();
    },
    // 创建 普通模式
    handleCreateGeneral() {
      this.isHotMap = false;
      this.handleClearMap();
      if (this.mapPoint.length > 0) {
        let i = 0;
        for (let item of this.mapPoint) {
          let _marker = this.handleAddMarker(item);
          _marker.index = i++;
          _marker.type = "maker";
          _marker.circleId = item.qid;
          _marker.identifier=item.identifier;
          this.markers.push(_marker);
        }
      } else {
        for (let item of this.hotMap) {
          if (item.longitude && item.latitude) {
            this.sumMarker++;
            this.markers.push(this.handleAddMarker(item));
          }
        }
      }
      // // 添加 聚合点
      if (this.isMarkerClusterer) {
        this.markerClusterer = new BMapLib.MarkerClusterer(this.map, {
          markers: this.markers,
          // 伴随画点传参开始
          mapPoint:this.mapPoint,//自定义
          person:this.ryinfo,//自定义
          icons:this.icons_sj,//自定义
          isdiffcluster:true,//自定义
          // 伴随画点传参结束

          

          girdSize: this.markerClustererGirdSize,
          styles: [
            {
              url: require("../../assets/image/m4.png"),
              //url: '/static/admin/common/mark.png',
              size: new BMap.Size(28, 56),
              color: "#fff",
              height: "42px",
              lineHeight: "30px",
              backgroundColor: "#fff",
              textColor: "#fff",
              textSize: 12
            }
          ]
        });
      } else {
        for (let _marker of this.markers) {
          this.map.addOverlay(_marker);
          // //伴随画圈 
          // if(this.isShowBsTrack){
          //   this.map.addOverlay(new BMap.Circle( _marker.getPosition(),  500, {}));
          // }
        }
      }
       
       if(this.isShowBsTrack){
          this.bsCircle=[];
          for (let _marker of this.markers) {
            // this.map.addOverlay(_marker);
            //伴随画圈 this.ry[0].zjhm
            if(_marker.identifier==this.ryinfo[0].zjhm){
              var circle=new BMap.Circle( _marker.getPosition(),  this.circleRadius, {fillColor:"red", strokeWeight:1,strokeColor:"red", fillOpacity:0.2}   );
              this.map.addOverlay(circle);
              this.bsCircle.push(circle);
            }
          }
      }
      
      if(this.isShowMeetCircle){
          for (let _marker of this.meetCircle) {
              const point = new BMap.Point(_marker.longitude, _marker.latitude);
              let circle=new BMap.Circle( point,  Math.ceil(_marker.radius), {fillColor:"red", strokeWeight:1,strokeColor:"red", fillOpacity:0.2} )
              circle.id=_marker.uuid
              circle.type="circle"
             this.map.addOverlay(circle);
          }
          if(this.meetCircle[0]){
              this.map.centerAndZoom(
                  new BMap.Point(this.meetCircle[0].longitude, this.meetCircle[0].latitude),
                  14
              );
          }
      }


      // 根据 isLine 来判断是否需要用线连接
      if (this.isLine) {
        var polyline = new BMap.Polyline(this.trackPoint, {
          strokeColor: "#f02a40",
          strokeWeight: 3,
          strokeOpacity: 1,
          strokeStyle: "dashed" //线样式
        });
        this.map.addOverlay(polyline);
      }
      // 添加弧线
      if (this.centerPoint.curve) {
        // 获取中心点
        const centerPoint = new BMap.Point(
          this.centerPoint.center.longitude,
          this.centerPoint.center.latitude
        );
        const marker = new BMap.Marker(centerPoint, {
          icon: this.iconEnd
        });
        this.map.addOverlay(marker);
        // 创建中心点 marker
        let _points = this.centerPoint.points;
        for (let item of _points) {
          let currPoint = [
            centerPoint,
            new BMap.Point(item.longitude, item.latitude)
          ];
          var curve = new BMapLib.CurveLine(currPoint, {
            strokeColor: "red",
            strokeWeight: 3,
            strokeOpacity: 2
          }); //创建弧线对象
          this.map.addOverlay(curve); //添加到地图中
        }
      }

      //初始轨迹信息
      if(this.isShowTrack){ 
          this.initGJ();
          // setTimeout(() => {
          //   this.gjvalue=0;
          // }, 200);
          
      }

        //初始伴随轨迹信息
         //伴随连线
      if(this.isShowBsTrack){ 
         this.initBsPath();
          // setTimeout(() => {
          //   this.gjvalue=0;
          // }, 200);
      }
    
    },
    handleClearMap() {
      this.sumMarker = 0;
      this.trackPoint = [];
      if (
        this.markerClusterer &&
        this.markers.length > 0 &&
        this.isMarkerClusterer
      )
        this.markerClusterer.clearMarkers();
      this.markers = [];
      this.map.clearOverlays(); //清除壶盖物
    },
    // 创建 热力图
    handleCreateHeatmap() {
      let _list = this.hotMap;
      if (this.mapPoint.length > 0) {
        _list = this.mapPoint;
      }
      let listItem = [];
      for (let item of _list) {
        listItem.push({
          lng: item.longitude,
          lat: item.latitude,
          count: 100
        });
      }
      //   for (let item of this.clusters[0]._markerClusterer._clusters) {
      //     listItem.push({
      //       lng: item._center.lng,
      //       lat: item._center.lat,
      //       count: item._markers.length
      //     });
      //   }
      this.isHotMap = true;
      if (listItem.length == 0) return false;
      this.handleClearMap();
      const heatmapOverlay = new BMapLib.HeatmapOverlay({ radius: 20 });
      this.map.addOverlay(heatmapOverlay);
      heatmapOverlay.setDataSet({ data: listItem, max: 100 });
      //是否显示热力图
      heatmapOverlay.show();
    },
    // 创建marker
    handleAddMarker(e) {
      const _this = this;
      let mapicon = this.iconStart;
      let location = this.iconMarker;
      location = this.markerNumber ? "" : location; //e.value_
      if (this.markerStart) {
        if (this.sumMarker === 1) {
          location = "终";
          mapicon = this.iconEnd;
        }
        if (this.sumMarker === this.list.length && this.sumMarker != 1) {
          location = "起";
          mapicon = this.iconEnd;
        }
      }
      if (this.iconClass === "red") {
        mapicon = this.iconEnd;
      }
      const point = new BMap.Point(e.longitude, e.latitude);
      const marker = new BMap.Marker(point, { icon: mapicon });
      var label = new BMap.Label(location, {
        offset: new BMap.Size(-3, -4)
      });
      label.setStyle({
        color: "#fff",
        fontSize: "12px",
        background: "none",
        padding: "5px 0 0 0",
        textAlign: "center",
        lineHeight: "20px",
        width: "30px",
        border: "0"
      });
      marker.setLabel(label);
      // ↵
      const infoWindow = new BMap.InfoWindow(
        e.infowindow || (e.content?this.myReplace(e.content, "    ", "<br>") : "信息"),
        {
          enableMessage: false
        }
      );
      marker.addEventListener("infowindowclose", function() {
        _this.$emit("handle-infowindow-close");
      });
      if (this.markInfoWinfow) {
        marker.addEventListener("mouseover", function() {
          // const pointAIcon2 = new BMap.Icon("url2", new BMap.Size(28, 28));
          // this.setIcon(pointAIcon2);
          const iconHover = new BMap.Icon(
            //require("@/assets/images/map_icon.png"),
            require("../../assets/image/map_hover.png"),
            new BMap.Size(23, 35),
            {
              imageOffset: new BMap.Size(0, 0)
            }
          );
          this.setIcon(iconHover);
          // this.openInfoWindow(infoWindow);
        });
        marker.addEventListener("mouseout", function() {
          // console.log(_this.iconStart);
          //this.closeInfoWindow(infoWindow);
          this.setIcon(mapicon);
        });
        marker.addEventListener("click", function() {
          this.openInfoWindow(infoWindow);
        });
      }
      // 是否启用marker点击事件
      if (this.markerClick) {
        if (this.markerOnlyClick) {
          marker.addEventListener("infowindowopen", function() {
            // _this.$emit("handleMarkerClick", e);
            this.openInfoWindow(infoWindow);
          });
        }
        marker.addEventListener("click", function() {
          _this.$emit("handleMarkerClick", e);
          _this.map.checkResize(); // 重新调整地图容易
          console.log(1);
        });
      }

      if (this.isLine) {
        this.trackPoint.push(point); //添加点的集合用于画线
      }
      if(this.isShowBsTrack){
        // 伴随画点传参 不同人不同事件类型图标不一致，聚合之后图标如何显示也有规则
        this.ryinfo[0].color;
        marker.person = e.name; //自定义   当前maker是哪个人的
        this.ryinfo.forEach(element => {
            if(element.name== e.name){
                marker.color = item.color; //自定义   当前maker是哪个人的
            }
        });
        marker.identifier = e.identifier; //自定义 当前maker是种事件类型
        marker.eventype = e.value; //自定义 当前maker是种事件类型
      }
      return marker;
      //this.markers.push(marker);
      //this.map.addOverlay(marker);
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

    //初始轨迹元素,要求 mapPoint为所有人的点 ,根据identifier，画出每个人的轨迹线
    initGJ() {
      // //显示小车子
      // this.gjlabel = new BMap.Label("", {
      //     offset: new BMap.Size(-20, -20)
      // });
      // this.gjcar = new BMap.Marker(this.gjPoint[0]);
      // this.gjcar.setLabel(this.gjlabel);
      // this.map.addOverlay(this.gjcar);
      // this.play();

      var _this = this;

      if (this.mapPoint.length <= 1) {
        this.gjcontrolBtn = false;
        return;
      } else {
        this.gjcontrolBtn = true;
      }
      //地图定位到第一个轨迹点
      this.map.centerAndZoom(
        new BMap.Point(this.mapPoint[0].longitude, this.mapPoint[0].latitude),
        14
      );

      this.ry = cloneDeep(this.ryinfo);
      //清空上一个查询是所有覆盖物
      //  this.map.clearOverlays(); //清除壶盖物

      //显示时间拖到轴
      this.gjmax = this.mapPoint.length - 1;
      // this.gjvalue=[0, this.mapPoint.length];
      this.gjvalue = this.mapPoint.length;
      this.gjmarks = {};

      this.gjmarks[0] = {
        style: {
          color: "#1989FA",
          width: "80px",
          "font-size": "10px",
          "padding-left": "10px",
          "margin-top": "11px"
        },
        label: this.$createElement("strong", this.mapPoint[0].eventTime)
      };
      this.gjmarks[this.mapPoint.length - 1] = {
        style: {
          color: "#1989FA",
          width: "80px",
          "font-size": "10px",
          "margin-top": "11px"
        },
        label: this.$createElement(
          "strong",
          this.mapPoint[this.mapPoint.length - 1].eventTime ||
            this.mapPoint.length - 1
        )
      };

      //构造拖到轴相应轨迹
      ///重新构造gjpoint     //  new BMap.Point(114.00100,22.550000 ),
      _this.gjPoint = [];
      this.mapPoint.forEach(element => {
        _this.gjPoint.push(new BMap.Point(element.longitude, element.latitude));
      });
      // this.gjPoint=

      //显示小车子  默认加载轨迹 ，轨迹点为
      for (var i = 0; i < this.mapPoint.length; i++) {
        for (var j = 0; j < this.ry.length; j++) {
         
          if (this.mapPoint[i].identifier == this.ry[j].zjhm) {
         
            if (this.ry[j].gj == undefined) {
              //没有这个属性则新增，代表此点为当前人员的第一个出现点  this.mapPoint[i]
              this.ry[j].gj = [];
              this.ry[j].gjlabel = {};
              this.ry[j].gjcar = {};
              this.ry[j].start = 0; //起始索引
              this.ry[j].end = 0; //结束索引
              this.ry[j].gjindexs=[];
              this.ry[j].gjline=[];
              this.ry[j].gjindexs.push(i);

              this.ry[j].gj.push(
                new BMap.Point(
                  this.mapPoint[i].longitude,
                  this.mapPoint[i].latitude
                )
              );
              //创建图标
              var label = new BMap.Label(this.ry[j].name, {
                offset: new BMap.Size(-40, -20)
              });

              this.ry[j].start = i; //起始索引
              // this.ry[j].gjlabel = label;
              // this.ry[j].gjcar = new BMap.Marker(this.ry[j].gj[0]);
              // this.ry[j].gjcar.setLabel(label);

              // this.map.addOverlay(this.ry[j].gjcar);
              //一个人只有一个点则定位到第一个点
              //  if(this.ry[j].gjlabel.setContent==undefined){return;}
                // this.ry[j].gjlabel.setContent(
                //   "姓名： " +
                //     this.ry[j].mc +
                //     " <br>经度: " +
                //     this.mapPoint[i].longitude +
                //     "<br>纬度: " +
                //     this.mapPoint[i].latitude +
                //     "<br>时间: " +
                //     this.mapPoint[i].eventTime
                // );

                // this.ry[j].gjcar.setPosition(
                //   new BMap.Point(
                //     this.mapPoint[i].longitude,
                //     this.mapPoint[i].latitude
                //   )
                // );

             
            } else {
              //不是第一个点
              this.ry[j].gjindexs.push(i);
              this.ry[j].end = i; //结束索引
              this.ry[j].gj.push(
                new BMap.Point(
                  this.mapPoint[i].longitude,
                  this.mapPoint[i].latitude
                )
              );

              //定位到各自 最后一个点
             
              // if(this.ry[j].gjlabel.setContent==undefined){return;}
              // this.ry[j].gjlabel.setContent(
              //   "姓名： " +
              //     this.ry[j].mc +
              //     " <br>经度: " +
              //     this.mapPoint[i].longitude +
              //     "<br>纬度: " +
              //     this.mapPoint[i].latitude +
              //     "<br>时间: " +
              //     this.mapPoint[i].eventTime
              // );

              // this.ry[j].gjcar.setPosition(
              //   new BMap.Point(
              //     this.mapPoint[i].longitude,
              //     this.mapPoint[i].latitude
              //   )
              // );
            }

            //显示轨迹

            if (this.ry[j].gj.length - 2 >= 0) {
             
              var gjline = new BMap.Polyline(
                [
                  this.ry[j].gj[this.ry[j].gj.length - 1],
                  this.ry[j].gj[this.ry[j].gj.length - 2]
                ],
                {
                  strokeColor: this.ry[j].color,
                  strokeWeight: 1,
                  strokeOpacity: 1
                }
              );
              //查找当前人员的上一个索引位置
              var preindex;
              for (var y = 0; y < this.ry[j].gjindexs.length; y++) {
                if (this.ry[j].gjindexs[y] == i)
                  preindex = this.ry[j].gjindexs[y - 1];
              }

              this.ry[j].gjline.push({
                name: preindex + "-" + i,
                path: gjline
              });
              this.map.addOverlay(gjline);
            }
          }
        }
      }

    
    },
    myReplace(str, f, e) {
      // String.prototype.myReplace = function(f, e) { //吧f替换成e
      //     var reg = new RegExp(f, "g"); //创建正则RegExp对象
      //     return this.replace(reg, e);
      // }
      var reg = new RegExp(f, "g");
      var newstr = str.replace(reg, e);
      return newstr;
    },
    
    play(){
      if(!this.isplay){
      
        if(this.isShowTrack){
          if(this.gjvalue==this.mapPoint.length-1){
            this.gjvalue=-1;//重新开始播放
          }
        }else if(this.isShowBsTrack){
          if(this.gjvalue==this.bsMainPoint.length-1){
            this.gjvalue=-1;//重新开始播放
          }
        }
      }
      this.isplay=true;
      
      this.start();
    
    },
    start(){
       var _this=this;
      
       if(this.isShowTrack){
          if(this.gjvalue==this.mapPoint.length-1){
           this.isplay=false;
           return;
          }
       }else if(this.isShowBsTrack){
          if(this.gjvalue==this.bsMainPoint.length-1){
           this.isplay=false;
           return;
          }
      }
      this.gjvalue++;
      this.gjtimer = window.setTimeout(function() {
          _this.start(); //
      }, 1000);
    },
    pause() {
      this.isplay=false;
      if (this.gjtimer) {
        window.clearTimeout(this.gjtimer);
        // cancelAnimationFrame(timer)
      }
    },

    reset() {
      if (this.gjtimer) {
        window.clearTimeout(this.gjtimer);
      }
      this.gjvalue=0;
      // this.gjindex = 0;
      // this.gjcar.setPosition(this.gjPoint[0]);
    },
    mouseMove(val, val2) {
      // if(val==0) return;
      var _this=this;
      console.log("当前拖动值：" + val2);
      console.log("当前拖动值：" + val);
      console.log("当前拖动值：" + this.gjvalue);
      //一般轨迹显示（时间轴点数和地图是相等的）
      if(this.isShowTrack){
          //默认显示当前的轨迹，为蓝色，不管是拖动最小值还是最大值，相应轨迹发生变化，轨迹图层需单独用id约束成一个图层
          //当前蓝色始终代表显示的轨迹，不管是地图上还是滑块上
          // if(val[0]==val[1]){
          //   console.log('最大最小重合');

          // }
          //获取当前滑块的区间 最小值val[0]  最大值val[1]
          //删除上一个所有轨迹线图层 ，加载当前范围的，加载当前状态的轨迹图层

          // this.gjindex=val;
          var point = this.gjPoint[val];
          // if (this.gjindex > 0) {
          //     this.map.addOverlay(new BMap.Polyline([this.gjPoint[this.gjindex - 1], point], {
          //         strokeColor: "blue",
          //         strokeWeight: 1,
          //         strokeOpacity: 1
          //     }));
          // }

          //处理点 消失 val之后的消失 
          //上一个点坐标  this.pre_val=  ，无法获取上一个滑点
          //判断当前markerClusterer 里 point 处在哪 即上一个 val 值
          // alert(val) handleAddMarker
          // var marker = new BMap.Marker(point); 
          
          // var marker = this.handleAddMarker(this.markerClusterer._mapPoint[val]); 

          // if(val>(this.markerClusterer._markers.length-1)){
          //   this.markerClusterer.addMarker(marker);
          //   marker.dispatchEvent('click');
          //     this.$emit("pathMove",{val:this.markerClusterer._mapPoint[val],num:val,type:'add'});
          // }else if(val<(this.markerClusterer._markers.length-1)){
          //   this.markerClusterer.removeMarker( this.markerClusterer._markers[this.markerClusterer._markers.length-1]);
          //   if(val>0){
          //     var m=this.handleAddMarker(this.markerClusterer._mapPoint[val-1]);
          //     m.dispatchEvent('click');

          //   }
          //    this.$emit("pathMove",{val:this.markerClusterer._mapPoint[val],num:val,type:'delete'});
          
          // }
          //当前这个点触发click 事件

          // val 之前的都要显示 ，之后的不显示 
          var lastmarker = this.handleAddMarker(this.markerClusterer._mapPoint[val]); //最后那个点
          var marker; //点击过程出现的点
          var  curpointcount=this.markerClusterer._markers.length;
          if((val+1)>curpointcount){
            for (var index = 0; index < this.markerClusterer._mapPoint.length; index++) {
                if(index>=curpointcount&&index<val+1){
                  marker= this.handleAddMarker(this.markerClusterer._mapPoint[index]) 
                  this.markerClusterer.addMarker(marker);
                  marker.dispatchEvent('click');
                }
              
            }
          
        
            this.$emit("pathMove",{val:this.markerClusterer._mapPoint[val],num:val,type:'add'});
          }else if((val+1)<curpointcount){

          
            for (var index = this.markerClusterer._mapPoint.length-1; index >=0 ; index--) {
                if(index<curpointcount&&index>=val+1){
                
                  this.markerClusterer.removeMarker( this.markerClusterer._markers[index]);
                  if(index>0){
                    var m=this.handleAddMarker(this.markerClusterer._mapPoint[index-1]);
                    m.dispatchEvent('click');
                  }

                }
              
            }
          
            this.$emit("pathMove",{val:this.markerClusterer._mapPoint[val],num:val,type:'delete'});
          
          }
          
          

        




          //处理点 定位
          // this.gjlabel.setContent("经度: " + point.lng + "<br>纬度: " + point.lat);
          // this.gjcar.setPosition(point);

          //ry中寻找那个人，然后 定位到当前点
          // this.mapPoint[val]
          // 刘      0-7     并不是这个范围 要排除索引为 6   实际  0-5 7
          // 3515    6-11    并不是这个范围 要排除索引为 7   实际  6 8-11

          // 0-val 和 start-end 比较
          // val<start 消失              hide()
          // val==start 出现             show()           定位到val  不显示线段
          // val >start  && val <end    show()           定位到val  显示 start-val的线段     显示 0-val

          // val >=end 显示  0-val        show()           定位到val   显示 start-end 线段

          // val.indeOf(indes) >-1   显示  定位

          // for (var j = 0; j < this.ry.length; j++) {
          //   //点找人 定位到这个点
          //   if (this.mapPoint[val].identifier == this.ry[j].zjhm) {
          //     if(this.ry[j].gjlabel==undefined){return;}
          //     if(this.ry[j].gjlabel.setContent==undefined){return;}
          //     this.ry[j].gjlabel.setContent(
          //       "姓名： " +
          //         this.ry[j].mc +
          //         " <br>经度： " +
          //         this.mapPoint[val].longitude +
          //         "<br>纬度： " +
          //         this.mapPoint[val].latitude +
          //         "<br>时间: " +
          //         this.mapPoint[val].eventTime
          //     );
          //     this.ry[j].gjcar.setPosition(point);
          //   }

          //   if (val < this.ry[j].start) {
          //     //让他消失
          //      if(this.ry[j].gjcar.hide==undefined){return;}
          //     this.ry[j].gjcar.hide();
          //   } else if (val == this.ry[j].start) {
          //      if(this.ry[j].gjcar.show==undefined){return;}
          //     this.ry[j].gjcar.show();
          //   } else if (val > this.ry[j].start && val < this.ry[j].end) {
          //      if(this.ry[j].gjcar.show==undefined){return;}
          //     this.ry[j].gjcar.show();
          //     //这个点如 3515的 7 没在他范围内 ，则回滚到上一个点，找到该人的上一个点 ，判断是否在 这个范围 内
          //     // val >start  && val <=end
          //     //  if(this.ry[j].gjindexs.toString().search(val)==-1){ //1 在 11 中 有bug
          //     if (this.ishave(this.ry[j].gjindexs, val) == undefined) {
          //       if (this.mapPoint[val].identifier != this.ry[j].zjhm) {
          //         var preindex = 0;
          //         for (var kk = 0; kk < this.ry[j].gjindexs.length; kk++) {
          //           if (this.ry[j].gjindexs[kk] < val) {
          //             preindex = this.ry[j].gjindexs[kk];
          //           }
          //         }

          //         //val-->preindex
          //         if (preindex >= this.ry[j].start && preindex < this.ry[j].end) {
          //           if(this.ry[j].gjlabel.setContent==undefined){return;}
          //           this.ry[j].gjlabel.setContent(
          //             "姓名： " +
          //               this.ry[j].mc +
          //               " <br>经度： " +
          //               this.mapPoint[preindex].longitude +
          //               "<br>纬度： " +
          //               this.mapPoint[preindex].latitude +
          //               "<br>时间: " +
          //               this.mapPoint[preindex].eventTime
          //           );
          //           this.ry[j].gjcar.setPosition(
          //             new BMap.Point(
          //               this.mapPoint[preindex].longitude,
          //               this.mapPoint[preindex].latitude
          //             )
          //           );
          //         }
          //       }
          //     } else {
          //       //找得到这个点比如 11滑到10 3515这个人有10
          //     }
          //   } else if (val >= this.ry[j].end) {
          //     if(this.ry[j].gjcar.show==undefined){return;}
          //     this.ry[j].gjcar.show();
          //   }
          // }

          //处理线段

          for (var j = 0; j < this.ry.length; j++) {
            // 这个值只要落到range内值 这条 线段消失 左闭右开区间  ,后面的线段也消失
            var range;
            if(this.ry[j].gjline!=undefined){
              this.ry[j].gjline.forEach(element => {
                range = element.name.split("-");
                if (parseInt(range[0]) <= val && parseInt(range[1]) > val) {
                  element.path.hide();
                } else if (parseInt(range[0]) > val) {
                  element.path.hide();
                } else {
                  element.path.show();
                }
              });
            }
            

            
          }


         

        
      }
      //伴随轨迹显示（时间轴点数和地图是不相等的，地图上多个点对应一个时刻）
      if(this.isShowBsTrack){
        //处理点 消失 val之后的消失 
        //时间轴只有主对象的点.但地图上是所有人的点，主对象点消失 从对象点也一起消失
        // val 之前的都要显示 ，之后的不显示 

        var lastmarker = this.handleAddMarker(this.markerClusterer._mapPoint[val]); //最后那个点
        this.bsMainPoint.length==val+1
        var marker; //点击过程出现的点

      
        var  curpointcount=0;//从 this.markerClusterer._markers 中找出主对象的点数
        this.markerClusterer._markers.forEach(element => {
           if(element.identifier==_this.ry[0].zjhm){
              curpointcount+=1;
           }
        });
        //4
        if((val+1)>curpointcount){
          // console.log("add")
          for (var index = 0; index < this.markerClusterer._mapPoint.length; index++) {
              if(this.markerClusterer._mapPoint[index].index>=curpointcount&&this.markerClusterer._mapPoint[index].index<val+1){
                marker= this.handleAddMarker(this.markerClusterer._mapPoint[index]) 
                this.markerClusterer.addMarker(marker);
                marker.dispatchEvent('click');
              }
            
          }
        
      
          this.$emit("pathMove",{val:this.markerClusterer._mapPoint[val],num:val,type:'add'});
        }else if((val+1)<curpointcount){

          //  console.log("dele")
          for (var index = this.markerClusterer._mapPoint.length-1; index >=0 ; index--) {
              if(this.markerClusterer._mapPoint[index].index>val){
              
                this.markerClusterer.removeMarker( this.markerClusterer._markers[index]);
                if(val==0){
                  var m=this.handleAddMarker(this.markerClusterer._mapPoint[0]);
                  m.dispatchEvent('click');
                }
                if(val>0){
                  //找到当前val上一个点，
                  for (const key in this.markerClusterer._mapPoint) {
                    if (this.markerClusterer._mapPoint[key].index==val) {
                        var m=this.handleAddMarker(this.markerClusterer._mapPoint[key]);
                        m.dispatchEvent('click');
                        break;
                    }
                  }
                  // this.markerClusterer._mapPoint.forEach((element,i) => {
                  //    if(element.index==val-1){
                  //       var m=this.handleAddMarker(this.markerClusterer._mapPoint[i]);
                  //       m.dispatchEvent('click');
                        
                  //    }
                  // });
                  
                }

              }else{
                break;
              }
            
          }
        
          this.$emit("pathMove",{val:this.markerClusterer._mapPoint[val],num:val,type:'delete'});
        
        }else{
          console.log('bug')
        }



        //处理线段
        for (var j = 0; j < this.ry.length; j++) {
          // 这个值只要落到range内值 这条 线段消失 左闭右开区间  ,后面的线段也消失
          var range;
          if(this.ry[j].gjline!=undefined){
            this.ry[j].gjline.forEach(element => {
              range = element.name.split("-");
              if (parseInt(range[0]) <= val && parseInt(range[1]) > val) {
                element.path.hide();
              } else if (parseInt(range[0]) > val) {
                element.path.hide();
              } else {
                element.path.show();
              }
            });
          }
            
        }



        //处理伴随圈
        //是否有圈
        this.bsCircle.forEach((element,i) => {
        
          if (val>=i) {
            element.show();
          } else {
            element.hide();
          }
        });
          

      }
    
      
     


    


    },

    //伴随轨迹--只画主对象的轨迹点。。。
    initBsPath(){
      var _this = this;
      this.bsMainPoint=[];
      this.mapPoint.forEach(element => {
        if(element.identifier==_this.ryinfo[0].zjhm){
          _this.bsMainPoint.push(element);
        }
      });

      if (this.mapPoint.length <= 1) {
        this.gjcontrolBtn = false;
        return;
      } else {
        this.gjcontrolBtn = true;
      }
      //地图定位到第一个轨迹点
      this.map.centerAndZoom(
        new BMap.Point(this.mapPoint[0].longitude, this.mapPoint[0].latitude),
        14
      );

       //显示时间拖到轴
      this.gjmax = this.bsMainPoint.length - 1;
      // this.gjvalue=[0, this.mapPoint.length];
      this.gjvalue = this.bsMainPoint.length;
      this.gjmarks = {};

      this.gjmarks[0] = {
        style: {
          color: "#1989FA",
          width: "80px",
          "font-size": "10px",
          "padding-left": "10px",
          "margin-top": "11px"
        },
        label: this.$createElement("strong", this.bsMainPoint[0].eventTime)
      };
      this.gjmarks[this.bsMainPoint.length - 1] = {
        style: {
          color: "#1989FA",
          width: "80px",
          "font-size": "10px",
          "margin-top": "11px"
        },
        label: this.$createElement(
          "strong",
          this.bsMainPoint[this.bsMainPoint.length - 1].eventTime ||
            this.bsMainPoint.length - 1
        )
      };

      this.ry = cloneDeep(this.ryinfo);
     

     

      //构造拖到轴相应轨迹
      ///重新构造gjpoint     //  new BMap.Point(114.00100,22.550000 ),
      _this.gjPoint = [];
      this.mapPoint.forEach(element => {
        _this.gjPoint.push(new BMap.Point(element.longitude, element.latitude));
      });
    
      //显示小车子  默认加载轨迹 ，轨迹点为
     
     
      for (var i = 0; i < this.bsMainPoint.length; i++) {
        for (var j = 0; j < this.ry.length; j++) {
           //只有主对象才有轨迹 &&this.ry[j].iskeypersonnel
          if (this.bsMainPoint[i].identifier == this.ry[j].zjhm) {
          
            if (this.ry[j].gj == undefined) {
              //没有这个属性则新增，代表此点为当前人员的第一个出现点  this.mapPoint[i]
              this.ry[j].gj = [];
              this.ry[j].gjlabel = {};
              this.ry[j].gjcar = {};
              this.ry[j].start = 0; //起始索引
              this.ry[j].end = 0; //结束索引
              this.ry[j].gjindexs=[];
              this.ry[j].gjline=[];
              this.ry[j].gjindexs.push(i);

              this.ry[j].gj.push(
                new BMap.Point(
                  this.bsMainPoint[i].longitude,
                  this.bsMainPoint[i].latitude
                )
              );
              this.ry[j].start = i; //起始索引
           
            } else {
              //不是第一个点
              this.ry[j].gjindexs.push(i);
              this.ry[j].end = i; //结束索引
              this.ry[j].gj.push(
                new BMap.Point(
                  this.bsMainPoint[i].longitude,
                  this.bsMainPoint[i].latitude
                )
              );
            
 
              
            }

            
            //显示轨迹
            if (this.ry[j].gj.length - 2 >= 0) {
              
                var gjline = new BMap.Polyline(
                  [
                    this.ry[j].gj[this.ry[j].gj.length - 1],
                    this.ry[j].gj[this.ry[j].gj.length - 2]
                  ],
                  {
                    strokeColor: this.ry[j].color,
                    strokeWeight: 1,
                    strokeOpacity: 1
                  }
                );
                //查找当前人员的上一个索引位置
                var preindex;
                for (var y = 0; y < this.ry[j].gjindexs.length; y++) {
                  if (this.ry[j].gjindexs[y] == i)
                    preindex = this.ry[j].gjindexs[y - 1];
                }

                this.ry[j].gjline.push({
                  name: preindex + "-" + i,
                  path: gjline
                });
                this.map.addOverlay(gjline);
            }else{
                // this.ry[j].gj = [];
                // this.ry[j].gjlabel = {};
                // this.ry[j].gjcar = {};
                // this.ry[j].start = 0; //起始索引
                // this.ry[j].end = 0; //结束索引
                // this.ry[j].gjindexs=[];
                //     this.ry[j].gjline=[];
            }

           

          }

        }





        
      }
    },
    initPathPoints(){
      //
    },




    //删除类型为type的maker覆盖物
    clearAtMaker(type) {
      let overlay = this.map.getOverlays();
      for (var j = 0; j < overlay.length; j++) {
        if (overlay[j].Bc) {
          if (overlay[j].Bc.className) {
            if (overlay[j].getTitle() == type) {
              this.map.removeOverlay(overlay[j]);
            }
          }
        }
      }
    },

    ishave(arr, it) {
      arr.find(item => {
        return item == it;
      });
    },

    changeMarks(item){
        let overlay = this.map.getOverlays();
        for (let n=0;n<overlay.length;n++){
            if(overlay[n].type=="circle"){
                if(overlay[n].id==item.qid){
                    overlay[n].setFillColor("#1490FF")
                    overlay[n].setFillOpacity(0.2)
                    overlay[n].setStrokeColor("#1490FF")
                    this.map.centerAndZoom(
                        new BMap.Point(overlay[n].point.lng, overlay[n].point.lat),
                        14
                    );
                }else {
                    overlay[n].setFillColor("red")
                    overlay[n].setFillOpacity(0.2)
                    overlay[n].setStrokeColor("red")
                }
            }
        }
        this.markers.map(marker=>{
            if(marker.circleId==item.qid){
                const icon = new BMap.Icon(
                    require("../../assets/image/map_hover.png"),
                    new BMap.Size(23, 35),
                    {
                        imageOffset: new BMap.Size(0, 0)
                    }
                );
                marker.setIcon(icon)
            }else {
                const icon = new BMap.Icon(
                    require("../../assets/image/map_end.png"),
                    new BMap.Size(23, 35),
                    {
                        imageOffset: new BMap.Size(0, 0)
                    }
                );
                marker.setIcon(icon)
            }
        })
    }
  },
    /* eslint-enable */
  watch: {
    list() {
      this.hotMap = this.list;
      this.handleCreateGeneral();
    },
    highlightPoint() {
      // this.highlightPoint
      // 高亮点 定位
      console.log("高亮点：");
      this.highlightPoint;

      // this.map.panTo(new BMap.Point(this.highlightPoint.longitude,this.highlightPoint.latitude));
      // this.map.centerAndZoom(new BMap.Point(this.highlightPoint.longitude,this.highlightPoint.latitude),14);
      this.showPoint1(this.highlightPoint);
    },

    mapPoint() {
      //地图显示所有点
      this.hotMap = this.list;
      this.handleCreateGeneral();
    }
    // mapPoint_diftype() {
    //     //地图显示所有点
    //     this.hotMap = this.list;
    //     this.handleCreateGeneral();
    // }
  },
  mounted() {
    this.handleInit();
  }
};
</script>
<style>
.bigscreen {
  top: 0;
  display: block;
  width: 100%;
  /*  calc(100% - 200px); */
  position: absolute;
  overflow: hidden;
  left: 0;
  bottom: 0;
  z-index: 19;
}

.smallscreen {
  width: 100%;
  left: 0;
}
</style>
<style lang="scss" module>
// @import "@/assets/scss/basic-color.scss";
:global {
  .el-button--hovers {
    &:focus {
      color: #606266 !important;
      border-color: #dcdfe6 !important;
      background: #fff !important;
    }
    &:hover {
      color: #00a8bc !important;
      border-color: #c6e2ff !important;
      background-color: #ecf5ff !important;
    }
  }
}

.position {
  position: relative;
  .control-btn {
    position: absolute;
    top: 21px;
  }
  .control-big {
    position: absolute;
    top: 21px;
    right: 20px;
    z-index: 8;
  }
  .control-gjcontrol {
    position: absolute;
    bottom: 40px;
    left: 50px;
    // left: 240px;
    z-index: 8;
    width: calc(100% - 100px);
    background: #e6f6fc;
    border: 1px solid #eee;
    padding: 8px 40px 20px;
  }
  .selectgj {
    position: absolute;
    top: 21px;
    left: 40px;
    // left: 240px;
    z-index: 4;
    // width: 300px;
  }
  .searchInput {
    position: absolute;
    top: 21px;
    left: 40px;
    // left: 240px;
    z-index: 4;
    // width: 300px;
  }
  .datesj {
    position: absolute;
    top: 21px;
    left: 200px;
    // left: 240px;
    z-index: 4;
    // width: 300px;
  }
  // el-slider__marks-text
  #maphk >>> .el-slider__marks-text {
    width: 80px;
  }
}

.baidu-map {
  width: 100%;
  // height: 600px;
  height: 100%;
  overflow: hidden;
  margin: 0;
  position: absolute;
}
#maphk >>> .el-slider__stop {
  background-color: #323738;
}
</style>
