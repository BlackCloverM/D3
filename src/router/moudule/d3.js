import D3 from "views/d3";
export default {
  path: "/d3",
  name: "D3",
  redirect: "/d3/lineChart",
  icon: "el-icon-menu",
  component: D3,
  children: [
    {
      path: "lineChart",
      name: "lineChart",
      component: () => import("views/d3/case/lineChart")
    },
    {
      path: "histogram",
      name: "histogram",
      component: () => import("views/d3/case/histogram/")
    },
    {
      path: "pieChart",
      name: "pieChart",
      component: () => import("views/d3/case/pieChart/")
    },
    {
      path: "forceMap",
      name: "forceMap",
      component: () => import("views/d3/case/forceMap/")
    },
    {
      path: "tree",
      name: "tree",
      component: () => import("views/d3/case/tree/")
    },
    {
      path: "china",
      name: "china",
      component: () => import("views/d3/case/mapOfChina/")
    },
    {
      path: "areaChart",
      name: "areaChart",
      component: () => import("views/d3/case/areaChart/"),
      children: [
        {
          path: "demo01",
          name: "demo01",
          component: () => import("views/d3/case/areaChart/demo01")
        },
        {
          path: "demo02",
          name: "demo02",
          component: () => import("views/d3/case/areaChart/demo02")
        }
      ]
    }
  ]
};
