import vueEcharts from "views/vue-echarts";
export default {
  path: "/vue-echarts",
  name: "VueEcharts",
  title: "VueEcharts",
  icon: "el-icon-setting",
  component: vueEcharts,
  children: [
    {
      path: "histogram",
      name: "vue-histogram",
      title: "histogram",
      component: () => import("views/vue-echarts/case/histogram")
    },
    {
      path: "polyline",
      name: "vue-polyline",
      title: "polyline",
      component: () => import("views/vue-echarts/case/polyLine")
    }
  ]
};
