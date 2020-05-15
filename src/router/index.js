import Vue from "vue";
import VueRouter from "vue-router";
import LineChart from "../views/lineChart";
import Histogram from "../views/histogram";
import ColumnHistogram from "../views/epidemic/columnHistogram.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/lineChart",
    name: "lineChart",
    component: LineChart
  },
  {
    path: "/Histogram",
    name: "histogram",
    component: Histogram
  },
  {
    path: "/epidemic/column",
    name: "epiColumn",
    component: ColumnHistogram
  }
];

const router = new VueRouter({
  routes
});

export default router;
