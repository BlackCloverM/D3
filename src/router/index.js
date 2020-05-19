import Vue from "vue";
import VueRouter from "vue-router";
import LineChart from "../views/case/lineChart";
import Demo from "../views/";
import Histogram from "../views/case/histogram/";
import PieChart from "../views/case/pieChart/";

Vue.use(VueRouter);

const routes = [
  {
    path: "/lineChart",
    name: "lineChart",
    component: LineChart
  },
  {
    path: "/demo",
    name: "demo",
    component: Demo
  },
  {
    path: "/histogram",
    name: "histogram",
    component: Histogram
  },
  {
    path: "/pieChart",
    name: "pieChart",
    component: PieChart
  }
];

const router = new VueRouter({
  routes
});

export default router;
