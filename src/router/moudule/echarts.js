import Echarts from "views/echarts";
export default {
  path: "/echarts",
  name: "Echarts",
  title: "Echarts",
  icon: "el-icon-s-promotion",
  component: Echarts,
  children: [
    {
      path: "histogram",
      name: "echarts-histogram",
      title: "histogram",
      component: () => import("views/echarts/case/histogram")
    },
    {
      path: "pie",
      name: "echarts-pie",
      title: "pie",
      component: () => import("views/echarts/case/pie")
    },
    {
      path: "calendar",
      name: "echarts-calendar",
      title: "calendar",
      component: () => import("views/echarts/case/calendar")
    },
    {
      path: "polyline",
      name: "echarts-polyline",
      title: "polyline",
      component: () => import("views/echarts/case/polyLine")
    }
  ]
};
