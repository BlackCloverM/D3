export default [
  {
    path: "/",
    redirect: "/echarts/histogram"
  },
  {
    path: "histogram",
    component: () => import("views/echarts/case/histogram")
  },
  {
    path: "pie",
    component: () => import("views/echarts/case/pie")
  },
  {
    path: "calendar",
    component: () => import("views/echarts/case/calendar")
  },
  {
    path: "polyline",
    component: () => import("views/echarts/case/polyLine")
  }
];
