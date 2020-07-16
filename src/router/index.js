import Vue from "vue";
import VueRouter from "vue-router";
import Demo from "views/";
import D3 from "views/d3";
import d3Children from "./moudule/d3";
import Echarts from "views/echarts";
import echartChildren from "./moudule/echarts";
import vueEcharts from "views/vue-echarts";
import vueEchartChildren from "./moudule/vue-echarts";
import G2 from "views/g2";
import g2children from "./moudule/g2";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: Demo
  },
  {
    path: "/d3",
    component: D3,
    children: d3Children
  },
  {
    path: "/g2",
    component: G2,
    children: g2children
  },
  {
    path: "/echarts",
    component: Echarts,
    children: echartChildren
  },
  {
    path: "/vue-echarts",
    component: vueEcharts,
    children: vueEchartChildren
  }
];

const router = new VueRouter({
  routes
});

router.beforeEach((to, from, next) => {
  NProgress.start();
  next();
});

router.afterEach(() => {
  NProgress.done();
});

export default router;
