import G2 from "views/g2";
export default {
  path: "/g2",
  name: "G2",
  title: "G2",
  icon: "el-icon-document",
  component: G2,
  children: [
    {
      path: "histogram",
      name: "g2-histogram",
      title: "histogram",
      redirect: "histogram/demo01",
      component: () => import("views/g2/case/histogram"),
      children: [
        {
          path: "demo01",
          name: "g2-hist-demo01",
          title: "demo01",
          component: () => import("views/g2/case/histogram/demo01")
        },
        {
          path: "demo02",
          name: "g2-hist-demo02",
          title: "sameX",
          component: () => import("views/g2/case/histogram/sameX")
        }
      ]
    }
  ]
};
