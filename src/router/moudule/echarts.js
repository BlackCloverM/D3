import Echarts from "views/echarts";
export default {
  path: "/echarts",
  name: "Echarts",
  icon: "el-icon-s-promotion",
  component: Echarts,
  children: [
    {
      path: "histogram",
      name: "histogram",
      component: () => import("views/echarts/case/histogram")
    },
    {
      path: "pie",
      name: "pie",
      component: () => import("views/echarts/case/pie")
    },
    {
      path: "calendar",
      name: "calendar",
      component: () => import("views/echarts/case/calendar")
    },
    {
      path: "polyline",
      name: "polyline",
      component: () => import("views/echarts/case/polyLine")
    }
  ]
};
