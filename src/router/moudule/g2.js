export default [
  {
    path: "/",
    redirect: "/g2/histogram"
  },
  {
    path: "histogram",
    name: "g2Histogram",
    component: () => import("views/g2/case/histogram")
  }
];
