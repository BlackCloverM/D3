import D3 from "views/d3";
export default {
  path: "/d3",
  name: "D3",
  title: "D3",
  redirect: "/d3/lineChart",
  icon: "el-icon-menu",
  component: D3,
  children: [
    {
      path: "lineChart",
      name: "d3-lineChart",
      title: "lineChart",
      component: () => import("views/d3/case/lineChart")
    },
    {
      path: "histogram",
      name: "d3-histogram",
      title: "histogram",
      component: () => import("views/d3/case/histogram/")
    },
    {
      path: "pieChart",
      name: "d3-pieChart",
      title: "pieChart",
      component: () => import("views/d3/case/pieChart/")
    },
    {
      path: "forceMap",
      name: "d3-forceMap",
      title: "forceMap",
      component: () => import("views/d3/case/forceMap/")
    },
    {
      path: "tree",
      name: "d3-tree",
      title: "tree",
      component: () => import("views/d3/case/tree/")
    },
    {
      path: "china",
      name: "d3-china",
      title: "china",
      component: () => import("views/d3/case/mapOfChina/")
    },
    {
      path: "areaChart",
      name: "d3-areaChart",
      title: "areaChart",
      redirect: "areaChart/demo01",
      component: () => import("views/d3/case/areaChart/"),
      children: [
        {
          path: "demo01",
          name: "d3-demo01",
          title: "demo01",
          component: () => import("views/d3/case/areaChart/demo01")
        },
        {
          path: "demo02",
          name: "d3-demo02",
          title: "demo02",
          component: () => import("views/d3/case/areaChart/demo02")
        }
      ]
    }
  ]
};
