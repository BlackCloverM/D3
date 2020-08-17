import G2 from "views/g2";
export default {
  path: "/g2",
  name: "G2",
  icon: "el-icon-document",
  component: G2,
  children: [
    {
      path: "histogram",
      name: "g2Histogram",
      component: () => import("views/g2/case/histogram")
    }
  ]
};
