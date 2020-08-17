import vueEcharts from "views/vue-echarts";
export default {
  path: "/vue-echarts",
  name: "VueEcharts",
  icon: "el-icon-setting",
  component: vueEcharts,
  children: [
    {
      path: "histogram",
      name: "histogram",
      component: () => import("views/vue-echarts/case/histogram")
    },
    {
      path: "polyline",
      name: "polyline",
      component: () => import("views/vue-echarts/case/polyLine")
    }
  ]
};
