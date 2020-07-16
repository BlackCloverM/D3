export default [
  {
    path: "/",
    redirect: "/d3/lineChart"
  },
  {
    path: "lineChart",
    component: () => import("views/d3/case/lineChart")
  },
  {
    path: "histogram",
    component: () => import("views/d3/case/histogram/")
  },
  {
    path: "pieChart",
    component: () => import("views/d3/case/pieChart/")
  },
  {
    path: "forceMap",
    component: () => import("views/d3/case/forceMap/")
  },
  {
    path: "tree",
    component: () => import("views/d3/case/tree/")
  },
  {
    path: "china",
    component: () => import("views/d3/case/mapOfChina/")
  },
  {
    path: "areaChart",
    component: () => import("views/d3/case/areaChart/"),
    children: [
      {
        path: "",
        redirect: "demo01"
      },
      {
        path: "demo01",
        component: () => import("views/d3/case/areaChart/demo01")
      },
      {
        path: "demo02",
        component: () => import("views/d3/case/areaChart/demo02")
      }
    ]
  },
  {
    path: "relation",
    component: () => import("views/d3/case/relation/")
  },
  {
    path: "relation2",
    component: () => import("views/d3/case/relation/relation2")
  }
];
