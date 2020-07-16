export default [
  {
    path: "/",
    redirect: "/vue-echarts/histogram"
  },
  {
    path: "histogram",
    component: () => import("views/vue-echarts/case/histogram")
  },
  {
    path: "polyline",
    component: () => import("views/vue-echarts/case/polyLine")
  }
];
